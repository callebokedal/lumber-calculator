/**
 * @typedef {Object} Project
 * @property {string} id - Unique identifier
 * @property {string} name - Project name
 * @property {string} description - Optional description
 * @property {string} createdAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {LumberItem[]} items - Desired lumber pieces
 * @property {Record<string, number[]>} storeStock - Available lengths per dimension key (e.g. {"45x145": [2400, 3600]})
 * @property {string[]} tags - Tag ids associated with this project
 */

/**
 * @typedef {Object} LumberItem
 * @property {string} id - Unique identifier
 * @property {number} width - Width in mm (e.g. 45)
 * @property {number} height - Height in mm (e.g. 145)
 * @property {number} length - Desired length in mm (e.g. 2150)
 * @property {number} quantity - Number of pieces needed
 * @property {'deck-board'|'joist'|'post'|'rim-joist'|null} [type] - Optional lumber type
 */

/**
 * @typedef {Object} Tag
 * @property {string} id - Unique identifier
 * @property {string} name - Short label
 * @property {string} description - Optional description
 * @property {string} [color] - Optional hex color (e.g. "#ff0000")
 */

/**
 * @typedef {Object} Settings
 * @property {'sv'|'en'} language - UI language
 */

export {}
