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
let titles2 = ["name", "registrationCode", "city", "state", "phoneNumber", "registrationDate"]
let info = [];
let x;

$.ajax({
    type: "GET",
    url: "/api/dashboard/article/get",
    async: false,
    success: function (response) {
        console.log(response);
        if ($(".article-table").attr("data-published") === "true") {
            for (let i = 0, n = response.length; i < n; i++) {
                if (response[i].published) {
                    info.push(response[i])
                }
            }
            console.log(info);
            for (let i = 0, n = info.length; i < n; i++) {//adding table
                $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td> <a class="text-light" href="/api/dashboard/article/read/'+info[i]._id+'"> <i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i> <a class="text-light" href="/api/dashboard/article/edit/'+info[i]._id+'"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a></td></tr>')
                for (let j = 0; j < 3; j++) {
                    if(j===0){
                        $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                    }
                    else{
                        $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
                    }
                    
                }
                
            }
        }
        else if($(".article-table").attr("data-published") === "false") {
            for (let i = 0, n = response.length; i < n; i++) {
                if (!response[i].published) {
                    info.push(response[i])
                }
            }

            for (let i = 0, n = info.length; i < n; i++) {//adding table
                $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td> <a class="text-light" href="/api/dashboard/article/read/'+info[i]._id+'"> <i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i> <a class="text-light" href="/api/dashboard/article/edit/'+info[i]._id+'"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a></td></tr>')
                for (let j = 0; j < 3; j++) {
                    if(j===0){
                        $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                    }
                    else{
                        $("tr").eq(i + 1).find("td").eq(j).text(info[i][titles[j]])
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
    let r = confirm("are you sure to delete this company!");
    if (r == true) {
        $.ajax({
            type: "post",
            url: "/api/dashboard/article/remove/" + info[x]._id,
            success: function (response) {
                console.log(response);
                info.splice(x, 1)
                $("tbody").remove();
                $("table").append("<tbody></tbody>")
                for (i = 0; i < info.length; i++) {//adding table
                    $("table").find("tbody").append('<tr> <th scope="row">' + (i + 1) + '</th><td></td><td></td><td></td><td> <a class="text-light" href="/api/dashboard/article/read/'+info[i]._id+'"> <i class="fa fa-book' + " " + i + '" aria-hidden="true"></i></a> <i class="fa fa-trash' + " " + i + '" aria-hidden="true" style="font-size: 16px; color: red;"></i> <a class="text-light" href="/api/dashboard/article/edit/'+info[i]._id+'"><i class="fa fa-pencil-square-o' + " " + i + '" aria-hidden="true"></i></a></td></tr>')
                    for (j = 0; j < 3; j++) {
                        if(j===0){
                            $("tr").eq(i + 1).find("td").eq(j).append(`<a href='/api/dashboard/article/read/${info[i]._id}'>${info[i][titles[j]]}</a>`)
                        }
                        else{
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
