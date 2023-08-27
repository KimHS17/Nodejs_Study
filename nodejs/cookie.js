var http = require('http');
var cookie = require('cookie');

http.createServer(function(request, response) {
    var cookies = {};
    if(request.headers.connection !== undefined) {
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log(cookies);
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`, //쿠키가 삭제될 시간 지정
            'Secure=Secure; Secure', //https를 쓰는 경우에만 전송
            'HttpOnly=HttpOnly; HttpOnly' //http로 접속할 경우에만 접근 가능
            ]
    });
    response.end('Cookie!!');
}).listen(3000)