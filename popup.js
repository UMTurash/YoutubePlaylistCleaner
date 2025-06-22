const toggle = document.getElementById("toggle-cleaner");

// Initialize checkbox state from storage
chrome.storage.local.get("enabled", (data) => {
  toggle.checked = data.enabled !== false;
  // Send initial state to background script
  chrome.runtime.sendMessage({ action: "setEnabled", enabled: toggle.checked });
});

// Listen for toggle changes and notify background immediately
toggle.addEventListener("change", () => {
  const enabled = toggle.checked;
  chrome.runtime.sendMessage({ action: "setEnabled", enabled: enabled });
});
