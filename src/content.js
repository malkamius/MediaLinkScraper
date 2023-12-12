// Search for video elements or other relevant tags
const videos = document.querySelectorAll('video');
videos.forEach(video => {
    if (video.src.toLowerCase().includes('.m3u8') || video.src.toLowerCase().includes('.mp4')) {
        // Send the video source URL to the background script
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			if (tabs.length === 0) return; // No active tab found

			const currentTabId = tabs[0].id;
			chrome.storage.local.get({mediaLinks: {}}, function(result) {
				let updatedLinks = result.mediaLinks;
				

				if (!updatedLinks[currentTabId]) {
					updatedLinks[currentTabId] = [];
				}

				if (!updatedLinks[currentTabId].includes(details.url)) {
					updatedLinks[currentTabId].push(details.url);
					chrome.storage.local.set({mediaLinks: updatedLinks});
				}
			});
		});
    }
});
