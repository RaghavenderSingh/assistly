import { clerkMiddleware } from "@clerk/nextjs/server";
export default clerkMiddleware();
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
// const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
// export default clerkMiddleware((auth,req)=>{
//     if(isDashboardRoute(req)) auth().protect();
// });