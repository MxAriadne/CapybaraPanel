"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { SimpleStatsLabel } from "@/components/SimpleStatsLabel";
import useSWR from "swr";

export const NodeStatsSchema = z.object({
  ram_usage: z.number(),
  cpu_usage: z.number(),
  ram_total: z.number(),
  cpu_total: z.number(),
  running_containers: z.number(),
});
export type NodeStats = z.infer<typeof NodeStatsSchema>;
export default function NodeStatistics() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:6969/api/node/resource_usage",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  );
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle><div className="flex flex-col">Node statistics<div className="text-base font-normal text-gray-500">May include non-Capybara processes</div></div></CardTitle>
      </CardHeader>
      <CardContent className="pl-6 h-96">
        {data ? (
          <>
            <SimpleStatsLabel
              value={`${data.cpu_usage.toFixed(2)}%`}
              label="CPU Usage"
            />
            <SimpleStatsLabel value={data.cpu_total} label="CPU Total" />

            <SimpleStatsLabel
              value={`${data.ram_usage.toFixed(2)}% \n(${String(
                data.ram_usage / (data.ram_total / 1000000000)
              ).substring(0, 5)} GiB)`}
              label="RAM Usage"
            />
            <SimpleStatsLabel
              value={`${(data.ram_total / 1000000000).toFixed(4)} GiB`}
              label="Total Usable RAM"
            />
          </>
        ) : (
          <div className="text-5xl pl-4">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}
