import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decryptTJWT } from "@/lib/jwt";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Graph from "./stackedarea";
import { Button } from "@/components/ui/button";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { PiArchiveBox, PiPackage } from "react-icons/pi";
import Link from "next/link";
import PieChart from "./piechart";

export default async function BucketDisplay() {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
        <div className="grid gap-2">
          <h1 className="text-2xl">Welcome,</h1>
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
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>CPU statistics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>RAM statistics</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Graph />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
