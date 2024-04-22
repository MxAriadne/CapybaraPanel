"use client";

import { PiCheck, PiCopy } from "react-icons/pi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useState } from "react";
import { IconType } from "react-icons/lib";

interface CopyIconInfo {
  icon: IconType;
  color: string;
  background: string;
}

export default function ToolTip({
  toDisplay,
  toPopup,
  isDisplayPartiallyHidden,
  copiedText,
}: {
  toDisplay: string;
  toPopup: string;
  isDisplayPartiallyHidden: boolean;
  copiedText: string | null;
}) {
  const [Icon, setIcon] = useState<CopyIconInfo>({
    icon: PiCopy,
    color: "text-gray-800",
    background: "dark:bg-black/90 bg-gray-300",
  });
  const displayed = isDisplayPartiallyHidden
    ? toDisplay.substring(0, 12)
    : toDisplay;
  const popupText = toPopup;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <p
            className={`cursor-pointer ${Icon.background} font-mono transition-all duration-300 rounded-md outline outline-1 dark:outline-sky-900 outline-sky-400 px-2 pt-0.5 ml-2`}
            onClick={() => {
              copiedText == null
                ? null
                : navigator.clipboard.writeText(copiedText);
              setIcon({ icon: PiCheck, color: "text-green-900", background: "dark:bg-teal-700 bg-teal-300" });
              // reset icon after 10 seconds
              setTimeout(
                () => setIcon({ icon: PiCopy, color: "text-gray-500", background: "dark:bg-black/90 bg-gray-300" }),
                1000
              );
            }}
          >
            {displayed}{" "}
            <Icon.icon className={`mb-1 -ml-2 ${Icon.color} inline transition-all duration-300`} />
          </p>
        </TooltipTrigger>
        <TooltipContent>
          <p>{popupText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
