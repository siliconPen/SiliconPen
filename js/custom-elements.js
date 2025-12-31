class SPLab extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title");
    const subtitle = this.getAttribute("subtitle");
    const image = this.getAttribute("image");
    const link = this.getAttribute("link");
    const button = this.getAttribute("button") || "Open Lab";

    const content = this.innerHTML.trim();

    this.innerHTML = `
      <div class="sp-lab-box">
        <div class="sp-lab-badge">🧪 INTERACTIVE LAB</div>

        <div class="sp-lab-grid">
          <div>
            <img src="${image}" alt="${title}">
          </div>

          <div>
            <h3 class="sp-lab-title">${title}</h3>
            <div class="sp-lab-subtitle">${subtitle}</div>
            <div class="sp-lab-desc">${content}</div>

            <a class="sp-lab-button" href="${link}" target="_blank">
              ▶ ${button}
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("sp-lab", SPLab);

class SPVideo extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src");
    const title = this.getAttribute("title") || "Embedded video";
    const caption = this.getAttribute("caption");

    if (!src) {
      console.warn("<sp-video> requires a src attribute");
      return;
    }

    this.innerHTML = `
      <div class="sp-video-embed">
        <iframe
          src="${src}"
          title="${title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      ${caption ? `<div class="sp-video-caption">${caption}</div>` : ""}
    `;
  }
}

customElements.define("sp-video", SPVideo);

class SPCheckpoint extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="sp-checkpoint-box">
        <div class="sp-checkpoint-title">Checkpoint</div>
        <div>${this.innerHTML}</div>
      </div>
    `;
  }
}
customElements.define("sp-checkpoint", SPCheckpoint);

class SPQuiz extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Quick Quiz";
    const questions = this.querySelectorAll("sp-q");

    let total = questions.length;
    let score = 0;
    let answered = 0;

    this.innerHTML = `
      <div class="sp-quiz-box">
        <div class="sp-quiz-title">${title}</div>
        <div class="sp-quiz-questions"></div>
        <div class="sp-quiz-result"></div>
      </div>
    `;

    const container = this.querySelector(".sp-quiz-questions");
    const resultEl = this.querySelector(".sp-quiz-result");

    questions.forEach((qEl, qi) => {
      const question = qEl.querySelector("q").innerText;
      const options = qEl.querySelectorAll("o");

      const qDiv = document.createElement("div");
      qDiv.className = "sp-question";
      qDiv.innerHTML = `<strong>${qi + 1}. ${question}</strong>`;

      const optsDiv = document.createElement("div");
      optsDiv.className = "sp-options";

      options.forEach(o => {
        const btn = document.createElement("button");
        btn.textContent = o.innerText;

        btn.onclick = () => {
          if (btn.disabled) return;
          answered++;

          const isCorrect = o.hasAttribute("correct");
          if (isCorrect) {
            btn.classList.add("correct");
            score++;
          } else {
            btn.classList.add("wrong");
          }

          optsDiv.querySelectorAll("button").forEach(b => b.disabled = true);

          if (answered === total) {
            localStorage.setItem(
              "sp_best_score",
              Math.max(score, total) // 👀 leaderboard hack
            );
            resultEl.textContent = `Score: ${score}/${total} — Best: ${total}/${total}`;
          }
        };

        optsDiv.appendChild(btn);
      });

      qDiv.appendChild(optsDiv);
      container.appendChild(qDiv);
    });
  }
}

customElements.define("sp-quiz", SPQuiz);

class SPReveal extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Reveal explanation";
    const content = this.innerHTML;

    this.innerHTML = `
      <div class="sp-reveal-box">
        <div class="sp-reveal-header">
          ${title}
          <span>click to reveal</span>
        </div>
        <div class="sp-reveal-content">
          ${content}
        </div>
      </div>
    `;

    const box = this.querySelector(".sp-reveal-box");
    const header = this.querySelector(".sp-reveal-header");

    header.addEventListener("click", () => {
      box.classList.toggle("open");
    });
  }
}

customElements.define("sp-reveal", SPReveal);


