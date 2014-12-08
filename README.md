# Analog Time Picker

Show an analog time picker so that users can input time more intuitively with a
clock-style interface.

[View documentation with interactive examples.](http://analogtimepicker.z10.us/)

## Dependencies

The analog time picker has no external dependencies. You'll just need to add the
following lines to your HTML to start using the analog time picker component.

```html
<link rel="stylesheet" href="analogtimepicker.css">
<script src="analogtimepicker.js"></script>
```

## Examples

### Inline time picker

```html
<div id="inlinepicker"></div>
<script>
  var container = document.getElementById('inlinepicker');
  new AnalogTimePicker(container);
</script>
```

### Popup time picker

```html
<input type="text" id="time">
<script>
  var input = document.getElementById('time');
  new AnalogTimePicker(input);
</script>
```

## Usage

### Methods

#### AnalogTimePicker(element)
Initializes a time picker. If the element supplied is an `<input>`, the time
picker will be created in a popup shown when the user starts to edit the
`<input>`. Otherwise, the element will be a container for the time picker.
```javascript
var container = document.getElementById('timepicker');
var picker = new AnalogTimePicker(container);
```

#### .getHour()
Gets the currently selected hour.
```javascript
picker.getHour()
```

#### .setHour(number)
Sets the currently selected hour to the specified number.
```javascript
picker.setHour(12)
```

#### .getMinute()
Gets the currently selected minute.
```javascript
picker.getMinute()
```

#### .setMinute(number)
Sets the currently selected minute to the specified number.
```javascript
picker.setMinute(59)
```

#### .getMode()
Gets whether the time picker is currently set to pick an hour or a minute. The
returned value is 'hour' or 'minute'.
```javascript
picker.getMode()
```

#### .setMode('hour' | 'minute')
Sets whether the time picker should be set to pick an hour or a minute.
```javascript
picker.setMode('hour')
```

#### .showPopup()
Reveals the popup.
```javascript
picker.showPopup()
```

#### .hidePopup()
Hides the popup.
```javascript
picker.hidePopup()
```

#### .addEventListener(type, function)
Specify a function to call when an event of the specified type is triggered.
```javascript
picker.addEventListener('timechange', function() {
  console.log('hour: ' + this.getHour() + ' minute: ' + this.getMinute());
});
```

#### .removeEventListener(type, function)
Remove a previously added function from being called when an event is triggered.
```javascript
picker.removeEventListener('timechange', previouslyAddedListener);
```

### Events

| Event Type | Description |
| ---------- | ----------- |
| timechange | This event is fired when the user has picked a new time. |
| modechange | This event is fired when the user has switched to hour picking mode or minute picking mode. |
| popupshow | This event is fired when the popup has been made visible to the user. |
| popuphide | This event is fired when the popup has been hidden from the user. |

```javascript
picker.addEventListener('timechange', function() {
  // do something...
})
```

## License

[MIT](https://raw.githubusercontent.com/davidpeng/analogtimepicker/master/LICENSE)