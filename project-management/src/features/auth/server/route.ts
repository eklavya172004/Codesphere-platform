import { Hono } from "hono";

const app = new Hono()
    .post("/login",(c) => {
        return c.json({
            message: "Login successful"
        })
    })

export default app;