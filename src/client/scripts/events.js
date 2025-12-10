export function initFormValidation(form) {
    const inputs = form.querySelectorAll('input[required]');
    const submitBtn = form.querySelector('button[type="submit"]');
  
    function updateButtonState() {
      submitBtn.disabled = !form.checkValidity();
    }
  
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        validate(input);
        updateButtonState();
      });
    });

    updateButtonState();
  }
  
  export function getFormData(form) {
    const data = {};
  
    const fd = new FormData(form);
    fd.forEach((value, key) => (data[key] = value.trim() || undefined));
  
    if (!data.targetUrl) throw Error('Target URL is required');
  
    return data;
  }
  
  function validate(input) {
    if (input.validity.valid) {
      input.classList.remove('error');
      input.classList.add('success');
    } else {
      input.classList.add('error');
      input.classList.remove('success');
    }
  }
  
  export async function copyToClipboard(text, button) {
    try {
      await navigator.clipboard.writeText(text);
      button.classList.add('copied');
  
      setTimeout(() => {
        button.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  }
  