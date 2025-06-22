chrome.webNavigation.onCompleted.addListener((details) => {
  const url = new URL(details.url);

  // Only affect youtube.com/watch pages
  if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
    const listIndex = url.href.indexOf("&list=");
    if (listIndex !== -1) {
      // Strip off '&list=' and everything after it
      const cleanUrl = url.href.substring(0, listIndex);

      chrome.tabs.update(details.tabId, { url: cleanUrl });
    }
  }
});
