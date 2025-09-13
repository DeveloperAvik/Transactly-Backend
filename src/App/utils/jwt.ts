import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


export const generateToken = (
    payload: object,
    secret: string,
    expiresIn: string
): string => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
};


export const verifyToken = (
    token: string,
    secret: string
): JwtPayload | string => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error("Invalid or expired token");
    }
};
