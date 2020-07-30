let newCompany = {
    name: "",
    registrationCode: "",
    city: "",
    state: "",
    phoneNumber: "",
    registrationDate: ""
};
let titles = ["title", "description", "createdAt"]
let flag = true;
let info = [];
let x;

$.ajax({
    type: "GET",
    url: "/api/dashboard/article/get",
    async: false,
    success: function (response) {
        console.log(response);
        if (response.status) {
            if ($(".article-table").attr("data-published") === "true") {
                for (let i = 0, n = response.message.length; i < n; i++) {
                    if (response.message[i].published) {
                        info.push(response.message[i])
                    }
                }
                for (let i = 0, n = info.length; i < n; i++) {//adding table
                    $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td>  <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a> <a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '"><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')
                    for (let j = 0; j < 3; j++) {
                        if (j === 0) {
                            $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                        }
                        if (j === 1) {
                            $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
                        }
                        if (j === 2) {
                            $("tr").eq(i + 1).find("td").eq(j).text(info[i].view.number)
                        }

                    }

                }
            }
            else if ($(".article-table").attr("data-published") === "false") {
                for (let i = 0, n = response.message.length; i < n; i++) {
                    if (!response.message[i].published) {
                        info.push(response.message[i])
                    }
                }

                for (let i = 0, n = info.length; i < n; i++) {//adding table
                    if (info[i].sendToAdmin) {
                        $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td><i class="fa fa-clock-o' + " " + i + '"aria-hidden="true"></i>   <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a><a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '"><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')

                    }
                    else {
                        $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td><i class="fa fa-check' + " " + i + '"aria-hidden="true" data-id="' + info[i]._id + '"></i>   <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a><a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '"><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')
                    }


                    for (let j = 0; j < 3; j++) {
                        if (j === 0) {
                            $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                        }
                        else {
                            $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
                        }

                    }
                }
            }

        }

    },
    error: function (err) {
        console.log(err);
    }
})



$(document).on("click", ".fa-trash", function () {//delete butoon
    for (i = 0; i < $(".fa-trash").length; i++) {
        if ($(this).hasClass(i)) {
            deleteAlert(i)
        }
    }
})
function deleteAlert(x) {//alert for make sure
    let r = confirm("are you sure to delete this article!");
    if (r == true) {
        $.ajax({
            type: "post",
            url: "/api/dashboard/article/remove/" + info[x]._id,
            success: function (response) {
                console.log(response);
                info.splice(x, 1)
                $("tbody").remove();
                $("table").append("<tbody></tbody>");
                for (i = 0; i < info.length; i++) {//adding table
                    if (info[i].published) {
                        $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td> <a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '">  <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')

                    }
                    else if (!info[i].published) {
                        if (info[i].sendToAdmin) {
                            $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td><i class="fa fa-clock-o' + " " + i + '"aria-hidden="true"></i> <a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '">  <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')

                        }
                        else {
                            $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td><i class="fa fa-check' + " " + i + '"aria-hidden="true" data-id="' + info[i]._id + '"></i> <a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '">  <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')
                        }

                    }
                    for (j = 0; j < 3; j++) {
                        if (j === 0) {
                            $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                        }
                        else {
                            $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
                        }
                    }

                }
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
}
$(document).on("click", ".fa-check", function () {//delete butoon
    for (let i = 0, n = $("tbody").find("tr").length; i < n; i++) {
        if ($(this).hasClass(i)) {
            $(this).removeClass("fa-check").addClass("fa-clock-o");
            $.ajax({
                type: "post",
                url: "/api/dashboard/article/sendToAdmin/" + $(this).attr("data-id"),
                success: function (response) {
                    console.log(response);
                    if (response.status) {

                        $("#alertModal").modal("show")
                        $(".alert").removeClass("text-danger").addClass("text-primary").text(response.message)
                    }
                    else {
                        $("#alertModal").modal("show")
                        $(".alert").removeClass("text-primary").addClass("text-danger").text(response.message)
                    }

                },
                error: function (err) {
                    console.log(err);
                }
            })



        }
    }


});

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// sort by ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

$(".sort-options").click(function () {
    $(".sort-options").removeClass("selected");
    $(this).addClass("selected");
    if ($(this).attr("data-sort") === "view") {

        let sortByView =[...info]
        sortByView.sort((a, b) => {
            return b.view.number - a.view.number;
        })
        console.log(sortByView);
        $("tbody").find("tr").remove()
        for (let i = 0, n = sortByView.length; i < n; i++) {

            $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td>  <a class="text-light" href="/api/dashboard/article/edit/' + sortByView[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a> <a class="text-light" href="/api/dashboard/article/read/' + sortByView[i]._id + '"><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')
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
    else{
        $("tbody").find("tr").remove()
        for (let i = 0, n = info.length; i < n; i++) {//adding table
            $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td>  <a class="text-light" href="/api/dashboard/article/edit/' + info[i]._id + '"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a> <a class="text-light" href="/api/dashboard/article/read/' + info[i]._id + '"><i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i></td></tr>')
            for (let j = 0; j < 3; j++) {
                if (j === 0) {
                    $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                }
                if (j === 1) {
                    $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
                }
                if (j === 2) {
                    $("tr").eq(i + 1).find("td").eq(j).text(info[i].view.number)
                }

            }

        }
    }
})