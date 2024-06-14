"use client";

import { useEffect, useState } from "react";

export default function IsOnline() {
    const [isOnline, setIsOnline] = useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    let ping = -1;

    useEffect(() => {
        const startTime = Date.now();
        fetch(`${baseUrl}/api/application/servers`, { mode: "no-cors" })
            .then(() => {
                console.log("Server is online");
                setIsOnline(true);
                ping = Date.now() - startTime;
            })
            .catch(() => {
                console.log("Server is offline");
                setIsOnline(false);
            });
     }, []);

    return (
        <div className="flex items-center justify-center">
            <div className="w-6 h-6 rounded-full mr-2 bg-green-500"></div>
            <p>{isOnline ? "sss" : "Offline"}</p>
            <p>{ping}</p>
        </div>
    )
}