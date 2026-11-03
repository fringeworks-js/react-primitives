import type {
  DisabledProps,
  MainActionProps,
} from '@fringeworks/react-contract';
import type { ComponentPropsWithRef } from 'react';

/**
 * `Button` のプロパティ
 *
 * @template V `value` の型。`value` を省略すると `undefined`
 */
export type ButtonProps<V = undefined> = Omit<
  ComponentPropsWithRef<'button'>,
  'value'
> &
  DisabledProps &
  MainActionProps<V> & {
    /**
     * 押したときに `onMainAction` に渡す値。HTML の `<button>` の `value` には渡さない
     */
    value?: V;
  };
