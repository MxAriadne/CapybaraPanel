import { cookies } from "next/headers";

export async function POST(request: Request) {
    cookies().delete('jwt');
    request.headers.set(
        "Set-Cookie", `jwt=deleted; Max-Age=0`
      );
    console.log("ok");
    return new Response("ok");
}
