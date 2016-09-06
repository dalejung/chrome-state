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


// store on navigation
chrome.webNavigation.onCompleted.addListener(function(details) {
  if(details.frameId != 0) {
    return;
  }
  store_window_id(details.tabId);
});

/*
 * Sites like facebook will do some JS magic and then update history state.
 * Have to use this hook to catch em.
 */
chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
  if(details.frameId != 0) {
    return;
  }
  log_navigation(details);
});


WINDOW_EVENTS = {};

function log_navigation(details) {
  chrome.tabs.get(details.tabId, function(tab) {
    var windowId = tab.windowId;
    if (!(windowId in WINDOW_EVENTS)) {
      WINDOW_EVENTS[windowId] = [];
    }
    WINDOW_EVENTS[windowId].push(details);
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


// grab tabs
chrome.tabs.query({}, tabs => {
  var url_state = {};
  tabs.forEach(tab => { 
    var state = {tabId: tab.id, url: tab.url, windowId: tab.windowId};
    url_state[state.tabId] = state;
  });
});
