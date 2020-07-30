
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// details article button //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(".btn-details").click(function () {

  if($(this).hasClass("btn-back")){
    for (let i = 0; i < 18; i++) {
  
      if ($(this).attr("data-number") == i) {
  
        $(this).text("Back").removeClass("btn-back");
  
        $(".inner").eq(i).css({ "transform": "rotateY(0deg)" })

        $(".front").eq(i).css("opacity","1")

        $(".back").eq(i).animate({ "opacity": "0" }, 200, "linear", function () {
          
        

          $(".back").eq(i).css("display", "none");
  
          $(".front").eq(i).css("display", "block");
  
        })
      }
    }
  
  }
  else{
    
    for (let i = 0; i < 18; i++) {

      if ($(this).attr("data-number") == i) {
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
        
        $(this).text("Details").addClass("btn-back")
  
        $(".inner").eq(i).css({ "transform": "rotateY(180deg)" })
  
        $(".back").eq(i).css("opacity","1");

        $(".front").eq(i).animate({ "opacity": "0" }, 200, "linear", function () {
  
          $(".front").eq(i).css("display", "none");
  
          $(".back").eq(i).css("display", "block");
        })
      }
    }
  
  }


})


///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// show more article button ////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(".show-more").click(function(){
  if($(this).attr("data-status")==="most-viewed"){
    if($(this).hasClass("back-btn")){
      $(this).text("Show More").removeClass("back-btn");
      $(".mostViewed").removeClass("back").animate({"height":"500px"},500,"linear",function(){
        $(".mostViewed .hide-not").addClass("hide").removeClass("hide-not");
      })
    }
    else{
      console.log($(".mostViewed").css("width"));
      // if( $(".mostViewed").css("width"))
      $(this).text("Show Less").addClass("back-btn");
      $(".mostViewed").animate({"height":"1400px"},500,"linear",function(){
        $(".mostViewed .hide").addClass("hide-not").removeClass("hide")
      })
    }
   
  
  }
  else{
    if($(this).hasClass("back-btn")){
      $(this).text("Show More").removeClass("back-btn");
      $(".newest").animate({"height":"500px"},500,"linear",function(){
        $(".newest .hide-not").addClass("hide").removeClass("hide-not");
      })
    }
    else{
      $(this).text("Show Less").addClass("back-btn");
      $(".newest").animate({"height":"1400px"},500,"linear",function(){
        $(".newest .hide").removeClass("hide").addClass("hide-not")
      })
    }
    
  
  }
})