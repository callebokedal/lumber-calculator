/** @type {Record<string, Record<'sv'|'en', string>>} */
const strings = {
  // Navigation
  'nav.projects': { sv: 'Projekt', en: 'Projects' },
  'nav.settings': { sv: 'Inställningar', en: 'Settings' },

  // Projects page
  'projects.title': { sv: 'Projekt', en: 'Projects' },
  'projects.empty': { sv: 'Inga projekt ännu. Skapa ett nytt projekt för att komma igång.', en: 'No projects yet. Create a new project to get started.' },
  'projects.new': { sv: 'Nytt projekt', en: 'New project' },
  'projects.import': { sv: 'Importera', en: 'Import' },

  // Project detail
  'project.phase1': { sv: 'Planering', en: 'Planning' },
  'project.phase2': { sv: 'Butik', en: 'Store' },
  'project.phase3': { sv: 'Inköpslista', en: 'Shopping list' },
  'project.export': { sv: 'Exportera', en: 'Export' },
  'project.delete': { sv: 'Ta bort projekt', en: 'Delete project' },

  // Settings page
  'settings.title': { sv: 'Inställningar', en: 'Settings' },
  'settings.language': { sv: 'Språk', en: 'Language' },
  'settings.language.sv': { sv: 'Svenska', en: 'Swedish' },
  'settings.language.en': { sv: 'Engelska', en: 'English' },

  // Lumber types
  'type.deck-board': { sv: 'Trall', en: 'Deck board' },
  'type.joist': { sv: 'Regel', en: 'Joist' },
  'type.post': { sv: 'Stolpe', en: 'Post' },
  'type.rim-joist': { sv: 'Ramvirke', en: 'Rim joist' },

  // Phase 2 – Store
  'phase2.title': { sv: 'Tillgängliga längder i butiken', en: 'Available lengths at the store' },
  'phase2.noItems': { sv: 'Lägg till virke i Planering-fliken först.', en: 'Add lumber in the Planning tab first.' },
  'phase2.presets': { sv: 'Standardlängder', en: 'Standard lengths' },
  'phase2.custom': { sv: 'Annan längd (m)', en: 'Custom length (m)' },
  'phase2.addCustom': { sv: 'Lägg till', en: 'Add' },
  'phase2.inStock': { sv: 'I lager', en: 'In stock' },
  'phase2.noStock': { sv: 'Inga längder valda', en: 'No lengths selected' },

  // Phase 1 – Planning
  'phase1.addItem': { sv: 'Lägg till virke', en: 'Add lumber' },
  'phase1.empty': { sv: 'Inga virken tillagda ännu.', en: 'No lumber added yet.' },
  'phase1.width': { sv: 'Bredd (mm)', en: 'Width (mm)' },
  'phase1.height': { sv: 'Höjd (mm)', en: 'Height (mm)' },
  'phase1.length': { sv: 'Längd (m)', en: 'Length (m)' },
  'phase1.quantity': { sv: 'Antal', en: 'Quantity' },
  'phase1.type': { sv: 'Typ (valfritt)', en: 'Type (optional)' },
  'phase1.type.none': { sv: 'Ingen typ', en: 'No type' },
  'phase1.dimension': { sv: 'Dimension', en: 'Dimension' },
  'phase1.totalPieces': { sv: 'st', en: 'pcs' },

  // Common
  'common.save': { sv: 'Spara', en: 'Save' },
  'common.cancel': { sv: 'Avbryt', en: 'Cancel' },
  'common.delete': { sv: 'Ta bort', en: 'Delete' },
  'common.edit': { sv: 'Redigera', en: 'Edit' },
  'common.add': { sv: 'Lägg till', en: 'Add' },
}

/**
 * @param {string} key
 * @param {'sv'|'en'} language
 * @returns {string}
 */
export function t(key, language) {
  return strings[key]?.[language] ?? key
}
