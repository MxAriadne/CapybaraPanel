import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { PiArrowLeft, PiPackage } from "react-icons/pi";

export default function CreateContainer() {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
        <div className="grid gap-2">
          <Link
            className="flex items-center gap-2 text-lg font-semibold sm:text-base"
            href=""
          >
            <PiArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to Projects</span>
            Projects
          </Link>
          <h1 className="font-semibold text-3xl">Create a new container</h1>
        </div>
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              will be automatically filled in when user types in a docker image
              <PiPackage className="w-8 h-8" />
              <div className="grid gap-1">
                <CardTitle>Container</CardTitle>
                <CardDescription>example.com</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="docker-image">Docker Image</Label>
                  <Input defaultValue="mhart/alpine-node" id="docker-image" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="startup-command">Startup Command</Label>
                  <Input defaultValue="npm start" id="startup-command" />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="worker-name">Worker Name</Label>
                  <Input defaultValue="web" id="worker-name" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="allocated-ports">Allocated Ports</Label>
                  <Input defaultValue="3000" id="allocated-ports" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label className="text-sm" htmlFor="disk-usage">
                    Disk Usage (GB)
                  </Label>
                  <Input id="disk-usage" placeholder="Enter disk usage" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-sm" htmlFor="ram-usage">
                    RAM Usage (GB)
                  </Label>
                  <Input id="ram-usage" placeholder="Enter RAM usage" />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-sm" htmlFor="cpu-usage">
                    CPU Usage (%)
                  </Label>
                  <Input id="cpu-usage" placeholder="Enter CPU usage" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="lg">Save</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
