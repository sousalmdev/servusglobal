import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";



const main = {
  backgroundColor: "#0a0a0a",
  fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
  padding: "32px 16px",
};

const container = {
  backgroundColor: "#111111",
  border: "1px solid #1e1e1e",
  maxWidth: "600px",
  margin: "0 auto",
  width: "100%",
};

const goldLine = {
  height: "3px",
  background: "linear-gradient(90deg,#d4a537,#b8942e,#d4a537)",
};

const header = {
  backgroundColor: "#141414",
  borderBottom: "1px solid #1e1e1e",
  padding: "36px 30px 28px 30px",
  textAlign: "center" as const,
};

const headerTitle = {
  fontSize: "16px",
  fontWeight: "800",
  color: "#d4a537",
  textTransform: "uppercase" as const,
  margin: "0",
};

const headerSubtitle = {
  marginTop: "16px",
  fontSize: "10px",
  fontWeight: "600",
  color: "#6e6e73",
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
};

const footer = {
  backgroundColor: "#0e0e0e",
  borderTop: "1px solid #1e1e1e",
  padding: "20px 30px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "10px",
  color: "#4a4a4e",
  letterSpacing: "0.08em",
  margin: "0",
};

const sectionTitleContainer = {
  padding: "28px 20px 8px 20px",
  borderBottom: "1px solid #2a2a2a",
  marginBottom: "12px",
};

const sectionTitleText = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#d4a537",
  textTransform: "uppercase" as const,
  letterSpacing: "0.15em",
  margin: "0",
};

const fieldContainer = {
  padding: "12px 20px",
};

const fieldLabel = {
  fontSize: "10px",
  fontWeight: "600",
  color: "#6e6e73",
  textTransform: "uppercase" as const,
  letterSpacing: "0.12em",
  marginBottom: "4px",
};

const fieldValue = {
  fontSize: "15px",
  color: "#f5f2eb",
  lineHeight: "1.5",
  margin: "0",
};

const fieldLink = {
  color: "#d4a537",
  textDecoration: "none",
  borderBottom: "1px solid rgba(212,165,55,0.3)",
};

const blockquote = {
  fontSize: "14px",
  color: "#c7c7cc",
  lineHeight: "1.65",
  whiteSpace: "pre-wrap" as const,
  padding: "12px 16px",
  backgroundColor: "#0e0e0e",
  borderLeft: "2px solid #d4a537",
  margin: "0",
};

interface ArtistOnboardingEmailProps {
  fullName: string;
  artistName: string;
  email: string;
  phone: string;
  instagram: string;
  links: string;
  contactMethod: string;
  bestTime: string;
  country: string;
  services: string | string[];
  platform: string;
  budget: string;
  shortTermGoals: string;
  longTermVision: string;
}

export const ArtistOnboardingEmail = ({
  fullName,
  artistName,
  email,
  phone,
  instagram,
  links,
  contactMethod,
  bestTime,
  country,
  services,
  platform,
  budget,
  shortTermGoals,
  longTermVision,
}: ArtistOnboardingEmailProps) => {
  const servicesText = Array.isArray(services) ? services.join(", ") : services || "—";
  const instagramHandle = (instagram || "").replace(/^@/, "");

  return (
    <Html>
      <Head />
      <Preview>New Artist Onboarding: {artistName || fullName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={goldLine} />
          
          <Section style={header}>
            <Text style={headerTitle}>SERVUS GLOBAL</Text>
            <Text style={headerSubtitle}>NEW ARTIST SUBMISSION</Text>
            <Text style={{ marginTop: "12px", fontSize: "22px", fontWeight: "300", color: "#f5f2eb", letterSpacing: "-0.01em", margin: "0" }}>
              {artistName || fullName}
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#0e0e0e" }}>
            <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td width="33%" style={{ padding: "18px 12px", textAlign: "center", borderRight: "1px solid #1e1e1e" }}>
                  <Text style={{ fontSize: "9px", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", margin: "0" }}>Country</Text>
                  <Text style={{ fontSize: "13px", color: "#f5f2eb", fontWeight: "500", margin: "0" }}>{country || "—"}</Text>
                </td>
                <td width="34%" style={{ padding: "18px 12px", textAlign: "center", borderRight: "1px solid #1e1e1e" }}>
                  <Text style={{ fontSize: "9px", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", margin: "0" }}>Budget</Text>
                  <Text style={{ fontSize: "13px", color: "#d4a537", fontWeight: "600", margin: "0" }}>{budget || "—"}</Text>
                </td>
                <td width="33%" style={{ padding: "18px 12px", textAlign: "center" }}>
                  <Text style={{ fontSize: "9px", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", margin: "0" }}>Platform</Text>
                  <Text style={{ fontSize: "13px", color: "#f5f2eb", fontWeight: "500", margin: "0" }}>{platform || "—"}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section>
            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Artist Profile</Text></div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Full Name</Text>
              <Text style={fieldValue}>{fullName || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Artist / Brand Name</Text>
              <Text style={fieldValue}>{artistName || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Email</Text>
              <Link href={`mailto:${email}`} style={fieldLink}>{email || "—"}</Link>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Phone</Text>
              <Text style={fieldValue}>{phone || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Instagram</Text>
              {instagram ? (
                <Link href={`https://instagram.com/${instagramHandle}`} style={fieldLink}>{instagram}</Link>
              ) : <Text style={fieldValue}>—</Text>}
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Portfolio & Links</Text>
              <Text style={fieldValue}>{links || "—"}</Text>
            </div>

            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Contact Preferences</Text></div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Preferred Method</Text>
              <Text style={fieldValue}>{contactMethod || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Best Time</Text>
              <Text style={fieldValue}>{bestTime || "—"}</Text>
            </div>

            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Services & Investment</Text></div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Services Required</Text>
              <Text style={fieldValue}>{servicesText}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Focus Platform</Text>
              <Text style={fieldValue}>{platform || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Budget Range</Text>
              <Text style={fieldValue}>{budget || "—"}</Text>
            </div>

            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Goals & Vision</Text></div>
            <div style={{ padding: "12px 20px" }}>
              <Text style={fieldLabel}>Short-Term Goals</Text>
              <Text style={blockquote}>{shortTermGoals || "—"}</Text>
            </div>
            <div style={{ padding: "12px 20px 24px 20px" }}>
              <Text style={fieldLabel}>Long-Term Vision</Text>
              <Text style={blockquote}>{longTermVision || "—"}</Text>
            </div>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>&copy; {new Date().getFullYear()} SERVUS GLOBAL &middot; Submitted via Platform Portal</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const ConsultationInquiryEmail = ({
  fullName,
  companyName,
  email,
  phone,
  role,
  links,
  contactMethod,
  bestTime,
  country,
  services,
  timeline,
  budget,
  shortTermGoals,
  longTermVision,
}: any) => {
  const focusAreasText = Array.isArray(services) ? services.join(", ") : services || "—";

  return (
    <Html>
      <Head />
      <Preview>New Consultation Inquiry: {companyName ? `${fullName} (${companyName})` : fullName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={goldLine} />
          
          <Section style={header}>
            <Text style={headerTitle}>SERVUS GLOBAL</Text>
            <div style={{ marginTop: "14px", display: "inline-block", padding: "5px 14px", fontSize: "10px", fontWeight: "600", color: "#d4a537", letterSpacing: "0.18em", textTransform: "uppercase", border: "1px solid #d4a537" }}>
              CONSULTATION & INQUIRY
            </div>
            <Text style={{ marginTop: "16px", fontSize: "22px", fontWeight: "300", color: "#f5f2eb", letterSpacing: "-0.01em", margin: "16px 0 0 0" }}>
              {fullName} {companyName ? `— ${companyName}` : ""}
            </Text>
          </Section>

          <Section style={{ backgroundColor: "#0e0e0e" }}>
            <table width="100%" cellPadding="0" cellSpacing="0" border={0}>
              <tr>
                <td width="33%" style={{ padding: "18px 12px", textAlign: "center", borderRight: "1px solid #1e1e1e" }}>
                  <Text style={{ fontSize: "9px", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", margin: "0" }}>Country</Text>
                  <Text style={{ fontSize: "13px", color: "#f5f2eb", fontWeight: "500", margin: "0" }}>{country || "—"}</Text>
                </td>
                <td width="34%" style={{ padding: "18px 12px", textAlign: "center", borderRight: "1px solid #1e1e1e" }}>
                  <Text style={{ fontSize: "9px", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", margin: "0" }}>Budget</Text>
                  <Text style={{ fontSize: "13px", color: "#d4a537", fontWeight: "600", margin: "0" }}>{budget || "—"}</Text>
                </td>
                <td width="33%" style={{ padding: "18px 12px", textAlign: "center" }}>
                  <Text style={{ fontSize: "9px", color: "#6e6e73", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px", margin: "0" }}>Timeline</Text>
                  <Text style={{ fontSize: "13px", color: "#f5f2eb", fontWeight: "500", margin: "0" }}>{timeline || "—"}</Text>
                </td>
              </tr>
            </table>
          </Section>

          <Section>
            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Client Information</Text></div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Full Name</Text>
              <Text style={fieldValue}>{fullName || "—"}</Text>
            </div>
            {companyName && (
              <div style={fieldContainer}>
                <Text style={fieldLabel}>Company / Brand / Entity</Text>
                <Text style={fieldValue}>{companyName}</Text>
              </div>
            )}
            {role && (
              <div style={fieldContainer}>
                <Text style={fieldLabel}>Role / Title</Text>
                <Text style={fieldValue}>{role}</Text>
              </div>
            )}
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Email</Text>
              <Link href={`mailto:${email}`} style={fieldLink}>{email || "—"}</Link>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Phone</Text>
              <Text style={fieldValue}>{phone || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Website & Links</Text>
              <Text style={fieldValue}>{links || "—"}</Text>
            </div>

            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Contact Preferences</Text></div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Preferred Method</Text>
              <Text style={fieldValue}>{contactMethod || "—"}</Text>
            </div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Best Time</Text>
              <Text style={fieldValue}>{bestTime || "—"}</Text>
            </div>

            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Consultation Scope</Text></div>
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Focus Areas</Text>
              <Text style={fieldValue}>{focusAreasText}</Text>
            </div>
            {timeline && (
              <div style={fieldContainer}>
                <Text style={fieldLabel}>Target Timeline</Text>
                <Text style={fieldValue}>{timeline}</Text>
              </div>
            )}
            <div style={fieldContainer}>
              <Text style={fieldLabel}>Budget Range</Text>
              <Text style={fieldValue}>{budget || "—"}</Text>
            </div>

            <div style={sectionTitleContainer}><Text style={sectionTitleText}>Overview & Objectives</Text></div>
            <div style={{ padding: "12px 20px" }}>
              <Text style={fieldLabel}>Overview / Immediate Objectives</Text>
              <Text style={blockquote}>{shortTermGoals || "—"}</Text>
            </div>
            <div style={{ padding: "12px 20px 24px 20px" }}>
              <Text style={fieldLabel}>Long-Term Strategic Vision</Text>
              <Text style={blockquote}>{longTermVision || "—"}</Text>
            </div>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>&copy; {new Date().getFullYear()} SERVUS GLOBAL &middot; Submitted via Platform Portal</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const GeneralInquiryEmail = ({ name, email, message, pathway }: any) => {
  const isPartnership = pathway === "investor";
  const typeLabel = isPartnership ? "PARTNERSHIP INQUIRY" : "GENERAL INQUIRY";
  const typeBadgeColor = isPartnership ? "#d4a537" : "#6e6e73";

  return (
    <Html>
      <Head />
      <Preview>{typeLabel} from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={goldLine} />
          
          <Section style={header}>
            <Text style={headerTitle}>SERVUS GLOBAL</Text>
            <div style={{ marginTop: "14px", display: "inline-block", padding: "5px 14px", fontSize: "10px", fontWeight: "600", color: typeBadgeColor, letterSpacing: "0.18em", textTransform: "uppercase", border: `1px solid ${typeBadgeColor}` }}>
              {typeLabel}
            </div>
          </Section>

          <Section style={{ padding: "28px 30px 8px 30px" }}>
            <div style={{ paddingBottom: "16px", borderBottom: "1px solid #1e1e1e" }}>
              <Text style={fieldLabel}>From</Text>
              <Text style={{ fontSize: "18px", color: "#f5f2eb", fontWeight: "400", margin: "0" }}>{name}</Text>
              <Link href={`mailto:${email}`} style={{ fontSize: "14px", color: "#d4a537", textDecoration: "none", display: "inline-block", marginTop: "4px" }}>{email}</Link>
            </div>
          </Section>

          <Section style={{ padding: "20px 30px 32px 30px" }}>
            <Text style={fieldLabel}>Message</Text>
            <Text style={blockquote}>{message}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>&copy; {new Date().getFullYear()} SERVUS GLOBAL &middot; Submitted via Platform Portal</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const ConfirmationEmail = ({ name, pathway, lang }: { name: string; pathway: string; lang: string }) => {
  let subject = "We've received your submission — Servus Global";
  let headerText = "APPLICATION RECEIVED";
  let greeting = `Hi ${name},`;
  let bodyP1 = "Thank you for reaching out to Servus Global.";
  let bodyP2 = "";
  let bodyP3 = "Our team will carefully review your details and get back to you shortly.";
  let signoff = "Best regards,";
  let team = "The Servus Global Team";

  const cleanLang = (lang || "en").toLowerCase();

  if (cleanLang === "pt") {
    const pathwayMap: Record<string, string> = { artist: "integração de artista", consultation: "consulta & parceria executiva", investor: "parcerias", other: "consulta geral" };
    subject = "Recebemos a sua candidatura — Servus Global";
    headerText = "CANDIDATURA RECEBIDA";
    greeting = `Olá ${name},`;
    bodyP1 = "Obrigado por entrar em contato com a Servus Global.";
    bodyP2 = `Recebemos com sucesso a sua solicitação para ${pathwayMap[pathway] || "consulta"}.`;
    bodyP3 = "A nossa equipe analisará os seus dados e entrará em contato com você o mais breve possível.";
    signoff = "Atenciosamente,";
    team = "Equipe Servus Global";
  } else if (cleanLang === "es") {
    const pathwayMap: Record<string, string> = { artist: "integración de artistas", consultation: "consulta y alianza ejecutiva", investor: "asociación", other: "consulta general" };
    subject = "Hemos recibido tu solicitud — Servus Global";
    headerText = "SOLICITUD RECIBIDA";
    greeting = `Hola ${name},`;
    bodyP1 = "Gracias por ponerte en contacto con Servus Global.";
    bodyP2 = `Hemos recibido con éxito tu solicitud para ${pathwayMap[pathway] || "consulta"}.`;
    bodyP3 = "Nuestro equipo revisará tus datos y se pondrá en contacto contigo lo antes posible.";
    signoff = "Atentamente,";
    team = "El equipo de Servus Global";
  } else if (cleanLang === "ja") {
    const pathwayMap: Record<string, string> = { artist: "アーティスト・オンボーディング", consultation: "ビジネス相談・コンサルティング", investor: "パートナーシップ", other: "一般的なお問い合わせ" };
    subject = "申請を受け付けました — Servus Global";
    headerText = "申請受領";
    greeting = `${name} 様`;
    bodyP1 = "Servus Globalにお問い合わせいただきありがとうございます。";
    bodyP2 = `${pathwayMap[pathway] || "コンサルティング"}パスへの申請を正常に受け付けました。`;
    bodyP3 = "当社のチームが内容を確認の上、できるだけ早くご連絡いたします。";
    signoff = "敬具";
    team = "Servus Global チーム";
  } else {
    const pathwayMap: Record<string, string> = { artist: "artist onboarding", consultation: "consultation & business inquiry", investor: "partnership", other: "general inquiry" };
    bodyP2 = `We have successfully received your submission for ${pathwayMap[pathway] || "consultation"}.`;
  }

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={goldLine} />
          
          <Section style={{ backgroundColor: "#141414", borderBottom: "1px solid #1e1e1e", padding: "44px 30px 36px 30px", textAlign: "center" }}>
            <Text style={headerTitle}>SERVUS GLOBAL</Text>
            <Text style={{ marginTop: "20px", fontSize: "10px", fontWeight: "600", color: "#6e6e73", letterSpacing: "0.2em", textTransform: "uppercase", margin: "20px 0 0 0" }}>
              {headerText}
            </Text>
            <div style={{ margin: "20px auto 0 auto", width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "rgba(212,165,55,0.12)", border: "1px solid rgba(212,165,55,0.3)", lineHeight: "48px", textAlign: "center" }}>
              <span style={{ fontSize: "22px", color: "#d4a537" }}>&#10003;</span>
            </div>
          </Section>

          <Section style={{ padding: "36px 36px 32px 36px" }}>
            <Text style={{ fontSize: "20px", fontWeight: "400", color: "#f5f2eb", marginBottom: "24px", margin: "0 0 24px 0" }}>{greeting}</Text>
            <Text style={{ fontSize: "15px", color: "#a1a1a6", lineHeight: "1.75", marginBottom: "16px", margin: "0 0 16px 0" }}>{bodyP1}</Text>
            {bodyP2 && (
              <Text style={{ fontSize: "15px", color: "#a1a1a6", lineHeight: "1.75", marginBottom: "16px", margin: "0 0 16px 0" }}>
                {bodyP2}
              </Text>
            )}
            <Text style={{ fontSize: "15px", color: "#a1a1a6", lineHeight: "1.75", marginBottom: "32px", margin: "0 0 32px 0" }}>{bodyP3}</Text>

            <Hr style={{ borderColor: "#1e1e1e", marginBottom: "24px", marginTop: "0" }} />

            <Text style={{ fontSize: "15px", color: "#a1a1a6", lineHeight: "1.5", margin: "0" }}>{signoff}</Text>
            <Text style={{ fontSize: "15px", color: "#d4a537", fontWeight: "500", marginTop: "4px", margin: "4px 0 0 0" }}>{team}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>&copy; {new Date().getFullYear()} SERVUS GLOBAL. All rights reserved.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
