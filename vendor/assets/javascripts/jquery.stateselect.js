/*
* Simple State/Province Select plugin for jQuery
*
* Example:
* $(document).ready(function() {
*    $('#country').linkToStates('#state');
*  });
*
* Copyright (c) 2008 Adam Daniels
* Licensed under the MIT License
*
*/
;(function($) {

	var android_targets = {
		'device:android:production-5.1'   : '5.1',
		'device:android:production-4.4.2'   : '4.4.2'
	}

	var windowsmobile_targets = {
		'device:wm:production-6.5' : '6.5'
	}

	var win32_targets = {
		'device:win32:production' : ''
	}

	var iphone_targets = {
		'iphone:ad_hoc' : 'Development',
		'iphone:app_store' : 'Distribution'
	}

	$.fn.extend({
	  addOptions : function(items){
      var $this = $(this);
      $.each(items, function(k,v){
        $this.append($('<option _test value="'+k+'">'+v+'</option>'));
      });
      return $this;
	  }
	});

	$.fn.extend({
		linkToStates: function(state_select_id) {
			$(this).change(function() {
				var country = $(this).attr('value');
			$(state_select_id).removeOption(/.*/);
			$('.iphone_fieldset').hide();
			switch (country) {
				case 'Android':
				$(state_select_id).addOptions(android_targets, false);
				break;
				case 'WindowsMobile':
				$(state_select_id).addOptions(windowsmobile_targets, false);
				break;
				case 'Win32':
				$(state_select_id).addOptions(win32_targets, false);
				break;
				case 'iPhone':
				$('.iphone_fieldset').show();
				$(state_select_id).addOptions(iphone_targets, false);
				break;
				default:
				$(state_select_id).addOptions({ '' : 'Select Platform'}, false);
				break;
			}
			if(typeof(parent.adjust_iframe_height) == 'function'){parent.adjust_iframe_height(country);}
			if(typeof(adjust_thickbox_height_iOS) == 'function'){adjust_thickbox_height_iOS(country);}
		});
	}
});
})(jQuery);
