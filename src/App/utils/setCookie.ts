import { Response } from "express";

export const setAuthCookie = (
    res: Response,
    tokens: { accessToken: string; refreshToken?: string }
) => {
    res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    if (tokens.refreshToken) {
        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    }
};
