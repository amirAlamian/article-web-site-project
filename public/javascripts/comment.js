let allCookies = document.cookie;
let lang = allCookies.split(";")
let x = lang[0].split("=");

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

      for (let i = 0, n = response.message.length; i < n - 1; i++) {

        if (response.message[n - 1] === "himself") {

          if (i >= n - 3) {
            $(".comment-box").append(`<div class= 'comment-text d-flex align-items-flex-start  comment-show ${i}'>  <div class="rounded-circle author-image-holder">
            <img src='/images/${response.message[i].senderImage}' class='rounded-circle author-image'>
            </div>
            <div class="comment-triangle-left"></div>
            <span class="comment-authorName"> &nbsp ${response.message[i].sender}&nbsp;:&nbsp;${response.message[i].text} </span><div class="comment-trash"><i class="fa fa-trash ${i}" data-id="${response.message[i]._id}"></i></div> </div>`);
            continue
          }

          $(".comment-box").append(`<div class= 'comment-text  hide ${i}'>  <div class="rounded-circle author-image-holder">
          <img src='/images/${response.message[i].senderImage}' class='rounded-circle author-image'>
          </div>
          <div class="comment-triangle-left"></div>
          <span class="comment-authorName"> &nbsp ${response.message[i].sender}&nbsp;:&nbsp;${response.message[i].text} </span><div class="comment-trash"><i class="fa fa-trash ${i}" data-id="${response.message[i]._id}"></i></div> </div>`)
        }

        else {

          if (i >= n - 3) {
            $(".comment-box").append(`<div class= 'comment-text d-flex align-items-flex-start  comment-show ${i}'>  <div class="rounded-circle author-image-holder">
              <img src='/images/${response.message[i].senderImage}' class='rounded-circle author-image'>
              </div>
              <div class="comment-triangle-left"></div>
              <span class="comment-authorName"> &nbsp ${response.message[i].sender}&nbsp;:&nbsp;${response.message[i].text} </span> </div>`);
            continue
          }

          $(".comment-box").append(`<div class= 'comment-text  hide ${i}'>  <div class="rounded-circle author-image-holder">
            <img src='/images/${response.message[i].senderImage}' class='rounded-circle author-image'>
            </div>
            <div class="comment-triangle-left"></div>
            <span class="comment-authorName"> &nbsp ${response.message[i].sender}&nbsp;:&nbsp;${response.message[i].text} </span> </div>`)
        }
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
  if (comment !== "") {
    $.ajax({//sending comment

      type: "POST",
      url: `/api/dashboard/article/sendComment/${$(".passage").attr("data-article-id")}`,
      data: { comment },
      success: (response) => {
        if (response.status) {

          if ($(".hide").length != 0) {

            $(".comment-show").eq(0).addClass("hide").removeClass("d-flex align-items-flex-start comment-show")
          }
          let n = $(".comment-text").length
          if (response.message[1] === "himself") {
            $(".comment-box").append(`<div class= 'comment-text d-flex align-items-flex-start comment-show ${n}'>  <div class="rounded-circle author-image-holder">
            <img src='/images/${response.message[0].senderImage}' class='rounded-circle author-image'>
            </div>
            <div class="comment-triangle-left"></div>
            <span class="comment-authorName"> &nbsp ${response.message[0].sender}&nbsp;:&nbsp;${response.message[0].text} </span><div class="comment-trash"><i class="fa fa-trash ${$(".comment-text").length}" data-id="${response.message[0]._id}" ></i></div> </div>`);
            $(".comment-input").val("")
          }
          else {
            $(".comment-box").append(`<div class= 'comment-text d-flex align-items-flex-start  comment-show '>  <div class="rounded-circle author-image-holder">
            <img src='/images/${response.message[0].senderImage}' class='rounded-circle author-image'>
            </div>
            <div class="comment-triangle-left"></div>
            <span class="comment-authorName"> &nbsp ${response.message[0].sender}&nbsp;:&nbsp;${response.message[0].text} </span> </div>`);
            $(".comment-input").val("")
          }


        }


      },

      erorr: (err) => {
        console.log(err);
      }
    })
  }



})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// show more comment button ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(".comment-showMore").click(function () {

  if ($(this).hasClass("show-less")) {
    (x[1] === "EN") ? $(".comment-showMore").removeClass("show-less").text("Show more") : $(".comment-showMore").removeClass("show-less").text("نمایش بیشتر");
    $(".comment-box").animate({ "height": "200px" }, 400, "linear", function () {
      $(".hide-not").removeClass("d-flex align-items-flex-start hide-not").addClass("hide")
      $(".comment-box").css({ "overflow": "hidden", "display": "flex" });
      $(".comment-text").css("margin", "13px 0");
    })

  }
  else {
    (x[1] === "EN") ? $(this).addClass("show-less").text("Show less") : $(this).addClass("show-less").text("نمایش کمتر");

    $(".comment-box").animate({ "height": "400px" }, 400, "linear", function () {
      $(".hide").addClass("d-flex align-items-flex-start hide-not").removeClass("hide")
      $(".comment-box").css({ "overflow": "auto", "display": "block" });
      $(".comment-text").css("margin", "30px 0");
    })
  }

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// delete comment button ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", ".fa-trash", function () {
  let x = $(this);
  console.log($(this));
  $.ajax({
    type: "DELETE",
    url: `/api/dashboard/article/removeComment/${$(this).attr("data-id")}`,
    success: function (response) {
  
      if (response.status) {

        for (let i = 0, n = $(".comment-text").length; i < n; i++) {

          if (x.hasClass(i)) {
            for (let j = 0, n = $(".comment-text").length; j < n; j++) {
              if ($(".comment-text").eq(j).hasClass(i)) {
                $(".comment-text").eq(j).remove();
                $(".comment-text").eq(j - 2).removeClass("hide").addClass("d-flex align-items-flex-start hide-not");
              }
            }
          }


        }

      }

    },
    error: function (err) {
      console.log(err);
    }
  })
})