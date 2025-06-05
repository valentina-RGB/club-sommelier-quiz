"use client"

import type React from "react"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Brain, CheckCircle2, XCircle, HelpCircle, Scale } from "lucide-react"

const initialColors = [
  "#22c55e", 
  "#ef4444", 
  "#8b5cf6", 
  "#3b82f6", 
]

const iconMap = {
  "#22c55e": CheckCircle2, 
  "#ef4444": XCircle, 
  "#8b5cf6": Brain,
  "#3b82f6": Scale, 
}

function shuffle([...array]: string[]) {
  return array.sort(() => Math.random() - 0.5)
}

export function QuizLoader() {
  const [order, setOrder] = useState(initialColors)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setOrder(shuffle(order))
      setCurrentPhase((prev) => (prev + 1) % 3)
    }, 1500)
    return () => clearTimeout(timeout)
  }, [order])

  const phases = [
    { text: "Cargando preguntas...", icon: HelpCircle },
    { text: "Separando verdades de mitos...", icon: Scale },
    { text: "Analizando hechos...", icon: Brain },
  ]

  const currentPhaseData = phases[currentPhase % phases.length]
  const PhaseIcon = currentPhaseData.icon

  const containerStyle = isMobile ? mobileContainer : container
  const itemStyle = isMobile ? mobileItemStyle : item

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-4">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-2">
          ¿Realidad o Mito?
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)]">
          {currentPhaseData.text}
        </p>
      </div>      <ul style={containerStyle} className="mb-8 sm:mb-12">
        {order.map((backgroundColor) => {
          const Icon = iconMap[backgroundColor as keyof typeof iconMap]
          return (
            <motion.li
              key={backgroundColor}
              layout
              transition={spring}
              style={{ ...itemStyle, backgroundColor }}
              className="flex items-center justify-center shadow-lg"
            >
              <Icon 
                size={isMobile ? 20 : 24} 
                className="text-white drop-shadow-lg" 
              />
            </motion.li>
          )
        })}
      </ul>

      <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
        <PhaseIcon size={isMobile ? 18 : 20} className="text-[var(--accent-primary)]" />
        <div className="flex space-x-1">
          {phases.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i === currentPhase % phases.length 
                  ? 'bg-[var(--accent-primary)]' 
                  : 'bg-[var(--accent-primary)]/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300,
}

const container: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  position: "relative",
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  width: 300,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const item: React.CSSProperties = {
  width: 100,
  height: 100,
  borderRadius: "10px",
}

const mobileContainer: React.CSSProperties = {
  ...container,
  width: 240,
  gap: 8,
}

const mobileItemStyle: React.CSSProperties = {
  width: 80,
  height: 80,
  borderRadius: "8px",
}