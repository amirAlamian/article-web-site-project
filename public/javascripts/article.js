$("#passage").append($("#passage-holder").attr("data-article"))






$(".btn-remove").click(function () {

  $(".text-danger").text($(this).attr("data-article-title"));

  let buttonInfo = this;

  $(".remove-BTN").click(() => {
    if ($(".remove-input").val() === $(buttonInfo).attr("data-article-title")) {

      $.ajax({// remove article req

        type: "GET",
        url: `/api/dashboard/article/remove/${ $(buttonInfo).attr("data-article-id")}`,

        success: (response) => {
          console.log(response);
          if (response === "done") {

            for (let i = 0, length = $(".card-title").length; i < length; i++) {

              if ($(".card-title").eq(i).text() ===  $(buttonInfo).attr("data-article-title")) {
                $(".card").eq(i).remove();

              }
            }

            $("#removeModal").modal("hide");
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

})










