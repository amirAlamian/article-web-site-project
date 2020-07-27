const Article = require("../models/article");
const Response = require("./response")

class aricleOperations {

    async findArticle(req, res, url, view) {
        try {
            let article = await new Promise((resolve, reject) => {

                Article.findById(req.params.article_id, (err, data) => {

                    if (err) reject(err);

                    resolve(data);
                })
            })
            if (!article) {
                throw new Error("there is no article with this informations")
            }
            if (view) {//viewing the article
                let viewing = true;
                for (let i = 0, n = article.view.viewer.length; i < n; i++) {
                    if (article.view.viewer[i] === req.session.user.userName) {
                        viewing = false
                    }
                }
                if (viewing) {
                    article.view.viewer.push(req.session.user.userName);
                    article.view.number++;
                    Article.findByIdAndUpdate(req.params.article_id, article, (err, data) => {

                        if (err) {
                            throw new Error("something went wrong. please try again later")
                        }
                        console.log(data);
                    })

                }

            }
            return res.render(url, { article, user: req.session.user, theme: req.cookies.theme })
        } catch (error) {
            console.log(error.message);
            return res.render("pages/error", {
                message: "404 NOT FOUND"
            });
        }
    }




    async removeArticle(req, res) {
        try {
            await new Promise((resolve, reject) => {

                Article.findByIdAndRemove(req.params.article_id, (err, data) => {

                    if (err) reject(err);

                    resolve(data);
                })
            })
            return res.json(new Response(true, "article has been removed successfully.", Date.now))
        } catch (error) {
            console.log(error.message);
            return res.json(new Response(false, "something went wrong. please try again later", Date.now))
        }
    }
}


module.exports = new aricleOperations;