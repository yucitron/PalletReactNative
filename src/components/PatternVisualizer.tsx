import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

interface PatternVisualizerProps {
  boxDimensions: Dimensions;
  palletDimensions: Dimensions;
  selectedPattern: string;
  onPatternChange: (pattern: string) => void;
}

const PatternVisualizer = ({
  boxDimensions,
  palletDimensions,
  selectedPattern,
  onPatternChange,
}: PatternVisualizerProps) => {
  const calculateGrid = () => {
    if (
      !boxDimensions.length ||
      !boxDimensions.width ||
      !palletDimensions.length ||
      !palletDimensions.width
    ) {
      return { rows: 0, cols: 0, boxes: [] };
    }

    const cols = Math.floor(palletDimensions.length / boxDimensions.length);
    const rows = Math.floor(palletDimensions.width / boxDimensions.width);

    const boxes = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        boxes.push({ row, col, id: `${row}-${col}` });
      }
    }

    return { rows, cols, boxes };
  };

  const getPatternColor = (row: number, col: number) => {
    switch (selectedPattern) {
      case "standard":
        return "bg-blue-500";
      case "checkerboard":
        return (row + col) % 2 === 0 ? "bg-blue-500" : "bg-green-500";
      case "rows":
        return row % 2 === 0 ? "bg-blue-500" : "bg-purple-500";
      case "columns":
        return col % 2 === 0 ? "bg-blue-500" : "bg-orange-500";
      case "spiral":
        // Simple spiral-like pattern
        const center = Math.min(row, col) % 3;
        return center === 0
          ? "bg-blue-500"
          : center === 1
            ? "bg-red-500"
            : "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  const { rows, cols, boxes } = calculateGrid();

  const patterns = [
    { value: "standard", label: "Standard Pattern" },
    { value: "checkerboard", label: "Checkerboard" },
    { value: "rows", label: "Alternating Rows" },
    { value: "columns", label: "Alternating Columns" },
    { value: "spiral", label: "Spiral Pattern" },
  ];

  if (rows === 0 || cols === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pattern Visualizer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            Please configure box and pallet dimensions to see the pattern
            visualization.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pattern Visualizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Pattern</label>
          <Select value={selectedPattern} onValueChange={onPatternChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a pattern" />
            </SelectTrigger>
            <SelectContent>
              {patterns.map((pattern) => (
                <SelectItem key={pattern.value} value={pattern.value}>
                  {pattern.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Pallet Layout: {rows} × {cols} = {boxes.length} boxes per layer
          </div>

          <div className="border-2 border-gray-300 border-dashed p-4 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-2 text-center">
              Pallet View (Top-Down)
            </div>
            <div
              className="grid gap-1 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                maxWidth: "400px",
              }}
            >
              {boxes.map((box) => (
                <div
                  key={box.id}
                  className={cn(
                    "aspect-square rounded border border-white shadow-sm transition-all duration-200",
                    getPatternColor(box.row, box.col),
                  )}
                  title={`Box at (${box.row + 1}, ${box.col + 1})`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium">Pattern Info:</div>
              <div className="text-gray-600">
                {patterns.find((p) => p.value === selectedPattern)?.label ||
                  "Unknown"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Efficiency:</div>
              <div className="text-gray-600">
                {(
                  ((boxes.length * boxDimensions.length * boxDimensions.width) /
                    (palletDimensions.length * palletDimensions.width)) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternVisualizer;
