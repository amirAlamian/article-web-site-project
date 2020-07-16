let articleInfo = {
  title: "",
  description: "",
}
let article = {
  passage: "",
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
      url: "/api/dashboard/addArticle",
      data: articleInfo,
      success: (response) => {
        console.log(response);
        if (response.title) {
          $(".alert").removeClass("alert-danger hide").addClass("alert-primary").html(`Article has been successfully created. you have 1 day permission to compelete your article otherwise it will be removed.to compelete your article click <a href='/api/dashboard/addArticle/${response._id}'>here</a>`);
        }
        else {
          $(".alert").removeClass("hide").html(response)
        }

      },

      erorr: (err) => {

        console.log(err);
      }
    })
  }

})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////text editor///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

let toolbarOptions = [
  [{ 'font': [] }],
  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction




  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme

  [{ 'align': [] }],

  ['clean'], ['image']];
let quill = new Quill('#editor2', {
  history: {
    delay: 1000,
    maxStack: 50,
    userOnly: false
  },
  imageDrop: true,
  imageResize: {
    displayStyles: {
      backgroundColor: 'black',
      border: 'none',
      color: 'white'
    },
    modules: ['Resize', 'DisplaySize', 'Toolbar']
  },
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow',
  placeholder: 'Write your passage here',
});





tinymce.init({
  selector: 'textarea#full-featured-non-premium',
  plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
  imagetools_cors_hosts: ['picsum.photos'],
  menubar: 'file edit view insert format tools table help',
  toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
  toolbar_sticky: true,
  autosave_ask_before_unload: true,
  autosave_interval: "30s",
  autosave_prefix: "{path}{query}-{id}-",
  autosave_restore_when_empty: false,
  autosave_retention: "2m",
  image_advtab: true,
  content_css: '//www.tiny.cloud/css/codepen.min.css',
  link_list: [
    { title: 'My page 1', value: 'http://www.tinymce.com' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_list: [
    { title: 'My page 1', value: 'http://www.tinymce.com' },
    { title: 'My page 2', value: 'http://www.moxiecode.com' }
  ],
  image_class_list: [
    { title: 'None', value: '' },
    { title: 'Some class', value: 'class-name' }
  ],
  importcss_append: true,
  file_picker_callback: function (callback, value, meta) {
    /* Provide file and text for the link dialog */
    if (meta.filetype === 'file') {
      callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
    }

    /* Provide image and alt text for the image dialog */
    if (meta.filetype === 'image') {
      callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
    }

    /* Provide alternative source and posted for the media dialog */
    if (meta.filetype === 'media') {
      callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
    }
  },
  templates: [
        { title: 'New Table', description: 'creates a new table', content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>' },
    { title: 'Starting my story', description: 'A cure for writers block', content: 'Once upon a time...' },
    { title: 'New list with dates', description: 'New List with dates', content: '<div class="mceTmpl"><span class="cdate">cdate</span><br /><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>' }
  ],
  template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
  template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
  height: 600,
  image_caption: true,
  quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
  noneditable_noneditable_class: "mceNonEditable",
  toolbar_mode: 'sliding',
  contextmenu: "link image imagetools table",
 });





///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////sending passsage to data base/////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(".send-article-btn").click(() => {

  article.passage = tinymce.activeEditor.getContent();

  $.ajax({// sending article passage into data base

    type: "POST",
    url: `/api/dashboard/addArticle/${$(".send-article-btn").attr("data-id")}`,
    data: article,
    success: (response) => {
      console.log(response);
      if (response === "done") {
        $(".alert").removeClass("alert-danger hide").addClass("alert-primary").html("Article has been successfully updated.");
      }
      else {
        $(".alert").removeClass("hide").html(response)
      }

    },

    erorr: (err) => {

      console.log(err);
    }
  })
})

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// read article button /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////


