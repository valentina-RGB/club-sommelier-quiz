"use client"

import { animate, stagger } from "motion"
import { splitText } from "motion-plus"
import { useEffect, useRef } from "react"

interface SplitTextWelcomeProps {
  text: string;
  className?: string;
  animationDelay?: number;
}

export function SplitTextWelcome({ 
  text, 
  className = "", 
  animationDelay = 0 
}: SplitTextWelcomeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      document.fonts.ready.then(() => {
        if (!containerRef.current) return

        containerRef.current.style.visibility = "visible"

        const h1Element = containerRef.current.querySelector("h1")
        if (!h1Element) return

        const { words } = splitText(h1Element)

        animate(
          words,
          { 
            opacity: [0, 1], 
            y: [20, 0],
            scale: [0.8, 1]
          },
          {
            type: "spring",
            duration: 1.5,
            bounce: 0.3,
            delay: stagger(0.08),
          }
        )
      })
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [animationDelay])
  return (
    <div 
      ref={containerRef} 
      className={`split-text-container ${className}`}
      style={{ visibility: 'hidden' }}
    >
      <h1 className="split-text-heading text-[var(--text-primary)] font-bold text-center" style={{
        fontSize: 'clamp(1.125rem, 5vw, 2.5rem)',
        lineHeight: '1.1',
        maxWidth: '100%',
        wordWrap: 'break-word',
        padding: '0 0.5rem'
      }}>
        {text}
      </h1>
      <style>{`
        .split-text-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          text-align: center;
          padding: 0 0.5rem;
        }

        .split-word {
          will-change: transform, opacity;
          display: inline-block;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .split-text-container {
            padding: 0 0.25rem;
          }
        }

        /* Prevent text overflow on very small screens */
        @media (max-width: 320px) {
          .split-text-heading {
            font-size: 1rem !important;
            line-height: 1.2 !important;
          }
        }
      `}</style>
    </div>
  )
}
