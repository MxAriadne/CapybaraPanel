"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { SimpleStatsLabel } from "@/components/SimpleStatsLabel";
import useSWR from "swr";
import { ContainerStats } from "../containers/[slug]/zodTypes";
import { NodeStats } from "./nodeStats";

export const ContainerListElementSchema = z.object({
  id: z.number(),
  narwhalid: z.string(),
  name: z.string(),
  image: z.string(),
  disk: z.number().nullable(),
  ram: z.number().nullable(),
  cpu: z.number().nullable(),
  port: z.number().nullable(),
  startup: z.string().nullable(),
});
export type ContainerListElement = z.infer<typeof ContainerListElementSchema>;

export default function ContainerStatistics() {
  const { data } = useSWR<ContainerListElement[]>(
    "http://localhost:6969/api/workers",
    (url: string | URL | Request) => fetch(url).then((res) => res.json())
  );
  const { data: stats } = useSWR<NodeStats>(
    "http://localhost:6969/api/node/resource_usage",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 5000 }
  );
  console.log(stats)
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Container statistics</CardTitle>
      </CardHeader>
      <CardContent className="pl-6 h-96">
        {data ? (
          <>
            <SimpleStatsLabel
              value={String(data?.length ?? 0)}
              label="Total containers"
              subLabel="Only includes Capybara managed containers"
            />
            <SimpleStatsLabel value={String(stats?.running_containers ?? 0)} label="Running containers" subLabel="May include non-Capybara managed containers" />
          </>
        ) : (
          <div className="text-5xl pl-4">Loading...</div>
        )}
      </CardContent>
    </Card>
  );
}
