!function(){var a=[]
$(document).on("click",".attempt-btn",function(){var t
IsAuthenticated&&(i(),t=$(this).data("set-number"),(t=$(`button.exam-question-tab[exam-question-tab="${"exam-question-tab"+t}"]`)).trigger("click"),$("html, body").animate({scrollTop:t.offset().top},500))}),$(document).on("click",".exam-question-tab",async function(){var t,a,e
IsAuthenticated&&(i(),a=$(this).data("set-number"),t=$(this).data("topic-id"),2<a&&(t=t,a=a,await!(0<(e=$("#exam-question-tab"+a)).length&&""!==e[0].innerHTML.trim()||(t=await(await fetch(`/api/news/board-questions/${t}/`+a)).json(),e.html(t.html),window.MathJax&&MathJax.typesetPromise([e[0]]).catch(function(t){console.error("MathJax typeset failed:",t)})))),$(".exam-question-tab").removeClass("active"),$(this).addClass("active"),$(".content-block-question").removeClass("active"),a=$(this).attr("exam-question-tab"),$("#"+a).addClass("active"))})
let n=async t=>await(await fetch("/api/news/board-answer-explanation/"+t,{method:"POST",headers:{"Content-Type":"application/json"}})).json(),e=($(document).on("click",".answer-explain",async function(){var t,a
IsAuthenticated&&(i(),a=$(this).data("answer-id"),0<(t=$("#explanation"+a)).length&&""!==t[0].innerHTML.trim()||(a=await n(a),t.append(a.explanation_html),window.MathJax&&MathJax.typesetPromise([t[0]]).catch(function(t){console.error("MathJax typeset failed:",t)})))}),t=>{var a=t.attr("id")
let e=a.split("_")[1]
var t=t.data("option"),n=$("#answer"+e).data("answer"),a=$(`label[for="${a}"]`),i=a.find(".ques-left")
n.includes(t)?(a.addClass("ques-correct"),i.addClass("ques-correct")):(a.addClass("ques-inCorrect"),i.addClass("ques-inCorrect"),n.forEach(t=>{var t=`question_${e}_`+t,t=$(`label[for="${t}"]`),a=t.find(".ques-left")
t.addClass("ques-correct"),a.addClass("ques-correct")}))}),i=()=>{a.length&&(a.forEach(t=>{e(t)}),a=[])}
$(document).on("click",'.exam-question-check-block input[type="radio"]',async function(){var t=$(this).attr("id").split("_")[1]
IsAuthenticated?(e($(this)),$("#answer"+t).hide()):a.push($(this)),$(`input[name="question_${t}"]`).prop("disabled",!0)}),$(document).on("click",".view-answer",async function(){if(1==$(this).data("que-index")||IsAuthenticated){let e=$(this).data("qno")
var t=$(this).data("answer-id")
if("MCQ"==$(this).data("question-type"))i(),$(this).data("answer").forEach(t=>{var t=`question_${e}_`+t,t=$(`label[for="${t}"]`),a=t.find(".ques-left")
t.addClass("ques-correct"),a.addClass("ques-correct")})
else{var a=$("#answertext"+t)
if(0<a.length&&""!==a[0].innerHTML.trim())return
t=await n(t)
a.append(t.answer_html),window.MathJax&&MathJax.typesetPromise([a[0]]).catch(function(t){console.error("MathJax typeset failed:",t)})}$(this).hide()}})
$(document).ready(function(){(()=>{var a=$(".exam-question-tab-block"),e=a.data("total-sets"),n=a.data("topic-id"),i=a.data("content_type"),s=a.data("button_id"),o=a.data("cta_id")
for(let t=1;t<=e;t++){var c=`
            <button 
                class="exam-question-tab ${1===t?"active":""} apply_now_det_cd gtm-lead-click" 
                exam-question-tab="exam-question-tab${t}" 
                data-set-number="${t}" 
                data-topic-id="${n}"
                data-content_type="${i}"
                data-app_label="exams"
                data-object_id="${n}"news
                data-button_id="${s}"
                data-cta_id="${o}"
            >
                Practice Test - ${t}
            </button>`
a.append(c)}})()})}.call(this)
