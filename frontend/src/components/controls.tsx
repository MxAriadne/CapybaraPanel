"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { PiPause, PiPauseBold, PiPlay, PiPlayBold, PiStop, PiStopBold } from "react-icons/pi";

import { ContainerStats } from "@/app/containers/[slug]/zodTypes";
import useSWR from "swr";
import { Button } from "./ui/button";

export default function ContainerControls({
  containerId,
}: {
  containerId: string;
}) {
  // use swr
  const { data } = useSWR<ContainerStats>(
    `http://localhost:6969/api/commands/${containerId}/stats`,
    (url: string | URL | Request) => fetch(url).then((res) => res.json())
  );

  return (
    <div className="flex gap-2 place-items-center">
      <div className="dark:bg-black bg-gray-200 rounded-lg border border-1 border-gray-500 transition-all duration-300">
        <Button
          variant="link"
          disabled={data?.is_running}
          className="group hover:dark:bg-gray-800 hover:bg-gray-300"
          onClick={() => {
            fetch(`http://localhost:6969/api/commands/${containerId}/start`, {
              //method: "POST",
            }).catch((err) => console.log(err));
          }}
        >
          <PiPlayBold className="h-4 w-4 dark:text-green-200 text-green-600 group-hover:text-green-500 disabled:text-gray-500 transition-all duration-300" />
        </Button>
        <div className="border border-l-0 pt-1 inline border-gray-400" />
        <Button
          variant="link"
          disabled={!data?.is_running}
          className="group hover:bg-gray-800"
          onClick={() => {
            fetch(`http://localhost:6969/api/commands/${containerId}/stop`, {
              //method: "POST",
            }).catch((err) => console.log(err));
          }}
        >
          <PiPauseBold className="h-4 w-4 dark:text-slate-300 text-slate-600 group-hover:text-slate-500 disabled:text-gray-500 transition-all duration-300" />
        </Button>
        <div className="border border-l-0 pt-1 inline border-gray-400" />
        <Button
          variant="link"
          disabled={!data?.is_running}
          className="group hover:dark:bg-red-950 hover:bg-red-200"
          onClick={() => {
            fetch(`http://localhost:6969/api/commands/${containerId}/start`, {
              //method: "POST",
            });
          }}
        >
          <PiStopBold className="h-4 w-4 text-red-400 group-hover:text-red-500 disabled:text-gray-500 transition-all duration-300" />
        </Button>
      </div>
    </div>
  );
}
