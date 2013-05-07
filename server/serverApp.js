/*
var request = require("request");

var url = 'https://search.twitter.com/search.json?q=';
var q = 'TEST'
var resultsObj;

function getTwitter(queryString){
	queryString = encodeURIComponent(queryString);
	request.get('https://search.twitter.com/search.json?q='+q, function (err, res, body) {
		if (!err) {
			resultsObj = JSON.parse(body);
			
			
		}
	});
	return resultsObj;
}

*/
//read twitter API credentials form file
var fs = require('fs');
var cred;
fs.readFile('twittercred.conf', 'utf8', function (err,data_) {
  if (err) {
    return console.log(err);
  }
  eval(data_);
  //console.log('credentials:'+cred);
});

//get tweets
//var twitter = require('ntwitter');
var twitterData;
var twit = new require('ntwitter')(cred);
var my_http = require("http");
my_http.createServer(function(request,response){  
	if(request.url.substring(0,13)==='/search.json?'){
		console.log('search query!');

	
		// get query string
		console.log('requestURL: '+request.url);
		
		var query = require('url').parse(request.url,true).query['q'];
		
		console.log('query to pass: ' + query);
		//console.log(query.substring(2));
		
		//make twitter call
		
		twit.search(encodeURIComponent(query), {}, function(err, data_) {
			if(err){
				console.log('ERR')
				return;
			}
			
			//write the response and send it
			response.writeHeader(200, {"Content-Type": "text/json"});  
			response.write(JSON.stringify(data_));
			response.end();
		});

		//console.log(response);
		
		//response.write('ehlo!');  
		//response.end();
	} else if(request.url.substring(0,12)==='/favicon.ico') {
		console.log('favicon requested');
		
		response.end();
		
		return;
	}
		
}).listen(8080);
console.log("Server Running on 8080");


/*
var app = express();
var express = require('express');
console.log('working at '+__dirname);
app.configure(function () {
    app.use(
        "/app", //the URL throught which you want to access to you static content
        express.static('www') //where your static content is located in your filesystem
    );
});
app.listen(3000); //the port you want to use

*/
