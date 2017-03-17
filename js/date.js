// JavaScript Document
var time = null,
	today = null;
	
var update = function () {
	time.html(moment().format('LTS'));
	today.html(moment().format('LL'));
};

$(document).ready(function(){
	time = $('#time');
	today = $('#date');
    update();
	setInterval(update, 1000);
});