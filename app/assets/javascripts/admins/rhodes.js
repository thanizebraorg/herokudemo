//#jQuery ->
//#  $("#rhode_user_tokens").tokenInput '/admins/users.json',{
//#    theme: 'facebook',
//#    propertyToSearch: 'email'
//#  }
$(function() {
    $("#rhode_user_tokens").tokenInput("/admins/users.json", {
        crossDomain: false,
        prePopulate: $(this).data("pre"),
        propertyToSearch: 'email',
        theme: "facebook",
        preventDuplicates: true
    });
});

