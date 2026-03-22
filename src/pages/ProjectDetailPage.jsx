import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/app.store'
import { projectService } from '../services/project.service'
import { t } from '../utils/i18n'
import { PhaseOnePlanning } from '../features/project/PhaseOnePlanning'
import { PhaseTwoStore } from '../features/project/PhaseTwoStore'

const PHASES = ['phase1', 'phase2', 'phase3']

export default function ProjectDetailPage() {
  const { id } = useParams()
  const language = useAppStore((s) => s.language)
  const navigate = useNavigate()

  const [activePhase, setActivePhase] = useState('phase1')
  // Incrementing this causes the page to re-read the project from storage after mutations.
  const [version, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  // Re-read on every render (version bump or language change)
  const project = projectService.getById(id)

  if (!project) {
    return (
      <div className="text-stone-400 text-sm">
        Project not found.{' '}
        <button onClick={() => navigate('/')} className="text-green-500 hover:underline">
          Back to projects
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/')}
        className="text-stone-400 hover:text-stone-200 transition-colors text-sm mb-6 inline-block"
      >
        ← {t('nav.projects', language)}
      </button>

      <h1 className="text-2xl font-semibold text-stone-100 mb-1">{project.name}</h1>
      {project.description && (
        <p className="text-stone-400 text-sm mb-5">{project.description}</p>
      )}

      {/* Phase tabs */}
      <div className="flex gap-1 mb-6 border-b border-stone-700">
        {PHASES.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors -mb-px border-b-2 ${
              activePhase === phase
                ? 'text-green-400 border-green-500 bg-stone-800'
                : 'text-stone-400 border-transparent hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            {t(`project.${phase}`, language)}
          </button>
        ))}
      </div>

      {activePhase === 'phase1' && (
        <PhaseOnePlanning project={project} language={language} onProjectChange={refresh} />
      )}
      {activePhase === 'phase2' && (
        <PhaseTwoStore project={project} language={language} onProjectChange={refresh} />
      )}
      {activePhase === 'phase3' && (
        <p className="text-stone-500 text-sm">
          {t('project.phase3', language)} – coming soon.
        </p>
      )}
    </div>
  )
}
