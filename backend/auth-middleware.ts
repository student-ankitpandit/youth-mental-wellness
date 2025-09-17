import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface authenticatedRequest extends Request {
    userId: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authToken = req.headers.authorization?.split(" ")[1];

    if(!authToken) {
        res.status(403).send({
            message: "Auth token invalid",
            success: false,
        })
        return;
    }

    try {
        const data = jwt.verify(authToken, process.env.JWT_SECRET!);
        console.log(data);
        (req as authenticatedRequest).userId = (data as unknown as JwtPayload).userId as unknown as string;
        next();
    } catch (e) {
        res.status(403).send({
            message: "Auth token invalid",
            success: false,
        });
    }
}

