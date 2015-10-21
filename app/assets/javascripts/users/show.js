
$(document).ready(function(){
  $('li[data-action="dashboard"]').removeClass('active');
  $('#rhosync_tab_link').live('click', function(){
 	  $('#deploy_list .scrollable').jScrollPane();
 	});
  
  $('#rhodes_tab_link').live('click', function(){
 	  $('#build_list .scrollable').jScrollPane();
 	});
  
  if((app_obj.status == 'failed')&&(app_obj.current_job == 'created')){
    block_mode(app_obj.id, null, complete_job_error_message(app_obj.current_job, "Error (**) the app", "(**)"));
    working_status({
      delete_button:false,
      launch_editor:true
    });
    $('.collaborators_section, .edit_project_pencil_desc, .edit_project_pencil').remove();
    show_modal_dashboard_message(complete_job_error_message(app_obj.current_job, "Error (**) the app", "(**)"),"error");
  }
  if(app_obj.status == 'queued'){
    working_status({
      delete_button:true,
      launch_editor:true
    });
  }
  <% @builds_deploys = (@builds || @deploys) %>
  <% unless @builds_deploys.empty? %>
    <% if @builds_deploys.first.status == "queued" or @app.deployed %>
      $('#delete_app_button').attr("disabled", "disabled");
    <% end %>
  <% end %>
});
function copy_giturl_to_clipboard() {
  var s = "<%= @app.get_git_url(@app_owner.username) %>";
  show_hint('<%= @app.id %>');
  if (window.clipboardData) window.clipboardData.setData('text', s);
  else return (s);
}