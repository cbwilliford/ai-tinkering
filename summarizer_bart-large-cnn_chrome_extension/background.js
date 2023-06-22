
// THIS IS JUST FOR PLAY
// Paste api key below but only use it locally.
const API_TOKEN = ''


const summarize = async (input) => {

  const body = {
    inputs: input,
    parameters: {
      max_length: 100
    }
  }

  const response = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
          method: "POST",
          body: JSON.stringify(body),
      }
  );

  const result = await response.json();
  return result;
}




const getSourceText = async tabData => {
  const { url, id } = tabData;
  if (!url.startsWith('http') || url === '') return tabData; // Only inject script on sites
  try {
    const source = await chrome.scripting.executeScript({
      target: { tabId: id },
      func: () => document.querySelector('body').textContent
    });

    return source[0].result
  } catch (error) {
    return console.error(error);
  }
};


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const activeTab = tabs[0];
    console.log(activeTab)
    const sourceText = await getSourceText(activeTab)
    const cleanedInput = sourceText.trim()
    summarize(cleanedInput).then((response) => {
      chrome.runtime.sendMessage({ summary: response[0].summary_text });
    });
  });
});
