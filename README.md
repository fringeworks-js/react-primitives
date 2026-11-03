# @fringeworks/react-primitives

`@fringeworks/react-primitives` is a library some will find handy, offering fine-grained React components for building components.

**[日本語のREADMEはこちら](./README.ja.md)**

## Installation

```bash
npm install @fringeworks/react-primitives
# or
pnpm add @fringeworks/react-primitives
```

Supports React 18 and 19.

## Usage

Components, hooks, HOCs, and types can be imported with the same names from the root, a category, or a feature path.

```ts
import { Checkbox, withCheckboxGroup } from '@fringeworks/react-primitives';
import { Checkbox, withCheckboxGroup } from '@fringeworks/react-primitives/checkbox';
import { withCheckboxGroup } from '@fringeworks/react-primitives/checkbox/withCheckboxGroup';
```

From a feature path, you can also default-import its main export.

```ts
import withCheckboxGroup from '@fringeworks/react-primitives/checkbox/withCheckboxGroup';
```

Categories follow component families: a component and the group built from it (`Checkbox` with `useCheckboxGroup` and `withCheckboxGroup`, for example) are in the same category.

As materials for building components, it provides headless UI hooks, HOCs that take parts, and minimal components.

- They have no look (styles) and add no CSS classes. Pass `className` (including through `partsProps`) yourself.
- Their props follow the value and operation contract (`value`, `defaultValue`, `onValueChange`, `disabled`, `readOnly`, `required`, `invalid`, `options`, `open`, `defaultOpen`, `onOpenChange`, `onMainAction`, `onInputValueChange`, and so on).
- Controlled and uncontrolled states follow `useControllableState` of `@fringeworks/react-utils`. A state is controlled when `value` is not `undefined`.

## API

### checkbox

| Name                       | Description                                            |
| -------------------------- | ------------------------------------------------------ |
| `Checkbox`                 | `ComponentType<CheckboxSlotProps>`                     | The checkbox that draws the options |
| `useCheckboxGroup(props)`  | Handles the behavior of a checkbox group (headless UI) |
| `withCheckboxGroup(parts)` | Creates a checkbox group drawn with the given checkbox |

#### `Checkbox`

```tsx
<Checkbox value={checked} onValueChange={setChecked}>
  Apple
</Checkbox>
```

Places an `<input type="checkbox">` and `children` inside a `<label>`.

| Property         | Type                       | Description                                                                    |
| ---------------- | -------------------------- | ------------------------------------------------------------------------------ |
| `value?`         | `boolean`                  | Whether it is checked (controlled)                                             |
| `defaultValue?`  | `boolean`                  | The initial checked state (uncontrolled). Defaults to `false`                  |
| `onValueChange?` | `(value: boolean) => void` | Called when the checked state is toggled                                       |
| `disabled?`      | `boolean`                  | Disables the checkbox                                                          |
| `readOnly?`      | `boolean`                  | Keeps the display but prevents toggling (sets `aria-readonly`)                 |
| `required?`      | `boolean`                  | Makes it required                                                              |
| `invalid?`       | `boolean`                  | Indicates that the value is invalid (sets `aria-invalid`)                      |
| `indeterminate?` | `boolean`                  | Shows the indeterminate state. Does not change `value`                         |
| `children?`      | `ReactNode`                | The content shown next to the checkbox                                         |
| `partsProps?`    | `{ input?: InputProps }`   | Props passed to the `<input>` (`name`, `id`, `ref`, event handlers, and so on) |

- Other props (`className`, `style`, and so on) are passed to the `<label>`.
- `partsProps.input` cannot set the attributes that `Checkbox` sets itself (`type`, `checked`, `disabled`, `readOnly`, `required`, and so on). Event handlers and `ref` are combined.
- `indeterminate` has no HTML attribute, so it is set as a DOM property.

#### `useCheckboxGroup`

```ts
useCheckboxGroup<V>(props: UseCheckboxGroupProps<V>): UseCheckboxGroupResult<V>
```

Handles the behavior of a checkbox group. It lays out checkboxes from the options, builds the array of selected values, and derives the state of "select all". You decide what to render and pass the props returned by `get*Props` to your own parts.

```tsx
const group = useCheckboxGroup({ options, value, onValueChange: setValue });

<div {...group.getContainerProps()}>
  {group.displayOptions.map((option) => (
    <MyCheckbox key={option.value} {...group.getCheckboxProps(option)} />
  ))}
</div>;
```

| Property                     | Type                           | Description                                                                                 |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `options`                    | `readonly Option<V>[]`         | The options                                                                                 |
| `value?`                     | `readonly V[]`                 | The selected values (controlled)                                                            |
| `defaultValue?`              | `readonly V[]`                 | The initial selected values (uncontrolled). Defaults to `[]`                                |
| `onValueChange?`             | `(value: V[]) => void`         | Called when the selected values are changed                                                 |
| `disabled?`                  | `boolean`                      | Disables all checkboxes                                                                     |
| `readOnly?`                  | `boolean`                      | Keeps the display but prevents changing the selected values                                 |
| `invalid?`                   | `boolean`                      | Indicates that the value is invalid                                                         |
| `unlistedPlacement?`         | `'hidden' \| 'start' \| 'end'` | Where to show unlisted values (values in `value` but not in `options`). Defaults to `'end'` |
| `keepUnlisted?`              | `boolean`                      | Keeps unlisted values as options even after they are unchecked                              |
| `selectAllIncludesUnlisted?` | `boolean`                      | Includes unlisted values in "select all" and "deselect all"                                 |

| Result              | Type                                              | Description                                                                                |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `value`             | `readonly V[]`                                    | The current selected values                                                                |
| `displayOptions`    | `DisplayOption<V>[]`                              | The options to show, including unlisted values (`label` defaults to `String(value)`)       |
| `isChecked`         | `(value: V) => boolean`                           | Whether the value is selected                                                              |
| `setChecked`        | `(value: V, checked: boolean) => void`            | Selects or deselects the value                                                             |
| `selectAllState`    | `'checked' \| 'unchecked' \| 'indeterminate'`     | The state of "select all"                                                                  |
| `setAllChecked`     | `(checked: boolean) => void`                      | Selects or deselects all                                                                   |
| `getCheckboxProps`  | `(option: DisplayOption<V>) => CheckboxSlotProps` | Creates the props for the checkbox of an option                                            |
| `getSelectAllProps` | `() => CheckboxSlotProps`                         | Creates the props for the "select all" checkbox (without `children`)                       |
| `getContainerProps` | `() => CheckboxGroupContainerProps`               | Creates the attributes for the container (`role="group"`, `aria-disabled`, `aria-invalid`) |

- The selected values are passed as a new array in display order (the order of the options and the position of unlisted values). Unlisted values that are not shown (`'hidden'`) stay at the end.
- Values are compared with `Object.is`. Nothing is notified when the state does not change.
- When `disabled` or `readOnly`, and for disabled options, the value is not changed.
- The state of "select all" depends on how the enabled options are selected. "Select all" and "deselect all" do not change disabled options. When there is no enabled option, the "select all" checkbox is disabled.
- `keepUnlisted` keeps the unlisted values that appeared in `value` while mounted (in the order they appeared). Values that are later added to `options` are not treated as unlisted.

#### `withCheckboxGroup`

```ts
withCheckboxGroup(parts: CheckboxGroupParts): <V>(props: CheckboxGroupProps<V>) => ReactElement
```

Creates a checkbox group drawn with the given checkbox. Create it once in your app and place it on screens as it is.

```tsx
// Create once in your app
export const AppCheckboxGroup = withCheckboxGroup({ Checkbox: AppCheckbox });

// Place it on screens
<AppCheckboxGroup
  options={options}
  value={value}
  onValueChange={setValue}
  showSelectAll
  selectAllLabel="Select all"
/>;
```

| Part         | Type                               | Description                                              |
| ------------ | ---------------------------------- | -------------------------------------------------------- |
| `Checkbox`   | `ComponentType<CheckboxSlotProps>` | The checkbox that draws the options                      |
| `SelectAll?` | `ComponentType<CheckboxSlotProps>` | The part that draws "select all". Defaults to `Checkbox` |

The created component takes the props of `useCheckboxGroup` and the following props.

| Property          | Type        | Description                                                                 |
| ----------------- | ----------- | --------------------------------------------------------------------------- |
| `showSelectAll?`  | `boolean`   | Shows the "select all" checkbox before the options                          |
| `selectAllLabel?` | `ReactNode` | The label of the "select all" checkbox. Without it, only the checkbox shows |

- Places the checkboxes inside a `<div role="group">`. Other props (`className`, `style`, `aria-label`, and so on) are passed to the `<div>`.
- It has no layout (vertical or horizontal). Decide it with `className` and so on.
- The checkbox receives `CheckboxSlotProps`. The label of an option is passed as `children`. `indeterminate` is passed only to the "select all" checkbox, so the checkbox does not need to support it unless you use "select all".
- You can pass `Checkbox` as it is (`withCheckboxGroup({ Checkbox })`).
- To give "select all" a different look or part from the options, pass `SelectAll` (e.g. `withCheckboxGroup({ Checkbox, SelectAll: AppSelectAll })`).

### radio

| Name                    | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `Radio`                 | `ComponentType<RadioSlotProps>`                         | The radio button that draws the options |
| `useRadioGroup(props)`  | Handles the behavior of a radio group (headless UI)     |
| `withRadioGroup(parts)` | Creates a radio group drawn with the given radio button |

#### `Radio`

```tsx
<Radio value={selected} onValueChange={select} name="size">
  S
</Radio>
```

A radio button for a radio group. Places an `<input type="radio">` and `children` inside a `<label>`. A radio button is not used alone, so it takes only a controlled `value`. Usually you pass it to `withRadioGroup({ Radio })`.

| Property         | Type                       | Description                                                                                   |
| ---------------- | -------------------------- | --------------------------------------------------------------------------------------------- |
| `value`          | `boolean`                  | Whether it is selected                                                                        |
| `onValueChange?` | `(value: boolean) => void` | Called when it is selected (a radio button cannot be cleared, so it always passes `true`)     |
| `name?`          | `string`                   | The group name. Radio buttons with the same name act as one group with the Tab and arrow keys |
| `disabled?`      | `boolean`                  | Disables it                                                                                   |
| `readOnly?`      | `boolean`                  | Keeps it as it is and prevents selecting                                                      |
| `required?`      | `boolean`                  | Marks it as required (one of the group must be selected)                                      |
| `invalid?`       | `boolean`                  | Marks the value as invalid (no ARIA attribute is set; see below)                              |
| `children?`      | `ReactNode`                | The content shown next to the radio button                                                    |
| `partsProps?`    | `{ input?: InputProps }`   | Props for the `<input>` (`id`, `ref`, event handlers, and so on)                              |

- Other props (`className`, `style`, and so on) are passed to the `<label>`.
- `aria-readonly` and `aria-invalid` cannot be set on a radio button, so `useRadioGroup` sets them on the container (`role="radiogroup"`). `invalid` is passed so that a part can change its look.

#### `useRadioGroup`

```ts
useRadioGroup<V>(props: UseRadioGroupProps<V>): UseRadioGroupResult<V>
```

Handles the behavior of a radio group. Lays out radio buttons from the options and holds one selected value. You decide what to draw and pass the props from `get*Props` to your own parts.

```tsx
const group = useRadioGroup({ options, value, onValueChange: setValue });

<div {...group.getContainerProps()}>
  {group.displayOptions.map((option) => (
    <MyRadio key={option.value} {...group.getRadioProps(option)} />
  ))}
</div>;
```

| Property             | Type                           | Description                                                                                 |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `options`            | `readonly Option<V>[]`         | The options                                                                                 |
| `value?`             | `V \| null`                    | The selected value (controlled). `null` when nothing is selected                            |
| `defaultValue?`      | `V \| null`                    | The initial selected value (uncontrolled). Defaults to `null`                               |
| `onValueChange?`     | `(value: V) => void`           | Called when a value is selected                                                             |
| `disabled?`          | `boolean`                      | Disables all the radio buttons                                                              |
| `readOnly?`          | `boolean`                      | Keeps it as it is and prevents changing the selected value                                  |
| `required?`          | `boolean`                      | Marks it as required                                                                        |
| `invalid?`           | `boolean`                      | Marks the value as invalid                                                                  |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | Where to show unlisted values (values in `value` but not in `options`). Defaults to `'end'` |
| `keepUnlisted?`      | `boolean`                      | Keeps an unlisted value as an option after another one is selected                          |

| Result              | Type                                           | Description                                                                                                                       |
| ------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `value`             | `V \| null`                                    | The current selected value                                                                                                        |
| `displayOptions`    | `DisplayOption<V>[]`                           | The options to show (including unlisted values; an option without `label` shows `String(value)`)                                  |
| `isChecked`         | `(value: V) => boolean`                        | Whether the value is selected                                                                                                     |
| `check`             | `(value: V) => void`                           | Selects the value                                                                                                                 |
| `getRadioProps`     | `(option: DisplayOption<V>) => RadioSlotProps` | Creates the props for the radio button of an option                                                                               |
| `getContainerProps` | `() => RadioGroupContainerProps`               | Creates the attributes for the container (`role="radiogroup"`, `aria-disabled`, `aria-readonly`, `aria-required`, `aria-invalid`) |

- A selected value cannot be cleared (the same as HTML radio buttons). To return to no selection, the parent sets `value` to `null`.
- Each radio button gets a shared `name` (created with `useId`). With HTML radio buttons, the browser handles the Tab and arrow keys. It is not used for form submission.
- Values are compared with `Object.is`. Selecting the selected value again does not notify.
- While `disabled` or `readOnly`, and for `disabled` options, the value does not change.

#### `withRadioGroup`

```ts
withRadioGroup(parts: RadioGroupParts): <V>(props: RadioGroupProps<V>) => ReactElement
```

Creates a radio group drawn with the given radio button.

```tsx
const RadioGroup = withRadioGroup({ Radio });

<RadioGroup options={sizes} value={size} onValueChange={setSize} />;
```

| Part    | Type                            | Description                             |
| ------- | ------------------------------- | --------------------------------------- |
| `Radio` | `ComponentType<RadioSlotProps>` | The radio button that draws the options |

- The created component takes the same props as `useRadioGroup`.
- Places the radio buttons inside a `<div role="radiogroup">`. Other props are passed to the `<div>`. It has no layout (vertical or horizontal).
- The radio button receives `RadioSlotProps`. A part that does not use HTML radio buttons (such as a button) may ignore `name`; it then needs to handle the keyboard itself.

### optionLabel

| Name           | Description                                                                  |
| -------------- | ---------------------------------------------------------------------------- |
| `OptionLabel`  | Shows the selected value with the label of its option (single value)         |
| `OptionLabels` | Shows the selected values with the labels of their options (multiple values) |

#### `OptionLabel`

```tsx
<OptionLabel options={sizes} value={size} placeholder="None" />
```

Shows the selected value with the label of its option, inside a `<span>`. Given the same `value`, `options`, and `unlistedPlacement` as a single-value component such as `RadioGroup`, it shows the same thing.

| Property             | Type                           | Description                                                            |
| -------------------- | ------------------------------ | ---------------------------------------------------------------------- |
| `value`              | `V \| null`                    | The value to show                                                      |
| `options`            | `readonly Option<V>[]`         | The options                                                            |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | Where to show unlisted values. Not shown when `'hidden'`               |
| `placeholder?`       | `ReactNode`                    | The content shown when the value is empty (`null`) or nothing is shown |

- Other props are passed to the `<span>`.
- An unlisted value is shown as `String(value)`.
- An empty string is treated as a value. To give it a label, add it to `options`, such as `{ value: '', label: 'None' }`.

#### `OptionLabels`

```tsx
<OptionLabels options={fruits} value={selected} separator=" / " />
```

Shows the selected values with the labels of their options. Given the same `value`, `options`, and `unlistedPlacement` as a multiple-value component such as `CheckboxGroup`, it shows the same thing.

| Property             | Type                           | Description                                                                    |
| -------------------- | ------------------------------ | ------------------------------------------------------------------------------ |
| `value`              | `readonly V[]`                 | The values to show                                                             |
| `options`            | `readonly Option<V>[]`         | The options                                                                    |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | Where to show unlisted values. Not shown when `'hidden'`                       |
| `separator?`         | `ReactNode`                    | The content between labels. Defaults to `', '`                                 |
| `placeholder?`       | `ReactNode`                    | The content shown when the value is empty (an empty array) or nothing is shown |

- The labels are in the order an input component shows them (the order of the options and the position of unlisted values).
- Other props are passed to the `<span>`.

### button

| Name                     | Description                                          |
| ------------------------ | ---------------------------------------------------- |
| `Button`                 | `ComponentType<ButtonSlotProps>`                     | The button that draws the options |
| `useButtonGroup(props)`  | Handles the behavior of a button group (headless UI) |
| `withButtonGroup(parts)` | Creates a button group drawn with the given button   |

#### `Button`

```tsx
<Button value="save" onMainAction={run}>
  Save
</Button>
```

A button that follows the value and operation contract (`onMainAction`). When pressed, it passes `value` to `onMainAction` as it is.

| Property        | Type                              | Description                                                                     |
| --------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| `value?`        | `V`                               | The value passed to `onMainAction` when pressed. `undefined` if omitted         |
| `onMainAction?` | `(value: V) => void`              | Called when pressed                                                             |
| `disabled?`     | `boolean`                         | Disables it                                                                     |
| `type?`         | `'button' \| 'submit' \| 'reset'` | The HTML `type`. Defaults to `'button'` (it does not submit even inside a form) |

- It calls `onClick` first, and does not call `onMainAction` if `event.preventDefault()` was called there. Use it to stop the main action under a condition.
- `value` is not passed to the `value` of the HTML `<button>` (its type is generic).
- Other props (`className`, `ref`, and so on) are passed to the `<button>`.

#### `useButtonGroup`

```ts
useButtonGroup<V>(props: UseButtonGroupProps<V>): UseButtonGroupResult<V>
```

Handles the behavior of a button group. Lays out buttons from the options and passes the `value` of the pressed button's option to `onMainAction`. It has no state.

| Property        | Type                   | Description                     |
| --------------- | ---------------------- | ------------------------------- |
| `options`       | `readonly Option<V>[]` | The options                     |
| `onMainAction?` | `(value: V) => void`   | Called when a button is pressed |
| `disabled?`     | `boolean`              | Disables all the buttons        |

| Result              | Type                                            | Description                                                                |
| ------------------- | ----------------------------------------------- | -------------------------------------------------------------------------- |
| `displayOptions`    | `DisplayOption<V>[]`                            | The options to show (an option without `label` shows `String(value)`)      |
| `getButtonProps`    | `(option: DisplayOption<V>) => ButtonSlotProps` | Creates the props for the button of an option                              |
| `getContainerProps` | `() => ButtonGroupContainerProps`               | Creates the attributes for the container (`role="group"`, `aria-disabled`) |

- The `onMainAction` from `getButtonProps` notifies the option's `value`, whatever the button passes.

#### `withButtonGroup`

```ts
withButtonGroup(parts: ButtonGroupParts): <V>(props: ButtonGroupProps<V>) => ReactElement
```

Creates a button group drawn with the given button.

```tsx
const ButtonGroup = withButtonGroup({ Button });

<ButtonGroup options={actions} onMainAction={run} />;
```

| Part     | Type                             | Description                       |
| -------- | -------------------------------- | --------------------------------- |
| `Button` | `ComponentType<ButtonSlotProps>` | The button that draws the options |

- The created component takes the same props as `useButtonGroup`.
- Places the buttons inside a `<div role="group">`. Other props are passed to the `<div>`. It has no layout (vertical or horizontal).
- You can pass `Button` of react-primitives as it is. A single `Button` and the group can share the same `onMainAction` handler.

### textInput

| Name                  | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| `TextInput`           | A text input that follows the value and operation contract                   |
| `useTextInput(props)` | Handles the behavior of a text input (the draft and committing; headless UI) |

#### `TextInput`

```tsx
<TextInput value={name} onValueChange={setName} placeholder="Name" />
```

A text input that follows the value and operation contract. It renders an `<input>`, keeps the text being typed as a draft, and calls `onValueChange` when the text is committed.

| Property              | Type                                                            | Description                                                 |
| --------------------- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| `value?`              | `string`                                                        | The committed text (controlled)                             |
| `defaultValue?`       | `string`                                                        | The initial committed text (uncontrolled). Defaults to `''` |
| `onValueChange?`      | `(value: string) => void`                                       | Called when the text is committed                           |
| `onInputValueChange?` | `(text: string) => void`                                        | Called on every input (with the text in the input)          |
| `valueChangeTiming?`  | `'commit' \| 'input'`                                           | When to call `onValueChange`. Defaults to `'commit'`        |
| `disabled?`           | `boolean`                                                       | Disables it                                                 |
| `readOnly?`           | `boolean`                                                       | Prevents changing the text                                  |
| `required?`           | `boolean`                                                       | Marks it as required                                        |
| `invalid?`            | `boolean`                                                       | Marks the value as invalid (sets `aria-invalid`)            |
| `type?`               | `'text' \| 'search' \| 'email' \| 'url' \| 'tel' \| 'password'` | The HTML `type`. Defaults to `'text'`                       |

| `valueChangeTiming` | When `onValueChange` is called                    |
| ------------------- | ------------------------------------------------- |
| `'commit'`          | When the text is committed (on blur, or on Enter) |
| `'input'`           | On every input                                    |

- Enter during IME composition does not commit (so that the Enter that confirms a conversion does not commit the value).
- Escape returns the text in the input to the committed value.
- It does not notify when nothing changed.
- When the parent changes `value`, the text in the input is replaced, even while typing. When the parent does not accept the committed text (does not change `value`), it also returns to the parent's value.
- `onKeyDown`, `onChange`, and `onBlur` are called before the component's own handling. If `onKeyDown` calls `event.preventDefault()`, Enter and Escape are not handled.
- The empty value is `''`. `placeholder` is passed as the HTML attribute.
- Other props (`className`, `ref`, and so on) are passed to the `<input>`.

#### `useTextInput`

```ts
useTextInput(props: UseTextInputProps): UseTextInputResult
```

Handles the behavior of a text input (the draft and committing). You can add the same committing behavior to an input of another UI library. It takes the same `value`, `defaultValue`, `onValueChange`, `onInputValueChange`, and `valueChangeTiming` as `TextInput`.

```tsx
const textInput = useTextInput({ value, onValueChange: setValue });

<MyInput {...textInput.getInputProps({ onKeyDown: myKeyDown })} />;
```

| Result          | Type                                                      | Description                                                                                                                                |
| --------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `value`         | `string`                                                  | The committed text                                                                                                                         |
| `inputValue`    | `string`                                                  | The text in the input (the draft)                                                                                                          |
| `commit`        | `() => void`                                              | Commits the text in the input                                                                                                              |
| `getInputProps` | `(handlers?: TextInputHandlers) => TextInputElementProps` | Creates the props for the `<input>` (`value`, `onChange`, `onBlur`, `onKeyDown`). Your handlers are called before the component's handling |

### collapsible

| Name                    | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `Collapsible`           | A collapsible component that follows the value and operation contract |
| `useCollapsible(props)` | Handles the behavior of a collapsible component (headless UI)         |

#### `Collapsible`

```tsx
<Collapsible summary="Details" open={open} onOpenChange={setOpen}>
  …content…
</Collapsible>
```

A collapsible component that follows the value and operation contract (`open`, `defaultOpen`, `onOpenChange`). Places a `<summary>` with `summary` and `children` inside an HTML `<details>`.

| Property        | Type                         | Description                                                            |
| --------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `open?`         | `boolean`                    | Whether it is open (controlled)                                        |
| `defaultOpen?`  | `boolean`                    | The initial open state (uncontrolled). Defaults to `false`             |
| `onOpenChange?` | `(open: boolean) => void`    | Called when it opens or closes                                         |
| `disabled?`     | `boolean`                    | Prevents opening and closing (sets `aria-disabled` on the `<summary>`) |
| `summary?`      | `ReactNode`                  | The heading (the content of the `<summary>`)                           |
| `children?`     | `ReactNode`                  | The content shown when open                                            |
| `partsProps?`   | `{ summary?: SummaryProps }` | Props for the `<summary>` (`className`, event handlers, and so on)     |

- Pressing the heading (also with Enter or Space) stops the browser's toggle and calls `onOpenChange`. When controlled, it opens or closes only when the parent changes `open`.
- When the browser opens or closes it on its own (such as opening it when find-in-page finds text inside), it also calls `onOpenChange`. When controlled and the parent does not accept it, it returns to the previous state.
- The `onClick` of `partsProps.summary` is called first; if it calls `event.preventDefault()`, it does not open or close.
- The content stays rendered and hidden while closed (the same as HTML `<details>`). The state of inputs inside is kept.
- Other props (`className`, `ref`, and so on) are passed to the `<details>`.

#### `useCollapsible`

```ts
useCollapsible(props: UseCollapsibleProps): UseCollapsibleResult
```

Handles the behavior of a collapsible component. It takes the same `open`, `defaultOpen`, `onOpenChange`, and `disabled` as `Collapsible`.

```tsx
const collapsible = useCollapsible({ open, onOpenChange: setOpen });

<details {...collapsible.getDetailsProps()}>
  <summary {...collapsible.getSummaryProps()}>Heading</summary>
  Content
</details>;
```

| Result            | Type                                     | Description                                                                                        |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `open`            | `boolean`                                | Whether it is open                                                                                 |
| `setOpen`         | `(open: boolean) => void`                | Opens or closes it (does nothing while `disabled`)                                                 |
| `getDetailsProps` | `(handlers?) => CollapsibleDetailsProps` | Creates the props for the `<details>` (`open`, `onToggle`). Your `onToggle` is called first        |
| `getSummaryProps` | `(handlers?) => CollapsibleSummaryProps` | Creates the props for the `<summary>` (`onClick`, `aria-disabled`). Your `onClick` is called first |

### Types

The types of the value and operation contract, such as `Option<V>`, `DisplayOption<V>`, and `UnlistedPlacementProps`, are in [`@fringeworks/react-contract`](https://github.com/fringeworks-js/react-contract).

| Type                          | Description                                                                                   |
| ----------------------------- | --------------------------------------------------------------------------------------------- |
| `CheckboxProps`               | The props of `Checkbox`                                                                       |
| `UseCheckboxGroupProps<V>`    | The props `useCheckboxGroup` takes (the same as the component created by `withCheckboxGroup`) |
| `UseCheckboxGroupResult<V>`   | The result of `useCheckboxGroup`                                                              |
| `SelectAllState`              | The state of "select all"                                                                     |
| `CheckboxSlotProps`           | The props a checkbox in a checkbox group receives                                             |
| `CheckboxGroupContainerProps` | The attributes for the container                                                              |
| `CheckboxGroupParts`          | The parts passed to `withCheckboxGroup`                                                       |
| `CheckboxGroupProps<V>`       | The props of the component created by `withCheckboxGroup`                                     |
| `RadioProps`                  | The props of `Radio`                                                                          |
| `UseRadioGroupProps<V>`       | The props `useRadioGroup` takes (the same as the component created by `withRadioGroup`)       |
| `UseRadioGroupResult<V>`      | The result of `useRadioGroup`                                                                 |
| `RadioSlotProps`              | The props a radio button in a radio group receives                                            |
| `RadioGroupContainerProps`    | The attributes for the container                                                              |
| `RadioGroupParts`             | The parts passed to `withRadioGroup`                                                          |
| `RadioGroupProps<V>`          | The props of the component created by `withRadioGroup`                                        |
| `OptionLabelProps<V>`         | The props of `OptionLabel`                                                                    |
| `OptionLabelsProps<V>`        | The props of `OptionLabels`                                                                   |
| `ButtonProps<V>`              | The props of `Button`                                                                         |
| `UseButtonGroupProps<V>`      | The props `useButtonGroup` takes (the same as the component created by `withButtonGroup`)     |
| `UseButtonGroupResult<V>`     | The result of `useButtonGroup`                                                                |
| `ButtonSlotProps`             | The props a button in a button group receives                                                 |
| `ButtonGroupContainerProps`   | The attributes for the container                                                              |
| `ButtonGroupParts`            | The parts passed to `withButtonGroup`                                                         |
| `ButtonGroupProps<V>`         | The props of the component created by `withButtonGroup`                                       |
| `TextInputProps`              | The props of `TextInput`                                                                      |
| `TextInputType`               | The `type` values `TextInput` accepts                                                         |
| `UseTextInputProps`           | The props `useTextInput` takes                                                                |
| `UseTextInputResult`          | The result of `useTextInput`                                                                  |
| `ValueChangeTiming`           | When to call `onValueChange`                                                                  |
| `TextInputHandlers`           | Your handlers passed to `getInputProps`                                                       |
| `TextInputElementProps`       | The props for the `<input>` created by `getInputProps`                                        |
| `CollapsibleProps`            | The props of `Collapsible`                                                                    |
| `UseCollapsibleProps`         | The props `useCollapsible` takes                                                              |
| `UseCollapsibleResult`        | The result of `useCollapsible`                                                                |
| `CollapsibleDetailsProps`     | The props for the `<details>`                                                                 |
| `CollapsibleSummaryProps`     | The props for the `<summary>`                                                                 |

## License

MIT
