let allCookies = document.cookie;
let lang = allCookies.split(";")
x = lang[0].split("=")

let articleInfo = {
  title: "",
  description: "",
}
class article {
  constructor(body, title, description) {
    this.body = body,
      this.title = title,
      this.description = description
  }
}

function fixBackground(publish){
  if(publish){
    if(x[1]==="FA"){
      $(".article-done").append(`
      <hr >
      <div class="article-empty published-one">
          <h2>اولین مقاله خود را بنویسید </h1>
      </div>
      
      <hr >`)
    }
    else{
      $(".article-done").append(`
      <hr>
      <div class="article-empty published-one">
          <h2>Let's Write Your First Article </h1>
      </div>
      
      <hr>`)
    }
  }
  else{

    if(x[1]==="FA"){
      $(".article-not-done").append(`
      <hr>
      <div class="article-empty unpublished-one">
          <h2> شما مقاله منتشر نشده ندارید</h1>
      </div>
      
      <hr>`)
    }

    else{
      $(".article-not-done").append(`
      <hr>
      <div class="article-empty unpublished-one">
          <h2> You Don't have  Unpublished Article</h1>
      </div>
      
      <hr>`)
    }
  }
}

$(".btn-remove").click(function () {

  $(".text-danger").text($(this).attr("data-article-title"));

  let buttonInfo = $(this);
  let title = $(this).attr("data-article-title")

  $(".remove-BTN").click(() => {
    if ($(".remove-input").val() === $(buttonInfo).attr("data-article-title")) {

      $.ajax({// remove article req

        type: "POST",
        url: `/api/dashboard/article/remove/${$(buttonInfo).attr("data-article-id")}`,

        success: (response) => {
          console.log(response);
          if (response.status) {

            for (let i = 0, length = $(".card-title").length; i < length; i++) {
              if ($(".card-title").eq(i).text().trimLeft() === title) {

                $(".card").eq(i).remove();

                let counter = 0;

                for (let j = 0, n = $(".card").length; j < n; j++) {
                  if ($(".card").eq(j).attr("data-published") === "false") {
                    counter++
                  }
                }
                if (counter === 0) {

                  fixBackground(false);
                
                }
                counter = 0;
                for (let j = 0, n = $(".card").length; j < n; j++) {
                  if ($(".card").eq(j).attr("data-published") === "true") {
                    counter++
                  }
                }
                if (counter === 0) {

                  fixBackground(true);
                }
              }
            }
            $(".remove-input").val("")
            $("#removeModal").modal("hide");
          }
          else {
            $(".alert").removeClass("hide").html(response.message)
          }

        },

        erorr: (err) => {

          console.log(err);
        }
      })

    }
  })

})


///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////text editor///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
let passage = $("#article-passage").attr("data-passage");
$("#article-passage").remove()
tinymce.init({
  selector: '#full-featured-non-premium',

  setup: function (editor) {
    editor.on('init', function (e) {
      editor.setContent(passage);
    });
  },
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

  if ($('.choosePicture').val()) {
    let file = new FormData();
    file.append('articlePicture', $('.choosePicture')[0].files[0])

    $.ajax({
      type: 'POST',
      url: `/api/article/addPicture/${$(".send-article-btn").attr("data-id")}`,
      data: file,
      processData: false,
      contentType: false,

      success: response => {
        console.log(response);
        if (response.status) {
          $("#alertModal").modal("show")
          $(".alert").addClass("text-primary").text("your image has been successfully uploaded")
        }
        else {
          $("#alertModal").modal("show")
          $(".alert").removeClass("text-primary").addClass("text-danger").text(response.message)
        }

      },

      error: error => {
        console.log(error);
      }
    })
  }

  let data = new article(tinymce.activeEditor.getContent(), $("textarea").eq(0).val(), $("textarea").eq(1).val())
  data.published = false
  data.sendToAdmin = false
  console.log(data);

  $.ajax({// sending article passage into data base

    type: "POST",
    url: `/api/dashboard/article/add/${$(".send-article-btn").attr("data-id")}`,
    data: data,
    success: (response) => {
      console.log(response);
      if (response.status) {
        $("#alertModal").modal("show")ک
        if(x[1]==="EN"){
          $(".alert").removeClass("alert-danger").addClass("text-primary").html("Article has been successfully updated.click <a href='/api/dashboard'>here</a> to go to your dashboard ");
        }
        else{
          $(".alert").removeClass("alert-danger").addClass("text-primary text-right").html("مقاله با موفقیت ذخیره شد.");
        }
      
        $(".passage-title h1").text(response.message.title)
        $(".passage-description p").text(response.message.description)
      }
      else {
        $("#alertModal").modal("show")
        $(".alert").removeClass("text-primary").addClass("text-danger").html(response.message)
      }

    },

    erorr: (err) => {

      console.log(err);
    }
  })
})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////sending article to admin/////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
$(".sendToAdmin-article-btn").click(() => {
  $.ajax({// sending article to admin

    type: "POST",
    url: `/api/dashboard/article/sendToAdmin/${$(".send-article-btn").attr("data-id")}`,
    success: (response) => {
      console.log(response);
      if (response.status) {
        $("#alertModal").modal("show");
        if(x[1]==="EN"){
          $(".alert").removeClass("text-danger").addClass("text-primary").html("Article has been successfully updated.click <a href='/api/dashboard'>here</a> to go to your dashboard ");
        }
        else{
          $(".alert").removeClass("text-danger").addClass("text-primary text-right").html("مقاله با موفقیت به ادمین ارسال شد. ");
        }
       
        $(".passage-title h1").text(response.message.title)
        $(".passage-description p").text(response.message.description)
      }
      else {
        $("#alertModal").modal("show")
        $(".alert").removeClass("text-primary").addClass("text-danger").html(response.message)
      }

    },

    erorr: (err) => {

      console.log(err);
    }
  })
})


