/* DU script */
;(function( global ) {
  var DU = (function() 
  {

 var leadFormSuccessHandler = function(response)
 {
    $('#popup-body').html(response);
    $('body').addClass('overflowHide');
    $('#du-eligibility-popup').show();

 }

 var initilize = function(data)
 {
      $("#id_courses").select2({placeholder: "Select Courses"});
      $("#id_institutes").select2({placeholder: "Select Colleges"});

 }

 var showForm = function(data)
 {}

var sendMail = function(data)
{
    
      $.ajax({
          type:'GET',
          url: '/univcutoff/mail/'+data['slug'],
          success: function(response)
          {
              $("#common_modal_new").show();
          },
          error: function (response, jqXHR, textStatus, errorThrown)
          {
          }
      });
}


    return {
           showForm:showForm
           ,initilize:initilize
           ,sendMail:sendMail
    }; //end of return
  })(); //end CTA

global.DU = DU;

var validateDecimal = function(text)
{
   return !isNaN(parseFloat(text)) && isFinite(text);

}
 

var validationStep1 = function()
 {
    var name = $("#univ_id_name");
    var phone = $("#univ_id_phone");
    var email = $("#univ_id_email");
    var courses = $("#id_courses");
    var isValidName = CTA.isValidName(name.val());
    var isValidPhone = CTA.isValidPhone(phone.val());
    var isValidEmail = CTA.isValidEmail(email.val());
    var count = $("#id_courses :selected").length;
    $("#form-group-name").removeClass("error");
    $("#form-group-phone").removeClass("error");
    $("#form-group-email").removeClass("error");
    $("#form-group-courses").removeClass("error");
    $( ".step1").remove();
    if(!isValidName)
    {
       $("#form-group-name").addClass("error");
       name.after("<p class='msg step1'>"+NameMessage+"</p>");
       
    }

    if(!isValidPhone)
    {
       $("#form-group-phone").addClass("error");
       phone.after("<p class='msg step1'>"+PhoneMessage+"</p>");
       
    }

    if(!isValidEmail)
    {
       $("#form-group-email").addClass("error");
       email.after("<p class='msg step1'>"+EmailMessage+"</p>");
       
    }

   if(count<=0)
    {
       $("#form-group-courses").addClass("error");
       $('#id_courses').after("<p class='error msg step1'>Please choose atleast one course</p>");
       
    }

    if(isValidName && isValidPhone && isValidEmail && count > 0)
    {
       return true;
    }
   return false;

 }

var isGenderSelected = function()
{
   var isChecked =false;   
   jQuery("input[name='gender']").each(function() 
   {
      if(this.checked)
      {
         isChecked = true;
         return true;
      }
   });
   return isChecked;
}
var validationStep2 = function()
 {
    var category = $("#id_category");
    var domicile = $("#id_domicile");  
    var board = $("#id_board");
    var subject = $("#id_subject");
    var percentage = $("#id_percentage");
    
    var domicileCount = $("#id_domicile :selected").length;
    var subjectCount = $("#id_subject :selected").length;
    var isValidGender = isGenderSelected()
    var isValidPercentage=validateDecimal(percentage.val());
    if(isValidPercentage && parseFloat(percentage.val()) > 100)
    {
       isValidPercentage = false;
    }

    $("#form-group-category").removeClass("error");
    $("#form-group-domicile").removeClass("error");
    $("#form-group-board").removeClass("error");
    $("#form-group-subject").removeClass("error");
    $("#form-group-percentage").removeClass("error");

    $( ".step1").remove();

    if(category.val() == "" )
    {
       $("#form-group-category").addClass("error");
       category.after("<p class='error msg step1'>Please choose category</p>");
    }
    
    if(domicileCount <=0 )
    {
      $("#form-group-domicile").addClass("error");
       domicile.after("<p class='error msg step1'>Please choose atleast one domicile</p>");
    }

    if(!isValidGender)
    {  
      $("#form-group-gender").addClass("error");
       $(".form-check-inline").after("<p class='error msg step1'>Please select gender</p>");
    }


    if(board.val() == "" )
    {
       $("#form-group-board").addClass("error");
       board.after("<p class='error msg step1'>Please choose board</p>");
        
    }

    if(subjectCount <5 )
    {
       $("#form-group-subject").addClass("error");
       subject.after("<p class='error msg step1'>Please choose atleast five subject</p>");
        
    }
   
   
   if(!isValidPercentage)
   {
      $("#form-group-percentage").addClass("error");
      percentage.after("<p class='error msg step1'>Best 4 Percentage should be less than or 100</p>");

   }
   if(domicileCount >0 && subjectCount >= 5 && isValidGender &&  isValidPercentage && category.val() != ""  && board.val() != "")
   {
      return true;
   }
   return false;


 }

var validateForm = function()
{
   var step = $("#id_step").val();
   if(step == 1)
   {
      return validationStep1()
   }
   return validationStep2()
}


var submitForm = function(e)
{
        e.preventDefault();
      if(!validateForm())
      {
        return;
      }
      $(this).attr('disabled', true);
      $(".du-loading").show();
    var data = $("#du-eligibility-form").serialize() +'&csrfmiddlewaretoken=' + $('#csrf_token').val() +"&referer_path="+window.location.href; 

          $.ajax({
              type:'POST',
              url: '/univcutoff/cta',
              data: data,
              success: function(response)
              {
                
                if(response.url)
                {
                   location.href = response.url;
                   return; 
                }
                else
                {
                    $(".du-loading").hide();
                }
                 
                 $("#du-eligibility-form-inside-div").html(response.html);
                 $("#id_subject").select2({placeholder: "Select your Class 12 Subjects"});
                 $("#id_domicile").select2({placeholder: "Select Domicile"});
                 
              },
              error: function (response, jqXHR, textStatus, errorThrown)
              {
                 $(".du-loading").hide();
              }
          });

}


var backForm = function(e)
{
    console.log("back...");
    $(this).attr('disabled', true);
    e.preventDefault();
    var csrfmiddlewaretoken= $('#csrf_token').val();
    var pk = $("#id_pk").val();
    var data = {"step":0,"csrfmiddlewaretoken":csrfmiddlewaretoken,"pk":pk,"referer_path":window.location.href}
    $(".du-loading").show();
    $.ajax({
              type:'POST',
              url: '/univcutoff/cta',
              data: data,
              success: function(response)
              {
                $(".du-loading").hide();  
                $("#du-eligibility-form-inside-div").html(response.html);
                $("#id_courses").select2({placeholder: "Select Courses"});
                 $("#id_institutes").select2({placeholder: "Select Colleges"});

              },
              error: function (response, jqXHR, textStatus, errorThrown)
              {
                 $(".du-loading").hide();
              }
          });

}


var sendMail = function(e)
{
   $(this).attr('disabled', true);
   DU.sendMail({"slug":$(this).data("slug")});
}

$(document).on('submit', '#du-eligibility-form', submitForm);
$(document).on('click', '#du-eligibility-back', backForm);
$(document).on('click', '.send-email', sendMail);



$(document).on('focus', '.form-input, .form-select', function(e)
{
   $(this).parents('.form-group').addClass('focused');
})

$(document).on('blur', '.form-input', function(e)
{
    var inputValue = $(this).val();
      if ( inputValue == "" ) 
      {
         $(this).removeClass('filled');
         $(this).parents('.form-group').removeClass('focused');
       } 
      else 
      {
         $(this).addClass('filled');
      }
})


$(document).on('blur', '#univ_id_email',function(e)
{
      var email = $(this);
      var value = email.val().toLowerCase();
      email.val(value.replace(/ +/g, ""));
});

$(document).on('focus', '#univ_id_email',function(e)
{
      $("#form-group-email").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('focus', '#univ_id_name',function(e)
{
      $("#form-group-name").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('focus', '#univ_id_phone',function(e)
{
      $("#form-group-phone").removeClass("error");
      $(this).next().remove("p");
});



$(document).on('change', '#id_courses',function(e)
{
      $("#form-group-courses").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('focus', '#id_category',function(e)
{
      $("#form-group-category").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('change', '#id_domicile',function(e)
{
      $("#form-group-domicile").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('focus', '#id_board',function(e)
{
      $("#form-group-board").removeClass("error");
      $(this).next().remove("p");
});
$(document).on('change', '#id_subject',function(e)
{
      $("#form-group-subject").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('focus', '#id_percentage',function(e)
{
      
      $("#form-group-percentage").addClass('focused');
      $("#form-group-percentage").removeClass("error");
      $(this).next().remove("p");
});

$(document).on('change', '.form-check-input',function(e)
{
      $("#form-group-gender").removeClass("error");
       $("#gender-div").next().remove("p");;
      
});


})(this);//end of global
/* DU script end*/