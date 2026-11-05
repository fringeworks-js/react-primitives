import { mergePartProps } from '@fringeworks/react-parts-props';
import { useCombinedRefs } from '@fringeworks/react-utils';
import type { ChangeEventHandler, CSSProperties, Ref } from 'react';

type LooseElementProps = Record<string, unknown>;

/**
 * `<label>` で `<input>` を包む部品（Checkbox・Radio・Switch）が受け取る、部品の型を広げた props
 */
export type LooseLabeledInputProps = LooseElementProps & {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLInputElement>;
  partsProps?: {
    label?: LooseElementProps;
    input?: LooseElementProps & { ref?: Ref<HTMLInputElement> };
  };
};

/**
 * hook が作る、`<input>` に渡す props（`ref` を含めてよい）
 */
type ControlInputProps = LooseElementProps & {
  ref?: Ref<HTMLInputElement>;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

/**
 * `<label>` で `<input>` を包む部品の、`<label>`・`<input>` に渡す props を作る
 *
 * 主要素は `<input>`。`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡す。
 * `partsProps.label`・`partsProps.input` は、同じプロパティならトップレベルで受け取ったものより優先する。
 * 利用者の `onChange`（トップレベルと `partsProps.input`）は、hook の `getInputProps` に渡して先に呼んでもらう。
 *
 * @param props 部品が受け取った props から、部品自身が使うものを除いたもの
 * @param getInputProps hook の `getInputProps`
 * @returns `<label>`・`<input>` に渡す props
 */
export default function useLabeledInputProps(
  { className, style, ref, partsProps, ...rest }: LooseLabeledInputProps,
  getInputProps: (handlers: {
    onChange?: ChangeEventHandler<HTMLInputElement>;
  }) => ControlInputProps,
): { labelProps: LooseElementProps; inputProps: LooseElementProps } {
  // ref を mergePartProps に渡すと、レンダリング中に ref を読むものとして lint に指摘されるので、先に合成する
  const { ref: inputPartRef, ...inputPartProps } = partsProps?.input ?? {};
  const { onChange, ...userInputProps } = mergePartProps<
    LooseElementProps & { onChange?: ChangeEventHandler<HTMLInputElement> }
  >(rest, inputPartProps);
  const { ref: controlRef, ...controlProps } = getInputProps({ onChange });
  const combinedRef = useCombinedRefs(controlRef, ref, inputPartRef);

  return {
    labelProps: mergePartProps<LooseElementProps>(
      { className, style },
      partsProps?.label,
    ),
    // ARIA の属性などは利用者の指定を優先し、onChange は hook のもの（利用者のものを先に呼ぶ）にする
    inputProps: {
      ...controlProps,
      ...userInputProps,
      ref: combinedRef,
      onChange: controlProps.onChange,
    },
  };
}
