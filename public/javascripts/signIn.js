let articleInfo = {
  title: "",
  description: "",
}
let article = {
  passage: "",
}

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
///////////////////////////////initial request to server for articles/////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


// let userArticles = new Promise((resolve, reject) => {
//   $.ajax({// get all of the user informations

//     type: "GET",
//     url: "/api/dashboard/getArticles",
//     success: (response) => {
//       resolve(response);

//     },

//     erorr: (err) => {

//       reject(err);
//     }

//   })


// })

// let addCard = (articles) => {


//   for (i = 0, length = articles.length; i < length; i++) {
//     if (articles[i].published) {
//       $(".article-done").append( `<div class="card" style="width: 18rem;">
//       <img class="card-img-top" src="..." alt="Card image cap">
//       <div class="card-body">
//         <h5 class="card-title">${articles[i].title}</h5>
//         <p class="card-text">${articles[i].description}</p>
//         <a href="#" class="btn btn-primary">Read</a>
//       </div>
//       </div>`);
//     }
//     else {
//       $(".article-not-done").append( `<div class="card" style="width: 18rem;">
//       <img class="card-img-top" src="..." alt="Card image cap">
//       <div class="card-body">
//         <h5 class="card-title">${articles[i].title}</h5>
//         <p class="card-text">${articles[i].description}</p>
//         <a href="#" class="btn btn-primary read-article-btn">Read</a>
//       </div>
//       </div>`);
//     }
//   }
// }


// userArticles.then(result => { //adding articles to dashboard
//   addCard(result)
//   console.log(result);
// })




///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////add article button////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

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

  console.log(articleInfo);

  if (permissin) {
    $.ajax({// post to add new article

      type: "POST",
      url: "/api/dashboard/article/add",
      data: articleInfo,

      success: response => {
        console.log(response);
        if (response.title) {
          $(".alert").removeClass("alert-danger hide").addClass("alert-primary").html(`Article has been successfully created. you have 1 day permission to compelete your article otherwise it will be removed.to compelete your article click <a href='/api/dashboard/article/add/${response._id}'>here</a>`);
        }
        else {
          $(".alert").removeClass("hide").html(response)
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
    $(".user-information").animate({ "width": "250px" }, 100, "linear")
  }
  if(counter % 2 === 1){
    $(".user-information").animate({ "width": 0 }, 100, "linear")
  }
  counter++

})