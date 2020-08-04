let allCookies = document.cookie;
let lang = allCookies.split(";")
let x = lang[0].split("=");

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
let user;

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
    if ($(".radio").eq(j).hasClass("checked")) {

      if (j === 0) {
        userInfos.gender = "male"
      }

      else {
        userInfos.gender = "female"
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
          if(x[1]==="FA"){
            $(".alert").removeClass("text-danger").addClass("text-primary").html("شما با موفقیت ثبت نام کردید. در عرض چند ثانیه به صفحه ورود منتقل می شوید.")
          }
          else{
            $(".alert").removeClass("text-danger").addClass("text-primary").html("you successfully signed up. you will redirect to sign in page in a few seconds")
          }
      
        }
        else {
          grecaptcha.reset()
          $("#alertModal").modal("show");
          $(".alert").addClass("text-danger").html(response);
          permission = 0
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
//////////////////////////// inputs ontype event for password strength bar ////////////////////////
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
//////////////////////////////////// choose gender button click  /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(".radio").click(function () {

  $(".radio").css("background", "inherit").removeClass("checked");

  $(this).css("background", "rgb(121,82,179)").addClass("checked");
})

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// send email button //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
let flag2 = 0;
$(".sendEmailBTN").click(() => {

  let email = "";

  let userName = $("input").eq(0).val();
  if (userName != "") {
    $.ajax({// post to send email
      type: "POST",
      url: "/api/sendEmail",
      data: { userName },
      async: false,
      success: (response) => {
        console.log(response);
        if (response.status) {
          user = response.message
          if (flag2 === 0) {
            $(".password-recovery-holder").animate({ "opacity": 0 }, 500, "linear", function () {

              let emailService = response.message.email.split('@');
              let emailSplited = emailService[0].split("");

              $(this).css("display", "none");
              if(x[1]==="FA"){
                $(".input-box").append(`<div class="w-100 VerificationCode-holder ">
              
                <div class="text-secondary text-center" dir="rtl"> <br> یک ایمیل به آدرس${emailSplited.map((letters, index) => { if (index <= 5) { email += letters; } else { email += '*' } if (index === emailSplited.length - 1) { return (email) } })[emailSplited.length - 1]} @${emailService[1]}    فرستاده شد. لطفا ایمیل مورد نظر را بررسی کنید</div>
                <div class="input-box-container mb-5 text-right"> <input type="text" dir="rtl" placeholder=" کد تایید" name="code"  class="VerificationCode"></div>
                <button class="signInBTN sendVeriCodeBTN d-block m-auto">ارسال</button>
                </div>
                `)
              }
              else{
                $(".input-box").append(`<div class="w-100 VerificationCode-holder ">
              
                <div class="text-secondary text-center">We have sent an email to<br>  ${emailSplited.map((letters, index) => { if (index <= 5) { email += letters; } else { email += '*' } if (index === emailSplited.length - 1) { return (email) } })[emailSplited.length - 1]} @${emailService[1]}. Please check Your email.</div>
                <div class="input-box-container mb-5"> <input type="text" placeholder="Verification code" name="code"  class="VerificationCode"></div>
                <button class="signInBTN sendVeriCodeBTN d-block m-auto">send</button>
                </div>
                `)
              }
             
              $(".VerificationCode-holder").css("display", "block");
              $(".VerificationCode-holder").animate({ "opacity": 1 }, 500, "linear")
            })
          }
          flag2++
        }

      },
      erorr: (err) => {
        console.log(err);
      }
    })
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// send code button ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", ".sendVeriCodeBTN", () => {
  let VerificationCode = $(".VerificationCode").val();
  if (VerificationCode != "") {
    $.ajax({// post to send email
      type: "POST",
      url: `/api/verifyCode`,
      data: { VerificationCode },
      success: (response) => {
        console.log(response);
        if (response.status) {
          if(flag2===1){
            $(".VerificationCode-holder").animate({ "opacity": 0 }, 500, "linear", function () {

              $(this).css("display", "none");
              if(x[1]==="FA"){
                $(".input-box").append(`<div class="w-100 changePassword-holder ">
              
                <div class="text-secondary text-center">لطفا تمام ورودی هارا پر کنید و سپس دکمه ارسال را بزنید.</div>
                <div class="input-box-container text-right"><div class="input-box-password "><input type="password" placeholder="رمز عبور جدید"  dir="rtl"  class="password-input" name="password" ><i class="fa fa-eye" aria-hidden="true"></i></div> </div>
                <div class="input-box-container text-right"><div class="input-box-password "><input type="password" placeholder="تکرار رمز عبور" dir="rtl"   class="password-input" name="password" ></div> </div>
                <button class="signInBTN changePasswordBTN d-block m-auto">ارسال</button>
                </div>
                `)
              }
              else{
                $(".input-box").append(`<div class="w-100 changePassword-holder ">
              
                <div class="text-secondary text-center">Please fill all inputs and hit send button.</div>
                <div class="input-box-container"><div class="input-box-password "<i class="fa fa-eye" aria-hidden="true"></i><input type="password" placeholder="New password"   class="password-input" name="password" ></div> </div>
                <div class="input-box-container"><div class="input-box-password "><input type="password" placeholder="re-type password"   class="password-input" name="password" ></div> </div>
                <button class="signInBTN changePasswordBTN d-block m-auto">send</button>
                </div>
                `)
              }
            
              $(".changePassword-holder").css("display", "block");
              $(".changePassword-holder").animate({ "opacity": 1 }, 500, "linear")
            })
            flag2++;
          }
    
        }
      },
      erorr: (err) => {
        console.log(err);
      }
    })
  }
})

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// send code button ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
$(document).on("click", ".changePasswordBTN", () => {
  if ($(".password-input").eq(0).val() === $(".password-input").eq(1).val() && $(".password-input").eq(0).val() != "") {
    let password = $(".password-input").eq(0).val();
    $.ajax({// post to send email
      type: "POST",
      url: `/api/changePassword/${user._id}`,
      data: { password },
      success: (response) => {
        console.log(response);
        if (response.status) {
          if(flag2===2){
            $(".changePassword-holder").animate({ "opacity": 0 }, 500, "linear", function () {

              $(this).css("display", "none");
              if(x[1]==="FA"){
                $(".input-box").append(`<div class="w-100 success-change ">
             
                <h6 class="text-primary text-center"> .رمز عبور شما با موفقیت تغییر پیدا کرد. تا چند لحظه دیگر به صفحه ورود هدایت می شوید</h6>
              </div>
              `)
              }
              else{
                $(".input-box").append(`<div class="w-100 success-change ">
             
                <h6 class="text-primary text-center"> your password has been changed successfully. you will redirect to the sign in page in a few moments</h6>
              </div>
              `)
              }
            
              $(".success-change").css("display", "block");
              $(".success-change").animate({ "opacity": 1 }, 500, "linear");
              setTimeout(function ()  { window.location.href="/api/signIn" }, 5000);
            })
           
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
