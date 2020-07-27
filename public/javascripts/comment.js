
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
        if (i >= n-2) {
          $(".comment-box").append(`<div class= 'comment-text d-flex align-items-flex-start'>  <div class="rounded-circle author-image-holder">
          <img src='/images/${response.message[i].senderImage}' class='rounded-circle author-image'>
          </div>
          <div class="comment-triangle-left"></div>
          <span class="comment-authorName"> &nbsp ${response.message[i].sender}&nbsp;:&nbsp;${response.message[i].text} </span> </div>`);
          continue
        }

        $(".comment-box").append(`<div class= 'comment-text  hide'>  <div class="rounded-circle author-image-holder">
        <img src='/images/${response.message[i].senderImage}' class='rounded-circle author-image'>
        </div>
        <div class="comment-triangle-left"></div>
        <span class="comment-authorName"> &nbsp ${response.message[i].sender}&nbsp;:&nbsp;${response.message[i].text} </span> </div>`)
      }
    }




  },

  erorr: (err) => {
    console.log(err);
  }
})




///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// get article author informations //////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$.ajax({
  type: "GET",
  url: `/api/getAuthorImage/${$(".author-image-holder").attr("data-article-author")}`,
  success: function (response) {
    console.log(response);
    if (response.status) {
      $(".author-image-holder").append(`<img src='/images/${response.message}' class='rounded-circle author-image'>`)
    }
    else {

    }

  },
  error: function (err) {
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
      if (response.status) {
        $(".comment-box").append(`<div class= 'comment-text d-flex align-items-flex-start '>  <div class="rounded-circle author-image-holder">
        <img src='/images/${response.message.senderImage}' class='rounded-circle author-image'>
        </div>
        <div class="comment-triangle-left"></div>
        <span class="comment-authorName"> &nbsp ${response.message.sender}&nbsp;:&nbsp;${response.message.text} </span> </div>`);
        $(".comment-input").val("")
      }


    },

    erorr: (err) => {
      console.log(err);
    }
  })


})
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// show more comment button ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(".comment-showMore").click(function () {
  if ($(this).hasClass("show-less")) {
    $(".comment-showMore").removeClass("show-less");
    $(".comment-box").animate({ "height": "200px" }, 400, "linear", function () {
      $(".hide-not").removeClass("d-flex align-items-flex-start hide-not").addClass("hide")
      $(".comment-box").css({ "overflow": "hidden", "display": "flex" });
      $(".comment-text").css("margin", "13px 0");
    })

  }
  else{
    $(this).addClass("show-less");
    $(".comment-box").animate({ "height": "400px" }, 400, "linear", function () {
      $(".hide").addClass("d-flex align-items-flex-start hide-not").removeClass("hide")
      $(".comment-box").css({ "overflow": "auto", "display": "block" });
      $(".comment-text").css("margin", "30px 0");
    })
  }
 
})