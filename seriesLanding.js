const seriesInfo = {
  "oscillations": {
    name: "Oscillations",
    description: "Weekly tech newsletter decoding global tech wars, AI battles, and emerging disruptions.",
    cover: "images/oscillations/cover.webp"
  },
  "rant-electronics": {
    name: "Rant Electronics",
    description: "The chaotic, sarcastic, brutally honest electronics notes — like the diary of a frustrated engineer.",
    cover: "images/rant-electronics/cover.webp"
  },
  "pathway-to-arduino": {
    name: "Pathway to Arduino",
    description: "A structured learning path to master Arduino fundamentals from zero to real projects.",
    cover: "images/pathway-to-arduino/cover.webp"
  },
  "real-circuits": {
    name: "Real Circuits",
    description: "Deep dives into real-world projects and circuit breakdowns with practical engineering insights.",
    cover: "images/real-circuits/cover.png"
  }
};
function loadSeries(seriesKey) {
  fetch("../posts.json")
    .then(res => res.json())
    .then(posts => {
      const filtered = posts.filter(p => p.series === seriesKey);

      const container = document.querySelector(".series-posts");

      filtered.forEach(post => {
        const card = `
            <a href="../${post.slug}" class="series-post-card">
              <img src="../${post.cover}" class="series-thumb">
              <h2 class="series-card-title">${post.title}</h2>
              <p class="series-card-sub">${post.subtitle}</p>
            </a>
          `;

        container.insertAdjacentHTML("beforeend", card);
      });

      // Add series info to page heading
      document.getElementById("series-title").textContent = seriesInfo[seriesKey].name;
      document.getElementById("series-description").textContent = seriesInfo[seriesKey].description;
    });
}
