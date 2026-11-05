import type {
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';
import type {
  PartOf,
  PartProps,
  PartsPropsProp,
  PrimaryPartProps,
} from '../../_internal/_parts';
import type { UseRadioProps } from '../useRadio';

/**
 * `withRadio` に組み込む `<label>` の部品が受け取る props
 *
 * `className`・`style`・`partsProps.label` と、`<input>` と文字（`children`）。受け取った props は `<label>` に渡す。
 */
export type RadioLabelSlotProps = ComponentPropsWithRef<'label'>;

/**
 * `withRadio` に組み込む `<input>` の部品が受け取る props
 *
 * 部品が付ける `type`・`name`・`checked`・`onChange` などと、利用者の props（`ref` を含む）。受け取った props は `<input>` に渡す。
 */
export type RadioInputSlotProps = ComponentPropsWithRef<'input'>;

/**
 * `withRadio` に組み込む部品
 *
 * どれも省略でき、省略すると素の要素で描く。組み込んだ部品の props は、作ったコンポーネントの
 * トップレベル（主要素の `Input`）と `partsProps.label`・`partsProps.input` の型になる。
 */
export type RadioParts = {
  /**
   * `<input>` と文字を包む `<label>`（ルート）
   */
  Label?: ElementType;

  /**
   * `<input type="radio">`（主要素）
   */
  Input?: ElementType;
};

/**
 * 部品の名前と、部品に渡す props の対応
 */
export type RadioSlots = {
  Label: RadioLabelSlotProps;
  Input: RadioInputSlotProps;
};

/**
 * 部品が決める `<input>` のプロパティ（利用者は渡せない）
 */
type ControlledInputKeys =
  | 'type'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'checked'
  | 'defaultChecked'
  | 'disabled'
  | 'readOnly'
  | 'required'
  | 'children';

type OwnProps = UseRadioProps & {
  /**
   * `<input>` の後ろに置く文字
   */
  children?: ReactNode;
};

/**
 * `partsProps` で部品に渡す props
 *
 * @template P 組み込んだ部品
 */
export type RadioPartsProps<P = object> = {
  /**
   * `<label>`（ルート）の部品に渡す props
   */
  label: PartProps<PartOf<P, 'Label', 'label'>, 'children'>;

  /**
   * `<input>`（主要素）の部品に渡す props。トップレベルの props と同じ要素に渡すので、部品に必須のプロパティがあってもトップレベルで渡せば省略できる
   */
  input: Partial<PartProps<PartOf<P, 'Input', 'input'>, ControlledInputKeys>>;
};

/**
 * `withRadio` で作ったコンポーネント（`Radio`）のプロパティ
 *
 * 主要素は `<input>`。`className`・`style` は `<label>` に、それ以外の props（`ref` を含む）は `<input>` に渡すので、
 * トップレベルの残りの props は `<input>` の部品の props になる。
 * ラジオボタンは単独では使わず、グループ（`withRadioGroup`）に組み込むので、制御だけを受け付ける。
 *
 * @template P 組み込んだ部品
 */
export type RadioProps<P extends RadioParts = object> = OwnProps &
  PartsPropsProp<RadioPartsProps<P>> & {
    /**
     * `<label>` に付けるクラス
     */
    className?: string;

    /**
     * `<label>` に付けるスタイル
     */
    style?: CSSProperties;
  } & PrimaryPartProps<
    PartOf<P, 'Input', 'input'>,
    keyof OwnProps | ControlledInputKeys | 'className' | 'style'
  >;
