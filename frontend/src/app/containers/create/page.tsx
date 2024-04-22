"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PiArrowLeft, PiPackage } from "react-icons/pi";
import { z } from "zod";

export const formSchema = z.object({
  id: z.string().optional(),
  image: z.string(),
  startup: z.string().optional(),
  name: z.string().optional(),
  port: z.string().optional(),
  disk: z.string().optional(),
  ram: z.string().optional(),
  cpu: z.string().optional(),
});

export default function CreateContainer() {
  const [dockerImage, setDockerImage] = useState<string>("traefik/whoami");
  const [name, setName] = useState<string>("Container");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    values.ram =
      values.ram === undefined
        ? undefined
        : String(Number(values.ram) * 1000000);
    values.cpu =
      values.cpu === undefined
        ? undefined
        : String(Number(values.cpu) * 1000000000);

    console.log("values", values.ram, values.cpu);
    // post to localhost:6969/api/commands/create
    let res = fetch("http://localhost:6969/api/commands/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((res) => res.text()).then((res) => window.location.href = "http://localhost:6969/containers/narwhal-" + res);
  }

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
        <Form {...form}>
          <form className="grid gap-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <PiPackage className="w-8 h-8" />
                <div className="grid gap-1">
                  <CardTitle>{name}</CardTitle>
                  <CardDescription>{dockerImage}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Docker Image</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="traefik/whoami"
                          onKeyUp={(e) => setDockerImage(e.currentTarget.value)}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="max-w-64" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startup"
                  render={({ field }) => (
                    <FormItem className="px-2">
                      <FormLabel>Startup Command</FormLabel>
                      <FormControl>
                        <Input placeholder="No startup command" {...field} />
                      </FormControl>
                      <FormMessage className="max-w-64" />
                    </FormItem>
                  )}
                />
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="px-2">
                        <FormLabel>Container Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="whoiscapybara"
                            onKeyUp={(e) => setName(e.currentTarget.value)}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="max-w-64" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="port"
                    render={({ field }) => (
                      <FormItem className="px-2">
                        <FormLabel>Allocated Ports</FormLabel>
                        <FormControl>
                          <Input placeholder="container:host" {...field} />
                        </FormControl>
                        <FormMessage className="max-w-64" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="ram"
                    render={({ field }) => (
                      <FormItem className="px-2">
                        <FormLabel>Maximum Ram (MB)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dynamically allocated RAM"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="max-w-64" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cpu"
                    render={({ field }) => (
                      <FormItem className="px-2">
                        <FormLabel>Maximum CPU (vCores)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dynamically allocated CPU"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="max-w-64" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="lg" type="submit">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}
