const record = require('node-record-lpcm16');
let { Detector, Models } = require('snowboy');
const player = require('node-wav-player');
const request = require('request');
const mic = require('mic');
const sensorLib = require('node-dht-sensor');
const SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const mqtt = require('mqtt');
var TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
var fs = require('fs');
const player = require('node-wav-player');

const client = mqtt.connect('mqtt://iot.eclipse.org');

const speechToText = new SpeechToTextV1({
  username: 'd554ed94-c05f-49d1-9cf5-29cefc182add',
  password: 'zEV0rl2aQu5Q',
});

var textToSpeech = new TextToSpeechV1({
  url: 'https://stream.aibril-watson.kr/text-to-speech/api',
  username: '916a4cc8-b7c5-499f-89c1-6916297edb76',
  password: 'cNw3ymo6jf8y',
});

const models = new Models();

client.on('connect', function() {
  console.log('Connect to MQTT Broker');
  client.subscribe('/web');
});

// mqtt message가 왔을떄 실행되는 이벤트 핸들러
client.on('message', function(topic, message) {
  // message is Buffer
  console.log(message.toString());
  console.log(topic);
});

//온습도 센서
var temp_value1;
var temp_value2;

var sensor = {
  initialize: function() {
    return sensorLib.initialize(11, 25); // dht version: 11, using 25 pin
  },
  read: function() {
    var readout = sensorLib.read();
    console.log('온도: ' + readout.temperature.toFixed(2) + '℃ , ' + '습도: ' + readout.humidity.toFixed(2) + '%');
    temp_value1 = '⌛온도: ' + readout.temperature.toFixed(2) + '℃ ';
    temp_value2 = '⌛습도: ' + readout.humidity.toFixed(2) + '%';

    setTimeout(function() {
      sensor.read();
    }, 10000);
  },
};

if (sensor.initialize()) {
  sensor.read();
} else {
  console.warn('Failed to initialize sensor');
}

client.on('connect', function() {
  //client.subscribe('moduFARM/sensor/temp');
  client.publish('/sensor1', temp_value1);
  client.publish('/sensor2', temp_value2);
});

client.on('message', function(topic, message) {
  // message is Buffer
  var msg = JSON.parse(message.payloadString);
  console.log(message.toString());
  console.log(msg);
  temp_value1 = message.toString();
  temp_value2 = message.toString();
  //client.end();
});

// mic 초기화
const newMicDevice = function(recognizeStream) {
  const m = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 15 });
  const micInputStream = m.getAudioStream();

  micInputStream.on('data', function(data) {
    process.stdout.write('#');
  });

  micInputStream.on('error', function(err) {
    console.log('Error in Input Stream: ' + err);
  });

  micInputStream.on('startComplete', function() {
    console.log('Got SIGNAL startComplete');
    player
      .play({
        path: './ding.wav',
      })
      .then(() => {})
      .catch(error => {
        console.error(error);
      });
  });

  micInputStream.on('stopComplete', function() {
    console.log('\nGot SIGNAL stopComplete');
  });

  micInputStream.on('silence', function() {
    console.log('\nThere is no recognized data');
    recognizeStream.stop();
  });

  return m;
};

const initSnowboy = () => {
  let m = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 10 });

  // Setting Snowboy model
  models.add({
    file: 'resources/models/ironman.pmdl',
    sensitivity: '0.5',
    hotwords: 'snowboy',
  });

  // Init detector
  const detector = new Detector({
    resource: 'resources/common.res',
    models: models,
    audioGain: 2.0,
  });

  detector.on('silence', function() {});

  detector.on('sound', function(buffer) {
    console.log('#');
  });

  detector.on('error', function() {
    console.log('error');
  });

  detector.on('hotword', function(index, hotword, buffer) {
    console.log('hotword', index, hotword);
    m.stop();

    const params = {
      'content-type': 'audio/l16; rate=16000; channels=1',
      model: 'ko-KR_BroadbandModel',
      timestamps: true,
      smart_formatting: true,
    };

    // create stream
    const recognizeStream = speechToText.createRecognizeStream(params);

    const micInstance = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 15 });
    const micInputStream = micInstance.getAudioStream();
    micInputStream.on('data', function(data) {
      process.stdout.write('S');
    });

    micInputStream.on('error', function(err) {
      console.log('Error in Input Stream: ' + err);
    });

    micInputStream.on('startComplete', function() {
      console.log('Got SIGNAL startComplete');
      player
        .play({
          path: './ding.wav',
        })
        .then(() => {})
        .catch(error => {
          console.error(error);
        });
    });

    micInputStream.on('stopComplete', function() {
      console.log('\nGot SIGNAL stopComplete');
    });

    micInputStream.on('silence', function() {
      console.log('\nThere is no recognized data');
      player
        .play({
          path: './dong.wav',
        })
        .then(() => {
          micInstance.stop();
          recognizeStream.stop();
          setTimeout(function() {
            initSnowboy();
          }, 500);
        })
        .catch(error => {
          console.error(error);
        });
    });

    // event for getting transcirpt
    recognizeStream.on('data', function(event) {
      let resultTranscript = event.toString();

      micInstance.stop();
      recognizeStream.stop();
      // 여기가 음성 입력 받아서 STT처리가 끝나는 부분
      // 서버를 호출
      const msg = {
        msg: resultTranscript,
      };

      console.log(msg);
      var options = {
        method: 'POST',
        url: 'http://14.49.38.90:80/api/stt',
        headers: {
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        body: { msg: resultTranscript },
        json: true,
      };

      request(options, function(error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        console.log('intent : ' + body.intent);

        if (body.intent === 'weather') {
          var msg = {
            msg: body.msg.forecasts[0],
            tts: body.tts,
        };
          client.publish('/weather', JSON.stringify(msg));
        } else if (body.intent === 'news') {
          var msg = {
            msg: body.msg.items[0],
            tts: body.tts,
          };
          client.publish('/news', JSON.stringify(msg));
        } else if (body.intent === 'traffic') {
          var msg = {
            msg: body.msg[0],
            tts: body.tts,
          };
          client.publish('/traffic', JSON.stringify(msg));
        } else if (body.intent === 'hungry') {
          var msg = {
            msg: body.msg,
            tts: body.tts,
          };
          client.publish('/hungry', JSON.stringify(msg));
        } else if (body.intent === 'list') {
          var msg = {
            msg: body.msg,
            tts: body.tts,
          };
          client.publish('/list', JSON.stringify(msg));
        } else if (body.intent === 'blog') {
          var msg = {
            msg: body.msg.items[0],
            tts: body.tts,
          };
          client.publish('/blog', JSON.stringify(msg));
        } else if (body.intent === 'goHome') {
          var msg = {
            msg: body.msg,
            tts: body.tts,
          };
          client.publish('/goHome', JSON.stringify(msg));
        } else {
          var msg = {
            msg: body.msg,
            tts: body.tts,
          };
          client.publish('/again', JSON.stringify(msg));
        }

        micInstance.stop();
        tts(body.tts);
      });
    });

    recognizeStream.on('error', function(event) {
      console.log('STT error : ', event);
    });

    recognizeStream.on('close', function(event) {
      console.log('close');
    });

    micInstance.getAudioStream().pipe(recognizeStream);

    setTimeout(function() {
      micInstance.start();
    }, 500);
  });

  m.getAudioStream().pipe(detector);
  m.start();
};

const tts = script => {
  var synthesizeParams = {
    text: script,
    accept: 'audio/wav',
    voice: 'youngmi',
  };

  // Pipe the synthesized text to a file.
  textToSpeech
    .synthesize(synthesizeParams)
    .on('error', function(error) {
      console.log(error);
    })
    .pipe(fs.createWriteStream('tts.wav'))
    .on('finish', function() {
      player
        .play({
          path: './tts.wav',
        })
        .then(() => {
          player
            .play({
              path: './dong.wav',
            })
            .then(() => {
              initSnowboy();
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
        });
    });
};

initSnowboy();
