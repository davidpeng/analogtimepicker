function AnalogTimePicker($element, hour, minute) {
  this.$element_ = $element;
  this.$element_.className += 'atp';
  this.hour_ = typeof hour != 'undefined' ? hour : 0;
  this.minute_ = typeof minute != 'undefined' ? minute : 0;
  this.width_ = this.$element_.offsetWidth;
  this.height_ = this.$element_.offsetHeight;
  this.largeFontSize_ = this.height_ / 6;
  this.smallFontSize_ = this.largeFontSize_ / 3;
  this.optionFontSize_ = this.height_ / 14;
  this.tapped_ = false;
  this.beforeChangeTimeHandler_ = function() {};
  this.afterChangeTimeHandler_ = function() {};
  this.beforeSwitchModeHandler_ = function() {};
  this.afterSwitchModeHandler_ = function() {};
  
  var $time = document.createElement('div');
  $time.className = 'atp-time';
  this.$element_.appendChild($time);
  
  this.$hour_ = document.createElement('div');
  this.$hour_.textContent = '12';
  this.$hour_.style.cursor = 'pointer';
  this.$hour_.style.display = 'inline-block';
  this.$hour_.style.fontSize = this.largeFontSize_ + 'px';
  this.$hour_.style.textAlign = 'right';
  this.$hour_.className = 'atp-selected';
  $time.appendChild(this.$hour_);
  this.$hour_.style.width = this.$hour_.offsetWidth + 'px';
  this.$hour_.textContent = this.getDisplayHour_(this.hour_);
  
  var $colon = document.createElement('span');
  $colon.textContent = ':';
  $colon.style.fontSize = this.largeFontSize_ + 'px';
  $time.appendChild($colon);
  
  this.$minute_ = document.createElement('span');
  this.$minute_.textContent = this.getDisplayMinute_(this.minute_);
  this.$minute_.style.cursor = 'pointer';
  this.$minute_.style.fontSize = this.largeFontSize_ + 'px';
  $time.appendChild(this.$minute_);
  
  this.$amPm_ = document.createElement('span');
  this.$amPm_.textContent = this.getDisplayAmPm_(this.hour_);
  this.$amPm_.style.cursor = 'pointer';
  this.$amPm_.style.fontSize = this.smallFontSize_ + 'px';
  $time.appendChild(this.$amPm_);
  
  this.$hour_.style.marginLeft =
      ($time.offsetWidth - this.$hour_.offsetWidth - $colon.offsetWidth -
       this.$minute_.offsetWidth - this.$amPm_.offsetWidth) / 2 + 'px';
  
  var $option = document.createElement('div');
  $option.textContent = '00';
  $option.style.fontSize = this.optionFontSize_ + 'px';
  this.$element_.appendChild($option);
  var optionWidth = $option.offsetWidth;
  var optionHeight = $option.offsetHeight;
  this.$element_.removeChild($option);
  
  this.clockCenterX_ = this.width_ / 2;
  this.clockCenterY_ = this.$hour_.offsetHeight +
      (this.height_ - this.$hour_.offsetHeight - optionHeight) / 2;
  this.clockRadius_ = Math.min(this.width_ / 2 - optionWidth,
      (this.height_ - this.$hour_.offsetHeight - optionHeight) / 2 -
      optionHeight);
  
  var $clock = document.createElement('div');
  $clock.className = 'atp-clock';
  $clock.style.left = 
      this.clockCenterX_ - this.clockRadius_ - optionWidth * 0.9 + 'px';
  $clock.style.top =
      this.clockCenterY_ - this.clockRadius_ - optionWidth * 0.9 + 'px';
  $clock.style.width = this.clockRadius_ * 2 + optionWidth * 1.8 + 'px';
  $clock.style.height = this.clockRadius_ * 2 + optionWidth * 1.8 + 'px';
  this.$element_.appendChild($clock);
  
  this.$hourOptions_ = [];
  for (hour = 0; hour < 12; hour++) {
    $option = document.createElement('div');
    $option.textContent = this.getDisplayHour_(hour);
    $option.style.fontSize = this.optionFontSize_ + 'px';
    this.$element_.appendChild($option);
    this.positionAtAngle_($option, this.getAngleAtHour_(hour));
    this.$hourOptions_.push($option);
  }
  
  this.$minuteOptions_ = [];
  for (minute = 0; minute < 60; minute += 5) {
    $option = document.createElement('div');
    $option.textContent = this.getDisplayMinute_(minute);
    $option.style.fontSize = this.optionFontSize_ + 'px';
    this.$element_.appendChild($option);
    this.positionAtAngle_($option, this.getAngleAtMinute_(minute));
    $option.style.display = 'none';
    this.$minuteOptions_.push($option);
  }
  
  this.$am_ = document.createElement('div');
  this.$am_.textContent = 'AM';
  this.$am_.style.cursor = 'pointer';
  this.$am_.style.fontSize = this.optionFontSize_ + 'px';
  this.$element_.appendChild(this.$am_);
  this.$am_.style.left =
      this.clockCenterX_ - this.clockRadius_ - optionWidth / 2 + 'px';
  this.$am_.style.top =
      this.clockCenterY_ + this.clockRadius_ + optionHeight / 2 + 'px';
  
  this.$pm_ = document.createElement('div');
  this.$pm_.textContent = 'PM';
  this.$pm_.style.cursor = 'pointer';
  this.$pm_.style.fontSize = this.optionFontSize_ + 'px';
  this.$element_.appendChild(this.$pm_);
  this.$pm_.style.left = this.clockCenterX_ + this.clockRadius_ -
      this.$pm_.offsetWidth + optionWidth / 2 + 'px';
  this.$pm_.style.top = this.clockCenterY_ + this.clockRadius_ +
      optionHeight / 2 + 'px';
  
  this.selectionSize_ = Math.max(this.$am_.offsetWidth, this.$am_.offsetHeight);
  
  this.$clockSelection_ = document.createElement('div');
  this.$clockSelection_.className = 'atp-selection';
  this.$clockSelection_.style.width = this.selectionSize_ + 'px';
  this.$clockSelection_.style.height = this.selectionSize_ + 'px';
  this.$element_.appendChild(this.$clockSelection_);
  this.positionClockSelection_();
  
  this.$hoverSelection_ = document.createElement('div');
  this.$hoverSelection_.className = 'atp-hover-selection';
  this.$hoverSelection_.style.width = this.selectionSize_ / 3 + 'px';
  this.$hoverSelection_.style.height = this.selectionSize_ / 3 + 'px';
  this.$hoverSelection_.style.display = 'none';
  this.$element_.appendChild(this.$hoverSelection_);
  
  this.$amPmSelection_ = document.createElement('div');
  this.$amPmSelection_.className = 'atp-selection';
  this.$amPmSelection_.style.width = this.selectionSize_ * 1.2 + 'px';
  this.$amPmSelection_.style.height = this.selectionSize_ * 1.2 + 'px';
  this.$element_.appendChild(this.$amPmSelection_);
  this.$amPmSelection_.style.top = this.$am_.offsetTop -
      (this.selectionSize_ * 1.2 - this.$am_.offsetHeight) / 2 + 'px';
  this.positionAmPmSelection_();
  
  this.attachEventHandlers_();
}

AnalogTimePicker.prototype.getDisplayHour_ = function(hour) {
  var display = hour % 12;
  return display === 0 ? 12 : display;
};

AnalogTimePicker.prototype.getDisplayMinute_ = function(minute) {
  return minute.toString().length == 1 ? '0' + minute : minute;
};

AnalogTimePicker.prototype.getDisplayAmPm_ = function(hour) {
  return hour < 12 ? 'AM' : 'PM';
};

AnalogTimePicker.prototype.positionAtAngle_ = function($element, angle) {
  $element.style.left = this.clockCenterX_ +
      this.clockRadius_ * Math.cos(angle) - $element.offsetWidth / 2 + 'px';
  $element.style.top = this.clockCenterY_ +
      this.clockRadius_ * Math.sin(angle) - $element.offsetHeight / 2 + 'px';
};

AnalogTimePicker.prototype.getAngleAtHour_ = function(hour) {
  return (hour / 12) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.getAngleAtMinute_ = function(minute) {
  return (minute / 60) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.positionClockSelection_ = function() {
  var angle = this.$hour_.className == 'atp-selected' ?
      this.getAngleAtHour_(this.hour_) : this.getAngleAtMinute_(this.minute_);
  this.positionAtAngle_(this.$clockSelection_, angle);
};

AnalogTimePicker.prototype.positionHoverSelection_ = function(value) {
  var angle = this.$hour_.className == 'atp-selected' ?
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
    if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
      picker.hour_ = newHour;
      picker.$amPm_.textContent = picker.getDisplayAmPm_(picker.hour_);
      picker.positionAmPmSelection_();
      picker.afterChangeTimeHandler_();
    }
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
      function touchEndListener(event) {
        document.removeEventListener('touchend', touchEndListener);
        var coordinates = picker.getClockCoordinates_(event.changedTouches[0]);
        picker.handleMouseUp_(coordinates);
        picker.tapped_ = false;
      }
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
      if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        picker.hour_ = newHour;
        picker.$amPm_.textContent = picker.getDisplayAmPm_(picker.hour_);
        picker.positionAmPmSelection_();
        picker.afterChangeTimeHandler_();
      }
    }
  });
  
  picker.$pm_.addEventListener('click', function() {
    if (picker.hour_ < 12) {
      var newHour = picker.hour_ + 12;
      if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        picker.hour_ = newHour;
        picker.$amPm_.textContent = picker.getDisplayAmPm_(picker.hour_);
        picker.positionAmPmSelection_();
        picker.afterChangeTimeHandler_();
      }
    }
  });
};

AnalogTimePicker.prototype.handleMouseMove_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.className == 'atp-selected') {
      var hour = this.getHourAtAngle_(angle);
      this.$hour_.textContent = this.getDisplayHour_(hour);
      this.positionHoverSelection_(hour);
    } else {
      var minute = this.getMinuteAtAngle_(angle);
      this.$minute_.textContent = this.getDisplayMinute_(minute);
      this.positionHoverSelection_(minute);
    }
    this.$hoverSelection_.style.display = 'block';
    this.$element_.style.cursor = 'pointer';
  } else {
    if (this.$hour_.className == 'atp-selected') {
      this.$hour_.textContent = this.getDisplayHour_(this.hour_);
    } else {
      this.$minute_.textContent = this.getDisplayMinute_(this.minute_);
    }
    this.$hoverSelection_.style.display = 'none';
    this.$element_.style.cursor = 'auto';
  }
};

AnalogTimePicker.prototype.handleMouseUp_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.className == 'atp-selected') {
      var newHour =
        Math.floor(this.hour_ / 12) * 12 + this.getHourAtAngle_(angle);
      if (this.hour_ != newHour &&
          this.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        this.hour_ = newHour;
        this.$hour_.textContent = this.getDisplayHour_(this.hour_);
        this.afterChangeTimeHandler_();
      }
      this.switchToChangeMinuteMode_();
    } else {
      var newMinute = this.getMinuteAtAngle_(angle);
      if (this.minute_ != newMinute &&
          this.beforeChangeTimeHandler_(this.hour_, newMinute) !== false) {
        this.minute_ = newMinute;
        this.$minute_.textContent = this.getDisplayMinute_(this.minute_);
        this.positionClockSelection_();
        this.afterChangeTimeHandler_();
      }
    }
    this.$hoverSelection_.style.display = 'none';
  }
};

AnalogTimePicker.prototype.getClockCoordinates_ = function(clientCoordinates) {
  var elementPageOffset = this.$element_.getBoundingClientRect();
  return {
    x: clientCoordinates.pageX - elementPageOffset.left - this.clockCenterX_,
    y: clientCoordinates.pageY - elementPageOffset.top - this.clockCenterY_
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
  if (this.$hour_.className != 'atp-selected' &&
      this.beforeSwitchModeHandler_('hour') !== false) {
    this.$minute_.className = '';
    var i;
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].style.display = 'block';
    }
    this.$hour_.className = 'atp-selected';
    this.positionClockSelection_();
    this.afterSwitchModeHandler_();
  }
};

AnalogTimePicker.prototype.switchToChangeMinuteMode_ = function() {
  if (this.$minute_.className != 'atp-selected' &&
      this.beforeSwitchModeHandler_('minute') !== false) {
    this.$hour_.className = '';
    var i;
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].style.display = 'block';
    }
    this.$minute_.className = 'atp-selected';
    this.positionClockSelection_();
    this.afterSwitchModeHandler_();
  }
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
  return this.$hour_.className == 'atp-selected' ? 'hour' : 'minute';
};

AnalogTimePicker.prototype.setHour = function(hour) {
  if (hour >= 0 && hour < 24) {
    this.hour_ = hour;
    this.$hour_.textContent = this.getDisplayHour_(this.hour_);
    this.$amPm_.textContent = this.getDisplayAmPm_(this.hour_);
    this.positionClockSelection_();
    this.positionAmPmSelection_();
  }
};

AnalogTimePicker.prototype.setMinute = function(minute) {
  if (minute >= 0 && minute < 60) {
    this.minute_ = minute;
    this.$minute_.textContent = this.getDisplayMinute_(this.minute_);
    this.positionClockSelection_();
  }
};

AnalogTimePicker.prototype.getHour = function() {
  return this.hour_;
};

AnalogTimePicker.prototype.getMinute = function() {
  return this.minute_;
};

AnalogTimePicker.prototype.beforeChangeTime = function(handler) {
  this.beforeChangeTimeHandler_ = handler;
};

AnalogTimePicker.prototype.afterChangeTime = function(handler) {
  this.afterChangeTimeHandler_ = handler;
};

AnalogTimePicker.prototype.beforeSwitchMode = function(handler) {
  this.beforeSwitchModeHandler_ = handler;
};

AnalogTimePicker.prototype.afterSwitchMode = function(handler) {
  this.afterSwitchModeHandler_ = handler;
};

AnalogTimePicker.prototype.getDisplayHour = function() {
  return this.getDisplayHour_(this.hour_);
};

AnalogTimePicker.prototype.getDisplayMinute = function() {
  return this.getDisplayMinute_(this.minute_);
};

AnalogTimePicker.prototype.getDisplayAmPm = function() {
  return this.getDisplayAmPm_(this.hour_);
};