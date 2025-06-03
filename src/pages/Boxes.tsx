import { useState } from "react";
import Navigation from "@/components/Navigation";
import DimensionForm from "@/components/DimensionForm";
import PatternVisualizer from "@/components/PatternVisualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Save,
  RotateCcw,
  Download,
  Upload,
  CheckCircle2,
  Info,
} from "lucide-react";

interface Dimensions {
  length: number;
  width: number;
  height: number;
}

const Boxes = () => {
  const [boxDimensions, setBoxDimensions] = useState<Dimensions>({
    length: 300,
    width: 200,
    height: 150,
  });

  const [palletDimensions, setPalletDimensions] = useState<Dimensions>({
    length: 1200,
    width: 800,
    height: 1500,
  });

  const [selectedPattern, setSelectedPattern] = useState("standard");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleBoxDimensionsChange = (dimensions: Dimensions) => {
    setBoxDimensions(dimensions);
    setHasUnsavedChanges(true);
  };

  const handlePalletDimensionsChange = (dimensions: Dimensions) => {
    setPalletDimensions(dimensions);
    setHasUnsavedChanges(true);
  };

  const handlePatternChange = (pattern: string) => {
    setSelectedPattern(pattern);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaveStatus("saving");

    // Simulate save operation
    setTimeout(() => {
      setSaveStatus("saved");
      setHasUnsavedChanges(false);

      setTimeout(() => {
        setSaveStatus("idle");
      }, 2000);
    }, 1000);
  };

  const handleReset = () => {
    setBoxDimensions({
      length: 300,
      width: 200,
      height: 150,
    });
    setPalletDimensions({
      length: 1200,
      width: 800,
      height: 1500,
    });
    setSelectedPattern("standard");
    setHasUnsavedChanges(false);
  };

  const handleExportConfig = () => {
    const config = {
      boxDimensions,
      palletDimensions,
      selectedPattern,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pallet-config-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            setBoxDimensions(config.boxDimensions || boxDimensions);
            setPalletDimensions(config.palletDimensions || palletDimensions);
            setSelectedPattern(config.selectedPattern || selectedPattern);
            setHasUnsavedChanges(true);
          } catch (error) {
            alert("Invalid configuration file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const calculateEfficiency = () => {
    if (
      !boxDimensions.length ||
      !boxDimensions.width ||
      !palletDimensions.length ||
      !palletDimensions.width
    ) {
      return 0;
    }

    const boxesPerRow = Math.floor(
      palletDimensions.length / boxDimensions.length,
    );
    const boxesPerCol = Math.floor(
      palletDimensions.width / boxDimensions.width,
    );
    const totalBoxes = boxesPerRow * boxesPerCol;

    const usedArea = totalBoxes * boxDimensions.length * boxDimensions.width;
    const totalArea = palletDimensions.length * palletDimensions.width;

    return (usedArea / totalArea) * 100;
  };

  const calculateTotalCapacity = () => {
    if (!boxDimensions.height || !palletDimensions.height) return 0;

    const boxesPerLayer =
      Math.floor(palletDimensions.length / boxDimensions.length) *
      Math.floor(palletDimensions.width / boxDimensions.width);
    const maxLayers = Math.floor(
      palletDimensions.height / boxDimensions.height,
    );

    return boxesPerLayer * maxLayers;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Box Configuration
              </h1>
              <p className="text-gray-600 mt-2">
                Configure box dimensions, pallet specifications, and packing
                patterns
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleImportConfig}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleExportConfig}
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>

              <Button
                variant="outline"
                onClick={handleReset}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </Button>

              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saveStatus === "saving"}
                className="flex items-center space-x-2"
              >
                {saveStatus === "saving" ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : saveStatus === "saved" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                <span>
                  {saveStatus === "saving"
                    ? "Saving..."
                    : saveStatus === "saved"
                      ? "Saved"
                      : "Save"}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {hasUnsavedChanges && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              You have unsaved changes. Remember to save your configuration.
            </AlertDescription>
          </Alert>
        )}

        {saveStatus === "saved" && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Configuration saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(palletDimensions.length / boxDimensions.length) *
                    Math.floor(palletDimensions.width / boxDimensions.width)}
                </div>
                <div className="text-sm text-gray-600">Boxes per Layer</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Math.floor(palletDimensions.height / boxDimensions.height)}
                </div>
                <div className="text-sm text-gray-600">Max Layers</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {calculateTotalCapacity()}
                </div>
                <div className="text-sm text-gray-600">Total Capacity</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {calculateEfficiency().toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Efficiency</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dimensions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="dimensions" className="space-y-6">
            <DimensionForm
              boxDimensions={boxDimensions}
              palletDimensions={palletDimensions}
              onBoxDimensionsChange={handleBoxDimensionsChange}
              onPalletDimensionsChange={handlePalletDimensionsChange}
              onSave={handleSave}
            />
          </TabsContent>

          <TabsContent value="patterns" className="space-y-6">
            <PatternVisualizer
              boxDimensions={boxDimensions}
              palletDimensions={palletDimensions}
              selectedPattern={selectedPattern}
              onPatternChange={handlePatternChange}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Boxes;
