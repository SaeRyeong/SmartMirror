var request = require('request');
var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');
var bodyParser = require('body-parser');
var parseString = require('xml2js').parseString;
var bluebird = require('bluebird');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function bus11(entity, callback) {
  if (entity.length === 0) callback('다시 말해주세요');

  var url = 'http://openapi.gbis.go.kr/ws/rest/busarrivalservice/station';
  var queryParams =
    '?' +
    encodeURIComponent('serviceKey') +
    '=pVtk%2FZWgS5TgU%2FaIXifPR6g%2Bi0mfgX6jWyqCrYqvFgBwJ7XmPkGDdu8MIIK7gKETEJO2nvarIDOPYut7DN8W8w%3D%3D'; /* Service Key*/
  queryParams += '&' + encodeURIComponent('stationId') + '=' + encodeURIComponent('208000085'); /* 성결대정류소 ID */

  request(
    {
      url: url + queryParams,
      method: 'GET',
      header: { Accept: 'application/json' },
    },
    function(error, entity, body) {
      if (error) throw new Error(error);
      console.log('Status', entity.statusCode);
      console.log('Headers', JSON.stringify(entity.headers));
      console.log('Reponse received', body);

      console.log(body);
      parseString(body, function(err, result) {
        console.log('to json -> %s', JSON.stringify(result));
        var buslist = result.response.msgBody[0].busArrivalList; // 버스
        for (var i = 0; i < buslist.length; i++) {
          console.log(buslist[i]);
        }
        var routeid = result.response.msgBody[0].busArrivalList; // 버스

        var ret = [];
        for (var i = 0; i < routeid.length; i++) {
          var route = routeid[i].routeId[0];
          var predictTime = routeid[i].predictTime1[0];
          ret.push({
            route: route,
            predictTime: predictTime,
          });
        }

        // Route 전체 검색 루팅 시작
        var promises = [];
        for (var i = 0; i < ret.length; i++) {
          promises.push(findBus(ret[i].route));
        }

        bluebird.all(promises).then(data => {
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < ret.length; j++) {
              if (data[i].response.msgBody[0].busRouteInfoItem[0].routeId[0] === ret[j].route) {
                Object.assign(ret[j], data[i].response.msgBody[0].busRouteInfoItem[0]);
              }
            }
          }

          console.log(ret);
          callback(ret);
        });
        // Route 전체 검색 루팅 끝
      });
    }
  );
}

// Route 검색용 함수
function findBus(route) {
  return new Promise((resolve, reject) => {
    var url = 'http://openapi.gbis.go.kr/ws/rest/busrouteservice/info';

    var queryParams =
      '?' +
      encodeURIComponent('serviceKey') +
      '=pVtk%2FZWgS5TgU%2FaIXifPR6g%2Bi0mfgX6jWyqCrYqvFgBwJ7XmPkGDdu8MIIK7gKETEJO2nvarIDOPYut7DN8W8w%3D%3D'; /* Service Key*/
    queryParams += '&' + encodeURIComponent('routeId') + '=' + encodeURIComponent(route); /* 노선 ID */

    console.log(queryParams);
    request(
      {
        url: url + queryParams,
        method: 'GET',
      },
      function(err, entity, body) {
        if (err) reject(err);
        parseString(body, function(err, result) {
          resolve(result);
        });
      }
    );
  });
}

module.exports = {
  bus11: bus11,
};
