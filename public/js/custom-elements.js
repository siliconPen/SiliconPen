class SPLab extends HTMLElement {
  connectedCallback() {
    this._title = this.getAttribute("title") || "Interactive Hardware Lab";
    this._subtitle = this.getAttribute("subtitle") || "";
    this._image = this.getAttribute("image") || "";
    this._link = this.getAttribute("link") || "";
    this._button = this.getAttribute("button") || "";
    this._mode = this.getAttribute("mode") || "preview";
    this._height = this.getAttribute("height") || "500px";

    const wokwiAttr = this.getAttribute("wokwi") || this.getAttribute("wokwi-id") || "";
    const tcAttr = this.getAttribute("tinkercad") || this.getAttribute("tinkercad-id") || "";
    const embedAttr = this.getAttribute("embed") || "";

    // Cache initial innerHTML description before replacing innerHTML
    if (this._desc === undefined) {
      this._desc = this.innerHTML.trim();
    }

    this._platform = "generic";
    this._platformName = "Hardware Lab";
    this._embedUrl = "";
    this._openLink = this._link;
    this._buttonText = this._button;

    // Detect Wokwi
    if (wokwiAttr || (this._link && this._link.includes("wokwi.com"))) {
      this._platform = "wokwi";
      this._platformName = "Wokwi Live";
      const rawWokwi = wokwiAttr || this._link;
      const match = rawWokwi.match(/(\d{6,})/);
      const id = match ? match[1] : "";
      if (id) {
        this._embedUrl = `https://wokwi.com/projects/${id}?embed=1`;
        if (!this._openLink) this._openLink = `https://wokwi.com/projects/${id}`;
      }
      if (!this._buttonText) this._buttonText = "Open in Wokwi";
    }
    // Detect Tinkercad
    else if (tcAttr || (this._link && this._link.includes("tinkercad.com"))) {
      this._platform = "tinkercad";
      this._platformName = "Tinkercad";
      const rawTc = tcAttr || this._link;
      const match = rawTc.match(/tinkercad\.com\/(?:things|embed)\/([a-zA-Z0-9_-]+)/);
      const fullSlug = match ? match[1] : rawTc;
      const id = fullSlug.includes("-") ? fullSlug.split("-")[0] : fullSlug;
      if (id) {
        this._embedUrl = `https://www.tinkercad.com/embed/${id}?edit=#`;
        if (!this._openLink) this._openLink = `https://www.tinkercad.com/things/${fullSlug}`;
      }
      if (!this._buttonText) this._buttonText = "Open in Tinkercad";
    }

    // Direct embed attribute override
    if (embedAttr) {
      this._embedUrl = embedAttr;
      if (embedAttr.includes("wokwi.com")) {
        this._platform = "wokwi";
        this._platformName = "Wokwi Live";
      } else if (embedAttr.includes("tinkercad.com")) {
        this._platform = "tinkercad";
        this._platformName = "Tinkercad";
      }
    }

    if (!this._buttonText) {
      this._buttonText = "Open Simulation";
    }

    if (this._mode === "live" && this._embedUrl) {
      this.renderLive();
    } else {
      this.renderPreview();
    }
  }

  renderPreview() {
    const canEmbed = Boolean(this._embedUrl);
    let badgeText = "🧪 INTERACTIVE LAB";
    if (this._platform === "wokwi") badgeText = "⚡ WOKWI SIMULATOR";
    else if (this._platform === "tinkercad") badgeText = "⚡ TINKERCAD LAB";

    this.innerHTML = `
      <div class="sp-lab-box sp-lab-card" data-platform="${this._platform}">
        <div class="sp-lab-header">
          <span class="sp-lab-badge ${this._platform}">
            <span class="sp-lab-dot"></span>
            ${badgeText}
          </span>
          ${canEmbed ? '<span class="sp-lab-ready-tag">● Live Simulation Ready</span>' : ''}
        </div>

        <div class="sp-lab-grid ${!this._image ? 'sp-lab-no-image' : ''}">
          ${this._image ? `
            <div class="sp-lab-thumb-wrap ${canEmbed ? 'is-clickable' : ''}">
              <img src="${this._image}" alt="${this._title}" loading="lazy" />
              ${canEmbed ? `
                <div class="sp-lab-play-overlay">
                  <div class="sp-lab-play-btn">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </div>
                  <span class="sp-lab-play-caption">Launch Simulator</span>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <div class="sp-lab-info">
            <h3 class="sp-lab-title">${this._title}</h3>
            ${this._subtitle ? `<div class="sp-lab-subtitle">${this._subtitle}</div>` : ''}
            ${this._desc ? `<div class="sp-lab-desc">${this._desc}</div>` : ''}

            <div class="sp-lab-actions">
              ${canEmbed ? `
                <button type="button" class="sp-lab-btn sp-lab-btn-run">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                  <span>Run Live Simulation</span>
                </button>
              ` : ''}

              ${this._openLink ? `
                <a class="sp-lab-btn sp-lab-btn-ext" href="${this._openLink}" target="_blank" rel="noopener noreferrer">
                  <span>${this._buttonText}</span>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;

    if (canEmbed) {
      const runBtn = this.querySelector(".sp-lab-btn-run");
      if (runBtn) {
        runBtn.addEventListener("click", () => this.renderLive());
      }
      const thumb = this.querySelector(".sp-lab-thumb-wrap.is-clickable");
      if (thumb) {
        thumb.addEventListener("click", () => this.renderLive());
      }
    }
  }

  renderLive() {
    this.innerHTML = `
      <div class="sp-lab-box sp-lab-workbench" data-platform="${this._platform}">
        <div class="sp-lab-wb-toolbar">
          <div class="sp-lab-wb-status">
            <span class="sp-lab-dot pulse"></span>
            <span class="sp-lab-wb-platform">${this._platformName}</span>
            <span class="sp-lab-wb-sep">/</span>
            <span class="sp-lab-wb-title">${this._title}</span>
          </div>

          <div class="sp-lab-wb-controls">
            <button type="button" class="sp-lab-tool-btn sp-lab-fs-toggle" title="Toggle Fullscreen" aria-label="Toggle Fullscreen">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
              </svg>
              <span class="fs-text">Fullscreen</span>
            </button>

            ${this._openLink ? `
              <a href="${this._openLink}" target="_blank" rel="noopener noreferrer" class="sp-lab-tool-btn" title="Open in new window">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
                <span>Pop Out</span>
              </a>
            ` : ''}

            <button type="button" class="sp-lab-tool-btn sp-lab-close-btn" title="Close Simulation" aria-label="Close Simulation">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              <span>Exit</span>
            </button>
          </div>
        </div>

        <div class="sp-lab-wb-frame-wrapper" style="height: ${this._height};">
          <div class="sp-lab-wb-loader">
            <div class="sp-lab-spinner"></div>
            <div class="sp-lab-loader-text">Loading ${this._platformName} Virtual Lab...</div>
          </div>
          <iframe
            src="${this._embedUrl}"
            title="${this._title} Simulation"
            allow="fullscreen; autoplay; clipboard-write; encrypted-media; camera; microphone"
            loading="lazy"
            frameborder="0"
          ></iframe>
        </div>

        <div class="sp-lab-wb-footer">
          <span class="sp-lab-wb-tip">
            💡 <strong>Live Interactive Workbench:</strong> You can click components, flip switches, and edit code in real time. Click <em>Fullscreen</em> for a full-window circuit breadboard.
          </span>
        </div>
      </div>
    `;

    const wb = this.querySelector(".sp-lab-workbench");
    const loader = this.querySelector(".sp-lab-wb-loader");
    const iframe = this.querySelector("iframe");
    const fsBtn = this.querySelector(".sp-lab-fs-toggle");
    const fsText = this.querySelector(".fs-text");
    const closeBtn = this.querySelector(".sp-lab-close-btn");

    if (iframe && loader) {
      iframe.addEventListener("load", () => {
        loader.classList.add("hidden");
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (document.fullscreenElement) {
          if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
        this.renderPreview();
      });
    }

    if (fsBtn && wb) {
      fsBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          const req = wb.requestFullscreen || wb.webkitRequestFullscreen;
          if (req) req.call(wb).catch(() => {});
        } else {
          const exit = document.exitFullscreen || document.webkitExitFullscreen;
          if (exit) exit.call(document).catch(() => {});
        }
      });

      const handleFullscreenChange = () => {
        const isFs = Boolean(document.fullscreenElement);
        wb.classList.toggle("is-fullscreen", isFs);
        if (fsText) {
          fsText.textContent = isFs ? "Exit Fullscreen" : "Fullscreen";
        }
      };

      document.addEventListener("fullscreenchange", handleFullscreenChange);
    }
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

// ==========================================
// NEW SOLID SILICONPEN ENGINEERING COMPONENTS
// ==========================================

// 1. Hardware Datasheet & Quick Specs Component (<sp-specs>)
class SPSpecs extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Hardware Specifications";
    const subtitle = this.getAttribute("subtitle") || "";
    const items = Array.from(this.querySelectorAll("item, [data-label]"));

    let gridHtml = "";
    if (items.length > 0) {
      gridHtml = items
        .map((item) => {
          const label = item.getAttribute("label") || item.getAttribute("data-label") || "Spec";
          const val = item.innerHTML.trim();
          return `
            <div class="sp-spec-row">
              <span class="sp-spec-key">${label}</span>
              <span class="sp-spec-val">${val}</span>
            </div>
          `;
        })
        .join("");
    } else {
      gridHtml = `<div class="sp-spec-body">${this.innerHTML}</div>`;
    }

    this.innerHTML = `
      <div class="sp-specs-card">
        <div class="sp-specs-header">
          <div class="sp-specs-badge">
            <span class="sp-specs-dot"></span>
            DATASHEET QUICK SPECS
          </div>
          <div class="sp-specs-title">${title}</div>
          ${subtitle ? `<div class="sp-specs-subtitle">${subtitle}</div>` : ""}
        </div>
        <div class="sp-specs-grid">
          ${gridHtml}
        </div>
      </div>
    `;
  }
}
customElements.define("sp-specs", SPSpecs);

// 2. Circuit Triage & Troubleshooting (<sp-troubleshoot>)
class SPTroubleshoot extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Hardware Troubleshooting & Fix";
    const symptomEl = this.querySelector('[slot="symptom"], symptom');
    const causeEl = this.querySelector('[slot="cause"], cause');
    const fixEl = this.querySelector('[slot="fix"], fix, [slot="solution"], solution');

    const symptom = symptomEl ? symptomEl.innerHTML.trim() : (this.getAttribute("symptom") || "");
    const cause = causeEl ? causeEl.innerHTML.trim() : (this.getAttribute("cause") || "");
    const fix = fixEl ? fixEl.innerHTML.trim() : (this.getAttribute("fix") || this.innerHTML.trim());

    this.innerHTML = `
      <div class="sp-troubleshoot-card">
        <div class="sp-tb-header">
          <span class="sp-tb-badge">
            <span class="sp-tb-icon">🔧</span>
            CIRCUIT TRIAGE
          </span>
          <h4 class="sp-tb-title">${title}</h4>
        </div>

        <div class="sp-tb-sections">
          ${symptom ? `
            <div class="sp-tb-section symptom">
              <div class="sp-tb-label">🚨 Symptom / Error</div>
              <div class="sp-tb-content">${symptom}</div>
            </div>
          ` : ""}
          ${cause ? `
            <div class="sp-tb-section cause">
              <div class="sp-tb-label">🔍 Root Cause</div>
              <div class="sp-tb-content">${cause}</div>
            </div>
          ` : ""}
          ${fix ? `
            <div class="sp-tb-section fix">
              <div class="sp-tb-label">⚡ Verified Solution</div>
              <div class="sp-tb-content">${fix}</div>
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }
}
customElements.define("sp-troubleshoot", SPTroubleshoot);

// 3. Side-by-Side Benchmark & Comparison (<sp-compare>)
class SPCompare extends HTMLElement {
  connectedCallback() {
    const leftTitle = this.getAttribute("left-title") || this.getAttribute("a-title") || "Option A";
    const rightTitle = this.getAttribute("right-title") || this.getAttribute("b-title") || "Option B";
    const leftEl = this.querySelector('[slot="left"], [slot="a"]');
    const rightEl = this.querySelector('[slot="right"], [slot="b"]');

    const leftContent = leftEl ? leftEl.innerHTML : "";
    const rightContent = rightEl ? rightEl.innerHTML : "";

    this.innerHTML = `
      <div class="sp-compare-card">
        <div class="sp-compare-badge">⚖️ HARDWARE BENCHMARK</div>
        <div class="sp-compare-grid">
          <div class="sp-compare-col left">
            <div class="sp-col-header">${leftTitle}</div>
            <div class="sp-col-body">${leftContent}</div>
          </div>
          <div class="sp-compare-col right">
            <div class="sp-col-header">${rightTitle}</div>
            <div class="sp-col-body">${rightContent}</div>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("sp-compare", SPCompare);

// 4. GPIO Safety & Pinout Reference (<sp-pinout>)
class SPPinout extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "GPIO Pinout & Safety Guide";
    const pins = Array.from(this.querySelectorAll("pin, [data-pin]"));

    let listHtml = "";
    if (pins.length > 0) {
      listHtml = pins
        .map((p) => {
          const type = p.getAttribute("type") || "safe";
          const pin = p.getAttribute("pin") || p.getAttribute("data-pin") || "";
          const desc = p.innerHTML.trim();
          return `
            <div class="sp-pin-item type-${type}">
              <div class="sp-pin-tag ${type}">
                <span class="sp-pin-dot"></span>
                ${pin}
              </div>
              <div class="sp-pin-desc">${desc}</div>
            </div>
          `;
        })
        .join("");
    } else {
      listHtml = `<div class="sp-pin-raw">${this.innerHTML}</div>`;
    }

    this.innerHTML = `
      <div class="sp-pinout-card">
        <div class="sp-pinout-header">
          <span class="sp-pinout-badge">⚡ PINOUT SAFETY REFERENCE</span>
          <h4 class="sp-pinout-title">${title}</h4>
        </div>
        <div class="sp-pinout-list">
          ${listHtml}
        </div>
      </div>
    `;
  }
}
customElements.define("sp-pinout", SPPinout);

// 5. Solid Web Component Callouts (<sp-rule>, <sp-warning>, <sp-fact>, <sp-pro>)
class SPRule extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Engineering Rule";
    const content = this.innerHTML;
    this.innerHTML = `
      <div class="sp-rule-box">
        <div class="sp-rule-title">⚡ ${title}</div>
        <div class="sp-rule-body">${content}</div>
      </div>
    `;
  }
}
customElements.define("sp-rule", SPRule);

class SPWarning extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Magic Smoke Alert";
    const content = this.innerHTML;
    this.innerHTML = `
      <div class="sp-warning-box">
        <div class="sp-warning-title">⚠️ ${title}</div>
        <div class="sp-warning-body">${content}</div>
      </div>
    `;
  }
}
customElements.define("sp-warning", SPWarning);

class SPFact extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Silicon Fact";
    const content = this.innerHTML;
    this.innerHTML = `
      <div class="sp-fact-box">
        <div class="sp-fact-title">💡 ${title}</div>
        <div class="sp-fact-body">${content}</div>
      </div>
    `;
  }
}
customElements.define("sp-fact", SPFact);

class SPPro extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Lab Pro Tip";
    const content = this.innerHTML;
    this.innerHTML = `
      <div class="sp-pro-box">
        <div class="sp-pro-title">🚀 ${title}</div>
        <div class="sp-pro-body">${content}</div>
      </div>
    `;
  }
}
customElements.define("sp-pro", SPPro);

// 6. Cyber-Lab YouTube Video Embed Component (<sp-youtube>)
class SPYouTube extends HTMLElement {
  connectedCallback() {
    const rawInput = (
      this.getAttribute("id") ||
      this.getAttribute("url") ||
      this.getAttribute("src") ||
      this.getAttribute("v") ||
      this.getAttribute("video") ||
      ""
    ).trim();

    const title = this.getAttribute("title") || "";
    // Allow caption attribute or innerHTML as caption
    const caption = this.getAttribute("caption") || this.innerHTML.trim();
    let startTime = this.getAttribute("start") || this.getAttribute("t") || "";

    // 1. Extract 11-char Video ID
    let videoId = "";
    if (/^[a-zA-Z0-9_-]{11}$/.test(rawInput)) {
      videoId = rawInput;
    } else {
      const match = rawInput.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
      );
      if (match) {
        videoId = match[1];
      }
      // Also extract start time from URL query param if present (e.g. ?t=90 or &t=1m30s)
      if (!startTime) {
        const timeMatch = rawInput.match(/[?&]t=([0-9a-zA-Z]+)/);
        if (timeMatch) {
          startTime = timeMatch[1];
        }
      }
    }

    if (!videoId) {
      this.innerHTML = `
        <div class="sp-yt-card sp-yt-error">
          <div class="sp-yt-header">
            <span class="sp-yt-badge">
              <span class="sp-yt-icon">▶</span>
              YOUTUBE EMBED
            </span>
            <span class="sp-yt-title">Configuration Needed</span>
          </div>
          <div style="padding: 18px; color: #f87171; font-size: 0.9rem; line-height: 1.5;">
            ⚠️ Missing or invalid YouTube video URL or ID.<br/>
            Usage: <code>&lt;sp-youtube url="https://www.youtube.com/watch?v=..." title="..."&gt;&lt;/sp-youtube&gt;</code>
          </div>
        </div>
      `;
      return;
    }

    // 2. Build privacy-friendly embed URL
    let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
    if (startTime) {
      const seconds = this.parseTime(startTime);
      if (seconds > 0) {
        embedUrl += `&start=${seconds}`;
      }
    }

    // 3. Render Cyber-Lab video player card
    this.innerHTML = `
      <figure class="sp-yt-card">
        ${
          title
            ? `
          <div class="sp-yt-header">
            <span class="sp-yt-badge">
              <span class="sp-yt-icon">▶</span>
              VIDEO DEMO
            </span>
            <span class="sp-yt-title">${title}</span>
          </div>
        `
            : ""
        }
        <div class="sp-yt-frame-wrapper">
          <iframe
            src="${embedUrl}"
            title="${title || "YouTube video player"}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        ${
          caption
            ? `<figcaption class="sp-yt-caption">${caption}</figcaption>`
            : ""
        }
      </figure>
    `;
  }

  parseTime(t) {
    if (!t) return 0;
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    let total = 0;
    const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
    if (m) {
      if (m[1]) total += parseInt(m[1], 10) * 3600;
      if (m[2]) total += parseInt(m[2], 10) * 60;
      if (m[3]) total += parseInt(m[3], 10);
    }
    return total;
  }
}
customElements.define("sp-youtube", SPYouTube);
