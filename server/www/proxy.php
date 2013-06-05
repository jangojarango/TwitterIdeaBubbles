<?php 
	
	
	$ch = curl_init("http://search.twitter.com/search.json?".$_SERVER['QUERY_STRING']);
	
	curl_setopt($ch,CURLOPT_FOLLOWLOCATION,TRUE);
	curl_setopt($ch,CURLOPT_FRESH_CONNECT,TRUE);
	//curl_setopt($ch,CURLOPT_HEADER,TRUE);
	curl_setopt($ch, CURLOPT_VERBOSE, TRUE);
	
	curl_exec($ch);
	//print_r("\nRETURNED:\n".$ch);
	curl_close($ch);
	
	//print_r("\ntasty\n".$_SERVER['QUERY_STRING']);
	//print_r("\ntasty\n".json_encode($_SERVER));
	
?> 