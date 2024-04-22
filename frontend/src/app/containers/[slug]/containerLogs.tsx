"use client";

import { useEffect, useRef, useState } from "react";

export const useScrollToBottom = (ref: HTMLDivElement) => {
    useEffect(() => {
        // if it's visible don't scroll
      if (ref?.current?.offsetHeight > ref?.current?.scrollHeight)
        ref?.current?.scrollTo(0, ref?.current?.scrollHeight);
      //ref?.current?.querySelector(':scope > :last-child')?.scrollIntoView()
    }, [ref])
  }

export default function getLogs({containerId}: {containerId: string}) {
  const [data, setData] = useState<string[]>([]);
  const scrollContainer = useRef<null | HTMLDivElement>(null);
  useScrollToBottom(scrollContainer)

  useEffect(() => {
    const asyncFetch = async () => {
      const it = await fetch(
        `http://localhost:46449/containers/${containerId}/logs`
      );
      it.text().then((data) => setData(data.split("\n")));
    };

    asyncFetch();
  }, []);

  console.log(data);

  return (
    <div className="max-h-96 h-dvh overflow-y-scroll scroller" ref={scrollContainer}>
      <table className="border-collapse border-spacing-2">
        <tbody>
          {data.map((d, i) => (
            <tr key={i} className="font-mono text-sm anchor flex">
              <th className="text-gray-400 text-right align-text-top bg-gray-800 w-6">{i}</th>
              <th className="font-normal text-left pl-2 pt-2">{d}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
