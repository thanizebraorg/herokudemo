!function( $ ) {
  $(function () {
    var RhohubOverlay = function(){}
    
    RhohubOverlay.prototype = {
      constructor: RhohubOverlay
      , block : function(){
        var $this = $('body > #rhohub-overlay');
        $this.removeClass('hide');
      }
      , unblock : function(){
        var $this = $('body > #rhohub-overlay');
        $this.addClass('hide');
      }
      , init  : function(){
        $('body').prepend('<div id="rhohub-overlay" class="hide"></div>');
      }
    }
    jQuery.RhohubOverlay = function ( option ) {
      var rhohub_overlay = new RhohubOverlay();
      return rhohub_overlay;
    }
  })
}( window.jQuery )