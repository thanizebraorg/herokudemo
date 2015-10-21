// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

!function ($) {

    var changedIsNewUser = function () {
        if ('yes' == this.value) {
            setupForNewUser();
        } else {
            setupForRegisteredUser();
        }
    };

    var setupForNewUser = function () {
        $('#signin_as_new_user_yes').prop('checked', true);
        $('#signup_as_new_user_yes').prop('checked', true);

        $('#sign_in_form').hide();
        $('#sign_up_form').show();

    };


    var setupForRegisteredUser = function () {
        $('#signin_as_new_user_no').prop('checked', true);
        $('#signup_as_new_user_no').prop('checked', true);

        $('#sign_up_form').hide();
        $('#sign_in_form').show();

        var pathname = document.URL;
        if (pathname.indexOf("rhohub.com") > -1)
        {
            $('#githubSignupButton').hide();
            $('#googleSignupButton').hide();
        }
    };



    $('input[name="signin_as_new_user"]').live('change', changedIsNewUser);
    $('input[name="signup_as_new_user"]').live('change', changedIsNewUser);

    $('#session_email').live('keyup', function(){
        // in case it looks like email..
        if (/[^@]+@[^@.]+\.[^@.]+/.test(this.value)) {
            // ..then clone it to email input
            $('#user_username').val('');
            $('#user_email').val(this.value);
        } else {
            // ..else clone it to username input
            $('#user_username').val(this.value);
            $('#user_email').val('');
        }
    });

    $('#user_username').live('keyup', function(){
        $('#session_email').val(this.value);
    });

    $('#user_email').live('keyup', function(){
        $('#session_email').val(this.value);
    });

    $('#user_password').live('keyup', function(){
        $('#session_password').val(this.value);
    });

    $('#session_password').live('keyup', function(){
        $('#user_password').val(this.value);
    });

    $(document).ready(setupForRegisteredUser);

}(window.jQuery)
