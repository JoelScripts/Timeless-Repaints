/* ========================================
   Timeless Repaints - GitHub API Helper
   ======================================== */

import { getAuth, apiHeaders, apiBase } from './auth.js';

const AUTH = getAuth();

if (!AUTH.token) {
  // Not authenticated - this file shouldn't be loaded without auth
  console.warn('GitHub API: No auth token found');
}

export function getAuth() { return AUTH; }

/**
 * Get file contents from GitHub repo
 * Returns { content: string (decoded), sha: string } or null
 */
export async function getFile(path) {
  const res = await fetch(`${apiBase(AUTH.user, AUTH.repo)}/contents/${path}?ref=${AUTH.branch}`, {
    headers: apiHeaders(AUTH.token)
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.encoding === 'base64') {
    const decoded = atob(data.content);
    return { content: decoded, sha: data.sha };
  }
  return { content: data.content, sha: data.sha };
}

/**
 * Create or update a file on GitHub
 * path: e.g. "public/uploads/myfile.zip" or "public/liveries.json"
 * content: string (will be base64 encoded)
 * message: commit message
 * sha: optional, required for updates
 */
export async function putFile(path, content, message, sha = null) {
  const base64 = btoa(unescape(encodeURIComponent(content)));
  const body = {
    message,
    content: base64,
    branch: AUTH.branch
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${apiBase(AUTH.user, AUTH.repo)}/contents/${path}`, {
    method: 'PUT',
    headers: apiHeaders(AUTH.token),
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload file');
  }
  return await res.json();
}

/**
 * Upload a binary file (ArrayBuffer) to GitHub
 */
export async function uploadFile(file, path, message) {
  const buffer = await file.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  const res = await fetch(`${apiBase(AUTH.user, AUTH.repo)}/contents/${path}`, {
    method: 'PUT',
    headers: apiHeaders(AUTH.token),
    body: JSON.stringify({
      message,
      content: base64,
      branch: AUTH.branch
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to upload file');
  }
  return await res.json();
}

/**
 * Load liveries.json from GitHub
 */
export async function loadLiveriesFromGitHub() {
  const file = await getFile('public/liveries.json');
  if (!file) return [];
  try {
    return JSON.parse(file.content);
  } catch (err) {
    console.error('Failed to parse liveries.json:', err);
    return [];
  }
}

/**
 * Save liveries.json to GitHub
 */
export async function saveLiveriesToGitHub(liveries) {
  const existing = await getFile('public/liveries.json');
  const content = JSON.stringify(liveries, null, 2);
  const message = `Update liveries.json - add new livery entries`;
  return await putFile('public/liveries.json', content, message, existing ? existing.sha : null);
}
