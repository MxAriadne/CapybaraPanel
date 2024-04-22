import Sqids from "sqids";
import { DbResponse, NodeInfo } from "./zodTypes";
import { PiCircleFill, PiCubeDuotone, PiCubeFill, PiDot } from "react-icons/pi";
import PingStatusIndicator from "@/components/pingStatusIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolTip from "@/components/toolTip";
import { GoLink } from "react-icons/go";
import Link from "next/link";
import { timeAgo } from "@/helpers/timeago";
import TimeAgo from "@/components/timeago";
import ContainerControls from "@/components/controls";
import ContainerStatistics from "./containerStats";
import ContainerLogs from "./containerLogs";

async function getData(cid: string): Promise<any> {
  // break down cid
  const [name, sqid] = cid.split("-");
  // if name is "narwhal" then we dont need to fetch from db
  if (name === "narwhal") {
    const res = await fetch(`http://localhost:6969/api/commands/${sqid}`);
    const data: NodeInfo = await res.json();
    let toReturn = {
      ...data,
      capybaraId: "-1",
    };
    return toReturn;
  }
  const dbRes = await fetch(
    `http://localhost:6969/api/workers/${new Sqids().decode(sqid)}`
  );
  const dbData: DbResponse = await dbRes.json();

  const nodeRes = await fetch(
    `http://localhost:6969/api/commands/${dbData.narwhalId}`
  );
  const nodeData: NodeInfo = await nodeRes.json();

  nodeData.capybaraId = new Sqids().decode(sqid)[0].toString();
  return nodeData;
}

export default async function BucketDisplay({
  params,
}: {
  params: { slug: string };
}) {
  const node: NodeInfo = await getData(params.slug);
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] bg-gray-100/40 flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 dark:bg-gray-800/40">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4">
        <div className="gap-2 flex pb-6">
          <div className="flex-1 flex">
            <PingStatusIndicator containerId={node.Id} />
            <div>
              <h1 className="text-4xl flex">{node.Name.substring(1, 999)}</h1>
              <h3 className="text-xl flex text-gray-400">
                Up since <TimeAgo date={node.State.StartedAt.toString()} />
              </h3>
            </div>
          </div>
          <ContainerControls containerId={node.Id} capybaraId={node.capybaraId??"-1"} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-3xl pb-2">Container Information</h3>
            <p className="py-2">
              ID:{" "}
              <ToolTip
                toDisplay={node.Id}
                toPopup={node.Id}
                copiedText={node.Id}
                isDisplayPartiallyHidden={true}
              />
            </p>
            <p className="py-2">
              Status:{" "}
              {node.State.Status.charAt(0).toUpperCase() +
                node.State.Status.slice(1)}
            </p>
            <div className="">
              Port bindings:
              {node.HostConfig.PortBindings ? (
                <table className="table-auto border-collapse border-spacing-2 w-1/2 mt-2">
                  <thead>
                    <tr className="border-b border-gray-500">
                      <th className="pr-2 font-medium text-start">
                        Container Port
                      </th>
                      <th className="font-medium text-start">Host Port</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(node.HostConfig.PortBindings).map(
                      ([key, value]) => (
                        <tr key={key}>
                          <td className="">{key}</td>
                          <td>{value.map((v) => v.HostPort).join(", ")}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                "None"
              )}
            </div>
          </div>
          <div>
            <h3 className="text-3xl pb-4">Image Information</h3>
            <div className="bg-white dark:bg-slate-800 shadow-lg dark:shadow-slate-900  p-3 rounded-xl">
              <div className="text-2xl">
                {node.Config.Image}{" "}
                <p className="inline dark:text-gray-300 text-gray-600 text-lg">
                  {node.Config.Labels["org.opencontainers.image.version"]}
                </p>
              </div>
              <p className="">
                {node.Config.Labels["org.opencontainers.image.description"]}
              </p>
              <Link
                href={node.Config.Labels["org.opencontainers.image.source"]}
                className="dark:text-sky-200 text-sky-600 pt-1"
              >
                <GoLink className="inline mb-1 mr-2" />
                {node.Config.Labels["org.opencontainers.image.source"]}
              </Link>
            </div>
          </div>
          <ContainerStatistics containerId={node.Id} />
          <div>
            <div className="text-3xl py-4">Container Logs</div>
            <ContainerLogs containerId={node.Id} />
          </div>
        </div>
      </div>
    </main>
  );
}
