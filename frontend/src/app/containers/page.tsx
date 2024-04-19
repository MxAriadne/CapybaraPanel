"use client";
import ContainerDisplay from "@/components/containerDisplay";
import useSWR from "swr";

import * as z from "zod";

export const ContainerListElementSchema = z.object({
    "id": z.number(),
    "name": z.string(),
    "image": z.string(),
    "disk": z.number(),
    "ram": z.number(),
    "cpu": z.number(),
    "port": z.number(),
    "startup": z.string(),
});
export type ContainerListElement = z.infer<typeof ContainerListElementSchema>;


export default function BucketDisplay() {
  const { data, error, isLoading } = useSWR("/api?path=workers", (url) =>
    fetch(url).then((res) => res.json())
  );
  
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
        <div className="grid gap-2">
          <h1 className="text-2xl">Welcome,</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
            {data?.data.map(
            (c: ContainerListElement) => <ContainerDisplay name={c.name} image={c.image} />
          )}
        </div>
      </div>
    </main>
  );
}
