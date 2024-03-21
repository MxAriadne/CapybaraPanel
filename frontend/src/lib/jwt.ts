import * as jose from "jose"


interface JWTPayload{
    name: string;
    iat: number;
    iss: string;
    aud: string;
    exp: number;
  };

const secret = jose.base64url.decode('baluqilh3ibcefrhcilu4wbfuiqbrilbwc2iuqfhlqg')

// Decrypt a Timed JWE Token
export async function decryptTJWT(tjwt: string): Promise<jose.JWTDecryptResult<JWTPayload>> {
    let sjwt = tjwt.split('.')
    let time = sjwt.shift()
    let jwt = sjwt.join(".")
    return await jose.jwtDecrypt<JWTPayload>(jwt, secret, {
        issuer: 'urn:lutea:verkstad',
        audience: 'urn:lutea:audience',
      })
}