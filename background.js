chrome.browserAction.onClicked.addListener(function(tab){
	chrome.browserAction.setBadgeText({
		text: "..."
	});

	chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl){

		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("username", localStorage["username"]);
		formData.append("password", localStorage["password"]);
		formData.append("img", dataUrl);

		xhr.open("POST", "https://bitfondue-api.herokuapp.com/upload", true);
		// xhr.open("POST", "http://localhost:5000/upload", true);

		chrome.tabs.getSelected(null, function(tab){
			formData.append("tab_info", JSON.stringify(tab));

			console.log(tab.id);


			// FETCH CONTENT FROM CURRENT TAB
			chrome.tabs.sendRequest(tab.id, {method: "getHTML"}, function(response){
				console.log(response);
				if(response.method == "getHTML"){
					formData.append("html", response.data);

					xhr.onreadystatechange = function(){
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

					navigator.geolocation.getCurrentPosition(function(position){
						console.log(position);
						formData.append('geolocation', JSON.stringify(position));
						xhr.send(formData);
					}, function(positionError){
						console.log(positionError);
						xhr.send(formData);
					});
				}
			});
		});		
	});
});