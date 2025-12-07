import { copyToClipboard } from "./events.js";

export function renderStats(link) {
  const baseUrl = window.location.origin;
  const shortUrl = `${baseUrl}/${link.code}`;

  const container = document.getElementById("statsContainer");

  container.innerHTML = `
    <div class="stat-item">
      <div class="stat-label">Short Code</div>
      <div class="stat-value">
        <span class="short-code">${link.code}</span>
        <button class="btn btn-icon copy-btn" data-text="${shortUrl}">
          📋
        </button>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-label">Short URL</div>
      <div class="stat-value">
        <a href="${shortUrl}" target="_blank" class="target-url">${shortUrl}</a>
        <button class="btn btn-icon copy-btn" data-text="${shortUrl}">
          📋
        </button>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-label">Target URL</div>
      <div class="stat-value">
        <a href="${link.targetUrl}" target="_blank" class="target-url">
          ${link.targetUrl}
        </a>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-label">Total Clicks</div>
      <div class="stat-value">
        ${link.totalClicks || 0}
        <span class="click-badge">
          ${link.totalClicks || 0} click${link.totalClicks !== 1 ? "s" : ""}
        </span>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-label">Last Clicked</div>
      <div class="stat-value">
        <span class="date-value ${!link.lastClickedAt ? "never" : ""}">
          ${link.lastClickedAt ? new Date(link.lastClickedAt).toLocaleString() : "Never"}
        </span>
      </div>
    </div>

    <div class="stat-item">
      <div class="stat-label">Created At</div>
      <div class="stat-value">
        <span class="date-value">${new Date(link.createdAt).toLocaleString()}</span>
      </div>
    </div>

    <div class="btn-group">
      <a href="${shortUrl}" target="_blank" class="btn btn-primary">
        Test Redirect
      </a>

      <a href="/pages/dashboard.html" class="btn btn-secondary">
        ← Back to Dashboard
      </a>
    </div>
  `;

  attachCopyEvents();
}

export function renderError(message) {
  const container = document.getElementById("statsContainer");

  container.innerHTML = `
    <div class="state error">
      <h2>Link Not Found</h2>
      <p>${message || "The requested link does not exist."}</p>
      <a href="/pages/dashboard.html" class="btn btn-primary">Go to Dashboard</a>
    </div>
  `;
}

function attachCopyEvents() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.dataset.text;
      copyToClipboard(text, btn);
    });
  });
}
