// Validate locally, then let the browser open FormSubmit's result page.
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const button = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');
  const originalButton = button.innerHTML;
  const fields = [
    [form.elements.name, document.getElementById('nameErr'), value => value.length >= 2],
    [form.elements.email, document.getElementById('emailErr'), value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)],
    [form.elements.message, document.getElementById('msgErr'), value => value.length >= 5]
  ];
  // Without this script, HTML required/minlength validation still works.
  form.noValidate = true;
  let submitting = false;
  let resetTimer;
  function resetButton() {
    clearTimeout(resetTimer);
    submitting = false;
    button.disabled = false;
    button.innerHTML = originalButton;
  }
  window.addEventListener('pageshow', resetButton);
  form.addEventListener('submit', event => {
    if (submitting) { event.preventDefault(); return; }
    status.hidden = true;
    let firstInvalid;
    fields.forEach(([field, error, valid]) => {
      const invalid = !valid(field.value.trim());
      field.classList.toggle('error', invalid);
      field.setAttribute('aria-invalid', String(invalid));
      error.classList.toggle('show', invalid);
      if (invalid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      event.preventDefault();
      firstInvalid.focus();
      return;
    }
    if (!/^https?:$/.test(location.protocol)) {
      event.preventDefault();
      status.textContent = 'Please open the published website to send your message. The contact form cannot send from a downloaded HTML file.';
      status.hidden = false;
      return;
    }
    // Provide the actual page URL when the browser only sends an origin referrer.
    let source = form.querySelector('[name="_url"]');
    if (!source) {
      source = document.createElement('input');
      source.type = 'hidden';
      source.name = '_url';
      form.append(source);
    }
    source.value = location.origin + location.pathname;
    submitting = true;
    button.disabled = true;
    button.textContent = 'Opening secure form…';
    // Leave the normal POST intact. FormSubmit handles the submission result.
    // Recover the control if navigation is cancelled without clearing the message.
    resetTimer = setTimeout(resetButton, 15000);
  });
})();
