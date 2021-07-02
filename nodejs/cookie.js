var http = require('http');
var cookie = require('cookie');

// permanent(퍼머넌트) 쿠키 : 껏다 켜도 살아 있음,
// session(세션) 쿠키 : 웹브라우저가 켜져 있는동안 유효

http.createServer(function(request, response) {
    console.log(request.headers.cookie);
    var cookies = {};
    // 쿠키 읽기
    if(request.headers.cookies !== undefined){
        cookies = cookies = cookie.parse(request.headers.cookies);
    }
    console.log(cookies);
    // 쿠키의 생성(세션 쿠키, 퍼머넌트 쿠키)
    response.writeHead(200, {
        'Set-Cookie':[
            'yummy_cookie=choco',
            'tasty_cookie=strawberry',
            `Permanent=cookies; Max-Age=${60*60*24*30}`,
            'Secure=Secure; Secure',
            'HttpOnly=HttpOnly; HttpOnly',
            'Path=Path; Path=/cookie',
            'Domain=Domain; Domain=o2.org'
        ]
    })
    response.end('Cookie!!');
}).listen(3004);

