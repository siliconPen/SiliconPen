async function loadPartial(id, file, callback) {
  const el = document.getElementById(id);
  if (!el) return;

  try {
    const res = await fetch(file);
    const html = await res.text();
    el.innerHTML = html;

    // 🔥 execute scripts inside injected HTML (if any)
    el.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");

      if (oldScript.src) {
        newScript.src = oldScript.src;
        newScript.async = false; // preserve order
      } else {
        newScript.textContent = oldScript.textContent;
      }

      document.body.appendChild(newScript);
      oldScript.remove();
    });

    // ✅ run page logic AFTER partial is injected
    if (typeof callback === "function") {
      callback();
    }
  } catch (e) {
    console.error("Partial load failed:", file, e);
  }
}
