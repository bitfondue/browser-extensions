chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
	if(request.method == "getHTML"){
		sendResponse({
			data: document.all[0].outerHTML,
			method: "getHTML"
		})
	}
});