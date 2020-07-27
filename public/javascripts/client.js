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
    console.log("red");
    $(".bar").css("background", "red")
  }

  else if (password.match(weekPassword)) {///week 
    console.log("yellow");

    $(".bar").css("background", "yellow")
  }

  else if (password.match(normalPassword)) {//normal
    console.log("or1");
    $(".bar").css("background", "orange")
  }

  else if (password.match(strongPassword)) {///strong
    console.log("gr1");
    $(".bar").css("background", "green")
  }

  else if (password.length >= 11 && password.length <= 17) {
    console.log("or2");
    $(".bar").css("background", "orange")
  }

  else if (password.length >= 17) {
    console.log("gr2");
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

  userInfos.gender = $("input[name='gender']:checked").val();
  userInfos.recapResponse = grecaptcha.getResponse();



  for (let j = 0; j < 6; j++) {//check if any of inputs is empty or not
    if (userInfos[titles[j]] === "") {
      $(".input-box-container").eq(j).css("border-color", "red");
      $(".alert").removeClass("alert-light").addClass("alert-danger").text("please fill all of the inputs");
    }
    else {
      $(".input-box-container").eq(j).css("border-color", "rgb(121,82,179)");
      permission++
    }
  }

  if (userInfos[titles[6]] === undefined) {
    $(".input-box-radio").css("border-color", "red");
    $(".alert").removeClass("alert-light").addClass("alert-danger").text("please fill all of the inputs.");
  }
  else {
    $(".input-box-radio").css("border-color", "rgb(121,82,179)");
    permission++;
  }

  if (userInfos.password.length < 8) {
    $(".alert").removeClass("alert-light").addClass("alert-danger").text("your password is too short. it must be at least 8 characters.");
  }
  else {
    permission++;
  }

  if (userInfos.recapResponse === "") {
    $(".alert").removeClass("alert-light").addClass("alert-danger").text("please do the Recaptcha to prove that you are a human.")
  }
  else {
    permission++;
  }

  if (permission === 9) {
    $(".alert").removeClass("alert-danger").addClass("alert-light").text("please wait")
    $.ajax({// post to sign up
      type: "POST",
      url: "/api/signUp",
      data: userInfos,
      success: (response) => {
        console.log(response.status);

        if (response === "done") {
          $(".alert").removeClass("alert-light").addClass("alert-primary").html("you successfully signed up. click <a href='/api/signIn'>here</a> to sign in")
        }
        else {
          $(".alert").removeClass("alert-light").addClass("alert-danger").html(response)
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
$(document).on("click",".fa-eye",function(){
  $(this).removeClass("fa-eye").addClass("fa-eye-slash");
  $(".password-input").attr("type","text")
})


$(document).on("click",".fa-eye-slash",function(){
  $(this).removeClass("fa-eye-slash").addClass("fa-eye");
  $(".password-input").attr("type","password")
})

