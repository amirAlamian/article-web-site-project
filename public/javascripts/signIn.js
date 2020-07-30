

allCookies = document.cookie;
lang = allCookies.split(";")
x = lang[0].split("=")

let counter = 0;

class userInfo {
  constructor(firstName, lastName, password, email, phoneNumber) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.password = password
  }
}
let permissin = true;
let i;

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////add article button////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

function AddCard(response ,lang) {
  console.log(lang[4]);
  $(".article-not-done").append(`<div class=" card-holder"><div class="card" style="width: 18rem;" data-published="${response.message.published}">
  <div class="holder">
    <div class="inner">
      <div class="front">
        <img class="card-img-top article-image" src="/images/articleImages/${response.message.image}" alt="${response.message.title}">
        <h5 class="card-title"> ${response.message.title}</h5>

      </div>
      <div class="back text-left">
        <h6 class="description-title">Author:</h6>
        <div class="d-flex align-items-center">
          <div class="rounded-circle author-image-holder">

          </div>
          <div id="triangle-left"></div>
          <span class="card-authorName"> &nbsp ${response.message.author} &nbsp </span>
        </div>

        <br>
        <h6 class="description-title">Description:</h6>
        <p class="card-text">&nbsp&nbsp ${response.message.description}</p>
        <h6 class="description-title">${lang[0]}</h6>
        <p class="card-text">&nbsp&nbsp ${response.message.view.number}></p>
      </div>
    </div>
  </div>
  <div class="card-body">
    <hr>
    <p class="card-text ${lang[4]}"> ${lang[0]} ${response.message.view.number}</p>
    <hr>
   
    <a href="/api/article/read/${response.message._id}" class="btn btn-primary">${lang[1]}</a>
    
    <a href="/api/article/edit/${response.message._id}" class="btn btn-warning">${lang[2]}</a>
    <button class="btn btn-danger btn-remove " data-toggle="modal" data-target="#removeModal" data-whatever="@mdo"
      data-article-id="${response.message._id}" data-article-title="${response.message.title}">${lang[3]}</button>
    


  </div>
</div>
</div>`)
}

$(".create-btn").click(() => {

  articleInfo.title = $("#passage-name").val();
  articleInfo.description = $("#passage-text").val();

  if (!articleInfo.title || !articleInfo.description) {

    $(".alert").removeClass("hide").text("please fill all of the inputs");
    permissin = false;
  }
  else {
    $(".alert").addClass("hide")
    permissin = true;
  }


  if (permissin) {
    $.ajax({// post to add new article

      type: "POST",
      url: "/api/dashboard/article/add",
      data: articleInfo,
      success: response => {
        console.log(response);
        if (response.status) {
          if(x[1]==="FA"){
            $(".alert").eq(0).removeClass("alert-danger hide").addClass("alert-primary text-right").html(`مقاله مورد نظر ایجاد شد. برای تکمیل آن <a href='/api/article/add/${response._id}'>اینجا</a> را کلیک کنید`);
          }
          else{
            $(".alert").eq(0).removeClass("alert-danger hide").addClass("alert-primary").html(`Article has been successfully created.to compelete your article click <a href='/api/article/add/${response._id}'>here</a>`);
          }
         
          let counter = 0;
          for (let i = 0, n = $(".card").length; i < n; i++) {
            console.log(i);
            if ($(".card").eq(i).attr("data-published") === "false") {
              counter++;
            }
          }
          console.log(counter);
          if (counter < 3) {
            if (counter === 0) {
              $(".unpublished-one").remove()
            }
            if (x[1] === "FA") {
              AddCard(response ,["بازدید:","خواندن","تغییر","حذف کردن","text-right"])
            }

            else {
              AddCard(response,["View:","Read","Edit","Remove" ,"text-left"])
            }

          }

          $("#passage-name").val("");
          $("#passage-text").val("")
        }
        else {
          $(".alert").removeClass("hide").html(response.message)
        }

      },

      erorr: err => {

        console.log(err);
      }
    })
  }

})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// user account change picture button //////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


$(".change-information").click(function () {
  $('input[type=text]').eq($(this).attr("data-number")).attr("disabled", false);
  $(".save-information-BTN").removeClass("hide")
})

$(".chooseFile").click(() => {
  $(".save-information-BTN").removeClass("hide")
})

$(".save-information-BTN").click(() => {


  if (($('input[type=file]').val())) {

    let file = new FormData();
    file.append('avatar', $('input[type=file]')[0].files[0])

    $.ajax({
      type: 'POST',
      url: "/api/dashboard/uploadAvatar",
      data: file,
      processData: false,
      contentType: false,

      success: response => {
        console.log(response);
        if (response.status) {
          $(".alert").removeClass("hide").addClass("text-primary").text("your account has been successfully updated")
        }
        else {
          $(".alert").removeClass("hide").addClass("text-danger").text(response.message)
        }

      },

      error: error => {
        console.log(error);
      }
    })
  }




  let infos = [];
  for (let i = 0; i < 5; i++) {
    infos.push($('input[type=text]').eq(i).val().trim());
  }

  let data = new userInfo(infos[0], infos[1], infos[2], infos[3], infos[4])
  console.log(data);

  $.ajax({
    type: 'PUT',
    url: "/api/dashboard/updateUser",
    data: data,
    success: response => {
      console.log(response);
      if (response.status) {
        $(".alert").removeClass("hide").addClass("text-primary").text("your account has been successfully updated")
      }
      else {
        $(".alert").removeClass("hide").addClass("text-danger").text(response.message)
      }
    },

    error: error => {
      console.log(error);
    }
  })
})


$(document).on("click", ".user-image", () => {
  if (counter % 2 === 0) {
    $(".user-information").animate({ "width": "270px" }, 100, "linear")
  }
  if (counter % 2 === 1) {
    $(".user-information").animate({ "width": 0 }, 100, "linear")
  }
  counter++

})

