import authMiddleware from "@clerk/clerk-js";

export default authMiddleware({});

export const config = {
    matcher: ["/builder"]
};