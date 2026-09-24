


    $('.qna-main').on('click', '.thumbs-ques i', function () {
        if (!IsAuthenticated) {
            // $('#myModal').modal('show');
        } else {
            $.ajax({
                type: "POST",
                url: "/scripts/question-vote/",
                data: {
                    'question_id': $(this).data('question-id'),
                    'vote_type': $(this).data('vote-type')
                }
            }).done(function (response) {
                if (response['error']) {
                    $("#error p").html(response['message']);
                    $("#error p").fadeIn(700).delay(6000).fadeOut(700);
                } else {
                    $("#notification p").html(response['message']);
                    $("#notification p").fadeIn(700).delay(6000).fadeOut(700);
                }
            });
        }
    });

    

    $('.qna-main-answer-vote').on('click', function () {
    if (!IsAuthenticated) {
            reloadOnLogin = true;
            qna_login = true;
            get_login_modal(null,qna_login);
            return false;
        } else {
            $.ajax({
                type: "POST",
                url: "/scripts/answer-vote/",
                data: {
                    'answer_id': $(this).attr('class').split(/\s+/)[1],
                    'vote_type': $(this).data('vote-type')
                }
            }).done(function (response) {
                // debugger
                if (response['error']) {
                    $("#error p").html(response['message']);
                    $("#error p").fadeIn(700).delay(6000).fadeOut(700);
                } else {
                    $("#notification p").html(response['message']);
                    $("#notification p").fadeIn(700).delay(6000).fadeOut(700);
                }
                window.location.reload()
            });

    }
});

    $('.reply').on('click', function(){ 
        $(this).parent().parent().parent().parent().find(
            '.qaForm').eq(0).css({'display': 'flex'}) 
    });



    $('#submit_answer').on('click', function () {
        if (!IsAuthenticated) {
            reloadOnLogin = true;
            qna_login = true;
            get_login_modal(null, qna_login);
            // $('#myModal').modal('show');
        } else {
            var answer = $('#qna-answer').val();
            if (answer) {
                $.ajax({
                    type: "POST",
                    url: "/scripts/add-answer/",
                    data: {
                        'q_id': $('#q-id').html(),
                        'answer_text': $('#qna-answer').val()
                    },
                    success: function (response) {
                        window.location.reload()
                        // window.location.href = response['redirect_url'];
                    }
                })
            }
        }

    });

    $('.submit_answer_comment').on('click', function () {

            var answer_id = $(this).attr('class').split(/\s+/)[3]
            // var answer = $('#comm-'+answer_id).val();
            var reply_answer_id = $(this).attr('class').split(/\s+/)[4]
            var answer = $(this).parent().parent().find('textarea').eq(0).val()
            if (answer) {
                $.ajax({
                    type: "POST",
                    url: "/scripts/add-answer-comment/",
                    data: {
                        'q_id': $('#q-id').html(),
                        'answer_text': answer,
                        'a_id': answer_id,
                        'rep_id': reply_answer_id
                    },
                    success: function (response) {
                        window.location.reload()
                        // window.location.href = response['redirect_url'];
                    },
                        error: function(response){
                        reloadOnLogin = false;
                        qna_login = true;
                        get_login_modal(null,qna_login);
                        }
                })
            }
//        }
    });


// }

document.addEventListener('paste', (event) => {
    var target = event.target;

    // Check if the event occurred in an element with the class "review_description"
    if (target.classList.contains('disablePaste')) {
        event.preventDefault(); // Prevent pasting content into the element
    }
});
