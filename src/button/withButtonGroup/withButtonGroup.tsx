import { mergePartProps } from '@fringeworks/react-parts-props';
import { getComponentName } from '@fringeworks/react-utils';
import type { ReactElement } from 'react';
import toKey from '../../_internal/_toKey';
import useButtonGroup from '../useButtonGroup';
import type { ButtonGroupParts, ButtonGroupProps } from './types';

/**
 * 組み込んだボタンで描く、ボタングループを作る HOC
 *
 * `<div role="group">` の中に、選択肢のボタンを並べる。その他の props は `<div>` に渡す。
 *
 * @param parts 組み込む部品
 * @returns ボタングループのコンポーネント
 */
export default function withButtonGroup({ Button }: ButtonGroupParts) {
  function ButtonGroup<V>({
    options,
    onMainAction,
    disabled,
    ...rest
  }: ButtonGroupProps<V>): ReactElement {
    const { displayOptions, getButtonProps, getContainerProps } =
      useButtonGroup({ options, onMainAction, disabled });

    return (
      <div {...mergePartProps(getContainerProps(), rest)}>
        {displayOptions.map((option, index) => (
          <Button
            key={toKey(option.value, index)}
            {...getButtonProps(option)}
          />
        ))}
      </div>
    );
  }

  ButtonGroup.displayName = `withButtonGroup(${getComponentName(Button)})`;

  return ButtonGroup;
}
