import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathway, email, ...rest } = body;

    // Validate required generic fields
    if (!pathway) {
      return NextResponse.json({ error: "Pathway is required" }, { status: 400 });
    }

    // Basic email validation if email exists in the payload (it should be in either form)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }
    }

    // TODO: Integrate with email service or webhook (e.g. Resend, SendGrid, Slack webhook)
    console.log(`[Contact Form] New submission for pathway: ${pathway}`, { email, ...rest });

    return NextResponse.json({ success: true, message: "Message received" });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
