Tracer = function(){
	var messages = "";
	var messageCount = 0;
	function log(p_message,p_origin){
		messageCount++;
				
		var origin = '';
		if(p_origin)
			origin = p_origin;
			
		//var message = messageCount + '. ' + origin + ':::' + p_message;	
		var message = p_message;
		
		try{
			console.log(message);
		}
		catch(err){}
		
		messages += '\n' + message;
	}
	return {log:log}
}
