// Initial variable setting
var time = null,
	today = null;
var CLIENT_ID = '478283679612-2d4usrlq7i6or15loo35rlm674i55vtf.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
var jsonstocks = [];
var symbols = ["NAT", "V", "PACB", "FB", "GOOG", "DES", "IJR", "VGT", "VWINX", "ITOT", "VOE", "VMVAX", "VDIGX", "SPHD"];



//Setup variables for voice output
var diagnostic = document.getElementById("mic");
var erroroutput = document.getElementById("output");
var requestedcontent = document.getElementById("left");
var requestedcontentright = document.getElementById("right");
var requestedcontentcenter = document.getElementById("panelcenter");
//Update Time
var update = function () {
	time.html(moment().format('LTS'));
	today.html(moment().format('LL'));
};
//Script to set it to go black after interval of no change
function idleLogout() {
    var t;
    window.onload = resetTimer;
    window.onmousemove = resetTimer;
    window.onmousedown = resetTimer; // catches touchscreen presses
    window.onclick = resetTimer;     // catches touchpad clicks
    window.onscroll = resetTimer;    // catches scrolling with arrow keys
    window.onkeypress = resetTimer;
    function logout() {
		var el = document.getElementById( 'child' );
		requestedcontent.classList.toggle("card");
		document.getElementById("left").innerHTML = "";
		document.getElementById("right").innerHTML = "";
		document.getElementById("panelcenter").innerHTML = "";
		
		$( "div" ).fadeOut( "slow" );
		$("body").css("backgroundColor", "#000");
    }
    function resetTimer() {
		//This is what is causing the reset.  Track it later.
		$("body").css("backgroundColor", "#fff");
		$( "div" ).fadeIn( "slow" );
        clearTimeout(t);
        t = setTimeout(logout, 30000);  // time is in milliseconds
    }
}

//Speech Recognition Block
//Speech variables
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var commands = [ 'weather' , 'to do' , 'lunch', 'stocks', 'call', 'calendar', 'mirror', 'list', 'portfolio'];
var grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ' ;'
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;
//Speech Functions
recognition.onresult = function(event) {
	diagnostic.innerHTML = '<i class="fa fa-microphone fa-1x" aria-hidden="true" onclick="recognition.start()"></i>';
	var last = event.results.length - 1;
	var output = event.results[last][0].transcript;
	
	switch (output){
	
	case 'weather':getWeather();				
	break;

	case 'list': getToDo();
	break;

	case 'lunch': getLunch();
	break;
			
	case 'stocks': getStocks();
	break;		

	case 'portfolio': getStocks();
	break;
			
	case 'uber': alert("uber");
	break;

	case 'calendar': recognition.onnomatch();
	break;

	default:  erroroutput.textContent = "Sorry, I do not recognize that command.";
}
	console.log(output);
	console.log('Confidence: ' + event.results[0][0].confidence);		
};
recognition.onstart = function() {
	erroroutput.innerHTML = "";
    diagnostic.innerHTML = '<i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i><span class="sr-only">Checking...</span>';
	console.log("Listening has started");
};
recognition.onspeechend = function() {
	diagnostic.innerHTML = '<i class="fa fa-microphone fa-1x" aria-hidden="true" onclick="recognition.start()"></i>';
  	recognition.stop();
  	console.log("Listening has stopped.");
}
recognition.onnomatch = function(event) {
  	erroroutput.textContent = "Sorry, I do not recognize that command.";
	console.log("Not recognized");
}

recognition.onerror = function(event) {
	diagnostic.innerHTML = '<i class="fa fa-microphone fa-1x" aria-hidden="true" onclick="recognition.start()"></i>';
	erroroutput.textContent = 'Error occurred in recognition: ' + event.error;
}
//Weather Block
function getWeather(){
	var weatherdiv =  document.getElementById('theweather');
	
	if (weatherdiv === null)
		{
 			var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22mitaka%2C%20jp%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";	
			$.getJSON( url, function(json){	
				//Current Temperature
				var currenttemp = json.query.results.channel.item.condition.temp;	
				//Weather Forcast
				var hightemp = json.query.results.channel.item.forecast[0].high;
				var lowtemp = json.query.results.channel.item.forecast[0].low;
				var weathericon = json.query.results.channel.item.condition.code;
				var description = json.query.results.channel.item.condition.text;
				weatherView(currenttemp, weathericon, description, hightemp, lowtemp);
			});
			function weatherView(currenttemp, weathericon, description, hightemp, lowtemp){	
			var weatherdiv = '<div id="theweather" class="cardtop">';
			weatherdiv += '	  <div class="flex-item thin xlarge">';			
			weatherdiv += '		<section class="border">' + currenttemp + '°</section>';
			weatherdiv += '	  </div>';
			weatherdiv += '	  <div class="medium flex-item" style="padding-left:5px;">';
			weatherdiv += '		<section class="small"><i class="wi wi-yahoo-'+weathericon+'"></i> '+description+'</section>';
			weatherdiv += '		<section class="small">H: '+hightemp+'°  L:'+lowtemp+'° </section>';
			weatherdiv += '	  </div>';
			weatherdiv += ' </div>';
			requestedcontent.innerHTML = weatherdiv;	
			}
		}
};

//ToDo Block
function getToDo(){
	requestedcontent.innerHTML = "This is the To Do list";
};

// Lunch Block
function getLunch(){
	requestedcontentcenter.innerHTML = '<iframe scrolling="yes"  height="500px" width="800px" src="https://docs.google.com/presentation/d/1tmseOgciRAqNMNUAMh-faaLZHRKCuUxHj5aI5XUVTjk/edit#slide=id.g17e223b1f1_0_3"></iframe>';
};

// Mirror Block
function showMirror(){
	document.body.style.background = "#000";
	console.log(document.body.style.backgroundColor);
};

// Calendar Block
function getCalendar(){
  clearPanel();
  checkAuth();
  /**
   * Check if current user has authorized this application.
   */
  function checkAuth() {
	gapi.auth.authorize(
	  {
		'client_id': CLIENT_ID,
		'scope': SCOPES.join(' '),
		'immediate': true
	  }, handleAuthResult);
  }
  /**
   * Handle response from authorization server.
   *
   * @param {Object} authResult Authorization result.
   */
  function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
	  loadCalendarApi();
	} else {
	  // Show auth UI, allowing the user to initiate authorization by
	  // clicking authorize button.
	  requestedcontent.innerHTML = '<div id="authorize-div" style="display: none"><span>Authorize access to Google Calendar API</span><!--Button for the user to click to initiate auth sequence --><button id="authorize-button" onclick="handleAuthClick(event)">Authorize</button></div>';
	}
  }
  /**
   * Initiate auth flow in response to user clicking authorize button.
   *
   * @param {Event} event Button click event.
   */
  function handleAuthClick(event) {
	gapi.auth.authorize(
	  {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
	  handleAuthResult);
	return false;
  }
  /**
   * Load Google Calendar client library. List upcoming events
   * once client library is loaded.
   */
  function loadCalendarApi() {
	gapi.client.load('calendar', 'v3', listUpcomingEvents);
  }
  /**
   * Print the summary and start datetime/date of the next ten events in
   * the authorized user's calendar. If no events are found an
   * appropriate message is printed.
   */
  function listUpcomingEvents() {
	var request = gapi.client.calendar.events.list({
	  'calendarId': 'primary',
	  'timeMin': (new Date()).toISOString(),
	  'showDeleted': false,
	  'singleEvents': true,
	  'maxResults': 10,
	  'orderBy': 'startTime'
	});
	request.execute(function(resp) {
	  var events = resp.items;
	  appendPre('Upcoming events:');
	  if (events.length > 0) {
		for (i = 0; i < events.length; i++) {
		  var event = events[i];
		  var when = event.start.dateTime;
		  if (!when) {
			when = event.start.date;
		  }
		  appendPre(event.summary + ' (' + when + ')')
		}
	  } else {
		appendPre('No upcoming events found.');
	  }
	});
  }
  /**
   * Append a pre element to the body containing the given message
   * as its text node.
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
	var h = document.createElement("p");
	var textContent = document.createTextNode(message);
	h.appendChild(textContent);                          
	requestedcontent.appendChild(h); 
  }
};

function clearPanel() {                         
	requestedcontent.innerHTML = ""; 
};

//News Block
function getNews(){
	
	var newsendpoint = 'https://newsapi.org/v1/articles?source=techcrunch&apiKey=ede3c9fa2a234e38a8e7d4e447fc7724';
	var newsurl = newsendpoint;
	var newsheadline =  null;
	var newsarticle =  null;
	var newssource =  null;
	var newstime = null;
	
	$.ajax({
			type: 'GET',
			url: newsurl,
			dataType: 'json',
			success: function (data) {
				//resolve(data);
				console.log(data);
				var newsheadline =  data.articles[0].title;
				var newsarticle =  data.articles[0].description;
				var newssource =  data.source;
				var newstime = data.articles[0].publishedAt;
				
				requestedcontentright.innerHTML = newsheadline + "<br>" +newstime+ "<br>" +newsarticle+ "<br>" +newssource;
			},
			error: function(data) {
         		console.log(data);
      		}
		}); 
};

function getStocks () {
	//Load stock data
	var stockpromises = symbols.map(fetchStockQuotes);
	Promise.all(stockpromises).then(function(jsonstocks){
		stockView(jsonstocks);
	}).catch(function(jsonstocks){
		console.log("Error fetching some stocks" + jsonstocks);
	});
}
function fetchStockQuotes (symbols) {
	var endpoint = 'https://www.google.com/finance/info?q=';
	var quoteurl = endpoint+symbols;
	return new Promise(function(resolve, reject){
		$.ajax({
			type: 'POST',
			url: quoteurl,
			dataType: 'jsonp',
			success: function (data) {
				resolve(data);
			},
			error: function(data) {
         		reject(data);
      		}
		}); 
	});
	}
function stockView(stockdata){
	for (var i=0; i<stockdata.length; i++){
		var symbol = stockdata[i][0].t;
		var pricechange = stockdata[i][0].c;
		var lastprice = stockdata[i][0].l;
		var stockdiv = '<div>';
		stockdiv += ' <div>';			
		stockdiv += symbol + ' ';
		if (pricechange>0){
			stockdiv += '<span class="green">' + pricechange+'</span>' + ' ';
		}else if (pricechange<0){
			stockdiv += '<span class="red">' + pricechange+'</span>' + ' ';
		} else {
			stockdiv += pricechange + ' ';
		}
		stockdiv += lastprice;
		stockdiv += ' </div>';
		stockdiv += ' </div>';
		requestedcontent.innerHTML += stockdiv;	
	}
}

//Run Once Document Is Ready
$(document).ready(function(){
	time = $('#time');
	today = $('#date');
    update();
	idleLogout();
	setInterval(update, 1000);
	getStocks();
	getWeather();
	getNews();
});
