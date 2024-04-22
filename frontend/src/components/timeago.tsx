"use client";

import { timeAgo } from "@/helpers/timeago";

export default function TimeAgo(props: {date: string}) {
    return (
        <span className="dark:text-gray-400 text-gray-700 ml-1.5">
        {timeAgo(props.date)}
        </span>
    )
    }