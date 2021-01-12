chrome.browserAction.onClicked.addListener(function(tab){
	chrome.browserAction.setBadgeText({
		text: "..."
	});

	chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl){

		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("username", localStorage["username"]);
		formData.append("email", localStorage["email"]);
		formData.append("password", localStorage["password"]);
		formData.append("img", dataUrl);

		// check wether extension runs against production or dev API.
		if(localStorage['endpoint'] === 'true'){
			xhr.open("POST", "http://localhost:3000/upload", true);
		} else {
			xhr.open("POST", "https://api.bitfondue.com/upload", true);
		}

		chrome.tabs.getSelected(null, function(tab){
			formData.append("tab_info", JSON.stringify(tab));

			console.log(tab.id);


			// FETCH CONTENT FROM CURRENT TAB
			chrome.tabs.sendRequest(tab.id, {method: "getHTML"}, function(response){
				console.log(response);
				console.log(response.method);
				if(response.method == "getHTML"){
					formData.append("html", response.data);

					console.log('appended the html');
					xhr.onreadystatechange = function(){
						console.log(xhr.readyState);
						if(xhr.readyState == 4){
							chrome.browserAction.setBadgeText({
								text: "ok"
							});

							setTimeout(function(){
								chrome.browserAction.setBadgeText({
									text: ""
								})
							}, 2000);
						}
					};

					var sendPage = function(formData) {
						xhr.send(formData);
						console.log('sent the request');
					};

					// if (navigator.geolocation) {
					// 	navigator.geolocation.getCurrentPosition(function(position){
					// 		console.log(position);
					// 		formData.append('geolocation', JSON.stringify(position));
					// 		sendPage(formData);
					// 	}, function(positionError){
					// 		console.log(positionError);
					// 		sendPage(formData);
					// 	});
					// } else {
					// 	console.log('geolocation not supported');
					// 	sendPage(formData);
					// }

					console.log('geolocation not supported for now');
					sendPage(formData);
				}
			});
		});
	});
});
