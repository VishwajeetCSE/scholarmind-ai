const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const LOCAL_DATA_PATH = path.resolve(__dirname, '..', '..', 'data', 'session-log.json');

const DEFAULT_SESSION = {
  user: {
    username: 'test_warrior',
    role: 'Beta Tester',
    joinDate: 'October 2026',
  },
  messages: [],
  lastUpdated: new Date().toISOString(),
};

function getGitHubConfig() {
  const token = (process.env.GITHUB_TOKEN || '').trim();
  const owner = (process.env.GITHUB_REPO_OWNER || 'VishwajeetCSE').trim();
  const repo = (process.env.GITHUB_REPO_NAME || 'scholarmind-ai').trim();
  const branch = (process.env.GITHUB_BRANCH || 'main').trim();
  const filePath = 'data/session-log.json';

  return { token, owner, repo, branch, filePath };
}

/**
 * GET /api/test-user/load
 * Reads session-log.json from the GitHub repository (or local fallback).
 */
router.get('/load', async (req, res) => {
  const { token, owner, repo, branch, filePath } = getGitHubConfig();

  // If GITHUB_TOKEN is available, query GitHub REST API
  if (token) {
    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'User-Agent': 'ScholarMind-AI-Simulation',
        },
      });

      if (response.ok) {
        const fileInfo = await response.json();
        const contentStr = Buffer.from(fileInfo.content, 'base64').toString('utf-8');
        const parsed = JSON.parse(contentStr);
        return res.json({
          success: true,
          source: 'github',
          sha: fileInfo.sha,
          data: parsed,
        });
      } else if (response.status === 404) {
        console.warn(`[GitHub API] ${filePath} not found on branch ${branch}, returning default.`);
      } else {
        const errText = await response.text();
        console.warn(`[GitHub API] Load error (${response.status}):`, errText);
      }
    } catch (err) {
      console.warn('[GitHub API] Network error while fetching logs:', err.message);
    }
  }

  // Local fallback
  try {
    if (fs.existsSync(LOCAL_DATA_PATH)) {
      const raw = fs.readFileSync(LOCAL_DATA_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return res.json({
        success: true,
        source: 'local_disk',
        data: parsed,
      });
    }
  } catch (fsErr) {
    console.warn('[Logs] Local read failed:', fsErr.message);
  }

  return res.json({
    success: true,
    source: 'default',
    data: DEFAULT_SESSION,
  });
});

/**
 * POST /api/test-user/save
 * Packages simulation user details and chat history into session-log.json
 * and commits it directly to the GitHub repository.
 */
router.post('/save', async (req, res) => {
  const { user, messages } = req.body;
  const { token, owner, repo, branch, filePath } = getGitHubConfig();

  const payload = {
    user: user || DEFAULT_SESSION.user,
    messages: Array.isArray(messages) ? messages : [],
    lastUpdated: new Date().toISOString(),
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const base64Content = Buffer.from(jsonString, 'utf-8').toString('base64');

  // Also save locally if write access exists
  try {
    const dir = path.dirname(LOCAL_DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DATA_PATH, jsonString, 'utf-8');
  } catch (fsErr) {
    // Non-fatal on serverless read-only disk
  }

  if (!token) {
    return res.json({
      success: true,
      source: 'local_saved',
      message: 'Saved to local storage. Provide GITHUB_TOKEN to commit directly to GitHub repository.',
      data: payload,
    });
  }

  try {
    // 1. Fetch current file to retrieve existing sha (required for updating files on GitHub)
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    let existingSha = null;

    const getRes = await fetch(getUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ScholarMind-AI-Simulation',
      },
    });

    if (getRes.ok) {
      const existing = await getRes.json();
      existingSha = existing.sha;
    }

    // 2. Put (commit) the updated session log to GitHub
    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
    const putBody = {
      message: `chore(simulation): update test user session logs [${new Date().toISOString()}]`,
      content: base64Content,
      branch: branch,
    };

    if (existingSha) {
      putBody.sha = existingSha;
    }

    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'ScholarMind-AI-Simulation',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(putBody),
    });

    if (putRes.ok) {
      const commitData = await putRes.json();
      return res.json({
        success: true,
        source: 'github_committed',
        commit: commitData.commit?.sha || null,
        data: payload,
      });
    } else {
      const errBody = await putRes.text();
      console.error('[GitHub API] Commit failed:', errBody);
      return res.status(502).json({
        success: false,
        source: 'github_error',
        error: 'Failed to commit log to GitHub. Please verify GITHUB_TOKEN permissions.',
        details: errBody,
      });
    }
  } catch (err) {
    console.error('[GitHub API] Network error during commit:', err.message);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
