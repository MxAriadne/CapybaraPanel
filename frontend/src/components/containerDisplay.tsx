import { PiCube } from "react-icons/pi"

export default function ContainerDisplay({name, image}: {name: string, image: string}) {
  return (
    <main className="bg-white dark:bg-slate-800 hover:shadow-lg dark:shadow-slate-800 transition-all duration-500 rounded-md h-32 flex flex-col justify-center">
      <div className="flex">
        <PiCube className="w-12 h-full mx-4" />
        <div>
          <h2 className="text-3xl">{name}</h2>
          <p>{image}</p>
        </div>
      </div>
    </main>
  );
}
