import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ArtistOnboardingEmail, ConsultationInquiryEmail, GeneralInquiryEmail, ConfirmationEmail } from "../../../emails/ContactEmails";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathway, email, ...rest } = body;

    // Validate required generic fields
    if (!pathway) {
      return NextResponse.json({ error: "Pathway is required" }, { status: 400 });
    }

    // Basic email validation if email exists in the payload
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
      }
    }

    // Retrieve Resend configuration
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL;

    if (!apiKey || !fromEmail || !toEmail) {
      console.error("[Contact API Configuration Error]: Missing environment variables.");
      return NextResponse.json(
        { error: "Email service not configured properly" },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    let subject = "";
    let reactComponent: React.ReactElement | null = null;

    if (pathway === "artist") {
      const artistName = rest.artistName || rest.fullName || "Unknown Artist";
      subject = `[Onboarding] Submission from ${artistName}`;
      reactComponent = ArtistOnboardingEmail({ email, ...rest });
    } else if (pathway === "consultation") {
      const clientName = rest.companyName ? `${rest.fullName} (${rest.companyName})` : rest.fullName || "Inquirer";
      subject = `[Consultation] Inquiry from ${clientName}`;
      reactComponent = ConsultationInquiryEmail({ email, ...rest });
    } else {
      const name = rest.fullName || rest.name || "Anonymous Partner";
      const subjectPrefix = pathway === "investor" ? "Partnership" : "General";
      subject = `[${subjectPrefix}] Inquiry from ${name}`;
      reactComponent = GeneralInquiryEmail({ email, ...rest, pathway });
    }

    // Send notification report email to admin
    const adminMailPromise = resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      react: reactComponent as React.ReactElement,
      replyTo: email || undefined,
    });

    // Send confirmation email to the submitter
    let userMailPromise = Promise.resolve<{ data: any; error: any }>({ data: null, error: null });
    if (email) {
      const userName = rest.fullName || rest.name || rest.artistName || "there";
      let userSubject = "We've received your submission — Servus Global";
      
      const cleanLang = (rest.lang || "en").toLowerCase();
      if (cleanLang === "pt") userSubject = "Recebemos a sua candidatura — Servus Global";
      else if (cleanLang === "es") userSubject = "Hemos recibido tu solicitud — Servus Global";
      else if (cleanLang === "ja") userSubject = "申請を受け付けました — Servus Global";

      userMailPromise = resend.emails.send({
        from: fromEmail,
        to: email,
        subject: userSubject,
        react: ConfirmationEmail({ name: userName, pathway, lang: rest.lang || "en" }),
      });
    }

    const [adminResult, userResult] = await Promise.all([
      adminMailPromise,
      userMailPromise,
    ]);

    if (adminResult.error) {
      console.error("[Resend Admin Error]:", adminResult.error);
      return NextResponse.json({ error: adminResult.error.message }, { status: 400 });
    }

    if (userResult.error) {
      console.warn("[Resend User Confirmation Warning]:", userResult.error);
    }

    console.log(`[Contact Form] Submission sent successfully. Admin Mail ID: ${adminResult.data?.id}`);
    return NextResponse.json({ success: true, message: "Message received and forwarded" });
  } catch (error) {
    console.error("[Contact API Error]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
