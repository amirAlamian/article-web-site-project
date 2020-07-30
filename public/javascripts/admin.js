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
                                    <i class="fa fa-trash ${" " + response.message.published} ${" " + count + 1}" aria-hidden="true"
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

///////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// sort by  ////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

let titles = ["title", "description", "createdAt"]

$(".sort-options").click(function () {
    $(".sort-options").removeClass("selected");
    $(this).addClass("selected");
    if ($(this).attr("data-sort") === "view") {

        let sortByView = [...info]
        sortByView.sort((a, b) => {
            return b.view.number - a.view.number;
        })
        console.log(sortByView);
        $("tbody").find("tr").remove()
        let counter = 0;
        $(".table-createdAt").eq(0).text("View");
        console.log($(".table-1").find("thead td").eq(3));
        for (let i = 0, n = sortByView.length; i < n; i++) {
            if (sortByView[i].published) {

            
                $(".table-1").find("tbody").append(`<tr data-id="${sortByView[i]._id}">
                <th scope="row">${counter + 1} </th>
                <td><a href="/api/admin/read/${sortByView[i]._id}"> ${sortByView[i].title}</a></td>
                <td> ${sortByView[i].description}</td>
                <td> ${sortByView[i].view.number}</td>
                <td>
                    
                     <a class="text-light" href="/api/admin/read/${sortByView[i]._id} "> <i
                            class="fa fa-book" aria-hidden="true"></i></a> <a class="text-light"
                        href="/api/admin/edit/${sortByView[i]._id}"><i class="fa fa-pencil-square-o"
                            aria-hidden="true"></i></a>
                            <i class="fa fa-trash true ${counter}" aria-hidden="true"
                        style="font-size:16px; color: red;" data-id="${sortByView[i]._id}"></i>
                       
                        </td>
            </tr>`)
                for (let j = 0; j < 3; j++) {
                    if (j === 0) {
                        $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${sortByView[i]._id}'>${sortByView[i][titles[j]]}</a>`)
                    }
                    if (j === 1) {
                        $("tr").eq(i + 1).find("td").eq(j).text(sortByView[i][titles[j]])
                    }
                    if (j === 2) {
                        $("tr").eq(i + 1).find("td").eq(j).text(sortByView[i].view.number)
                    }

                }
            }
        }
    }
    //  else{
    // $("tbody").find("tr").remove()
    // for (let i = 0, n = info.length; i < n; i++) {//adding table
    //     $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td>  <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a> <a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '"><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')
    //     for (let j = 0; j < 3; j++) {
    //         if (j === 0) {
    //             $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
    //         }
    //         if (j === 1) {
    //             $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
    //         }
    //         if (j === 2) {
    //             $("tr").eq(i + 1).find("td").eq(j).text(info[i].view.number)
    //         }

    //     }

    // }
    // }
})