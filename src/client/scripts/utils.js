export function showMessage(text, type = "success") {
    const el = document.getElementById("message");
    el.textContent = text;
    el.className = `message ${type} show`;
  
    setTimeout(() => el.classList.remove("show"), 4000);
  }
  