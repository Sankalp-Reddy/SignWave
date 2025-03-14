"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Example signatures - removed brush style example
const EXAMPLES = [
  {
    id: 1,
    text: "John Snow",
    style: "calligraphy",
    font: "'Dancing Script', cursive",
    color: "#0ea5e9",
    strokeWidth: 2,
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 2,
    text: "Sarah Johnson",
    style: "handwriting",
    font: "'Caveat', cursive",
    color: "#7e22ce",
    strokeWidth: 1.5,
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 3,
    text: "Michael Williams",
    style: "modern",
    font: "'Montserrat', sans-serif",
    color: "#000000",
    strokeWidth: 1,
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 5,
    text: "Robert Brown",
    style: "elegant",
    font: "'Pinyon Script', cursive",
    color: "#b91c1c",
    strokeWidth: 1.5,
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 6,
    text: "Jennifer Wilson",
    style: "calligraphy",
    font: "'Parisienne', cursive",
    color: "#0c4a6e",
    strokeWidth: 2.5,
    preview: "/placeholder.svg?height=100&width=200",
  },
  {
    id: 7,
    text: "David Miller",
    style: "modern",
    font: "'Raleway', sans-serif",
    color: "#166534",
    strokeWidth: 1.5,
    preview: "/placeholder.svg?height=100&width=200",
  },
]

export default function SignatureExamples({ onClose, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-auto bg-white p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Signature Examples</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="transition-transform hover:scale-110">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <p className="text-slate-600 mb-6">
          Click on any example to apply its style to your signature. You can then customize it further.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXAMPLES.map((example) => (
            <div
              key={example.id}
              className="border border-sky-100 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer hover:scale-105"
              onClick={() => onSelect(example)}
            >
              <div className="h-20 flex items-center justify-center mb-3 bg-white">
                <div
                  className="text-2xl"
                  style={{
                    fontFamily: example.font,
                    color: example.color,
                  }}
                >
                  {example.text}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-medium text-slate-700">{example.text}</p>
                <p>Style: {example.style.charAt(0).toUpperCase() + example.style.slice(1)}</p>
                <p>Font: {example.font.split("'")[1]}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

