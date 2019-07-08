var express = require('express');
var app = express();
var request = require('request');

function weather(entity, callback) {
   if(entity.length === 0)
     callback('다시 말해주세요');

     var location = entity[0].value;

       var api_url = 'https://openapi.naver.com/v1/map/geocode?query=' + encodeURI(location); // json 결과
    //   var api_url = 'https://openapi.naver.com/v1/search/blog.xml?query=' + encodeURI(req.query.query); // xml 결과
     var request = require('request');
     var options = {
       url: api_url,
       headers: {
         'X-Naver-Client-Id': 'Cjzs8WwFlQyySM0lqZye',
         'X-Naver-Client-Secret': 'Dy46feuS2O',
       },
     };
     request.get(options, function (error, entity, body) {
       if (!error && entity.statusCode == 200) {
      //   entity.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      //   res.end(body);
      var jsonBody = JSON.parse(body);
      console.log('jsonBody.result.items[0].point.x : ' + jsonBody.result.items[0].point.x);
      console.log('jsonBody.result.items[0].point.y : ' + jsonBody.result.items[0].point.y);
      var lng = jsonBody.result.items[0].point.y;
      var lat = jsonBody.result.items[0].point.x;

      var options = {
        method: 'GET',
        url:
          'https://twcservice.mybluemix.net/api/weather/v1/geocode/' +
          lng +
          '/' +
          lat +
          '/forecast/daily/3day.json',
        qs: { language: 'ko-KR', units: 'm' },
        headers: {
          'Postman-Token': '6b84599f-30a0-4f75-b450-ef9b5134a76c',
          'Cache-Control': 'no-cache',
          'Accept':'application/json',
          Authorization: 'Basic OWUyNzc3MGUtYzI3Ny00MDA5LTk0ZTItZjNiNDY3NTljOGJmOlN1NmZrc3RlWkU=',
        },
      };
      request(options, function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        //res.end(body);
        var result = JSON.parse(body);
  //var result = body;
  callback(result);
      //  console.log(body);
      });
    } else {
    }

});
}

module.exports = {
  weather : weather
}
