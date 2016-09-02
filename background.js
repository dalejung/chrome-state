function update_tabs_with_windows() {
  /*
   * Add [[windowId]] to the title of all web tabs.
   * This is so external programs can match gui windows to chrome
   * window ids.
   */
  chrome.tabs.query({},
    function(tabs){
     tabs.forEach(function(tab) {
       var windowId = tab.windowId;
       var code = `
         var re = /\\\[\\\[([0-9]+)\]\]$/;
         var oldTitle = document.title;
         if(!re.test(oldTitle)) {
           document.title = oldTitle + " [[${windowId}]]";
         }
       `;
       if(tab.url.startsWith("http")) {
         chrome.tabs.executeScript(tab.id,{"code":code});
       }
     })
    }
  );
}

update_tabs_with_windows();

chrome.webNavigation.onCompleted.addListener(function(details) {
  update_tabs_with_windows();
});
