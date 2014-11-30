function AnalogTimePicker($element) {
  this.$element_ = $element;
  this.$element_.className += ' analogtimepicker-container';
  this.hour_ = 0;
  this.minute_ = 0;
  this.largeFontSize_ = this.$element_.offsetHeight / 6;
  this.smallFontSize_ = this.largeFontSize_ / 3;
  this.optionFontSize_ = this.$element_.offsetHeight / 14;
  this.tapped_ = false;
  this.beforeChangeTimeHandler_ = function() {};
  this.afterChangeTimeHandler_ = function() {};
  this.beforeSwitchModeHandler_ = function() {};
  this.afterSwitchModeHandler_ = function() {};
  
  var $time = document.createElement('div');
  $time.className = 'analogtimepicker-time';
  this.$element_.appendChild($time);
  
  this.$hour_ = document.createElement('div');
  this.$hour_.textContent = this.getFormattedHour();
  this.$hour_.style.cursor = 'pointer';
  this.$hour_.style.display = 'inline-block';
  this.$hour_.style.fontSize = this.largeFontSize_ + 'px';
  this.$hour_.style.textAlign = 'right';
  this.$hour_.className = 'analogtimepicker-selected';
  $time.appendChild(this.$hour_);
  this.$hour_.style.width = this.$hour_.offsetWidth + 'px';
  
  var $colon = document.createElement('span');
  $colon.textContent = ':';
  $colon.style.fontSize = this.largeFontSize_ + 'px';
  $time.appendChild($colon);
  
  this.$minute_ = document.createElement('span');
  this.$minute_.textContent = this.getFormattedMinute();
  this.$minute_.style.cursor = 'pointer';
  this.$minute_.style.fontSize = this.largeFontSize_ + 'px';
  $time.appendChild(this.$minute_);
  
  this.$amPm_ = document.createElement('span');
  this.$amPm_.textContent = this.getFormattedAmPm();
  this.$amPm_.style.cursor = 'pointer';
  this.$amPm_.style.fontSize = this.smallFontSize_ + 'px';
  $time.appendChild(this.$amPm_);
  
  this.$hour_.style.marginLeft =
      ($time.offsetWidth - this.$hour_.offsetWidth - $colon.offsetWidth -
       this.$minute_.offsetWidth - this.$amPm_.offsetWidth) / 2 + 'px';
  
  var $option = document.createElement('div');
  $option.textContent = this.formatMinute_(0);
  $option.style.fontSize = this.optionFontSize_ + 'px';
  this.$element_.appendChild($option);
  var optionWidth = $option.offsetWidth;
  var optionHeight = $option.offsetHeight;
  this.$element_.removeChild($option);
  
  this.clockCenterX_ = this.$element_.offsetWidth / 2;
  this.clockCenterY_ = this.$hour_.offsetHeight + (this.$element_.offsetHeight -
      this.$hour_.offsetHeight - optionHeight) / 2;
  this.clockRadius_ = Math.min(this.$element_.offsetWidth / 2 - optionWidth,
      (this.$element_.offsetHeight - this.$hour_.offsetHeight - optionHeight) /
      2 - optionHeight);
  
  var $clock = document.createElement('div');
  $clock.className = 'analogtimepicker-clock';
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
    $option.textContent = this.formatHour_(hour);
    $option.style.fontSize = this.optionFontSize_ + 'px';
    this.$element_.appendChild($option);
    this.positionAtAngle_($option, this.getAngleAtHour_(hour));
    this.$hourOptions_.push($option);
  }
  
  this.$minuteOptions_ = [];
  for (minute = 0; minute < 60; minute += 5) {
    $option = document.createElement('div');
    $option.textContent = this.formatMinute_(minute);
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
  this.$clockSelection_.className = 'analogtimepicker-selection';
  this.$clockSelection_.style.width = this.selectionSize_ + 'px';
  this.$clockSelection_.style.height = this.selectionSize_ + 'px';
  this.$element_.appendChild(this.$clockSelection_);
  this.positionClockSelection_();
  
  this.$hoverSelection_ = document.createElement('div');
  this.$hoverSelection_.className = 'analogtimepicker-hover-selection';
  this.$hoverSelection_.style.width = this.selectionSize_ / 3 + 'px';
  this.$hoverSelection_.style.height = this.selectionSize_ / 3 + 'px';
  this.$hoverSelection_.style.display = 'none';
  this.$element_.appendChild(this.$hoverSelection_);
  
  this.$amPmSelection_ = document.createElement('div');
  this.$amPmSelection_.className = 'analogtimepicker-selection';
  this.$amPmSelection_.style.width = this.selectionSize_ * 1.2 + 'px';
  this.$amPmSelection_.style.height = this.selectionSize_ * 1.2 + 'px';
  this.$element_.appendChild(this.$amPmSelection_);
  this.$amPmSelection_.style.top = this.$am_.offsetTop -
      (this.selectionSize_ * 1.2 - this.$am_.offsetHeight) / 2 + 'px';
  this.positionAmPmSelection_();
  
  this.attachEventHandlers_();
}

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
  var angle = this.$hour_.className == 'analogtimepicker-selected' ?
      this.getAngleAtHour_(this.hour_) : this.getAngleAtMinute_(this.minute_);
  this.positionAtAngle_(this.$clockSelection_, angle);
};

AnalogTimePicker.prototype.positionHoverSelection_ = function(value) {
  var angle = this.$hour_.className == 'analogtimepicker-selected' ?
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
      picker.$amPm_.textContent = picker.formatAmPm_(picker.hour_);
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
      if (picker.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        picker.hour_ = newHour;
        picker.$amPm_.textContent = picker.formatAmPm_(picker.hour_);
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
        picker.$amPm_.textContent = picker.formatAmPm_(picker.hour_);
        picker.positionAmPmSelection_();
        picker.afterChangeTimeHandler_();
      }
    }
  });
};

AnalogTimePicker.prototype.handleMouseMove_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.$hour_.className == 'analogtimepicker-selected') {
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
    if (this.$hour_.className == 'analogtimepicker-selected') {
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
    if (this.$hour_.className == 'analogtimepicker-selected') {
      var newHour =
        Math.floor(this.hour_ / 12) * 12 + this.getHourAtAngle_(angle);
      if (this.hour_ != newHour &&
          this.beforeChangeTimeHandler_(newHour, this.minute_) !== false) {
        this.hour_ = newHour;
        this.$hour_.textContent = this.formatHour_(this.hour_);
        this.afterChangeTimeHandler_();
      }
      this.switchToChangeMinuteMode_();
    } else {
      var newMinute = this.getMinuteAtAngle_(angle);
      if (this.minute_ != newMinute &&
          this.beforeChangeTimeHandler_(this.hour_, newMinute) !== false) {
        this.minute_ = newMinute;
        this.$minute_.textContent = this.formatMinute_(this.minute_);
        this.positionClockSelection_();
        this.afterChangeTimeHandler_();
      }
    }
    this.$hoverSelection_.style.display = 'none';
  }
};

AnalogTimePicker.prototype.getClockCoordinates_ = function(clientCoordinates) {
  var rect = this.$element_.getBoundingClientRect();
  var elementPageX = rect.left + document.body.scrollLeft;
  var elementPageY = rect.top + document.body.scrollTop;
  return {
    x: clientCoordinates.pageX - elementPageX - this.clockCenterX_,
    y: clientCoordinates.pageY - elementPageY - this.clockCenterY_
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
  if (this.$hour_.className != 'analogtimepicker-selected' &&
      this.beforeSwitchModeHandler_('hour') !== false) {
    this.$minute_.className = '';
    var i;
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].style.display = 'block';
    }
    this.$hour_.className = 'analogtimepicker-selected';
    this.positionClockSelection_();
    this.afterSwitchModeHandler_();
  }
};

AnalogTimePicker.prototype.switchToChangeMinuteMode_ = function() {
  if (this.$minute_.className != 'analogtimepicker-selected' &&
      this.beforeSwitchModeHandler_('minute') !== false) {
    this.$hour_.className = '';
    var i;
    for (i = 0; i < this.$hourOptions_.length; i++) {
      this.$hourOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.$minuteOptions_.length; i++) {
      this.$minuteOptions_[i].style.display = 'block';
    }
    this.$minute_.className = 'analogtimepicker-selected';
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
  return this.$hour_.className == 'analogtimepicker-selected' ? 'hour' : 'minute';
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

AnalogTimePicker.prototype.getFormattedHour = function() {
  return this.formatHour_(this.hour_);
};

AnalogTimePicker.prototype.getFormattedMinute = function() {
  return this.formatMinute_(this.minute_);
};

AnalogTimePicker.prototype.getFormattedAmPm = function() {
  return this.formatAmPm_(this.hour_);
};
(function($) {
  $.fn.analogtimepicker = function(arg0, arg1) {
    var INPUT_CHANGE_EVENTS =
      'change.analogtimepicker keyup.analogtimepicker ' +
      'paste.analogtimepicker input.analogtimepicker';

    var $this = $(this);
    var self = $this.data('analogtimepicker');
    if (typeof self == 'undefined') {
      self = {};
      self.settings = $.extend({}, $.fn.analogtimepicker.defaults,
        arg0 instanceof Object ? arg0 : {}, $this.data());
      if ($this.prop('tagName').toLowerCase() == 'input') {
        self.$input = $this;
      } else {
        var $inputs = $this.find('input');
        if ($inputs.length > 0) {
          self.$inputGroup = $this;
          self.$input = $inputs.first();
        }
      }
      if (typeof self.$input != 'undefined') {
        self.$popover =
          $('<div class="popover analogtimepicker-popover"><div class="arrow"></div></div>');
        self.$popover.addClass(self.settings.popoverplacement);
        self.$popover.click(function(event) {
          event.stopPropagation();
        });
        var $popoverContent = $('<div>');
        $popoverContent.addClass('popover-content');
        $popoverContent.addClass('analogtimepicker-popover-content');
        self.$picker = $('<div>');
        self.$picker.appendTo($popoverContent);
        $popoverContent.appendTo(self.$popover);
        self.$popover.appendTo($('body'));
        self.$input.on(INPUT_CHANGE_EVENTS, updatePickerTime);
        self.$input.on('click.analogtimepicker', function(event) {
          event.stopPropagation();
          showPopover();
        });
        if (typeof self.$inputGroup != 'undefined') {
          self.$inputGroup.find('button')
              .on('click.analogtimepicker', function(event) {
            event.stopPropagation();
            setPopoverVisible(!self.$popover.is(':visible'));
          });
        }
        $(window).on('resize.analogtimepicker', positionPopover);
      } else {
        self.$picker = $this;
        self.picker = createPicker();
      }
      $this.data('analogtimepicker', self);
    }
    
    if (typeof arg0 == 'string') {
      var returnValue;
      switch (arg0) {
        case 'hour':
          if (typeof arg1 == 'undefined') {
            returnValue = getHour();
          } else {
            setHour(arg1);
          }
          break;
        case 'minute':
          if (typeof arg1 == 'undefined') {
            returnValue = getMinute();
          } else {
            setMinute(arg1);
          }
          break;
        case 'mode':
          if (typeof arg1 == 'undefined') {
            returnValue = getMode();
          } else {
            setMode(arg1);
          }
          break;
        case 'popoverplacement':
          if (typeof arg1 == 'undefined') {
            returnValue = getPopoverPlacement();
          } else {
            setPopoverPlacement(arg1);
          }
          break;
        case 'showpopover':
          setPopoverVisible(true);
          break;
        case 'hidepopover':
          setPopoverVisible(false);
          break;
        case 'destroy':
          destroy();
          break;
      }
      return returnValue;
    } else {
      return $this;
    }
    
    function showPopover() {
      var event = $.Event('show.analogtimepicker.popover');
      $this.triggerHandler(event);
      if (!event.isDefaultPrevented()) {
        $('.analogtimepicker-popover').not(self.$popover).fadeOut('fast');
        self.$popover.fadeIn('fast');
        if (typeof self.picker == 'undefined') {
          self.picker = createPicker();
        }
        updatePickerTime();
        positionPopover();
        $this.triggerHandler('shown.analogtimepicker.popover');
        setTimeout(function() {
          $(document).one('click.analogtimepicker', function() {
            setPopoverVisible(false);
          });
        }, 0);
      }
    }
    
    function positionPopover() {
      var $anchor = self.$inputGroup || self.$input;
      var anchorPosition = $anchor.offset();
      var left;
      var top;
      switch (self.settings.popoverplacement) {
        case 'top':
          left = anchorPosition.left +
            ($anchor.outerWidth() - self.$popover.width()) / 2;
          top = anchorPosition.top - self.$popover.outerHeight();
          break;
        case 'right':
          left = anchorPosition.left + $anchor.outerWidth();
          top = anchorPosition.top +
            ($anchor.outerHeight() - self.$popover.height()) / 2;
          break;
        case 'bottom':
          left = anchorPosition.left +
            ($anchor.outerWidth() - self.$popover.width()) / 2;
          top = anchorPosition.top + $anchor.outerHeight();
          break;
        case 'left':
          left = anchorPosition.left - self.$popover.outerWidth();
          top = anchorPosition.top +
            ($anchor.outerHeight() - self.$popover.height()) / 2;
          break;
      }
      self.$popover.css('left', left + 'px');
      self.$popover.css('top', top + 'px');
    }
    
    function createPicker() {
      var picker = new AnalogTimePicker(self.$picker[0]);
      picker.setHour(self.settings.hour);
      picker.setMinute(self.settings.minute);
      picker.beforeChangeTime(function(hour, minute) {
        var event = $.Event('pick.analogtimepicker.time', {
          hour: hour,
          minute: minute
        });
        $this.triggerHandler(event);
        return !event.isDefaultPrevented();
      });
      picker.afterChangeTime(function() {
        if (typeof self.$input != 'undefined') {
          updateInputText();
          self.$input.trigger('change');
        }
        var event = $.Event('picked.analogtimepicker.time', {
          hour: picker.getHour(),
          minute: picker.getMinute()
        });
        $this.triggerHandler(event);
      });
      picker.beforeSwitchMode(function(mode) {
        var event = $.Event('switch.analogtimepicker.mode', {
          mode: mode
        });
        $this.triggerHandler(event);
        return !event.isDefaultPrevented();
      });
      picker.afterSwitchMode(function() {
        var event = $.Event('switched.analogtimepicker.mode', {
          mode: picker.getMode()
        });
        $this.triggerHandler(event);
      });
      return picker;
    }
    
    function updateInputText() {
      self.$input.val(self.picker.getFormattedHour() + ':' +
        self.picker.getFormattedMinute() + ' ' + self.picker.getFormattedAmPm());
    }
    
    function updatePickerTime() {
      if (typeof self.$input != 'undefined') {
        var hour = 0;
        var minute = 0;
        var matches =
          /^\s*(\d+)\s*(?::\s*(\d+)\s*)?(\S+)?/.exec(self.$input.val());
        if (matches !== null) {
          hour = parseInt(matches[1]);
          if (hour < 0 || hour >= 12) {
            hour = 0;
          }
          if (typeof matches[2] != 'undefined') {
            minute = parseInt(matches[2]);
            if (minute < 0 || minute >= 60) {
              minute = 0;
            }
          }
          if (typeof matches[3] != 'undefined') {
            switch (matches[3].toLowerCase()) {
              case 'pm':
              case 'p':
                hour += 12;
                break;
            }
          }
        }
        self.picker.setHour(hour);
        self.picker.setMinute(minute);
      }
    }
    
    function getHour() {
      if (typeof self.picker != 'undefined') {
        return self.picker.getHour();
      } else {
        return self.settings.hour;
      }
    }
    
    function setHour(hour) {
      if (typeof self.picker != 'undefined') {
        self.picker.setHour(hour);
      } else {
        self.settings.hour = hour;
      }
    }
    
    function getMinute() {
      if (typeof self.picker != 'undefined') {
        return self.picker.getMinute();
      } else {
        return self.settings.minute;
      }
    }
    
    function setMinute(minute) {
      if (typeof self.picker != 'undefined') {
        self.picker.setMinute(minute);
      } else {
        self.settings.minute = minute;
      }
    }
    
    function getMode() {
      if (typeof self.picker != 'undefined') {
        return self.picker.getMode();
      } else {
        return 'hour';
      }
    }
    
    function setMode(mode) {
      if (typeof self.picker != 'undefined') {
        self.picker.switchMode(mode);
      }
    }
    
    function getPopoverPlacement() {
      return self.settings.popoverplacement;
    }
    
    function setPopoverPlacement(popoverPlacement) {
      if (typeof self.$popover != 'undefined') {
        self.$popover.removeClass(self.settings.popoverplacement);
        self.$popover.addClass(popoverPlacement);
      }
      self.settings.popoverplacement = popoverPlacement;
      positionPopover();
    }
    
    function setPopoverVisible(visible) {
      if (typeof self.$popover != 'undefined' &&
          visible != self.$popover.is(':visible')) {
        if (visible) {
          showPopover();
        } else {
          var event = $.Event('hide.analogtimepicker.popover');
          $this.triggerHandler(event);
          if (!event.isDefaultPrevented()) {
            self.$popover.fadeOut('fast');
            $this.triggerHandler('hidden.analogtimepicker.popover');
          }
        }
      }
    }
    
    function destroy() {
      if (typeof self.$input != 'undefined') {
        self.$input.off(INPUT_CHANGE_EVENTS);
        self.$input.off('click.analogtimepicker');
        if (typeof self.$inputGroup != 'undefined') {
          self.$inputGroup.find('button').off('click.analogtimepicker');
        }
        $(window).off('resize.analogtimepicker');
        $(document).off('click.analogtimepicker');
        self.$popover.remove();
      } else {
        self.$picker.empty();
      }
      $this.removeData('analogtimepicker');
    }
  };

  $.fn.analogtimepicker.defaults = {
    hour: 0,
    minute: 0,
    popoverplacement: 'bottom'
  };
  
  $(function() {
    $('.analogtimepicker').each(function() {
      $(this).analogtimepicker();
    });
  });
}(jQuery));