export const authConfig = {
    providers: [

    ],
    callbacks: {
        async authorized({ auth, request: { nextUrl }}) {
            const isLoggedIn = Boolean(auth?.user);
            const isOnBuilder = nextUrl.pathname.startsWith("/builder");
            if (isOnBuilder) {
                return isLoggedIn;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/builder', nextUrl));
            }
            //Do nothing if this is not an authorized page
            return true;
        }
    }
}