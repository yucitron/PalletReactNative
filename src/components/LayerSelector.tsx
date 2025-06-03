import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";

interface LayerSelectorProps {
  currentLayer: number;
  maxLayers: number;
  onLayerChange: (layer: number) => void;
}

const LayerSelector = ({
  currentLayer,
  maxLayers,
  onLayerChange,
}: LayerSelectorProps) => {
  const [inputValue, setInputValue] = useState(currentLayer.toString());

  const handleIncrement = () => {
    if (currentLayer < maxLayers) {
      const newLayer = currentLayer + 1;
      onLayerChange(newLayer);
      setInputValue(newLayer.toString());
    }
  };

  const handleDecrement = () => {
    if (currentLayer > 1) {
      const newLayer = currentLayer - 1;
      onLayerChange(newLayer);
      setInputValue(newLayer.toString());
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxLayers) {
      onLayerChange(numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Layer Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="layer-input">Current Layer</Label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={currentLayer <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="layer-input"
              type="number"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              min={1}
              max={maxLayers}
              className="text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={currentLayer >= maxLayers}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Layer {currentLayer} of {maxLayers}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentLayer / maxLayers) * 100}%` }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LayerSelector;
