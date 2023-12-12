let mediaLinks = [];

document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length === 0) return; // No active tab found

        const currentTabId = tabs[0].id;
		chrome.storage.local.get({mediaLinks: {}}, function(result) {
			let mediaLinks = result.mediaLinks;
			if(mediaLinks[currentTabId]) {
				// Use mediaLinks to display in the popup
				const linksContainer = document.getElementById('links-container');
				mediaLinks[currentTabId].forEach(url => {
					let linkElement = document.createElement('p');
					linkElement.textContent = url;
					linksContainer.appendChild(linkElement);
				});
			}
		});
	});
});
