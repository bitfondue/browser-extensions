browser.browserAction.onClicked.addListener(function (tab) {
  browser.browserAction.setBadgeText({
    text: "...",
  });

  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  // formData.append("username", localStorage["username"]);
  // formData.append("email", localStorage["email"]);
  // formData.append("password", localStorage["password"]);

  // fetching the screenshot

  function onScreenshotCaptured(dataUrl) {
    console.log(dataUrl);
    formData.append("img", dataUrl);
    return Promise.resolve();
  }

  function onError(error) {
    console.log(`Error: ${error}`);
    return Promise.reject();
  }

  // let capturingScreenshot = browser.tabs.captureVisibleTab().then(onScreenshotCaptured, onError);

  // fetching the HTML

  function onHtmlCaptured(response) {
    console.log(response);
    formData.append("html", response.data);
    return Promise.resolve();
  }

  // let fetchingHTML = browser.tabs.sendMessage(tab.id, {method: "getHTML"});
  // fetchingHTML.then(onHtmlCaptured, onError);

  // fetch content from the current tab
  function onTabInformationCaptured(tabs) {
    // tabs[0].url requires the `tabs` permission or a matching host permission.
    console.log(tabs[0].url);
    console.log(tabs);
    formData.append("tab_info", JSON.stringify(tabs[0]));
    return Promise.resolve();
  }

  // let querying = browser.tabs.query({currentWindow: true, active: true});

  let gatheringActions = [
    browser.tabs.captureVisibleTab().then(onScreenshotCaptured, onError),
    browser.tabs
      .sendMessage(tab.id, { method: "getHTML" })
      .then(onHtmlCaptured, onError),
    browser.tabs
      .query({ currentWindow: true, active: true })
      .then(onTabInformationCaptured, onError),
  ];

  Promise.all(gatheringActions).then((values) => {
    console.log("prepared the request, sending it to the server...");

    xhr.open("POST", "http://localhost:8085/upload", true);
    // xhr.open("POST", "https://api.bitfondue.com/upload", true);
    xhr.onreadystatechange = () => {
      console.log(xhr.readyState);
      if (xhr.readyState == 4) {
        browser.browserAction.setBadgeText({
          text: "ok",
        });

        setTimeout(function () {
          browser.browserAction.setBadgeText({
            text: "",
          });
        }, 2000);
      }
    };
    xhr.onerror = () => {
      console.log("we got an error while trying save the chunk.");
    };
    xhr.onloadend = (event) => {
      console.log(event);
    };
    xhr.send(formData);
    // const sendPage = function(formData) {
    // 	xhr.send(formData);
    // 	console.log('sent the request');
    // };

    // sendPage(formData)
  });

  // chrome.tabs.captureVisibleTab(null, {format: "png"}, function(dataUrl){

  // 	// check wether extension runs against production or dev API.
  // 	xhr.open("POST", "http://localhost:3000/upload", true);
  // 	// if(localStorage['endpoint'] === 'true'){
  // 	// 	xhr.open("POST", "http://localhost:3000/upload", true);
  // 	// } else {
  // 	// 	xhr.open("POST", "https://api.bitfondue.com/upload", true);
  // 	// }

  // 	chrome.tabs.getSelected(null, function(tab){
  // 		formData.append("tab_info", JSON.stringify(tab));

  // 		console.log(tab.id);

  // 		// FETCH CONTENT FROM CURRENT TAB
  // 		chrome.tabs.sendRequest(tab.id, {method: "getHTML"}, function(response){
  // 			console.log(response);
  // 			console.log(response.method);
  // 			if(response.method == "getHTML"){
  // 				formData.append("html", response.data);

  // 				console.log('appended the html');
  // 				xhr.onreadystatechange = function(){
  // 					console.log(xhr.readyState);
  // 					if(xhr.readyState == 4){
  // 						browser.browserAction.setBadgeText({
  // 							text: "ok"
  // 						});

  // 						setTimeout(function(){
  // 							browser.browserAction.setBadgeText({
  // 								text: ""
  // 							})
  // 						}, 2000);
  // 					}
  // 				};

  // 				var sendPage = function(formData) {
  // 					xhr.send(formData);
  // 					console.log('sent the request');
  // 				};

  // 				// if (navigator.geolocation) {
  // 				// 	navigator.geolocation.getCurrentPosition(function(position){
  // 				// 		console.log(position);
  // 				// 		formData.append('geolocation', JSON.stringify(position));
  // 				// 		sendPage(formData);
  // 				// 	}, function(positionError){
  // 				// 		console.log(positionError);
  // 				// 		sendPage(formData);
  // 				// 	});
  // 				// } else {
  // 				// 	console.log('geolocation not supported');
  // 				// 	sendPage(formData);
  // 				// }

  // 				console.log('geolocation not supported for now');
  // 				sendPage(formData);
  // 			}
  // 		});
  // 	});
  // });
});
