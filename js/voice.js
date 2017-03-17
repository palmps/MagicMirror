var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var commands = [ 'weather' , 'todo' , 'lunch', 'uber', 'call', 'calendar', 'miror'];
var grammar = '#JSGF V1.0; grammar commands; public <commands> = ' + commands.join(' | ') + ' ;'

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;

//Setup variables for outputs
var diagnostic = document.querySelector('#results');
diagnostic.innerHTML= '';

recognition.onresult = function(event) {
		//diagnostic.innerHTML = '';
        console.log(event);
		var last = event.results.length - 1;
  		var output = event.results[last][0].transcript;

  		diagnostic.innerHTML = 'Result received: ' + output + '.';
	
            switch (output)
            {
               case 'weather': var myElement = document.querySelector("#weather");
							   myElement.style.display = "#D93600";
               break;
            
               case 'todo': alert("todo");
               break;
            
               case 'lunch': alert("lunch");
               break;
            
               case 'uber': alert("uber");
               break;
            
               case 'calendar': alert("calendar");
               break;
            
               default:  diagnostic.textContent = "Not a recognized command.";
            }
		
  		console.log('Confidence: ' + event.results[0][0].confidence);		
 };

recognition.onstart = function() {
    diagnostic.innerHTML = '<i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i><span class="sr-only">Checking...</span>';
	console.log("Listening has started");
};

recognition.onspeechend = function() {
  recognition.stop();
  console.log("Listening has stopped.")
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that command.";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}








  var CLIENT_ID = '478283679612-2d4usrlq7i6or15loo35rlm674i55vtf.apps.googleusercontent.com';
  var SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

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
	var authorizeDiv = document.getElementById('authorize-div');
	if (authResult && !authResult.error) {
	  // Hide auth UI, then load client library.
	  authorizeDiv.style.display = 'none';
	  loadCalendarApi();
	} else {
	  // Show auth UI, allowing the user to initiate authorization by
	  // clicking authorize button.
	  authorizeDiv.style.display = 'inline';
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
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
	var pre = document.getElementById('output');
	var textContent = document.createTextNode(message + '\n');
	pre.appendChild(textContent);
  }