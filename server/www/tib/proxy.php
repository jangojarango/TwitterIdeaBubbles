<?php
	ini_set('display_errors', 1);
	require_once('TwitterAPIExchange.php');
	require_once('credentials.php');
/*
	// Set access tokens here - see: https://dev.twitter.com/apps/
	$settings = array(
		'oauth_access_token' => "",
		'oauth_access_token_secret' => "",
		'consumer_key' => "",
		'consumer_secret' => ""
	);
*/
	/** URL for REST request, see: https://dev.twitter.com/docs/api/1.1/ **/
	$url = 'https://api.twitter.com/1.1/search/tweets.json';
	$requestMethod = 'GET';

	/** POST fields required by the URL above. See relevant docs as above **/
	$postfields = array(
		'screen_name' => 'usernameToBlock', 
		'skip_status' => '1'
	);

	/* Perform a POST request and echo the response **
	$twitter = new TwitterAPIExchange($settings);
	echo $twitter->buildOauth($url, $requestMethod)
				 ->setPostfields($postfields)
				 ->performRequest();
	*/
	/** Perform a GET request and echo the response **/
	/** Note: Set the GET field BEFORE calling buildOauth(); **/
	$url = 'https://api.twitter.com/1.1/search/tweets.json';
	$getfield = '?'.$_SERVER['QUERY_STRING'];
	$requestMethod = 'GET';
	$twitter = new TwitterAPIExchange($settings);
	echo $twitter->setGetfield($getfield)
				 ->buildOauth($url, $requestMethod)
				 ->performRequest();
	
	$myFile = "searches.txt";
	$fh = fopen($myFile, 'a') or die("can't open file");
	$stringData = time().' '.$getfield."\n";
	fwrite($fh, $stringData);
	fclose($fh);
?>