
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////// initial request to get article and comments ///////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(".passage-holder").append($("#passage-holder").attr("data-article"))
$("#passage-holder").remove()




$.ajax({//get comments

  type: "GET",
  url: `/api/dashboard/article/getComments/${$(".passage").attr("data-article-id")}`,
  success: (response) => {
    console.log(response);
    if (response.status) {
      for (let i = 0, n = response.message.length; i < n; i++) {
        $(".comment").append(`<div class= 'comment-text'><span class='comment-sender'>${response.message[i].sender}:</span> ${response.message[i].text}</div>`)
      }

    }

  },

  erorr: (err) => {
    console.log(err);
  }
})




///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// send comment button click ///////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


$(".fa-paper-plane").click(() => {

  let comment = $(".comment-input").val()

  $.ajax({//sending comment

    type: "POST",
    url: `/api/dashboard/article/sendComment/${$(".passage").attr("data-article-id")}`,
    data: { comment },
    success: (response) => {
      console.log(response);
      if(response.status){
        $(".comment").append(`<div class= 'comment-text'><span class='comment-sender'>${response.message.sender}:</span> ${response.message.text}</div>`);
        $(".comment-input").val("")
      }


    },

    erorr: (err) => {
      console.log(err);
    }
  })


})