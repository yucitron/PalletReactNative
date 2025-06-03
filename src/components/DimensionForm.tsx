import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface DimensionFormProps {
  boxDimensions: Dimensions;
  palletDimensions: Dimensions;
  onBoxDimensionsChange: (dimensions: Dimensions) => void;
  onPalletDimensionsChange: (dimensions: Dimensions) => void;
  onSave: () => void;
}

const DimensionForm = ({
  boxDimensions,
  palletDimensions,
  onBoxDimensionsChange,
  onPalletDimensionsChange,
  onSave,
}: DimensionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleBoxDimensionChange = (field: keyof Dimensions, value: string) => {
    const numValue = parseFloat(value) || 0;
    onBoxDimensionsChange({
      ...boxDimensions,
      [field]: numValue,
    });
  };

  const handlePalletDimensionChange = (
    field: keyof Dimensions,
    value: string,
  ) => {
    const numValue = parseFloat(value) || 0;
    onPalletDimensionsChange({
      ...palletDimensions,
      [field]: numValue,
    });
  };

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  const calculateBoxesPerLayer = () => {
    if (
      boxDimensions.length &&
      boxDimensions.width &&
      palletDimensions.length &&
      palletDimensions.width
    ) {
      const boxesPerRow = Math.floor(
        palletDimensions.length / boxDimensions.length,
      );
      const boxesPerCol = Math.floor(
        palletDimensions.width / boxDimensions.width,
      );
      return boxesPerRow * boxesPerCol;
    }
    return 0;
  };

  const calculateMaxLayers = () => {
    if (boxDimensions.height && palletDimensions.height) {
      return Math.floor(palletDimensions.height / boxDimensions.height);
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Dimensions Configuration</CardTitle>
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Box Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Box Dimensions
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="box-length">Length (mm)</Label>
              <Input
                id="box-length"
                type="number"
                value={boxDimensions.length}
                onChange={(e) =>
                  handleBoxDimensionChange("length", e.target.value)
                }
                disabled={!isEditing}
                min={0}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box-width">Width (mm)</Label>
              <Input
                id="box-width"
                type="number"
                value={boxDimensions.width}
                onChange={(e) =>
                  handleBoxDimensionChange("width", e.target.value)
                }
                disabled={!isEditing}
                min={0}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="box-height">Height (mm)</Label>
              <Input
                id="box-height"
                type="number"
                value={boxDimensions.height}
                onChange={(e) =>
                  handleBoxDimensionChange("height", e.target.value)
                }
                disabled={!isEditing}
                min={0}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Pallet Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Pallet Dimensions
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pallet-length">Length (mm)</Label>
              <Input
                id="pallet-length"
                type="number"
                value={palletDimensions.length}
                onChange={(e) =>
                  handlePalletDimensionChange("length", e.target.value)
                }
                disabled={!isEditing}
                min={0}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pallet-width">Width (mm)</Label>
              <Input
                id="pallet-width"
                type="number"
                value={palletDimensions.width}
                onChange={(e) =>
                  handlePalletDimensionChange("width", e.target.value)
                }
                disabled={!isEditing}
                min={0}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pallet-height">Height (mm)</Label>
              <Input
                id="pallet-height"
                type="number"
                value={palletDimensions.height}
                onChange={(e) =>
                  handlePalletDimensionChange("height", e.target.value)
                }
                disabled={!isEditing}
                min={0}
                step={0.1}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Calculations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Calculated Values
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">
                Boxes per Layer
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {calculateBoxesPerLayer()}
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium">
                Max Layers
              </div>
              <div className="text-2xl font-bold text-green-900">
                {calculateMaxLayers()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DimensionForm;
