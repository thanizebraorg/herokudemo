// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

!function ($) {
    function onEnter(selector, onEnterLambda, validateValueLambda) {
        if (null == selector) return;
        selector.live('keyup', function (evt, t) {
            // On <Enter> key pressed do click on button instead of form submit.
            if (13 == evt.charCode) {
                if ('function' == typeof onEnterLambda) onEnterLambda();
                return false;
            } else {
                if ('function' == typeof validateValueLambda) {
                    setTimeout(function() {
                        validateValueLambda($(evt.target).val());
                    }, 10);
                }
            }
            return true;
        });
    }

    onEnter($('form.subscription-form input[name="coupon"]'), function() {
        $('form.subscription-form .btn-do-subscribe-customer').click();
    });

    onEnter($('form.subscription-form input[name="rhotoken"]'), function() {
        $('form.subscription-form .btn-do-subscribe-enterprise').click();
    }, function(value) {
        if (!value)
            $('button.btn-do-subscribe-enterprise').addClass('disabled');
        else
            $('button.btn-do-subscribe-enterprise').removeClass('disabled')
    });

    $(document).ready(function() {
        $('input#payment_period_year').click();
    });

    function customerSubscriptionMode(descrContainer, conditionsLabel) {
        $('input[name="rhotoken"]').parent().hide();
        $('input[name="coupon"]').parent().show();
        $('button.btn-do-subscribe-enterprise').hide();
        $('button.btn-do-subscribe-customer').show();

        descrContainer.show();
        $('span.info-payment-option').text(conditionsLabel.text());

    }

    function enterpriseSubscriptionMode(descrContainer) {
        $('input[name="coupon"]').parent().hide();
        $('input[name="rhotoken"]').parent().show();
        $('button.btn-do-subscribe-customer').hide();
        $('button.btn-do-subscribe-enterprise').show();

        $('input[name="rhotoken"]').val('');
        $('button.btn-do-subscribe-enterprise').addClass('disabled');

        descrContainer.hide();
    }

    $('input[name="payment_period"]').live('change', function () {
        // console.log(this.value);
        var descrContainer = $('p.subscription-conditions-description');
        var conditionsLabel = $(this.parentElement).find('span.label-payment-option');
        if (conditionsLabel && conditionsLabel.text()) {
            customerSubscriptionMode(descrContainer, conditionsLabel);
        } else {
            enterpriseSubscriptionMode(descrContainer);
        }
    });
}(window.jQuery);
