/* ========================================
   Timeless Repaints - Auth Helper
   ======================================== */

const STORAGE_KEYS = {
  token: 'tr_github_token',
  user: 'tr_github_user',
  repo: 'tr_github_repo',
  branch: 'tr_github_branch'
};

export function getAuth() {
  return {
    token: localStorage.getItem(STORAGE_KEYS.token),
    user: localStorage.getItem(STORAGE_KEYS.user),
    repo: localStorage.getItem(STORAGE_KEYS.repo),
    branch: localStorage.getItem(STORAGE_KEYS.branch) || 'main'
  };
}

export function setAuth({ token, user, repo, branch = 'main' }) {
  localStorage.setItem(STORAGE_KEYS.token, token);
  localStorage.setItem(STORAGE_KEYS.user, user);
  localStorage.setItem(STORAGE_KEYS.repo, repo);
  localStorage.setItem(STORAGE_KEYS.branch, branch);
}

export function clearAuth() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}

export function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEYS.token);
}

export function apiHeaders(token) {
  return {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github+json',
    'Content-Type': 'application/json'
  };
}

export function apiBase(user, repo) {
  return `https://api.github.com/repos/${user}/${repo}`;
}
