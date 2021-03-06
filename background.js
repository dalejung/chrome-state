/*
 *
 * TODO
 *
 * 1. Write a function to create a current manifest of all tabs/urls/windows.
 * 2. Write a system that keeps track of history. Basically, a running list of
 * sites I've visited.
 * 3. Ability to persist this to FS so external things can read it.
 */

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
    details['windowId'] = windowId;
    WINDOW_EVENTS[windowId].push(details);
  });
}

// grab tabs
chrome.tabs.query({}, tabs => {
  var url_state = {};
  tabs.forEach(tab => { 
    var state = {tabId: tab.id, url: tab.url, windowId: tab.windowId};
    url_state[state.tabId] = state;
  });
});
