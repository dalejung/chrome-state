function store_window_id(tab_id) {
  chrome.tabs.get(tab_id, function(tab) {
    var windowId = tab.windowId;
    var code = `
      document.documentElement.setAttribute("chrome-window-id", ${windowId});
      document.title = document.title; // hack to call the title change event
    `;
    if(tab.url.startsWith("http")) {
      chrome.tabs.executeScript(tab.id,{"code":code});
    }
  });
}

// set window id on load
chrome.tabs.query({},
  function(tabs){
   tabs.forEach(function(tab) {
     store_window_id(tab.id);
   })
  }
);

// store on navigation
chrome.webNavigation.onCompleted.addListener(function(details) {
  store_window_id(details.tabId);
});
