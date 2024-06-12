import { auth } from "@/auth";

//export { auth as middleware } from "@/auth"

export const config = {
    matcher: '/builder'
};

export default auth((req) => {
    console.log("Middleware ran!");
    if (!req.auth) {
        console.log("Not authenticated");
        const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
})