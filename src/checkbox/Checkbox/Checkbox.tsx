import { mergePartProps } from '@fringeworks/react-parts-props';
import {
  useCombinedRefs,
  useControllableState,
} from '@fringeworks/react-utils';
import { useLayoutEffect, useRef, type ComponentPropsWithRef } from 'react';
import type { CheckboxProps } from './types';

/**
 * 値と操作の契約（`value`・`defaultValue`・`onValueChange`）に沿ったチェックボックス
 *
 * `<label>` の中に `<input type="checkbox">` と `children` を置く。
 * その他の props は `<label>` に渡し、`<input>` には `partsProps.input` で渡す。
 */
export default function Checkbox({
  value,
  defaultValue,
  onValueChange,
  disabled,
  readOnly,
  required,
  invalid,
  indeterminate,
  children,
  partsProps,
  ...rest
}: CheckboxProps) {
  const [checked, setChecked] = useControllableState({
    value,
    defaultValue: defaultValue ?? false,
    onValueChange,
  });

  // indeterminate は HTML の属性が無く、DOM のプロパティでだけ設定できる
  const inputRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  // ref を mergePartProps に渡すと、レンダリング中に ref を読むものとして lint に指摘されるので、先に合成する
  const { ref: inputPartRef, ...inputPartProps } = partsProps?.input ?? {};
  const combinedInputRef = useCombinedRefs(inputRef, inputPartRef);

  return (
    <label {...rest}>
      <input
        {...mergePartProps<ComponentPropsWithRef<'input'>>(
          {
            ref: combinedInputRef,
            type: 'checkbox',
            checked,
            disabled,
            required,
            'aria-readonly': readOnly || undefined,
            'aria-invalid': invalid || undefined,
            onChange: (event) => {
              if (!readOnly) {
                setChecked(event.currentTarget.checked);
              }
            },
          },
          inputPartProps,
        )}
      />
      {children}
    </label>
  );
}
