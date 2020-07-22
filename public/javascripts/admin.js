let info;
$.ajax({
    type: "GET",
    url: "/api/dashboard/article/getAll",
    async: false,
    success: function (response) {
        console.log(response);
        info = response;
    },
    error: function (err) {
        console.log(err);
    }
});
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// click on delete icon //////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", ".fa-trash", function () {//delete butoon
    let _id = $(this).attr("data-id")
    let r = confirm("are you sure to delete this company!");
    if (r == true) {
        $.ajax({
            type: "post",
            url: "/api/admin/remove/" + _id,
            success: function (response) {
                console.log(response);
                if (response.status) {
                    for (let i = 0, n = $("tr").length; i < n; i++) {
                        if ($("tr").eq(i).attr("data-id") === _id) {
                            $("tr").eq(i).remove();
                        }
                    }

                }
                else {

                }

            },
            error: function (err) {
                console.log(err);
            }
        })
    }

})

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// click on publish icon /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(document).on("click", ".fa-check", function () {//delete butoon
    let _id = $(this).attr("data-id")

    $.ajax({
        type: "post",
        url: "/api/admin/publishArticle/" + _id,
        success: function (response) {
            console.log(response);
            if (response.status) {
                for (let i = 0, n = $("tr").length; i < n; i++) {
                    if ($("tr").eq(i).attr("data-id") === _id) {
                        $("tr").eq(i).find(".fa-check").remove();
                        $(".table-1").find("tbody").append($("tr").eq(i).html())
                    }
                }

            }
            else {

            }

        },
        error: function (err) {
            console.log(err);
        }
    })


})

