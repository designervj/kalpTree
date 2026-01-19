"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sliders } from "lucide-react";
import { ResponsivePanel } from "../../responsive-panel/responsive-panel";
import { DevicePreview } from "../../device-preview/device-preview";


type BottomToolbarProps = {
  currentDevice: string;
  showResponsivePanel: boolean;
  devices: any[];
  onDeviceChange: (deviceId: string) => void;
  onToggleResponsivePanel: () => void;
  onAddDevice: (device: any) => void;
  onRemoveDevice: (deviceId: string) => void;
  onUpdateDevice: (deviceId: string, updates: Partial<any>) => void;
};

const BottomToolbar: React.FC<BottomToolbarProps> = ({
  currentDevice,
  showResponsivePanel,
  devices,
  onDeviceChange,
  onToggleResponsivePanel,
  onAddDevice,
  onRemoveDevice,
  onUpdateDevice,
}) => {
  return (
    <div className="border-t border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between h-10 px-3">
        <div className="flex items-center space-x-3">
          <DevicePreview
            currentDevice={currentDevice}
            onChange={onDeviceChange}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onToggleResponsivePanel}
              >
                <Sliders className="w-4 h-4" />
                <span className="sr-only">
                  {showResponsivePanel
                    ? "Hide Responsive Panel"
                    : "Show Responsive Panel"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {showResponsivePanel
                ? "Hide Responsive Panel"
                : "Show Responsive Panel"}
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center">
          <span className="mr-2 text-xs text-slate-200 font-semibold">
            Canvas: {currentDevice}
          </span>
        </div>
      </div>

      {showResponsivePanel && (
        <ResponsivePanel
          devices={devices}
          currentDevice={currentDevice}
          onDeviceChange={onDeviceChange}
          onAddDevice={onAddDevice}
          onRemoveDevice={onRemoveDevice}
          onUpdateDevice={onUpdateDevice}
        />
      )}
    </div>
  );
};

export default BottomToolbar;
