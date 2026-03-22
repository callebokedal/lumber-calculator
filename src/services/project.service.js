import { storageService } from './storage.service'

const KEY = storageService.KEYS.projects

/** @returns {import('../types/index').Project[]} */
function getAll() {
  return storageService.load(KEY, [])
}

/** @param {string} id @returns {import('../types/index').Project|undefined} */
function getById(id) {
  return getAll().find((p) => p.id === id)
}

/** @param {Pick<import('../types/index').Project, 'name'|'description'>} data */
function create(data) {
  const now = new Date().toISOString()
  const project = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description ?? '',
    createdAt: now,
    updatedAt: now,
    items: [],
    storeStock: {},
    tags: [],
  }
  const all = getAll()
  storageService.save(KEY, [...all, project])
  return project
}

/** @param {string} id @param {Partial<import('../types/index').Project>} changes */
function update(id, changes) {
  const all = getAll().map((p) =>
    p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
  )
  storageService.save(KEY, all)
}

/** @param {string} id */
function remove(id) {
  storageService.save(KEY, getAll().filter((p) => p.id !== id))
}

/**
 * Add a lumber item to a project.
 * @param {string} projectId
 * @param {Omit<import('../types/index').LumberItem, 'id'>} itemData
 */
function addItem(projectId, itemData) {
  const item = { id: crypto.randomUUID(), ...itemData }
  const project = getById(projectId)
  if (!project) return null
  update(projectId, { items: [...project.items, item] })
  return item
}

/**
 * Update a lumber item within a project.
 * @param {string} projectId
 * @param {string} itemId
 * @param {Partial<import('../types/index').LumberItem>} changes
 */
function updateItem(projectId, itemId, changes) {
  const project = getById(projectId)
  if (!project) return
  update(projectId, {
    items: project.items.map((item) => (item.id === itemId ? { ...item, ...changes } : item)),
  })
}

/**
 * Remove a lumber item from a project.
 * @param {string} projectId
 * @param {string} itemId
 */
function removeItem(projectId, itemId) {
  const project = getById(projectId)
  if (!project) return
  update(projectId, { items: project.items.filter((item) => item.id !== itemId) })
}

/**
 * Set the available store lengths for a given dimension within a project.
 * @param {string} projectId
 * @param {string} dimensionKey - e.g. "45x145"
 * @param {number[]} lengths - available lengths in mm
 */
function updateStoreStock(projectId, dimensionKey, lengths) {
  const project = getById(projectId)
  if (!project) return
  const stock = { ...(project.storeStock ?? {}), [dimensionKey]: lengths }
  update(projectId, { storeStock: stock })
}

/**
 * Trigger a JSON file download for a single project.
 * @param {string} id
 */
function exportAsJson(id) {
  const project = getById(id)
  if (!project) return
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${project.name.replace(/\s+/g, '_')}.json`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Import a project from a parsed JSON object.
 * Assigns a fresh id and timestamps to avoid collisions.
 * @param {object} raw
 * @returns {import('../types/index').Project}
 */
function importFromJson(raw) {
  const now = new Date().toISOString()
  const project = {
    ...raw,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    items: raw.items ?? [],
    storeStock: raw.storeStock ?? {},
    tags: raw.tags ?? [],
  }
  storageService.save(KEY, [...getAll(), project])
  return project
}

export const projectService = { getAll, getById, create, update, remove, addItem, updateItem, removeItem, updateStoreStock, exportAsJson, importFromJson }
