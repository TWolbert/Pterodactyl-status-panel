import { compare, hash } from "bcrypt";
import { setCookie } from "cookies-next";
import { createConnection } from "mysql";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function POST(request: Request) {
    const loginSchema = z.object({ 
        username: z.string().min(3).max(20),
        password: z.string().min(8).max(255)
    })

    const loginFormData = await request.formData();
    const loginForm = {
        username: loginFormData.get("username"),
        password: loginFormData.get("password")
    }

    const { data } = await loginSchema.safeParseAsync(loginForm)

    if (!data) {
        return new Response("Invalid data", { status: 400 })
    }

    const connection = createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })

    connection.connect()

   let pwHash = await new Promise((resolve, reject) => {
        connection.query(`SELECT password FROM users WHERE username = ?`, [data.username], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            resolve(results[0].password as string)
        })
    });

    if (typeof pwHash !== "string") {
        return new Response("Invalid data", { status: 400 })
     }

    let isPasswordCorrect = false

    // Compare the password
    try {
        isPasswordCorrect = await compare(data.password, pwHash)
    }
    catch {
        isPasswordCorrect = false
    }

    if (!isPasswordCorrect) {
        return new Response("Invalid password", { status: 401 })
    }

    const token = await hash(data.username, 10)

    // Insert token into database wwith user_id, token, and expiration_date
    let userId = await new Promise((resolve, reject) => {
        connection.query(`SELECT id FROM users WHERE username = ?`, [data.username], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            resolve(results[0].id as number)
        })
    });

    if (typeof userId !== "number") {
        return new Response("Invalid data", { status: 400 })
    }

    await new Promise((resolve, reject) => {
        connection.query(`INSERT INTO auth_tokens (user_id, token, expiration_date) VALUES (?, ?, ?)`, [userId, token, new Date(Date.now() + 1000 * 60 * 60 * 24)], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            resolve(results)
        })
    });

    connection.end()

    cookies().set("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    })

    return redirect("/")
}