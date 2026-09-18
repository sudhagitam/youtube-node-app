document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/videos')
        .then(res => res.json())
        .then(videos => {
            const feed = document.getElementById('video-feed');
            if (!feed) return;
            feed.innerHTML = ''; // Clear "Loading..." text

            if (videos.length === 0) {
                feed.innerHTML = "<h2 style='text-align:center;'>No videos available.</h2>";
                return;
            }

            // Optional: If index.html should only show the latest video,
            // sort or slice. Otherwise, loop through all.
            videos.forEach(v => {
                const wrapper = document.createElement('div');
                wrapper.className = 'video-wrapper';

                wrapper.innerHTML = `
                    <h2 class="video-title">${v.title}</h2>
                    <div class="video-player">
                        <iframe src="https://www.youtube.com/embed/${v.id}?rel=0" allowfullscreen></iframe>
                    </div>
                `;

                feed.appendChild(wrapper);
            });
        })
        .catch(err => console.error("Error loading videos:", err));
});