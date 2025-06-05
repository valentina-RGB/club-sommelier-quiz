import { useState, useEffect } from 'react'

interface LoadingState {
  isLoading: boolean
  progress: number
  phase: string
}

export function useAppLoading(minimumLoadTime: number = 2000) {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    progress: 0,
    phase: 'Inicializando...'
  })

  useEffect(() => {
    const phases = [
      { name: 'Cargando tema...', duration: 300 },
      { name: 'Preparando interfaz...', duration: 500 },
      { name: 'Conectando servicios...', duration: 400 },
      { name: 'Configurando experiencia...', duration: 600 },
      { name: 'Listo para comenzar!', duration: 200 }
    ]

    let currentProgress = 0
    let phaseIndex = 0

    const updateProgress = () => {
      if (phaseIndex < phases.length) {
        const phase = phases[phaseIndex]
        setLoadingState(prev => ({
          ...prev,
          phase: phase.name,
          progress: currentProgress
        }))

        setTimeout(() => {
          currentProgress += (100 / phases.length)
          phaseIndex++
          updateProgress()
        }, phase.duration)
      } else {
        setTimeout(() => {
          setLoadingState(prev => ({
            ...prev,
            isLoading: false,
            progress: 100
          }))
        }, Math.max(0, minimumLoadTime - phases.reduce((acc, p) => acc + p.duration, 0)))
      }
    }

    updateProgress()
  }, [minimumLoadTime])

  return loadingState
}