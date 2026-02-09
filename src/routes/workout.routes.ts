import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

// All endpoints requires login
router.use(requireAuth);

router.get("/", (req, res)  =>  {
    res.json({message: "Workout list (protected)",
        user: req.user, //payload
    })
})

router.post("/", (req, res) =>  {
    res.status(201).json({
        message: "Workout created (protected)",
        createdBy: req.user?.sub,
        body: req.body,
    })
})

export default router;