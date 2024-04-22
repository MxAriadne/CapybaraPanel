"use client";

import { ContainerStats } from "@/app/containers/[slug]/zodTypes";
import useSWR from "swr";

export default function PingStatusIndicator({containerId}: {containerId: string}) {
// use swr
    const { data } = useSWR<ContainerStats>(`http://localhost:6969/api/commands/${containerId}/stats`, (url: string | URL | Request) => fetch(url).then((res) => res.json()))
    
  return (
    <span className="relative flex h-3 w-4 pt-4 mx-2">
      <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${data ? data.is_running ? "bg-green-400" : "bg-red-400" : "bg-blue-400"} opacity-75`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${data ? data.is_running ? "bg-green-500" : "bg-red-500" : "bg-blue-500"}`}></span>
    </span>
  );
}
