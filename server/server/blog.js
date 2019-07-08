var express = require('express');
var app = express();
var client_id = '59Dk7GyiNQ0uZ2JHP3HY';
var client_secret = 'ULI5_DVVye';


function blog(entity, callback) {
   //if(entity.length === 0)
    // callback('다시 말해주세요');

     var api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(entity[0].value); // json 결과
    //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
     var request = require('request');
     var options = {
         url: api_url,
         headers: {'X-Naver-Client-Id':'59Dk7GyiNQ0uZ2JHP3HY', 'X-Naver-Client-Secret': 'ULI5_DVVye'}
      };
     request.get(options, function (error, entity, body) {
       if (!error && entity.statusCode == 200) {
      //   entity.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      //   res.end(body);
      var result = JSON.parse(body);
      //   var result = body;
          callback(result);
       } else {
         res.status(entity.statusCode).end();
         console.log('error = ' + entity.statusCode);
       }
     });
    }


module.exports = {
  blog : blog
}
