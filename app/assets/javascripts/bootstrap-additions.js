
/**
 * Global initializer -- execute each initializer in the Init struct.
 */
$(function() {
  initialize(); /* execute each initializer */
});
$()
/**
 * A collaction of page initialization functions.
 */
var Init = {
  Tooltips: function(){
      $(document).on("ready page:change", function() {
          //$('a[rel="tooltip"]').tooltip();
      });
  },
  ProjectLinks: function(){
    $('tr.app_listed').click(function(){
      var $this = $(this);
      location.replace($this.attr('href'));
    });
  },
  HelpPopovers: function(){
    $(document).ready(function(){
      $.RhohubPopover().init();
    });
  },
  ProjectSearch: function() {
    $('#project-search, #project-search-smalldevices').live('keyup',function(){
      search_app($(this).val())
    })
  },
  PlaceHolderForIE: function(){
    /*Placeholder for IE*/
    var $input;
    var $cloned_pass_input;
    var browser_msie        = jQuery.browser.msie;
    var browser_version     = parseInt(jQuery.browser.version);
    
    if(browser_msie){
      $('input[placeholder], textarea[placeholder]').each(function(i, input){
        $input = $(input);
        if($input.attr('type') == 'password'){
          $input.prev().after('<input id="'+$input.attr('id')+'_cloned" __id="'+$input.attr('id')+'" type="text" value="'+$input.attr('placeholder')+'"/>');
          $input.hide();
          $cloned_pass_input = $('input#'+$input.attr('id')+'_cloned');
          
          $input.live('blur', function(){
            var $this         = $(this);
            var $this_cloned  = $('input#'+$this.attr('id')+'_cloned');
            
            if($this.val() == "" ){
              $this.hide();
              $this_cloned.show();
            }
            
          });
          
          $cloned_pass_input.live('focus', function(){
            var $this = $(this);
            var $original = $('input#'+$this.attr('__id'));
            
            if($this.val() == $original.attr('placeholder')){
              $this.hide();
              $original.show();
              $original.val('');
              $original.focus();
            }
          });
          
        }else{
          $input.val($input.attr('placeholder'));
          $input.live('focus', function(){
            var $this = $(this);
            if($this.val() == $this.attr('placeholder')){
              $this.val('');
            }
          });
          $input.live('blur', function(){
            var $this = $(this);
            if($this.val() == ''){
              $this.val($this.attr('placeholder'));
            }
          });
        }
      });
    }
  },
  InitBuilds: function(){
    $('#target_device').linkToStates('#target_version');
  },
  SetOverlay: function(){
    $.RhohubOverlay().init();
  },
  ShowHideTokens: function(){
    $('a[href="#show_hide_token"]').live('click', function(){
      var $code_token     = $(this);
      var truncated_token = $code_token.attr('data-truncated-token');
      var complete_token  = $code_token.attr('data-token');
      var $code_token_tag  = $('code#show_hide_token_'+complete_token);
      
      if($code_token_tag.hasClass('truncated-token')){
        $code_token_tag.html(complete_token);
      }else{
        $code_token_tag.html(truncated_token);
      }
      $code_token_tag.toggleClass('truncated-token', '');
      $code_token.toggleClass('icon-eye-close', 'icon-eye-open');
      return false;
    });
  },
  BestInPlaceInit: function(){
      $(document).on("ready page:change", function() {
          //$(".best_in_place").best_in_place();
      });
  }
}

// Place your application-specific JavaScript functions and classes here
app_timer="";
rhohub_build_timer="";
build_timer={};
deploy_timer={};
heroku_log="";
window.stop_blur = true;

function initialize() {
  $.each(Init, function(i, initializer){
    initializer();
  })
}

function iTunesLookup(id,app_id){
  $.ajax({
    url: 'apps/'+app_id+'/itunes_lookup/'+id,
    success: function(r){
			if(r.resp.length > 0){
 	      var resp = r.resp[0];
				$('#name').val(resp.artistName);
				$('#name').css('display','block');
				$('#label_name').css('display','block');
				
				$('#bundleId').val(resp.bundleId);
				$('#bundleId').css('display','block');
				$('#label_bundleId').css('display','block');
			
				$('#description').val(resp.description);
				$('#description').css('display','block');
				$('#label_name').css('display','block');
			
				$('#description').val(resp.description);
				$('#description').css('display','block');
				$('#label_description').css('display','block');
				
				$('#version').val(resp.version);
				$('#version').css('display','block');
				$('#label_version').css('display','block');
			
				$('#icon').val(resp.artworkUrl60);
				$('#image_icon')[0].src = resp.artworkUrl60;
				$('#image_icon').css('display','block');
				$('#label_icon').css('display','block');
			
				$('#forward_button').css('display','block');
			}
			else{
				show_modal_dashboard_message('iTunes ID was not found.','error');
			}
		},
		error: function(r){
			show_modal_message('Error trying to reach iTunes, ID was not found.','error');
		}
	})
	return false;
}

function hide_app_details_step(){
	$("#tab_content_1").hide();
	$("#tab_content_2").show();
	$('#forward_button').hide();
	$('#back_button').css('display','block');
	$('#app_step_1').attr('class','');
	$('#app_step_2').attr('class','selected_wizard');
}

function step_1_state(){
	$('#app_step_1').attr('class','selected_wizard');
	$('#app_step_2').attr('class','');
	$("#tab_content_1").show();
	$("#tab_content_2").hide();
	$('#forward_button').css('display','block');
	$('#back_button').hide();
}

function radius_to_last_project(){
  $('.project_container').removeClass('last_project_container');
  $('.project_container:visible').last().addClass('last_project_container');
}

function search_app(text)
{
    if(text.length > 2)
    {
        $('table#header-app-list tr').each(function(index,value){
	        if(value.id != 'no_hide'){
		      var re = new RegExp(text, 'g');
	          if ($(value).find('h4')[0].innerText.match(re) != null){
				$(value).show();
			  }
              else{
				$(value).hide();
			  }
			}
         })
    }
    else
    {
        $('table#header-app-list tr').each(function(index,value){
	      if(value.id != 'no_hide')
            $(value).show();
        })
    }
}

function ajax_request(_url){
  $.ajax({url: _url});
}

function load_more_init(page, page_total, load_div){

  if(page_total > 1 && page <= page_total){
    $('#load_more_link').click(function(e) {
      e.stopPropagation();
      $('#load_more_link span').html('Loading...');
      $.ajax({
        url:$('tr#load_more').attr('next_page'),
        data: "page=" + page,
        dataType:'json',
        success:function(resp){
          $(resp.html).insertBefore('tr#load_more');
          re_init();
          $('#load_more_link span').html('Load more');
          page++;
          if(page > page_total){
            $('tr#load_more').remove();
          }
          document.body.scrollTop = $('tr.app_listed').last().offset().top;
        }
      });
      return false;
    });
  }
}
function working_status(options){
  var d_options = {
    delete_button: true,
    launch_editor:true,
    app_pencil: true
  }
  var def_options = $.extend(d_options, options);
  
  if(def_options.delete_button) disable_button('delete_app_button', '');
  if(def_options.launch_editor) $('#launch_editor_link').hide();
  if(def_options.app_pencil) $('#edit_app_pencil').hide();
}
function block_mode(rhodes_app_id, rhoconnect_app_id, message){
  block_app(rhodes_app_id,message,true);
  block_app(rhoconnect_app_id, message,true);
}


function base64Encode(data){
  if (typeof(btoa) == 'function') return btoa(data);//use internal base64 functions if available (gecko only)
  var b64_map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var byte1, byte2, byte3;
  var ch1, ch2, ch3, ch4;
  var result = new Array();

  var j=0;
  for (var i=0; i<data.length; i+=3) {
    byte1 = data.charCodeAt(i);
    byte2 = data.charCodeAt(i+1);
    byte3 = data.charCodeAt(i+2);
    ch1 = byte1 >> 2;
    ch2 = ((byte1 & 3) << 4) | (byte2 >> 4);
    ch3 = ((byte2 & 15) << 2) | (byte3 >> 6);
    ch4 = byte3 & 63;

    if (isNaN(byte2)) {
      ch3 = ch4 = 64;
    } else if (isNaN(byte3)) {
      ch4 = 64;
    }

    result[j++] = b64_map.charAt(ch1)+b64_map.charAt(ch2)+b64_map.charAt(ch3)+b64_map.charAt(ch4);
  }

  return result.join('');
}

function rename_project_app(id, text,username){
  $('#app_title_'+id+' span, #edit_app_pencil').hide();
  $('#update_action_'+id+', #edit_box_app_'+id).removeClass('hide');
  $('#update_at_'+id).hide();
  $('#edit_box_app_'+id).focus();
  $('#edit_box_app_'+id).keypress(function(event) {
    if(!$(this).attr('disabled')){
      if(event.keyCode == '13'){
        stop_blur = false;
        update_project_app(id, $('#edit_box_app_'+id).val(),username)
      }
    }
  });
}

function unbind_element(){
 stop_blur = false;
}

function undo_change(id, text, type, role,username){
  if(stop_blur){
   if(type == 1){
     var $title_project = $('#title_'+id);
     $title_project.find('span').show();
     $title_project.find('#edit_pencil_'+id).show();
     
     $title_project.find('input, a#update_action_'+id).remove();
   }else{
     if(type == 2){
       if(text == '') text = "Add a Description ";
       $('#descp_'+id).html($('#back_up_descp').html());
       $('#back_up_descp').remove();
     }
     else
     {
       $('#app_title_'+id+' span').html(text).show();
       $('#edit_app_pencil').show();
       $('#update_action_'+id+', #edit_box_app_'+id).addClass('hide');
     }
   }
  }
}

function update_project_app(id, name,username)
{
  $('#edit_box_app_'+id).attr("disabled", "disabled");
  $.ajax({
    url: "/"+username+"/apps/"+id,
    cache: false,
    type: "PUT",
    beforeSend: function(){
    },
    data:{
      "app":{"new_name":name}
    }
  });
}
function uptade_project_app_action(id, type, username){
  update_project_app(id, $('#edit_box_app_'+id).val(), username)
}

function uptade_project_action(id, type,username){
 update_project(id, $('#edit_box_'+id).val(),username)
}

function uptade_project_desc_action(id, type,username){
 update_project_desc(id, $('#edit_area_'+id).val(),username);
}

function show_edit_delete_project(id){
    $('#delete_project_'+id).show()
    $('#delete_project_'+id+'_separator').show()
}

function disable_button(id, class_name){
    $('#'+id).addClass(class_name);
    $('#'+id).attr('disabled','disabled');
}
function undisable_button(id, class_name){
    $('#'+id).removeClass(class_name)
    $('#'+id).removeAttr('disabled')
}
function reloadIframeContent($iframe){
  if($iframe.length > 0){
    $iframe[0].contentWindow.location.reload(true);
  }
}
function Set_Cookie( name, value, expires, path, domain, secure )
{
    var today = new Date();
    today.setTime( today.getTime() );

    if ( expires )
    {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date( today.getTime() + (expires) );

    document.cookie = name + "=" +escape( value ) +
    ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) +
    ( ( path ) ? ";path=" + path : "" ) +
    ( ( domain ) ? ";domain=" + domain : "" ) +
    ( ( secure ) ? ";secure" : "" );
}

function Get_Cookie( check_name ) {

    var a_all_cookies = document.cookie.split( ';' );
    var a_temp_cookie = '';
    var cookie_name = '';
    var cookie_value = '';
    var b_cookie_found = false; // set boolean t/f default f

    for ( i = 0; i < a_all_cookies.length; i++ )
    {
        a_temp_cookie = a_all_cookies[i].split( '=' );
        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

        if ( cookie_name == check_name )
        {
            b_cookie_found = true;
            if ( a_temp_cookie.length > 1 )
            {
                cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
            }
            return cookie_value;
            break;
        }
        a_temp_cookie = null;
        cookie_name = '';
    }
    if ( !b_cookie_found )
    {
        return null;
    }
}
function set_search_field(field_id, search_in){
    $('#'+field_id).quicksearch(search_in);
}

function show_modal(url)
{	
    tb_show('Getting Started with Projects', url+'?height=480&width=550','');
}

function show_hint(id){
  var original_title = $('.copy_url_to_clipboard:visible').attr('data-original-title');
  
  $('.copy_url_to_clipboard:visible').attr('data-original-title','Copied!');
  $('.copy_url_to_clipboard:visible').tooltip('show');
  $('.copy_url_to_clipboard:visible').attr('data-original-title', original_title);
}

function show_modal_message_iframe(message, class_name)
{
    $('#'+class_name, top.document).remove();
    $('#error', top.document).remove();
    $('#modal_error', top.document).remove();
    $('#modal_success', top.document).remove();
    $('#flash_message', top.document).remove();
    $('#success_dashboard', top.document).remove();
    $('#error_dashboard', top.document).remove();
    $('#success', top.document).remove();

    $('#TB_window', top.document).append("<div style='display:none' id='"+class_name+"'>"+message+"</div>");

    //$('#'+class_name, top.document).prepend("<div style='float: right; width: 25px;'><a href='javascript:$(this).parent().remove()' class='delete_my_app'></a></div>")

    if($('#error', top.document).length == 0 && $('#modal_error', top.document).length == 0)
        $('#'+class_name, top.document).fadeIn(1000).delay(8000).fadeOut(400);
    else
        $('#'+class_name, top.document).fadeIn(1000);

}

//Show a modal box at the top of the page if you are visiting a modal box view
function show_modal_message(message, class_name)
{
	  show_modal_dashboard_message(message, class_name);
}

function remove_me_dashboard()
{
  $('.alert-success, .alert-error').remove();
}

//Show a modal box at the top of the page if you are visiting the dashboard
function show_modal_dashboard_message(message, class_name)
{
    var flash_obj_id = class_name+'_flash_message';
    var $flash_message;
    
    remove_me_dashboard();
    
    $('#banner').html("<div style='display:none' id='"+flash_obj_id+"' class='alert alert-"+class_name+" fade in'>"+message+"</div>");
    $flash_message = $('#'+flash_obj_id);
    $flash_message.prepend('<a class="close">&times;</a>');
    $flash_message.find('a.close').click(function(){
      $(this).parent().alert('close');
    });
    
    if($flash_message.hasClass("success")){
      $flash_message.fadeIn(1000).delay(8000).fadeOut(4000);
    }else{
      $flash_message.fadeIn(1000).delay(8000).fadeOut(8000);
    }
}

function update_collaborator(role,id,username, app_id)
{
    $.ajax({
        url: "/"+username+"/apps/"+app_id+"/collaborators/"+id,
        type: "PUT",
        cache: false,
        data: "role="+role+"&id="+id,
        beforeSend:function(){
            $('#spin_'+id).show();
        },
        success: function(){
            $('#spin_'+id).hide();
        }
    });
}
//Block the app in the dashboard
function block_app(id, message, complete_message)
{
  var $app_container  = $('#single_app_'+id);
  var cover_width     = $('[id*="single_app"]:visible').width();
  
  if(!complete_message){message = "App is being "+message+", please wait."}
  $app_container.prepend("<div class='app_cover' id='app_cover_"+id+"'></div>");
  var $appcover = $('#app_cover_'+id);
  $appcover.prepend("<div id='loading_"+id+"' class='loading'><div class='load_spin'></div> "+message+"</div>");
  $appcover.height($app_container.height());
  $appcover.width(cover_width);
}
function fails_app_status(rhodes_app_id, rhoconnect_app_id, message){
  show_modal_dashboard_message(message,'error_dashboard');
  $('.app_cover, .loading').remove();
  block_app(rhodes_app_id,message,true);
  block_app(rhoconnect_app_id, message,true);
  working_status({ delete_button:false, launch_editor:true });
  $('.collaborators_section, .edit_project_pencil_desc, .edit_project_pencil').remove();
  $('.delete_project_button_option').removeAttr('disabled');
}
function enable_delete_app(){
  $('#delete_app_button').removeAttr('disabled');
  $('#launch_editor_link').show();
}
//Gets the new Observers to open modal boxes
function re_init()
{
  //Thickbox reinit.
  $("body a.thickbox").unbind();
  if(typeof(tb_init) != "undefined"){tb_init($("body a.thickbox"));}
  //Rhohub Modal reinit.
  RhohubModalInit();
  //Rhohub Help Popovers.
  $.RhohubPopover();
  Init.ProjectLinks();
}
// _____________________________________________________________________________________________________________
// deploy jobs ajax
// _____________________________________________________________________________________________________________
function do_undeploy(id,username)
{
    $.ajax({
        url: "/"+username+"/apps/"+id+"/undeploys",
        type: "POST",
        cache: false,
        data: "app_id="+id
    });
}
function disable_deploy_options(){
  $('.live_app_button, .restart_app_button').attr('id','disable');
  $('.live_app_button, .restart_app_button').attr('href','javascript:void(0)');
  $('.live_app_button, .restart_app_button').attr('onclick','');
}
function confirm_undeploy(id,username)
{

    jConfirm('Are you sure? Undeploy will stop your application and remove the redis database.', 'RhoMobile', function(r) {
        if(r)
        {
            block_submit();
            do_undeploy(id,username);
        }
    });
}
function check_deploy_state(pending_deploys)
{
    if(pending_deploys=="true")block_submit();
}
function block_submit(){
    $('#deploy').attr('disabled','disabled');
    $('#deploy').addClass("disabled");

    $('#undeploy').attr('disabled','disabled');
    $('#undeploy').addClass("disabled");
}
function unblock_submit(){
    $('#deploy').enable();
    $('#deploy').attr("class","deploy");
}
function check_deploy_jobs(id,username,deploy_id)
{	
    deploy_timer[id] = setInterval(function() {
        if(deploy_timer[id]!="stop")
            check_for_deploy_finished_job(id,username,deploy_id);
    },5000);
}

function check_for_deploy_finished_job(id,username,deploy_id)
{
 $.ajax({
        url: "/"+username+"/apps/"+id+"/deploys/check_jobs",
        type: "GET",
        cache: false,
        data: "deploy_id="+deploy_id + "&app_id=" + id,
        success: function(result){
            if(result == "continue")
            {
              //no op;
            }
            else if(result.split(",")[1] == "true")
            {
              update_an_app(id,username);
              clearInterval(deploy_timer[id]);
              deploy_timer[id] = "stop";
            }
        }
    });
}

function update_deploys(id,username)
{
    $.ajax({
        url: "/"+username+"/apps/"+id+"/deploys/update_deploys",
        type: "GET",
        cache: false,
        data: "app_id="+id,
        success: function(result){
          if(result == "continue")
          {
            //no op;
          }
        }
    });
}
// _____________________________________________________________________________________________________________
// HeroKu job ajax
// _____________________________________________________________________________________________________________
function clear_heroku_logs(){
  var new_value = $('#loading_data:visible').length ? "Please wait loading heroku logs..." : ""
  $('#heroku_logs').val(new_value);
  return false;
}

function start_heroku_job(id, username, force_tail){
  window.heroku_log = setInterval(function() {
      check_for_heroku_finished_job(id,username,force_tail);
  },3000);
  window.setTimeout(function() {
    stop_heroku_job();
  },90000);
}

function stop_heroku_job(){
  clearInterval(window.heroku_log);
  $('#loading_data').hide();
  $('.heroku_logs_refresh').show();
  window.heroku_log = undefined;
}

function check_heroku_logs_jobs(id,username, force_tail)
{
  $('.heroku_logs_refresh').hide();
  $('#loading_data').show();
  clearInterval(window.heroku_log);
  start_heroku_job(id,username, force_tail);
  return false;
}

function check_for_heroku_finished_job(id,username, force_tail){
  $.ajax({
      url: "/"+username+"/apps/"+id+"/check_heroku_job",
      type: "GET",
      cache: false,
      data: {
        'tail': (($('#current-rhohub-modal:visible').length)||($(document).contents().find('body').attr('pop-up-herokulogs'))||force_tail) ? true : false
      },
      success: function(result){
        if(!$(document).contents().find('body').attr('pop-up-herokulogs')){
          $('#heroku_logs').height($('#TB_window').height()-112);
        }
        if(result == "stop"){
          clearInterval(window.heroku_log);
        }
      }
  });
}
function set_new_log_content(logs_ta, new_logs){
  if( !window.old_logs ){
    window.old_logs = logs_ta.val();
  }
  window.old_logs = window.old_logs.replace(/^\s+|\s+$/g, '');
  var new_array = escape(new_logs).split("%0A");
  var old_array = escape(old_logs).split("%0A");
  
  var new_lines_index = $.inArray( old_array[old_array.length-1], new_array);
  var new_lines = [];
  var new_lines_parsed = "";
  
  if(new_lines_index > -1 ){
    for(var i = new_lines_index+1; i< new_array.length; i++){
      new_lines.push(new_array[i]);
    }
    new_lines_parsed = unescape(new_lines.join("\n"));
    
    logs_ta.val(  old_logs + "\n" + new_lines_parsed );
  }else{
    if( (new_logs.match(/Please wait loading heroku logs/)) || (old_logs.match(/Please wait loading heroku logs/)) || (old_logs == "") ){
      logs_ta.val( new_logs ).text( new_logs );
    }
  }
}
// _____________________________________________________________________________________________________________
// build jobs ajax
// _____________________________________________________________________________________________________________

function check_build_jobs(id,username)
{
    build_timer[id] = setInterval(function() {
        if(build_timer[id]!="stop")
            check_for_build_finished_job(id,username);
    },7000);
}

function check_for_build_finished_job(id,username){
  $.ajax({
    url: "/builds/check_jobs",
    type: "GET",
    cache: false,
    data: "app_id="+id,
    success: function(result){
      if ((result == "stop")||(result.split(",")[1] == 'true')){
        clearInterval(build_timer[id]);
        build_timer[id]="stop"
        update_an_app(id,username);
        reloadIframeContent($('iframe'));
      }
    }
  });
}
// _____________________________________________________________________________________________________________
// App jobs ajax
// _____________________________________________________________________________________________________________

function check_app_jobs(username,app_id, app_status)
{
  app_timer = setInterval(function() {
      if((app_timer !="stop")&&(app_status != 'completed'))  check_for_app_finished_job(username,app_id);
  },3000);
}

function check_for_app_finished_job(username,app_id)
{
    $.ajax({
        url: "/"+username+"/apps/check_jobs?id="+app_id,
        cache: false,
        type: "GET",
        success: function(result){
          if(typeof(result) == 'object'){
            clearInterval(app_timer);
            app_timer = "stop";
            show_modal_message(result.message,result.status == 'completed' ? 'success' : 'error');
            update_an_app(result.app_id,username);
          }else{
            if(result == "stop"){  
              clearInterval(app_timer);
              app_timer ="stop";
              if(typeof(callback_on_complete)!='undefined'){callback_on_complete();}
            }else{
              $.each(result.split(','), function(index, value){
                if(value == "true") {
                  clearInterval(app_timer);
                  app_timer ="stop";
                }else{
                  if(value.split('-')[1] == "completed"){
                    update_an_app(value.split('-')[0],username);
                  }else{
                    if(value != ''){
                      error_message = "There was a problem (**) your app, please try again.";
                      show_modal_dashboard_message(complete_job_error_message(value.split('-')[1], error_message, "(**)"),'error_dashboard');
                      if(value.split('-')[1] == "failed"){
                        update_an_app(value.split('-')[0],username);
                      }else{
                        clearInterval(app_timer);
                        app_timer ="stop";
                        update_an_app(value.split('-')[0],username);
                      }
                    }
                  }
                }
              });
            }
          }
        }
    });
}
function update_an_app(id,username)
{
  if(window.running_apps){
    if(id == window.running_apps.rhodes_app_id) window.running_apps.rhodes_app_id = undefined;
    if(id == window.running_apps.rhoconnect_app_id) window.running_apps.rhoconnect_app_id = undefined;
  }
    $.ajax({
        url: "/"+username+"/apps/"+id+"/update_an_app",
        type: "GET",
        cache: false,
        data: "id="+id
    });
}
function complete_job_error_message(job_failed, message, to_replace){
  if((job_failed == 'rename_app')||(job_failed == 'renamed')){
    return message.replace(to_replace,"renaming");
  }else if((job_failed == 'restart_app')||(job_failed == 'restarted')){
    return message.replace(to_replace,"restarting");
  }else if((job_failed == 'assign_resources')||(job_failed == 'live ON')){
    return message.replace(to_replace,"assigning resources to");
  }else if((job_failed == "failed")||(job_failed == "created")){
    return "There was a problem creating your app, please try again.";
  }
}
// _____________________________________________________________________________________________________________
// RhoHub Builds jobs ajax
// _____________________________________________________________________________________________________________

function create_build_ota_link_job(username, build_id, go_to)
{
    $.ajax({
        url: "/"+username+"/builds/"+build_id+"/build_ota_link",
        cache: false,
        type: "GET",
        beforeSend:function(result){
            $('#spin_rhohub').show();
        },
        success: function(result){
            if(result != 'failed')
            {
                rhohub_build_timer = setInterval(function() {
                    if(rhohub_build_timer !="stop")  check_build_ota_link_finished_job(username, build_id, go_to);
                },1000);
            }
            else
            {
                rhohub_build_timer ="stop";
                $('#spin_rhohub').hide();
                show_modal_message('There was an error adding the RhoMobile build, please try again.','modal_error')
            }
        }
    });
}
function check_build_ota_link_finished_job(username, build_id, go_to)
{
    $.ajax({
        url: "/"+username+"/builds/"+build_id+"/check_build_ota_link_job",
        cache: false,
        type: "GET",
        success: function(result){
            if(rhohub_build_timer != "stop")
            {
                if(result != "uncomplete" && result != "failed")
                {
                    clearInterval(rhohub_build_timer);
                    rhohub_build_timer = "stop";
                    $('#spin_rhohub').hide();
                    $('#rhohub_url').val(result.split(",")[0]);
                    $('#rhohub_url_file_list').val(result);
                    if(go_to == "edit"){
                        $('#build_form_rhohub_url').trigger('submit');
                    }
                    else{
                        submit_new_build();
                    }
                }
                if(result == "failed")
                {
                    rhohub_build_timer ="stop";
                    $('#spin_rhohub').hide();
                    show_modal_message('There was an error adding the RhoMobile build, please try again.','modal_error')
                }
            }
        }
    });
}

// Application ajax
// _____________________________________________________________________________________________________________
function assign_resource_app(confirmation,id,username)
{
    if(confirmation)
    {
        $.ajax({
            url: "/"+username+"/apps/"+id+"/assing_resources",
            type: "GET",
            cache: false,
            data: "id="+id
        });
    }
}
function restart_app(confirmation,id,username)
{
    if(confirmation)
    {
        $.ajax({
            url: "/"+username+"/apps/"+id+"/restart_app",
            type: "GET",
            cache: false,
            data: "id="+id
        });
    }
}
function leave_this_app(leave_url, redirect_url){
  jConfirm('Do you really want to leave this app?','Leave App',function(r){
    if(r){
      $.ajax({
        url:leave_url,
        type: 'DELETE',
        success: function(){
          location.replace(redirect_url)
        },
        error:function(data){
          location.replace("/"+data.status);
        }
      });
    }
  });
}
function openwindow(url) {
    var options = 'scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no';
    options += ',width=' + screen.availWidth + ',height=' + screen.availHeight;
    options += ',toolbar=yes,location=yes,directories=yes,status=yes,menubar=yes,scrollbars=yes,copyhistory=yes'
    options += ',screenX=0,screenY=0,top=0,left=0';
    var win = window.open(url, '', options);    
}

function hide_feed(){
  $('#notification_box').fadeOut();
  $('#feed').hide();
  $('#qtip-0').remove();
  $.cookie("last_feed_visited",'true');
}

// _____________________________________________________________________________________________________________
// jQuery Effects
// _____________________________________________________________________________________________________________

function runHideEffect(title)
{
    $("#"+title).blindToggle('fast');
}

function runEffect(title)
{
    $("#box_"+title).blindToggle('fast');
}

jQuery.fn.blindToggle = function(speed, easing, callback)
{
    return this.animate({
        marginTop: parseInt(this.css('marginTop')) < 0 ? 0 : -130
    }, speed, easing, callback);
};

jQuery.fn.highlightFade = function(settings) {
    var o = (settings && settings.constructor == String) ? {
        start: settings
    } : settings || {};
    var d = jQuery.highlightFade.defaults;
    var i = o['interval'] || d['interval'];
    var a = o['attr'] || d['attr'];
    var ts = {
        'linear': function(s,e,t,c) {
            return parseInt(s+(c/t)*(e-s));
        },
        'sinusoidal': function(s,e,t,c) {
            return parseInt(s+Math.sin(((c/t)*90)*(Math.PI/180))*(e-s));
        },
        'exponential': function(s,e,t,c) {
            return parseInt(s+(Math.pow(c/t,2))*(e-s));
        }
    };
    var t = (o['iterator'] && o['iterator'].constructor == Function) ? o['iterator'] : ts[o['iterator']] || ts[d['iterator']] || ts['linear'];
    if (d['iterator'] && d['iterator'].constructor == Function) t = d['iterator'];
    return this.each(function() {
        if (!this.highlighting) this.highlighting = {};
        var e = (this.highlighting[a]) ? this.highlighting[a].end : jQuery.highlightFade.getBaseValue(this,a) || [255,255,255];
        var c = jQuery.highlightFade.getRGB(o['start'] || o['colour'] || o['color'] || d['start'] || [255,255,128]);
        var s = jQuery.speed(o['speed'] || d['speed']);
        var r = o['final'] || (this.highlighting[a] && this.highlighting[a].orig) ? this.highlighting[a].orig : jQuery.curCSS(this,a);
        if (o['end'] || d['end']) r = jQuery.highlightFade.asRGBString(e = jQuery.highlightFade.getRGB(o['end'] || d['end']));
        if (typeof o['final'] != 'undefined') r = o['final'];
        if (this.highlighting[a] && this.highlighting[a].timer) window.clearInterval(this.highlighting[a].timer);
        this.highlighting[a] = {
            steps: ((s.duration) / i),
            interval: i,
            currentStep: 0,
            start: c,
            end: e,
            orig: r,
            attr: a
        };
        jQuery.highlightFade(this,a,o['complete'],t);
    });
};

jQuery.highlightFade = function(e,a,o,t) {
    e.highlighting[a].timer = window.setInterval(function() {
        var newR = t(e.highlighting[a].start[0],e.highlighting[a].end[0],e.highlighting[a].steps,e.highlighting[a].currentStep);
        var newG = t(e.highlighting[a].start[1],e.highlighting[a].end[1],e.highlighting[a].steps,e.highlighting[a].currentStep);
        var newB = t(e.highlighting[a].start[2],e.highlighting[a].end[2],e.highlighting[a].steps,e.highlighting[a].currentStep);
        jQuery(e).css(a,F.highlightFade.asRGBString([newR,newG,newB]));
        if (e.highlighting[a].currentStep++ >= e.highlighting[a].steps) {
            jQuery(e).css(a,e.highlighting[a].orig || '');
            window.clearInterval(e.highlighting[a].timer);
            e.highlighting[a] = null;
            if (o && o.constructor == Function) o.call(e);
        }
    },e.highlighting[a].interval);
};

jQuery.highlightFade.defaults = {
    start: [255,255,128],
    interval: 50,
    speed: 400,
    attr: 'backgroundColor'
};

jQuery.highlightFade.getRGB = function(c,d) {
    var result;
    if (c && c.constructor == Array && c.length == 3) return c;
    if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c))
        return [parseInt(result[1]),parseInt(result[2]),parseInt(result[3])];
    else if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c))
        return [parseFloat(result[1])*2.55,parseFloat(result[2])*2.55,parseFloat(result[3])*2.55];
    else if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c))
        return [parseInt("0x" + result[1]),parseInt("0x" + result[2]),parseInt("0x" + result[3])];
    else if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c))
        return [parseInt("0x"+ result[1] + result[1]),parseInt("0x" + result[2] + result[2]),parseInt("0x" + result[3] + result[3])];
    else
        return jQuery.highlightFade.checkColorName(c) || d || null;
};

jQuery.highlightFade.asRGBString = function(a) {
    return "rgb(" + a.join(",") + ")";
};

jQuery.highlightFade.getBaseValue = function(e,a,b) {
    var s, t;
    b = b || false;
    t = a = a || jQuery.highlightFade.defaults['attr'];
    do {
        s = jQuery(e).css(t || 'backgroundColor');
        if ((s  != '' && s != 'transparent') || (e.tagName.toLowerCase() == "body") || (!b && e.highlighting && e.highlighting[a] && e.highlighting[a].end)) break;
        t = false;
    } while (e = e.parentNode);
    if (!b && e.highlighting && e.highlighting[a] && e.highlighting[a].end) s = e.highlighting[a].end;
    if (s == undefined || s == '' || s == 'transparent') s = [255,255,255];
    return jQuery.highlightFade.getRGB(s);
};

jQuery.highlightFade.checkColorName = function(c) {
    if (!c) return null;
    switch(c.replace(/^\s*|\s*$/g,'').toLowerCase()) {
        case 'aqua':
            return [0,255,255];
        case 'black':
            return [0,0,0];
        case 'blue':
            return [0,0,255];
        case 'fuchsia':
            return [255,0,255];
        case 'gray':
            return [128,128,128];
        case 'green':
            return [0,128,0];
        case 'lime':
            return [0,255,0];
        case 'maroon':
            return [128,0,0];
        case 'navy':
            return [0,0,128];
        case 'olive':
            return [128,128,0];
        case 'purple':
            return [128,0,128];
        case 'red':
            return [255,0,0];
        case 'silver':
            return [192,192,192];
        case 'teal':
            return [0,128,128];
        case 'white':
            return [255,255,255];
        case 'yellow':
            return [255,255,0];
    }
};

jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};


//--Browser detect 
var BrowserDetect = {
	init: function () {
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

function cmnd_ctrl(os){
  $('.cmd').html(os == 'Mac' ?  'cmd' : 'ctrl' )
}
