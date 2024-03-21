'use client'
/**
 * Parts of this code was generated by v0 by Vercel.
 * @see https://v0.dev/t/LJc9LbRxYcb
 */
import {
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColorToggle } from "./colorMode";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

import { getCookie } from 'cookies-next';
import { redirect } from "next/navigation";

export const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(500),
});

export function LoginComponent() {
  try {
    const jwt = getCookie("jwt")?.toString()??"MA==";
    console.log(jwt);
    const jwtPayload = JSON.parse(atob(jwt.split(".")[0]));
    console.log(jwtPayload);
    const isExpired = Date.now() >= jwtPayload * 1000;

    if (!isExpired && jwt != "") {
      console.log("ok, move along");
      window.location.replace("/dashboard");
    }
  } catch(err) {
    console.log("issue with jwt: ", err);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // post values to /login/check
    fetch("/login/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        res.text().then((data) => data !== "no" && window.location.replace("/dashboard"));
      })
      .catch((err) => {
        console.error(err);
      });
    redirect("/dashboard");
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto px-4 py-2 max-w-xl min-w-80 rounded-lg dark:bg-black/40 flex flex-col shadow-xl shadow-slate-300/5"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="py-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="capybara" {...field} />
              </FormControl>
              <FormMessage className="max-w-64" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="py-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="••••••••" type="password" {...field} />
              </FormControl>
              <FormMessage className="w-64" />
            </FormItem>
          )}
        />
        <CardFooter className="mt-4 flex">
          <ColorToggle className="mr-4" />
          <Button className="w-full" type="submit">
            Login
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}
