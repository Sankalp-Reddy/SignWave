"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ColorPicker({ color, onChange, palettes }) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("presets")

  const handleColorChange = (e) => {
    onChange(e.target.value)
  }

  const handlePresetClick = (presetColor) => {
    onChange(presetColor)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start font-normal border-sky-200">
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-full border border-slate-200 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-700">{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <Tabs defaultValue="presets" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="presets">Color Palettes</TabsTrigger>
            <TabsTrigger value="custom">Custom Color</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="p-4 space-y-4">
            {palettes.map((palette, index) => (
              <div key={index} className="space-y-2">
                <div className="text-sm font-medium">{palette.name}</div>
                <div className="flex gap-2">
                  {palette.colors.map((paletteColor, colorIndex) => (
                    <button
                      key={colorIndex}
                      className="h-8 w-8 rounded-full border border-slate-200 cursor-pointer transition-all hover:scale-110 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ backgroundColor: paletteColor }}
                      onClick={() => handlePresetClick(paletteColor)}
                      aria-label={`Select color ${paletteColor}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="custom" className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Custom Color</span>
                <span className="text-sm text-slate-500">{color}</span>
              </div>
              <input
                type="color"
                value={color}
                onChange={handleColorChange}
                className="w-full h-10 cursor-pointer rounded"
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

