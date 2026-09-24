/* followup script */
;(function( global ) {
  var Followup = (function() 
  {
    var redirectionURL = null;
    var showFirstForm = function()
    {
        $('.follow-up-form-modal, #form-0').hide();
        $('#follow_progress').show();
        $('.follow-up-form-modal, #form-3').show();
        $('#form-3').removeAttr("style");
    }
    var show_form  = function(_redirectionURL)
    {
        Followup.redirectionURL = _redirectionURL;
        $('.followUpdisplay').css('display','none');
        $('.follow-form-1').addClass('followupNone');
        $('#follow_progress').hide();
        $('body').addClass("bodyScroll");
        if($("#form-3").length == 0)
        {
           $('.follow-up-form-modal, #form-0').show();
        }
        else
        {
            
            $('#follow-up-form').show();
            $('.follow-up-form-modal').find(".modal-body").hide();
            $('.follow-up-form-modal, #form-0').show();
            $('.follow-up-form-modal').find(".modal-body").first().show()
        }
        if($("#form-3").length == 0)
        {
        	$.ajax({
        		type:'GET',
        		url:'/common/follow-up-form/',
        		success:function(response)
        		{
                    if(response.question_filled >= 6)
                    {
                        return;
                    }
                    $('#follow-up-form').append(response.html);
                    $('#follow-up-form').show();
                    $('.follow-up-form-modal').show();
                    CLDFollowUpForm.rewardPoint = response.reward_point;
                    setTimeout(showFirstForm, 2000);
                    
        		}
        	});

        }
        else
        {
            if (typeof CLDFollowUpForm === "object")
            {
                CLDFollowUpForm.current = 1;   
            }
            if(typeof setProgressBar === 'function')
            {
                setProgressBar(1,3);
            }
            setTimeout(showFirstForm, 2000);
            
        }
    };
    return {
        show_form:show_form,
        redirectionURL:redirectionURL
    }; //end of return
  })(); //end Followup

global.Followup = Followup ;


})(this);//end of global
/* Followup  script end*/
