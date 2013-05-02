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

/*
fs = require('fs');
var cred;
fs.readFile('twittercred.conf', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  eval(data);
  //console.log('credentials:'+cred);
});


//require();

//eval()
var twitter = require('ntwitter');

var twitterData;

var twit = new twitter(cred);

twit.search('nodejs OR #node', {}, function(err, data) {
	if(err){
		console.log('ERR')
		return;
	}
		twitterData = data;
	console.log(data);
});

*/

var my_http = require("http");
my_http.createServer(function(request,response){  
    console.log(request);  
    response.writeHeader(200, {"Content-Type": "text/plain"});  
    response.write(twitterData);  
    response.end();
	}).listen(8080);
console.log("Server Running on 8080");



