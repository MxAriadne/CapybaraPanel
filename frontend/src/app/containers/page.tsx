"use client";
import ContainerDisplay from "@/components/containerDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
  const { data, error, isLoading } = useSWR('http://localhost:6969/api/workers', (url) =>
    fetch(url).then((res) => res.json())
  , { refreshInterval: 500000 });
  
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
        <div className="grid gap-2">
          <h1 className="text-2xl">Your containers</h1> 
        </div>
        <div className="grid gap-6 md:grid-cols-3">
            {data?.map(
            (c: ContainerListElement) => <ContainerDisplay key={c.name+c.image+c.id} name={c.name} image={c.image} id={c.id} />
          )}
          {data?.length === 0 && <div className="text-3xl w-full h-full">No containers found. <Button variant="ghost" className="text-3xl -ml-3 dark:text-sky-300 text-sky-700" ><Link href="/containers/create">Create one?</Link></Button></div>}
        </div>
      </div>
    </main>
  );
}
