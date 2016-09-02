function change_window_id(windowId) {
   var re = /\[\[([0-9]+)\]\]$/;
   var oldTitle = document.title;
   if(!re.test(oldTitle)) {
     document.title = oldTitle + ` [[${windowId}]]`;
   }
}

// set up an observer for the title element
var target = document.querySelector('head > title');
var observer = new window.WebKitMutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var chrome_window_id = document.documentElement.getAttribute("chrome-window-id");
      if(chrome_window_id) {
        change_window_id(chrome_window_id);
      }
    });
});

observer.observe(target, { subtree: true, characterData: true, childList: true });
