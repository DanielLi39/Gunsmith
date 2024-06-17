import { auth } from "@/auth";

//export { auth as middleware } from "@/auth"

export const config = {
    matcher: ['/builder', '/signup', '/signin']
};

export default auth((req) => {
    console.log("Middleware ran!");
    if (req.nextUrl.pathname === '/signin' && req.auth) {
        console.log("Already signed in!");
        const newUrl = new URL("/", req.nextUrl.origin);
        return Response.redirect(newUrl);
    } else if (!req.auth && req.nextUrl.pathname !== '/signin') {
        console.log("Not authenticated");
        const newUrl = new URL("/signin", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
})