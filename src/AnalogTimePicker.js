function AnalogTimePicker($element, hour, minute) {
  this.$element_ = $element;
  this.$element_.addClass('atp');
  this.hour_ = typeof hour != 'undefined' ? hour : 0;
  this.minute_ = typeof minute != 'undefined' ? minute : 0;
  this.width_ = this.$element_.width();
  this.height_ = this.$element_.height();
  this.largeFontSize_ = this.height_ / 6;
  this.smallFontSize_ = this.largeFontSize_ / 3;
  this.optionFontSize_ = this.height_ / 14;
  this.tapped_ = false;
  this.beforeChangeTimeHandler_ = function() {};
  this.afterChangeTimeHandler_ = function() {};
  this.beforeSwitchModeHandler_ = function() {};
  this.afterSwitchModeHandler_ = function() {};
  
  var $time = $('<div>');
  $time.addClass('atp-time');
  $time.appendTo(this.$element_);
  
  this.$hour_ = $('<div>12</div>');
  this.$hour_.css('cursor', 'pointer');
  this.$hour_.css('display', 'inline-block');
  this.$hour_.css('font-size', this.largeFontSize_ + 'px');
  this.$hour_.css('text-align', 'right');
  this.$hour_.addClass('atp-selected');
  this.$hour_.appendTo($time);
  this.$hour_.width(this.$hour_.width());
  this.$hour_.text(this.getDisplayHour_(this.hour_));
  
  var $colon = $('<span>:</span>');
  $colon.css('font-size', this.largeFontSize_ + 'px');
  $colon.appendTo($time);
  
  this.$minute_ = $('<span>');
  this.$minute_.text(this.getDisplayMinute_(this.minute_));
  this.$minute_.css('cursor', 'pointer');
  this.$minute_.css('font-size', this.largeFontSize_ + 'px');
  this.$minute_.appendTo($time);
  
  this.$amPm_ = $('<span>');
  this.$amPm_.text(this.getDisplayAmPm_(this.hour_));
  this.$amPm_.css('cursor', 'pointer');
  this.$amPm_.css('font-size', this.smallFontSize_ + 'px');
  this.$amPm_.appendTo($time);
  
  this.$hour_.css('margin-left', ($time.width() - this.$hour_.width() -
    $colon.width() - this.$minute_.width() - this.$amPm_.width()) / 2 + 'px');
  
  var $option = $('<div>00</div>');
  $option.css('font-size', this.optionFontSize_ + 'px');
  $option.appendTo(this.$element_);
  var optionWidth = $option.width();
  var optionHeight = $option.height();
  $option.remove();
  
  this.clockCenterX_ = this.width_ / 2;
  this.clockCenterY_ = this.$hour_.height() +
    (this.height_ - this.$hour_.height() - optionHeight) / 2;
  this.clockRadius_ = Math.min(this.width_ / 2 - optionWidth,
    (this.height_ - this.$hour_.height() - optionHeight) / 2 - optionHeight);
  
  var $clock = $('<div>');
  $clock.addClass('atp-clock');
  $clock.css('left',
    this.clockCenterX_ - this.clockRadius_ - optionWidth * 0.9 + 'px');
  $clock.css('top',
    this.clockCenterY_ - this.clockRadius_ - optionWidth * 0.9 + 'px');
  $clock.width(this.clockRadius_ * 2 + optionWidth * 1.8);
  $clock.height(this.clockRadius_ * 2 + optionWidth * 1.8);
  $clock.appendTo(this.$element_);
  
  this.$hourOptions_ = [];
  for (hour = 0; hour < 12; hour++) {
    $option = $('<div>');
    $option.text(this.getDisplayHour_(hour));
    $option.css('font-size', this.optionFontSize_ + 'px');
    $option.appendTo(this.$element_);
    this.positionAtAngle_($option, this.getAngleAtHour_(hour));
    this.$hourOptions_.push($option);
  }
  
  this.$minuteOptions_ = [];
  for (minute = 0; minute < 60; minute += 5) {
    $option = $('<div>');
    $option.text(this.getDisplayMinute_(minute));
    $option.css('font-size', this.optionFontSize_ + 'px');
    $option.hide();
    $option.appendTo(this.$element_);
    this.positionAtAngle_($option, this.getAngleAtMinute_(minute));
    this.$minuteOptions_.push($option);
  }
  
  this.$am_ = $('<div>AM</div>');
  this.$am_.css('cursor', 'pointer');
  this.$am_.css('font-size', this.optionFontSize_ + 'px');
  this.$am_.appendTo(this.$element_);
  this.$am_.css('left',
    this.clockCenterX_ - this.clockRadius_ - optionWidth / 2 + 'px');
  this.$am_.css('top',
    this.clockCenterY_ + this.clockRadius_ + optionHeight / 2 + 'px');
  
  this.$pm_ = $('<div>PM</div>');
  this.$pm_.css('cursor', 'pointer');
  this.$pm_.css('font-size', this.optionFontSize_ + 'px');
  this.$pm_.appendTo(this.$element_);
  this.$pm_.css('left', this.clockCenterX_ +
    this.clockRadius_ - this.$pm_.width() + optionWidth / 2 + 'px');
  this.$pm_.css('top',
    this.clockCenterY_ + this.clockRadius_ + optionHeight / 2 + 'px');
  
  this.selectionSize_ = Math.max(this.$am_.width(), this.$am_.height());
  
  this.$clockSelection_ = $('<div>');
  this.$clockSelection_.addClass('atp-selection');
  this.$clockSelection_.width(this.selectionSize_);
  this.$clockSelection_.height(this.selectionSize_);
  this.$clockSelection_.appendTo(this.$element_);
  this.positionClockSelection_();
  
  this.$hoverSelection_ = $('<div>');
  this.$hoverSelection_.addClass('atp-selection');
  this.$hoverSelection_.width(this.selectionSize_ / 3);
  this.$hoverSelection_.height(this.selectionSize_ / 3);
  this.$hoverSelection_.hide();
  this.$hoverSelection_.appendTo(this.$element_);
  
  this.$amPmSelection_ = $('<div>');
  this.$amPmSelection_.addClass('atp-selection');
  this.$amPmSelection_.width(this.selectionSize_ * 1.2);
  this.$amPmSelection_.height(this.selectionSize_ * 1.2);
  this.$amPmSelection_.appendTo(this.$element_);
  this.$amPmSelection_.css('top', this.$am_.position().top -
    (this.selectionSize_ * 1.2 - this.$am_.height()) / 2 + 'px');
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
  $element.css('left', this.clockCenterX_ +
    this.clockRadius_ * Math.cos(angle) - $element.outerWidth() / 2);
  $element.css('top', this.clockCenterY_ +
    this.clockRadius_ * Math.sin(angle) - $element.outerHeight() / 2);
};

AnalogTimePicker.prototype.getAngleAtHour_ = function(hour) {
  return (hour / 12) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.getAngleAtMinute_ = function(minute) {
  return (minute / 60) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.positionClockSelection_ = function() {
  var angle = this.$hour_.hasClass('atp-selected') ?
    this.getAngleAtHour_(this.hour_) : this.getAngleAtMinute_(this.minute_);
  this.positionAtAngle_(this.$clockSelection_, angle);
};

AnalogTimePicker.prototype.positionHoverSelection_ = function(value) {
  var angle = this.$hour_.hasClass('atp-selected') ?
    this.getAngleAtHour_(value) : this.getAngleAtMinute_(value);
  this.positionAtAngle_(this.$hoverSelection_, angle);
};

AnalogTimePicker.prototype.positionAmPmSelection_ = function() {
  var $selected = this.hour_ < 12 ? this.$am_ : this.$pm_;
  this.$amPmSelection_.css('left', $selected.position().left -
    (this.selectionSize_ * 1.2 - $selected.width()) / 2 + 'px');
};

AnalogTimePicker.prototype.attachEventHandlers_ = function() {
  var picker = this;

  picker.$hour_.click(function() {
    picker.switchToChangeHourMode_();
  });
  
  picker.$minute_.click(function() {
    picker.switchToChangeMinuteMode_();
  });
  
  picker.$amPm_.click(function() {
    var newHour = (picker.hour_ + 12) % 24;
    if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
      picker.hour_ = newHour;
      picker.$amPm_.text(picker.getDisplayAmPm_(picker.hour_));
      picker.positionAmPmSelection_();
      picker.afterChangeTimeHandler_();
    }
  });
  
  picker.$element_.mousemove(function(event) {
    var coordinates = picker.getClockCoordinates_(event);
    picker.handleMouseMove_(coordinates);
  });
  
  picker.$element_.click(function(event) {
    var coordinates = picker.getClockCoordinates_(event);
    picker.handleMouseUp_(coordinates);
  });
  
  picker.$element_.on('touchstart', function(event) {
    var coordinates =
      picker.getClockCoordinates_(event.originalEvent.touches[0]);
    if (picker.isOverClockOption_(coordinates)) {
      event.preventDefault();
      picker.tapped_ = true;
      $(document).one('touchend', function(event) {
        var coordinates =
          picker.getClockCoordinates_(event.originalEvent.changedTouches[0]);
        picker.handleMouseUp_(coordinates);
        picker.tapped_ = false;
      });
    }
  });
  
  picker.$element_.on('touchmove', function(event) {
    picker.tapped_ = false;
    var coordinates =
      picker.getClockCoordinates_(event.originalEvent.touches[0]);
    picker.handleMouseMove_(coordinates);
  });
  
  picker.$am_.click(function() {
    if (picker.hour_ >= 12) {
      var newHour = picker.hour_ - 12;
      if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        picker.hour_ = newHour;
        picker.$amPm_.text(picker.getDisplayAmPm_(picker.hour_));
        picker.positionAmPmSelection_();
        picker.afterChangeTimeHandler_();
      }
    }
  });
  
  picker.$pm_.click(function() {
    if (picker.hour_ < 12) {
      var newHour = picker.hour_ + 12;
      if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        picker.hour_ = newHour;
        picker.$amPm_.text(picker.getDisplayAmPm_(picker.hour_));
        picker.positionAmPmSelection_();
        picker.afterChangeTimeHandler_();
      }
    }
  });
};

AnalogTimePicker.prototype.handleMouseMove_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.hasClass('atp-selected')) {
      var hour = this.getHourAtAngle_(angle);
      this.$hour_.text(this.getDisplayHour_(hour));
      this.positionHoverSelection_(hour);
    } else {
      var minute = this.getMinuteAtAngle_(angle);
      this.$minute_.text(this.getDisplayMinute_(minute));
      this.positionHoverSelection_(minute);
    }
    this.$hoverSelection_.show();
    this.$element_.css('cursor', 'pointer');
  } else {
    if (this.$hour_.hasClass('atp-selected')) {
      this.$hour_.text(this.getDisplayHour_(this.hour_));
    } else {
      this.$minute_.text(this.getDisplayMinute_(this.minute_));
    }
    this.$hoverSelection_.hide();
    this.$element_.css('cursor', 'auto');
  }
};

AnalogTimePicker.prototype.handleMouseUp_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.hasClass('atp-selected')) {
      var newHour =
        Math.floor(this.hour_ / 12) * 12 + this.getHourAtAngle_(angle);
      if (this.hour_ != newHour &&
          this.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        this.hour_ = newHour;
        this.$hour_.text(this.getDisplayHour_(this.hour_));
        this.afterChangeTimeHandler_();
      }
      this.switchToChangeMinuteMode_();
    } else {
      var newMinute = this.getMinuteAtAngle_(angle);
      if (this.minute_ != newMinute &&
          this.beforeChangeTimeHandler_(this.hour_, newMinute) !== false) {
        this.minute_ = newMinute;
        this.$minute_.text(this.getDisplayMinute_(this.minute_));
        this.positionClockSelection_();
        this.afterChangeTimeHandler_();
      }
    }
    this.$hoverSelection_.hide();
  }
};

AnalogTimePicker.prototype.getClockCoordinates_ = function(clientCoordinates) {
  return {
    x: clientCoordinates.pageX -
      this.$element_.offset().left - this.clockCenterX_,
    y: clientCoordinates.pageY -
      this.$element_.offset().top - this.clockCenterY_
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
  if (this.beforeSwitchModeHandler_('hour') !== false) {
    this.$minute_.removeClass('atp-selected');
    var i;
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].hide();
    }
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].show();
    }
    this.$hour_.addClass('atp-selected');
    this.positionClockSelection_();
    this.afterSwitchModeHandler_();
  }
};

AnalogTimePicker.prototype.switchToChangeMinuteMode_ = function() {
  if (this.beforeSwitchModeHandler_('minute') !== false) {
    this.$hour_.removeClass('atp-selected');
    var i;
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].hide();
    }
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].show();
    }
    this.$minute_.addClass('atp-selected');
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
  return this.$hour_.hasClass('atp-selected') ? 'hour' : 'minute';
};

AnalogTimePicker.prototype.setHour = function(hour) {
  if (hour >= 0 && hour < 24) {
    this.hour_ = hour;
    this.$hour_.text(this.getDisplayHour_(this.hour_));
    this.$amPm_.text(this.getDisplayAmPm_(this.hour_));
    this.positionClockSelection_();
    this.positionAmPmSelection_();
  }
};

AnalogTimePicker.prototype.setMinute = function(minute) {
  if (minute >= 0 && minute < 60) {
    this.minute_ = minute;
    this.$minute_.text(this.getDisplayMinute_(this.minute_));
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