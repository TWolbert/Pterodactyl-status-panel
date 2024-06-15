import { Egg, Server, ServerList, User } from "../types/responseTypes";

export default async function IsOnlineServer() {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    let ping = null;
    let serverList = {} as unknown as ServerList;

    const fetchData = async () => {
        const startTime = Date.now();
        try {
            const res = await fetch(`${baseUrl}/api/application/servers`, {
                headers: {
                    Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_KEY,
                },
                next: { revalidate: 0 }
            });

            const data: ServerList = await res.json();
            serverList = data;
            console.log(data);

            ping = Date.now() - startTime;
            return true;
        } catch (error) {
            console.log("Server is offline");
            return false;
        }
    };

    const isOnline = await fetchData();

    return (
        <div className="items-center justify-center flex flex-col">
            <div className="flex">
                {isOnline ? (
                    <div className="w-6 h-6 rounded-full mr-2 bg-green-500"></div>
                ) : (
                    <div className="w-6 h-6 rounded-full mr-2 bg-red-500"></div>
                )}
                <p>{isOnline ? "Online" : "Offline"}</p>
            </div>
            <p>{ping && `${ping}ms`}</p>
            {serverList && (
                <div className=" mt-2 ">
                    {isOnline && <p className=" font-bold text-xl ml-2">{serverList.meta.pagination.count} servers</p>}
                    <div className=" flex flex-col xl:grid xl:grid-cols-3 gap-2 w-screen p-2 xl:p-0 xl:w-auto">
                        {isOnline && serverList.data.map((server) => <ServerInfo {...server} key={server.attributes.id} />)}
                    </div>
                </div>
            )}
        </div>
    );
}

const ServerInfo = async (data: Server) => {
    const reqUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/application/users/${data.attributes.user}`,{
        headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_KEY,
        },
    })

    const user: User = await reqUser.json()

    const reqEgg = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/application/nests/${data.attributes.nest}/eggs/${data.attributes.egg}`,{
        headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_API_KEY,
        },
    })

    const egg: Egg = await reqEgg.json()
    return (
        <div key={data.attributes.id} className="flex flex-col bg-zinc-100 p-2 rounded-xl shadow-md w-full border border-indigo-500">
            <p>Name: {data.attributes.name}</p>
            <p>Egg: {egg.attributes.name}</p>
            <p>User: {user.attributes.first_name + ' ' + user.attributes.last_name + ' - ' + user.attributes.username}</p>
            <a className="mt-auto bg-indigo-400 px-3 py-2 text-white font-bold rounded-md shadow-md hover:-translate-y-1 active:translate-y-1 transition-all" href={`${process.env.NEXT_PUBLIC_API_URL}/server/${data.attributes.uuid.split('-')[0]}`} target="_blank" rel="noreferrer">{'>'} Goto</a>
        </div>
    );
}
