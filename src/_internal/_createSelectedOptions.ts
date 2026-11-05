import {
  createDisplayOptions,
  type DisplayOption,
  type Option,
  type UnlistedPlacement,
} from '@fringeworks/react-contract';
import includesValue from './_includesValue';

/**
 * 選んだ値の表示する選択肢を、入力の部品で表示する順に並べて作る
 *
 * 入力の部品（CheckboxGroup・RadioGroup）と同じく `createDisplayOptions` で表示する選択肢を作るので、
 * 選択肢外の値の位置と、`'hidden'` のときに出さないことが、入力の部品とそろう。
 */
export default function createSelectedOptions<V>(
  options: readonly Option<V>[],
  value: readonly V[],
  placement: UnlistedPlacement = 'end',
): DisplayOption<V>[] {
  const listed = options.map((option) => option.value);
  const unlisted = value.filter((v) => !includesValue(listed, v));
  return createDisplayOptions(options, unlisted, placement).filter((option) =>
    includesValue(value, option.value),
  );
}
