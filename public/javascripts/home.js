let allCookies = document.cookie;
let lang = allCookies.split(";")
let x = lang[0].split("=");


///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// details article button //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(".btn-details").click(function () {

  if ($(this).hasClass("btn-back")) {
    for (let i = 0; i < 18; i++) {

      if ($(this).attr("data-number") == i) {
      
        (x[1] === "EN") ? $(this).text("Details").removeClass("btn-back") :$(this).text("جزئیات").removeClass("btn-back");

        $(".inner").eq(i).css({ "transform": "rotateY(0deg)" })

        $(".front").eq(i).css("opacity", "1")

        $(".back").eq(i).animate({ "opacity": "0" }, 200, "linear", function () {



          $(".back").eq(i).css("display", "none");

          $(".front").eq(i).css("display", "block");

        })
      }
    }

  }
  else {

    for (let i = 0; i < 18; i++) {

      if ($(this).attr("data-number") == i) {

        (x[1]==="EN") ? $(this).text("Back").addClass("btn-back"):$(this).text("بازگشت").addClass("btn-back")
        

        $(".inner").eq(i).css({ "transform": "rotateY(180deg)" })

        $(".back").eq(i).css("opacity", "1");

        $(".front").eq(i).animate({ "opacity": "0" }, 200, "linear", function () {

          $(".front").eq(i).css("display", "none");

          $(".back").eq(i).css("display", "block");
        })
        $.ajax({
          type: "GET",
          url: `/api/getAuthorImage/${$(this).attr("data-article-author")}`,
          success: function (response) {
            if (response.status) {
              $(".author-image-holder").eq(i).append(`<img src='/images/${response.message}' class='rounded-circle author-image'>`)
            }
            else {

            }

          },
          error: function (err) {
            console.log(err);
          }
        })
        
       
      }
    }

  }


})


///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// show more article button ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
function widthCalculator(class_name) {
  let stringWidth = $(class_name).css("width").split("");

  let width = "";

  for (let i = 0, n = stringWidth.length; i < n; i++) {

    if (stringWidth[i] === "p") break;

    width += stringWidth[i];
  }

  width = +width
  return (width)
}
$(".show-more").click(function () {

  let width = widthCalculator(".mostViewed");

  if (width <= 800) {

    if ($(this).attr("data-status") === "most-viewed") {

      if ($(this).hasClass("back-btn")) {

        (x[1] === "EN") ? $(this).text("Show More").removeClass("back-btn") : $(this).text("بیشتر").removeClass("back-btn");

        $(".mostViewed").removeClass("back").animate({ "height": "1450px" }, 500, "linear", function () {
          $(".mostViewed .hide-not").addClass("hide").removeClass("hide-not");
        })
      }
      else {

        (x[1] === "EN") ? $(this).text("Show Less").addClass("back-btn") : $(this).text("کمتر").addClass("back-btn");
        $(".mostViewed").animate({ "height": "3000px" }, 500, "linear", function () {
          $(".mostViewed .hide").addClass("hide-not").removeClass("hide")
        })

      }


    }
    else {
      if ($(this).hasClass("back-btn")) {

        (x[1] === "EN") ? $(this).text("Show More").removeClass("back-btn") : $(this).text("ّبیشتر").removeClass("back-btn");
        $(".newest").animate({ "height": "1500px" }, 500, "linear", function () {
          $(".newest .hide-not").addClass("hide").removeClass("hide-not");
        })
      }

      else {

        (x[1] === "EN") ? $(this).text("Show Less").addClass("back-btn") : $(this).text("کمتر").addClass("back-btn");
        $(".newest").animate({ "height": "2400px" }, 500, "linear", function () {
          $(".newest .hide").removeClass("hide").addClass("hide-not")
        })
      }


    }

  }

  else {

    if ($(this).attr("data-status") === "most-viewed") {

      if ($(this).hasClass("back-btn")) {

        (x[1] === "EN") ? $(this).text("Show More").removeClass("back-btn") : $(this).text("بیشتر").removeClass("back-btn");
        
        $(".mostViewed").removeClass("back").animate({ "height": "550px" }, 500, "linear", function () {
          $(".mostViewed .hide-not").addClass("hide").removeClass("hide-not");
        })
      }
      else {
        
        (x[1] === "EN") ? $(this).text("Show Less").addClass("back-btn") :$(this).text("کمتر").addClass("back-btn");

        
        $(".mostViewed").animate({ "height": "1450px" }, 500, "linear", function () {
          $(".mostViewed .hide").addClass("hide-not").removeClass("hide")
        })

      }


    }
    else {
      if ($(this).hasClass("back-btn")) {

        (x[1] === "EN") ? $(this).text("Show More").removeClass("back-btn") : $(this).text("بیشتر").removeClass("back-btn");
        
        $(".newest").animate({ "height": "550px" }, 500, "linear", function () {
          $(".newest .hide-not").addClass("hide").removeClass("hide-not");
        })
      }
      else {

        (x[1] === "EN") ? $(this).text("Show Less").addClass("back-btn") :$(this).text("کمتر").addClass("back-btn");
        $(".newest").animate({ "height": "1450px" }, 500, "linear", function () {
          $(".newest .hide").removeClass("hide").addClass("hide-not")
        })
      }


    }
  }

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// show more article button ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$("#search-btn").click(function (e) {
  
  let search = $("#search-input").val();
  if(search===""){
    e.preventDefault()
  }
 

})

