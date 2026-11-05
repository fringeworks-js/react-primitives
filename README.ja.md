# @fringeworks/react-primitives

`@fringeworks/react-primitives` は、コンポーネントを作るための細かい React の部品を集めた、誰かにとっては便利なライブラリです。

**[English README is available here](./README.md)**

## インストール

```bash
npm install @fringeworks/react-primitives
# または
pnpm add @fringeworks/react-primitives
```

React 18 と 19 に対応しています。

## 使い方

部品・hook・HOC・型は、ルート・分類・機能単位のどのパスからでも同じ名前で import できます。

```ts
import { Checkbox, withCheckboxGroup } from '@fringeworks/react-primitives';
import {
  Checkbox,
  withCheckboxGroup,
} from '@fringeworks/react-primitives/checkbox';
import { withCheckboxGroup } from '@fringeworks/react-primitives/checkbox/withCheckboxGroup';
```

機能単位のパスでは、主となるものを default import することもできます。

```ts
import withCheckboxGroup from '@fringeworks/react-primitives/checkbox/withCheckboxGroup';
```

分類は部品の系統で、部品と、それを並べたグループ（`Checkbox` と `useCheckboxGroup`・`withCheckboxGroup` など）は同じ分類に入ります。

部品を作るための材料として、ヘッドレス UI の hook、部品を組み込む HOC、最低限のコンポーネントを提供します。

- 見た目（スタイル）は持たず、CSS のクラスも付けません。クラスは、利用者が `className`（`partsProps` を含む）で渡します。
- プロパティは値と操作の契約（`value`・`defaultValue`・`onValueChange`、`disabled`・`readOnly`・`required`・`invalid`、`options`、`open`・`defaultOpen`・`onOpenChange`、`onMainAction`・`onInputValueChange` など）に沿います。
- 制御・非制御の扱いは `@fringeworks/react-utils` の `useControllableState` に従います。`value` が `undefined` 以外なら制御です。

## API

### checkbox

| 名前                       | 説明                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| `Checkbox`                 | 値と操作の契約に沿ったチェックボックス                           |
| `withCheckbox(parts)`      | 組み込んだ部品で描く、チェックボックスを作る                     |
| `useCheckbox(props)`       | チェックボックスの振る舞いを扱う（ヘッドレス UI）                |
| `useCheckboxGroup(props)`  | チェックボックスグループの振る舞いを扱う（ヘッドレス UI）        |
| `withCheckboxGroup(parts)` | 組み込んだチェックボックスで描く、チェックボックスグループを作る |

#### `Checkbox`

```tsx
<Checkbox value={checked} onValueChange={setChecked}>
  りんご
</Checkbox>
```

`<label>` の中に `<input type="checkbox">` と `children` を置きます。

| プロパティ       | 型                         | 説明                                                                         |
| ---------------- | -------------------------- | ---------------------------------------------------------------------------- |
| `value?`         | `boolean`                  | チェックしているか（制御）                                                   |
| `defaultValue?`  | `boolean`                  | チェックしているかの初期値（非制御）。省略すると `false`                     |
| `onValueChange?` | `(value: boolean) => void` | チェックを切り替えたときに呼ぶ関数                                           |
| `disabled?`      | `boolean`                  | 操作できなくする                                                             |
| `readOnly?`      | `boolean`                  | 表示はそのままで、チェックを切り替えられなくする（`aria-readonly` を付ける） |
| `required?`      | `boolean`                  | 必須にする                                                                   |
| `invalid?`       | `boolean`                  | 値が正しくないことを示す（`aria-invalid` を付ける）                          |
| `indeterminate?` | `boolean`                  | 不確定の表示にする。`value` は変えない                                       |
| `children?`      | `ReactNode`                | チェックボックスの横に表示する内容                                           |
| `partsProps?`    | `{ label?; input? }`       | `<label>`・`<input>` に名指しで渡すプロパティ                                |

- 主要素は `<input>` です。`className`・`style` は `<label>` に、それ以外のプロパティ（`ref`・`id`・`name`・`aria-*`・`data-*`・イベントハンドラーなど）は `<input>` に渡します。`aria-labelledby`・`aria-describedby` などで、外の要素と結び付けられます。
- `<label>` の `ref` や属性は `partsProps.label` で渡します。`partsProps.label`・`partsProps.input` で渡したものは、同じプロパティならトップレベルで渡したものより優先します（`className`・`style`・イベントハンドラー・`ref` は合成します）。
- `onChange` は部品の処理の前に呼び、そこで `event.preventDefault()` するとチェックを切り替えません。
- `Checkbox` が自分で設定する属性（`type`・`checked`・`disabled`・`readOnly`・`required` など）は、`<input>` に渡せません。
- `indeterminate` は HTML の属性が無いため、DOM のプロパティに設定します。

#### `withCheckbox`

```ts
withCheckbox<P extends CheckboxParts>(parts?: P): (props: CheckboxProps<P>) => ReactElement
```

組み込んだ部品で描く、チェックボックスを作ります。`Checkbox` は、部品を省略して作ったものです。

| 部品     | 型            | 説明                                                                                                                  |
| -------- | ------------- | --------------------------------------------------------------------------------------------------------------------- |
| `Label?` | `ElementType` | `<input>` と文字を包む `<label>`（ルート）。受け取った props（`children` など）を要素に渡す                           |
| `Input?` | `ElementType` | `<input type="checkbox">`（主要素）。受け取った props（`type`・`checked`・`onChange`・`ref` など）を `<input>` に渡す |

- 作ったコンポーネントは、`Checkbox` と同じプロパティを受け取ります。
- 組み込んだ部品の props が、作ったコンポーネントの型になります。主要素は `<input>` なので、トップレベルの残りのプロパティは `Input` の props、`partsProps.label` は `Label` の props、`partsProps.input` は `Input` の props です（`Input` に必須のプロパティは、トップレベルで渡します）。`Label` に必須のプロパティがあれば、`partsProps` も必須になります。
- `Input` は `ref` を `<input>` に渡す必要があります（`indeterminate` を DOM に設定するため）。

#### `useCheckbox`

```ts
useCheckbox(props: UseCheckboxProps): UseCheckboxResult
```

チェックボックスの振る舞いを扱います。プロパティは `Checkbox` の `value`・`defaultValue`・`onValueChange`・`disabled`・`readOnly`・`required`・`invalid`・`indeterminate` と同じです。

```tsx
const checkbox = useCheckbox({ value, onValueChange: setValue });

<label>
  <input {...checkbox.getInputProps()} />
  りんご
</label>;
```

| 戻り値          | 型                                  | 説明                                                                                                                                                          |
| --------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `boolean`                           | チェックしているか                                                                                                                                            |
| `getInputProps` | `(handlers?) => CheckboxInputProps` | `<input>` に渡す props（`type`・`checked`・`disabled`・`required`・`aria-readonly`・`aria-invalid`・`ref`・`onChange`）を作る。利用者の `onChange` を先に呼ぶ |

- `ref` は `indeterminate` を DOM に設定するためのものです。自分の ref も使うときは、合成して渡します。

#### `useCheckboxGroup`

```ts
useCheckboxGroup<V>(props: UseCheckboxGroupProps<V>): UseCheckboxGroupResult<V>
```

チェックボックスグループの振る舞いを扱います。選択肢からチェックボックスを並べ、選んだ値の配列を作り、すべて選ぶの状態を導きます。何を描くかは利用者が決め、`get*Props` が返す props を自分の部品に渡します。

```tsx
const group = useCheckboxGroup({ options, value, onValueChange: setValue });

<div {...group.getContainerProps()}>
  {group.displayOptions.map((option) => (
    <MyCheckbox key={option.value} {...group.getCheckboxProps(option)} />
  ))}
</div>;
```

| プロパティ                   | 型                             | 説明                                                                                        |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `options`                    | `readonly Option<V>[]`         | 選択肢                                                                                      |
| `value?`                     | `readonly V[]`                 | 選んだ値（制御）                                                                            |
| `defaultValue?`              | `readonly V[]`                 | 選んだ値の初期値（非制御）。省略すると `[]`                                                 |
| `onValueChange?`             | `(value: V[]) => void`         | 選んだ値を変えたときに呼ぶ関数                                                              |
| `disabled?`                  | `boolean`                      | すべてのチェックボックスを操作できなくする                                                  |
| `readOnly?`                  | `boolean`                      | 表示はそのままで、選んだ値を変えられなくする                                                |
| `invalid?`                   | `boolean`                      | 値が正しくないことを示す                                                                    |
| `unlistedPlacement?`         | `'hidden' \| 'start' \| 'end'` | 選択肢外の値（`value` に入っているが `options` に無い値）を表示する位置。省略すると `'end'` |
| `keepUnlisted?`              | `boolean`                      | チェックを外した選択肢外の値も、選択肢として残す                                            |
| `selectAllIncludesUnlisted?` | `boolean`                      | すべて選ぶ・すべて外すの対象に、選択肢外の値も含める                                        |

| 戻り値              | 型                                                | 説明                                                                              |
| ------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `value`             | `readonly V[]`                                    | 今の選んだ値                                                                      |
| `displayOptions`    | `DisplayOption<V>[]`                              | 表示する選択肢（選択肢外の値を含む。`label` を省略した選択肢は `String(value)`）  |
| `isChecked`         | `(value: V) => boolean`                           | 値を選んでいるか                                                                  |
| `setChecked`        | `(value: V, checked: boolean) => void`            | 値を選ぶ・外す                                                                    |
| `selectAllState`    | `'checked' \| 'unchecked' \| 'indeterminate'`     | すべて選ぶの状態                                                                  |
| `setAllChecked`     | `(checked: boolean) => void`                      | すべて選ぶ・すべて外す                                                            |
| `getCheckboxProps`  | `(option: DisplayOption<V>) => CheckboxSlotProps` | 選択肢のチェックボックスに渡す props を作る                                       |
| `getSelectAllProps` | `() => CheckboxSlotProps`                         | すべて選ぶのチェックボックスに渡す props を作る（`children` は含まない）          |
| `getContainerProps` | `() => CheckboxGroupContainerProps`               | 外側の入れ物に付ける属性（`role="group"`・`aria-disabled`・`aria-invalid`）を作る |

- 選んだ値は、表示の順（選択肢の順と、選択肢外の値の位置）に並べた新しい配列で通知します。表示していない選択肢外の値（`'hidden'`）は末尾に残します。
- 値は `Object.is` で比べます。今の状態と同じなら通知しません。
- `disabled`・`readOnly` のとき、`disabled` の選択肢では、値を変えません。
- すべて選ぶの状態は、選べる（`disabled` でない）選択肢の選ばれ方で決まります。すべて選ぶ・すべて外すでは、`disabled` の選択肢の状態は変えません。選べる選択肢が無いときは、すべて選ぶのチェックボックスを `disabled` にします。
- `keepUnlisted` で残すのは、マウントしている間に `value` に現れた選択肢外の値です（現れた順）。後から `options` に入った値は、選択肢外として扱いません。

#### `withCheckboxGroup`

```ts
withCheckboxGroup<P extends CheckboxGroupParts>(parts: P): <V>(props: CheckboxGroupProps<V, P>) => ReactElement
```

組み込んだチェックボックスで描く、チェックボックスグループを作ります。アプリで1回だけ作り、画面ではそのまま置きます。

```tsx
// アプリで1回だけ作る
export const AppCheckboxGroup = withCheckboxGroup({ Checkbox: AppCheckbox });

// 画面ではそのまま置く
<AppCheckboxGroup
  options={options}
  value={value}
  onValueChange={setValue}
  showSelectAll
  selectAllLabel="すべて"
/>;
```

| 部品         | 型            | 説明                                                                                                      |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | 部品を並べる入れ物。省略すると `<div>`。受け取った props（`role`・`aria-*`・`children` など）を要素に渡す |
| `Checkbox`   | `ElementType` | 選択肢を描くチェックボックス。`CheckboxSlotProps` を受け取れるもの                                        |
| `SelectAll?` | `ElementType` | すべて選ぶを描く部品。省略すると `Checkbox` で描く。`CheckboxSlotProps` を受け取れるもの                  |

作ったコンポーネントは、`useCheckboxGroup` のプロパティに加えて、次のプロパティを受け取ります。

| プロパティ        | 型                          | 説明                                                                         |
| ----------------- | --------------------------- | ---------------------------------------------------------------------------- |
| `showSelectAll?`  | `boolean`                   | すべて選ぶのチェックボックスを、選択肢の前に表示する                         |
| `selectAllLabel?` | `ReactNode`                 | すべて選ぶのチェックボックスの文字。省略するとチェックボックスだけを表示する |
| `partsProps?`     | `{ checkbox?; selectAll? }` | チェックボックスの部品に渡すプロパティ（下記）                               |

- 入れ物（`Container`。省略すると `<div>`）に `role="group"` などを付け、その中にチェックボックスを並べます。その他のプロパティ（`className`・`style`・`aria-label` など）は入れ物に渡します。
- 並べ方（縦・横）は持ちません。`className` などで決めてください。
- 組み込むチェックボックスは `CheckboxSlotProps` を受け取ります。選択肢の文字は `children` で渡します。`indeterminate` は、すべて選ぶのチェックボックスにだけ渡します。すべて選ぶを使わないなら、受け取れなくてかまいません。
- `Checkbox` をそのまま組み込めます（`withCheckboxGroup({ Checkbox })`）。
- 組み込んだ部品の props が、作ったコンポーネントの型になります。ルートの残りのプロパティは `Container` の props、`partsProps.checkbox`・`partsProps.selectAll` はチェックボックスの部品の props から、グループが決める `CheckboxSlotProps` のプロパティを除いたものです。`partsProps.checkbox` は値か関数（選択肢を受け取り、選択肢ごとに決める）で渡します。部品に必須のプロパティがあれば、`partsProps` も必須になります。
- 部品が `CheckboxSlotProps` のプロパティを別の型で持っている場合（`onValueChange` がイベントを受け取るなど）は、`withCheckboxGroup` を呼ぶところで型エラーになります。部品を薄く包んで合わせてください。

```tsx
// CheckboxSlotProps に加えて、size を受け取るチェックボックス
const DsCheckboxGroup = withCheckboxGroup({ Checkbox: DsCheckbox });

<DsCheckboxGroup
  options={options}
  partsProps={{
    checkbox: { size: 'small' },
    selectAll: { size: 'small' },
  }}
/>;
```

- すべて選ぶを、選択肢と違う見た目や部品にしたいときは、`SelectAll` を渡します（例: `withCheckboxGroup({ Checkbox, SelectAll: AppSelectAll })`）。

### radio

| 名前                    | 説明                                               |
| ----------------------- | -------------------------------------------------- |
| `Radio`                 | ラジオグループに組み込むラジオボタン               |
| `withRadio(parts)`      | 組み込んだ部品で描く、ラジオボタンを作る           |
| `useRadio(props)`       | ラジオボタンの振る舞いを扱う（ヘッドレス UI）      |
| `useRadioGroup(props)`  | ラジオグループの振る舞いを扱う（ヘッドレス UI）    |
| `withRadioGroup(parts)` | 組み込んだラジオボタンで描く、ラジオグループを作る |

#### `Radio`

```tsx
<Radio value={selected} onValueChange={select} name="size">
  S
</Radio>
```

ラジオグループに組み込むラジオボタンです。`<label>` の中に `<input type="radio">` と `children` を置きます。ラジオボタンは単独では使わないので、制御（`value`）だけを受け付けます。ふつうは `withRadioGroup({ Radio })` に組み込んで使います。

| プロパティ       | 型                         | 説明                                                                             |
| ---------------- | -------------------------- | -------------------------------------------------------------------------------- |
| `value`          | `boolean`                  | 選ばれているか                                                                   |
| `onValueChange?` | `(value: boolean) => void` | 選んだときに呼ぶ関数（ラジオボタンは外せないので、常に `true` を渡す）           |
| `name?`          | `string`                   | グループの名前。同じ名前のラジオボタンが、Tab キー・矢印キーでグループとして動く |
| `disabled?`      | `boolean`                  | 操作できなくする                                                                 |
| `readOnly?`      | `boolean`                  | 表示はそのままで、選べなくする                                                   |
| `required?`      | `boolean`                  | 必須にする（グループのどれか1つを選ぶ）                                          |
| `invalid?`       | `boolean`                  | 値が正しくないことを示す（ARIA の属性は付けない。下記）                          |
| `children?`      | `ReactNode`                | ラジオボタンの横に表示する内容                                                   |
| `partsProps?`    | `{ label?; input? }`       | `<label>`・`<input>` に名指しで渡すプロパティ                                    |

- 主要素は `<input>` です。`className`・`style` は `<label>` に、それ以外のプロパティ（`ref`・`id`・`aria-*`・`data-*`・イベントハンドラーなど）は `<input>` に渡します。`<label>` には `partsProps.label` で渡します（`Checkbox` と同じ）。
- `onChange` は部品の処理の前に呼び、そこで `event.preventDefault()` すると通知しません。
- `aria-readonly`・`aria-invalid` はラジオボタンには付けられないので、`useRadioGroup` が入れ物（`role="radiogroup"`）に付けます。`invalid` は、組み込んだ部品で見た目を変えるために渡しています。

#### `withRadio`

```ts
withRadio<P extends RadioParts>(parts?: P): (props: RadioProps<P>) => ReactElement
```

組み込んだ部品で描く、ラジオボタンを作ります。`Radio` は、部品を省略して作ったものです。部品（`Label`・`Input`）と型の決まりは `withCheckbox` と同じです（`Input` は `<input type="radio">`）。

#### `useRadio`

```ts
useRadio(props: UseRadioProps): UseRadioResult
```

ラジオボタンの振る舞いを扱います。プロパティは `Radio` の `value`・`onValueChange`・`name`・`disabled`・`readOnly`・`required`・`invalid` と同じです。

| 戻り値          | 型                               | 説明                                                                                                                          |
| --------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `getInputProps` | `(handlers?) => RadioInputProps` | `<input>` に渡す props（`type`・`name`・`checked`・`disabled`・`required`・`onChange`）を作る。利用者の `onChange` を先に呼ぶ |

#### `useRadioGroup`

```ts
useRadioGroup<V>(props: UseRadioGroupProps<V>): UseRadioGroupResult<V>
```

ラジオグループの振る舞いを扱います。選択肢からラジオボタンを並べ、選んだ1つの値を持ちます。何を描くかは利用者が決め、`get*Props` が返す props を自分の部品に渡します。

```tsx
const group = useRadioGroup({ options, value, onValueChange: setValue });

<div {...group.getContainerProps()}>
  {group.displayOptions.map((option) => (
    <MyRadio key={option.value} {...group.getRadioProps(option)} />
  ))}
</div>;
```

| プロパティ           | 型                             | 説明                                                                                        |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `options`            | `readonly Option<V>[]`         | 選択肢                                                                                      |
| `value?`             | `V \| null`                    | 選んだ値（制御）。何も選んでいないときは `null`                                             |
| `defaultValue?`      | `V \| null`                    | 選んだ値の初期値（非制御）。省略すると `null`                                               |
| `onValueChange?`     | `(value: V) => void`           | 値を選んだときに呼ぶ関数                                                                    |
| `disabled?`          | `boolean`                      | すべてのラジオボタンを操作できなくする                                                      |
| `readOnly?`          | `boolean`                      | 表示はそのままで、選んだ値を変えられなくする                                                |
| `required?`          | `boolean`                      | 必須にする                                                                                  |
| `invalid?`           | `boolean`                      | 値が正しくないことを示す                                                                    |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | 選択肢外の値（`value` に入っているが `options` に無い値）を表示する位置。省略すると `'end'` |
| `keepUnlisted?`      | `boolean`                      | ほかを選んだ後も、選択肢外の値を選択肢として残す                                            |

| 戻り値              | 型                                             | 説明                                                                                                                     |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `value`             | `V \| null`                                    | 今の選んだ値                                                                                                             |
| `displayOptions`    | `DisplayOption<V>[]`                           | 表示する選択肢（選択肢外の値を含む。`label` を省略した選択肢は `String(value)`）                                         |
| `isChecked`         | `(value: V) => boolean`                        | 値を選んでいるか                                                                                                         |
| `check`             | `(value: V) => void`                           | 値を選ぶ                                                                                                                 |
| `getRadioProps`     | `(option: DisplayOption<V>) => RadioSlotProps` | 選択肢のラジオボタンに渡す props を作る                                                                                  |
| `getContainerProps` | `() => RadioGroupContainerProps`               | 外側の入れ物に付ける属性（`role="radiogroup"`・`aria-disabled`・`aria-readonly`・`aria-required`・`aria-invalid`）を作る |

- 選んだものは外せません（HTML のラジオボタンと同じ）。何も選んでいない状態に戻すときは、親が `value` を `null` にします。
- ラジオボタンには共通の `name` を渡します（`useId` で作る）。HTML のラジオボタンなら、Tab キー・矢印キーの動きをブラウザーに任せられます。フォームの送信には使いません。
- 値は `Object.is` で比べます。選んでいる値をもう一度選んでも通知しません。
- `disabled`・`readOnly` のとき、`disabled` の選択肢では、値を変えません。

#### `withRadioGroup`

```ts
withRadioGroup<P extends RadioGroupParts>(parts: P): <V>(props: RadioGroupProps<V, P>) => ReactElement
```

組み込んだラジオボタンで描く、ラジオグループを作ります。

```tsx
const RadioGroup = withRadioGroup({ Radio });

<RadioGroup options={sizes} value={size} onValueChange={setSize} />;
```

| 部品         | 型            | 説明                                                                                                      |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | 部品を並べる入れ物。省略すると `<div>`。受け取った props（`role`・`aria-*`・`children` など）を要素に渡す |
| `Radio`      | `ElementType` | 選択肢を描くラジオボタン。`RadioSlotProps` を受け取れるもの                                               |

- 作ったコンポーネントは、`useRadioGroup` のプロパティと `partsProps?`（`{ radio? }`）を受け取ります。
- 組み込んだ部品の props が、作ったコンポーネントの型になります（`withCheckboxGroup` と同じ）。ルートの残りのプロパティは `Container` の props、`partsProps.radio` はラジオボタンの部品の props から `RadioSlotProps` のプロパティを除いたもので、値か関数（選択肢ごと）で渡します。
- 入れ物（`Container`。省略すると `<div>`）に `role="radiogroup"` などを付け、その中にラジオボタンを並べます。その他のプロパティは入れ物に渡します。並べ方（縦・横）は持ちません。
- 組み込むラジオボタンは `RadioSlotProps` を受け取ります。HTML のラジオボタンを使わない部品（ボタンなど）では、`name` を無視してかまいません。その場合、キーボードの動きは部品の側で作ります。

### switch

| 名前                | 説明                                 |
| ------------------- | ------------------------------------ |
| `Switch`            | 値と操作の契約に沿ったスイッチ       |
| `withSwitch(parts)` | 組み込んだ部品で描く、スイッチを作る |

#### `Switch`

```tsx
<Switch value={enabled} onValueChange={setEnabled}>
  通知を受け取る
</Switch>
```

値と操作の契約に沿ったスイッチです。`<label>` の中に `<input type="checkbox" role="switch">` と `children` を置きます。見た目は持たないので、素のチェックボックスに見えます（見た目は react-components の `Switch` で付きます）。

- プロパティと動きは `Checkbox` と同じです（振る舞いは `useCheckbox`）。どちらとも言えない状態（`indeterminate`）は持ちません。
- 主要素は `<input>` です。`<label>` には `partsProps.label` で渡します（`Checkbox` と同じ）。
- 口の props が `CheckboxSlotProps` と合うので、`withCheckboxGroup({ Checkbox: Switch })` でスイッチを並べたグループを作れます。すべて選ぶに組み込んだときは、`indeterminate` を要素に渡しません（一部だけ選ばれているときは、オフに見えます）。

#### `withSwitch`

```ts
withSwitch<P extends SwitchParts>(parts?: P): (props: SwitchProps<P>) => ReactElement
```

組み込んだ部品で描く、スイッチを作ります。`Switch` は、部品を省略して作ったものです。部品（`Label`・`Input`）と型の決まりは `withCheckbox` と同じです。

### optionLabel

| 名前                      | 説明                                                   |
| ------------------------- | ------------------------------------------------------ |
| `OptionLabel`             | 選んだ値を、選択肢のラベルで表示する（単独の値）       |
| `OptionLabels`            | 選んだ値を、選択肢のラベルで並べて表示する（複数の値） |
| `withOptionLabel(parts)`  | 組み込んだ入れ物で描く、`OptionLabel` を作る           |
| `withOptionLabels(parts)` | 組み込んだ入れ物で描く、`OptionLabels` を作る          |

#### `OptionLabel`

```tsx
<OptionLabel options={sizes} value={size} placeholder="未選択" />
```

選んだ値を、選択肢のラベルで表示します。`<span>` の中にラベルの文字を置きます。`RadioGroup` などの単独の値を選ぶ部品と同じ `value`・`options`・`unlistedPlacement` を渡すと、同じものが見えます。

| プロパティ           | 型                             | 説明                                                               |
| -------------------- | ------------------------------ | ------------------------------------------------------------------ |
| `value`              | `V \| null`                    | 表示する値                                                         |
| `options`            | `readonly Option<V>[]`         | 選択肢                                                             |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | 選択肢外の値を表示する位置。`'hidden'` なら表示しない              |
| `placeholder?`       | `ReactNode`                    | 値が空（`null`）のとき、または表示するものが無いときに表示する内容 |

- その他のプロパティは `<span>` に渡します。
- 選択肢外の値は `String(value)` で表示します。
- 空文字も値の1つとして扱います。空文字にラベルを付けたいときは、`options` に `{ value: '', label: '未選択' }` のように入れます。

#### `OptionLabels`

```tsx
<OptionLabels options={fruits} value={selected} separator="、" />
```

選んだ値を、選択肢のラベルで並べて表示します。`CheckboxGroup` などの複数の値を選ぶ部品と同じ `value`・`options`・`unlistedPlacement` を渡すと、同じものが見えます。

| プロパティ           | 型                             | 説明                                                                                             |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `value`              | `readonly V[]`                 | 表示する値                                                                                       |
| `options`            | `readonly Option<V>[]`         | 選択肢                                                                                           |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | 選択肢外の値を表示する位置。`'hidden'` なら表示しない                                            |
| `separator?`         | `ReactNode`                    | ラベルの間に置く内容。省略すると `', '`                                                          |
| `partsProps?`        | `{ label? }`                   | ラベル1つの部品に渡すプロパティ。値か、表示する選択肢を受け取る関数（`withOptionLabels` を参照） |
| `placeholder?`       | `ReactNode`                    | 値が空（空の配列）のとき、または表示するものが無いときに表示する内容                             |

- ラベルは、入力の部品で表示する順（選択肢の順と、選択肢外の値の位置）に並べます。
- その他のプロパティは `<span>` に渡します。

#### `withOptionLabel`・`withOptionLabels`

```ts
withOptionLabel<P extends OptionLabelParts>(parts?: P): <V>(props: OptionLabelProps<V, P>) => ReactElement
withOptionLabels<P extends OptionLabelsParts>(parts?: P): <V>(props: OptionLabelsProps<V, P>) => ReactElement
```

組み込んだ入れ物で描く、`OptionLabel`・`OptionLabels` を作ります。`OptionLabel`・`OptionLabels` は、部品を省略して作ったものです。

| 部品         | 型            | 説明                                                                                                                                         |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | ラベルの文字（`OptionLabels` ではラベルを並べたもの）を入れる要素。省略すると `<span>`。受け取った props（`children` など）を要素に渡す      |
| `Label?`     | `ElementType` | `OptionLabels` だけ。ラベル1つを描く部品（チップのように見せる、など）。省略すると `<span>`。受け取った props（`children` など）を要素に渡す |

- 作ったコンポーネントは、`OptionLabel`・`OptionLabels` と同じプロパティを受け取ります。その他のプロパティは `Container` に渡し、型は `Container` の props になります。
- `OptionLabels` の `partsProps.label` は `Label` の props から `children` を除いたもので、値か関数（表示する選択肢 `DisplayOption<V>` を受け取る。`CheckboxGroup` の `partsProps.checkbox` と同じ）で渡します。部品に必須のプロパティがあれば、`partsProps` も必須になります。値が空のときの `placeholder` は `Label` で包みません。

```tsx
const ChipLabels = withOptionLabels({ Label: Chip });

<ChipLabels
  options={fruits}
  value={selected}
  separator=" "
  partsProps={{
    label: (option) => ({ tone: option.unlisted ? 'muted' : 'plain' }),
  }}
/>;
```

### button

| 名前                     | 説明                                            |
| ------------------------ | ----------------------------------------------- |
| `Button`                 | 値と操作の契約（`onMainAction`）に沿ったボタン  |
| `withButton(parts)`      | 組み込んだ部品で描く、ボタンを作る              |
| `useButtonGroup(props)`  | ボタングループの振る舞いを扱う（ヘッドレス UI） |
| `withButtonGroup(parts)` | 組み込んだボタンで描く、ボタングループを作る    |

#### `Button`

```tsx
<Button value="save" onMainAction={run}>
  保存
</Button>
```

値と操作の契約（`onMainAction`）に沿ったボタンです。押すと、`value` をそのまま `onMainAction` に渡します。

| プロパティ      | 型                                | 説明                                                                      |
| --------------- | --------------------------------- | ------------------------------------------------------------------------- |
| `value?`        | `V`                               | 押したときに `onMainAction` に渡す値。省略すると `undefined`              |
| `onMainAction?` | `(value: V) => void`              | 押したときに呼ぶ関数                                                      |
| `disabled?`     | `boolean`                         | 操作できなくする                                                          |
| `type?`         | `'button' \| 'submit' \| 'reset'` | HTML の `type`。省略すると `'button'`（フォームの中に置いても送信しない） |

- `onClick` を先に呼び、そこで `event.preventDefault()` されたら、`onMainAction` は呼びません。条件によって主な操作を止めたいときに使います。
- `value` は HTML の `<button>` の `value` には渡しません（型がジェネリクスのため）。
- その他のプロパティ（`className`・`ref` など）は `<button>` に渡します。

#### `withButton`

```ts
withButton<P extends ButtonParts>(parts?: P): <V = undefined>(props: ButtonProps<V, P>) => ReactElement
```

組み込んだ部品で描く、ボタンを作ります。`Button` は、部品を省略して作ったものです。

| 部品      | 型            | 説明                                                                                                                                |
| --------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `Button?` | `ElementType` | 押せる要素（主要素でルート）。省略すると `<button>`。受け取った props（`type`・`onClick`・`disabled`・`children` など）を要素に渡す |

- 作ったコンポーネントは、`Button` と同じプロパティを受け取ります。その他のプロパティは部品に渡し、型は部品の props になります。

#### `useButtonGroup`

```ts
useButtonGroup<V>(props: UseButtonGroupProps<V>): UseButtonGroupResult<V>
```

ボタングループの振る舞いを扱います。選択肢からボタンを並べ、押されたボタンの選択肢の `value` を `onMainAction` に渡します。状態は持ちません。

| プロパティ      | 型                     | 説明                             |
| --------------- | ---------------------- | -------------------------------- |
| `options`       | `readonly Option<V>[]` | 選択肢                           |
| `onMainAction?` | `(value: V) => void`   | ボタンを押したときに呼ぶ関数     |
| `disabled?`     | `boolean`              | すべてのボタンを操作できなくする |

| 戻り値              | 型                                              | 説明                                                              |
| ------------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `displayOptions`    | `DisplayOption<V>[]`                            | 表示する選択肢（`label` を省略した選択肢は `String(value)`）      |
| `getButtonProps`    | `(option: DisplayOption<V>) => ButtonSlotProps` | 選択肢のボタンに渡す props を作る                                 |
| `getContainerProps` | `() => ButtonGroupContainerProps`               | 外側の入れ物に付ける属性（`role="group"`・`aria-disabled`）を作る |

- `getButtonProps` の `onMainAction` は、組み込んだボタンが何を渡しても、その選択肢の `value` を通知します。

#### `withButtonGroup`

```ts
withButtonGroup<P extends ButtonGroupParts>(parts: P): <V>(props: ButtonGroupProps<V, P>) => ReactElement
```

組み込んだボタンで描く、ボタングループを作ります。

```tsx
const ButtonGroup = withButtonGroup({ Button });

<ButtonGroup options={actions} onMainAction={run} />;
```

| 部品         | 型            | 説明                                                                                                      |
| ------------ | ------------- | --------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | 部品を並べる入れ物。省略すると `<div>`。受け取った props（`role`・`aria-*`・`children` など）を要素に渡す |
| `Button`     | `ElementType` | 選択肢を描くボタン。`ButtonSlotProps` を受け取れるもの                                                    |

- 作ったコンポーネントは、`useButtonGroup` のプロパティと `partsProps?`（`{ button? }`）を受け取ります。
- 組み込んだ部品の props が、作ったコンポーネントの型になります（`withCheckboxGroup` と同じ）。ルートの残りのプロパティは `Container` の props、`partsProps.button` はボタンの部品の props から `ButtonSlotProps` のプロパティを除いたもので、値か関数（選択肢ごと）で渡します。
- 入れ物（`Container`。省略すると `<div>`）に `role="group"` などを付け、その中にボタンを並べます。その他のプロパティは入れ物に渡します。並べ方（縦・横）は持ちません。
- react-primitives の `Button` をそのまま組み込めます。単独の `Button` と、同じ `onMainAction` のハンドラーを使えます。

### textInput

| 名前                   | 説明                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `TextInput`            | 値と操作の契約に沿ったテキストの入力                            |
| `withTextInput(parts)` | 組み込んだ部品で描く、テキストの入力を作る                      |
| `useTextInput(props)`  | テキストの入力の振る舞い（下書きと確定）を扱う（ヘッドレス UI） |

#### `TextInput`

```tsx
<TextInput value={name} onValueChange={setName} placeholder="名前" />
```

値と操作の契約に沿ったテキストの入力です。`<input>` を描き、入力中の文字列を下書きとして持って、確定したときに `onValueChange` を呼びます。

| プロパティ            | 型                                                              | 説明                                                    |
| --------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| `value?`              | `string`                                                        | 確定した文字列（制御）                                  |
| `defaultValue?`       | `string`                                                        | 確定した文字列の初期値（非制御）。省略すると `''`       |
| `onValueChange?`      | `(value: string) => void`                                       | 確定したときに呼ぶ関数                                  |
| `onInputValueChange?` | `(text: string) => void`                                        | 入力のたびに呼ぶ関数（入力欄の文字列を渡す）            |
| `valueChangeTiming?`  | `'commit' \| 'input'`                                           | `onValueChange` を呼ぶタイミング。省略すると `'commit'` |
| `disabled?`           | `boolean`                                                       | 操作できなくする                                        |
| `readOnly?`           | `boolean`                                                       | 文字列を変えられなくする                                |
| `required?`           | `boolean`                                                       | 必須にする                                              |
| `invalid?`            | `boolean`                                                       | 値が正しくないことを示す（`aria-invalid` を付ける）     |
| `type?`               | `'text' \| 'search' \| 'email' \| 'url' \| 'tel' \| 'password'` | HTML の `type`。省略すると `'text'`                     |

| `valueChangeTiming` | `onValueChange` を呼ぶとき                          |
| ------------------- | --------------------------------------------------- |
| `'commit'`          | 入力を確定したとき（フォーカスが外れたとき、Enter） |
| `'input'`           | 入力のたび                                          |

- IME で変換している間の Enter では確定しません（変換を決める Enter で値が確定しないようにするため）。
- Esc を押すと、入力中の文字列を確定した値に戻します。
- 変わっていなければ通知しません。
- 親が `value` を変えたら、入力中でも入力欄の文字列を置き換えます。確定した文字列を親が受け入れなかった（`value` を変えなかった）ときも、親の値に戻します。
- `onKeyDown`・`onChange`・`onBlur` は、部品の処理の前に呼びます。`onKeyDown` で `event.preventDefault()` すると、Enter・Esc の処理をしません。
- 値が空のときは `''` です。`placeholder` は HTML の属性として渡します。
- その他のプロパティ（`className`・`ref` など）は `<input>` に渡します。

#### `withTextInput`

```ts
withTextInput<P extends TextInputParts>(parts?: P): (props: TextInputProps<P>) => ReactElement
```

組み込んだ部品で描く、テキストの入力を作ります。`TextInput` は、部品を省略して作ったものです。

| 部品     | 型            | 説明                                                                                                                                                      |
| -------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Input?` | `ElementType` | 文字を入力する要素（主要素でルート）。省略すると `<input>`。受け取った props（`value`・`onChange`・`onBlur`・`onKeyDown`・`ref` など）を `<input>` に渡す |

- 作ったコンポーネントは、`TextInput` と同じプロパティを受け取ります。その他のプロパティは部品に渡し、型は部品の props になります。

#### `useTextInput`

```ts
useTextInput(props: UseTextInputProps): UseTextInputResult
```

テキストの入力の振る舞い（下書きと確定）を扱います。外部の UI ライブラリの入力欄にも、同じ確定の処理を付けられます。プロパティは `TextInput` の `value`・`defaultValue`・`onValueChange`・`onInputValueChange`・`valueChangeTiming` と同じです。

```tsx
const textInput = useTextInput({ value, onValueChange: setValue });

<MyInput {...textInput.getInputProps({ onKeyDown: myKeyDown })} />;
```

| 戻り値          | 型                                                        | 説明                                                                                                                         |
| --------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `string`                                                  | 確定した文字列                                                                                                               |
| `inputValue`    | `string`                                                  | 入力欄の文字列（入力中の下書き）                                                                                             |
| `commit`        | `() => void`                                              | 入力欄の文字列を確定する                                                                                                     |
| `getInputProps` | `(handlers?: TextInputHandlers) => TextInputElementProps` | `<input>` に渡す props（`value`・`onChange`・`onBlur`・`onKeyDown`）を作る。利用者のハンドラーを渡すと、部品の処理の前に呼ぶ |

### collapsible

| 名前                     | 説明                                              |
| ------------------------ | ------------------------------------------------- |
| `Collapsible`            | 値と操作の契約に沿った、折りたためる部品          |
| `useCollapsible(props)`  | 折りたためる部品の振る舞いを扱う（ヘッドレス UI） |
| `withCollapsible(parts)` | 組み込んだ部品で描く、折りたためる部品を作る      |

#### `Collapsible`

```tsx
<Collapsible summary="詳しい条件" open={open} onOpenChange={setOpen}>
  …中身…
</Collapsible>
```

値と操作の契約（`open`・`defaultOpen`・`onOpenChange`）に沿った、折りたためる部品です。HTML の `<details>` の中に、`summary` を入れた `<summary>` と `children` を置きます。

| プロパティ      | 型                        | 説明                                                                |
| --------------- | ------------------------- | ------------------------------------------------------------------- |
| `open?`         | `boolean`                 | 開いているか（制御）                                                |
| `defaultOpen?`  | `boolean`                 | 開いているかの初期値（非制御）。省略すると `false`                  |
| `onOpenChange?` | `(open: boolean) => void` | 開閉が変わったときに呼ぶ関数                                        |
| `disabled?`     | `boolean`                 | 開閉できなくする（`<summary>` に `aria-disabled` を付ける）         |
| `summary?`      | `ReactNode`               | 見出し（`<summary>` の中身）                                        |
| `children?`     | `ReactNode`               | 開いたときに見える中身                                              |
| `partsProps?`   | `{ summary? }`            | `<summary>` に渡すプロパティ（`className`・イベントハンドラーなど） |

- 見出しを押す（Enter・Space でも）と、ブラウザーの開閉を止めて `onOpenChange` を呼びます。制御のときは、親が `open` を変えたときだけ開閉します。
- ブラウザーが自分で開閉したとき（ページ内検索で中の文字が見つかって開く、など）も `onOpenChange` を呼びます。制御で親が受け入れなければ、元に戻します。
- `partsProps.summary` の `onClick` は先に呼び、そこで `event.preventDefault()` すると開閉しません。
- 閉じているときも、中身は描いたまま隠します（HTML の `<details>` と同じ）。中の入力欄の状態は、閉じても消えません。
- その他のプロパティ（`className`・`ref` など）は `<details>` に渡します。

#### `withCollapsible`

```ts
withCollapsible<P extends CollapsibleParts>(parts?: P): (props: CollapsibleProps<P>) => ReactElement
```

組み込んだ部品で描く、折りたためる部品を作ります。`Collapsible` は、部品を省略して作ったものです。

| 部品       | 型            | 説明                                                                                                         |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| `Details?` | `ElementType` | `<details>` を描く部品。受け取った props（`open`・`onToggle`・`children` など）を `<details>` に渡す         |
| `Summary?` | `ElementType` | `<summary>` を描く部品。受け取った props（`onClick`・`aria-disabled`・`children` など）を `<summary>` に渡す |

- 作ったコンポーネントは、`Collapsible` と同じプロパティを受け取ります。
- 組み込んだ部品の props が、作ったコンポーネントの型になります。ルートの残りのプロパティは `Details` の props、`partsProps.summary` は `Summary` の props から `children` を除いたものです。部品に必須のプロパティがあれば、`partsProps` も必須になります。
- 開閉は `<details>` の `open`・`toggle` で扱うので、部品は `<details>`・`<summary>` を描く必要があります。

#### `useCollapsible`

```ts
useCollapsible(props: UseCollapsibleProps): UseCollapsibleResult
```

折りたためる部品の振る舞いを扱います。プロパティは `Collapsible` の `open`・`defaultOpen`・`onOpenChange`・`disabled` と同じです。

```tsx
const collapsible = useCollapsible({ open, onOpenChange: setOpen });

<details {...collapsible.getDetailsProps()}>
  <summary {...collapsible.getSummaryProps()}>見出し</summary>
  中身
</details>;
```

| 戻り値            | 型                                       | 説明                                                                                        |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------- |
| `open`            | `boolean`                                | 開いているか                                                                                |
| `setOpen`         | `(open: boolean) => void`                | 開く・閉じる（`disabled` のときは何もしない）                                               |
| `getDetailsProps` | `(handlers?) => CollapsibleDetailsProps` | `<details>` に渡す props（`open`・`onToggle`）を作る。利用者の `onToggle` を先に呼ぶ        |
| `getSummaryProps` | `(handlers?) => CollapsibleSummaryProps` | `<summary>` に渡す props（`onClick`・`aria-disabled`）を作る。利用者の `onClick` を先に呼ぶ |

### recordField

| 名前                             | 説明                                                             |
| -------------------------------- | ---------------------------------------------------------------- |
| `RecordField<T>`                 | レコードの項目（キー・ラベル・値を描く関数）の型                 |
| `renderFieldValue(field, props)` | 項目の値を描く（`renderValue` を省略した項目は、値を文字にする） |
| `RecordFields`                   | 値と操作の契約に沿った、レコードの項目を並べる部品               |
| `useRecordFields(props)`         | レコードの項目を並べる部品の振る舞いを扱う（ヘッドレス UI）      |

#### `RecordField<T>`

```ts
type RecordField<T> = {
  key: keyof T & string;
  label: ReactNode;
  renderValue?: (
    props: FieldValueProps<T[key]>,
    context: FieldValueContext,
  ) => ReactNode;
};
```

レコードの項目です。表（`Table`）の列にもそのまま使えます。キーごとの union なので、`renderValue` が受け取る値の型は `key` で絞られます。

| プロパティ     | 型                                                                          | 説明                                                                               |
| -------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `key`          | `keyof T & string`                                                          | 値を読むキー                                                                       |
| `label`        | `ReactNode`                                                                 | 項目のラベル（表では列の見出し）                                                   |
| `renderValue?` | `(props: FieldValueProps<T[key]>, context: FieldValueContext) => ReactNode` | 項目の値を描く関数。省略すると、値を文字にして表示する（`null`・`undefined` は空） |

`renderValue` が受け取る `FieldValueProps<V>` は、入力の部品にそのまま渡せる形です（`renderValue: (props) => <TextInput {...props} />`）。

| プロパティ        | 型                   | 説明                                                                 |
| ----------------- | -------------------- | -------------------------------------------------------------------- |
| `value`           | `V`                  | 項目の値                                                             |
| `onValueChange`   | `(value: V) => void` | 項目の値が確定したときに呼ぶ関数。部品が全体の値を作り直して知らせる |
| `aria-labelledby` | `string`             | 項目のラベル（表では列の見出し）の要素の id                          |

`renderValue` の2番目の引数（`FieldValueContext`）には、部品に広げない情報を渡します。props に入れると、部品に広げたときに DOM の属性に落ちるためです。

| プロパティ | 型                  | 説明                                                                                                                                                                                                  |
| ---------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`     | `readonly string[]` | 部品に渡した値から見た、項目の値のパス。`Table` は `[行の id, キー]`、`RecordFields` は `[キー]`。details の `path` と同じ形で、state-model の検証の結果を読むのに使える（`validation.issues(path)`） |

```tsx
renderValue: (props, { path }) => <MyCell {...props} path={path} />;
```

- `renderValue` は、hook の中で普通の関数として呼びます。中で hook を使うときは、コンポーネントを返してください（`renderValue: (props) => <MyCell {...props} />`）。

#### `renderFieldValue`

```ts
renderFieldValue<T>(field: RecordField<T>, props: FieldValueProps<T[keyof T & string]>, context: FieldValueContext): ReactNode
```

項目の `renderValue` を `props`・`context` で呼びます。省略した項目は、値を文字にして返します（`null`・`undefined` は空）。`useTable`・`useRecordFields` はこれで値を描きます。項目を自分で並べる部品を作るときに使えます。

#### `RecordFields`

```tsx
type Member = { id: string; name: string; active: boolean };

const fields: RecordField<Member>[] = [
  { key: 'id', label: 'ID' },
  {
    key: 'name',
    label: '名前',
    renderValue: (props) => <TextInput {...props} />,
  },
  {
    key: 'active',
    label: '有効',
    renderValue: (props) => <Checkbox {...props} />,
  },
];

<RecordFields value={member} onValueChange={setMember} fields={fields} />;
```

値と操作の契約に沿った、レコードの項目を並べる部品です。レコードを `value` で受け取り、項目の値が確定したら、変わった後のレコードを `onValueChange` で知らせます。送信（`<form>`）は持たないので、利用者の `<form>` の中に置けます。

| プロパティ       | 型                                                            | 説明                                                                         |
| ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `fields`         | `readonly RecordField<T>[]`                                   | 項目                                                                         |
| `value?`         | `T`                                                           | レコード（制御）                                                             |
| `defaultValue?`  | `T`                                                           | レコードの初期値（非制御）。`value` と両方省略すると `{}`                    |
| `onValueChange?` | `(value: T, details: RecordFieldsValueChangeDetails) => void` | 項目の値が確定したときに呼ぶ関数。変わった後のレコードと、変わった項目を渡す |

- `<div>` の中に、項目ごとの `<div>` を並べます。項目の中は、ラベルの `<div>` と値の `<div>` です。
- 項目の値が確定すると、そのキーを変えた新しいレコードを作り、`onValueChange(next, { type: 'update', path: [key] })` を呼びます。値が変わらなければ通知しません。
- ラベルに id を付け、`renderValue` に `aria-labelledby` で渡します。値の部品は、項目のラベルで名付けられます。
- `state-model` のレコードのモデルとは、`useModelProps(record)` の `value`・`onValueChange` を渡すとつながります。
- 入力が複数あるので、主要素はルートです。その他のプロパティ（`className`・`role`・`aria-label`・`ref` など）は、ルートの `<div>` に渡します。

#### `useRecordFields`

```ts
useRecordFields<T extends object>(props: UseRecordFieldsProps<T>): UseRecordFieldsResult<T>
```

レコードの項目を並べる部品の振る舞いを扱います。項目ごとにラベルの id・描いたもの・`renderValue` に渡す props を作るので、並べ方を自分で決められます。プロパティは `RecordFields` の `fields`・`value`・`defaultValue`・`onValueChange` と同じです。

```tsx
const { displayFields } = useRecordFields({ value, onValueChange, fields });

<div className="my-form">
  {displayFields.map((field) => (
    <div key={field.labelId} className="my-field">
      <span id={field.labelId}>{field.label}</span>
      {field.content}
    </div>
  ))}
</div>;
```

| 戻り値          | 型                        | 説明                                                                                                                                                   |
| --------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value`         | `T`                       | レコード                                                                                                                                               |
| `displayFields` | `DisplayRecordField<T>[]` | 表示する項目。項目に、ラベルの id（`labelId`）、描いたもの（`content`）、`renderValue` に渡した props（`props`）と2番目の引数（`context`）を足したもの |

### table

| 名前              | 説明                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| `Table`           | 値と操作の契約に沿った表                                                      |
| `useTable(props)` | 表の振る舞い（見出し・行・セルへの展開と、セルの変更）を扱う（ヘッドレス UI） |

#### `Table`

```tsx
type Member = { id: string; name: string; age: number };

const columns: TableColumn<Member>[] = [
  {
    key: 'name',
    label: '名前',
    renderValue: (props) => <TextInput {...props} />,
  },
  { key: 'age', label: '年齢' },
];

<Table value={members} onValueChange={setMembers} columns={columns} />;
```

値と操作の契約に沿った表です。行の配列を `value` で受け取り、セルの値が確定したら、変わった後の配列を `onValueChange` で知らせます。`<table>` を描き、列の見出しを `<th scope="col">`、セルを `<td>` に描きます。

| プロパティ       | 型                                                       | 説明                                                                     |
| ---------------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| `columns`        | `readonly TableColumn<R>[]`                              | 列                                                                       |
| `value?`         | `readonly R[]`                                           | 行の配列（制御）                                                         |
| `defaultValue?`  | `readonly R[]`                                           | 行の配列の初期値（非制御）。省略すると空の配列                           |
| `onValueChange?` | `(value: R[], details: TableValueChangeDetails) => void` | セルの値が確定したときに呼ぶ関数。変わった後の配列と、変わったセルを渡す |

- 行は `id` を持つオブジェクトです（`R extends { id: string | number }`）。`id` で行を見分けます（state-model の一覧の既定と同じ）。
- セルの値が確定すると、`id` で行を探してそのキーを変えた新しい配列を作り、`onValueChange(next, { type: 'update', path: [id, key] })` を呼びます。`id` は文字列に揃えて入れます。変わっていない行は、元のオブジェクトのままです。
- 値が変わらなければ通知しません。同じ `id` の行が複数あるときは、先にある行だけを変えます。
- 列の見出しに id を付け、`renderValue` に `aria-labelledby` で渡します。セルの入力欄は、列の見出しで名付けられます。
- `state-model` の一覧のモデルとは、`useModelProps(list)` の `value`・`onValueChange` を渡すとつながります。
- その他のプロパティ（`className`・`aria-label`・`ref` など）は `<table>` に渡します。

#### `useTable`

```ts
useTable<R extends { id: string | number }>(props: UseTableProps<R>): UseTableResult<R>
```

表の振る舞いを扱います。列の見出し・行・セルに展開したものを返すので、`<table>` 以外の要素（CSS Grid、仮想スクロールなど）でも、同じ変更の処理と見出しの結び付けを使えます。プロパティは `Table` の `columns`・`value`・`defaultValue`・`onValueChange` と同じです。

```tsx
const { displayColumns, rows } = useTable({ value, onValueChange, columns });

<div className="my-grid">
  {displayColumns.map((column) => (
    <div key={column.labelId} id={column.labelId}>
      {column.label}
    </div>
  ))}
  {rows.map((row) =>
    row.cells.map((cell) => (
      <div key={`${row.id}:${cell.labelId}`}>{cell.content}</div>
    )),
  )}
</div>;
```

- `labelId` は列ごとに1つです。列の見出しの要素1つにだけ付けてください（行ごとにラベルを描く形では、同じ id が並んでしまいます）。

| 戻り値           | 型                        | 説明                                                    |
| ---------------- | ------------------------- | ------------------------------------------------------- |
| `value`          | `readonly R[]`            | 行の配列                                                |
| `displayColumns` | `DisplayTableColumn<R>[]` | 表示する列（列に見出しの id の `labelId` を足したもの） |
| `rows`           | `TableRow<R>[]`           | 表示する行（`value` の順）                              |

`rows` の要素（`TableRow<R>`）は `{ id, cells }` です。`id` は文字列に揃えた行の id で、React の key に使えます。`cells` の要素（`TableCell<R>`）は次のとおりです。

| プロパティ | 型                                     | 説明                                                                   |
| ---------- | -------------------------------------- | ---------------------------------------------------------------------- |
| `key`      | `keyof R & string`                     | 列のキー                                                               |
| `labelId`  | `string`                               | 列の見出しの要素の id                                                  |
| `content`  | `ReactNode`                            | 列の `renderValue` で描いたもの（省略した列は、値を文字にしたもの）    |
| `props`    | `FieldValueProps<R[keyof R & string]>` | `renderValue` に渡した props。自分で描き直すときに使う                 |
| `context`  | `FieldValueContext`                    | `renderValue` に2番目の引数で渡した情報（`path` は `[行の id, キー]`） |

### 型

`Option<V>`・`DisplayOption<V>`・`UnlistedPlacementProps` などの、値と操作の契約の型は [`@fringeworks/react-contract`](https://github.com/fringeworks-js/react-contract) にあります。

| 型                                | 説明                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `CheckboxProps<P>`                | `withCheckbox` で作ったコンポーネント（`Checkbox`）のプロパティ（`P` は組み込んだ部品）         |
| `CheckboxParts`                   | `withCheckbox` に組み込む部品                                                                   |
| `CheckboxLabelSlotProps`          | `withCheckbox` に組み込む `<label>` の部品が受け取る props                                      |
| `CheckboxInputSlotProps`          | `withCheckbox` に組み込む `<input>` の部品が受け取る props                                      |
| `CheckboxPartsProps<P>`           | `partsProps` で部品に渡す props                                                                 |
| `CheckboxSlots`                   | 部品の名前と、部品に渡す props の対応                                                           |
| `UseCheckboxProps`                | `useCheckbox` が受け取る props                                                                  |
| `UseCheckboxResult`               | `useCheckbox` の戻り値                                                                          |
| `CheckboxInputProps`              | `useCheckbox` の `getInputProps` が作る props                                                   |
| `UseCheckboxGroupProps<V>`        | `useCheckboxGroup` が受け取る props                                                             |
| `UseCheckboxGroupResult<V>`       | `useCheckboxGroup` の戻り値                                                                     |
| `SelectAllState`                  | すべて選ぶの状態                                                                                |
| `CheckboxSlotProps`               | チェックボックスグループに組み込むチェックボックスが受け取る props                              |
| `CheckboxGroupContainerProps`     | 外側の入れ物に付ける属性                                                                        |
| `CheckboxGroupContainerSlotProps` | チェックボックスグループに組み込む入れ物の部品が受け取る props                                  |
| `CheckboxGroupParts`              | `withCheckboxGroup` に組み込む部品                                                              |
| `CheckboxGroupProps<V, P>`        | `withCheckboxGroup` で作ったコンポーネントのプロパティ（`P` は組み込んだ部品）                  |
| `CheckboxGroupPartsProps<V, P>`   | `partsProps` で部品に渡す props                                                                 |
| `CheckboxGroupSlots`              | 部品の名前と、グループがその部品に渡す props の対応                                             |
| `DefaultCheckboxGroupParts`       | `CheckboxGroupProps` の既定の型引数                                                             |
| `RadioProps<P>`                   | `withRadio` で作ったコンポーネント（`Radio`）のプロパティ（`P` は組み込んだ部品）               |
| `RadioParts`                      | `withRadio` に組み込む部品                                                                      |
| `RadioLabelSlotProps`             | `withRadio` に組み込む `<label>` の部品が受け取る props                                         |
| `RadioInputSlotProps`             | `withRadio` に組み込む `<input>` の部品が受け取る props                                         |
| `RadioPartsProps<P>`              | `partsProps` で部品に渡す props                                                                 |
| `RadioSlots`                      | 部品の名前と、部品に渡す props の対応                                                           |
| `UseRadioProps`                   | `useRadio` が受け取る props                                                                     |
| `UseRadioResult`                  | `useRadio` の戻り値                                                                             |
| `RadioInputProps`                 | `useRadio` の `getInputProps` が作る props                                                      |
| `SwitchProps<P>`                  | `withSwitch` で作ったコンポーネント（`Switch`）のプロパティ（`P` は組み込んだ部品）             |
| `SwitchParts`                     | `withSwitch` に組み込む部品                                                                     |
| `SwitchLabelSlotProps`            | `withSwitch` に組み込む `<label>` の部品が受け取る props                                        |
| `SwitchInputSlotProps`            | `withSwitch` に組み込む `<input>` の部品が受け取る props                                        |
| `SwitchPartsProps<P>`             | `partsProps` で部品に渡す props                                                                 |
| `SwitchSlots`                     | 部品の名前と、部品に渡す props の対応                                                           |
| `UseRadioGroupProps<V>`           | `useRadioGroup` が受け取る props                                                                |
| `UseRadioGroupResult<V>`          | `useRadioGroup` の戻り値                                                                        |
| `RadioSlotProps`                  | ラジオグループに組み込むラジオボタンが受け取る props                                            |
| `RadioGroupContainerProps`        | 外側の入れ物に付ける属性                                                                        |
| `RadioGroupContainerSlotProps`    | ラジオグループに組み込む入れ物の部品が受け取る props                                            |
| `RadioGroupParts`                 | `withRadioGroup` に組み込む部品                                                                 |
| `RadioGroupProps<V, P>`           | `withRadioGroup` で作ったコンポーネントのプロパティ（`P` は組み込んだ部品）                     |
| `RadioGroupPartsProps<V, P>`      | `partsProps` で部品に渡す props                                                                 |
| `RadioGroupSlots`                 | 部品の名前と、グループがその部品に渡す props の対応                                             |
| `DefaultRadioGroupParts`          | `RadioGroupProps` の既定の型引数                                                                |
| `OptionLabelProps<V, P>`          | `withOptionLabel` で作ったコンポーネント（`OptionLabel`）のプロパティ（`P` は組み込んだ部品）   |
| `OptionLabelParts`                | `withOptionLabel` に組み込む部品                                                                |
| `OptionLabelContainerSlotProps`   | `withOptionLabel` に組み込む入れ物の部品が受け取る props                                        |
| `OptionLabelSlots`                | 部品の名前と、部品に渡す props の対応                                                           |
| `OptionLabelsProps<V, P>`         | `withOptionLabels` で作ったコンポーネント（`OptionLabels`）のプロパティ（`P` は組み込んだ部品） |
| `OptionLabelsParts`               | `withOptionLabels` に組み込む部品                                                               |
| `OptionLabelsContainerSlotProps`  | `withOptionLabels` に組み込む入れ物の部品が受け取る props                                       |
| `OptionLabelsSlots`               | 部品の名前と、部品に渡す props の対応                                                           |
| `OptionLabelsLabelSlotProps`      | `withOptionLabels` に組み込む、ラベル1つの部品が受け取る props                                  |
| `OptionLabelsPartsProps<V, P>`    | `partsProps` で部品に渡す props                                                                 |
| `ButtonProps<V, P>`               | `withButton` で作ったコンポーネント（`Button`）のプロパティ（`P` は組み込んだ部品）             |
| `ButtonParts`                     | `withButton` に組み込む部品                                                                     |
| `ButtonButtonSlotProps`           | `withButton` に組み込む部品が受け取る props                                                     |
| `ButtonSlots`                     | 部品の名前と、部品に渡す props の対応                                                           |
| `UseButtonGroupProps<V>`          | `useButtonGroup` が受け取る props                                                               |
| `UseButtonGroupResult<V>`         | `useButtonGroup` の戻り値                                                                       |
| `ButtonSlotProps`                 | ボタングループに組み込むボタンが受け取る props                                                  |
| `ButtonGroupContainerProps`       | 外側の入れ物に付ける属性                                                                        |
| `ButtonGroupContainerSlotProps`   | ボタングループに組み込む入れ物の部品が受け取る props                                            |
| `ButtonGroupParts`                | `withButtonGroup` に組み込む部品                                                                |
| `ButtonGroupProps<V, P>`          | `withButtonGroup` で作ったコンポーネントのプロパティ（`P` は組み込んだ部品）                    |
| `ButtonGroupPartsProps<V, P>`     | `partsProps` で部品に渡す props                                                                 |
| `ButtonGroupSlots`                | 部品の名前と、グループがその部品に渡す props の対応                                             |
| `DefaultButtonGroupParts`         | `ButtonGroupProps` の既定の型引数                                                               |
| `TextInputProps<P>`               | `withTextInput` で作ったコンポーネント（`TextInput`）のプロパティ（`P` は組み込んだ部品）       |
| `TextInputParts`                  | `withTextInput` に組み込む部品                                                                  |
| `TextInputInputSlotProps`         | `withTextInput` に組み込む部品が受け取る props                                                  |
| `TextInputSlots`                  | 部品の名前と、部品に渡す props の対応                                                           |
| `TextInputType`                   | `TextInput` が受け付ける `type`                                                                 |
| `UseTextInputProps`               | `useTextInput` が受け取る props                                                                 |
| `UseTextInputResult`              | `useTextInput` の戻り値                                                                         |
| `ValueChangeTiming`               | `onValueChange` を呼ぶタイミング                                                                |
| `TextInputHandlers`               | `getInputProps` に渡す、利用者のハンドラー                                                      |
| `TextInputElementProps`           | `getInputProps` が作る、`<input>` に渡す props                                                  |
| `CollapsibleProps<P>`             | `withCollapsible` で作ったコンポーネント（`Collapsible`）のプロパティ（`P` は組み込んだ部品）   |
| `CollapsibleParts`                | `withCollapsible` に組み込む部品                                                                |
| `CollapsibleDetailsSlotProps`     | `withCollapsible` に組み込む `<details>` の部品が受け取る props                                 |
| `CollapsibleSummarySlotProps`     | `withCollapsible` に組み込む `<summary>` の部品が受け取る props                                 |
| `CollapsiblePartsProps<P>`        | `partsProps` で部品に渡す props                                                                 |
| `CollapsibleSlots`                | 部品の名前と、部品に渡す props の対応                                                           |
| `UseCollapsibleProps`             | `useCollapsible` が受け取る props                                                               |
| `UseCollapsibleResult`            | `useCollapsible` の戻り値                                                                       |
| `CollapsibleDetailsProps`         | `<details>` に渡す props                                                                        |
| `CollapsibleSummaryProps`         | `<summary>` に渡す props                                                                        |
| `RecordField<T>`                  | レコードの項目                                                                                  |
| `FieldValueProps<V>`              | 項目の値を描く関数（`renderValue`）に渡す props                                                 |
| `FieldValueContext`               | `renderValue` に2番目の引数で渡す情報（`path`）                                                 |
| `TableColumn<R>`                  | 表の列（今は `RecordField<R>` と同じ形）                                                        |
| `TableRowId`                      | 表の行の id の型（`string \| number`）                                                          |
| `TableProps<R>`                   | `Table` のプロパティ                                                                            |
| `UseTableProps<R>`                | `useTable` が受け取る props                                                                     |
| `UseTableResult<R>`               | `useTable` の戻り値                                                                             |
| `TableValueChangeDetails`         | 表の値が変わったときの付帯情報（`{ type: 'update', path: [id, key] }`）                         |
| `DisplayTableColumn<R>`           | 表示する列                                                                                      |
| `TableRow<R>`                     | 表示する行                                                                                      |
| `TableCell<R>`                    | 表示するセル                                                                                    |
| `RecordFieldsProps<T>`            | `RecordFields` のプロパティ                                                                     |
| `UseRecordFieldsProps<T>`         | `useRecordFields` が受け取る props                                                              |
| `UseRecordFieldsResult<T>`        | `useRecordFields` の戻り値                                                                      |
| `RecordFieldsValueChangeDetails`  | レコードの値が変わったときの付帯情報（`{ type: 'update', path: [key] }`）                       |
| `DisplayRecordField<T>`           | 表示する項目                                                                                    |

## ライセンス

MIT
