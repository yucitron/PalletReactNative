import { useState } from "react";
import Navigation from "@/components/Navigation";
import LayerSelector from "@/components/LayerSelector";
import BoxSelector from "@/components/BoxSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface BoxPosition {
  row: number;
  col: number;
  id: string;
}

const Palletizer = () => {
  const [currentLayer, setCurrentLayer] = useState(1);
  const [maxLayers] = useState(8);
  const [selectedPositions, setSelectedPositions] = useState<BoxPosition[]>([]);
  const [isProcessRunning, setIsProcessRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [processingPosition, setProcessingPosition] =
    useState<BoxPosition | null>(null);
  const [completedPositions, setCompletedPositions] = useState<BoxPosition[]>(
    [],
  );
  const [processProgress, setProcessProgress] = useState(0);

  const gridRows = 4;
  const gridCols = 5;
  const totalPositions = selectedPositions.length;

  const handlePositionSelect = (position: BoxPosition) => {
    setSelectedPositions((prev) => [...prev, position]);
  };

  const handlePositionDeselect = (position: BoxPosition) => {
    setSelectedPositions((prev) =>
      prev.filter((pos) => pos.id !== position.id),
    );
  };

  const handleStartProcess = () => {
    if (selectedPositions.length === 0) {
      alert("Please select at least one box position");
      return;
    }

    setIsProcessRunning(true);
    setIsPaused(false);
    setCompletedPositions([]);
    setProcessProgress(0);

    // Simulate processing
    simulateProcess();
  };

  const simulateProcess = () => {
    let currentIndex = 0;
    const processNext = () => {
      if (currentIndex < selectedPositions.length) {
        setProcessingPosition(selectedPositions[currentIndex]);

        setTimeout(() => {
          setCompletedPositions((prev) => [
            ...prev,
            selectedPositions[currentIndex],
          ]);
          setProcessingPosition(null);
          setProcessProgress(
            ((currentIndex + 1) / selectedPositions.length) * 100,
          );
          currentIndex++;

          if (
            currentIndex < selectedPositions.length &&
            isProcessRunning &&
            !isPaused
          ) {
            processNext();
          } else if (currentIndex >= selectedPositions.length) {
            setIsProcessRunning(false);
            setProcessProgress(100);
          }
        }, 2000); // 2 seconds per box
      }
    };

    processNext();
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    if (isPaused && isProcessRunning) {
      simulateProcess();
    }
  };

  const handleStopProcess = () => {
    setIsProcessRunning(false);
    setIsPaused(false);
    setProcessingPosition(null);
    setCompletedPositions([]);
    setProcessProgress(0);
  };

  const handleNextLayer = () => {
    if (currentLayer < maxLayers) {
      setCurrentLayer(currentLayer + 1);
      setSelectedPositions([]);
      setCompletedPositions([]);
      setProcessProgress(0);
    }
  };

  const handlePreviousLayer = () => {
    if (currentLayer > 1) {
      setCurrentLayer(currentLayer - 1);
      setSelectedPositions([]);
      setCompletedPositions([]);
      setProcessProgress(0);
    }
  };

  const isPositionCompleted = (position: BoxPosition) => {
    return completedPositions.some((pos) => pos.id === position.id);
  };

  const isPositionProcessing = (position: BoxPosition) => {
    return processingPosition?.id === position.id;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Palletizer Control
          </h1>
          <p className="text-gray-600 mt-2">
            Configure and control the palletization process
          </p>
        </div>

        {/* Process Status */}
        {isProcessRunning && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              {isPaused
                ? "Process paused"
                : `Processing layer ${currentLayer}... ${completedPositions.length}/${totalPositions} boxes completed`}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Layer and Process Controls */}
          <div className="space-y-6">
            <LayerSelector
              currentLayer={currentLayer}
              maxLayers={maxLayers}
              onLayerChange={setCurrentLayer}
            />

            {/* Process Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Process Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {!isProcessRunning ? (
                    <Button
                      onClick={handleStartProcess}
                      disabled={selectedPositions.length === 0}
                      className="flex items-center space-x-2"
                    >
                      <Play className="h-4 w-4" />
                      <span>Start</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePauseResume}
                      variant="secondary"
                      className="flex items-center space-x-2"
                    >
                      {isPaused ? (
                        <>
                          <Play className="h-4 w-4" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4" />
                          <span>Pause</span>
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={handleStopProcess}
                    variant="destructive"
                    disabled={!isProcessRunning}
                    className="flex items-center space-x-2"
                  >
                    <Square className="h-4 w-4" />
                    <span>Stop</span>
                  </Button>
                </div>

                {isProcessRunning && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(processProgress)}%</span>
                    </div>
                    <Progress value={processProgress} className="w-full" />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    onClick={handlePreviousLayer}
                    variant="outline"
                    size="sm"
                    disabled={currentLayer <= 1 || isProcessRunning}
                    className="flex-1"
                  >
                    <SkipBack className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextLayer}
                    variant="outline"
                    size="sm"
                    disabled={currentLayer >= maxLayers || isProcessRunning}
                    className="flex-1"
                  >
                    Next
                    <SkipForward className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Process Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Layer Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Selected Boxes</span>
                  <span className="font-medium">
                    {selectedPositions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-green-600">
                    {completedPositions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Remaining</span>
                  <span className="font-medium">
                    {selectedPositions.length - completedPositions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current Layer</span>
                  <span className="font-medium">
                    {currentLayer} of {maxLayers}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Box Position Selection */}
          <div className="lg:col-span-2">
            <BoxSelector
              gridRows={gridRows}
              gridCols={gridCols}
              selectedPositions={selectedPositions}
              onPositionSelect={handlePositionSelect}
              onPositionDeselect={handlePositionDeselect}
            />

            {/* Position Status Legend */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Position Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 border-2 border-yellow-600 rounded animate-pulse" />
                    <span>Processing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 border-2 border-green-600 rounded" />
                    <span>Completed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palletizer;
