$(document).ready(function() {
	forecastURL = "https://api.forecast.io/forecast/70b53628cced964b00ea05264cd141a9/35.6895,139.69173";
	
	$.ajax({
		url: forecastURL,
		jsonpCallback: 'jsonCallback',
		contentType: "application/json",
		dataType: 'jsonp',
		success: function(json) {
			var cDate = new Date();
			var cTimezone = json.timezone;
			var cIcon = iconCheck(json.currently.icon, cDate);
			
			var cTemperature = json.currently.temperature;
			var cSummary = json.currently.summary;
			
			$("#current_location").html(cTimezone);
			$("#current_temp").html("<img src='images/tick/" + cIcon + ".png'  height='45' width='45'>&nbsp;" + fahrenheitToCelcius(cTemperature) + "&#176;C");
			$("#current_summary").html(cSummary);
			$("#current_time").html("At " + cDate.getHours() + ":" + pad(cDate.getMinutes()) + " it will be:")
			
			var dailyJson = json.daily;
			var hourlyJson = json.hourly;
			
			// Set the Hourly Page
			for (i = 0; i < 24; i++) {
				var hDate = new Date(hourlyJson.data[i].time*1000);
				
				var hHour, hIcon, hSummary, hTemp;
				hHour = formatAMPM(hDate.getHours());
				hIcon = iconCheck(hourlyJson.data[i].icon, hDate);
				hSummary = hourlyJson.data[i].summary;
				hTemp = fahrenheitToCelcius(hourlyJson.data[i].temperature) + "&#176;C";
				var listBuilder = "<li>" 
				+ hHour + "&emsp;"
				+ "<img src='images/tick/" + hIcon + ".png'  height='25' width='25'>"
				+"</li>";
				//$("#hourly_forecast").append("<li><span style='display:inline-block; background-color:red; width:45px;'>" + hHour + "</span><span><img src='images/tick/" + hIcon + ".png'  height='30' width='30'></span>" +  "</li>")
				$("#hourly_forecast").append("<li><span style='display:inline-block; width:55px; font-size:20px;'>" + hHour + "</span>"
				+ "<span style='display:inline-block; width:40px;'><img src='images/tick/" + hIcon + ".png'  height='35' width='35'></span>"
				+ "<span style='display:inline-block; width:130px; font-size:18px;'>" + hSummary + "</span>"
				+ "<span style='display:inline-block; font-size:20px; float:right; margin-bottom:0px'>" + hTemp  + "</span>"
				+ "</li>")
			}
			if ( $('#hourly_forecast').hasClass('ui-listview')) {
				$('#hourly_forecast').listview('refresh');
			}
			else {
			}
			
			// Set the Daily Page
			for (i = 0; i < 7; i++) {
				var dDate = new Date(dailyJson.data[i].time*1000);
				
				var dDay, dIcon, dSummary, dTemp;
				dDay = weekday[dDate.getDay()];
				dIcon = iconCheck(dailyJson.data[i].icon, dDate);
				dSummary = dailyJson.data[i].summary;
				dTemp = fahrenheitToCelcius(dailyJson.data[i].temperature) + "&#176;C";
				
				var listBuilder = "<li>" 
				+ hHour + "&emsp;"
				+ "<img src='images/tick/" + hIcon + ".png'  height='25' width='25'>"
				+"</li>";
				//$("#hourly_forecast").append("<li><span style='display:inline-block; background-color:red; width:45px;'>" + hHour + "</span><span><img src='images/tick/" + hIcon + ".png'  height='30' width='30'></span>" +  "</li>")
				$("#daily_forecast").append("<li><span style='display:inline-block; width:45px;'><img src='images/tick/" + dIcon + ".png'  height='35' width='35'></span>"
				+ "<span style='display:inline-block; width:115px; font-size:20px;'>" + dDay + "</span>"
				+ "<span style='display:inline-block; font-size:20px; float:right; margin-bottom:0px'>" + hTemp  + "</span>"
				+ "</li>")
			}
			if ( $('#daily_forecast').hasClass('ui-listview')) {
				$('#daily_forecast').listview('refresh');
			}
			else {
			}

		},
		error: function(e) {
		   console.log(e.message);
		}
	});
});

function pad(n) { 
	return ("0" + n).slice(-2); 
}

function loadWeather(currentCoords){
	console.log(currentCoords);
	
};

function fahrenheitToCelcius(fTemperature){
	var cTemp = Math.round((fTemperature - 32) * 5 / 9);
	return cTemp;
}

var icons = {	
	"clear-day" : "B", 
	"clear-night" : "C", 
	"rain" : "R", 
	"snow" : "G", 
	"sleet" : "X", 
	"wind" : "S", 
	"fog" :"N", 
	"cloudy" : "Y",
	"partly-cloudy-day" : "H", 
	"partly-cloudy-night" : "I"
};

var weekday = new Array(7);
weekday[0]=  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

function formatAMPM(hour) {
	var returnHour;
	var dd = "AM";
	if (hour >= 12) {
		hour = hour-12;
		dd = "PM";
	}
	if (hour == 0) {
		hour = 12;
	}
	returnHour = hour + dd;
	return returnHour;
}

function iconCheck(icon, date) {
	var returnIcon = icon;
	if(icon == "fog" || icon == "wind"){
		if(date.getHours() >= "18"){
			returnIcon = icon + "P";
		} else {
			returnIcon = icon + "A";
		}
	} else {
		returnIcon = icon;
	}
	
	return returnIcon;
}

function loadCity(city){
	if (city.toLowerCase() == "current location") {
		if ( navigator.geolocation )
			navigator.geolocation.getCurrentPosition(loadWeather,loadDefaultCity,hourlyForecast);
		else {
			loadDefaultCity();
		}

	} else {
		loadWeather(cities[city.toLowerCase()]);
	}
}

 
