"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Download, Sparkles, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import SignatureCanvas from "./signature-canvas"
import ColorPicker from "./color-picker"
import SignatureExamples from "./signature-examples"
import { cn } from "@/lib/utils"

// Update the signature styles - removed brush style
const SIGNATURE_STYLES = [
  {
    id: "calligraphy",
    name: "Calligraphy",
    icon: "✒️",
    description: "Elegant and formal",
  },
  {
    id: "handwriting",
    name: "Handwriting",
    icon: "✍️",
    description: "Natural and flowing",
  },
  {
    id: "modern",
    name: "Modern",
    icon: "🖋️",
    description: "Clean and professional",
  },
  {
    id: "elegant",
    name: "Elegant",
    icon: "💫",
    description: "Refined and decorative",
  },
]

// Define font options for each style
const FONT_OPTIONS = {
  calligraphy: [
    { id: "tangerine", name: "Tangerine", value: "'Tangerine', cursive" },
    { id: "dancing-script", name: "Dancing Script", value: "'Dancing Script', cursive" },
    { id: "parisienne", name: "Parisienne", value: "'Parisienne', cursive" },
    { id: "alex-brush", name: "Alex Brush", value: "'Alex Brush', cursive" },
    { id: "great-vibes", name: "Great Vibes", value: "'Great Vibes', cursive" },
  ],
  handwriting: [
    { id: "caveat", name: "Caveat", value: "'Caveat', cursive" },
    { id: "indie-flower", name: "Indie Flower", value: "'Indie Flower', cursive" },
    { id: "sacramento", name: "Sacramento", value: "'Sacramento', cursive" },
    { id: "shadows-into-light", name: "Shadows Into Light", value: "'Shadows Into Light', cursive" },
    { id: "patrick-hand", name: "Patrick Hand", value: "'Patrick Hand', cursive" },
  ],
  modern: [
    { id: "montserrat", name: "Montserrat", value: "'Montserrat', sans-serif" },
    { id: "raleway", name: "Raleway", value: "'Raleway', sans-serif" },
    { id: "playfair", name: "Playfair Display", value: "'Playfair Display', serif" },
    { id: "poppins", name: "Poppins", value: "'Poppins', sans-serif" },
    { id: "cormorant", name: "Cormorant", value: "'Cormorant Garamond', serif" },
  ],
  elegant: [
    { id: "pinyon-script", name: "Pinyon Script", value: "'Pinyon Script', cursive" },
    { id: "petit-formal", name: "Petit Formal Script", value: "'Petit Formal Script', cursive" },
    { id: "cinzel", name: "Cinzel", value: "'Cinzel', serif" },
    { id: "cormorant-upright", name: "Cormorant Upright", value: "'Cormorant Upright', serif" },
    { id: "playfair-sc", name: "Playfair SC", value: "'Playfair Display SC', serif" },
  ],
}

// Define color palettes
const COLOR_PALETTES = [
  {
    name: "Ocean Blue",
    colors: ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"],
  },
  {
    name: "Elegant Black",
    colors: ["#000000", "#171717", "#262626", "#404040", "#525252"],
  },
  {
    name: "Royal Purple",
    colors: ["#7e22ce", "#6b21a8", "#581c87", "#4c1d95", "#4a1d96"],
  },
  {
    name: "Forest Green",
    colors: ["#16a34a", "#15803d", "#166534", "#14532d", "#052e16"],
  },
  {
    name: "Sunset Red",
    colors: ["#dc2626", "#b91c1c", "#991b1b", "#7f1d1d", "#701a1a"],
  },
]

export default function SignatureGenerator() {
  const [text, setText] = useState("Your Signature")
  const [style, setStyle] = useState("calligraphy")
  const [font, setFont] = useState(FONT_OPTIONS.calligraphy[0].value)
  const [color, setColor] = useState("#0ea5e9") // Baby blue
  const [strokeWidth, setStrokeWidth] = useState(2)
  const [animationSpeed, setAnimationSpeed] = useState(10)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const canvasRef = useRef(null)

  // Add animation states
  const [isStyleChanging, setIsStyleChanging] = useState(false)
  const [activeAnimation, setActiveAnimation] = useState(false)

  // Update font options when style changes
  useEffect(() => {
    setFont(FONT_OPTIONS[style][0].value)
  }, [style])

  // Handle text input change
  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  // Handle export as PNG
  const handleExportPNG = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.download = `${text.replace(/\s+/g, "-").toLowerCase()}-signature.png`
      link.href = dataUrl
      link.click()
    }
  }

  // Handle export as SVG
  const handleExportSVG = () => {
    if (canvasRef.current) {
      const svg = canvasRef.current.toSVG()
      const blob = new Blob([svg], { type: "image/svg+xml" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.download = `${text.replace(/\s+/g, "-").toLowerCase()}-signature.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  // Enhanced style change handler with animation
  const handleStyleChange = (newStyle: string) => {
    if (newStyle === style) {
      // Trigger animation for current style
      setActiveAnimation(true)
      setTimeout(() => setActiveAnimation(false), 1000)
      return
    }

    setIsStyleChanging(true)
    setStyle(newStyle)
    setTimeout(() => {
      setIsStyleChanging(false)
      // Auto-animate the new style
      setActiveAnimation(true)
      setTimeout(() => setActiveAnimation(false), 1000)
    }, 300)
  }

  // Apply random style
  const applyRandomStyle = () => {
    // Select random style
    const randomStyle = SIGNATURE_STYLES[Math.floor(Math.random() * SIGNATURE_STYLES.length)].id
    setStyle(randomStyle)

    // Select random font from that style
    const fonts = FONT_OPTIONS[randomStyle]
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)].value
    setFont(randomFont)

    // Select random color
    const randomPalette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]
    const randomColor = randomPalette.colors[Math.floor(Math.random() * randomPalette.colors.length)]
    setColor(randomColor)

    // Random stroke width between 1 and 5
    setStrokeWidth(Math.floor(Math.random() * 4) + 1)

    // Trigger animation
    setTimeout(() => {
      setActiveAnimation(true)
      setTimeout(() => setActiveAnimation(false), 1000)
    }, 300)
  }

  return (
    <div className="pb-20">
      {/* Examples Modal */}
      {showExamples && (
        <SignatureExamples
          onClose={() => setShowExamples(false)}
          onSelect={(example) => {
            setText(example.text)
            setStyle(example.style)
            setFont(example.font)
            setColor(example.color)
            setStrokeWidth(example.strokeWidth)
            setShowExamples(false)

            // Trigger animation for the selected example
            setTimeout(() => {
              setActiveAnimation(true)
              setTimeout(() => setActiveAnimation(false), 1000)
            }, 300)
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 col-span-1 bg-white/90 backdrop-blur-sm border border-sky-100 shadow-lg rounded-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Customize Your Signature</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary border-primary/20 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                    onClick={applyRandomStyle}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Surprise Me
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Try a random style combination</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-6">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="signature-text" className="text-slate-700">
                Your Signature Text
              </Label>
              <Input
                id="signature-text"
                value={text}
                onChange={handleTextChange}
                placeholder="Enter your signature text"
                className="border-sky-200 focus:border-primary focus:ring-primary transition-all duration-300"
              />
            </div>

            {/* Updated Style Selection with even more spacing */}
            <div className="space-y-3">
              <Label className="text-slate-700">Signature Style</Label>
              <Tabs value={style} onValueChange={handleStyleChange} className="w-full">
                <TabsList className="w-full bg-sky-50/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {SIGNATURE_STYLES.map((styleOption) => (
                      <TabsTrigger
                        key={styleOption.id}
                        value={styleOption.id}
                        className={cn(
                          "relative flex flex-col items-center justify-center px-6 py-4 rounded-md transition-all duration-300",
                          "data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md",
                          "hover:bg-white/50 hover:text-primary-600 hover:scale-105",
                          "group",
                        )}
                      >
                        <span className="text-xl mb-1.5 transform group-hover:scale-110 transition-transform">
                          {styleOption.icon}
                        </span>
                        <span className="text-xs font-medium">{styleOption.name}</span>
                        <div className="absolute inset-0 rounded-md bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </TabsTrigger>
                    ))}
                  </div>
                </TabsList>
              </Tabs>

              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">{SIGNATURE_STYLES.find((s) => s.id === style)?.description}</p>
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary/80 hover:text-primary transition-colors duration-300"
                  onClick={() => setShowExamples(true)}
                >
                  View Examples
                </Button>
              </div>
            </div>

            {/* Font Selection */}
            <div className="space-y-2">
              <Label htmlFor="font-select" className="text-slate-700">
                Font Style
              </Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger
                  id="font-select"
                  className="border-sky-200 transition-all duration-300 hover:border-primary/50"
                >
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS[style].map((fontOption) => (
                    <SelectItem key={fontOption.id} value={fontOption.value} className="font-medium">
                      <span style={{ fontFamily: fontOption.value }}>{fontOption.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-slate-700">Signature Color</Label>
              <ColorPicker color={color} onChange={setColor} palettes={COLOR_PALETTES} />
            </div>

            {/* Stroke Width */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="stroke-width" className="text-slate-700">
                  Stroke Thickness
                </Label>
                <span className="text-sm text-slate-500">{strokeWidth}px</span>
              </div>
              <Slider
                id="stroke-width"
                min={1}
                max={10}
                step={0.5}
                value={[strokeWidth]}
                onValueChange={(value) => setStrokeWidth(value[0])}
                className="py-2"
              />
            </div>
          </div>
        </Card>

        {/* Preview Panel */}
        <Card className="p-6 col-span-1 lg:col-span-2 bg-white/90 backdrop-blur-sm border border-sky-100 shadow-lg rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Your Signature Preview</h2>
            <div className="flex space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky-200 hover:bg-sky-50 transition-all duration-300 hover:scale-105"
                      onClick={handleExportPNG}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      PNG
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as PNG image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky-200 hover:bg-sky-50 transition-all duration-300 hover:scale-105"
                      onClick={handleExportSVG}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      SVG
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download as vector SVG</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div
            className={cn(
              "bg-white border border-sky-100 rounded-lg p-6 min-h-[300px]",
              "flex items-center justify-center shadow-inner",
              "transition-all duration-300",
              isStyleChanging && "opacity-0 scale-95",
              !isStyleChanging && "scale-100",
            )}
          >
            <SignatureCanvas
              ref={canvasRef}
              text={text}
              style={style}
              font={font}
              color={color}
              strokeWidth={strokeWidth}
              animationSpeed={animationSpeed}
              isAnimating={false}
              playAnimation={activeAnimation}
            />
          </div>

          <div className="mt-6 flex items-start gap-3 p-4 bg-sky-50 rounded-lg border border-sky-100">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-700 mb-1">Pro Tips:</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>Try different styles and fonts to find your perfect signature</li>
                <li>For formal documents, the Calligraphy and Elegant styles work best</li>
                <li>For a personal touch, try the Handwriting style</li>
                <li>Download as SVG for highest quality when printing or scaling</li>
                <li>Click on a style button to see its animation</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

