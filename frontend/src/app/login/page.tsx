import { LoginComponent } from "@/components/login-component";
export default function Home() {
  return (
    <main className="flex min-h-screen min-w-screen flex-col items-center justify-center p-24 breathing-gradient text-slate-900 dark:text-white">
      <div className="mb-4 flex flex-col items-center">
        <div className="text-4xl mb-2">📦</div>
        <h1 className="font-semibold text-4xl drop-shadow-xl">Capybara</h1>
        container management interface
      </div>
      <div>
        <LoginComponent />
      </div>
    </main>
  );
}
