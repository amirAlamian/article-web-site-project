$.ajax({
    type: "GET",
    url: "/api/getAllArticles",
    success: function (response) {
        console.log(response);
        if (response.status) {
            
        }
        else {
           
        }

    },
    error: function (err) {
        console.log(err);
    }
})