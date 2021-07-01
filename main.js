var express = require('express')
var app = express()
var fs = require('fs');
var bodyParser = require('body-parser')
//var qs = require('querystring');
var compression = require('compression')
var indexRouter = require('./routes/index');
var topicRouter = require('./routes/topic');

//정적인 파일: 이미지파일, 자바스크립트파일 css파일을 웹브라우저로 다운로드 시켜주는 경우
//public 파일안에서 정적파일을찾겠다라는 의미
app.use(express.static('public'))

//Third-party middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(compression());

//미들웨어로서 등록, 핵심:req, res객체를 받아서 변형할수있다.
//next호출을 통해 그다음에 실행되어야할 미들웨어를 실행할지 실행하지 않을지 그 미들웨어의 이전미들웨어가 결정하도록한다.
app.use(function (req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

//미들웨어 : 소프트웨어를 만들때 다른사람또는 자신이 만든 소프트웨어를 부품으로해서 나의 소프트웨어를 만들어감(생산성△)

//use, get, post 등의 방법으로 미들웨어 등록가능(애플리케이션 레벨 미들웨어)

// 함수가 처음에 실행이 되고 그 함수안에서 next를 호출하면 밑에 있는 미들웨어를 실행
app.use('/user/:id', function (req, res, next) {
  console.log('Request URL:', req.originalUrl)
  next()
}, function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})

//express에서 사용되는 모든것이 미들웨어라고 할수있다 

//애플리케이션이 구동될때 순서대로 등록되있는 프로그램들이 실행되는데 그 각각의 프로그램들이 서로와 서로를 연결해주는 작은 소프트웨어라는 점...?

// 특정경로에만 미들웨어가 동작할수 있도록 설정 가능
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method)
  next()
})
// 들어오는 모든 요청이 아닌 get방식으로 들어오는 요청에 대해서만 파일 목록을 가져옴
app.get('*', function (request, response, next) {
  fs.readdir('./data', function (error, filelist) {
    request.list = filelist
    next()
  });
})

app.use('/', indexRouter);

// '/topic'으로 시작하는 주소들에게 topicRouter이라고 하는 미들웨어를 적용하겠다.
app.use('/topic', topicRouter);


//404응답 처리, 미들웨어는 순차적으로 실행하기 때문에 더이상 실행하지 못하고 여기까지 오면 못찾은것을 의미 그때 404status를 보냄
app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

//err handler를 위한 미들웨어
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3003, function () {
  console.log('Example app listening at http://localhost:3003')
})

// var http = require('http');
// var fs = require('fs');
// var url = require('url');
// var qs = require('querystring');
// var template = require('./lib/template.js');
// var path = require('path');
// var sanitizeHtml = require('sanitize-html');

// var app = http.createServer(function(request,response){
//     var _url = request.url;
//     var queryData = url.parse(_url, true).query;
//     var pathname = url.parse(_url, true).pathname;
//     if(pathname === '/'){
//       if(queryData.id === undefined){
//       } else {
//       }
//     } else if(pathname === '/create'){
//     } else if(pathname === '/create_process'){
//     } else if(pathname === '/update'){
//     } else if(pathname === '/update_process'){
//     } else if(pathname === '/delete_process'){
//     } else {
//       response.writeHead(404);
//       response.end('Not found');
//     }
// });
// app.listen(3000);