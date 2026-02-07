import { type Request, type Response, Router } from "express";

const router: Router = Router()

// Health-check endpoint used to verify that the API is running
router.get("/", (req: Request, res: Response)   =>  {
    res.status(200).json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString(), message: "i'm alive!"})
})

export default router