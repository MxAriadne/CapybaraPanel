import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('path')
    const res = await fetch('http://localhost:6969/api/' + query)
    const data = await res.json()

    console.log("data", query, data)
   
    return Response.json({ data })
  }