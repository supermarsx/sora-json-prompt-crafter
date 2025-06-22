import BulkFileImportModal from '../BulkFileImportModal'
import ClipboardImportModal from '../ClipboardImportModal'
import DisclaimerModal from '../DisclaimerModal'

import HistoryPanelDefault, { HistoryPanel } from '../HistoryPanel'
import ImportModalDefault, { ImportModal } from '../ImportModal'

import { ActionBar } from '../ActionBar'
import { CollapsibleSection } from '../CollapsibleSection'
import { ControlPanel } from '../ControlPanel'
import { MultiSelectDropdown } from '../MultiSelectDropdown'
import { ProgressBar } from '../ProgressBar'
import { SearchableDropdown } from '../SearchableDropdown'
import { ShareModal } from '../ShareModal'

describe('component export tests', () => {
  const defaultOnly = {
    BulkFileImportModal,
    ClipboardImportModal,
    DisclaimerModal,
  }

  const namedOnly = {
    ActionBar,
    CollapsibleSection,
    ControlPanel,
    MultiSelectDropdown,
    ProgressBar,
    SearchableDropdown,
    ShareModal,
  }

  const both = {
    HistoryPanel: [HistoryPanelDefault, HistoryPanel],
    ImportModal: [ImportModalDefault, ImportModal],
  }

  for (const [name, component] of Object.entries(defaultOnly)) {
    test(`${name} default export is defined`, () => {
      expect(component).toBeDefined()
    })
  }

  for (const [name, component] of Object.entries(namedOnly)) {
    test(`${name} named export is defined`, () => {
      expect(component).toBeDefined()
    })
  }

  for (const [name, [def, named]] of Object.entries(both) as any) {
    test(`${name} default equals named export`, () => {
      expect(def).toBeDefined()
      expect(named).toBeDefined()
      expect(def).toBe(named)
    })
  }
})
