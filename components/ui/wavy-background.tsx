"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

export function WavyBackground({
  children,
  className,
  containerClassName,
  colors = ["#bae6fd", "#e0f2fe", "#f0f9ff"],
  waveWidth = 50,
  backgroundFill = "white",
  blur = 10,
  speed = "slow",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
  [key: string]: any
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [waveHeight, setWaveHeight] = useState(0)
  const [animationSpeed, setAnimationSpeed] = useState(0)

  useEffect(() => {
    if (containerRef.current) {
      setWaveHeight(containerRef.current.offsetHeight / 20)
    }
    setAnimationSpeed(speed === "fast" ? "15s" : "25s")
  }, [speed])

  return (
    <div
      className={cn("relative flex flex-col items-center justify-center overflow-hidden", containerClassName)}
      ref={containerRef}
      {...props}
    >
      <svg
        className="absolute inset-0 w-full h-full z-0"
        style={{
          filter: `blur(${blur}px)`,
        }}
        viewBox={`0 0 ${waveWidth} ${waveHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            {colors.map((color, i) => (
              <stop key={i} offset={`${(i / colors.length) * 100}%`} stopColor={color} stopOpacity={waveOpacity} />
            ))}
          </linearGradient>
        </defs>
        <path fill={backgroundFill} d={`M0 0 L${waveWidth} 0 L${waveWidth} ${waveHeight} L0 ${waveHeight} Z`}></path>
        <path
          fill="url(#gradient)"
          d={`M0 ${waveHeight / 2} C${waveWidth / 4} ${waveHeight / 2 - waveHeight / 4}, ${(waveWidth / 4) * 3} ${waveHeight / 2 + waveHeight / 4}, ${waveWidth} ${waveHeight / 2} L${waveWidth} ${waveHeight} L0 ${waveHeight} Z`}
        >
          <animate
            attributeName="d"
            values={`
              M0 ${waveHeight / 2} C${waveWidth / 4} ${waveHeight / 2 - waveHeight / 4}, ${(waveWidth / 4) * 3} ${waveHeight / 2 + waveHeight / 4}, ${waveWidth} ${waveHeight / 2} L${waveWidth} ${waveHeight} L0 ${waveHeight} Z;
              M0 ${waveHeight / 2} C${waveWidth / 4} ${waveHeight / 2 + waveHeight / 4}, ${(waveWidth / 4) * 3} ${waveHeight / 2 - waveHeight / 4}, ${waveWidth} ${waveHeight / 2} L${waveWidth} ${waveHeight} L0 ${waveHeight} Z;
              M0 ${waveHeight / 2} C${waveWidth / 4} ${waveHeight / 2 - waveHeight / 4}, ${(waveWidth / 4) * 3} ${waveHeight / 2 + waveHeight / 4}, ${waveWidth} ${waveHeight / 2} L${waveWidth} ${waveHeight} L0 ${waveHeight} Z
            `}
            dur={animationSpeed}
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <div className={cn("relative z-10 w-full", className)}>{children}</div>
    </div>
  )
}

