import { mergePartProps } from '@fringeworks/react-parts-props';
import type { ComponentPropsWithRef } from 'react';
import type { RadioProps } from './types';

/**
 * ラジオボタン（グループに組み込む最低限の部品）
 *
 * `<label>` の中に `<input type="radio">` と `children` を置く。
 * その他の props は `<label>` に渡し、`<input>` には `partsProps.input` で渡す。
 * `readOnly`・`invalid` の ARIA の属性は、ラジオボタンには付けられないので、グループの入れ物に付ける（`useRadioGroup`）。
 */
export default function Radio({
  value,
  onValueChange,
  name,
  disabled,
  readOnly,
  required,
  invalid: _invalid,
  children,
  partsProps,
  ...rest
}: RadioProps) {
  return (
    <label {...rest}>
      <input
        {...mergePartProps<ComponentPropsWithRef<'input'>>(
          {
            type: 'radio',
            name,
            checked: value,
            disabled,
            required,
            onChange: () => {
              if (!readOnly) {
                onValueChange?.(true);
              }
            },
          },
          partsProps?.input,
        )}
      />
      {children}
    </label>
  );
}
