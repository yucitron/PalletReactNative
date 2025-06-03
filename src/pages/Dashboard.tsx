import { useState } from "react";
import Navigation from "@/components/Navigation";
import StatusIndicator from "@/components/StatusIndicator";
import ControlButton from "@/components/ControlButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wifi,
  Power,
  RotateCcw,
  AlertTriangle,
  FileText,
  Activity,
  Info,
  CheckCircle2,
} from "lucide-react";

const Dashboard = () => {
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected"
  >("disconnected");
  const [systemEnabled, setSystemEnabled] = useState(false);
  const [alarmStatus, setAlarmStatus] = useState<"idle" | "warning" | "error">(
    "idle",
  );
  const [loading, setLoading] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading("connect");
    // Simulate connection process
    setTimeout(() => {
      setConnectionStatus(
        connectionStatus === "connected" ? "disconnected" : "connected",
      );
      setLoading(null);
    }, 2000);
  };

  const handleEnable = async () => {
    if (connectionStatus !== "connected") {
      alert("Please connect to the system first");
      return;
    }

    setLoading("enable");
    setTimeout(() => {
      setSystemEnabled(!systemEnabled);
      setLoading(null);
    }, 1500);
  };

  const handleClear = async () => {
    setLoading("clear");
    setTimeout(() => {
      setAlarmStatus("idle");
      setLoading(null);
    }, 1000);
  };

  const handleAlarm = () => {
    setAlarmStatus(alarmStatus === "error" ? "idle" : "error");
  };

  const handleAlarmLog = () => {
    // Open alarm log modal or navigate to alarm log page
    console.log("Opening alarm log...");
  };

  const handleLog = () => {
    // Open system log modal or navigate to log page
    console.log("Opening system log...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Control Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and control the palletization system
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusIndicator label="Connection" status={connectionStatus} />
              <StatusIndicator
                label="System"
                status={systemEnabled ? "connected" : "idle"}
              />
              <StatusIndicator label="Alarms" status={alarmStatus} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Uptime</span>
                <span className="font-medium">24h 15m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pallets Today</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Efficiency</span>
                <span className="font-medium text-green-600">98.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current Operation</CardTitle>
            </CardHeader>
            <CardContent>
              {systemEnabled ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm">System Active</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Ready for palletization operations
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">System Standby</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Enable system to start operations
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {alarmStatus === "error" && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              System alarm detected. Please check the alarm log for details and
              clear when resolved.
            </AlertDescription>
          </Alert>
        )}

        {connectionStatus === "disconnected" && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Info className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              System is not connected. Please establish connection before
              enabling operations.
            </AlertDescription>
          </Alert>
        )}

        {/* Control Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <ControlButton
                icon={Wifi}
                label={
                  connectionStatus === "connected" ? "Disconnect" : "Connect"
                }
                onClick={handleConnect}
                variant={
                  connectionStatus === "connected" ? "destructive" : "default"
                }
                loading={loading === "connect"}
              />

              <ControlButton
                icon={Power}
                label={systemEnabled ? "Disable" : "Enable"}
                onClick={handleEnable}
                variant={systemEnabled ? "destructive" : "default"}
                disabled={connectionStatus !== "connected"}
                loading={loading === "enable"}
              />

              <ControlButton
                icon={RotateCcw}
                label="Clear"
                onClick={handleClear}
                variant="outline"
                loading={loading === "clear"}
              />

              <ControlButton
                icon={AlertTriangle}
                label="Alarm"
                onClick={handleAlarm}
                variant={alarmStatus === "error" ? "destructive" : "secondary"}
              />

              <ControlButton
                icon={FileText}
                label="Alarm Log"
                onClick={handleAlarmLog}
                variant="outline"
              />

              <ControlButton
                icon={Activity}
                label="System Log"
                onClick={handleLog}
                variant="outline"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
