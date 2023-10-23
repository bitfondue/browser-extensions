"use strict";

browser.runtime.onMessage.addListener((request) => {
	if(request.method == "getHTML"){
		return Promise.resolve({
			data: document.all[0].outerHTML,
			method: "getHTML"
		});
	}
});