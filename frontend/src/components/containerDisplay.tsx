import Link from "next/link";
import { PiCube } from "react-icons/pi"
import Sqids from "sqids";

export default function ContainerDisplay({name, image, id}: {name: string, image: string, id: number}) {
  return (
    <Link href={`/containers/${name}-${id}`} className="bg-white dark:bg-gray-800 dark:hover:bg-slate-800 hover:shadow-lg dark:shadow-slate-800 transition-all duration-500 rounded-md h-20 flex flex-col justify-center">
      <div className="flex">
        <PiCube className="w-12 h-full mx-4" />
        <div>
          <h2 className="text-2xl">{name}</h2>
          <p>{image}</p>
        </div>
      </div>
    </Link>
  );
}
