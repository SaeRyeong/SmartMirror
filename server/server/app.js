var express = require('express');
var app = express();
var request = require('request');
var watson = require('watson-developer-cloud');

var weather = require('./weather.js');
var news11 = require('./news11.js');
var bus11 = require('./bus11.js');
var hungry = require('./hungry.js')

var assistant = new watson.AssistantV1({
  username: '6eddaac0-93da-4a0a-9b54-59fdd353c551',
  password: 'fnMFhOeGJ2kN',
  version: '2018-07-10'
});

app.listen(3000, function(port) {
  console.log('Example app listening on port 3000');
});

app.use(express.json());

app.get('/', function(req, res) {
  res.send('Welcome smart-mirror!');
});


app.post('/api/stt', function(req, res) {
  console.log('Hardware에서 요청이 들어옴    /api/stt');

  assistant.message(
    {
      workspace_id: '48026ce6-0137-4d24-9016-8e560095c862',
      input: { text: req.body.msg },
    },

    function(err, response) {
      if (err) {
        console.log('error:', err);
        res.send(err);
      }

      console.log(JSON.stringify(response));
      console.log('Intents check');

      var obj = {
        "intent":"Unknown",
        "msg":"No intents"
      }

      if(response.intents){
        var intent = response.intents;
        if(intent.length > 0){
          obj.intent = intent[0].intent
          if(intent[0].intent === 'weather'){
            obj.msg = 'weather result';
            weather.weather(response.entities, function(ret) {
              obj.msg = ret;
              res.send(obj);
            });
          }
          else if(intent[0].intent === 'traffic'){
            obj.msg = 'bus result';
            bus11.bus11(response.entities, function(ret) {
              obj.msg = ret;
              res.send(obj);
            });
          }
          else if(intent[0].intent === 'news'){
            obj.msg = 'news result';
            news11.news11(response.entities, function(ret) {
              obj.msg = ret;
              res.send(obj);
            });
          }
          else if(intent[0].intent === 'hungry'){
            obj.msg = 'hungry result';
            hungry.hungry(response.entities, function(ret) {
              obj.msg = ret;
              res.send(obj);
            });
          }
          else{
            obj.msg = 'Unknown Intent';
            res.send(obj);
          }

        }
        else{
          res.send(obj);
        }
      }
    }
  );
});
