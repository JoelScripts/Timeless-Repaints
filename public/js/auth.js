/* ========================================
   Timeless Repaints - Auth Helper
   ======================================== */

const STORAGE_KEYS = {
  loggedIn: 'tr_logged_in',
  username: 'tr_username',
  token: 'tr_github_token',
  user: 'tr_github_user',
  repo: 'tr_github_repo',
  branch: 'tr_github_branch'
};

const VALID_USERNAME = 'Brit';
const VALID_PASSWORD = 'Timeless';

export function getAuth() {
  return {
    loggedIn: localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true',
    username: localStorage.getItem(STORAGE_KEYS.username),
    token: localStorage.getItem(STORAGE_KEYS.token),
    githubUser: localStorage.getItem(STORAGE_KEYS.user),
    githubRepo: localStorage.getItem(STORAGE_KEYS.repo),
    branch: localStorage.getItem(STORAGE_KEYS.branch) || 'main'
  };
}

export function setAuth(auth) {
  if (auth.loggedIn !== undefined) localStorage.setItem(STORAGE_KEYS.loggedIn, auth.loggedIn ? 'true' : 'false');
  if (auth.username) localStorage.setItem(STORAGE_KEYS.username, auth.username);
  if (auth.token) localStorage.setItem(STORAGE_KEYS.token, auth.token);
  if (auth.githubUser) localStorage.setItem(STORAGE_KEYS.user, auth.githubUser);
  if (auth.githubRepo) localStorage.setItem(STORAGE_KEYS.repo, auth.githubRepo);
  if (auth.branch) localStorage.setItem(STORAGE_KEYS.branch, auth.branch);
}

export function clearAuth() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
}

export function isAuthenticated() {
  return localStorage.getItem(STORAGE_KEYS.loggedIn) === 'true';
}

export function validateLogin(username, password) {
  return username === VALID_USERNAME && password === VALID_PASSWORD;
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
