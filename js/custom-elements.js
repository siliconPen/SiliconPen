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
