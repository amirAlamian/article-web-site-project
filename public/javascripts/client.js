let userInfos = {
  firstName: "",
  lastName: "",
  userName: "",
  password: "",
  email: "",
  phoneNumber: "",
  gender: "",
  recapResponse: ""
}
let theme = true;
let flag = true;
let counter = 0;
let titles = ["firstName", "lastName", "userName", "password", "email", "phoneNumber", "gender", "recapResponse"];
let permission = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////password strength bar function (fills the bar)////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////


passBar = () => {
  let weekPassword = /^(?=.*\d)(?=.*[a-z])[0-9a-z]{7,36}$/;
  let normalPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,36}$/;
  let strongPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+=-])[0-9a-zA-Z!@#$%^&*()_+=-]{10,36}$/;
  let password = $(".input-box input[type='password'").val();

  if (counter <= 7) {
   
    $(".bar").css("background", "red")
  }

  else if (password.match(weekPassword)) {///week 
   

    $(".bar").css("background", "yellow")
  }

  else if (password.match(normalPassword)) {//normal
    
    $(".bar").css("background", "orange")
  }

  else if (password.match(strongPassword)) {///strong
    
    $(".bar").css("background", "green")
  }

  else if (password.length >= 11 && password.length <= 17) {

    $(".bar").css("background", "orange")
  }

  else if (password.length >= 17) {
  
    $(".bar").css("background", "green")
  }

}

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////recap function usage//////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

var onloadCallback = function () {

  grecaptcha.render("recap", {
    "sitekey": "6LcS6bAZAAAAABdT3hq5qvIo3rHoZVFxQKmvW4dB", "theme": $("#recap").attr("class"), "callback": response => {
    }
  })

};
////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////click on sign up button///////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

$(".signUpBTN").click(() => {

  for (let i = 0; i < 6; i++) {
    userInfos[titles[i]] = $(".input-box input").eq(i).val();
  }

  for (let j = 0; j < 2; j++) {
    if($(".radio").eq(j).hasClass("checked")){

      if(j===0){
        userInfos.gender="male"
      } 

      else{
        userInfos.gender="female"
      }
    }
  }
  
  userInfos.recapResponse = grecaptcha.getResponse();


  for (let j = 0; j < 6; j++) {//check if any of inputs is empty or not
    if (userInfos[titles[j]] === "") {
      $(".input-box-container").eq(j).css("border-color", "red");
      $("#alertModal").modal("show");
      $(".alert").addClass("text-danger").text("please fill all of the inputs");
    }
    else {
      $(".input-box-container").eq(j).css("border-color", "rgb(121,82,179)");
      permission++
    }
  }

  if (userInfos[titles[6]] === "") {
    $(".input-box-radio").css("border-color", "red");
    $("#alertModal").modal("show");
    $(".alert").addClass("text-danger").text("please fill all of the inputs.");
  }
  else {
    $(".input-box-radio").css("border-color", "rgb(121,82,179)");
    permission++;
  }

  if (userInfos.password.length < 8) {
    $("#alertModal").modal("show");
    $(".alert").addClass("text-danger").text("your password is too short. it must be at least 8 characters.");
  }
  else {
    permission++;
  }

  if (userInfos.recapResponse === "") {
    $("#alertModal").modal("show");
    $(".alert").addClass("text-danger").text("please do the Recaptcha to prove that you are a human.")
  }
  else {
    permission++;
  }

  if (permission === 9) {
    $(".alert").removeClass("text-danger").addClass("alert-light").text("please wait");
    $.ajax({// post to sign up
      type: "POST",
      url: "/api/signUp",
      data: userInfos,
      success: (response) => {
        if (response === "done") {
          $("#alertModal").modal("show");
          $(".alert").removeClass("text-danger").addClass("text-primary").html("you successfully signed up. click <a href='/api/signIn'>here</a> to sign in")
        }
        else {
          grecaptcha.reset()
          $("#alertModal").modal("show");
          $(".alert").addClass("text-danger").html(response);
          permission=0
        }

      },
      erorr: (err) => {
        console.log(err);
      }
    })
  }
  else {
    permission = 0;
  }


});

////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////inputs ontype event for password strength bar//////////
///////////////////////////////////////////////////////////////////////////////////////////////////

$(".input-box input[type='password'").keypress((e) => {
  if (flag) {
    $(".input-box-container").eq(3).append('<div class="passwordStrength"><small>password strength:</small></div>').css({ "border": "none" });

    $(".input-box input[type='password'").css("padding-bottom", 0)

    $("small").css("color", "rgb(129,129,129")

    $(".passwordStrength").css({ "width": "100%", "height": "6px" }).append('<div class="bar"></div>');

    $(".bar").css({ "width": "0%", "height": "2px" });
    flag = false;

  }

  let size = "";
  for (let i = 0; i < 3; i++) {
    size += $(".passwordStrength").css("width")[i];

  }
  size /= 36;

  if (counter < 36) {
    counter++;
    $(".bar").animate({ "width": "+=" + size + "px" }, 150, "linear");
  }

  passBar();





})
$(".input-box input[type='password'").keydown((e) => {

  if (e.keyCode === 8) {
    let size = "";
    for (let i = 0; i < 3; i++) {
      size += $(".passwordStrength").css("width")[i];

    }
    size /= 36;
    if (counter >= 0) {
      counter--;
      $(".bar").animate({ "width": "-=" + size + "px" }, 100, "linear");
    }
    passBar();

  }


})
///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// show password  icon /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(document).on("click", ".fa-eye", function () {
  $(this).removeClass("fa-eye").addClass("fa-eye-slash");
  $(".password-input").attr("type", "text")
})


$(document).on("click", ".fa-eye-slash", function () {
  $(this).removeClass("fa-eye-slash").addClass("fa-eye");
  $(".password-input").attr("type", "password")
})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// choose gender button click  /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(".radio").click(function () {

  $(".radio").css("background", "inherit").removeClass("checked");

  $(this).css("background", "rgb(121,82,179)").addClass("checked");
})