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

export const projectService = { getAll, getById, create, update, remove, addItem, updateItem, removeItem, updateStoreStock }
