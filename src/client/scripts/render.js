export function renderLinks(links, onDelete) {
  const container = document.getElementById('linksContainer');
  const count = document.getElementById('linkCount');

  count.textContent = links.length;

  if (!links.length) {
    container.innerHTML = `
        <div class="state empty">
          <p><strong>No links found</strong></p>
        </div>
      `;
    return;
  }

  const baseUrl = window.location.origin;

  container.innerHTML = `
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Short Code</th>
              <th>Short URL</th>
              <th>Target URL</th>
              <th>Clicks</th>
              <th>Last Clicked</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${links
              .map(
                (l) => `
            <tr data-code="${l.code}">
              <td>${l.code}</td>
              <td><a href="${baseUrl}/${l.code}" target="_blank">${baseUrl}/${l.code}</a></td>
              <td>
                <div class="cell-content target-url-cell" title="${l.targetUrl}">
                    ${l.targetUrl}
                </div>
              </td>
              <td>${l.totalClicks || 0}</td>
              <td>${l.lastClickedAt ? new Date(l.lastClickedAt).toLocaleString() : '-'}</td>
              <td class="actions">
                <a href="/code/${l.code}" class="btn btn-secondary">Stats</a>
                <button class="btn btn-danger delete-btn" data-code="${l.code}">Delete</button>
              </td>
            </tr>
          `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

  attachDeleteEvents(onDelete);
}

function attachDeleteEvents(onDelete) {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const code = e.target.dataset.code;
        onDelete(code);
      });
    });
  }