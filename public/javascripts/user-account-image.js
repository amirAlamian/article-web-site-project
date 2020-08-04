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

let counter2 = 0;
$(document).on("click", ".user-image", () => {

  if (widthCalculator(".navbar") <= 1000) {
    console.log("dsjjd");
    if (counter2 % 2 === 0) {
      $(".user-information").animate({ "height": "150px" }, 100, "linear")
    }
    if (counter2 % 2 === 1) {
      $(".user-information").animate({ "height": 0 }, 100, "linear")
    }
    counter2++
  }

  else {
    if (counter2 % 2 === 0) {
      $(".user-information").animate({ "width": "270px" }, 100, "linear")
    }
    if (counter2 % 2 === 1) {
      $(".user-information").animate({ "width": 0 }, 100, "linear")
    }
    counter2++
  }


})

$(".chooseFile-replace").click(()=>{
  $(".chooseFile").click();
})


$(".fa-cog").click(()=>{
  $("#setting-modal").modal("show");
})

$(".lang").click(()=>{
  if($(".lang-choose").attr("data-lang")==="FA"){
    $(".lang-choose").attr("data-lang","EN");
    console.log("EN");
    $.ajax({
      type:"POST",
      url:"/api/changeLang",
      data:{language:"EN"},
      success: response=>{
        console.log(response);
        if(response.status){
          window.location.reload()
        }
      },
      error: err=>{
        console.log(err);
      }
    })
   
  }
  else{
    $(".lang-choose").attr("data-lang","FA");
    console.log("FA");
     $.ajax({
      type:"POST",
      url:"/api/changeLang",
      data:{language:"FA"},
      success: response=>{
        console.log(response);
        if(response.status){
          window.location.reload()
        }
        
        
      },
      error: err=>{
        console.log(err);
      }
    })
  }
})
