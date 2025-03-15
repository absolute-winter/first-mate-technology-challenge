import { NextResponse } from "next/server";
import axios from "axios";

export const POST = async (req: Request) => {
    try {
        const {externalApi, ...body} = await req.json();

        if (!externalApi) {
            return NextResponse.json({ error: "Missing external API" }, { status: 400 });
        }

        const response = await axios.post(externalApi, body, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Error forwarding request" }, { status: 500 });
    }
}