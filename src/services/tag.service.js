import { storageService } from './storage.service'

const KEY = storageService.KEYS.tags

/** @returns {import('../types/index').Tag[]} */
function getAll() {
  return storageService.load(KEY, [])
}

/** @param {Pick<import('../types/index').Tag, 'name'|'description'|'color'>} data */
function create(data) {
  const tag = {
    id: crypto.randomUUID(),
    name: data.name,
    description: data.description ?? '',
    color: data.color,
  }
  storageService.save(KEY, [...getAll(), tag])
  return tag
}

/** @param {string} id @param {Partial<import('../types/index').Tag>} changes */
function update(id, changes) {
  const all = getAll().map((t) => (t.id === id ? { ...t, ...changes } : t))
  storageService.save(KEY, all)
}

/** @param {string} id */
function remove(id) {
  storageService.save(KEY, getAll().filter((t) => t.id !== id))
}

export const tagService = { getAll, create, update, remove }
