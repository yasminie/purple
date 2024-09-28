import Link from 'next/link';
import React from 'react'
import { FiEdit } from "react-icons/fi";
import { BsArchive, BsThreeDots } from "react-icons/bs";

type Timeline = {
    label: string;
    timelines: {
        title: string;
        href: string;

    }[];
};

const timelineData: Timeline[] = [
    {
        label: 'Today',
        timelines: [
            {
                href: "page1",
                title: "Tag generator"
            },
            {
                href: "title-generator",
                title: "Title generator"
            },
        ]
    }

];

const Navbar = () => {
  return (
    <div className="min-h-screen relative w-full max-w-[244px] pl-4 pr-6 pt-20">

        <div className="absolute top-5 left-0 pl-4 pr-6 w-full">
            <button className="flex justify-between w-full items-center hover:bg-slate-800/80 rounded-lg p-3 transition-all">
                <section className="flex items-center gap-2">
                    <p className="text-sm">New Chat</p>
                </section>
                <FiEdit/>
            </button>
        </div>

        <div className="w-full flex flex-col gap-5">
            {timelineData.map((d, i) => 
                <Timeline key={i} label={d.label} timelines={d.timelines}/>
            )}
        </div>
    </div>
  )
}

function Timeline(props: Timeline){
    return (
    <div className="w-full flex flex-col">
        <p className="text-sm text-gray-500 font-bold p-2">{props.label}</p>

        {props.timelines.map((d, i) => 

            <Link key={i} className="p-2 group hover:bg-slate-800 rounded-lg transition-all text-sm w-full flex justify-between items-center ease-in-out" href={d.href}>
                <div className="text-ellipsis overflow-hidden w-[80%] whitespace-nowrap">{d.title}</div>
                <div className="transition-all items-center gap-3 hidden group-hover:flex ease-in-out duration-75">
                    <BsThreeDots/>
                    <BsArchive/>
                </div>
            </Link>
        )}

    </div>
    );
}

export default Navbar