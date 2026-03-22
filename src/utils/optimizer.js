/**
 * @typedef {Object} Board
 * @property {number} stockLength - Length of the purchased board in mm
 * @property {number[]} cuts - Cut lengths allocated to this board, in mm
 * @property {number} waste - Remaining unused length in mm
 */

/**
 * @typedef {Object} DimensionResult
 * @property {string} dimensionKey - e.g. "45x145"
 * @property {Board[]} boards - One entry per board to purchase
 * @property {number[]} unplacedCuts - Cuts that were longer than any available stock length
 * @property {number} totalLengthNeeded - Sum of all cut lengths in mm
 * @property {number} totalLengthBought - Sum of all stock lengths purchased in mm
 * @property {number} totalWaste - Sum of waste across all boards in mm
 */

/**
 * First Fit Decreasing bin-packing for a single dimension.
 * Sorts cuts largest-first, then places each into the first existing board
 * where it fits; if none, opens the shortest available stock length that can
 * accommodate the cut.
 *
 * @param {number[]} cuts - Required cut lengths in mm (already expanded by quantity)
 * @param {number[]} stockLengths - Available store lengths in mm (must be non-empty)
 * @returns {{ boards: Board[], unplacedCuts: number[] }}
 */
function ffd(cuts, stockLengths) {
  const sorted = [...cuts].sort((a, b) => b - a)
  const sortedStock = [...stockLengths].sort((a, b) => a - b)
  const maxStock = sortedStock[sortedStock.length - 1]

  /** @type {{ stockLength: number, remaining: number, cuts: number[] }[]} */
  const bins = []
  /** @type {number[]} */
  const unplaced = []

  for (const cut of sorted) {
    if (cut > maxStock) {
      unplaced.push(cut)
      continue
    }

    // Find first bin with enough remaining space
    let placed = false
    for (const bin of bins) {
      if (bin.remaining >= cut) {
        bin.cuts.push(cut)
        bin.remaining -= cut
        placed = true
        break
      }
    }

    if (!placed) {
      // Open a new bin: use the shortest stock that fits this cut
      const stockLen = sortedStock.find((l) => l >= cut)
      bins.push({ stockLength: stockLen, remaining: stockLen - cut, cuts: [cut] })
    }
  }

  return {
    boards: bins.map((b) => ({ stockLength: b.stockLength, cuts: b.cuts, waste: b.remaining })),
    unplacedCuts: unplaced,
  }
}

/**
 * Run the optimizer for all dimensions in a project.
 *
 * @param {import('../types/index').LumberItem[]} items - All lumber items in the project
 * @param {Record<string, number[]>} storeStock - Available lengths per dimension key
 * @returns {DimensionResult[]}
 */
export function optimizeProject(items, storeStock) {
  // Group items by dimension key
  /** @type {Map<string, number[]>} */
  const cutsByDim = new Map()
  for (const item of items) {
    const key = `${item.width}x${item.height}`
    const cuts = cutsByDim.get(key) ?? []
    for (let i = 0; i < item.quantity; i++) cuts.push(item.length)
    cutsByDim.set(key, cuts)
  }

  /** @type {DimensionResult[]} */
  const results = []

  for (const [dimKey, cuts] of cutsByDim) {
    const stock = storeStock?.[dimKey] ?? []

    if (stock.length === 0) {
      results.push({
        dimensionKey: dimKey,
        boards: [],
        unplacedCuts: cuts,
        totalLengthNeeded: cuts.reduce((s, c) => s + c, 0),
        totalLengthBought: 0,
        totalWaste: 0,
      })
      continue
    }

    const { boards, unplacedCuts } = ffd(cuts, stock)
    const totalLengthNeeded = cuts.reduce((s, c) => s + c, 0)
    const totalLengthBought = boards.reduce((s, b) => s + b.stockLength, 0)
    const totalWaste = boards.reduce((s, b) => s + b.waste, 0)

    results.push({ dimensionKey: dimKey, boards, unplacedCuts, totalLengthNeeded, totalLengthBought, totalWaste })
  }

  return results
}
