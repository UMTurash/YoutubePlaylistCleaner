// background.js

function cleanYouTubeUrl(details) {
  const url = new URL(details.url);

  if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
    const searchParams = url.searchParams;

    // Check if URL contains 'radio' anywhere (path or params)
    const hasRadio = url.href.includes("radio");

    if (searchParams.has("list") && hasRadio) {
      searchParams.delete("list");

      const cleanUrl = `${url.origin}${url.pathname}`;
      const paramsString = searchParams.toString();

      const newUrl = paramsString ? `${cleanUrl}?${paramsString}` : cleanUrl;

      if (newUrl !== details.url) {
        chrome.tabs.update(details.tabId, { url: newUrl });
      }
    }
  }
}

chrome.webNavigation.onCompleted.addListener(cleanYouTubeUrl, {
  url: [{ hostEquals: "www.youtube.com", pathEquals: "/watch" }]
});

chrome.webNavigation.onHistoryStateUpdated.addListener(cleanYouTubeUrl, {
  url: [{ hostEquals: "www.youtube.com", pathEquals: "/watch" }]
});
