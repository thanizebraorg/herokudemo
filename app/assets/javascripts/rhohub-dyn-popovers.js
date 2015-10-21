!function( $ ) {
  $(function () {
    
    var RhohubPopover = function(){}
    
    RhohubPopover.prototype = {
      constructor: RhohubPopover
      , closeAll : function(){
        $('.popover').remove();
      }
      , init : function(){
        $('a[rel="popover"]').live('click',function(){
          var $a_link       = $(this);
          var build_popover = function(){
            var placement = $a_link.attr('placement') || 'bottom';
            var pos_left  = $a_link.attr('data-position-left') || undefined;
            var arrow_pos = $a_link.attr('data-arrow-position') || undefined;
            
            $a_link.popover({
	            html      : true,
              placement : placement,
              trigger   : 'manual',
            });
            $a_link.popover('show');
            //left custom position
            if(typeof(pos_left) != 'undefined'){ $('div.popover').css('left', pos_left); }
            //arrow custom position
            if(typeof(arrow_pos) != 'undefined'){ $('div.popover .arrow').css('left', arrow_pos); }
            
            $('.popover').addClass('rhohub-popover');
            $('.popover-title').append('<a class="close">&times;</a>');
            $('.popover-title a.close').click(function(){
              $a_link.popover('hide');
            });
            document.onkeydown = function(e){
              if (e == null) {
                keycode = event.keyCode;
              } else {
                keycode = e.which;
              }
              if(keycode == 27){
                $a_link.popover('hide');
              }
            };
          }
          $('.popover').remove();
          if($a_link.attr('data-content')){
            build_popover();
          }else{
            $.ajax({
              url: this.href,
              success: function(content){
                $a_link.attr('data-content', content);
                build_popover();
              }
            });
          }
          this.blur();
          return false;
        });
      }
      
    }
    
    jQuery.RhohubPopover = function ( option ) {
      var rp = new RhohubPopover();
      return rp;
    }
  })
}( window.jQuery )