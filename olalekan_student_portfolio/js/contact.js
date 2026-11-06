// Client-side contact form validation. This demo does not deliver messages to an inbox.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const inputs = {
    name: document.getElementById("contact-name"),
    email: document.getElementById("contact-email"),
    phone: document.getElementById("contact-phone"),
    message: document.getElementById("contact-message")
  };
  const status = document.getElementById("contact-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phonePattern = /^\d+$/;

  function showError(field, message) {
    document.getElementById(`${field}-error`).textContent = message;
    inputs[field].classList.toggle("invalid-field", Boolean(message));
    inputs[field].setAttribute("aria-invalid", String(Boolean(message)));
  }
  Object.keys(inputs).forEach(field => {
    inputs[field].addEventListener("input", () => showError(field, ""));
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    status.textContent = "";
    status.className = "form-status";
    const values = Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, input.value.trim()]));
    let valid = true;

    Object.keys(inputs).forEach(field => {
      let message = "";
      if (!values[field]) message = "This field is required.";
      else if (field === "email" && !emailPattern.test(values.email)) message = "Enter a valid email address.";
      else if (field === "phone" && !phonePattern.test(values.phone)) message = "Use digits only, without spaces or symbols.";
      showError(field, message);
      if (message) valid = false;
    });

    if (!valid) {
      status.textContent = "Please correct the highlighted fields and try again.";
      status.classList.add("error");
      const firstInvalid = form.querySelector(".invalid-field");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Validation succeeded. No network request is made in this standalone demo.
    status.textContent = "Thank you. Your form passed validation. This demo does not send the message; connect an email service or backend to receive it.";
    status.classList.add("success");
    form.reset();
  });
});
