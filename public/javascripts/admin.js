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
                        let count = $(".table-1").find("tbody").find("tr").length
                        $("tr").eq(i).remove();

                        $(".table-1").find("tbody").append(`<tr data-id="${response.message._id}">
                        <th scope="row">${count + 1} </th>
                        <td><a href="/api/admin/read/${response.message._id}"> ${response.message.title}</a></td>
                        <td> ${response.message.description}</td>
                        <td> ${response.message.createdAt}</td>
                        <td>
                             <a class="text-light" href="/api/admin/read/${response.message._id} "> <i
                                    class="fa fa-book" aria-hidden="true"></i></a>  <a class="text-light"
                                href="/api/admin/edit/${response.message._id}"><i class="fa fa-pencil-square-o"
                                    aria-hidden="true"></i></a>
                                    <i class="fa fa-trash ${" "+response.message.published} ${" "+count + 1}" aria-hidden="true"
                                style="font-size:16px; color: red;" data-id="${response.message._id}"></i>`)
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

