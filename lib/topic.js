var db = require('./db');
var template = require('./template');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {
    db.query(`select * from topic`, function(error, topics) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`);
        response.send(html);
    });
}

exports.page = function(request, response) {
    db.query(`select * from topic`, function(error, topics) {
        if(error) {
          throw error; //에러가 있을 경우 다음 문장 실행x
        }
        db.query(`select * from topic left join author on topic.author_id = author.id where topic.id = ?`, [request.params.pageId], function(error2, topic) { //?에 queryData.id값을 치환하여 줌 - 보안 강화
            if(error2) {
                throw error2;
            }
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
                `<h2>${sanitizeHtml(title)}</h2>${sanitizeHtml(description)}<p>by ${sanitizeHtml(topic[0].name)}</p>`,
                ` <a href="/create">create</a>
                <a href="/update/${request.params.pageId}">update</a>
                    <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${request.params.pageId}">
                    <input type="submit" value="delete">
                    </form>`);
            response.send(html);
        })
    });
}

exports.create = function(request, response) {
    db.query(`select * from topic`, function(error, topics) {
        db.query('select * from author', function(error2, authors) {
          var title = 'Create';
          var list = template.list(topics);
          var html = template.HTML(sanitizeHtml(title), list,
            `<form action="create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`,
            `<a href="/create">create</a>`);
        response.send(html);
        })
      });
}

exports.create_process = function(request, response) {
    var post = request.body;
    db.query(`insert into topic (title, description, created, author_id)
                values(?, ?, NOW(), ?)`, [post.title, post.description, post.author],
                function(error, result) {
                    if(error) {
                        throw error;
                    }
                    response.redirect(`page/${result.insertId}`)
                }
    );
}

exports.update = function(request, response) {
    db.query(`select * from topic`, function(error, topics) {
        if(error) {
          throw error; //에러가 있을 경우 다음 문장 실행x
        }
        db.query(`select * from topic where id = ?`, [request.params.pageId], function(error2, topic) {
            if(error2) {
                throw error2;
            }
            db.query('select * from author', function(error2, authors) {
                var id = topic[0].id;
                var title = sanitizeHtml(topic[0].title);
                var description = sanitizeHtml(topic[0].description);
                var list = template.list(topics);
                var html = template.HTML(title, list,
                `
                <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${id}">
                    <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                    <p>
                    <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                    ${template.authorSelect(authors, topic[0].author_id)}
                    </p>
                    <p>
                    <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/create">create</a> <a href="/update/${id}">update</a>`);
                response.send(html);
            });
        });
    });
}

exports.update_process  = function(request, response) {
    var post = request.body;
    db.query('update topic set title = ?, description = ?, author_id = ? where id = ?', [post.title, post.description, post.author, post.id],
            function(error, result) {
                if(error) {
                    throw error;
                }
                response.redirect(`/page/${post.id}`)
            }
    );
}

exports.delete_process = function(request, response) {
    var post = request.body;
    db.query('delete from topic where id = ?', [post.id], function(error, result) {
        if(error) {
            throw error;
        }
        response.redirect('/');
    })
}