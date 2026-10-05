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

  const demoBox = document.getElementById("demo");
  document.querySelectorAll(".js-demo").forEach(function (link) {
    link.addEventListener("click", function () {
      if (demoBox) demoBox.checked = true;
      setMenu(false);
    });
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

    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    const submit = form.querySelector('[type="submit"]');
    const fields = form.querySelector(".fields");
    const data = Object.fromEntries(new FormData(form).entries());
    data["Live-Demo"] = demoBox && demoBox.checked ? "Ja" : "Nein";
    const contact = data.Kontakt || "";
    if (contact.indexOf("@") !== -1) data._replyto = contact;
    delete data._honey;

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Wird gesendet…";
    }

    fetch("https://formsubmit.co/ajax/hallo@kehrwerk.at", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    }).then(function (response) {
      return response.json().then(function (body) {
        return { ok: response.ok, body: body };
      });
    }).then(function (result) {
      const message = (result.body && (result.body.message || result.body.success)) || "";
      const success = result.ok && String(message).toLowerCase().indexOf("error") === -1 && result.body && (result.body.success === true || result.body.success === "true");
      if (!success) throw new Error("send failed");
      if (fields) fields.hidden = true;
      status.hidden = false;
      status.className = "form-status ok";
      status.textContent = "Danke. Wir haben Ihre Anfrage erhalten und melden uns persönlich.";
    }).catch(function () {
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Angebot anfordern";
      }
      status.hidden = false;
      status.className = "form-status err";
      status.innerHTML = "Die Anfrage konnte nicht gesendet werden. Bitte schreiben Sie an <a href=\"mailto:hallo@kehrwerk.at\">hallo@kehrwerk.at</a>.";
    });
  });
})();
