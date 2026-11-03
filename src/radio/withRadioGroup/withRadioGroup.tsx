import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ReactElement } from 'react';
import toKey from '../../_internal/_toKey';
import useRadioGroup from '../useRadioGroup';
import type { RadioGroupParts, RadioGroupProps } from './types';

/**
 * 組み込んだラジオボタンで描く、ラジオグループを作る HOC
 *
 * `<div role="radiogroup">` の中に、選択肢のラジオボタンを並べる。その他の props は `<div>` に渡す。
 *
 * @param parts 組み込む部品
 * @returns ラジオグループのコンポーネント
 */
export default function withRadioGroup({ Radio }: RadioGroupParts) {
  function RadioGroup<V>({
    options,
    value,
    defaultValue,
    onValueChange,
    disabled,
    readOnly,
    required,
    invalid,
    unlistedPlacement,
    keepUnlisted,
    ...rest
  }: RadioGroupProps<V>): ReactElement {
    const { displayOptions, getRadioProps, getContainerProps } = useRadioGroup({
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      readOnly,
      required,
      invalid,
      unlistedPlacement,
      keepUnlisted,
    });

    return (
      <div {...mergePartProps(getContainerProps(), rest)}>
        {displayOptions.map((option, index) => (
          <Radio key={toKey(option.value, index)} {...getRadioProps(option)} />
        ))}
      </div>
    );
  }

  RadioGroup.displayName = `withRadioGroup(${getComponentName(Radio)})`;

  return RadioGroup;
}
