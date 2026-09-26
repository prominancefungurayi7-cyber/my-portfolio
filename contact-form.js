// Validate and submit in the background so visitors stay on the portfolio.
(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const button = document.getElementById('submitBtn');
  const status = document.getElementById('formStatus');
  const success = document.getElementById('formSuccess');
  const originalButton = button.innerHTML;
  const fields = [
    [form.elements.name, document.getElementById('nameErr'), value => value.length >= 2],
    [form.elements.email, document.getElementById('emailErr'), value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)],
    [form.elements.message, document.getElementById('msgErr'), value => value.length >= 5]
  ];
  // Without this script, HTML required/minlength validation still works.
  form.noValidate = true;
  let submitting = false;
  function resetButton() {
    submitting = false;
    button.disabled = false;
    button.innerHTML = originalButton;
  }
  window.addEventListener('pageshow', resetButton);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    status.hidden = true;
    success.style.display = 'none';
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
    button.textContent = 'Sending…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const endpoint = new URL(form.action);
      endpoint.pathname = '/ajax' + endpoint.pathname;
      const response = await fetch(endpoint.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('Submission was not accepted');
      }
      form.reset();
      success.style.display = 'block';
    } catch (error) {
      status.textContent = error.name === 'AbortError'
        ? 'The request timed out, so we could not confirm submission. Your message is still here. Please try again later or email me directly.'
        : 'We could not confirm submission. Your message is still here. Please try again or email me directly at prominancefungurayi7@gmail.com.';
      status.hidden = false;
    } finally {
      clearTimeout(timeout);
      resetButton();
    }
  });
})();
