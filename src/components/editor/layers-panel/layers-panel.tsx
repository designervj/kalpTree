"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { LayerItem } from "../../../../types/editor"

interface LayersPanelProps {
  layers: LayerItem[]
  onSelectLayer: (id: string) => void
  autoExpandedLayers?: string[]
  selectedLayerId?: string
}

export function LayersPanel({ layers, onSelectLayer, autoExpandedLayers = [], selectedLayerId }: LayersPanelProps) {
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({})

  // Auto-expand layers when autoExpandedLayers prop changes
  useEffect(() => {
    if (autoExpandedLayers.length > 0) {
      setExpandedLayers((prev) => {
        const newExpanded = { ...prev }
        autoExpandedLayers.forEach((layerId) => {
          newExpanded[layerId] = true
        })
        return newExpanded
      })
    }
  }, [autoExpandedLayers])

  const toggleLayer = (layerId: string) => {
    setExpandedLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }))
  }

  const renderLayer = (layer: LayerItem) => {
    const isExpanded = expandedLayers[layer.id] || false
    const hasChildren = layer.children && layer.children.length > 0
    const isSelected = layer.id === selectedLayerId

    return (
      <div key={layer.id}>
        <div
          className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors ${isSelected
              ? "bg-blue-600 hover:bg-blue-700"
              : "hover:bg-slate-800"
            }`}
          style={{ paddingLeft: `${layer.level * 10 + 4}px` }}
        >
          {hasChildren && (
            <div
              className={`mr-1 ${isSelected ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              onClick={(e) => {
                e.stopPropagation()
                toggleLayer(layer.id)
              }}
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </div>
          )}
          {!hasChildren && <div className="w-3 mr-1"></div>}
          <div
            className={`flex-1 text-xs truncate ${isSelected ? "text-white font-medium" : ""}`}
            onClick={() => onSelectLayer(layer.id)}
          >
            {layer.name}
          </div>
        </div>
        {isExpanded && hasChildren && layer.children.map(renderLayer)}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {layers.length === 0 ? (
        <div className="text-xs text-slate-400 text-center py-4">No layers available</div>
      ) : (
        layers.map(renderLayer)
      )}
    </div>
  )
}

