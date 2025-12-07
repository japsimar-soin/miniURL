import { getLinkStats } from "./api.js";
import { renderStats, renderError } from "./renderStats.js";

// Get code from URL
const pathParts = window.location.pathname.split("/");
const code = pathParts[pathParts.length - 1];

document.addEventListener("DOMContentLoaded", () => {
  if (!code || code === "code") {
    renderError("Invalid link code");
    return;
  }

  loadStats(code);
});

async function loadStats(code) {
  const container = document.getElementById("statsContainer");
  container.innerHTML = `<div class="state loading">Loading stats...</div>`;

  try {
    const link = await getLinkStats(code);
    renderStats(link);
  } catch (error) {
    console.error(error);
    renderError("Link not found or network error");
  }
}
