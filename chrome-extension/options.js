$(document).ready(function(){

	// on load
	$('#username').val(localStorage['username']);
	$('#email').val(localStorage['email']);
	$('#password').val(localStorage['password']);
	if(localStorage['endpoint'] === 'true'){
		$('#endpoint').prop('checked', true);
	} else {
		$('#endpoint').prop('checked', false);
	}

	// listen on the button click event
	$('button').click(function(){
		localStorage['username'] = $('#username').val();
		localStorage['email'] = $('#email').val();
		localStorage['password'] = $('#password').val();

		if($('#endpoint').prop('checked') === true){
			localStorage['endpoint'] = 'true';
		} else {
			localStorage['endpoint'] = 'false';
		}

		// showing an indicator that the settings have been saved.
		$('#status').text('Options saved.');
		setTimeout(function(){
			$('#status').text('');
		}, 750);
	});

});