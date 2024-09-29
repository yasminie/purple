"use client";
import Link from 'next/link';
import React from 'react'
import { FiEdit } from "react-icons/fi";
import { BsArchive, BsThreeDots } from "react-icons/bs";
import { cn } from '@/utils/cn';

import { usePathname } from "next/navigation";

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
                title: "Saved Chats are a WIP!"
            },
            {
                href: "title-generator",
                title: "Sample chat two!!"
            },
        ]
        
    }

];

const Navbar = () => {
  return (
    <div className={cn("min-h-screen relative w-full max-w-[244px] pl-4 pr-6 pt-20 bg-[#10002B]")}>

        <div className="absolute top-5 left-0 pl-4 pr-6 w-full">
            <Link href={'/'} className="flex justify-between w-full items-center hover:bg-[#5A189A] rounded-lg p-3 transition-all">
                <section className="flex items-center gap-2">
                    <p className="text-sm roboto">New Chat</p>
                </section>
                <FiEdit/>
            </Link>
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

    const pathName = usePathname();

    return (
    <div className="w-full flex flex-col">
        <p className="text-sm text-gray-400 font-bold p-2 roboto">{props.label}</p>

        {props.timelines.map((d, i) => 

            <Link 
            key={i} 
            className={cn("roboto p-2 group hover:bg-[#5A189A] rounded-lg transition-all text-sm w-full flex justify-between items-center ease-in-out", 
                {"bg-slate-800" : `/${d.href}` === pathName})}
            href={d.href}>
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