/*
  Usage:
  <a href="<modal link>" data-toggle="rhohub-modal" title="<modal title>">link text</a>
  
  it will load the link content into Twitter Bootstrap modal window.
*/

var _valid_selectors            = 'a[data-toggle="rhohub-modal"]';
var $_old_rhohub_modal_content   = $('#current-rhohub-modal');

$(document).ready(function(){
  RhohubModalInit();
});

function RhohubModalInit(){
  var $all_links = $(_valid_selectors);
  
  $all_links.die('click').live('click', function(){
    var href        = this.href;
    var title       = this.title || this.name || null;
    var $link_object = $(this);

    BuildModalContent(href, title, $link_object);
    this.blur();
    return false;
  });
}

function BuildModalContent(url, title, link_object){
  $.ajax({
    url:      url,
    beforeSend: function(){
      $.RhohubOverlay().block();
    },
    success:  function(content){
      var $current_modal = CreateDivModal(content, title);
      var resize_window  = link_object.attr('data-resizable-modal-element');
      
      $current_modal.modal();
      setDragableModal();
      setResizableModal(resize_window);
      setHideExtends();
      $.RhohubOverlay().unblock();
    },
    error:    function(data){
      if(data.status == "401"){
        location.replace(data.responseText);
      }else{
        location.replace('/'+data.status);
      }
    }
  });
}

function CreateDivModal(body_content, title){
  var header  = '<div class="modal-header"><a class="close" data-dismiss="modal">&times;</a><h3></h3></div>';
  var body    = '<div class="modal-body"></div>';
  if($_old_rhohub_modal_content.length == 0){
    $('body').append('<div id="current-rhohub-modal" class="modal hide"></div>');
    $rhohub_modal = $('#current-rhohub-modal');
  }
  $rhohub_modal.html(header+body);
  $rhohub_modal.find('div.modal-body').html(body_content);
  $rhohub_modal.find('div.modal-header h3').html(title);
  return $rhohub_modal;
}

function HideRhohubModal(){
  $('#current-rhohub-modal').modal('hide');
}

function setDragableModal(){
  $('#current-rhohub-modal').draggable({ handle: $("#current-rhohub-modal .modal-header") });
}

function setHideExtends(){
  $('#current-rhohub-modal').live('hide', function(){
    $(this).remove();
  });
}

function setResizableModal(resizeModal){
  var resizeableModalBox = $('#current-rhohub-modal');

  resizeableModalBox.live('resize', function(){
    var $this   = $(this);
    var height  = $(this).css('height');
    var width   = $(this).css('width');
    var top     = $(this).css('top');
    var left    = $(this).css('left');
    
    $this.removeAttr('style');
    $this.css({
      'height'      : height,
      'width'       : width,
      'display'     : 'block',
      'top'         : top,
      'left'        : left
    });
    $this.find('.modal-body').css('max-height', height);
  });
  
  if(resizeModal){
    resizeableModalBox.resizable({
      alsoResize: resizeModal,
      minWidth: 371,
      minHeight:381,
      start: function(event, ui){
        resizeableModalBox.css({
            position: "relative !important",
            top: "0 !important",
            left: "0 !important"
        });
      }
    });
  }
}