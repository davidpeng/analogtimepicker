function AnalogTimePicker(element) {
  this.hour_ = 0;
  this.minute_ = 0;
  this.mode_ = 'hour';
  this.decorate_(element);
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

AnalogTimePicker.prototype.decorate_ = function(element) {
  this.container_ = element;
  this.container_.className += ' ' + AnalogTimePicker.Class.CONTAINER;
  this.tapped_ = false;
  
  var timeElement = document.createElement('div');
  timeElement.className = AnalogTimePicker.Class.TextPart.CONTAINER;
  this.container_.appendChild(timeElement);
  
  this.hourElement_ = document.createElement('span');
  this.hourElement_.className = AnalogTimePicker.Class.TextPart.HOUR_SELECTED;
  this.hourElement_.textContent = this.getFormattedHour();
  timeElement.appendChild(this.hourElement_);
  this.hourElement_.style.width = this.hourElement_.offsetWidth + 'px';
  
  var colonElement = document.createElement('span');
  colonElement.className = AnalogTimePicker.Class.TextPart.COLON;
  colonElement.textContent = ':';
  timeElement.appendChild(colonElement);
  
  this.minuteElement_ = document.createElement('span');
  this.minuteElement_.className = AnalogTimePicker.Class.TextPart.MINUTE;
  this.minuteElement_.textContent = this.getFormattedMinute();
  timeElement.appendChild(this.minuteElement_);
  
  this.amPmElement_ = document.createElement('span');
  this.amPmElement_.className = AnalogTimePicker.Class.TextPart.AMPM;
  this.amPmElement_.textContent = this.getFormattedAmPm();
  timeElement.appendChild(this.amPmElement_);
  
  var optionElement = document.createElement('div');
  optionElement.className = AnalogTimePicker.Class.ClockPart.NUMBER;
  optionElement.textContent = this.formatMinute_(0);
  this.container_.appendChild(optionElement);
  var optionWidth = optionElement.offsetWidth;
  var optionHeight = optionElement.offsetHeight;
  this.container_.removeChild(optionElement);
  
  this.clockPart_ = document.createElement('div');
  this.clockPart_.className = AnalogTimePicker.Class.ClockPart.CONTAINER;
  this.clockPart_.style.paddingBottom = optionHeight * 0.8 + 'px';
  this.container_.appendChild(this.clockPart_);
  
  this.clockCenter_ = this.clockPart_.offsetWidth / 2;
  this.clockRadius_ = this.clockPart_.offsetWidth / 2 - optionWidth;
  
  var clockElement = document.createElement('div');
  clockElement.className = AnalogTimePicker.Class.ClockPart.CLOCK;
  this.clockPart_.appendChild(clockElement);
  clockElement.style.height = clockElement.offsetWidth + 'px';
  
  this.hourOptions_ = [];
  for (hour = 0; hour < 12; hour++) {
    optionElement = document.createElement('div');
    optionElement.className = AnalogTimePicker.Class.ClockPart.NUMBER;
    optionElement.textContent = this.formatHour_(hour);
    this.clockPart_.appendChild(optionElement);
    this.positionAtAngle_(optionElement, this.getAngleAtHour_(hour));
    this.hourOptions_.push(optionElement);
  }
  
  this.minuteOptions_ = [];
  for (minute = 0; minute < 60; minute += 5) {
    optionElement = document.createElement('div');
    optionElement.className = AnalogTimePicker.Class.ClockPart.NUMBER;
    optionElement.textContent = this.formatMinute_(minute);
    this.clockPart_.appendChild(optionElement);
    this.positionAtAngle_(optionElement, this.getAngleAtMinute_(minute));
    optionElement.style.display = 'none';
    this.minuteOptions_.push(optionElement);
  }
  
  this.amOption_ = document.createElement('div');
  this.amOption_.className = AnalogTimePicker.Class.ClockPart.AMPM;
  this.amOption_.textContent = 'AM';
  this.clockPart_.appendChild(this.amOption_);
  this.amOption_.style.left =
      this.clockCenter_ - this.clockRadius_ - optionWidth / 2 + 'px';
  this.amOption_.style.top =
      this.clockCenter_ + this.clockRadius_ + optionHeight / 2 + 'px';
  
  this.pmOption_ = document.createElement('div');
  this.pmOption_.className = AnalogTimePicker.Class.ClockPart.AMPM;
  this.pmOption_.textContent = 'PM';
  this.clockPart_.appendChild(this.pmOption_);
  this.pmOption_.style.left = this.clockCenter_ + this.clockRadius_ -
      this.pmOption_.offsetWidth + optionWidth / 2 + 'px';
  this.pmOption_.style.top = this.clockCenter_ + this.clockRadius_ +
      optionHeight / 2 + 'px';
  
  this.selectionSize_ = Math.max(this.amOption_.offsetWidth, this.amOption_.offsetHeight);
  
  this.clockElementSelection_ = document.createElement('div');
  this.clockElementSelection_.className = AnalogTimePicker.Class.ClockPart.SELECTION;
  this.clockElementSelection_.style.width = this.selectionSize_ + 'px';
  this.clockElementSelection_.style.height = this.selectionSize_ + 'px';
  this.clockPart_.appendChild(this.clockElementSelection_);
  this.positionClockSelection_();
  
  this.hoverSelectionElement_ = document.createElement('div');
  this.hoverSelectionElement_.className = AnalogTimePicker.Class.ClockPart.HOVER;
  this.hoverSelectionElement_.style.width = this.selectionSize_ / 3 + 'px';
  this.hoverSelectionElement_.style.height = this.selectionSize_ / 3 + 'px';
  this.hoverSelectionElement_.style.display = 'none';
  this.clockPart_.appendChild(this.hoverSelectionElement_);
  
  this.amPmSelectionElement_ = document.createElement('div');
  this.amPmSelectionElement_.className = AnalogTimePicker.Class.ClockPart.SELECTION;
  this.amPmSelectionElement_.style.width = this.selectionSize_ * 1.2 + 'px';
  this.amPmSelectionElement_.style.height = this.selectionSize_ * 1.2 + 'px';
  this.clockPart_.appendChild(this.amPmSelectionElement_);
  this.amPmSelectionElement_.style.top = this.amOption_.offsetTop -
      (this.selectionSize_ * 1.2 - this.amOption_.offsetHeight) / 2 + 'px';
  this.positionAmPmSelection_();
  
  this.attachEventHandlers_();
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

AnalogTimePicker.prototype.positionAtAngle_ = function(element, angle) {
  element.style.left = this.clockCenter_ +
      this.clockRadius_ * Math.cos(angle) - element.offsetWidth / 2 + 'px';
  element.style.top = this.clockCenter_ +
      this.clockRadius_ * Math.sin(angle) - element.offsetHeight / 2 + 'px';
};

AnalogTimePicker.prototype.getAngleAtHour_ = function(hour) {
  return (hour / 12) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.getAngleAtMinute_ = function(minute) {
  return (minute / 60) * (2 * Math.PI) - (Math.PI / 2);
};

AnalogTimePicker.prototype.positionClockSelection_ = function() {
  var angle = this.hourElement_.className ==
      AnalogTimePicker.Class.TextPart.HOUR_SELECTED ?
      this.getAngleAtHour_(this.hour_) : this.getAngleAtMinute_(this.minute_);
  this.positionAtAngle_(this.clockElementSelection_, angle);
};

AnalogTimePicker.prototype.positionHoverSelection_ = function(value) {
  var angle = this.hourElement_.className ==
      AnalogTimePicker.Class.TextPart.HOUR_SELECTED ?
      this.getAngleAtHour_(value) : this.getAngleAtMinute_(value);
  this.positionAtAngle_(this.hoverSelectionElement_, angle);
};

AnalogTimePicker.prototype.positionAmPmSelection_ = function() {
  var selectedElement = this.hour_ < 12 ? this.amOption_ : this.pmOption_;
  this.amPmSelectionElement_.style.left = selectedElement.offsetLeft -
      (this.selectionSize_ * 1.2 - selectedElement.offsetWidth) / 2 + 'px';
};

AnalogTimePicker.prototype.attachEventHandlers_ = function() {
  var picker = this;

  picker.hourElement_.addEventListener('click', function() {
    picker.switchToChangeHourMode_();
  });
  
  picker.minuteElement_.addEventListener('click', function() {
    picker.switchToChangeMinuteMode_();
  });
  
  picker.amPmElement_.addEventListener('click', function() {
    var newHour = (picker.hour_ + 12) % 24;
    picker.hour_ = newHour;
    picker.amPmElement_.textContent = picker.formatAmPm_(picker.hour_);
    picker.positionAmPmSelection_();
    picker.triggerEvent_('timechange');
  });
  
  picker.container_.addEventListener('mousemove', function(event) {
    var coordinates = picker.getClockCoordinates_(event);
    picker.handleMouseMove_(coordinates);
  });
  
  picker.container_.addEventListener('click', function(event) {
    var coordinates = picker.getClockCoordinates_(event);
    picker.handleMouseUp_(coordinates);
  });
  
  picker.container_.addEventListener('touchstart', function(event) {
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
  
  picker.container_.addEventListener('touchmove', function(event) {
    picker.tapped_ = false;
    var coordinates =
      picker.getClockCoordinates_(event.touches[0]);
    picker.handleMouseMove_(coordinates);
  });
  
  picker.amOption_.addEventListener('click', function() {
    if (picker.hour_ >= 12) {
      var newHour = picker.hour_ - 12;
      picker.hour_ = newHour;
      picker.amPmElement_.textContent = picker.formatAmPm_(picker.hour_);
      picker.positionAmPmSelection_();
      picker.triggerEvent_('timechange');
    }
  });
  
  picker.pmOption_.addEventListener('click', function() {
    if (picker.hour_ < 12) {
      var newHour = picker.hour_ + 12;
      picker.hour_ = newHour;
      picker.amPmElement_.textContent = picker.formatAmPm_(picker.hour_);
      picker.positionAmPmSelection_();
      picker.triggerEvent_('timechange');
    }
  });
};

AnalogTimePicker.prototype.handleMouseMove_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.hourElement_.className ==
        AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
      var hour = this.getHourAtAngle_(angle);
      this.hourElement_.textContent = this.formatHour_(hour);
      this.positionHoverSelection_(hour);
    } else {
      var minute = this.getMinuteAtAngle_(angle);
      this.minuteElement_.textContent = this.formatMinute_(minute);
      this.positionHoverSelection_(minute);
    }
    this.hoverSelectionElement_.style.display = 'block';
    this.container_.style.cursor = 'pointer';
  } else {
    if (this.hourElement_.className ==
        AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
      this.hourElement_.textContent = this.formatHour_(this.hour_);
    } else {
      this.minuteElement_.textContent = this.formatMinute_(this.minute_);
    }
    this.hoverSelectionElement_.style.display = 'none';
    this.container_.style.cursor = 'auto';
  }
};

AnalogTimePicker.prototype.handleMouseUp_ = function(coordinates) {
  if (this.isOverClockOption_(coordinates)) {
    var angle = this.getAngleAtCoordinates_(coordinates);
    if (this.hourElement_.className ==
        AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
      var newHour =
        Math.floor(this.hour_ / 12) * 12 + this.getHourAtAngle_(angle);
      if (this.hour_ != newHour) {
        this.hour_ = newHour;
        this.hourElement_.textContent = this.formatHour_(this.hour_);
        this.triggerEvent_('timechange');
      }
      this.switchToChangeMinuteMode_();
    } else {
      var newMinute = this.getMinuteAtAngle_(angle);
      if (this.minute_ != newMinute) {
        this.minute_ = newMinute;
        this.minuteElement_.textContent = this.formatMinute_(this.minute_);
        this.positionClockSelection_();
        this.triggerEvent_('timechange');
      }
    }
    this.hoverSelectionElement_.style.display = 'none';
  }
};

AnalogTimePicker.prototype.getClockCoordinates_ = function(clientCoordinates) {
  var rect = this.clockPart_.getBoundingClientRect();
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
  if (this.hourElement_.className !=
      AnalogTimePicker.Class.TextPart.HOUR_SELECTED) {
    this.minuteElement_.className = AnalogTimePicker.Class.TextPart.HOUR;
    var i;
    for (i = 0; i < this.minuteOptions_.length; i++) {
      this.minuteOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.hourOptions_.length; i++) {
      this.hourOptions_[i].style.display = 'block';
    }
    this.hourElement_.className = AnalogTimePicker.Class.TextPart.HOUR_SELECTED;
    this.positionClockSelection_();
    this.triggerEvent_('modechange');
  }
};

AnalogTimePicker.prototype.switchToChangeMinuteMode_ = function() {
  if (this.minuteElement_.className !=
      AnalogTimePicker.Class.TextPart.MINUTE_SELECTED) {
    this.hourElement_.className = AnalogTimePicker.Class.TextPart.MINUTE;
    var i;
    for (i = 0; i < this.hourOptions_.length; i++) {
      this.hourOptions_[i].style.display = 'none';
    }
    for (i = 0; i < this.minuteOptions_.length; i++) {
      this.minuteOptions_[i].style.display = 'block';
    }
    this.minuteElement_.className = AnalogTimePicker.Class.TextPart.MINUTE_SELECTED;
    this.positionClockSelection_();
    this.triggerEvent_('modechange');
  }
};

AnalogTimePicker.prototype.triggerEvent_ = function(type) {
  var event = document.createEvent('Event');
  event.initEvent(type, true, true);
  this.container_.dispatchEvent(event);
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
  return this.hourElement_.className ==
    AnalogTimePicker.Class.TextPart.HOUR_SELECTED ? 'hour' : 'minute';
};

AnalogTimePicker.prototype.setHour = function(hour) {
  if (hour >= 0 && hour < 24) {
    this.hour_ = hour;
    this.hourElement_.textContent = this.formatHour_(this.hour_);
    this.amPmElement_.textContent = this.formatAmPm_(this.hour_);
    this.positionClockSelection_();
    this.positionAmPmSelection_();
  }
};

AnalogTimePicker.prototype.setMinute = function(minute) {
  if (minute >= 0 && minute < 60) {
    this.minute_ = minute;
    this.minuteElement_.textContent = this.formatMinute_(this.minute_);
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
      self.$picker.on('timechange', function() {
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
      self.$picker.on('modechange', function() {
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