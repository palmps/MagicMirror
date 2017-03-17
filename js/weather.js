function getWeather(){
	var url = "http://api.openweathermap.org/data/2.5/forecast/daily?q=Tokyo,JP&units=imperial&cnt=1&APPID=76ec8c4300a74cf049aa8468f4516c48";
	$.getJSON( url, function(json){	
		//console.log(JSON.stringify(json));
		var weather1 = json.list[0].temp.min + "&#176; F / " + json.list[0].temp.max + "&#176; F";
		var weather2 = "<i class=\"owf owf-" + json.list[0].weather[0].id + "\"></i> " + json.list[0].weather[0].main;
		var display1 = '<div id="weather" class="container medium ">Weather <section class="small" id="temperature">' + weather1 + '</section> <section class="small" id="weather"></section> <section class="small" id="weathericon">' + weather2 + '</section><section class="small" id="weatherdescription"></section></div>';
	document.getElementById("panel").innerHTML = display1;
	});
};

/*//Call Weather
$( document ).ready(function() {
	getWeather();
});	*/
