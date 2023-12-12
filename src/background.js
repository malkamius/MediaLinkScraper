chrome.storage.local.set({mediaLinks: {}});
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // Check if the URL is an M3U8 or MP4 file
        if (details.url.toLowerCase().includes('.m3u8') || details.url.toLowerCase().includes('.mp4')) {
            // Send the URL to the popup script
            chrome.storage.local.get({mediaLinks: {}}, function(result) {
                let updatedLinks = result.mediaLinks;
				const tabId = details.tabId;

				if (!updatedLinks[tabId]) {
					updatedLinks[tabId] = [];
				}

				if (!updatedLinks[tabId].includes(details.url)) {
					updatedLinks[tabId].push(details.url);
					chrome.storage.local.set({mediaLinks: updatedLinks});
				}
            });
        }
    },
    {urls: ["<all_urls>"]} // Listen to all URLs
);


chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    // Check for the response headers you're interested in
    let contentType = details.responseHeaders.find(header => header.name.toLowerCase() === 'content-type');
    let contentDisposition = details.responseHeaders.find(header => header.name.toLowerCase() === 'content-disposition');

    if (contentType) {
       
		
		let fileInfo = {
		  url: details.url,
		  type: contentType.value,
		  filename: ''
		};

		if (contentDisposition) {
		  // Parse contentDisposition to extract filename if available
		  // Example header: 'Content-Disposition: attachment; filename="example.mp4"'
		  let match = contentDisposition.value.match(/filename="?(.+?)"?$/);
		  if (match && match[1]) {
			fileInfo.filename = match[1].toLowerCase();
		  }
		}
		// This is an MP4 or M3U8 file
		if (contentType.value.includes('video/mp4') || 
			contentType.value.includes('application/x-mpegURL') || 
			fileInfo.filename.includes(".mp4") || 
			fileInfo.filename.includes(".m3u8")) {
            chrome.storage.local.get({mediaLinks: {}}, function(result) {
                let updatedLinks = result.mediaLinks;
				const tabId = details.tabId;

				if (!updatedLinks[tabId]) {
					updatedLinks[tabId] = [];
				}

				if (!updatedLinks[tabId].includes(details.url)) {
					updatedLinks[tabId].push(details.url);
					chrome.storage.local.set({mediaLinks: updatedLinks});
				}
            });
		// Store fileInfo or send it to popup as needed
			console.log('Media file info:', fileInfo);
		}
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);