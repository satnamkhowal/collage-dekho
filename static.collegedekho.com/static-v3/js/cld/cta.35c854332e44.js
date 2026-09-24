/* CTA script */
;(function( global ) {
  var CTA = (function() 
  {

    var nameRegex = /^[A-Za-z0-9 (\.)]+$/;
    var nameMessage = "Enter a valid name";
    var emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
    var emailMessage = "Enter a valid email";
    var phoneRegex = /^[6-9]\d{9}$/;
    var phoneMessage = "Enter 10 digit mobile no starting with 6,7,8,9";
    var streamMessage = "Please Choose Preferred Stream";
    var levelMessage = "Please Choose Preferred Level";
    var stateMessage = "Please Choose State";
    var boardMessage = "Please Choose Board"
    var budgetMessage = "Please Choose Budget"
    var activeClass = "activeClass";
    var grayClass = "preField";
    var errorClass = "error";
    var formGroup = ["#form-group_name","#form-group_email","#form-group_phone"
                   ,"#form-group_stream","#form-group_pref_level","#form-group_state","#form-group_board","#form-group_budget"];
    var siteDomain = "https://www.collegedekho.com"
    var ID;
    var APIResponse;  
    var clickedElement;             

var commonHandler = function(response)
{
    ID = response.cta;
    $('#popup-body').html("");
    $('.commomFormCustom').addClass('submitMsg');

  
}
var getCTAID = function()
{
  return ID;
}
var setCTAID = function(id)
{
   ID = id;
}
var showFollowupForm = function(response)
{
        // try
        // {
        //   Followup.show_form();
        //   return true;
        // }
        // catch(exc)
        // {
        //     console.log(exc);
                
        // }
      return false;
}
var successHandler = async function(response, eventData)
{
      commonHandler(response);
      if(eventData && eventData.template) {
        eventData["status"] = "Success"
        // Track GA and Web Engage Lead Submission Event
        // trackEvent("CTA_lead_submit_"+ eventData.template, eventData, "all");
        if(typeof trackEvent === 'function'){
            trackEvent("CTA Lead Submission", eventData, "ga");
        }
      }

      // Calling GA Event for login user in GA4
       //userLogInGA4(response.id );

       // login in analytics
       if (typeof loggedInAnalytic === 'function') {
           loggedInAnalytic(response.id, response.user_identifier);
       }

      // Remove Cta Message from LocalStorage if any
      localStorage.removeItem("cta_message");
      if(response.message)
      {
        setCtaMessage(response)
      }

      //Remove premium_counselling_amount from LocalStorage if any
      localStorage.removeItem("premium_counselling_amount");
      localStorage.removeItem("url");
      localStorage.removeItem("redirect_url");
      if(response.hasOwnProperty('premium_counselling_amount') && response.premium_counselling_amount != null)
      {
        setPremiumCounsellingAmount(response)
        setRedirectUrl(response)
        setUrl(response)
      }else{
          var actionResponse = ctaAction[response.action](response);
          if(actionResponse === false)
          {
            return;
          }
          actionResponse = false;
      }

      if(![17, 66].includes(response.action))
      {
         showOTPForm(response);
         
      }

}


// $(document).on('click', '#startMyJourney',function() {
//     if(typeof trackEvent === 'function') trackEvent("Start Journey Clicked")
//     closeThankYou(reload=false)
//     $('body').addClass("bodyScroll");
//     loadStyle(LeadProfilingCss, 'lead-profiling-css')
//     loadScript(LeadProfilingJs, 'lead-profiling-js')
//      $.get({
//         url: `/api/common/lead-profiling-html`,
//         success:function(response)
//         {
//             $("#popup-body").html(response['html']);
//         },
//         error:function(response)
//         {
//             console.log(response)
//         }
//     });
// })


var leadFormSuccessHandler = function(response)
{
  $('#popup-body').html(response.html);
  localStorage.setItem("leadFormShown", JSON.stringify({"value": true, "time": new Date()}));

}

var isValidName = function(text)
{
  return nameRegex.test(text);
}

var isValidEmail = function(text)
{
  return emailRegex.test(text);
}

var isValidPhone = function(text)
{
   return phoneRegex.test(text);
}

var isValidNumber = function(text)
{
   return /^\d+$/.test(text)
   
}

var isValidInterestedInStudying = function(control)
{
  if(control.length == 0)
  {
    return true;
  }  
  if(control.val().length == 0)
  {
    return false;
  }
  return true;
   
}

var showError = function(formGroup,field,message)
{
       // Batch DOM reads before writes to avoid layout thrash
       var $group = $(formGroup);
       $group[0].classList.remove(errorClass);
       $group.find("p.error").remove();
       $group[0].classList.add(errorClass);
       field.after("<p class='error msg'>"+message+"</p>");
}

var removeError = function(formGroup,field)
{
       var $group = $(formGroup);
       $group[0].classList.remove(errorClass);
       $group.find("p.error").remove();
}

var validateSelect = function(formGroup,field)
{
     removeError(formGroup,field);
}

var resetInput = function()
{
    for(index in formGroup)
    {
        $(formGroup[index]).removeClass(errorClass);
        $(formGroup[index]).find("p").remove(".error");
    }
  
}

var isVaildInput = function(response)
{
      var name = $("#id_name_cta");
      var email = $("#id_email_cta");
      var phone = $("#id_phone_cta");
      var stream = $("#id_stream_cta");
      var pref_level = $("#id_pref_level_cta");
      var pref_state = $("#id_pref_state_cta");
      var state = $("#id_state_cta");
      var board = $("#id_board_cta");
      var budget = $("#id_budget_cta");
      var interestedInStudying = $("#id_interested_in_studying_cta");

      resetInput();
      var isValidNameFlag = isValidName(name.val());
      var isValidEmailFlag = isValidEmail(email.val());
      var isValidPhoneFlag = isValidPhone(phone.val());
      var isValidStreamFlag = isValidNumber(stream.val());
      var isValidPrefLevelFlag = isValidNumber(pref_level.val());

      if(!isValidNameFlag)
      {
          
          name.after("<p class='error msg'>"+nameMessage+"</p>");
          $('#form-group_name').addClass('error');
        
      }
      if(!isValidEmailFlag)
      {
          
          email.after("<p class='error msg'>"+emailMessage+"</p>");
          $('#form-group_email').addClass('error');
      }
 
      if(!isValidPhoneFlag)
      {
          
          phone.after("<p class='error msg'>"+phoneMessage+"</p>");
          $('#form-group_phone').addClass('error');
      }

      if(!isValidStreamFlag)
      {
            if(isValidNameFlag && isValidEmailFlag && isValidPhoneFlag)
           {
              stream.focus();
           }
            stream.after("<p class='error msg'>"+streamMessage+"</p>");
            $('#form-group_stream').addClass('error')
      }

      if(!isValidPrefLevelFlag)
      {
           if(isValidNameFlag && isValidEmailFlag && isValidPhoneFlag && isValidStreamFlag)
           {
              pref_level.focus();
           }
          
            pref_level.after("<p class='error msg'>"+levelMessage+"</p>");
            $('#form-group_pref_level').addClass('error')
      }
      var isValidStateFlag = false;
      if(pref_state.val() == undefined)
      {
          isValidStateFlag = isValidNumber(state.val());
      }
      else
      {
          isValidStateFlag = true;
      }
      if(!isValidStateFlag)
      {

          if(isValidNameFlag && isValidEmailFlag && isValidPhoneFlag && isValidStreamFlag && isValidPrefLevelFlag)
           {
              state.focus();
           }
            state.after("<p class='error msg'>"+stateMessage+"</p>");
            $('#form-group_state').addClass('error')
      }      
     
     var isValidBudget = true;
     if(budget.length > 0)
     {
        isValidBudget = isValidNumber(budget.val());
         if(!isValidBudget)
         {
          if(isValidNameFlag && isValidEmailFlag && isValidPhoneFlag && isValidStreamFlag && isValidPrefLevelFlag && isValidStateFlag)
           {
              budget.focus();
           }
            budget.after("<p class='error msg'>"+budgetMessage+"</p>");
            $('#form-group_budget').addClass('error');

       }
    } 


     var validInterestedInStudying = true;
     if(!isValidInterestedInStudying(interestedInStudying))
     {
         validInterestedInStudying = false;
         interestedInStudying.after("<p class='error msg'>Please choose one</p>");
         $('#interested_in_studying').addClass('error');
     }

     //var contentType = $('input[name="content_type"]').val();

     var requiredFields = isValidNameFlag && isValidEmailFlag && isValidPhoneFlag && isValidStreamFlag && isValidPrefLevelFlag && isValidStateFlag &&  validInterestedInStudying && isValidBudget
     var button_action = $("#button_action").val()
     if(button_action && button_action == "66"){
        requiredFields = isValidNameFlag && isValidPhoneFlag
     }
     if(requiredFields)
     {
        return true;
     }
     return false;
      //pref_state 


}

  var serverErrorHandler = function(response)
  {

          $('.error.msg').html('')
          $('.form-group').removeClass('error')
          if (response.responseJSON.name){
              $("#id_name_cta").after("<p class='error msg'>"+response.responseJSON.name+"</p>");
              $('#form-group_name').addClass('error')

          }
          if (response.responseJSON.phone){
              $("#id_phone_cta").after("<p class='error msg'>"+response.responseJSON.phone+"</p>");
              $('#form-group_phone').addClass('error')

          }
          if (response.responseJSON.email){
              $("#id_email_cta").after("<p class='error msg'>"+response.responseJSON.email+"</p>");
              $('#form-group_email').addClass('error')

          }
          if (response.responseJSON.stream){
              $("#id_stream_cta").after("<p class='error msg'>"+response.responseJSON.stream+"</p>");
              $('#form-group_stream').addClass('error')

          }
          if (response.responseJSON.pref_level){
              $("#id_pref_level_cta").after("<p class='error msg'>"+response.responseJSON.pref_level+"</p>");
              $('#form-group_pref_level').addClass('error')

          }
          if (response.responseJSON.state){
              $("#id_state_cta").after("<p class='error msg'>"+response.responseJSON.state+"</p>");
              $('#form-group_state').addClass('error')

          }
  }

  var webengageLogin = function(user_id)
  {
    
  }
 var examAlertSet = function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }

 }
var downloadSamplePaper=function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


    location.href = response.url;
}

var courseDetailApplyNow = function(response){
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


}
var talkToExperts=function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


 }
var subscribeNow=function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


 }
var getFreeCounselling=function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


    setCtaMessage(response);
 }
var redirectToUrl=function(response)
 {
    if (response.is_authenticated){
        window.open(response.url, '_self')
        return false;
    }
    else{
        redirectAfterOtp(response.url,false)
    }
 }
var collegePredictor=function(response)
 {
    if (response.is_authenticated){
        window.open(response.url, '_self')
        return false;
    }
    else{
        redirectAfterOtp(response.url,false)
    }

 }
var mockTest = function(response)
 {
if (response.is_authenticated){
        window.open(response.url, '_self')
        return false;
    }
    else{
        redirectAfterOtp(response.url,false)
    }
 }
var apply = function(response)
 {
    if (response.ins_id != null){
        var user_id;
        if (response.is_authenticated == false){
            user_id = localStorage.getItem("user_id")
        }
        else{
            user_id = response.user_id
        }


    }

    let nextURL = response.url
    // check redirect url is caf, then add uid for direct OTP screen on profile
    if(nextURL.includes('/my-dashboard/interested-colleges?institute_id')){
        nextURL = `${nextURL}&uid=${response?.user_identifier}`
    }

    if(response.is_authenticated)
    {

        location.href=nextURL
    }
    else
    {
    redirectAfterOtp(nextURL, false)
    }
 }

var downloadBrochure = function(response)
 {
    if (response.ins_id != null){
        var user_id;
        if (response.is_authenticated == false){
            user_id = localStorage.getItem("user_id")
        }
        else{
            user_id = response.user_id
        }


    }
    if (response.is_prospectus_exists){
        location.href = response.url;
    }
 }
var shortlist = function(response)
 {
    setCtaMessage(response);
 }
var newsSubscribe = function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


}
var courseDetailTalkToExperts = function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


 }
var courseDetailGetMoreDetail = function(response)
 {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


 }
var admissionOpenApplyNow = function(response)
 {
      location.href = response.url;
 }


var instituteRedirect = function(response)
 {
    if (response.ins_id != null){
        var user_id;
        if (response.is_authenticated == false){
            user_id = localStorage.getItem("user_id")
        }
        else{
            user_id = response.user_id
        }


    }
 }
var exam_sample_paper_yearly = function(response)
  {

    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }


    if(response.url)
    {
        location.href = response.url;
    }
    else if (sample_paper_id != 'undefined')
    {
        location.href = '/dashboard/exam/exam-year-wise-sample-paper-downloader/'+sample_paper_id;
    }  
  }

  var course_detail_followup_form_1 = function(response)
  {
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }



       $.ajax({
            type:'GET',
            url:'/followup-form/preference-form/',
            success:function(response)
            {
                    $('#ajax_popup').hide();
                    //$('.followUpdisplay').css('display','none');
                    $('.followUpcourse').show();
                    $('.followUpcourse').addClass('followUpdisplay');
                    $('.follow-form-1').removeClass('followupNone');
            },

            complete: function(response)
            {
                options_res.push(response.responseJSON);
                exam_board_options(options_res);
                score_type_options(options_res);
            }
          });

       return false;

  }

  var shortlist_career = function(response)
  {

  }

  var enroll = function(response)
  {

  }

  var redirectAfterOtp = function(url,blank)

  {
        if(url) {
            if(typeof blank === 'undefined') {
                blank = false;
            }
            arr = {
                redirection_url : url,
                window : blank
            }
            localStorage.setItem("redirection_url",JSON.stringify(arr))
        }

  }

var showFollowupAfterLogin = async function()
{
    var redirectionUrl = localStorage.getItem("redirection_url")
    var redirectUrl = localStorage.getItem("redirect_url")
    var url = localStorage.getItem("url")
    var ctaMessage = localStorage.getItem("cta_message")
    var ctaHeading = localStorage.getItem("cta_heading")
    var premiumCounsellingAmount = localStorage.getItem("premium_counselling_amount")
    var triggerElemClick = localStorage.getItem("triggerElemClick")

    if(premiumCounsellingAmount){
        $('body').removeClass('bodyScroll');
        if(url){

            // Trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.click();

            // Redirect after a short delay (enough for download to start)
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 10000);
            return
        }

        window.location.href = redirectUrl;
        return
    }

    if (redirectionUrl){
        url = JSON.parse(redirectionUrl)
        localStorage.removeItem("redirection_url")

        if (url["window"]===true){
            window.open(url.redirection_url,"_blank")
        }
        else{
            location.href = url.redirection_url;
        }
    }

    if (ctaMessage) {
        if (typeof trackEvent === 'function') {
            trackEvent("Thank You Viewed", { "is_new_lead": APIResponse?.is_new_lead });
        }

        // Do not redirect IELTS leads (Entrelogy) to preference page
        if(APIResponse?.business_unit_id === 1030) {
            $("#thankyouText").html(ctaMessage);
            $("#thankyouTitle").html(ctaHeading || "Thank You");
            $("#thankyouCTAViewMore").hide()
            $("#thank-you-overlay").css("display", "flex");
            $('body').addClass("bodyScroll");
            return;
        }

        if (APIResponse?.partner_status === "CAF Partner") {
            // partner other ctas except APPLY NOW (show message and button to redirect caf link)
            $("#thankyouText").html(ctaMessage);
            $("#thankyouTitle").html(ctaHeading || "Thank You");
            $("#thankyouCTAViewMore")
                .attr("href", `/my-dashboard/interested-colleges?institute_id=${APIResponse?.ins_id}&uid=${APIResponse?.user_identifier}`)
                .text('View Shortlisted Colleges')
                .show();
        } else {
            // New leads always go to the preference page.
            if (APIResponse?.is_new_lead) {
                window.location.href = `/common-preference-page?uid=${APIResponse?.user_identifier}${APIResponse?.content_type_id === 22 ? '&skip_preference=true' : ''}`;
                return;
            }
            if (ctaHeading) {
                $("#thankyouTitle").html(ctaHeading);
                $("#thankyouText").html("");
            } else {
                $("#thankyouTitle").html("Thank You");
                $("#thankyouText").html(ctaMessage);
            }
            $("#thankyouCTAViewMore")
                .attr("href", `/my-dashboard/college-recommendations`)
                .text('View Recommended Colleges')
                .show();
            //$("#startMyJourney").hide();
        }
        $("#thank-you-overlay").css("display", "flex");
        $('body').addClass("bodyScroll");
        return;
    }
    if(triggerElemClick) {
        localStorage.removeItem("triggerElemClick")
        clickedElement.removeClass("apply_now_det_cd")
        clickedElement.trigger('click')
    }
    $('body').removeClass('bodyScroll');
}


var gotoMyProfile = function()
{
    location.href = "/my-dashboard/college-recommendations";
}

var showOTPForm = function(response)
{
    APIResponse = response;
    window.APIResponse = APIResponse
    // if(!response.is_authenticated)
    // {
    //   get_login_modal(null,true,showOTPVerification);
    // }
    // else
    // {
    //     showFollowupAfterLogin();
    // }
    showFollowupAfterLogin();
}

var showOTPVerification = function()
{
    if(typeof(APIResponse.phone_no) != 'undefined')
    {
        $("#phone_no").val(APIResponse.phone_no);
    }
    reloadOnLogin = false;
    $('#signIn').hide();
    $('#signUp').hide();
    if(downloadTimer)
    {
        clearInterval(downloadTimer);
    }
    downloadTimer = null;
    OTPVerificationForm(showFollowupAfterLogin);

}


  var setCtaMessage = function(response)
  {
        localStorage.setItem("cta_message", response.message)
        localStorage.setItem("cta_heading", response?.heading || "")
   }

 var setPremiumCounsellingAmount = function(response)
  {
        localStorage.setItem("premium_counselling_amount", response.premium_counselling_amount)
   }

var setRedirectUrl = function(response)
{
    localStorage.setItem("redirect_url", response.redirect_url)
}

var setUrl = function(response)
{
    if(response?.url){
        localStorage.setItem("url", response?.url)
    }

}

var getBoardPagePdf = function (response) {

    var eventNames = {28: "Downloaded Board Guide",
    29: "Board Get Admit Card Info",
    30: "Board Download Syllabus Guide",
    31: "Board Subscribe Now",
    32: "Board Download Dates",
    33: "Board Download Sample Paper",
    34: "Board Get Result Info",
    36: "Board Pop Up Cta",
    37: "Board Set Exam Alert"}


    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }
   
    if(response.url){
    location.href=response.url;
    }

}
var getSamplePaper = function (response){
    var user_id;
    if (response.is_authenticated == false){
        user_id = localStorage.getItem("user_id")
    }
    else{
        user_id = response.user_id
    }

    location.href=response.url
}

var newsApplyNow = function(response){
    if (response.is_authenticated){
        window.open(response.url, '_self')
    }
    else{
        redirectAfterOtp(response.url,false)
    }
}

var gradeazyTets = function (response){
    if (response.is_authenticated){
        window.open(response.url, '_blank')
    }
    else{
        redirectAfterOtp(response.url,true)
    }
}
var downloadpdf = function (response){
    if (response.is_authenticated){
        window.open(response.url, '_self')
    }
    else{
        redirectAfterOtp(response.url,false)
    }


    // if (response.action == 60){
    //     trackEvent("Psychometric Test", {
    //     "user_id": response.id,
    //     "pref_level": response.pref_level,
    //     "pref_stream": response.pref_stream,
    //     "cta_id": response.cta
    //     })
    // }
}

var showMessage = function(response)
{

}

var callUs = function(response){

    if (response?.ivr) {
        location.href = `tel:${response?.ivr}`;
    }
} 

var triggerClick = function(response) {
    localStorage.setItem("triggerElemClick", true)
}

var pollCTA = function(response) {

}

var ctaAction = {
    1: examAlertSet,
    2: downloadSamplePaper,
    3: talkToExperts,
    4: subscribeNow,
    5: getFreeCounselling,
    6: redirectToUrl,
    7: collegePredictor,
    8: mockTest,
    9: apply,
    10: downloadBrochure,
    11: shortlist,
    12: newsSubscribe,
    13: courseDetailTalkToExperts,
    14: courseDetailGetMoreDetail,
    15: admissionOpenApplyNow,
    16: instituteRedirect,
    17: exam_sample_paper_yearly,
    18: course_detail_followup_form_1,
    19: shortlist_career,
    20: enroll,
    21: enroll,
    22: courseDetailApplyNow,
    23: setCtaMessage,
    24: setCtaMessage,
    25: setCtaMessage,
    26: setCtaMessage,
    27: setCtaMessage,
    28: getBoardPagePdf,
    29: getBoardPagePdf,
    30: getBoardPagePdf,
    31: getBoardPagePdf,
    32: getBoardPagePdf,
    33: getSamplePaper,
    34: getBoardPagePdf,
    36: getBoardPagePdf,
    37: getBoardPagePdf,
    39: downloadpdf,
    41: downloadpdf,
    42: setCtaMessage,
    43: setCtaMessage,
    48: gradeazyTets,
    49: setCtaMessage,
    50:downloadpdf,
    51:newsApplyNow,
    52: downloadpdf,
    53: downloadpdf,
    54: downloadpdf,
    56: downloadpdf,
    57: setCtaMessage,
    60: downloadpdf,
    61: downloadpdf,
    62: showMessage,
    64: downloadpdf,
    66: callUs,
    67: downloadpdf,
    68: redirectToUrl,
    69: redirectToUrl,
    70: redirectToUrl,
    71: downloadpdf,
    72: downloadpdf,
    73: triggerClick,
    74: downloadpdf,
    77: setCtaMessage,
    78: pollCTA,
    83: pollCTA
 }

    var fetchFormData = async function(data) {
        return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/forms/get_form/",
            traditional: true,
            data: data,
            beforeSend: function () {
                $(".loading").css("display", "block");
            },
            success:function (response)
            {
              resolve(response)
            },
            error: function(response)
            {
                console.log("error in popup college")
                reject(response)
            }

        });
    })
    }

    var showForm = async function(data, responseData)
    {

        if (responseData) {
            leadFormSuccessHandler(responseData);
            return;
        }

          $.ajax({
            type: "POST",
            url: "/forms/get_form/",
            traditional: true,
            data: data,
            beforeSend: function () {
                $(".loading").css("display", "block");
            },
            success:function (response) 
            {
              leadFormSuccessHandler(response);
            },
            error: function(response)
            {
                console.log("error in popup college")
            }

         });

    }
    var submit  = function(data)
    {
         if(!isVaildInput())
         {
           return false;
         }
         submitLead(data);

        
    }

    var submitLead = function(data)
    {
        // Batch all DOM reads upfront before any writes
        const form = document.getElementById('cta-form-ajax');
        const submitButton = form?.querySelector('input[type="submit"], button[type="submit"]');
        const formData = form ? new FormData(form) : null;
        const formJson = formData ? formDataToJson([...formData.entries()]) : {};
        const eventData = prepareEventData(formJson);

        if (submitButton) {
            submitButton.disabled = true;
            // Defer visual update to avoid blocking interaction
            requestAnimationFrame(() => {
                submitButton.setAttribute("data-original-text", submitButton.innerHTML);
                submitButton.innerHTML = `
                    <span class="verifying-content">
                        <img src="${staticURL}images/loader_white.gif"
                            alt="Loading..."
                            class="verifying-spinner" />
                        <span class="verifying-text">Almost done...</span>
                    </span>
                `;
            });
        }

        const fetchPromise = fetch('/common/api/v2/ctasubmission?show-lead-profiling=1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        });

        const restoreButton = () => {
            if (!submitButton) return;
            submitButton.disabled = false;
            requestAnimationFrame(() => {
                submitButton.innerHTML = submitButton.getAttribute("data-original-text") || "Submit";
            });
        };

        fetchPromise
            .then(res => {
                if (!res.ok) throw res;
                return res.json();
            })
            .then(response => {
                successHandler(response, eventData);
            })
            .catch(response => {
                if (eventData?.template) {
                    eventData.status = "Failed";
                    if (typeof trackEvent === 'function') {
                        trackEvent("CTA Lead Submission", eventData, "ga");
                    }
                }
                serverErrorHandler(response);
            })
            .finally(restoreButton);
    }


    var checkFieldVisibilityAndSendDataToGA = function(entries, observer, data){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                // Calling GA Event
                if(typeof trackEvent === 'function'){
                    trackEvent("Form_impression_"+entry.target.name, data, "ga")
                }
                observer.unobserve(entry.target);
            }
        });

    }

   var trackFormFieldImpression = async function(data){
        // Create a new Intersection Observer instance
        var formObserver = new IntersectionObserver(function(entries, observer){
            checkFieldVisibilityAndSendDataToGA(entries, observer, data);
        }, {rootMargin: '0px',threshold: 0.50});

        
        // calling observer with 1s delay because of form API response time
        setTimeout(function(){
            // Start observing form fields which has class gtm-form-field
            // Get fields list with class gtm-form-field
            var formFieldList = document.getElementsByClassName('gtm-form-field');

            // convert HTMLCollection to Array
            var formFieldArray = Array.from(formFieldList);

            // Observe Each Field
            formFieldArray.forEach(function(element){
                formObserver.observe(element);
            });
        }, 1000);
   }

    var loggedInUserLeadSubmit = async function(data){

        // convert data to send to GA
        const eventData = prepareEventData(data)

        // cta submission api call
        return new Promise((resolve, reject) => {
            $.ajax({
                type:'POST',
                url: '/common/api/v2/ctasubmission',
                data: data,
                success: function(response)
                {
                    successHandler(response, eventData);
                    resolve(response);
                },
                error: function (response, jqXHR, textStatus, errorThrown)
                {
                    if(eventData && eventData.template) {
                        eventData["status"] = "Failed"
                        if(typeof trackEvent === 'function'){
                            trackEvent("CTA Lead Submission", eventData, "ga");
                        }
                    }
                    serverErrorHandler(response);
                    reject(response)
                }
            });
        });
    }

   var trackCTAClick = async function(data){

        var {template, button_action,
        institute_id, button_text,
        cta_id, button_id, position, content_type, object_id, sub_page} = data

        // Event Data to Track GA EVENT
        var eventData = {
            'content_type': isEmpty(content_type) ? "NA" : content_type,
            'object_id': isEmpty(object_id) ? "NA" : object_id,
            'button_id': isEmpty(button_id) ? "NA": button_id,
            'cta_id': isEmpty(cta_id) ? "NA": cta_id,
            'template': Template,
            "button_text" : isEmpty(button_text) ? "NA" : button_text,
            'sub_page': isEmpty(sub_page) ? "NA" : sub_page
        };

        template = template.toLowerCase()
        // Track GA EVENT CTA click
        if(typeof trackEvent === 'function'){
            trackEvent("CTA Clicked", eventData, "ga")
        }

        var analyticEventData = {
            'template': template,
            "sub_page": sub_page,
            'button_id': button_id,
            'cta_id': cta_id,
            'button_text': button_text,
           // "user_id": parseInt(localStorage.getItem("user_id")),
            "vertical_id": verticalId,
           // "is_request_callback": requestCallbackButtonTexts.includes(button_text.toLowerCase())
        };
        if(typeof trackEvent === 'function'){
            trackEvent("CTA Clicked", analyticEventData)
        }
   }

   var openAutoPopUp = function(data)
   {
        const otherPopup = document.querySelector('.none-cta-popup');
        if(otherPopup)
        {
            if (window.getComputedStyle(otherPopup).display !== 'none') {
                 return;
            }  
        }
        CTA.showForm(data);
        $('body').addClass("bodyScroll");

        // Defer analytics calls so they don't block the interaction response
        setTimeout(function() {
            CTA.trackCTAClick(data);
            var eventData = {
                "content-type": data["content_type"],
                "object-id": data["object_id"],
                "cta-id": data["cta_id"],
                "template": data["template"],
                "button-id": data["button_id"],
                "position":0
            };
            CTA.trackFormFieldImpression(eventData);
        }, 0);
   }

    const setClickedElement = (elem) => {
        clickedElement = elem
    }

    return {
        loggedInUserLeadSubmit: loggedInUserLeadSubmit
        ,showForm:showForm
        ,fetchFormData:fetchFormData
        ,submit:submit
        ,validateSelect:validateSelect
        ,removeError:removeError
        ,submitLead:submitLead
        ,isValidName:isValidName
        ,isValidEmail:isValidEmail
        ,isValidPhone:isValidPhone
        ,isValidNumber:isValidNumber
        ,nameMessage:nameMessage
        ,emailMessage:emailMessage
        ,phoneMessage:phoneMessage
        ,showFollowupForm:showFollowupForm
        ,getCTAID:getCTAID
        ,setCTAID:setCTAID
        ,isValidInterestedInStudying:isValidInterestedInStudying
        ,showOTPForm:showOTPForm
        ,showOTPVerification:showOTPVerification
        ,gotoMyProfile:gotoMyProfile
        ,trackFormFieldImpression:trackFormFieldImpression
        ,siteDomain:siteDomain
        ,trackCTAClick:trackCTAClick
        ,openAutoPopUp: openAutoPopUp
        ,setClickedElement: setClickedElement
    }; //end of return
  })(); //end CTA

global.CTA = CTA;

$(document).on('click', '.sample_paper_button_for_login', function(e){
  sample_paper_id = $(this).data('sample_paper_id');
})

const disableBtn = (btn) => {
    // Disable immediately to block double-clicks, defer visual update to next frame
    btn.disabled = true;
    requestAnimationFrame(() => {
        btn.setAttribute('data-original-text', btn.innerHTML);
        btn.innerHTML = `<span class="spinner"></span> Loading...`;
    });
};

const enableBtn = (btn) => {
    btn.disabled = false;
    requestAnimationFrame(() => {
        const originalText = btn.getAttribute('data-original-text');
        if (originalText) btn.innerHTML = originalText;
    });
};

const getRequiredFields = (formData) => {
    let autoSubmitAllowed = formData?.auto_submit_allowed
    let requiredFields = ["name", "phone", "email"]

    if (!(formData.pref_level && formData.stream) && !autoSubmitAllowed) {
        requiredFields.push("pref_level", "stream")
    }
    return requiredFields
}

const getHiddenInputs = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const hidden = {};
    doc.querySelectorAll('input[type="hidden"]').forEach(el => {
        if (el.name) hidden[el.name] = el.value;
    });
    return hidden;
}

$(document).on('click', '.apply_now_det_cd', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const $btn = $(this);
    const btnEl = event.currentTarget;
    const href = $btn.data('href');

    if (href) {
        $('body').removeClass("bodyScroll");
        location.href = href;
        return;
    }

    // INP: Disable button early
    disableBtn(btnEl);

    const crsRedirection = $btn.data("crs-redirection-url");
    const buttonText = btnEl.innerText
    const data = {
        content_type:       $btn.data('content_type'),
        object_id:          $btn.data('object_id'),
        button_id:          $btn.data('button_id'),
        cta_id:             $btn.data('cta_id'),
        app_label:          $btn.data('app_label'),
        stream:             $btn.data('stream') || null,
        level:              $btn.data('level') || null,
        course_id:          $btn.data('course_id'),
        pref_stream:        $btn.data('pref_stream'),
        pref_level:         $btn.data('pref_level'),
        course_or_degree:   $btn.data('course_or_degree'),
        pref_course:        $btn.data('pref_course'),
        degree_id:          $btn.data('degree_id'),
        other_object_id:    $btn.data('other_object_id'),
        button_text:        buttonText,
        institute_id:       $btn.data('insti-id'),
        instituteName:      $btn.data('institute-name'),
        position:           $btn.data('position'),
        template:           Template || $btn.data('template'),
        sub_page:           SubPage
    };

    const instituteType = $btn.data("institute-type");
    if (instituteType !== undefined) {
        data.instituteType = instituteType == 2 ? "university" : "colleges";
    }

    if (data.template) {
        // Defer analytics so it doesn't block the click response
        setTimeout(() => CTA.trackCTAClick(data), 0);
    }
    CTA.setClickedElement($btn);

    requestAnimationFrame( async () => {
        $('#popup-body').html("");
        $('body').addClass("bodyScroll");

        // Always fetch the form first
        try {
            const response = await CTA.fetchFormData(data);
            const requiredFields = getRequiredFields(response)
            const hasAllRequired = requiredFields.every(field => response[field]);

            if (hasAllRequired) {
                const hiddenInputs = getHiddenInputs(response.html);
                const submissionData = {
                    ...hiddenInputs,
                    ...data,
                    name: response.name,
                    email: response.email,
                    phone: response.phone,
                    pref_level: response.pref_level,
                    stream: response.stream,
                    pref_state: response.pref_state,
                    cta: data.cta_id,
                    button: data.button_id
                };
                await CTA.loggedInUserLeadSubmit(submissionData);
                enableBtn(btnEl);
                $('body').removeClass("bodyScroll");
                if (crsRedirection) {
                    location.href = crsRedirection;
                    return
                }
            } else {
                CTA.showForm(data, response);
                CTA.trackFormFieldImpression(data);
                enableBtn(btnEl);
            }
        } catch (err) {
            enableBtn(btnEl);
            $('body').removeClass("bodyScroll");
            return
        }
    });
});

  $(document).on('submit', '#cta-form-ajax',function(e)
  {

       e.preventDefault();
       var form_data = $(this).serialize() +'&csrfmiddlewaretoken=' + $('#csrf_token').val() ;

       CTA.submit(form_data);

  });

 

$(document).on('focus', '#id_name_cta',function(e)
  {
     CTA.removeError('#form-group_name',$(this));       
  });


$(document).on('focus', '#id_phone_cta',function(e)
  {
       CTA.removeError('#form-group_phone',$(this));
  });


$(document).on('focus', '#id_email_cta',function(e)
  {
    CTA.removeError('#form-group_email',$(this));
  });

  $(document).on('focusout', '#id_email_cta',function(e)
  {
      var x = document.getElementById("id_email_cta");
      x.value = x.value.toLowerCase();
      x.value = x.value.replace(/ +/g, "");
  });


  $(document).on('change', '#id_pref_level_cta',function(e)
  {
      CTA.validateSelect('#form-group_pref_level',$(this));
  });

  $(document).on('change', '#id_stream_cta',function(e)
  {
      CTA.validateSelect('#form-group_stream',$(this));
  });

  $(document).on('change', '#id_state_cta',function(e)
  {
      CTA.validateSelect('#form-group_state',$(this));
  });

  $(document).on('change', '#id_board_cta',function(e)
  {
      CTA.validateSelect('#form-group_board',$(this));
  });

  $(document).on('change', '#id_budget_cta',function(e)
  {
      CTA.validateSelect('#form-group_budget',$(this));
  });
  $(document).on('click', '#id-button-view-recommendation',function(e)
  {
      CTA.gotoMyProfile();
  });
  $(document).on('focusout', '.gtm-form-field', function(e){

    var form = document.getElementById("cta-form-ajax");
    var template = form.elements.template && form.elements.template.value;
    var buttonId = form.elements.button && form.elements.button.value;
    var ctaId = form.elements.cta && form.elements.cta.value;
    var formId = form.elements.form_id && form.elements.form_id.value;
    var buttonText = form.elements.button_text && form.elements.button_text.value;

    var params = {
        "user_input": isEmpty(e.target.value) ? "NA" : e.target.value,
        "button_id": isEmpty(buttonId) ? "NA": buttonId,
        "button_text": isEmpty(buttonText) ? "NA": buttonText,
        "cta_id": isEmpty(ctaId) ? "NA": ctaId,
        "form_id": isEmpty(formId) ? "NA": formId,
        "template": isEmpty(template) ? "NA": template,
    }

    // Track GAEvent Form Interaction. Form Field Click
    if(typeof trackEvent === 'function'){
        trackEvent("FORM_click_field_"+e.target.name, params, "ga")
    }
  })


})(this);//end of global
/* CTA script end*/
