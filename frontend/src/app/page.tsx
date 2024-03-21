import { LoginComponent } from "@/components/login-component";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  // if jwt is in cookies AND is valid redirect to dashboard
  const jwt = cookies().get("jwt")?.value ?? "";
  console.log(jwt)
  try {
    const jwtPayload = JSON.parse(atob(jwt.split(".")[0]));
    const isExpired = Date.now() >= jwtPayload.exp * 1000;

    if (!isExpired && jwt != "") {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center p-24 text-slate-900 dark:text-white">
      heck
    </main>
  );
}
