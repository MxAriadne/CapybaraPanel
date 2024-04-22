"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContainerStats } from "@/app/containers/[slug]/zodTypes";
import useSWR from "swr";
import { SimpleStatsLabel } from "@/components/SimpleStatsLabel";
import { NodeStats } from "@/app/dashboard/nodeStats";
import { useEffect, useState } from "react";

function formatBytes(bytes:number) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 2; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
  
    // return bytes if less than a KB
    if(bytes < kiloBytes) return bytes + "Bytes";
    // return KB if less than a MB
    else if(bytes < megaBytes) return(bytes / kiloBytes).toFixed(decimal) + "KB";
    // return MB if less than a GB
    else if(bytes < gigaBytes) return(bytes / megaBytes).toFixed(decimal) + "MB";
    // return GB if less than a TB
    else return(bytes / gigaBytes).toFixed(decimal) + " GB";
}
export default function ContainerStatistics({
  containerId,
}: {
  containerId: string;
}) {
  const { data } = useSWR<ContainerStats>(
    `http://localhost:6969/api/commands/${containerId}/stats`,
    (url: string | URL | Request) => fetch(url).then((res) => res.json())
  );

  const { data: nodeData } = useSWR<NodeStats>(
    "http://localhost:6969/api/node/resource_usage",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000000, keepPreviousData: true }
  );

  return (
    <div>
        <div className="text-3xl my-4">Container Statistics</div>
        {data ? (
          <>
            <SimpleStatsLabel
              value={`${(
                data.resource_usage.cpu_usage /
                (data.cpu_total == 0
                  ? (nodeData?.cpu_total ?? 1) * 1000000000
                  : data.cpu_total)
              ).toFixed(2)}%`}
              label="CPU Usage"
            />

            <SimpleStatsLabel
              value={`${
                data.cpu_total == 0 ? nodeData?.cpu_total : data.cpu_total
              }`}
              label="Total vCores"
            />
            <SimpleStatsLabel
              value={`${
                formatBytes(data.resource_usage.ram_usage)
              }`}
              label="RAM Usage"
            />

            <SimpleStatsLabel
              value={`${formatBytes(data.ram_total == 0 ? nodeData?.ram_total ?? 0 : (data.ram_total))}`}
              label="Total RAM"
            />
          </>
        ) : (
          <div className="text-5xl pl-4">Loading...</div>
        )}
</div>
  );
}
