$(document).ready(function(){

	// on load
	$('#username').val(localStorage['username']);
	$('#password').val(localStorage['password']);

	// listen on the button click event
	$('button').click(function(){
		localStorage['username'] = $('#username').val();
		localStorage['password'] = $('#password').val();

		// showing an indicator that the settings have been saved.
		$('#status').text('Options saved.');
		setTimeout(function(){
			$('#status').text('');
		}, 750);
	});

});