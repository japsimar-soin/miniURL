import { loadLinks, createLink, deleteLink } from './api.js';
import { renderLinks } from './render.js';
import { showMessage } from './utils.js';
import { initFormValidation, getFormData } from './events.js';

let allLinks = [];
// let sortColumn = null;
// let sortDirection = "asc";

document.addEventListener('DOMContentLoaded', async () => {
  initForm();
  initSearch();
  await refreshLinks();
});

function initForm() {
  const form = document.getElementById('createLinkForm');

  initFormValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const data = getFormData(form);
      await createLink(data);
      showMessage('Link created successfully!', 'success');
      form.reset();
      await refreshLinks();
    } catch (err) {
      console.error(err);
      showMessage('Error creating link', 'error');
    }
  });
}

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  let timeout;

  searchInput.addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => filterLinks(e.target.value), 300);
  });
}

function showLoading() {
  const container = document.getElementById('linksContainer');
  container.innerHTML = `<div class="state loading">Loading links...</div>`;
}

async function refreshLinks() {
  showLoading();

  let links;

  try {
    links = await loadLinks();
  } catch {
    links = null;
  }

  if (!links || !links.length) {
    setTimeout(refreshLinks, 1000);
    return;
  }

  allLinks = links;
  renderLinks(allLinks, handleDelete);
}

function filterLinks(search) {
  if (!search) {
    renderLinks(allLinks, handleDelete);
    return;
  }

  const term = search.toLowerCase();

  const filtered = allLinks.filter(
    (l) =>
      l.code.toLowerCase().includes(term) ||
      l.targetUrl.toLowerCase().includes(term),
  );

  renderLinks(filtered, handleDelete);
}

async function handleDelete(code) {
  if (!confirm(`Delete "${code}"? This cannot be undone.`)) return;

  try {
    await deleteLink(code);
    showMessage('Link deleted', 'success');
    await refreshLinks();
  } catch (err) {
    console.error(err);
    showMessage('Delete failed', 'error');
  }
}
