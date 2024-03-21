import { z } from "zod";
import * as jose from "jose";
import { cookies } from "next/headers";
import { useSearchParams } from "next/navigation";

interface GarageKeyInformation {
  name: string;
  accessKeyId: string;
  secretAccessKey: string | undefined;
  permissions: Map<string, boolean>;
  buckets: string[];
}

let formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(500),
});

export async function GET(request: Request) {
  let params = useSearchParams();
  if(params.get("jwt") !== null){
    cookies().delete("jwt");
  }
}

export async function POST(request: Request) {
  // get form data
  const form = await ((await new Response(request.body).json()) as Promise<
    z.infer<typeof formSchema>
  >);
  const expires = new Date(Date.now() + 1209600000); // 2 weeks
  const jwt = await new jose.EncryptJWT({
    name: form.username
  })
    .setProtectedHeader({ alg: "dir", enc: "A128CBC-HS256" })
    .setIssuedAt()
    .setIssuer("urn:lutea:verkstad")
    .setAudience("urn:lutea:audience")
    .setExpirationTime(expires)
    .encrypt(
      jose.base64url.decode("baluqilh3ibcefrhcilu4wbfuiqbrilbwc2iuqfhlqg")
    );
  let j = `${btoa(expires.getTime().toString())}.${jwt}`;
  cookies().set("jwt", j);
  return new Response(j);
}
