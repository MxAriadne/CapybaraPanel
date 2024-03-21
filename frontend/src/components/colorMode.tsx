"use client";
import { cn } from "@/lib/utils";
import { ClassArray, ClassDictionary } from "clsx";
import { useTheme } from "next-themes";
import { PiMoonBold, PiSunBold } from "react-icons/pi";

const other = (theme: string | undefined) => {
  if (theme === "dark") {
    return "light";
  } else {
    return "dark";
  }
};

export const ColorToggle = (props: { className: string | number | boolean | ClassArray | ClassDictionary | null | undefined; }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const DarkLightIcon = isDark ? PiMoonBold : PiSunBold;
  return (
    <div
      className={cn("flex items-center justify-center w-10 h-10 p-3 rounded-full bg-gray-200 dark:bg-gray-800 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700", props.className)}
      onClick={(_) => setTheme(other(theme))}
      aria-label="toggle theme"
    >
      <DarkLightIcon />
    </div>
  );
};