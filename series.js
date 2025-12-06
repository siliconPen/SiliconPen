// Define high-level series metadata
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

fetch("posts.json")
  .then(res => res.json())
  .then(posts => {
    const container = document.querySelector(".series-list");

    Object.keys(seriesInfo).forEach(seriesKey => {
      const data = seriesInfo[seriesKey];

      const card = `
        <a href="series/${seriesKey}.html" class="series-card">
          <img src="${data.cover}" class="series-cover">
          <h2>${data.name}</h2>
          <p>${data.description}</p>
        </a>
      `;

      container.insertAdjacentHTML("beforeend", card);
    });
  });
