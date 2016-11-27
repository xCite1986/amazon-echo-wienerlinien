var http       = require('http')
  , AlexaSkill = require('./AlexaSkill')
  , APP_ID     = '<<<APP-ID>>>'
  , MTA_KEY    = '<<<API-KEY>>>';

var url1 = function(stopId){ // Aspernstrasse
  return 'http://www.wienerlinien.at/ogd_realtime/monitor?rbl=3363&activateTrafficInfo=stoerungkurz&sender=' + MTA_KEY;
};

var url2 = function(stopId){ // Seestadt
  return 'http://www.wienerlinien.at/ogd_realtime/monitor?rbl=3359&activateTrafficInfo=stoerungkurz&sender=' + MTA_KEY;
};

var url3 = function(stopId){ // U2 Karlsplatz
  return 'http://www.wienerlinien.at/ogd_realtime/monitor?rbl=4277&activateTrafficInfo=stoerungkurz&sender=' + MTA_KEY;
};

var getFirstJsonFromMta = function(stopId, callback){
  http.get(url1(stopId), function(res){
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      var result = JSON.parse(body);
      callback(result);
    });

  }).on('error', function(e){
    console.log('Error: ' + e);
  });
};

var getSecondJsonFromMta = function(stopId, callback){
  http.get(url2(stopId), function(res){
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      var result = JSON.parse(body);
      callback(result);
    });

  }).on('error', function(e){
    console.log('Error: ' + e);
  });
};

var getThirdJsonFromMta = function(stopId, callback){
  http.get(url3(stopId), function(res){
    var body = '';

    res.on('data', function(data){
      body += data;
    });

    res.on('end', function(){
      var result = JSON.parse(body);
      callback(result);
    });

  }).on('error', function(e){
    console.log('Error: ' + e);
  });
};

var handleFirstBusRequest = function(intent, session, response){
  getFirstJsonFromMta(intent.slots.bus.value, function(data){
    if(data.data.monitors[0].lines[0].departures){
      var text1 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .departures
                  .departure[0]
                  .departureTime
                  .countdown;
      var text2 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .departures
                  .departure[1]
                  .departureTime
                  .countdown;
      var cardText = '84A Aspernstrasse ' + text1 + ' und ' + text2 + ' Minuten.';
    } else {
      var text1 = 'Diese Linie gibt es nicht.'
      var cardText = cardText;
    }

    var heading = 'Busabfrage 84A Aspernstrasse';
    response.tellWithCard('Der nächste Bus nach Aspernstrasse fährt in ' + text1 + ', der übernächste in ' + text2 + ' Minuten.', heading, cardText);
  });
};

var handleSecondBusRequest = function(intent, session, response){
  getSecondJsonFromMta(intent.slots.bus.value, function(data){
    if(data.data.monitors[0].lines[0].departures){
      var text3 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .departures
                  .departure[0]
                  .departureTime
                  .countdown;
      var text4 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .departures
                  .departure[1]
                  .departureTime
                  .countdown;
      var cardText = '84A Seestadt ' + text3 + ' und ' + text4 + ' Minuten.';
    } else {
      var text3 = 'Diese Linie gibt es nicht.'
      var cardText = cardText;
    }

    var heading = '84A Seestadt';
    response.tellWithCard('Der nächste Bus nach Seestadt fährt in ' + text3 + ', der übernächste in ' + text4 + ' Minuten.', heading, cardText);
  });
};

var handleThirdBusRequest = function(intent, session, response){
  getThirdJsonFromMta(intent.slots.bus.value, function(data){
    if(data.data.monitors[0].lines[0].departures.departure[0].departureTime.countdown){
      var text5 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .departures
                  .departure[0]
                  .departureTime
                  .countdown;
      var text6 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .departures
                  .departure[1]
                  .departureTime
                  .countdown;
            var cardText = 'U2 Karlsplatz ' + text5 + ' und ' + text6 + ' Minuten.';
            var heading = 'U2 Karlsplatz';
            response.tellWithCard('Die nächste U Bahn fährt in ' + text5 + ', die übernächste in ' + text6 + ' Minuten.', heading, cardText);
    } else {
      var text7 = data
                  .data
                  .monitors[0]
                  .lines[0]
                  .towards;
            var cardText = text7;
            var heading = 'U2 Karlsplatz';
            response.tellWithCard(text7, heading, cardText);
    }


  });
};

var BusSchedule = function(){
  AlexaSkill.call(this, APP_ID);
};

BusSchedule.prototype = Object.create(AlexaSkill.prototype);
BusSchedule.prototype.constructor = BusSchedule;

BusSchedule.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session){
  // What happens when the session starts? Optional
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId);
};

BusSchedule.prototype.eventHandlers.onLaunch = function(launchRequest, session, response){
  var output = 'Wiener Linien ist in der Lage dir Auskunft über die Echtzeitdaten der Wiener Linien zu geben. Frage einfach Wienerlinien nach dem nächsten Bus zur Aspernstrasse';
};

BusSchedule.prototype.intentHandlers = {
  GetFirstBusIntent: function(intent, session, response){
    handleFirstBusRequest(intent, session, response);
  },
  
  GetSecondBusIntent: function(intent, session, response){
    handleSecondBusRequest(intent, session, response);
  },
  
  GetThirdBusIntent: function(intent, session, response){
    handleThirdBusRequest(intent, session, response);
  },
  
  GetFourthBusIntent: function(intent, session, response){
    handleFirstBusRequest(intent, session, response);
    handleSecondBusRequest(intent, session, response);
  },

  HelpIntent: function(intent, session, response){
    var speechOutput = 'Frage Wiener Linien wann der nächste Bus nach Aspernstrasse oder Seestadt fährt.';
    response.ask(speechOutput);
  }
};

exports.handler = function(event, context) {
    var skill = new BusSchedule();
    skill.execute(event, context);
};
