const KEYS = {
  projects: 'owca_projects',
  tags: 'owca_tags',
  settings: 'owca_settings',
}

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storageService = { KEYS, load, save }
