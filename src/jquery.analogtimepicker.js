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
          $('<div class="popover atp-popover"><div class="arrow"></div></div>');
        self.$popover.addClass(self.settings.popoverplacement);
        self.$popover.click(function(event) {
          event.stopPropagation();
        });
        var $popoverContent = $('<div>');
        $popoverContent.addClass('popover-content');
        $popoverContent.addClass('atp-popover-content');
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
    
    if (arg0 instanceof String) {
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
        $('.atp-popover').hide();
        self.$popover.show();
        if (typeof self.picker == 'undefined') {
          self.picker = createPicker();
        }
        positionPopover();
        $this.triggerHandler('shown.analogtimepicker.popover');
        setTimeout(function() {
          $(document).one('click.analogtimepicker', function() {
            self.$popover.hide();
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
          top = anchorPosition.top - self.$popover.height();
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
          left = anchorPosition.left - self.$popover.width();
          top = anchorPosition.top +
            ($anchor.outerHeight() - self.$popover.height()) / 2;
          break;
      }
      self.$popover.css('left', left + 'px');
      self.$popover.css('top', top + 'px');
    }
    
    function createPicker() {
      var picker = new AnalogTimePicker(self.$picker,
        self.settings.hour, self.settings.minute);
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
      self.$input.val(self.picker.getDisplayHour() + ':' +
        self.picker.getDisplayMinute() + ' ' + self.picker.getDisplayAmPm());
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
        self.picker.setSwitchMode(mode);
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
            self.$popover.hide();
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