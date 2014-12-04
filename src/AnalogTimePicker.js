function AnalogTimePicker($element) {
  this.$element_ = $element;
  this.$element_.className += ' ' + AnalogTimePicker.Class.CONTAINER;
  this.hour_ = 0;
  this.minute_ = 0;
  this.tapped_ = false;
  
  var $time = document.createElement('div');
  $time.className = AnalogTimePicker.Class.TextPart.CONTAINER;
  this.$element_.appendChild($time);
  
  this.$hour_ = document.createElement('span');
  this.$hour_.className = AnalogTimePicker.Class.TextPart.HOUR_SELECTED;
  this.$hour_.textContent = this.getFormattedHour();
  $time.appendChild(this.$hour_);
  this.$hour_.style.width = this.$hour_.offsetWidth + 'px';
  
  var $colon = document.createElement('span');
  $colon.className = AnalogTimePicker.Class.TextPart.COLON;
  $colon.textContent = ':';
  $time.appendChild($colon);
  
  this.$minute_ = document.createElement('span');
  this.$minute_.className = AnalogTimePicker.Class.TextPart.MINUTE;
  this.$minute_.textContent = this.getFormattedMinute();
  $time.appendChild(this.$minute_);
  
  this.$amPm_ = document.createElement('span');
  this.$amPm_.className = AnalogTimePicker.Class.TextPart.AMPM;
  this.$amPm_.textContent = this.getFormattedAmPm();
  $time.appendChild(this.$amPm_);
  
  var $option = document.createElement('div');
  $option.className = AnalogTimePicker.Class.ClockPart.NUMBER;
  $option.textContent = this.formatMinute_(0);
  this.$element_.appendChild($option);
  var optionWidth = $option.offsetWidth;
  var optionHeight = $option.offsetHeight;
  this.$element_.removeChild($option);
  
  this.$clockPart_ = document.createElement('div');
  this.$clockPart_.className = AnalogTimePicker.Class.ClockPart.CONTAINER;
  this.$clockPart_.style.paddingBottom = optionHeight * 0.8 + 'px';
  this.$element_.appendChild(this.$clockPart_);
  
  this.clockCenter_ = this.$clockPart_.offsetWidth / 2;
  this.clockRadius_ = this.$clockPart_.offsetWidth / 2 - optionWidth;
  
  var $clock = document.createElement('div');
  $clock.className = AnalogTimePicker.Class.ClockPart.CLOCK;
  this.$clockPart_.appendChild($clock);
  $clock.style.height = $clock.offsetWidth + 'px';
  
  this.$hourOptions_ = [];
  for (hour = 0; hour < 12; hour++) {
    $option = document.createElement('div');
    $option.className = AnalogTimePicker.Class.ClockPart.NUMBER;
    $option.textContent = this.formatHour_(hour);
    this.$clockPart_.appendChild($option);
    this.positionAtAngle_($option, this.getAngleAtHour_(hour));
    this.$hourOptions_.push($option);
  }
  
  this.$minuteOptions_ = [];
  for (minute = 0; minute < 60; minute += 5) {
    $option = document.createElement('div');
    $option.className = AnalogTimePicker.Class.ClockPart.NUMBER;
    $option.textContent = this.formatMinute_(minute);
    this.$clockPart_.appendChild($option);
    this.positionAtAngle_($option, this.getAngleAtMinute_(minute));
    $option.style.display = 'none';
    this.$minuteOptions_.push($option);
  }
  
  this.$am_ = document.createElement('div');
  this.$am_.className = AnalogTimePicker.Class.ClockPart.AMPM;
  this.$am_.textContent = 'AM';
  this.$clockPart_.appendChild(this.$am_);
  this.$am_.style.left =
      this.clockCenter_ - this.clockRadius_ - optionWidth / 2 + 'px';
  this.$am_.style.top =
      this.clockCenter_ + this.clockRadius_ + optionHeight / 2 + 'px';
  
  this.$pm_ = document.createElement('div');
  this.$pm_.className = AnalogTimePicker.Class.ClockPart.AMPM;
  this.$pm_.textContent = 'PM';
  this.$clockPart_.appendChild(this.$pm_);
  this.$pm_.style.left = this.clockCenter_ + this.clockRadius_ -
      this.$pm_.offsetWidth + optionWidth / 2 + 'px';
  this.$pm_.style.top = this.clockCenter_ + this.clockRadius_ +
      optionHeight / 2 + 'px';
  
  this.selectionSize_ = Math.max(this.$am_.offsetWidth, this.$am_.offsetHeight);
  
  this.$clockSelection_ = document.createElement('div');
  this.$clockSelection_.className = AnalogTimePicker.Class.ClockPart.SELECTION;
  this.$clockSelection_.style.width = this.selectionSize_ + 'px';
  this.$clockSelection_.style.height = this.selectionSize_ + 'px';
  this.$clockPart_.appendChild(this.$clockSelection_);
  this.positionClockSelection_();
  
  this.$hoverSelection_ = document.createElement('div');
  this.$hoverSelection_.className = AnalogTimePicker.Class.ClockPart.HOVER;
  this.$hoverSelection_.style.width = this.selectionSize_ / 3 + 'px';
  this.$hoverSelection_.style.height = this.selectionSize_ / 3 + 'px';
  this.$hoverSelection_.style.display = 'none';
  this.$clockPart_.appendChild(this.$hoverSelection_);
  
  this.$amPmSelection_ = document.createElement('div');
  this.$amPmSelection_.className = AnalogTimePicker.Class.ClockPart.SELECTION;
  this.$amPmSelection_.style.width = this.selectionSize_ * 1.2 + 'px';
  this.$amPmSelection_.style.height = this.selectionSize_ * 1.2 + 'px';
  this.$clockPart_.appendChild(this.$amPmSelection_);
  this.$amPmSelection_.style.top = this.$am_.offsetTop -
      (this.selectionSize_ * 1.2 - this.$am_.offsetHeight) / 2 + 'px';
  this.positionAmPmSelection_();
  
  this.attachEventHandlers_();
}

AnalogTimePicker.Class = {
  CONTAINER: 'analogtimepicker-container',
  TextPart: {
    CONTAINER: 'analogtimepicker-textpart',
    HOUR: 'analogtimepicker-textpart-hour',
    HOUR_SELECTED: 'analogtimepicker-textpart-hour ' +
        'analogtimepicker-textpart-selected',
    COLON: 'analogtimepicker-textpart-colon',
    MINUTE: 'analogtimepicker-textpart-minute',
    MINUTE_SELECTED: 'analogtimepicker-textpart-minute ' +
        'analogtimepicker-textpart-selected',
    AMPM: 'analogtimepicker-textpart-ampm'
  },
  ClockPart: {
    CONTAINER: 'analogtimepicker-clockpart',
    NUMBER: 'analogtimepicker-clockpart-number',
    CLOCK: 'analogtimepicker-clockpart-clock',
    AMPM: 'analogtimepicker-clockpart-ampm',
    SELECTION: 'analogtimepicker-clockpart-selection',
    HOVER: 'analogtimepicker-clockpart-hover'
  }
};

AnalogTimePicker.prototype.formatHour_ = function(hour) {
  var display = hour % 12;
  return display === 0 ? 12 : display;
};

AnalogTimePicker.prototype.formatMinute_ = function(minute) {
  return minute.toString().length == 1 ? '0' + minute : minute;
};

AnalogTimePicker.prototype.formatAmPm_ = function(hour) {
  return hour < 12 ? 'AM' : 'PM';
};

AnalogTimePicker.prototype.positionAtAngle_ = function($element, angle) {
  $element.style.left = this.clockCenter_ +
      this.clockRadius_ * Math.cos(angle) - $element.offsetWidth / 2 + 'px';
  $element.style.top = this.clockCenter_ +
      this.clockRadius_ * Math.sin(angle) - $element.offsetHeight / 2 + 'px';
};

AnalogTimePicker.prototype.getAngleAtHour_ = function(hour) {
  return (hour / 12) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.getAngleAtMinute_ = function(minute) {
  return (minute / 60) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.positionClockSelection_ = function() {
  var angle = this.$hour_.className ==
      AnalogTimePicker.Class.TextPart.HOUR_SELECTED ?
      this.getAngleAtHour_(this.hour_) : this.getAngleAtMinute_(this.minute_);
  this.positionAtAngle_(this.$clockSelection_, angle);
};

AnalogTimePicker.prototype.positionHoverSelection_ = function(value) {
  var angle = this.$hour_.className ==
      AnalogTimePicker.Class.TextPart.HOUR_SELECTED ?
      this.getAngleAtHour_(value) : this.getAngleAtMinute_(value);
  this.positionAtAngle_(this.$hoverSelection_, angle);
};

AnalogTimePicker.prototype.positionAmPmSelection_ = function() {
  var $selected = this.hour_ < 12 ? this.$am_ : this.$pm_;
  this.$amPmSelection_.style.left = $selected.offsetLeft -
      (this.selectionSize_ * 1.2 - $selected.offsetWidth) / 2 + 'px';
};

AnalogTimePicker.prototype.attachEventHandlers_ = function() {
  var picker = this;

  picker.$hour_.addEventListener('click', function() {
    picker.switchToChangeHourMode_();
  });
  
  picker.$minute_.addEventListener('click', function() {
    picker.switchToChangeMinuteMode_();
  });
  
  picker.$amPm_.addEventListener('click', function() {
    var newHour = (picker.hour_ + 12) % 24;
    picker.hour_ = newHour;
    picker.$amPm_.textContent = picker.formatAmPm_(picker.hour_);
    picker.positionAmPmSelection_();
    picker.triggerEvent_('timechange');
  });
  
  picker.$element_.addEventListener('mousemove', function(event) {
    var coordinates = picker.getClockCoordinates_(event);
    picker.handleMouseMove_(coordinates);
  });
  
  picker.$element_.addEventListener('click', function(event) {
    var coordinates = picker.getClockCoordinates_(event);
    picker.handleMouseUp_(coordinates);
  });
  
  picker.$element_.addEventListener('touchstart', function(event) {
    var coordinates =
        picker.getClockCoordinates_(event.touches[0]);
    if (picker.isOverClockOption_(coordinates)) {
      event.preventDefault();
      picker.tapped_ = true;
      var touchEndListener = function(event) {
        document.removeEventListener('touchend', touchEndListener);
        var coordinates = picker.getClockCoordinates_(event.changedTouches[0]);
        picker.handleMouseUp_(coordinates);
        picker.tapped_ = false;
      };
      document.addEventListener('touchend', touchEndListener);
    }
  });
  
  picker.$element_.addEventListener('touchmove', function(event) {
    picker.tapped_ = false;
    var coordinates =
      picker.getClockCoordinates_(event.touches[0]);
    picker.handleMouseMove_(coordinates);
  });
  
  picker.$am_.addEventListener('click', function() {
    if (picker.hour_ >= 12) {
      var newHour = picker.hour_ - 12;
      picker.hour_ = newHour;
      picker.$amPm_.textContent = picker.formatAmPm_(picker.hour_);
      picker.positionAmPmSelection_();
      picker.triggerEvent_('timechange');
    }
  });
  
  picker.$pm_.addEventListener('click', function() {
    if (picker.hour_ < 12) {
      var newHour = picker.hour_ + 12;
      picker.hour_ = newHour;
      picker.$amPm_.textContent = picker.formatAmPm_(picker.hour_);
      picker.positionAmPmSelection_();
      picker.triggerEvent_('timechange');
    }
  });
};

AnalogTimePicker.prototype.handleMouseMove_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.className ==
        AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
      var hour = this.getHourAtAngle_(angle);
      this.$hour_.textContent = this.formatHour_(hour);
      this.positionHoverSelection_(hour);
    } else {
      var minute = this.getMinuteAtAngle_(angle);
      this.$minute_.textContent = this.formatMinute_(minute);
      this.positionHoverSelection_(minute);
    }
    this.$hoverSelection_.style.display = 'block';
    this.$element_.style.cursor = 'pointer';
  } else {
    if (this.$hour_.className ==
        AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
      this.$hour_.textContent = this.formatHour_(this.hour_);
    } else {
      this.$minute_.textContent = this.formatMinute_(this.minute_);
    }
    this.$hoverSelection_.style.display = 'none';
    this.$element_.style.cursor = 'auto';
  }
};

AnalogTimePicker.prototype.handleMouseUp_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.className ==
        AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
      var newHour =
        Math.floor(this.hour_ / 12) * 12 + this.getHourAtAngle_(angle);
      if (this.hour_ != newHour) {
        this.hour_ = newHour;
        this.$hour_.textContent = this.formatHour_(this.hour_);
        this.triggerEvent_('timechange');
      }
      this.switchToChangeMinuteMode_();
    } else {
      var newMinute = this.getMinuteAtAngle_(angle);
      if (this.minute_ != newMinute) {
        this.minute_ = newMinute;
        this.$minute_.textContent = this.formatMinute_(this.minute_);
        this.positionClockSelection_();
        this.triggerEvent_('timechange');
      }
    }
    this.$hoverSelection_.style.display = 'none';
  }
};

AnalogTimePicker.prototype.getClockCoordinates_ = function(clientCoordinates) {
  var rect = this.$clockPart_.getBoundingClientRect();
  var elementPageX = rect.left + document.body.scrollLeft;
  var elementPageY = rect.top + document.body.scrollTop;
  return {
    x: clientCoordinates.pageX - elementPageX - this.clockCenter_,
    y: clientCoordinates.pageY - elementPageY - this.clockCenter_
  };
};

AnalogTimePicker.prototype.isOverClockOption_ = function(coordinates) {
  var distance =
    Math.sqrt(coordinates.x * coordinates.x + coordinates.y * coordinates.y);
  return Math.abs(distance - this.clockRadius_) < this.selectionSize_ / 2;
};

AnalogTimePicker.prototype.getAngleAtCoordinates_ = function(coordinates) {
  return Math.atan2(coordinates.y, coordinates.x) + Math.PI / 2;
};

AnalogTimePicker.prototype.getHourAtAngle_ = function(angle) {
  return (Math.round(angle * 6 / Math.PI) + 12) % 12;
};

AnalogTimePicker.prototype.getMinuteAtAngle_ = function(angle) {
  if (this.tapped_) {
    return (Math.round(angle * 6 / Math.PI) + 12) % 12 * 5;
  } else {
    return (Math.round(angle * 30 / Math.PI) + 60) % 60;
  }
};

AnalogTimePicker.prototype.switchToChangeHourMode_ = function() {
  if (this.$hour_.className !=
      AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
    this.$minute_.className = AnalogTimePicker.Class.TextPart.HOUR;
    var i;
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].style.display = 'block';
    }
    this.$hour_.className = AnalogTimePicker.Class.TextPart.HOUR_SELECTED;;
    this.positionClockSelection_();
    this.triggerEvent_('modechange');
  }
};

AnalogTimePicker.prototype.switchToChangeMinuteMode_ = function() {
  if (this.$minute_.className !=
      AnalogTimePicker.Class.TextPart.MINUTE_SELECTED) {
    this.$hour_.className = AnalogTimePicker.Class.TextPart.MINUTE;
    var i;
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].style.display = 'block';
    }
    this.$minute_.className = AnalogTimePicker.Class.TextPart.MINUTE_SELECTED;
    this.positionClockSelection_();
    this.triggerEvent_('modechange');
  }
};

AnalogTimePicker.prototype.triggerEvent_ = function(type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  this.$element_.dispatchEvent(event);
};

AnalogTimePicker.prototype.switchMode = function(mode) {
  switch (mode) {
    case 'hour':
      this.switchToChangeHourMode_();
      break;
    case 'minute':
      this.switchToChangeMinuteMode_();
      break;
  }
};

AnalogTimePicker.prototype.getMode = function() {
  return this.$hour_.className ==
    AnalogTimePicker.Class.TextPart.HOUR_SELECTED ? 'hour' : 'minute';
};

AnalogTimePicker.prototype.setHour = function(hour) {
  if (hour >= 0 && hour < 24) {
    this.hour_ = hour;
    this.$hour_.textContent = this.formatHour_(this.hour_);
    this.$amPm_.textContent = this.formatAmPm_(this.hour_);
    this.positionClockSelection_();
    this.positionAmPmSelection_();
  }
};

AnalogTimePicker.prototype.setMinute = function(minute) {
  if (minute >= 0 && minute < 60) {
    this.minute_ = minute;
    this.$minute_.textContent = this.formatMinute_(this.minute_);
    this.positionClockSelection_();
  }
};

AnalogTimePicker.prototype.getHour = function() {
  return this.hour_;
};

AnalogTimePicker.prototype.getMinute = function() {
  return this.minute_;
};

AnalogTimePicker.prototype.getFormattedHour = function() {
  return this.formatHour_(this.hour_);
};

AnalogTimePicker.prototype.getFormattedMinute = function() {
  return this.formatMinute_(this.minute_);
};

AnalogTimePicker.prototype.getFormattedAmPm = function() {
  return this.formatAmPm_(this.hour_);
};