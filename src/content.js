// Search for video elements or other relevant tags
const videos = document.querySelectorAll('video');
videos.forEach(video => {
    if (video.src.includes('.m3u8') || video.src.includes('.mp4')) {
        // Send the video source URL to the background script
        chrome.runtime.sendMessage({url: video.src});
    }
});
