# Analog Time Picker

Show an analog time picker so that users can input time more intuitively with a
clock-style interface.

## Examples

### Inline time picker

If you want to show a time picker inline (not in a popover triggered by an
`<input>`), add `.analogtimepicker` to a `<div>` that doesn't contain an
`<input>`.

```html
<div class="analogtimepicker"></div>
```

### Popover time picker

If you add `.analogtimepicker` to an `<input>` or a `<div>` that contains an
`<input>`, the time picker will be put in a popover that is triggered by the
`<input>`.

```html
<div class="row">
  <div class="col-xs-2">
    <input type="text" class="form-control analogtimepicker">
  </div>
  <div class="col-xs-3">
    <div class="input-group analogtimepicker">
      <input type="text" class="form-control">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button">
          <span class="glyphicon glyphicon-time"></span>
        </button>
      </span>
    </div>
  </div>
</div>
```

## Usage

Enable time pickers via JavaScript:

```javascript
$('#example').analogtimepicker(options)
```

## Options

Options can be passed via data attributes or JavaScript. For data attributes,
append the option name to `data-`, as in `data-hour=""`.

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| hour | number | 0 | The currently selected hour. This should be a number between 0 and 23. |
| minute | number | 0 | The currently selected minute. This should be a number between 0 and 59. |
| popoverplacement | string | 'bottom' | How to position the popover -- top | bottom | left | right. |

### Methods

#### $().analogtimepicker(options)
Initializes time pickers for an element collection.

#### .analogtimepicker('hour')
Gets the currently selected hour.
```javascript
$('#element').analogtimepicker('hour')
```

#### .analogtimepicker('hour', number)
Sets the currently selected hour to the specified number.
```javascript
$('#element').analogtimepicker('hour', 12)
```

#### .analogtimepicker('minute')
Gets the currently selected minute.
```javascript
$('#element').analogtimepicker('minute')
```

#### .analogtimepicker('minute', number)
Sets the currently selected minute to the specified number.
```javascript
$('#element').analogtimepicker('minute', 59)
```

#### .analogtimepicker('mode')
Gets whether the time picker is currently set to pick an hour or a minute. The
returned value is 'hour' or 'minute'.
```javascript
$('#element').analogtimepicker('mode')
```

#### .analogtimepicker('mode', 'hour' | 'minute')
Sets whether the time picker should be set to pick an hour or a minute.
```javascript
$('#element').analogtimepicker('mode', 'hour')
```

#### .analogtimepicker('popoverplacement')
Gets how the popover is positioned. The returned value is 'top', 'bottom',
'left' or 'right'.
```javascript
$('#element').analogtimepicker('popoverplacement')
```

#### .analogtimepicker('popoverplacement', 'top' | 'bottom' | 'left' | 'right')
Sets how the popover is positioned.
```javascript
$('#element').analogtimepicker('popoverplacement', 'right')
```

#### .analogtimepicker('showpopover')
Reveals the popover if there is one.
```javascript
$('#element').analogtimepicker('showpopover')
```

#### .analogtimepicker('hidepopover')
Hides the popover.
```javascript
$('#element').analogtimepicker('hidepopover')
```

#### .analogtimepicker('destroy')
Destroys the time picker.
```javascript
$('#element').analogtimepicker('destroy')
```

### Events

| Event Type | Description |
| ---------- | ----------- |
| pick.analogtimepicker.time | This event fires when the user picks a new time, but before the new time is accepted. The event object that's passed to the event handler has two additional properties, `hour` and `minute`, which store the newly picked time. If you don't want the change to go through, you can cancel it by calling `event.preventDefault()`. |
| picked.analogtimepicker.time | This event is fired when the user has picked a new time. |
| switch.analogtimepicker.mode | This event fires when the user switches to hour picking mode or minute picking mode, but before the switch is finalized. The event object that's passed to the event handler has a `mode` property which stores the new mode. If you don't want the switch to go through, you can cancel it by calling ` event.preventDefault()`. |
| switched.analogtimepicker.mode | This event is fired when the user has switched to hour picking mode or minute picking mode. |
| show.analogtimepicker.popover | This event fires right before the popover is made visible to the user. |
| shown.analogtimepicker.popover | This event is fired when the popover has been made visible to the user. |
| hide.analogtimepicker.popover | This event fires right before the popover is hidden from the user. |
| hidden.analogtimepicker.popover | This event is fired when the popover has been hidden from the user. |

```javascript
$('#example').on('picked.analogtimepicker.time', function(event) {
  // do something...
})
```