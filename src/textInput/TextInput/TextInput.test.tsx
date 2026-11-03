import { fireEvent, render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import TextInput from './TextInput';

const getInput = () => screen.getByRole<HTMLInputElement>('textbox');

const type = (text: string) => {
  fireEvent.change(getInput(), { target: { value: text } });
};

describe('TextInput', () => {
  describe('確定', () => {
    it('入力中は通知せず、フォーカスが外れたときに確定して通知する', () => {
      const onValueChange = vi.fn();
      render(<TextInput onValueChange={onValueChange} />);

      type('あい');

      expect(getInput().value).toBe('あい');
      expect(onValueChange).not.toHaveBeenCalled();

      fireEvent.blur(getInput());

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('あい');
    });

    it('Enter で確定する。IME の変換中の Enter では確定しない', () => {
      const onValueChange = vi.fn();
      render(<TextInput onValueChange={onValueChange} />);

      type('かんじ');
      fireEvent.keyDown(getInput(), { key: 'Enter', isComposing: true });
      fireEvent.keyDown(getInput(), { key: 'Enter', keyCode: 229 });

      expect(onValueChange).not.toHaveBeenCalled();

      fireEvent.keyDown(getInput(), { key: 'Enter' });

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('かんじ');
    });

    it('変わっていなければ通知しない', () => {
      const onValueChange = vi.fn();
      render(<TextInput defaultValue="a" onValueChange={onValueChange} />);

      fireEvent.blur(getInput());
      fireEvent.keyDown(getInput(), { key: 'Enter' });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("valueChangeTiming が 'input' なら入力のたびに通知する", () => {
      const onValueChange = vi.fn();
      render(
        <TextInput valueChangeTiming="input" onValueChange={onValueChange} />,
      );

      type('a');
      type('ab');

      expect(onValueChange.mock.calls).toEqual([['a'], ['ab']]);
    });

    it('入力のたびに onInputValueChange を呼ぶ', () => {
      const onInputValueChange = vi.fn();
      render(<TextInput onInputValueChange={onInputValueChange} />);

      type('a');
      type('ab');

      expect(onInputValueChange.mock.calls).toEqual([['a'], ['ab']]);
    });
  });

  describe('Esc', () => {
    it('下書きを確定した値に戻し、onInputValueChange で知らせる', () => {
      const onValueChange = vi.fn();
      const onInputValueChange = vi.fn();
      render(
        <TextInput
          defaultValue="元"
          onValueChange={onValueChange}
          onInputValueChange={onInputValueChange}
        />,
      );

      type('書きかけ');
      fireEvent.keyDown(getInput(), { key: 'Escape' });

      expect(getInput().value).toBe('元');
      expect(onInputValueChange).toHaveBeenLastCalledWith('元');

      fireEvent.blur(getInput());

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('制御', () => {
    it('入力中に親が value を変えたら、下書きを置き換える', () => {
      const { rerender } = render(<TextInput value="a" />);

      type('書きかけ');
      rerender(<TextInput value="b" />);

      expect(getInput().value).toBe('b');
    });

    it('確定した文字列を親が受け入れなければ、親の値に戻す', () => {
      const onValueChange = vi.fn();
      render(<TextInput value="固定" onValueChange={onValueChange} />);

      type('変えたい');
      fireEvent.blur(getInput());

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('変えたい');
      expect(getInput().value).toBe('固定');
    });

    it('useState とつなぐと、確定した文字列が値になる', () => {
      function App() {
        const [value, setValue] = useState('');
        return (
          <>
            <TextInput value={value} onValueChange={setValue} />
            <output>{value}</output>
          </>
        );
      }
      render(<App />);

      type('こんにちは');

      expect(screen.getByRole('status').textContent).toBe('');

      fireEvent.keyDown(getInput(), { key: 'Enter' });

      expect(screen.getByRole('status').textContent).toBe('こんにちは');
      expect(getInput().value).toBe('こんにちは');
    });
  });

  describe('利用者のハンドラー', () => {
    it('onKeyDown を先に呼び、preventDefault されたら Enter で確定しない', () => {
      const onValueChange = vi.fn();
      render(
        <TextInput
          onValueChange={onValueChange}
          onKeyDown={(event) => event.preventDefault()}
        />,
      );

      type('a');
      fireEvent.keyDown(getInput(), { key: 'Enter' });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('onChange・onBlur も呼ぶ', () => {
      const onChange = vi.fn();
      const onBlur = vi.fn();
      render(<TextInput onChange={onChange} onBlur={onBlur} />);

      type('a');
      fireEvent.blur(getInput());

      expect(onChange).toHaveBeenCalledOnce();
      expect(onBlur).toHaveBeenCalledOnce();
    });
  });

  describe('要素', () => {
    it("type の既定は 'text'。設定は HTML の属性と aria-invalid に付ける", () => {
      render(<TextInput disabled readOnly required invalid />);

      const input = getInput();
      expect(input.type).toBe('text');
      expect(input.disabled).toBe(true);
      expect(input.readOnly).toBe(true);
      expect(input.required).toBe(true);
      expect(input.getAttribute('aria-invalid')).toBe('true');
    });

    it('その他の props と ref は input に渡す', () => {
      const ref = createRef<HTMLInputElement>();
      render(
        <TextInput
          ref={ref}
          type="search"
          placeholder="検索"
          className="mine"
        />,
      );

      const input = screen.getByRole<HTMLInputElement>('searchbox');
      expect(input.placeholder).toBe('検索');
      expect(input.className).toBe('mine');
      expect(ref.current).toBe(input);
    });
  });
});
