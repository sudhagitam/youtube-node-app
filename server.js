const express = require('express');
const app = express();
const PORT = 3000;

// Paste your Google Cloud API Key inside the quotes below
const API_KEY = 'AIzaSyArFH14uJyyClW_RI5cV52BQweBAK_WTEw';
const PLAYLIST_ID = 'PLdb-URfes6G3mhnXvG-nB_mJ0RZE0CUXL';

app.use(express.static('public'));

app.get('/api/videos', async (req, res) => {
    try {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("YouTube API Error:", data.error.message);
            return res.json([]);
        }

        const videos = data.items
            .filter(item => item.snippet.title !== "Private video" && item.snippet.title !== "Deleted video")
            .map(item => ({
                id: item.snippet.resourceId.videoId,
                title: item.snippet.title
            }));

        res.json(videos);
    } catch (error) {
        console.error("Server error:", error);
        res.json([]);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});