import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        console.log(body);
        const { prompt } = body;

        const resp = await fetch(process.env.BASETEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": "Api-Key " + process.env.BASETEN_API_KEY,
            },
            body: JSON.stringify({ "prompt": prompt, "num_inference_steps": 4 })
        });
        // console.log(resp);

        if (!resp.ok) {
            return Error("Failed to fetch data from the API");
        }

        const data = await resp.json();
        // console.log(data);

        return NextResponse.json(data);
    } catch (error) {
        console.error("An error occurred:", error);
        return Error("An error occurred");
    }
}