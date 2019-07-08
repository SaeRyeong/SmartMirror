

$(document).ready(function() {
  console.log('hello');
  function mqtt() {
    const hostname = 'iot.eclipse.org';
    const port = 443;
    // Create a client instance
    client = new Paho.MQTT.Client(hostname, Number(port), 'clientId');

    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({ timeout: 3, onSuccess: onConnect, onFailure: onFailure, useSSL:true});

    function onFailure(e) {
      console.log(e);
    }
    // called when the client connects
    function onConnect() {
      // Once a connection has been made, make a subscription and send a message.
      console.log('onConnect');
      client.subscribe('/weather');
      client.subscribe('/traffic');
      client.subscribe('/news');
      client.subscribe('/sensor1');
      client.subscribe('/sensor2');
      client.subscribe('/again');
      client.subscribe('/hungry');
      client.subscribe('/blog');
      client.subscribe('/list');
      client.subscribe('/goHome');
      // message = new Paho.MQTT.Message('Hello');
      // message.destinationName = 'World';
      // client.send(message);
    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage);
      }
    }

    // called when a message arrives
    function onMessageArrived(message) {
      // console.log('onMessageArrived:' + message.payloadString);
      console.log(message.destinationName);
      console.log(message.payloadString);

      //message = new Paho.MQTT.Message('Hello');
      //message.destinationName = '/web';
      //client.send(message);

      if (message.destinationName === '/weather') {
        var msg = JSON.parse(message.payloadString)

        $('#news').empty();
        $('#newsTitle').empty();
        $('#newsResult').empty();
        $('#newsIcon').empty();

        $('#blog').empty();
        $('#blogTitle').empty();
        $('#blogResult').empty();
        $('#blogIcon').empty();

        $('#list1').empty();
        $('#list1-1').empty();
        $('#list1-2').empty();
        $('#list2').empty();
        $('#list2-1').empty();
        $('#list2-2').empty();
        $('#list3').empty();
        $('#list3-1').empty();
        $('#list3-2').empty();
        $('#list4').empty();
        $('#list4-1').empty();
        $('#list4-2').empty();
        $('#list5').empty();
        $('#list5-1').empty();
        $('#listResult').empty();

        $('#hungryResult').empty();

        $('#busNumber').empty();
        $('#busTime').empty();
        $('#busFirstTime').empty();
        $('#busLastTime').empty();
        $('#busIcon').empty();

        $('#goHomeResult').empty();
      }
      // weather이 올때 html에 있던 text empty

      if (message.destinationName === '/weather') {
        var msg = JSON.parse(message.payloadString)

        $('#weather').html(msg.msg.narrative);
        $('#weatherDate').html(msg.msg.fcst_valid_local);
        $('#weatherResult').html(msg.tts);
        if(msg.msg.max_temp === null){
          $('#weatherMinMax').html(msg.msg.min_temp + '℃');
        }else{
          $('#weatherMinMax').html(msg.msg.min_temp + '℃/' + msg.msg.max_temp + '℃');
        }
        $('#weatherIcon').prepend("<img src= \"./javascripts/sun.jpg\" width=\"200\" height=\"200\" />");
      }

      // weather이 올때 text 출력








      if (message.destinationName === '/traffic') {
        var msg = JSON.parse(message.payloadString)

        $('#news').empty();
        $('#newsTitle').empty();
        $('#newsResult').empty();
        $('#newsIcon').empty();

        $('#blog').empty();
        $('#blogTitle').empty();
        $('#blogResult').empty();
        $('#blogIcon').empty();

        $('#list1').empty();
        $('#list1-1').empty();
        $('#list1-2').empty();
        $('#list2').empty();
        $('#list2-1').empty();
        $('#list2-2').empty();
        $('#list3').empty();
        $('#list3-1').empty();
        $('#list3-2').empty();
        $('#list4').empty();
        $('#list4-1').empty();
        $('#list4-2').empty();
        $('#list5').empty();
        $('#list5-1').empty();
        $('#listResult').empty();

        $('#weather').empty();
        $('#weatherDate').empty();
        $('#weatherResult').empty();
        $('#weatherMinMax').empty();
        $('#weatherIcon').empty();

        $('#hungryResult').empty();
        $('#goHomeResult').empty();
      }

      if (message.destinationName === '/traffic') {
        var msg = JSON.parse(message.payloadString)

        $('#busNumber').html(msg.msg.routeName + '번 버스');
        $('#busTime').html(msg.msg.predictTime + '분 뒤에 도착합니다.');
        $('#busFirstTime').html('첫차 시간은' + msg.msg.upFirstTime + '분 입니다.');
        $('#busLastTime').html('마지막차 시간은 ' + msg.msg.upLastTime + '분 입니다.');
        $('#busIcon').prepend("<img src= \"./javascripts/bus.jpg\" width=\"200\" height=\"200\" />");
        $('#busResult').html(msg.tts);
      }









      if (message.destinationName === '/news') {
        var msg = JSON.parse(message.payloadString)
        $('#weather').empty();
        $('#weatherDate').empty();
        $('#weatherResult').empty();
        $('#weatherMinMax').empty();
        $('#weatherIcon').empty();

        $('#blog').empty();
        $('#blogTitle').empty();
        $('#blogResult').empty();
        $('#blogIcon').empty();

        $('#list1').empty();
        $('#list1-1').empty();
        $('#list1-2').empty();
        $('#list2').empty();
        $('#list2-1').empty();
        $('#list2-2').empty();
        $('#list3').empty();
        $('#list3-1').empty();
        $('#list3-2').empty();
        $('#list4').empty();
        $('#list4-1').empty();
        $('#list4-2').empty();
        $('#list5').empty();
        $('#list5-1').empty();
        $('#listResult').empty();

        $('#busNumber').empty();
        $('#busTime').empty();
        $('#busFirstTime').empty();
        $('#busLastTime').empty();
        $('#busIcon').empty();

        $('#hungryResult').empty();
        $('#goHomeResult').empty();
     }
     // news가 올때 html에 있던 text empty

      if (message.destinationName === '/news') {
        var msg = JSON.parse(message.payloadString)
       $('#news').html(msg.msg.description);
       $('#newsTitle').html(msg.msg.title);
       $('#newsResult').html(msg.tts);
       $('#newsIcon').prepend("<img src= \"./javascripts/news.jpg\" width=\"200\" height=\"200\" />");
     }
     // news가 올때 text 출력









     if (message.destinationName === '/again') {
       var msg = JSON.parse(message.payloadString)
      $('#againResult').html(msg);
    }

    if (message.destinationName === '/hungry') {
      var msg = JSON.parse(message.payloadString)
      $('#news').empty();
      $('#newsTitle').empty();
      $('#newsResult').empty();
      $('#newsIcon').empty();

      $('#blog').empty();
      $('#blogTitle').empty();
      $('#blogResult').empty();
      $('#blogIcon').empty();

      $('#list1').empty();
      $('#list1-1').empty();
      $('#list1-2').empty();
      $('#list2').empty();
      $('#list2-1').empty();
      $('#list2-2').empty();
      $('#list3').empty();
      $('#list3-1').empty();
      $('#list3-2').empty();
      $('#list4').empty();
      $('#list4-1').empty();
      $('#list4-2').empty();
      $('#list5').empty();
      $('#list5-1').empty();
      $('#listResult').empty();

      $('#weather').empty();
      $('#weatherDate').empty();
      $('#weatherResult').empty();
      $('#weatherMinMax').empty();
      $('#weatherIcon').empty();

      $('#busNumber').empty();
      $('#busTime').empty();
      $('#busFirstTime').empty();
      $('#busLastTime').empty();
      $('#busIcon').empty();

      $('#goHomeResult').empty();
    }

    if (message.destinationName === '/hungry') {
      var msg = JSON.parse(message.payloadString)
       $('#hungryResult').html(msg.tts);
    }

    if (message.destinationName === '/goHome') {
      var msg = JSON.parse(message.payloadString)
      $('#news').empty();
      $('#newsTitle').empty();
      $('#newsResult').empty();
      $('#newsIcon').empty();

      $('#blog').empty();
      $('#blogTitle').empty();
      $('#blogResult').empty();
      $('#blogIcon').empty();

      $('#list1').empty();
      $('#list1-1').empty();
      $('#list1-2').empty();
      $('#list2').empty();
      $('#list2-1').empty();
      $('#list2-2').empty();
      $('#list3').empty();
      $('#list3-1').empty();
      $('#list3-2').empty();
      $('#list4').empty();
      $('#list4-1').empty();
      $('#list4-2').empty();
      $('#list5').empty();
      $('#list5-1').empty();
      $('#listResult').empty();

      $('#weather').empty();
      $('#weatherDate').empty();
      $('#weatherResult').empty();
      $('#weatherMinMax').empty();
      $('#weatherIcon').empty();

      $('#busNumber').empty();
      $('#busTime').empty();
      $('#busFirstTime').empty();
      $('#busLastTime').empty();
      $('#busIcon').empty();

      $('#hungryResult').empty();

     $('#goHomeResult').html(msg.tts);

    }








  if (message.destinationName === '/sensor1') {
   $('#sensorResult1').html(message.payloadString);
  }
  if (message.destinationName === '/sensor2') {
   $('#sensorResult2').html(message.payloadString);
  }






  if (message.destinationName === '/blog') {
    var msg = JSON.parse(message.payloadString)
          $('#weather').empty();
          $('#weatherDate').empty();
          $('#weatherResult').empty();
          $('#weatherMinMax').empty();
          $('#weatherIcon').empty();;

          $('#news').empty();
          $('#newsTitle').empty();
          $('#newsResult').empty();
          $('#newsIcon').empty();

          $('#list1').empty();
          $('#list1-1').empty();
          $('#list1-2').empty();
          $('#list2').empty();
          $('#list2-1').empty();
          $('#list2-2').empty();
          $('#list3').empty();
          $('#list3-1').empty();
          $('#list3-2').empty();
          $('#list4').empty();
          $('#list4-1').empty();
          $('#list4-2').empty();
          $('#list5').empty();
          $('#list5-1').empty();
          $('#listResult').empty();

          $('#blog').empty();
          $('#blogTitle').empty();
          $('#blogResult').empty();
          $('#blogIcon').empty();

          $('#busNumber').empty();
          $('#busTime').empty();
          $('#busFirstTime').empty();
          $('#busLastTime').empty();
          $('#busIcon').empty();

          $('#hungryResult').empty();
          $('#goHomeResult').empty();
  }

  if (message.destinationName === '/blog') {
    var msg = JSON.parse(message.payloadString)
   $('#blog').html(msg.msg.description);
   $('#blogTitle').html(msg.msg.title);
   $('#blogResult').html(msg.tts);
   $('#blogIcon').prepend("<img src= \"./javascripts/blog.jpg\" width=\"200\" height=\"200\" />");
  }









  if (message.destinationName === '/list') {
    var msg = JSON.parse(message.payloadString)
          $('#weather').empty();
          $('#weatherDate').empty();
          $('#weatherResult').empty();
          $('#weatherMinMax').empty();
          $('#weatherIcon').empty();

          $('#news').empty();
          $('#newsTitle').empty();
          $('#newsResult').empty();
          $('#newsIcon').empty();

          $('#blog').empty();
          $('#blogTitle').empty();
          $('#blogResult').empty();
          $('#blogIcon').empty();

          $('#busNumber').empty();
          $('#busTime').empty();
          $('#busFirstTime').empty();
          $('#busLastTime').empty();
          $('#busIcon').empty();

          $('#hungryResult').empty();
          $('#goHomeResult').empty();
  }

  if (message.destinationName === '/list') {
    var msg = JSON.parse(message.payloadString)
   $('#list1').html('버스');
   $('#list1-1').html(' "버스 언제와" ');
   $('#list1-2').html(' 줄바꿈 ');
   $('#list2').html('맛집');
   $('#list2-1').html(' "판교 맛집 알려줘" ');
   $('#list2-2').html(' 줄바꿈 ');
   $('#list3').html('날씨');
   $('#list3-1').html(' "서울시 날씨 알려줘" ');
   $('#list3-2').html(' 줄바꿈 ');
   $('#list4').html('영화');
   $('#list4-1').html(' "액션 영화 추천해줘" ');
   $('#list4-2').html(' 줄바꿈 ');
   $('#list5').html('뉴스');
   $('#list5-1').html(' "뉴스 알려줘" ');
   $('#listResult').html(msg.tts);
  }

    }
  }
  mqtt();
});
