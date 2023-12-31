var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');
var sanitizeHtml = require('sanitize-html');

exports.home = function(request, response) {
    db.query('select * from topic', function(error, topics) {
        if(error) {
            throw error;
        }
        db.query('select * from author', function(error2, authors) {
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title, list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                <p>
                    <input type="submit" value="create">
                </p>
            </form>
            `,
            ``);
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`insert into author (name, profile)
                    values(?, ?)`, [post.name, post.profile],
                    function(error, result) {
                        if(error) {
                            throw error;
                        }
                        response.writeHead(302, {Location: '/author'});
                        response.end('success');
                    }
        );
    });
}

exports.update = function(request, response) {
    db.query('select * from topic', function(error, topics) {
        if(error) {
            throw error;
        }
        db.query('select * from author', function(error2, authors) {
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query('select * from author where id=?', [queryData.id], function(error2, author) {
                var title = 'author';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" value="${queryData.id}">
                    </p>
                    <p>
                        <input type="text" name="name" value="${sanitizeHtml(author[0].name)}" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
                `,
                ``);
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}

exports.update_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('update author set name = ?, profile = ? where id = ?', [post.name, post.profile, post.id],
                    function(error, result) {
                        if(error) {
                            throw error;
                        }
                        response.writeHead(302, {Location: '/author'});
                        response.end('success');
                    }
        );
    });
}

exports.delete_process = function(request, response) {
    var body = '';
    request.on('data', function(data){
        body += data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`delete from topic where author_id = ?`, [post.id],
                    function(error, result) {
                        if(error) {
                            throw error;
                        }
                        db.query('delete from author where id = ?', [post.id],
                                    function(error2, result2) {
                                        if(error2) {
                                            throw error2;
                                        }
                                        response.writeHead(302, {Location: '/author'});
                                        response.end('success');
                                    }
                        );
        });
    });
}