"use server";

import { compare, hash } from "bcrypt";
import { createConnection } from "mysql";
import { cookies } from "next/headers";

export async function CheckToken() {
    const connection = createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    })

    connection.connect()

    const token = cookies().get("token")?.value

    if (!token) {
        return false
    }

    let isTokenValid = false

    // Check if token exists in auth_tokens table
    let tokenExists = await new Promise((resolve, reject) => {
        connection.query(`SELECT user_id FROM auth_tokens WHERE token = ?`, [token], (error, results, fields) => {
            if (error) {
                reject(error)
            }
            if (results.length === 0) {
                resolve(false)
            }
            resolve(results[0].user_id)
        })
    });

    if (typeof tokenExists !== "number") {
        return false
    }

    return true;
}