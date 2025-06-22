let enabled = true; // default

// Load the saved state on startup
chrome.storage.local.get("enabled", (data) => {
  if (data.enabled === false) {
    enabled = false;
  }
});

// Listen for messages from popup to update enabled state
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "setEnabled") {
    enabled = message.enabled;
    // Save to storage as well (optional, but sync here too)
    chrome.storage.local.set({ enabled: enabled });
    sendResponse({ status: "ok" });
  }
});

function cleanYouTubeUrl(details) {
  if (!enabled) {
    // Cleaner disabled, do nothing
    return;
  }

  const url = new URL(details.url);

  if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
    const searchParams = url.searchParams;

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
  url: [{ hostEquals: "www.youtube.com", pathEquals: "/watch" }],
});

chrome.webNavigation.onHistoryStateUpdated.addListener(cleanYouTubeUrl, {
  url: [{ hostEquals: "www.youtube.com", pathEquals: "/watch" }],
});
