"use client"

import { forwardRef, useEffect, useRef, useImperativeHandle } from "react"
import { cn } from "@/lib/utils"

const SignatureCanvas = forwardRef(
  ({ text, style, font, color, strokeWidth, animationSpeed, isAnimating, playAnimation = false }, ref) => {
    const canvasRef = useRef(null)
    const animationRef = useRef(null)
    const pathsRef = useRef([])
    const progressRef = useRef(0)
    const animationStartTimeRef = useRef(0)

    // Expose canvas methods to parent component
    useImperativeHandle(ref, () => ({
      toDataURL: (type = "image/png", quality = 1) => {
        return canvasRef.current.toDataURL(type, quality)
      },
      toSVG: () => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        const width = canvas.width
        const height = canvas.height

        // Create SVG
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`

        // Add text element
        svg += `<text x="${width / 2}" y="${height / 2}" fontFamily="${font}" fontSize="${calculateFontSize(text, width)}" fill="${color}" textAnchor="middle" dominantBaseline="middle" stroke="${color}" strokeWidth="${strokeWidth / 2}">${text}</text>`

        // For elegant style, add path elements
        if (style === "elegant" && pathsRef.current.length > 0) {
          pathsRef.current.forEach((path) => {
            let pathData = `M ${path[0].x} ${path[0].y}`
            for (let i = 1; i < path.length; i++) {
              pathData += ` L ${path[i].x} ${path[i].y}`
            }
            svg += `<path d="${pathData}" fill="none" stroke="${color}" strokeWidth="${strokeWidth}" strokeLinecap="round" strokeLinejoin="round" />`
          })
        }

        svg += "</svg>"
        return svg
      },
    }))

    // Calculate appropriate font size based on text length and canvas width
    const calculateFontSize = (text, canvasWidth) => {
      const baseSize = 72
      const textLength = text.length
      const adjustmentFactor = Math.min(1, 10 / textLength)
      return Math.floor(baseSize * adjustmentFactor * (canvasWidth / 500))
    }

    // Enhanced animations for all styles
    const animateSignature = (timestamp) => {
      if (!animationStartTimeRef.current) {
        animationStartTimeRef.current = timestamp
      }

      const elapsed = timestamp - animationStartTimeRef.current
      const duration = 1000 // 1 second animation
      const progress = Math.min(1, elapsed / duration)

      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      const width = canvas.width
      const height = canvas.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Set common text properties
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const fontSize = calculateFontSize(text, width)
      ctx.font = `${fontSize}px ${font}`

      // Apply style-specific animation
      switch (style) {
        case "calligraphy":
          animateCalligraphy(ctx, progress, width, height, fontSize)
          break
        case "handwriting":
          animateHandwriting(ctx, progress, width, height, fontSize)
          break
        case "modern":
          animateModern(ctx, progress, width, height, fontSize)
          break
        case "elegant":
          animateElegant(ctx, progress, width, height, fontSize)
          break
        default:
          // Default animation
          ctx.globalAlpha = progress
          ctx.fillStyle = color
          ctx.fillText(text, width / 2, height / 2)
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animateSignature)
      } else {
        animationStartTimeRef.current = 0
        // Reset to static rendering
        drawSignature()
      }
    }

    // Calligraphy animation
    const animateCalligraphy = (ctx, progress, width, height, fontSize) => {
      // Draw stroke first with growing effect
      ctx.strokeStyle = color
      ctx.lineWidth = strokeWidth
      ctx.globalAlpha = Math.min(1, progress * 2)

      // Scale effect
      const scale = 0.8 + 0.2 * progress
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(scale, scale)
      ctx.strokeText(text, 0, 0)

      // Then fill with fade-in
      ctx.fillStyle = color
      ctx.globalAlpha = progress
      ctx.fillText(text, 0, 0)
      ctx.restore()

      // Add decorative underline with growing effect
      if (progress > 0.5) {
        const underlineProgress = (progress - 0.5) * 2
        const textWidth = ctx.measureText(text).width * scale

        ctx.beginPath()
        ctx.moveTo(width / 2 - (textWidth / 2) * underlineProgress, height / 2 + fontSize / 2 + 10)
        ctx.lineTo(width / 2 + (textWidth / 2) * underlineProgress, height / 2 + fontSize / 2 + 10)
        ctx.stroke()
      }
    }

    // Handwriting animation
    const animateHandwriting = (ctx, progress, width, height, fontSize) => {
      const textWidth = ctx.measureText(text).width

      // Draw text with clip to show only part of it
      ctx.save()
      ctx.beginPath()
      ctx.rect(width / 2 - textWidth / 2, 0, textWidth * progress, height)
      ctx.clip()

      ctx.fillStyle = color
      ctx.fillText(text, width / 2, height / 2)

      // Add a "pen tip" at the current position
      if (progress > 0 && progress < 1) {
        const currentX = width / 2 - textWidth / 2 + textWidth * progress
        const currentY = height / 2

        ctx.beginPath()
        ctx.arc(currentX, currentY, strokeWidth * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }

      ctx.restore()
    }

    // Modern animation
    const animateModern = (ctx, progress, width, height, fontSize) => {
      // Create gradient animation
      const gradient = ctx.createLinearGradient(
        0,
        height / 2 - fontSize / 2,
        width * progress,
        height / 2 + fontSize / 2,
      )
      gradient.addColorStop(0, adjustColor(color, 20))
      gradient.addColorStop(0.5, color)
      gradient.addColorStop(1, adjustColor(color, -20))

      // Scale and fade in
      const scale = 0.9 + 0.1 * progress
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(scale, scale)

      // Add shadow effect
      if (progress > 0.3) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = (5 * (progress - 0.3)) / 0.7
        ctx.shadowOffsetX = (2 * (progress - 0.3)) / 0.7
        ctx.shadowOffsetY = (2 * (progress - 0.3)) / 0.7
      }

      ctx.fillStyle = gradient
      ctx.globalAlpha = progress
      ctx.fillText(text, 0, 0)

      // Add highlight effect
      if (progress > 0.7) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
        ctx.globalAlpha = (progress - 0.7) * 3
        ctx.fillText(text, -1, -1)
      }

      ctx.restore()
    }

    // Elegant animation
    const animateElegant = (ctx, progress, width, height, fontSize) => {
      // Draw main text with gradient
      const gradient = ctx.createLinearGradient(0, height / 2 - fontSize / 2, 0, height / 2 + fontSize / 2)
      gradient.addColorStop(0, adjustColor(color, 30))
      gradient.addColorStop(0.5, color)
      gradient.addColorStop(1, adjustColor(color, -30))

      ctx.fillStyle = gradient
      ctx.globalAlpha = progress
      ctx.fillText(text, width / 2, height / 2)

      // Add flourishes with delayed animation
      if (progress > 0.3) {
        const flourishProgress = (progress - 0.3) / 0.7
        if (pathsRef.current.length === 0) {
          generateElegantFlourishes(text, width, height, fontSize)
        }

        ctx.strokeStyle = adjustColor(color, -20)
        ctx.lineWidth = strokeWidth * 0.7
        pathsRef.current.forEach((path, index) => {
          const pathProgress = Math.max(0, Math.min(1, flourishProgress * 3 - index))
          if (pathProgress <= 0) return

          const pointCount = Math.floor(path.length * pathProgress)
          if (pointCount < 2) return

          ctx.beginPath()
          ctx.moveTo(path[0].x, path[0].y)

          for (let i = 1; i < pointCount - 1; i += 2) {
            const xc = (path[i].x + path[i + 1].x) / 2
            const yc = (path[i].y + path[i + 1].y) / 2
            ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc)
          }

          ctx.stroke()
        })
      }
    }

    // Draw the signature on the canvas (static version)
    const drawSignature = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set common text properties
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const fontSize = calculateFontSize(text, canvas.width)
      ctx.font = `${fontSize}px ${font}`

      // Apply style-specific rendering
      switch (style) {
        case "calligraphy":
          // Calligraphy style with elegant stroke
          ctx.lineWidth = strokeWidth
          ctx.strokeStyle = color
          ctx.fillStyle = color

          // Add a subtle shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
          ctx.shadowBlur = 2
          ctx.shadowOffsetX = 1
          ctx.shadowOffsetY = 1

          // Draw text with stroke first, then fill
          ctx.strokeText(text, canvas.width / 2, canvas.height / 2)
          ctx.fillText(text, canvas.width / 2, canvas.height / 2)

          // Add decorative underline
          const textWidth = ctx.measureText(text).width
          ctx.beginPath()
          ctx.moveTo(canvas.width / 2 - textWidth / 2, canvas.height / 2 + fontSize / 2 + 10)
          ctx.lineTo(canvas.width / 2 + textWidth / 2, canvas.height / 2 + fontSize / 2 + 10)
          ctx.stroke()

          // Reset shadow
          ctx.shadowColor = "transparent"
          break

        case "handwriting":
          // Revert to original handwriting style
          ctx.fillStyle = color
          ctx.fillText(text, canvas.width / 2, canvas.height / 2)
          break

        case "modern":
          // Modern style with shadow and gradient
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
          gradient.addColorStop(0, color)
          gradient.addColorStop(1, adjustColor(color, -20))

          ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
          ctx.shadowBlur = 5
          ctx.shadowOffsetX = 2
          ctx.shadowOffsetY = 2

          ctx.fillStyle = gradient
          ctx.fillText(text, canvas.width / 2, canvas.height / 2)

          // Add a subtle highlight
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
          ctx.fillText(text, canvas.width / 2 - 1, canvas.height / 2 - 1)

          // Reset shadow
          ctx.shadowColor = "transparent"
          break

        case "elegant":
          // Elegant style with flourishes and gold effect
          // Create gold gradient
          const goldGradient = ctx.createLinearGradient(
            0,
            canvas.height / 2 - fontSize / 2,
            0,
            canvas.height / 2 + fontSize / 2,
          )
          goldGradient.addColorStop(0, adjustColor(color, 30))
          goldGradient.addColorStop(0.5, color)
          goldGradient.addColorStop(1, adjustColor(color, -30))

          ctx.fillStyle = goldGradient
          ctx.strokeStyle = adjustColor(color, -50)
          ctx.lineWidth = strokeWidth * 0.5

          // Add embossed effect
          ctx.shadowColor = "rgba(255, 255, 255, 0.5)"
          ctx.shadowBlur = 2
          ctx.shadowOffsetX = -1
          ctx.shadowOffsetY = -1
          ctx.fillText(text, canvas.width / 2, canvas.height / 2)

          ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
          ctx.shadowOffsetX = 1
          ctx.shadowOffsetY = 1
          ctx.strokeText(text, canvas.width / 2, canvas.height / 2)

          // Add decorative flourishes
          if (pathsRef.current.length === 0) {
            generateElegantFlourishes(text, canvas.width, canvas.height, fontSize)
          }

          // Draw flourishes
          ctx.strokeStyle = adjustColor(color, -20)
          ctx.lineWidth = strokeWidth * 0.7
          pathsRef.current.forEach((path) => {
            ctx.beginPath()
            ctx.moveTo(path[0].x, path[0].y)

            // Use quadratic curves for smoother flourishes
            for (let i = 1; i < path.length - 1; i += 2) {
              const xc = (path[i].x + path[i + 1].x) / 2
              const yc = (path[i].y + path[i + 1].y) / 2
              ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc)
            }

            // Handle last point
            if (path.length % 2 === 0) {
              ctx.lineTo(path[path.length - 1].x, path[path.length - 1].y)
            }

            ctx.stroke()
          })

          // Reset shadow
          ctx.shadowColor = "transparent"
          break

        default:
          // Default rendering
          ctx.fillStyle = color
          ctx.fillText(text, canvas.width / 2, canvas.height / 2)
      }
    }

    // Generate elegant flourishes for the elegant style
    const generateElegantFlourishes = (text, width, height, fontSize) => {
      const paths = []
      const centerX = width / 2
      const centerY = height / 2
      const textWidth = canvasRef.current.getContext("2d").measureText(text).width

      // Add a decorative underline with flourish
      const underline = []
      const startX = centerX - textWidth / 2 - 20
      const endX = centerX + textWidth / 2 + 20
      const lineY = centerY + fontSize / 2 + 10

      // Create curved underline
      for (let x = startX; x <= endX; x += 5) {
        const progress = (x - startX) / (endX - startX)
        const y = lineY + Math.sin(progress * Math.PI) * 5
        underline.push({ x, y })
      }

      // Add flourish at the end
      const flourishEnd = []
      for (let i = 0; i < 20; i++) {
        const angle = i * 0.2
        const radius = 10 + i * 1.5
        flourishEnd.push({
          x: endX + Math.cos(angle) * radius,
          y: lineY + Math.sin(angle) * radius,
        })
      }

      // Add flourish at the beginning
      const flourishStart = []
      for (let i = 0; i < 20; i++) {
        const angle = Math.PI - i * 0.2
        const radius = 10 + i * 1.5
        flourishStart.push({
          x: startX + Math.cos(angle) * radius,
          y: lineY + Math.sin(angle) * radius,
        })
      }

      paths.push(underline, flourishEnd, flourishStart)
      pathsRef.current = paths
    }

    // Adjust color brightness
    const adjustColor = (color, amount) => {
      const hex = color.replace("#", "")
      const num = Number.parseInt(hex, 16)
      const r = Math.min(255, Math.max(0, (num >> 16) + amount))
      const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount))
      const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount))
      return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`
    }

    // Handle canvas resize
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      drawSignature()
    }

    // Initialize canvas and handle resize
    useEffect(() => {
      window.addEventListener("resize", resizeCanvas)
      resizeCanvas()

      return () => {
        window.removeEventListener("resize", resizeCanvas)
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [])

    // Handle one-time animation trigger
    useEffect(() => {
      if (playAnimation) {
        // Cancel any existing animations
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }

        // Reset animation state
        animationStartTimeRef.current = 0

        // Start new animation
        animationRef.current = requestAnimationFrame(animateSignature)
      }
    }, [playAnimation])

    // Redraw when props change
    useEffect(() => {
      // Reset paths when style changes
      if (style === "elegant") {
        pathsRef.current = []
      }

      // Cancel any existing animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }

      drawSignature()
    }, [text, style, font, color, strokeWidth, animationSpeed, isAnimating])

    return (
      <canvas
        ref={canvasRef}
        className={cn("w-full h-full", "transition-transform duration-300")}
        style={{ maxWidth: "100%" }}
      />
    )
  },
)

SignatureCanvas.displayName = "SignatureCanvas"

export default SignatureCanvas

