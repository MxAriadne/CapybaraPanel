"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Graph from "./stackedarea";
import { Button } from "@/components/ui/button";
import { PiPackage } from "react-icons/pi";
import Link from "next/link";
import NodeStatistics from "./nodeStats";
import ContainerStatistics from "./containerStats";

export default function BucketDisplay() {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
        <div className="grid gap-2">
          <h1 className="text-2xl">Welcome, $firstName</h1>
        </div>
        <div>Quick Actions</div>
        <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-12">
          <Link href="/containers/create">
          <Button className="col-span-2">
            <PiPackage className="mr-2 h-6 w-6" /> 
            Create container
          </Button>
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <NodeStatistics />
          <ContainerStatistics />
        </div>
      </div>
    </main>
  );
}
