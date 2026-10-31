/* ========================================
   Timeless Repaints - Login Page
   ======================================== */

import { setAuth, apiHeaders, apiBase } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('loginBtn');
  const result = document.getElementById('loginResult');

  btn.addEventListener('click', async () => {
    const user = document.getElementById('githubUser').value.trim();
    const repo = document.getElementById('githubRepo').value.trim();
    const token = document.getElementById('githubToken').value.trim();
    const branch = document.getElementById('githubBranch').value.trim() || 'main';

    if (!user || !repo || !token) {
      showResult('Please fill in all fields.', 'error');
      return;
    }

    btn.textContent = 'Validating...';
    btn.disabled = true;

    try {
      // Validate token by fetching repo info
      const res = await fetch(apiBase(user, repo), {
        headers: apiHeaders(token)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showResult(err.message || 'Failed to validate token. Check your credentials.', 'error');
        btn.textContent = 'Login';
        btn.disabled = false;
        return;
      }

      setAuth({ token, user, repo, branch });
      showResult('Login successful! Redirecting...', 'success');

      setTimeout(() => {
        window.location.href = 'admin.html';
      }, 1000);

    } catch (err) {
      showResult('Connection error. Please try again.', 'error');
      btn.textContent = 'Login';
      btn.disabled = false;
    }
  });
});

function showResult(message, type = 'error') {
  const result = document.getElementById('loginResult');
  result.textContent = message;
  result.style.color = type === 'success' ? 'var(--success)' : 'var(--error)';
  result.style.fontWeight = '600';
}
