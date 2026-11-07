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
import {
  Checkbox,
  withCheckboxGroup,
} from '@fringeworks/react-primitives/checkbox';
import { withCheckboxGroup } from '@fringeworks/react-primitives/checkbox/withCheckboxGroup';
```

From a feature path, you can also default-import its main export.

```ts
import withCheckboxGroup from '@fringeworks/react-primitives/checkbox/withCheckboxGroup';
```

Categories follow component families: a component and the group built from it (`Checkbox` with `useCheckboxGroup` and `withCheckboxGroup`, for example) are in the same category.

As materials for building components, it provides headless UI hooks, HOCs that take parts, and minimal components.

| Kind      | Example                                   | Role                                                                                                                                                                                                         |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hook      | `useCheckbox`, `useTable`                 | Handles the behavior (state, how the value changes and is reported, ARIA attributes) and returns props for elements or data expanded into the units to draw. Use it to decide every element yourself         |
| HOC       | `withCheckbox(parts)`, `withTable(parts)` | Uses the hook and decides which element goes inside which and which element receives which props. Every element it draws can be replaced as a part. Create it once in your app and place it as is on screens |
| Component | `Checkbox`, `Table`                       | Created by the HOC without any parts (`const Checkbox = withCheckbox()`). It has no implementation of its own, so it behaves the same as the ones you create with the HOC                                    |

- Display components with no state and no events (`OptionLabel` and `OptionLabels`) have no hook; they create what to show with `createSelectedOptions` of `@fringeworks/react-contract`. Components with the same behavior share a hook (`Switch` uses `useCheckbox`).
- Every part of group HOCs (`withCheckboxGroup` and so on) can be omitted as well. When the checkbox and so on are omitted, they are drawn with `Checkbox` and so on of react-primitives.
- Ready-to-use components with a look are in [`@fringeworks/react-components`](https://github.com/fringeworks-js/react-components).

All of them follow these rules.

- They have no look (styles) and add no CSS classes. Pass `className` (including through `partsProps`) yourself.
- Their props follow the value and operation contract (`value`, `defaultValue`, `onValueChange`, `disabled`, `readOnly`, `required`, `invalid`, `options`, `open`, `defaultOpen`, `onOpenChange`, `onMainAction`, `onInputValueChange`, and so on).
- Controlled and uncontrolled states follow `useControllableState` of `@fringeworks/react-utils`. A state is controlled when `value` is not `undefined`.

## API

### checkbox

| Name                        | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| `Checkbox`                  | A checkbox that follows the value and operation contract       |
| `CheckboxGroup`             | A checkbox group that follows the value and operation contract |
| `withCheckbox(parts)`       | Creates a checkbox drawn with the given parts                  |
| `useCheckbox(props)`        | Handles the behavior of a checkbox (headless UI)               |
| `useCheckboxGroup(props)`   | Handles the behavior of a checkbox group (headless UI)         |
| `withCheckboxGroup(parts?)` | Creates a checkbox group drawn with the given checkbox         |

#### `Checkbox`

```tsx
<Checkbox value={checked} onValueChange={setChecked}>
  Apple
</Checkbox>
```

Places an `<input type="checkbox">` and `children` inside a `<label>`.

| Property         | Type                             | Description                                                                                        |
| ---------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `value?`         | `boolean`                        | Whether it is checked (controlled)                                                                 |
| `defaultValue?`  | `boolean`                        | The initial checked state (uncontrolled). Defaults to `false`                                      |
| `onValueChange?` | `(value: boolean) => void`       | Called when the checked state is toggled                                                           |
| `disabled?`      | `boolean`                        | Disables the checkbox                                                                              |
| `readOnly?`      | `boolean`                        | Keeps the display but prevents toggling (sets `aria-readonly`)                                     |
| `required?`      | `boolean`                        | Makes it required                                                                                  |
| `invalid?`       | `boolean`                        | Indicates that the value is invalid (sets `aria-invalid`)                                          |
| `indeterminate?` | `boolean`                        | Shows the indeterminate state. Does not change `value`                                             |
| `children?`      | `ReactNode`                      | The content shown next to the checkbox                                                             |
| `partsProps?`    | `{ label?; input?; indicator? }` | Props passed to the `<label>`, the `<input>`, or the indicator (when `Indicator` is given) by name |

- The primary element is the `<input>`. `className` and `style` are passed to the `<label>`; other props (`ref`, `id`, `name`, `aria-*`, `data-*`, event handlers, and so on) are passed to the `<input>`. You can associate it with outside elements through `aria-labelledby`, `aria-describedby`, and so on.
- Pass a `ref` or attributes for the `<label>` through `partsProps.label`. Props given through `partsProps.label` or `partsProps.input` take precedence over the same props given at the top level (`className`, `style`, event handlers, and `ref` are combined).
- `onChange` is called before the component's handling; if it calls `event.preventDefault()`, the check does not toggle.
- The attributes that `Checkbox` sets itself (`type`, `checked`, `disabled`, `readOnly`, `required`, and so on) cannot be passed to the `<input>`.
- `indeterminate` has no HTML attribute, so it is set as a DOM property.

#### `withCheckbox`

```ts
withCheckbox<P extends CheckboxParts>(parts?: P): (props: CheckboxProps<P>) => ReactElement
```

Creates a checkbox drawn with the given parts. `Checkbox` is the one created without parts.

| Part         | Type          | Description                                                                                                                                                                                                                |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Label?`     | `ElementType` | The `<label>` that wraps the `<input>` and the text (the root). Pass the props it receives (`children` and so on) to its element                                                                                           |
| `Input?`     | `ElementType` | The `<input type="checkbox">` (the primary element). Pass the props it receives (`type`, `checked`, `onChange`, `ref`, and so on) to the `<input>`                                                                         |
| `Indicator?` | `ElementType` | The indicator of the state, drawn right after the `<input>`. Not drawn when omitted. Anything that accepts `CheckboxIndicatorSlotProps` (`checked`, `indeterminate`, `disabled`, `readOnly`, `invalid`, and `aria-hidden`) |

- The created component takes the same props as `Checkbox`.
- The props of the given parts become the types of the created component. The primary element is the `<input>`, so the remaining top-level props are the props of `Input`, `partsProps.label` is the props of `Label`, and `partsProps.input` is the props of `Input` (pass required props of `Input` at the top level). If `Label` has required props, `partsProps` becomes required too.
- `Input` must pass `ref` to the `<input>` (to set `indeterminate` on the DOM).
- `Indicator` receives the state as props (they win over `partsProps.indicator`). The indicator is decorative, so it always receives `aria-hidden`. Give a part that draws the indicator from the state it receives (a plain element would get the state as DOM attributes). It has no look, so write the CSS yourself, such as hiding the `<input>` (the indicator comes right after the `<input>`, so `input:focus-visible + indicator` can draw the focus outline).

```tsx
const AppCheckbox = withCheckbox({ Indicator: CheckIcon });
```

#### `useCheckbox`

```ts
useCheckbox(props: UseCheckboxProps): UseCheckboxResult
```

Handles the behavior of a checkbox. The props are the same as `value`, `defaultValue`, `onValueChange`, `disabled`, `readOnly`, `required`, `invalid`, and `indeterminate` of `Checkbox`.

```tsx
const checkbox = useCheckbox({ value, onValueChange: setValue });

<label>
  <input {...checkbox.getInputProps()} />
  Apple
</label>;
```

| Return value    | Type                                | Description                                                                                                                                                            |
| --------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `boolean`                           | Whether it is checked                                                                                                                                                  |
| `getInputProps` | `(handlers?) => CheckboxInputProps` | Creates the props for the `<input>` (`type`, `checked`, `disabled`, `required`, `aria-readonly`, `aria-invalid`, `ref`, `onChange`). Calls the user's `onChange` first |

- The `ref` is for setting `indeterminate` on the DOM. If you also use your own ref, combine them.

#### `CheckboxGroup`

```tsx
<CheckboxGroup
  options={fruits}
  value={selected}
  onValueChange={setSelected}
  showSelectAll
  selectAllLabel="All"
/>
```

A checkbox group that follows the value and operation contract. It is created by `withCheckboxGroup` without any parts, drawing the container with `<div>` and the checkboxes with `Checkbox`. It takes the same props as a component created with `withCheckboxGroup`. It has no look and no layout (vertical or horizontal); decide them with `className` (including through `partsProps`).

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
withCheckboxGroup<P extends CheckboxGroupParts>(parts?: P): <V>(props: CheckboxGroupProps<V, P>) => ReactElement
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

| Part         | Type          | Description                                                                                                                                     |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | The container that lays out the parts. Defaults to `<div>`. Pass the props it receives (`role`, `aria-*`, `children`, and so on) to its element |
| `Checkbox?`  | `ElementType` | The checkbox that draws the options. Defaults to `Checkbox`. Anything that accepts `CheckboxSlotProps`                                          |
| `SelectAll?` | `ElementType` | The part that draws "select all". Defaults to `Checkbox`. Anything that accepts `CheckboxSlotProps`                                             |

The created component takes the props of `useCheckboxGroup` and the following props.

| Property          | Type                        | Description                                                                 |
| ----------------- | --------------------------- | --------------------------------------------------------------------------- |
| `showSelectAll?`  | `boolean`                   | Shows the "select all" checkbox before the options                          |
| `selectAllLabel?` | `ReactNode`                 | The label of the "select all" checkbox. Without it, only the checkbox shows |
| `partsProps?`     | `{ checkbox?; selectAll? }` | Props for the checkbox parts (see below)                                    |

- Places the checkboxes inside the container (`Container`, defaulting to `<div>`) with `role="group"` and so on. Other props (`className`, `style`, `aria-label`, and so on) are passed to the container.
- It has no layout (vertical or horizontal). Decide it with `className` and so on.
- The checkbox receives `CheckboxSlotProps`. The label of an option is passed as `children`. `indeterminate` is passed only to the "select all" checkbox, so the checkbox does not need to support it unless you use "select all".
- When omitted, the checkboxes are drawn with `Checkbox`. `CheckboxGroup` is the one created with every part omitted.
- The props of the given parts become the types of the created component. The remaining root props are the props of `Container`, and `partsProps.checkbox` / `partsProps.selectAll` are the props of the checkbox parts without the `CheckboxSlotProps` properties that the group decides. Pass `partsProps.checkbox` as a value or a function (it receives an option and decides per option). If a part has required props, `partsProps` becomes required too.
- If a part has a `CheckboxSlotProps` property with a different type (such as an `onValueChange` that receives an event), calling `withCheckboxGroup` is a type error. Wrap the part thinly to match.

```tsx
// A checkbox that takes size in addition to CheckboxSlotProps
const DsCheckboxGroup = withCheckboxGroup({ Checkbox: DsCheckbox });

<DsCheckboxGroup
  options={options}
  partsProps={{
    checkbox: { size: 'small' },
    selectAll: { size: 'small' },
  }}
/>;
```

- To give "select all" a different look or part from the options, pass `SelectAll` (e.g. `withCheckboxGroup({ Checkbox, SelectAll: AppSelectAll })`).

### radio

| Name                     | Description                                                 |
| ------------------------ | ----------------------------------------------------------- |
| `Radio`                  | A radio button for a radio group                            |
| `RadioGroup`             | A radio group that follows the value and operation contract |
| `withRadio(parts)`       | Creates a radio button drawn with the given parts           |
| `useRadio(props)`        | Handles the behavior of a radio button (headless UI)        |
| `useRadioGroup(props)`   | Handles the behavior of a radio group (headless UI)         |
| `withRadioGroup(parts?)` | Creates a radio group drawn with the given radio button     |

#### `Radio`

```tsx
<Radio value={selected} onValueChange={select} name="size">
  S
</Radio>
```

A radio button for a radio group. Places an `<input type="radio">` and `children` inside a `<label>`. A radio button is not used alone, so it takes only a controlled `value`. Usually you pass it to `withRadioGroup({ Radio })`.

| Property         | Type                             | Description                                                                                        |
| ---------------- | -------------------------------- | -------------------------------------------------------------------------------------------------- |
| `value`          | `boolean`                        | Whether it is selected                                                                             |
| `onValueChange?` | `(value: boolean) => void`       | Called when it is selected (a radio button cannot be cleared, so it always passes `true`)          |
| `name?`          | `string`                         | The group name. Radio buttons with the same name act as one group with the Tab and arrow keys      |
| `disabled?`      | `boolean`                        | Disables it                                                                                        |
| `readOnly?`      | `boolean`                        | Keeps it as it is and prevents selecting                                                           |
| `required?`      | `boolean`                        | Marks it as required (one of the group must be selected)                                           |
| `invalid?`       | `boolean`                        | Marks the value as invalid (no ARIA attribute is set; see below)                                   |
| `children?`      | `ReactNode`                      | The content shown next to the radio button                                                         |
| `partsProps?`    | `{ label?; input?; indicator? }` | Props passed to the `<label>`, the `<input>`, or the indicator (when `Indicator` is given) by name |

- The primary element is the `<input>`. `className` and `style` are passed to the `<label>`; other props (`ref`, `id`, `aria-*`, `data-*`, event handlers, and so on) are passed to the `<input>`. Pass props for the `<label>` through `partsProps.label` (the same as `Checkbox`).
- `onChange` is called before the component's handling; if it calls `event.preventDefault()`, it does not report.
- `aria-readonly` and `aria-invalid` cannot be set on a radio button, so `useRadioGroup` sets them on the container (`role="radiogroup"`). `invalid` is passed so that a part can change its look.

#### `withRadio`

```ts
withRadio<P extends RadioParts>(parts?: P): (props: RadioProps<P>) => ReactElement
```

Creates a radio button drawn with the given parts. `Radio` is the one created without parts. The parts (`Label`, `Input`, `Indicator`) and the typing rules are the same as `withCheckbox` (`Input` is an `<input type="radio">`, and `Indicator` receives `RadioIndicatorSlotProps`, without `indeterminate`).

#### `useRadio`

```ts
useRadio(props: UseRadioProps): UseRadioResult
```

Handles the behavior of a radio button. The props are the same as `value`, `onValueChange`, `name`, `disabled`, `readOnly`, `required`, and `invalid` of `Radio`.

| Return value    | Type                             | Description                                                                                                                            |
| --------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `getInputProps` | `(handlers?) => RadioInputProps` | Creates the props for the `<input>` (`type`, `name`, `checked`, `disabled`, `required`, `onChange`). Calls the user's `onChange` first |

#### `RadioGroup`

```tsx
<RadioGroup options={sizes} value={size} onValueChange={setSize} />
```

A radio group that follows the value and operation contract. It is created by `withRadioGroup` without any parts, drawing the container with `<div>` and the radio buttons with `Radio`. It takes the same props as a component created with `withRadioGroup`. It has no look and no layout.

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
withRadioGroup<P extends RadioGroupParts>(parts?: P): <V>(props: RadioGroupProps<V, P>) => ReactElement
```

Creates a radio group drawn with the given radio button. `RadioGroup` is the one created with every part omitted.

```tsx
const RadioGroup = withRadioGroup({ Radio });

<RadioGroup options={sizes} value={size} onValueChange={setSize} />;
```

| Part         | Type          | Description                                                                                                                                     |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | The container that lays out the parts. Defaults to `<div>`. Pass the props it receives (`role`, `aria-*`, `children`, and so on) to its element |
| `Radio?`     | `ElementType` | The radio button that draws the options. Defaults to `Radio`. Anything that accepts `RadioSlotProps`                                            |

- The created component takes the props of `useRadioGroup` and `partsProps?` (`{ radio? }`).
- The props of the given parts become the types of the created component (as in `withCheckboxGroup`). The remaining root props are the props of `Container`, and `partsProps.radio` is the props of the radio part without the `RadioSlotProps` properties. Pass it as a value or a function (per option).
- Places the radio buttons inside the container (`Container`, defaulting to `<div>`) with `role="radiogroup"` and so on. Other props are passed to the container. It has no layout (vertical or horizontal).
- The radio button receives `RadioSlotProps`. A part that does not use HTML radio buttons (such as a button) may ignore `name`; it then needs to handle the keyboard itself.

### switch

| Name                | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `Switch`            | A switch that follows the value and operation contract |
| `withSwitch(parts)` | Creates a switch drawn with the given parts            |

#### `Switch`

```tsx
<Switch value={enabled} onValueChange={setEnabled}>
  Receive notifications
</Switch>
```

A switch that follows the value and operation contract. Places an `<input type="checkbox" role="switch">` and `children` inside a `<label>`. It has no look, so it looks like a plain checkbox (react-components' `Switch` adds the look).

- The props and behavior are the same as `Checkbox` (the behavior is `useCheckbox`). It has no "neither" state (`indeterminate`).
- The primary element is the `<input>`. Pass props for the `<label>` through `partsProps.label` (the same as `Checkbox`).
- Its slot props match `CheckboxSlotProps`, so `withCheckboxGroup({ Checkbox: Switch })` creates a group of switches. When used as "select all", it does not pass `indeterminate` to the element (a partial selection looks off).

#### `withSwitch`

```ts
withSwitch<P extends SwitchParts>(parts?: P): (props: SwitchProps<P>) => ReactElement
```

Creates a switch drawn with the given parts. `Switch` is the one created without parts. The parts (`Label`, `Input`, `Indicator`) and the typing rules are the same as `withCheckbox` (`Indicator` receives `SwitchIndicatorSlotProps`, without `indeterminate`).

### optionLabel

| Name                      | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| `OptionLabel`             | Shows the selected value with the label of its option (single value)         |
| `OptionLabels`            | Shows the selected values with the labels of their options (multiple values) |
| `withOptionLabel(parts)`  | Creates an `OptionLabel` drawn with the given container                      |
| `withOptionLabels(parts)` | Creates an `OptionLabels` drawn with the given container                     |

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

| Property             | Type                           | Description                                                                                                                 |
| -------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `value`              | `readonly V[]`                 | The values to show                                                                                                          |
| `options`            | `readonly Option<V>[]`         | The options                                                                                                                 |
| `unlistedPlacement?` | `'hidden' \| 'start' \| 'end'` | Where to show unlisted values. Not shown when `'hidden'`                                                                    |
| `separator?`         | `ReactNode`                    | The content between labels. Defaults to `', '`                                                                              |
| `partsProps?`        | `{ label? }`                   | Props for the part that draws one label. A value, or a function that receives the displayed option (see `withOptionLabels`) |
| `placeholder?`       | `ReactNode`                    | The content shown when the value is empty (an empty array) or nothing is shown                                              |

- The labels are in the order an input component shows them (the order of the options and the position of unlisted values).
- Other props are passed to the `<span>`.

#### `withOptionLabel` / `withOptionLabels`

```ts
withOptionLabel<P extends OptionLabelParts>(parts?: P): <V>(props: OptionLabelProps<V, P>) => ReactElement
withOptionLabels<P extends OptionLabelsParts>(parts?: P): <V>(props: OptionLabelsProps<V, P>) => ReactElement
```

Creates an `OptionLabel` / `OptionLabels` drawn with the given container. `OptionLabel` and `OptionLabels` are the ones created without parts.

| Part         | Type          | Description                                                                                                                                                                   |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | The element that holds the label text (for `OptionLabels`, the labels). Defaults to `<span>`. Pass the props it receives (`children` and so on) to its element                |
| `Label?`     | `ElementType` | `OptionLabels` only. The part that draws one label (to look like a chip, for example). Defaults to `<span>`. Pass the props it receives (`children` and so on) to its element |

- The created component takes the same props as `OptionLabel` / `OptionLabels`. Other props are passed to `Container`, and their types are the props of `Container`.
- `partsProps.label` of `OptionLabels` is the props of `Label` without `children`. Pass it as a value or a function that receives the displayed option (`DisplayOption<V>`, the same as `partsProps.checkbox` of `CheckboxGroup`). If the part has required props, `partsProps` becomes required too. The `placeholder` for an empty value is not wrapped in `Label`.

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

| Name                      | Description                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `Button`                  | A button that follows the value and operation contract (`onMainAction`)                     |
| `ButtonGroup`             | A button group that follows the value and operation contract (`options` and `onMainAction`) |
| `withButton(parts?)`      | Creates a button drawn with the given part                                                  |
| `useButton(props)`        | Handles the behavior of a button (headless UI)                                              |
| `useButtonGroup(props)`   | Handles the behavior of a button group (headless UI)                                        |
| `withButtonGroup(parts?)` | Creates a button group drawn with the given button                                          |

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

#### `withButton`

```ts
withButton<P extends ButtonParts>(parts?: P): <V = undefined>(props: ButtonProps<V, P>) => ReactElement
```

Creates a button drawn with the given part. `Button` is the one created without parts.

| Part      | Type          | Description                                                                                                                                                                       |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button?` | `ElementType` | The element to press (the primary element and the root). Defaults to `<button>`. Pass the props it receives (`type`, `onClick`, `disabled`, `children`, and so on) to its element |

- The created component takes the same props as `Button`. Other props are passed to the part, and their types are the props of the part.

#### `useButton`

```ts
useButton<V = undefined>(props: UseButtonProps<V>): UseButtonResult
```

Handles the behavior of a button. When pressed, it passes `value` as is to `onMainAction`. It has no state. Use it to make your own `<button>` behave the same as `Button`.

```tsx
const { getButtonProps } = useButton({ value: id, onMainAction: remove });

<button className="my-button" {...getButtonProps({ onClick })}>
  Delete
</button>;
```

| Property        | Type                              | Description                                                              |
| --------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `value?`        | `V`                               | The value passed to `onMainAction` when pressed. Defaults to `undefined` |
| `onMainAction?` | `(value: V) => void`              | Called when pressed                                                      |
| `disabled?`     | `boolean`                         | Disables the button                                                      |
| `type?`         | `'button' \| 'submit' \| 'reset'` | The HTML `type`. Defaults to `'button'`                                  |

| Result           | Type                                | Description                                                                                                     |
| ---------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `getButtonProps` | `(handlers?) => ButtonElementProps` | Creates the props for `<button>` (`type`, `disabled`, and `onClick`). Your `onClick`, if given, is called first |

- When your `onClick` calls `event.preventDefault()`, `onMainAction` is not called.

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
withButtonGroup<P extends ButtonGroupParts>(parts?: P): <V>(props: ButtonGroupProps<V, P>) => ReactElement
```

Creates a button group drawn with the given button. `ButtonGroup` is the one created with every part omitted.

```tsx
const ButtonGroup = withButtonGroup({ Button });

<ButtonGroup options={actions} onMainAction={run} />;
```

| Part         | Type          | Description                                                                                                                                     |
| ------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | The container that lays out the parts. Defaults to `<div>`. Pass the props it receives (`role`, `aria-*`, `children`, and so on) to its element |
| `Button?`    | `ElementType` | The button that draws the options. Defaults to `Button`. Anything that accepts `ButtonSlotProps`                                                |

- The created component takes the props of `useButtonGroup` and `partsProps?` (`{ button? }`).
- The props of the given parts become the types of the created component (as in `withCheckboxGroup`). The remaining root props are the props of `Container`, and `partsProps.button` is the props of the button part without the `ButtonSlotProps` properties. Pass it as a value or a function (per option).
- Places the buttons inside the container (`Container`, defaulting to `<div>`) with `role="group"` and so on. Other props are passed to the container. It has no layout (vertical or horizontal).
- You can pass `Button` of react-primitives as it is. A single `Button` and the group can share the same `onMainAction` handler.

### textInput

| Name                   | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| `TextInput`            | A text input that follows the value and operation contract                   |
| `withTextInput(parts)` | Creates a text input drawn with the given part                               |
| `useTextInput(props)`  | Handles the behavior of a text input (the draft and committing; headless UI) |

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

#### `withTextInput`

```ts
withTextInput<P extends TextInputParts>(parts?: P): (props: TextInputProps<P>) => ReactElement
```

Creates a text input drawn with the given part. `TextInput` is the one created without parts.

| Part     | Type          | Description                                                                                                                                                                                    |
| -------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Input?` | `ElementType` | The element to type into (the primary element and the root). Defaults to `<input>`. Pass the props it receives (`value`, `onChange`, `onBlur`, `onKeyDown`, `ref`, and so on) to the `<input>` |

- The created component takes the same props as `TextInput`. Other props are passed to the part, and their types are the props of the part.

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

| Name                     | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| `Collapsible`            | A collapsible component that follows the value and operation contract |
| `useCollapsible(props)`  | Handles the behavior of a collapsible component (headless UI)         |
| `withCollapsible(parts)` | Creates a collapsible component drawn with the given parts            |

#### `Collapsible`

```tsx
<Collapsible summary="Details" open={open} onOpenChange={setOpen}>
  …content…
</Collapsible>
```

A collapsible component that follows the value and operation contract (`open`, `defaultOpen`, `onOpenChange`). Places a `<summary>` with `summary` and `children` inside an HTML `<details>`.

| Property        | Type                       | Description                                                                                                      |
| --------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `open?`         | `boolean`                  | Whether it is open (controlled)                                                                                  |
| `defaultOpen?`  | `boolean`                  | The initial open state (uncontrolled). Defaults to `false`                                                       |
| `onOpenChange?` | `(open: boolean) => void`  | Called when it opens or closes                                                                                   |
| `disabled?`     | `boolean`                  | Prevents opening and closing (sets `aria-disabled` on the `<summary>`)                                           |
| `summary?`      | `ReactNode`                | The heading (the content of the `<summary>`)                                                                     |
| `children?`     | `ReactNode`                | The content shown when open                                                                                      |
| `partsProps?`   | `{ summary?; indicator? }` | Props for the `<summary>` and the indicator (when `Indicator` is given) (`className`, event handlers, and so on) |

- Pressing the heading (also with Enter or Space) stops the browser's toggle and calls `onOpenChange`. When controlled, it opens or closes only when the parent changes `open`.
- When the browser opens or closes it on its own (such as opening it when find-in-page finds text inside), it also calls `onOpenChange`. When controlled and the parent does not accept it, it returns to the previous state.
- The `onClick` of `partsProps.summary` is called first; if it calls `event.preventDefault()`, it does not open or close.
- The content stays rendered and hidden while closed (the same as HTML `<details>`). The state of inputs inside is kept.
- Other props (`className`, `ref`, and so on) are passed to the `<details>`.

#### `withCollapsible`

```ts
withCollapsible<P extends CollapsibleParts>(parts?: P): (props: CollapsibleProps<P>) => ReactElement
```

Creates a collapsible component drawn with the given parts. `Collapsible` is the one created without parts.

| Part         | Type          | Description                                                                                                                                                                                       |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Details?`   | `ElementType` | The part that draws the `<details>`. Pass the props it receives (`open`, `onToggle`, `children`, and so on) to the `<details>`                                                                    |
| `Summary?`   | `ElementType` | The part that draws the `<summary>`. Pass the props it receives (`onClick`, `aria-disabled`, `children`, and so on) to the `<summary>`                                                            |
| `Indicator?` | `ElementType` | The open/close marker drawn before the summary text inside the `<summary>`. Not drawn when omitted. Anything that accepts `CollapsibleIndicatorSlotProps` (`open`, `disabled`, and `aria-hidden`) |

- The created component takes the same props as `Collapsible`.
- The props of the given parts become the types of the created component. The remaining root props are the props of `Details`, and `partsProps.summary` is the props of `Summary` without `children`. If a part has required props, `partsProps` becomes required too.
- Opening and closing use the `open` and `toggle` of `<details>`, so the parts must draw a `<details>` and a `<summary>`.
- `Indicator` receives the open state as props (they win over `partsProps.indicator`).

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

### recordField

| Name                                      | Description                                                                                  |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- |
| `RecordField<T>`                          | The type of a record field (key, label, and the function that draws its value)               |
| `renderFieldValue(field, props, context)` | Draws the value of a field (a field without `renderValue` shows its value as text)           |
| `RecordFields`                            | A component that lays out the fields of a record, following the value and operation contract |
| `withRecordFields(parts?)`                | Creates a component that lays out the fields of a record, drawn with the given parts         |
| `useRecordFields(props)`                  | Handles the behavior of a component that lays out the fields of a record (headless UI)       |

#### `RecordField<T>`

```ts
type RecordField<T> = {
  key: keyof T & string;
  label: ReactNode;
  renderValue?: (
    props: FieldValueProps<T[key]>,
    context: FieldValueContext<T>,
  ) => ReactNode;
};
```

A field of a record. It can also be used as a column of a table (`Table`) as is. Because it is a union per key, the type of the value `renderValue` receives is narrowed by `key`.

| Property       | Type                                                                           | Description                                                                                               |
| -------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `key`          | `keyof T & string`                                                             | The key to read the value from                                                                            |
| `label`        | `ReactNode`                                                                    | The label of the field (the column header in a table)                                                     |
| `renderValue?` | `(props: FieldValueProps<T[key]>, context: FieldValueContext<T>) => ReactNode` | Draws the value of the field. When omitted, the value is shown as text (`null` and `undefined` are empty) |

`FieldValueProps<V>`, which `renderValue` receives, can be passed to an input component as is (`renderValue: (props) => <TextInput {...props} />`).

| Property          | Type                 | Description                                                                                            |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| `value`           | `V`                  | The value of the field                                                                                 |
| `onValueChange`   | `(value: V) => void` | Called when the value of the field is committed. The component rebuilds the whole value and reports it |
| `aria-labelledby` | `string`             | The id of the element of the field's label (the column header in a table)                              |

The second argument of `renderValue` (`FieldValueContext<T>`) carries information that is not spread to the component. Putting it in the props would leak it into DOM attributes when the props are spread.

| Property | Type                | Description                                                                                                                                                                                                                                               |
| -------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`   | `readonly string[]` | The path of the field's value, seen from the value given to the component: `[row id, key]` for `Table` and `[key]` for `RecordFields`. The same shape as `path` in the details; use it to read state-model validation results (`validation.issues(path)`) |
| `record` | `T`                 | The record that holds the field (the row in a table). Use it to change how the value is drawn depending on other fields (making it `disabled`, for example)                                                                                               |

```tsx
renderValue: (props, { path }) => <MyCell {...props} path={path} />;
renderValue: (props, { record }) => (
  <TextInput {...props} disabled={!record.active} />
);
```

- `renderValue` is called as a plain function inside a hook. To use hooks in it, return a component (`renderValue: (props) => <MyCell {...props} />`).

#### `renderFieldValue`

```ts
renderFieldValue<T>(field: RecordField<T>, props: FieldValueProps<T[keyof T & string]>, context: FieldValueContext<T>): ReactNode
```

Calls the field's `renderValue` with `props` and `context`. For a field without it, returns the value as text (`null` and `undefined` are empty). `useTable` and `useRecordFields` draw values with this. Use it when you build a component that lays out fields yourself.

#### `RecordFields`

```tsx
type Member = { id: string; name: string; active: boolean };

const fields: RecordField<Member>[] = [
  { key: 'id', label: 'ID' },
  {
    key: 'name',
    label: 'Name',
    renderValue: (props) => <TextInput {...props} />,
  },
  {
    key: 'active',
    label: 'Active',
    renderValue: (props) => <Checkbox {...props} />,
  },
];

<RecordFields value={member} onValueChange={setMember} fields={fields} />;
```

A component that lays out the fields of a record, following the value and operation contract. It takes a record as `value`, and when the value of a field is committed, reports the changed record through `onValueChange`. It has no submission (`<form>`), so it can be placed inside your own `<form>`. It is created by `withRecordFields` without any parts.

| Property         | Type                                                          | Description                                                                                  |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `fields`         | `readonly RecordField<T>[]`                                   | The fields                                                                                   |
| `value?`         | `T`                                                           | The record (controlled)                                                                      |
| `defaultValue?`  | `T`                                                           | The initial record (uncontrolled). When both this and `value` are omitted, `{}`              |
| `onValueChange?` | `(value: T, details: RecordFieldsValueChangeDetails) => void` | Called when the value of a field is committed, with the changed record and the changed field |
| `partsProps?`    | `{ field?; label?; value? }`                                  | Props passed to the field, label, and value elements (see `withRecordFields`)                |

- It places a `<div>` per field inside a `<div>`. Each field holds a `<div>` for the label and a `<div>` for the value.
- When the value of a field is committed, it creates a new record with that key changed and calls `onValueChange(next, { type: 'update', path: [key] })`. It does not report when the value has not changed.
- It gives each label an id and passes it to `renderValue` as `aria-labelledby`. The value components are named by their field labels.
- To connect it to a state-model record, pass the `value` and `onValueChange` of `useModelProps(record)`.
- Because it has several inputs, its primary element is the root. Other props (`className`, `role`, `aria-label`, `ref`, and so on) are passed to the root `<div>`.

#### `withRecordFields`

```ts
withRecordFields<P extends RecordFieldsParts>(parts?: P): <T extends object>(props: RecordFieldsProps<T, P>) => ReactElement
```

Creates a component that lays out the fields of a record, drawn with the given parts. `RecordFields` is the one created without any parts.

| Part         | Type          | Description                                                                                                                                                                            |
| ------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Container?` | `ElementType` | The container that lays out the fields. Defaults to `<div>`. Passes the props it receives (`role`, `aria-*`, `children`, and so on) to its element                                     |
| `Field?`     | `ElementType` | A field (wraps the label and the value). Defaults to `<div>`. Passes the props it receives (`children` and so on) to its element                                                       |
| `Label?`     | `ElementType` | The label of a field. Defaults to `<div>`. Passes the props it receives (the `id` the component sets, `children`, and so on) to its element (without the `id`, the value is not named) |
| `Value?`     | `ElementType` | Wraps the value of a field (what `renderValue` drew). Defaults to `<div>`. Passes the props it receives (`children` and so on) to its element                                          |

- The created component takes the same props as `RecordFields`.
- The props of the given parts become the types of the created component. The remaining root props are the props of `Container`, and `partsProps.field`, `partsProps.label`, and `partsProps.value` are the props of each part without `children`. When a part has required props, `partsProps` becomes required too.
- `partsProps.field`, `partsProps.label`, and `partsProps.value` take a value (the same for every field) or a function (decided per field). The function receives `RecordFieldContext<T>` (the second argument of `renderValue` plus the field's `key`).
- The component sets an `id` on each label and merges `partsProps.label` over it.
- When you give layout parts (such as ones created with react-layouts HOCs), you can pass their layout options through `partsProps` and other props, with types.

```tsx
// Create it once in your app
const AppRecordFields = withRecordFields({ Field: AppField, Label: AppLabel });

// Place it as is on a screen. Decide the props per field with a function
<AppRecordFields
  value={member}
  onValueChange={setMember}
  fields={fields}
  partsProps={{ field: ({ key }) => ({ className: `field-${key}` }) }}
/>;
```

#### `useRecordFields`

```ts
useRecordFields<T extends object>(props: UseRecordFieldsProps<T>): UseRecordFieldsResult<T>
```

Handles the behavior of a component that lays out the fields of a record. It creates, per field, the label id, what was drawn, and the props passed to `renderValue`, so you can decide the layout yourself. It takes the same `fields`, `value`, `defaultValue`, and `onValueChange` as `RecordFields`.

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

| Result          | Type                      | Description                                                                                                                                                                   |
| --------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `T`                       | The record                                                                                                                                                                    |
| `displayFields` | `DisplayRecordField<T>[]` | The fields to display: each field with its label id (`labelId`), what was drawn (`content`), the props passed to `renderValue` (`props`), and its second argument (`context`) |

### table

| Name                | Description                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `TableColumn<R>`    | The type of a table column (a field plus alignment and props for the header and the cells)                  |
| `Table`             | A table that follows the value and operation contract                                                       |
| `withTable(parts?)` | Creates a table drawn with the given parts                                                                  |
| `useTable(props)`   | Handles the behavior of a table (expanding into headers, rows, and cells, and changing cells) (headless UI) |

#### `TableColumn<R>`

```ts
type TableColumn<R> = RecordField<R> & {
  align?: TableAlign;
  headerAlign?: TableAlign;
  headerProps?: TableHeaderCellProps;
  cellProps?:
    | TableCellElementProps
    | ((context: TableCellContext<R, R[key]>) => TableCellElementProps);
};
```

A column of a table. It is a field (`RecordField<R>`) plus settings specific to columns, so an array of fields can be passed to `columns` as is. Because it is a union per key, the type of the value `renderValue` and `cellProps` receive is narrowed by `key`.

| Property       | Type                                                                                    | Description                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `align?`       | `'start' \| 'center' \| 'end'`                                                          | The text alignment of the cells (`text-align`). When omitted, it is not set (left to CSS)                        |
| `headerAlign?` | `'start' \| 'center' \| 'end'`                                                          | The text alignment of the header. Defaults to `align`                                                            |
| `headerProps?` | `TableHeaderCellProps`                                                                  | Props passed to the column header (`<th>`)                                                                       |
| `cellProps?`   | `TableCellElementProps \| ((context: TableCellContext<R, V>) => TableCellElementProps)` | Props passed to the cells of the column (`<td>`). A function decides them per cell from the value, path, and row |

`TableCellContext<R, V>`, which the `cellProps` function receives, is the second argument of `renderValue` (`path` and `record`) plus the value of the cell (`value`).

```tsx
const columns: TableColumn<Member>[] = [
  {
    key: 'age',
    label: 'Age',
    align: 'end',
    cellProps: ({ value }) => ({ className: value < 20 ? 'minor' : undefined }),
  },
];
```

#### `Table`

```tsx
type Member = { id: string; name: string; age: number };

const columns: TableColumn<Member>[] = [
  {
    key: 'name',
    label: 'Name',
    renderValue: (props) => <TextInput {...props} />,
  },
  { key: 'age', label: 'Age' },
];

<Table value={members} onValueChange={setMembers} columns={columns} />;
```

A table that follows the value and operation contract. It takes an array of rows as `value`, and when the value of a cell is committed, reports the changed array through `onValueChange`. It draws a `<table>`, with column headers in `<th scope="col">` and cells in `<td>`. It is created by `withTable` without any parts.

| Property         | Type                                                                        | Description                                                                               |
| ---------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `columns`        | `readonly TableColumn<R>[]`                                                 | The columns                                                                               |
| `value?`         | `readonly R[]`                                                              | The array of rows (controlled)                                                            |
| `defaultValue?`  | `readonly R[]`                                                              | The initial array of rows (uncontrolled). Defaults to an empty array                      |
| `onValueChange?` | `(value: R[], details: TableValueChangeDetails) => void`                    | Called when the value of a cell is committed, with the changed array and the changed cell |
| `renderRow?`     | `(props: TableRenderRowProps<P>, context: TableRowContext<R>) => ReactNode` | Draws a row. When omitted, rows are drawn with `<tr>` (the `Row` given to `withTable`)    |
| `partsProps?`    | `{ head?; headerRow?; headerCell?; body?; row?; cell? }`                    | Props passed to the elements inside the table (see `withTable`)                           |

- A row is an object with `id` (`R extends { id: string | number }`). Rows are identified by `id` (the same as the default of a state-model list).
- When the value of a cell is committed, it finds the row by `id`, creates a new array with that key changed, and calls `onValueChange(next, { type: 'update', path: [id, key] })`. The `id` is converted to a string. Unchanged rows keep their original objects.
- It does not report when the value has not changed. When several rows have the same `id`, only the first one is changed.
- It gives each column header an id and passes it to `renderValue` as `aria-labelledby`. Inputs in the cells are named by their column headers.
- Each header `<th>` gets `id`, `scope="col"`, and the alignment style with the column's `headerProps` merged over them, and each `<td>` gets the alignment style with the column's `cellProps` merged over it.
- Rows are drawn with a `memo` component. A row is not redrawn while its object, `columns`, `partsProps.row`, `partsProps.cell`, and `renderRow` stay the same (state-model and `update` of utils keep the objects of unchanged rows). Passing a new function or object on every render redraws every row.
- To connect it to a state-model list, pass the `value` and `onValueChange` of `useModelProps(list)`.
- Other props (`className`, `aria-label`, `ref`, and so on) are passed to the `<table>`.

Use `renderRow` to draw the `<tr>` of a row yourself. `props` is what `partsProps.row` decided plus the cells (`children`); spread it onto the `<tr>`. `context` (`TableRowContext<R>`) is `{ path: [row id], index, record }`, and `path` can be used to read state-model change status or validation results (`status.dirty(path)`). It is called as a plain function, so to use hooks in it, return a component.

```tsx
// Use a hook inside to mark edited rows
const renderRow = (
  props: TableRenderRowProps,
  { path }: TableRowContext<Member>,
) => <DirtyRow {...props} path={path} />;

<Table value={members} columns={columns} renderRow={renderRow} />;
```

#### `withTable`

```ts
withTable<P extends TableParts>(parts?: P): <R extends { id: string | number }>(props: TableProps<R, P>) => ReactElement
```

Creates a table drawn with the given parts. `Table` is the one created without any parts. Give the parts once in your app, and decide how each row, column, and cell is drawn with `partsProps`, `renderRow`, and the columns' `headerProps` and `cellProps`.

| Part          | Type          | Description                                      |
| ------------- | ------------- | ------------------------------------------------ |
| `Table?`      | `ElementType` | Draws the `<table>`. Defaults to `<table>`       |
| `Head?`       | `ElementType` | Draws the `<thead>`. Defaults to `<thead>`       |
| `HeaderRow?`  | `ElementType` | Draws the header `<tr>`. Defaults to `<tr>`      |
| `HeaderCell?` | `ElementType` | Draws a column header `<th>`. Defaults to `<th>` |
| `Body?`       | `ElementType` | Draws the `<tbody>`. Defaults to `<tbody>`       |
| `Row?`        | `ElementType` | Draws a data `<tr>`. Defaults to `<tr>`          |
| `Cell?`       | `ElementType` | Draws a cell `<td>`. Defaults to `<td>`          |

- The parts receive only element props and `children` (no row or cell data). They need to pass the props they receive (`id`, `scope`, `children`, and so on) to their elements.
- The created component takes the same props as `Table`.
- The props of the given parts become the types of the created component. The remaining root props are the props of the `Table` part, and `partsProps.head`, `headerRow`, `headerCell`, `body`, `row`, and `cell` are the props of each part without `children`. When a part has required props, `partsProps` becomes required too.
- `partsProps.headerCell`, `partsProps.row`, and `partsProps.cell` take a value (the same for all) or a function. The function receives `TableHeaderCellContext<R>` (`{ key, index }`) for headers, `TableRowContext<R>` (`{ path, index, record }`) for rows, and `TableCellContext<R>` (`{ path, record, value }`) for cells. The functions are called while drawing, so hooks cannot be used in them.
- For headers and cells, the columns' `headerProps` and `cellProps` are merged over `partsProps.headerCell` and `partsProps.cell` (the column's value wins for the same prop; `className`, `style`, event handlers, and `ref` are combined).

```tsx
// Create it once in your app
const AppTable = withTable({ Row: AppRow, Cell: AppCell });

// Place it as is on a screen. Decide the props per row with a function
<AppTable
  value={members}
  columns={columns}
  partsProps={{
    row: ({ record }) => ({
      className: record.active ? undefined : 'inactive',
    }),
  }}
/>;
```

#### `useTable`

```ts
useTable<R extends { id: string | number }>(props: UseTableProps<R>): UseTableResult<R>
```

Handles the behavior of a table. It returns the column headers, rows, and cells already expanded, so elements other than `<table>` (CSS Grid, virtual scrolling, and so on) can use the same change handling and header association. It takes the same `columns`, `value`, `defaultValue`, and `onValueChange` as `Table`.

```tsx
const { displayColumns, rows, getCells } = useTable({
  value,
  onValueChange,
  columns,
});

<div className="my-grid">
  {displayColumns.map((column) => (
    <div key={column.labelId} id={column.labelId}>
      {column.label}
    </div>
  ))}
  {rows.map((row) =>
    getCells(row).map((cell) => (
      <div key={`${row.id}:${cell.labelId}`}>{cell.content}</div>
    )),
  )}
</div>;
```

- There is one `labelId` per column. Put it on exactly one element, the column header (layouts that draw a label in every row would repeat the same id).

| Result           | Type                                   | Description                                                                                                            |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `value`          | `readonly R[]`                         | The array of rows                                                                                                      |
| `displayColumns` | `DisplayTableColumn<R>[]`              | The columns to display (each column with `labelId`, the id of its header, and `thProps`, the props for its `<th>`)     |
| `rows`           | `TableRow<R>[]`                        | The rows to display (in the order of `value`). Create their cells with `getCells`                                      |
| `getCells`       | `(row: TableRow<R>) => TableCell<R>[]` | Creates the cells of a row (in column order). It stays the same while the columns do, so a row component can be `memo` |

An element of `rows` (`TableRow<R>`) is `{ id, index, record }`. `id` is the row's id converted to a string, usable as a React key; `index` is its position in `value`, and `record` is the original row. A cell returned by `getCells` (`TableCell<R>`) has the following.

| Property  | Type                                   | Description                                                                                        |
| --------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `key`     | `keyof R & string`                     | The key of the column                                                                              |
| `labelId` | `string`                               | The id of the column header element                                                                |
| `content` | `ReactNode`                            | What the column's `renderValue` drew (for a column without it, the value as text)                  |
| `props`   | `FieldValueProps<R[keyof R & string]>` | The props passed to `renderValue`. Use them to draw the cell yourself                              |
| `context` | `FieldValueContext<R>`                 | The second argument passed to `renderValue` (`path` is `[row id, key]`, `record` is the row)       |
| `tdProps` | `TableCellElementProps`                | The props for the cell's `<td>` (the alignment style with the column's `cellProps` merged over it) |

### Types

The types of the value and operation contract, such as `Option<V>`, `DisplayOption<V>`, and `UnlistedPlacementProps`, are in [`@fringeworks/react-contract`](https://github.com/fringeworks-js/react-contract).

| Type                              | Description                                                                                        |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| `CheckboxProps<P>`                | The props of the component created by `withCheckbox` (`Checkbox`). `P` is the given parts          |
| `CheckboxParts`                   | The parts for `withCheckbox`                                                                       |
| `CheckboxLabelSlotProps`          | The props the `<label>` part of `withCheckbox` receives                                            |
| `CheckboxInputSlotProps`          | The props the `<input>` part of `withCheckbox` receives                                            |
| `CheckboxPartsProps<P>`           | The props passed to the parts with `partsProps`                                                    |
| `CheckboxSlots`                   | The parts and the props passed to each                                                             |
| `CheckboxIndicatorSlotProps`      | The props the indicator part (`Indicator`) of `withCheckbox` receives                              |
| `UseCheckboxProps`                | The props `useCheckbox` takes                                                                      |
| `UseCheckboxResult`               | The result of `useCheckbox`                                                                        |
| `CheckboxInputProps`              | The props `getInputProps` of `useCheckbox` creates                                                 |
| `UseCheckboxGroupProps<V>`        | The props `useCheckboxGroup` takes                                                                 |
| `UseCheckboxGroupResult<V>`       | The result of `useCheckboxGroup`                                                                   |
| `SelectAllState`                  | The state of "select all"                                                                          |
| `CheckboxSlotProps`               | The props a checkbox in a checkbox group receives                                                  |
| `CheckboxGroupContainerProps`     | The attributes for the container                                                                   |
| `CheckboxGroupContainerSlotProps` | The props the container part of a checkbox group receives                                          |
| `CheckboxGroupParts`              | The parts passed to `withCheckboxGroup`                                                            |
| `CheckboxGroupProps<V, P>`        | The props of the component created by `withCheckboxGroup` (`P` is the given parts)                 |
| `CheckboxGroupPartsProps<V, P>`   | The props passed to the parts with `partsProps`                                                    |
| `CheckboxGroupSlots`              | The parts and the props the group passes to each                                                   |
| `RadioProps<P>`                   | The props of the component created by `withRadio` (`Radio`). `P` is the given parts                |
| `RadioParts`                      | The parts for `withRadio`                                                                          |
| `RadioLabelSlotProps`             | The props the `<label>` part of `withRadio` receives                                               |
| `RadioInputSlotProps`             | The props the `<input>` part of `withRadio` receives                                               |
| `RadioPartsProps<P>`              | The props passed to the parts with `partsProps`                                                    |
| `RadioSlots`                      | The parts and the props passed to each                                                             |
| `RadioIndicatorSlotProps`         | The props the indicator part (`Indicator`) of `withRadio` receives                                 |
| `UseRadioProps`                   | The props `useRadio` takes                                                                         |
| `UseRadioResult`                  | The result of `useRadio`                                                                           |
| `RadioInputProps`                 | The props `getInputProps` of `useRadio` creates                                                    |
| `SwitchProps<P>`                  | The props of the component created by `withSwitch` (`Switch`). `P` is the given parts              |
| `SwitchParts`                     | The parts for `withSwitch`                                                                         |
| `SwitchLabelSlotProps`            | The props the `<label>` part of `withSwitch` receives                                              |
| `SwitchInputSlotProps`            | The props the `<input>` part of `withSwitch` receives                                              |
| `SwitchPartsProps<P>`             | The props passed to the parts with `partsProps`                                                    |
| `SwitchSlots`                     | The parts and the props passed to each                                                             |
| `SwitchIndicatorSlotProps`        | The props the indicator part (`Indicator`) of `withSwitch` receives                                |
| `UseRadioGroupProps<V>`           | The props `useRadioGroup` takes                                                                    |
| `UseRadioGroupResult<V>`          | The result of `useRadioGroup`                                                                      |
| `RadioSlotProps`                  | The props a radio button in a radio group receives                                                 |
| `RadioGroupContainerProps`        | The attributes for the container                                                                   |
| `RadioGroupContainerSlotProps`    | The props the container part of a radio group receives                                             |
| `RadioGroupParts`                 | The parts passed to `withRadioGroup`                                                               |
| `RadioGroupProps<V, P>`           | The props of the component created by `withRadioGroup` (`P` is the given parts)                    |
| `RadioGroupPartsProps<V, P>`      | The props passed to the parts with `partsProps`                                                    |
| `RadioGroupSlots`                 | The parts and the props the group passes to each                                                   |
| `OptionLabelProps<V, P>`          | The props of the component created by `withOptionLabel` (`OptionLabel`). `P` is the given parts    |
| `OptionLabelParts`                | The parts for `withOptionLabel`                                                                    |
| `OptionLabelContainerSlotProps`   | The props the container part of `withOptionLabel` receives                                         |
| `OptionLabelSlots`                | The parts and the props passed to each                                                             |
| `OptionLabelsProps<V, P>`         | The props of the component created by `withOptionLabels` (`OptionLabels`). `P` is the given parts  |
| `OptionLabelsParts`               | The parts for `withOptionLabels`                                                                   |
| `OptionLabelsContainerSlotProps`  | The props the container part of `withOptionLabels` receives                                        |
| `OptionLabelsSlots`               | The parts and the props passed to each                                                             |
| `OptionLabelsLabelSlotProps`      | The props the label part of `withOptionLabels` receives                                            |
| `OptionLabelsPartsProps<V, P>`    | The props passed to the parts with `partsProps`                                                    |
| `ButtonProps<V, P>`               | The props of the component created by `withButton` (`Button`). `P` is the given parts              |
| `ButtonParts`                     | The parts for `withButton`                                                                         |
| `ButtonButtonSlotProps`           | The props the part of `withButton` receives                                                        |
| `ButtonSlots`                     | The parts and the props passed to each                                                             |
| `UseButtonProps<V>`               | The props `useButton` takes                                                                        |
| `UseButtonResult`                 | The result of `useButton`                                                                          |
| `ButtonElementProps`              | The props `getButtonProps` of `useButton` creates                                                  |
| `UseButtonGroupProps<V>`          | The props `useButtonGroup` takes                                                                   |
| `UseButtonGroupResult<V>`         | The result of `useButtonGroup`                                                                     |
| `ButtonSlotProps`                 | The props a button in a button group receives                                                      |
| `ButtonGroupContainerProps`       | The attributes for the container                                                                   |
| `ButtonGroupContainerSlotProps`   | The props the container part of a button group receives                                            |
| `ButtonGroupParts`                | The parts passed to `withButtonGroup`                                                              |
| `ButtonGroupProps<V, P>`          | The props of the component created by `withButtonGroup` (`P` is the given parts)                   |
| `ButtonGroupPartsProps<V, P>`     | The props passed to the parts with `partsProps`                                                    |
| `ButtonGroupSlots`                | The parts and the props the group passes to each                                                   |
| `TextInputProps<P>`               | The props of the component created by `withTextInput` (`TextInput`). `P` is the given parts        |
| `TextInputParts`                  | The parts for `withTextInput`                                                                      |
| `TextInputInputSlotProps`         | The props the part of `withTextInput` receives                                                     |
| `TextInputSlots`                  | The parts and the props passed to each                                                             |
| `TextInputType`                   | The `type` values `TextInput` accepts                                                              |
| `UseTextInputProps`               | The props `useTextInput` takes                                                                     |
| `UseTextInputResult`              | The result of `useTextInput`                                                                       |
| `ValueChangeTiming`               | When to call `onValueChange`                                                                       |
| `TextInputHandlers`               | Your handlers passed to `getInputProps`                                                            |
| `TextInputElementProps`           | The props for the `<input>` created by `getInputProps`                                             |
| `CollapsibleProps<P>`             | The props of the component created by `withCollapsible` (`Collapsible`). `P` is the given parts    |
| `CollapsibleParts`                | The parts for `withCollapsible`                                                                    |
| `CollapsibleDetailsSlotProps`     | The props the `<details>` part of `withCollapsible` receives                                       |
| `CollapsibleSummarySlotProps`     | The props the `<summary>` part of `withCollapsible` receives                                       |
| `CollapsiblePartsProps<P>`        | The props passed to the parts with `partsProps`                                                    |
| `CollapsibleSlots`                | The parts and the props passed to each                                                             |
| `CollapsibleIndicatorSlotProps`   | The props the indicator part (`Indicator`) of `withCollapsible` receives                           |
| `UseCollapsibleProps`             | The props `useCollapsible` takes                                                                   |
| `UseCollapsibleResult`            | The result of `useCollapsible`                                                                     |
| `CollapsibleDetailsProps`         | The props for the `<details>`                                                                      |
| `CollapsibleSummaryProps`         | The props for the `<summary>`                                                                      |
| `RecordField<T>`                  | A field of a record                                                                                |
| `FieldValueProps<V>`              | The props passed to the function that draws a field's value (`renderValue`)                        |
| `FieldValueContext<T>`            | The information passed to `renderValue` as its second argument (`path` and `record`)               |
| `TableColumn<R>`                  | A table column (a field plus settings specific to columns)                                         |
| `TableColumnOptions<R, V>`        | Settings specific to columns (`align`, `headerAlign`, `headerProps`, and `cellProps`)              |
| `TableAlign`                      | The text alignment of a column (`'start' \| 'center' \| 'end'`)                                    |
| `TableHeaderCellProps`            | Props passed to a column header (`<th>`)                                                           |
| `TableCellElementProps`           | Props passed to a cell (`<td>`)                                                                    |
| `TableCellContext<R, V>`          | The information passed to the functions of `cellProps` and `partsProps.cell`                       |
| `TableHeaderCellContext<R>`       | The information passed to the function of `partsProps.headerCell`                                  |
| `TableRowContext<R>`              | The information passed to the function of `partsProps.row` and to `renderRow`                      |
| `TableRowId`                      | The type of a table row's id (`string \| number`)                                                  |
| `TableProps<R, P>`                | The props of a component created with `withTable` (`Table`) (`P` is the given parts)               |
| `TableParts`                      | The parts given to `withTable`                                                                     |
| `TableSlotProps`                  | The props the `<table>` part given to `withTable` receives                                         |
| `TableSectionSlotProps`           | The props the `<thead>` and `<tbody>` parts given to `withTable` receive                           |
| `TableRowSlotProps`               | The props the `<tr>` parts given to `withTable` receive                                            |
| `TableHeaderCellSlotProps`        | The props the `<th>` part given to `withTable` receives                                            |
| `TableCellSlotProps`              | The props the `<td>` part given to `withTable` receives                                            |
| `TablePartsProps<R, P>`           | The props passed to the parts through `partsProps`                                                 |
| `TableSlots`                      | The mapping from part names to the props passed to them                                            |
| `TableRenderRowProps<P>`          | The props passed to `renderRow` (what `partsProps.row` decided, plus the cells)                    |
| `UseTableProps<R>`                | The props `useTable` takes                                                                         |
| `UseTableResult<R>`               | The result of `useTable`                                                                           |
| `TableValueChangeDetails`         | The details when the value of a table changes (`{ type: 'update', path: [id, key] }`)              |
| `DisplayTableColumn<R>`           | A column to display                                                                                |
| `TableRow<R>`                     | A row to display                                                                                   |
| `TableCell<R>`                    | A cell to display                                                                                  |
| `RecordFieldsProps<T, P>`         | The props of a component created with `withRecordFields` (`RecordFields`) (`P` is the given parts) |
| `RecordFieldsParts`               | The parts given to `withRecordFields`                                                              |
| `RecordFieldsContainerSlotProps`  | The props the container part given to `withRecordFields` receives                                  |
| `RecordFieldPartSlotProps`        | The props the field, label, and value parts given to `withRecordFields` receive                    |
| `RecordFieldsPartsProps<T, P>`    | The props passed to the parts through `partsProps`                                                 |
| `RecordFieldsSlots`               | The mapping from part names to the props passed to them                                            |
| `RecordFieldContext<T>`           | The information passed to the functions of `partsProps.field`, `label`, and `value`                |
| `UseRecordFieldsProps<T>`         | The props `useRecordFields` takes                                                                  |
| `UseRecordFieldsResult<T>`        | The result of `useRecordFields`                                                                    |
| `RecordFieldsValueChangeDetails`  | The details when the value of a record changes (`{ type: 'update', path: [key] }`)                 |
| `DisplayRecordField<T>`           | A field to display                                                                                 |

## License

MIT
