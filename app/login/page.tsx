import { z } from "zod"
import mysql from "mysql";
import { compare, hash } from "bcrypt";
import { setCookie } from "cookies-next";

export default async function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Login</h1>
            <form className="flex flex-col items-center justify-center" action='/api/login' method="POST">
                <input type="text" name="username" placeholder="Username" className="border-2 border-gray-200 p-2 m-2" />
                <input type="password" name="password" placeholder="Password" className="border-2 border-gray-200 p-2 m-2" />
                <button type="submit" className="bg-blue-500 text-white p-2 m-2">Login</button>
            </form>
        </div>
    )
}