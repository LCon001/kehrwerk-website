(function () {
  const panel = document.getElementById("nav-panel");
  const openButton = document.querySelector(".header-actions .menu-toggle");
  const closeButton = document.querySelector(".menu-close");

  function setMenu(open) {
    if (!panel || !openButton) return;
    panel.classList.toggle("is-open", open);
    openButton.setAttribute("aria-expanded", open ? "true" : "false");
    openButton.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    document.body.classList.toggle("menu-open", open);
  }

  if (openButton) {
    openButton.addEventListener("click", function () {
      setMenu(openButton.getAttribute("aria-expanded") !== "true");
    });
  }
  if (closeButton) closeButton.addEventListener("click", function () { setMenu(false); });
  if (panel) {
    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  const bundesland = document.querySelector('select[name="Bundesland"]');
  if (bundesland) {
    bundesland.addEventListener("change", function () {
      bundesland.classList.toggle("chosen", bundesland.value !== "");
    });
  }

  const form = document.getElementById("offer");
  const status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = Object.fromEntries(new FormData(form).entries());
    const lines = [
      "Guten Tag,",
      "",
      "ich möchte ein Angebot für Kehrwerk anfordern.",
      "",
      "Name: " + (data.Name || ""),
      "Betrieb: " + (data.Betrieb || ""),
      "E-Mail: " + (data["E-Mail"] || ""),
      "Telefon: " + (data.Telefon || "")
    ];
    if (data.Bundesland) lines.push("Bundesland: " + data.Bundesland);
    if (data["Mitarbeiter mit Login"]) lines.push("Mitarbeiter mit Login: " + data["Mitarbeiter mit Login"]);
    if (data["Bisherige Software"]) lines.push("Bisherige Software: " + data["Bisherige Software"]);
    if (data.Nachricht) lines.push("", "Nachricht:", data.Nachricht);

    const href = "mailto:hallo@kehrwerk.at?subject=" +
      encodeURIComponent("Angebot anfordern – " + (data.Betrieb || "Kehrwerk")) +
      "&body=" + encodeURIComponent(lines.join("\r\n"));

    status.hidden = false;
    status.className = "form-status";
    status.textContent = "Ihr E-Mail-Programm öffnet die Nachricht. Bitte dort auf Senden tippen, damit sie bei uns ankommt. ";
    const again = document.createElement("a");
    again.href = href;
    again.textContent = "Erneut öffnen";
    status.appendChild(again);

    const opener = document.createElement("a");
    opener.href = href;
    opener.click();
  });
})();
