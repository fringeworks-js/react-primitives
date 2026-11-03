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
import { Checkbox, withCheckboxGroup } from '@fringeworks/react-primitives/checkbox';
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
| `Checkbox`                 | `ComponentType<CheckboxSlotProps>`                               | 選択肢を描くチェックボックス |
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
| `partsProps?`    | `{ input?: InputProps }`   | `<input>` に渡すプロパティ（`name`・`id`・`ref`・イベントハンドラーなど）    |

- その他のプロパティ（`className`・`style` など）は `<label>` に渡します。
- `partsProps.input` には、`Checkbox` が自分で設定する属性（`type`・`checked`・`disabled`・`readOnly`・`required` など）は渡せません。イベントハンドラーと `ref` は合成されます。
- `indeterminate` は HTML の属性が無いため、DOM のプロパティに設定します。

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
withCheckboxGroup(parts: CheckboxGroupParts): <V>(props: CheckboxGroupProps<V>) => ReactElement
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

| 部品         | 型                                 | 説明                                               |
| ------------ | ---------------------------------- | -------------------------------------------------- |
| `Checkbox`   | `ComponentType<CheckboxSlotProps>` | 選択肢を描くチェックボックス                       |
| `SelectAll?` | `ComponentType<CheckboxSlotProps>` | すべて選ぶを描く部品。省略すると `Checkbox` で描く |

作ったコンポーネントは、`useCheckboxGroup` のプロパティに加えて、次のプロパティを受け取ります。

| プロパティ        | 型          | 説明                                                                         |
| ----------------- | ----------- | ---------------------------------------------------------------------------- |
| `showSelectAll?`  | `boolean`   | すべて選ぶのチェックボックスを、選択肢の前に表示する                         |
| `selectAllLabel?` | `ReactNode` | すべて選ぶのチェックボックスの文字。省略するとチェックボックスだけを表示する |

- `<div role="group">` の中に、チェックボックスを並べます。その他のプロパティ（`className`・`style`・`aria-label` など）は `<div>` に渡します。
- 並べ方（縦・横）は持ちません。`className` などで決めてください。
- 組み込むチェックボックスは `CheckboxSlotProps` を受け取ります。選択肢の文字は `children` で渡します。`indeterminate` は、すべて選ぶのチェックボックスにだけ渡します。すべて選ぶを使わないなら、受け取れなくてかまいません。
- `Checkbox` をそのまま組み込めます（`withCheckboxGroup({ Checkbox })`）。
- すべて選ぶを、選択肢と違う見た目や部品にしたいときは、`SelectAll` を渡します（例: `withCheckboxGroup({ Checkbox, SelectAll: AppSelectAll })`）。

### radio

| 名前                    | 説明                                               |
| ----------------------- | -------------------------------------------------- |
| `Radio`                 | `ComponentType<RadioSlotProps>`                    | 選択肢を描くラジオボタン |
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
| `partsProps?`    | `{ input?: InputProps }`   | `<input>` に渡すプロパティ（`id`・`ref`・イベントハンドラーなど）                |

- その他のプロパティ（`className`・`style` など）は `<label>` に渡します。
- `aria-readonly`・`aria-invalid` はラジオボタンには付けられないので、`useRadioGroup` が入れ物（`role="radiogroup"`）に付けます。`invalid` は、組み込んだ部品で見た目を変えるために渡しています。

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
withRadioGroup(parts: RadioGroupParts): <V>(props: RadioGroupProps<V>) => ReactElement
```

組み込んだラジオボタンで描く、ラジオグループを作ります。

```tsx
const RadioGroup = withRadioGroup({ Radio });

<RadioGroup options={sizes} value={size} onValueChange={setSize} />;
```

| 部品    | 型                              | 説明                     |
| ------- | ------------------------------- | ------------------------ |
| `Radio` | `ComponentType<RadioSlotProps>` | 選択肢を描くラジオボタン |

- 作ったコンポーネントは、`useRadioGroup` と同じプロパティを受け取ります。
- `<div role="radiogroup">` の中に、ラジオボタンを並べます。その他のプロパティは `<div>` に渡します。並べ方（縦・横）は持ちません。
- 組み込むラジオボタンは `RadioSlotProps` を受け取ります。HTML のラジオボタンを使わない部品（ボタンなど）では、`name` を無視してかまいません。その場合、キーボードの動きは部品の側で作ります。

### optionLabel

| 名前           | 説明                                                   |
| -------------- | ------------------------------------------------------ |
| `OptionLabel`  | 選んだ値を、選択肢のラベルで表示する（単独の値）       |
| `OptionLabels` | 選んだ値を、選択肢のラベルで並べて表示する（複数の値） |

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

| プロパティ           | 型                             | 説明                                                                 |
| -------------------- | ------------------------------ | -------------------------------------------------------------------- |
| `value`              | `readonly V[]`                 | 表示する値                                                           |
| `options`            | `readonly Option<V>[]`         | 選択肢                                                               |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | 選択肢外の値を表示する位置。`'hidden'` なら表示しない                |
| `separator?`         | `ReactNode`                    | ラベルの間に置く内容。省略すると `', '`                              |
| `placeholder?`       | `ReactNode`                    | 値が空（空の配列）のとき、または表示するものが無いときに表示する内容 |

- ラベルは、入力の部品で表示する順（選択肢の順と、選択肢外の値の位置）に並べます。
- その他のプロパティは `<span>` に渡します。

### button

| 名前                     | 説明                                            |
| ------------------------ | ----------------------------------------------- |
| `Button`                 | `ComponentType<ButtonSlotProps>`                | 選択肢を描くボタン |
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
withButtonGroup(parts: ButtonGroupParts): <V>(props: ButtonGroupProps<V>) => ReactElement
```

組み込んだボタンで描く、ボタングループを作ります。

```tsx
const ButtonGroup = withButtonGroup({ Button });

<ButtonGroup options={actions} onMainAction={run} />;
```

| 部品     | 型                               | 説明               |
| -------- | -------------------------------- | ------------------ |
| `Button` | `ComponentType<ButtonSlotProps>` | 選択肢を描くボタン |

- 作ったコンポーネントは、`useButtonGroup` と同じプロパティを受け取ります。
- `<div role="group">` の中に、ボタンを並べます。その他のプロパティは `<div>` に渡します。並べ方（縦・横）は持ちません。
- react-primitives の `Button` をそのまま組み込めます。単独の `Button` と、同じ `onMainAction` のハンドラーを使えます。

### textInput

| 名前                  | 説明                                                            |
| --------------------- | --------------------------------------------------------------- |
| `TextInput`           | 値と操作の契約に沿ったテキストの入力                            |
| `useTextInput(props)` | テキストの入力の振る舞い（下書きと確定）を扱う（ヘッドレス UI） |

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

| 名前                    | 説明                                              |
| ----------------------- | ------------------------------------------------- |
| `Collapsible`           | 値と操作の契約に沿った、折りたためる部品          |
| `useCollapsible(props)` | 折りたためる部品の振る舞いを扱う（ヘッドレス UI） |

#### `Collapsible`

```tsx
<Collapsible summary="詳しい条件" open={open} onOpenChange={setOpen}>
  …中身…
</Collapsible>
```

値と操作の契約（`open`・`defaultOpen`・`onOpenChange`）に沿った、折りたためる部品です。HTML の `<details>` の中に、`summary` を入れた `<summary>` と `children` を置きます。

| プロパティ      | 型                           | 説明                                                                |
| --------------- | ---------------------------- | ------------------------------------------------------------------- |
| `open?`         | `boolean`                    | 開いているか（制御）                                                |
| `defaultOpen?`  | `boolean`                    | 開いているかの初期値（非制御）。省略すると `false`                  |
| `onOpenChange?` | `(open: boolean) => void`    | 開閉が変わったときに呼ぶ関数                                        |
| `disabled?`     | `boolean`                    | 開閉できなくする（`<summary>` に `aria-disabled` を付ける）         |
| `summary?`      | `ReactNode`                  | 見出し（`<summary>` の中身）                                        |
| `children?`     | `ReactNode`                  | 開いたときに見える中身                                              |
| `partsProps?`   | `{ summary?: SummaryProps }` | `<summary>` に渡すプロパティ（`className`・イベントハンドラーなど） |

- 見出しを押す（Enter・Space でも）と、ブラウザーの開閉を止めて `onOpenChange` を呼びます。制御のときは、親が `open` を変えたときだけ開閉します。
- ブラウザーが自分で開閉したとき（ページ内検索で中の文字が見つかって開く、など）も `onOpenChange` を呼びます。制御で親が受け入れなければ、元に戻します。
- `partsProps.summary` の `onClick` は先に呼び、そこで `event.preventDefault()` すると開閉しません。
- 閉じているときも、中身は描いたまま隠します（HTML の `<details>` と同じ）。中の入力欄の状態は、閉じても消えません。
- その他のプロパティ（`className`・`ref` など）は `<details>` に渡します。

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

### 型

`Option<V>`・`DisplayOption<V>`・`UnlistedPlacementProps` などの、値と操作の契約の型は [`@fringeworks/react-contract`](https://github.com/fringeworks-js/react-contract) にあります。

| 型                            | 説明                                                                                        |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `CheckboxProps`               | `Checkbox` のプロパティ                                                                     |
| `UseCheckboxGroupProps<V>`    | `useCheckboxGroup` が受け取る props（`withCheckboxGroup` で作ったコンポーネントと同じもの） |
| `UseCheckboxGroupResult<V>`   | `useCheckboxGroup` の戻り値                                                                 |
| `SelectAllState`              | すべて選ぶの状態                                                                            |
| `CheckboxSlotProps`           | チェックボックスグループに組み込むチェックボックスが受け取る props                          |
| `CheckboxGroupContainerProps` | 外側の入れ物に付ける属性                                                                    |
| `CheckboxGroupParts`          | `withCheckboxGroup` に組み込む部品                                                          |
| `CheckboxGroupProps<V>`       | `withCheckboxGroup` で作ったコンポーネントのプロパティ                                      |
| `RadioProps`                  | `Radio` のプロパティ                                                                        |
| `UseRadioGroupProps<V>`       | `useRadioGroup` が受け取る props（`withRadioGroup` で作ったコンポーネントと同じもの）       |
| `UseRadioGroupResult<V>`      | `useRadioGroup` の戻り値                                                                    |
| `RadioSlotProps`              | ラジオグループに組み込むラジオボタンが受け取る props                                        |
| `RadioGroupContainerProps`    | 外側の入れ物に付ける属性                                                                    |
| `RadioGroupParts`             | `withRadioGroup` に組み込む部品                                                             |
| `RadioGroupProps<V>`          | `withRadioGroup` で作ったコンポーネントのプロパティ                                         |
| `OptionLabelProps<V>`         | `OptionLabel` のプロパティ                                                                  |
| `OptionLabelsProps<V>`        | `OptionLabels` のプロパティ                                                                 |
| `ButtonProps<V>`              | `Button` のプロパティ                                                                       |
| `UseButtonGroupProps<V>`      | `useButtonGroup` が受け取る props（`withButtonGroup` で作ったコンポーネントと同じもの）     |
| `UseButtonGroupResult<V>`     | `useButtonGroup` の戻り値                                                                   |
| `ButtonSlotProps`             | ボタングループに組み込むボタンが受け取る props                                              |
| `ButtonGroupContainerProps`   | 外側の入れ物に付ける属性                                                                    |
| `ButtonGroupParts`            | `withButtonGroup` に組み込む部品                                                            |
| `ButtonGroupProps<V>`         | `withButtonGroup` で作ったコンポーネントのプロパティ                                        |
| `TextInputProps`              | `TextInput` のプロパティ                                                                    |
| `TextInputType`               | `TextInput` が受け付ける `type`                                                             |
| `UseTextInputProps`           | `useTextInput` が受け取る props                                                             |
| `UseTextInputResult`          | `useTextInput` の戻り値                                                                     |
| `ValueChangeTiming`           | `onValueChange` を呼ぶタイミング                                                            |
| `TextInputHandlers`           | `getInputProps` に渡す、利用者のハンドラー                                                  |
| `TextInputElementProps`       | `getInputProps` が作る、`<input>` に渡す props                                              |
| `CollapsibleProps`            | `Collapsible` のプロパティ                                                                  |
| `UseCollapsibleProps`         | `useCollapsible` が受け取る props                                                           |
| `UseCollapsibleResult`        | `useCollapsible` の戻り値                                                                   |
| `CollapsibleDetailsProps`     | `<details>` に渡す props                                                                    |
| `CollapsibleSummaryProps`     | `<summary>` に渡す props                                                                    |

## ライセンス

MIT
