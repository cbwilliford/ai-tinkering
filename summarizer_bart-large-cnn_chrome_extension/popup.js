chrome.runtime.sendMessage({ message: "Summarize" });



chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  console.log(message.summary)

  document.getElementById('summary-container').textContent = message.summary





});
