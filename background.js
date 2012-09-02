chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl){

		var xhr = new XMLHttpRequest();
		var formData = new FormData();
		formData.append("img", dataUrl);

		// xhr.open("POST", "https://bitfondue-api.herokuapp.com/upload", true);
		xhr.open("POST", "http://localhost:5000/upload", true);

		chrome.tabs.getSelected(null, function(tab){
			formData.append("tab_info", JSON.stringify(tab));

			console.log(tab.id);


			// FETCH CONTENT FROM CURRENT TAB
			chrome.tabs.sendRequest(tab.id, {method: "getHTML"}, function(response){
				console.log(response);
				if(response.method == "getHTML"){
					formData.append("html", response.data);
					xhr.send(formData);
				}
			});
		});		
	});
});