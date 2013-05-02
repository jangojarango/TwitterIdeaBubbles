$(function(){
	
	var dia = 100;
	var $idea = $('<div class="idea"></div>').width(dia).height(dia);
	var $body = $('body');
	var speed = 40;
	var damp = 0.99;
	var rate = 200;
	var minspeed = 0.6;
	var hitrate = function(){
		var x = $('.idea').length;
		var m = -1/(max_population-min_pop);
		var c = 1+min_pop/(max_population-min_pop);
		//console.log(x,m,c,m*x+c);
		return m*x + c;
	};
	var max_population = 20;
	var min_pop = 2;
	var max_characters = 10;
	var max_ideas_listed = 15;
	
	
	//var seeds = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var seeds = ['makerFaireUK','CultureLab'];
	
	//begin of AJR edits	
	var tweetsReceived=0;
	var i =0;
	//$(document).ready(handler)
	$(".queryInput").change(function (e){
		//console.log('lalala');
		var userInput=$(".queryInput").val();
		getWordsFromTweets(userInput);
		
	});
	
	function getWordsFromTweets(q){
		var url='https://10.67.33.245:443/search.json?q='+encodeURIComponent(q);
		var data;
		var blacklist= ['http','@'];
		var words = q.split(' ');	//start off by having the first word of the twitter query in the list of words
		
		$.getJSON(url, function (data_,status){
			data=data_;
			console.log('status: '+data);
			console.log('data length: '+data.results.length);
			tweetsReceived= data.results.length;
								
			for(var i=0;i<tweetsReceived;i++){	//for each tweet received
				//words.push(data.results[i].from_user);	//also add the user to the seed pool
				//console.log(data.results[i].from_user);
				var txt=data.results[i].text.split(' ');
				for(var j=0;j<txt.length;j++){ 
					words.push(txt[j]);		////get each word
				}
			}
			
			//console.log('words:/n'+JSON.stringify(words));
			//seeds.concat(words);
			seeds = words;
			


			//return words;
				
		});
	}
	
	setInterval(function(){
		//if (Math.random()>hitrate()) return;
		var rx = Math.random()*$(window).width();
		var ry = Math.random()*$(window).height();
		seeds.push('Newcastle Uni'); //populate the dicitionary with words
		seeds.push('CultureLab');
		spawn({clientX:rx,clientY:ry});
		 
	}, 15000);
	
	
	function cut(str, cutStart, cutEnd){
		return str.substr(0,cutStart) + str.substr(cutEnd+1);
	}
	/** Function count the occurrences of substring in a string;
	 * @param {String} string   Required. The string;
	 * @param {String} subString    Required. The string to search for;
	 * @param {Boolean} allowOverlapping    Optional. Default: false;
	 */
	function occurrences(string, subString, allowOverlapping){

		string+=""; subString+="";
		if(subString.length<=0) return string.length+1;

		var n=0, pos=0;
		var step=(allowOverlapping)?(1):(subString.length);

		while(true){
			pos=string.indexOf(subString,pos);
			if(pos>=0){ n++; pos+=step; } else break;
		}
		return(n);
	}
	
	//end of AJR edits
	
	
	
	// interaction functions
	function spawn(e,word) {

		var population = $('.idea').length;
		
		var x = e.clientX;
		var y = e.clientY;
		
		//if (word == undefined) {
			var r = Math.floor(Math.random()*seeds.length);	//pick random word from seed
			word = seeds[r];
			
			for(var i = seeds.length; i--;){
				if (seeds[i] === word) 
					seeds.splice(i, 1); //remove from seeds array
			}
			
		//}
		
		var $new = $idea.clone();
		$new
			.css({left:(x-dia/2),top:(y-dia/2)})
			.data('momentum', {x:Math.random()*10-5,y:Math.random()*10-5})
			.text(word)
			.addClass('hit')
			.addClass('new')
			.appendTo($body);
		setTimeout(function(){
			$new.removeClass('hit');
			$new.removeClass('new');
		},1000);
		

	}
	
	// listen for 'ideas'
	function idea() {
		// iterate all objects
		var $ideas = $('.idea');
		$ideas.each(function(){
			// edge detect
			var $this = $(this);
			var o = $this.offset();
			var width = $(window).width();
			var height = $(window).height();
			var d;
			if (o.left>width-dia) {
				// change momentum
				d = $this.data('momentum');
				d.x = -Math.abs(d.x);
			} else
			if (o.left<0) {
				// change momentum
				d = $this.data('momentum');
				d.x = Math.abs(d.x);
			}
			if (o.top>height-dia) {
				// change momentum
				d = $this.data('momentum');
				d.y = -Math.abs(d.y);
			} else
			if (o.top<0) {
				// change momentum
				d = $this.data('momentum');
				d.y = Math.abs(d.y);
			}
			
			if ($this.hasClass('hit')) return;
			$ideas.not($this).each(function(){
				// collision detect
				var $that = $(this);
				if ($that.hasClass('hit')) return;
				// done before?
				var phrase = ($this.text() + '' + $that.text() ). substring(0,10);
				
				var p = $that.offset();
				var d = {x:Math.abs(o.left-p.left),y:Math.abs(o.top-p.top)};
				var dist = Math.sqrt(Math.pow(d.x,2)+Math.pow(d.y,2));
				
				if (dist < dia) {
				
					// moving apart?
					var a = $this.data('momentum');
					var b = $that.data('momentum');
					var new_a_x = o.left + a.x;
					var new_a_y = o.top  + a.y;
					var new_b_x = p.left + b.x;
					var new_b_y = p.top  + b.y;
					var new_dist = Math.sqrt(
						Math.pow(new_a_x-new_b_x,2)+
						Math.pow(new_a_y-new_b_y,2));
					//console.log(new_dist,dist);
					if (new_dist > dist) return;
				
					// collision
					collide($this,$that);
					
					$this.addClass('hit');
					$that.addClass('hit');
					
					a = $this.data('momentum');
					b = $that.data('momentum');
					$this.data('momentum',{x:b.x,y:b.y});
					$that.data('momentum',{x:a.x,y:a.y});
					
					setTimeout(function(){
						$this.removeClass('hit');
						$that.removeClass('hit');
					},200);
				} else {
				}
			});
		});
	}
	setInterval(idea,rate);
	
	function collide($this, $that) {
		
		// should we fertilise?
		//if(seeds.length>5)	//auto-refresh ?
			if ( Math.random()>hitrate() ) 
				return;
		
		// generate new word
		var word_a = $this.text();
		var word_b = $that.text();
		var a_left = ($this.offset().left<$that.offset().left);
		var new_word;
		if (a_left)
			new_word = (word_a + ' ' + word_b);//.substring(0,max_characters);
		else
			new_word = (word_b + ' ' + word_a);//.substring(0,max_characters);
		
		
		// get center of collision
		var a = $this.offset();
		var b = $that.offset();
		var x = (a.left+b.left)/2+dia/2;
		var y = (a.top+b.top)/2+dia/2;
		
		
		if($('.collisionPoint').length>5){
			$('.collisionPoint').children().first().remove();
		}
		

		var $collisionText= $('<div class="collisionPoint"></div>');
		$collisionText
			.css({left:x,top:y,position:'absolute'})
			.attr('id','fadeLametext' + (++i))
			
			.text($this.text()+' '+$that.text())
			.click(function(e){
				var collText = $(e.target).text();
				//alert('washere!');
				console.log('now searching for: '+ collText);
				$('.queryInput').val(collText);
				getWordsFromTweets(collText);
			})
			.appendTo($body)
			.fadeOut(10000,function(){
				//.remove(); //WIP
				$(this).remove();
			});
		
		console.log('Words Left in Pool: '+seeds.length);
		
		spawn({clientX:x,clientY:y},new_word);// spawn new bubble
		//spawn({clientX:x,clientY:y});// spawn new bubble
		//WIP
		//clear list of words
		//select language
		//pixelphones
	}
	
	// animate
	function animate() {
		// iterate all objects
		$('.idea').each(function(){
			var $this = $(this);
			var o = $this.offset();
			var d = $this.data('momentum');
			var population = $('.idea').length;
			if (population > min_pop & Math.abs(d.x)+Math.abs(d.y)<minspeed) {
				$this.remove();
				return;
			}
			$this.css({left:(o.left+speed*d.x),top:(o.top+speed*d.y)});
			
			d.x = d.x*damp;
			d.y = d.y*damp;
		});
	}
	setInterval(animate,rate);
	
	$('body').keydown(function(){
		console.log('keydown');
		$('.queryInput').focus();
	});
	$('.queryInput').submit(function(){
		var $this = $(this);
		var query = $this.val();
		// do something with input
		$this.val('');
	});
	// clear box on click
	$('.queryInput').click(function(){
		$(this).val('');
	});
	// attach newBubbleClick
	$body.click(spawn);
			
});