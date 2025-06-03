import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BoxPosition {
  row: number;
  col: number;
  id: string;
}

interface BoxSelectorProps {
  gridRows: number;
  gridCols: number;
  selectedPositions: BoxPosition[];
  onPositionSelect: (position: BoxPosition) => void;
  onPositionDeselect: (position: BoxPosition) => void;
}

const BoxSelector = ({
  gridRows,
  gridCols,
  selectedPositions,
  onPositionSelect,
  onPositionDeselect,
}: BoxSelectorProps) => {
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);

  const isPositionSelected = (row: number, col: number) => {
    return selectedPositions.some((pos) => pos.row === row && pos.col === col);
  };

  const handlePositionClick = (row: number, col: number) => {
    const position: BoxPosition = {
      row,
      col,
      id: `${row}-${col}`,
    };

    if (isPositionSelected(row, col)) {
      onPositionDeselect(position);
    } else {
      onPositionSelect(position);
    }
  };

  const clearAllSelections = () => {
    selectedPositions.forEach((position) => {
      onPositionDeselect(position);
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Box Positions</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={clearAllSelections}
          disabled={selectedPositions.length === 0}
        >
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          Selected: {selectedPositions.length} boxes
        </div>

        <div
          className="grid gap-1 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: gridRows }).map((_, row) =>
            Array.from({ length: gridCols }).map((_, col) => {
              const positionId = `${row}-${col}`;
              const isSelected = isPositionSelected(row, col);
              const isHovered = hoveredPosition === positionId;

              return (
                <button
                  key={positionId}
                  className={cn(
                    "aspect-square rounded border-2 transition-all duration-200 text-xs font-medium",
                    "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                    isSelected
                      ? "bg-blue-500 border-blue-600 text-white shadow-md"
                      : "bg-white border-gray-300 text-gray-600 hover:border-blue-400 hover:bg-blue-50",
                    isHovered && !isSelected && "border-blue-400 bg-blue-50",
                  )}
                  onClick={() => handlePositionClick(row, col)}
                  onMouseEnter={() => setHoveredPosition(positionId)}
                  onMouseLeave={() => setHoveredPosition(null)}
                  title={`Position (${row + 1}, ${col + 1})`}
                >
                  {`${row + 1},${col + 1}`}
                </button>
              );
            }),
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Grid: {gridRows} × {gridCols}
          </span>
          <span>Click to select/deselect positions</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default BoxSelector;
