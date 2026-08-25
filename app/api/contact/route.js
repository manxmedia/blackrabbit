import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import tls from "node:tls";

const TEAM_EMAIL = process.env.BLACK_RABBIT_TEAM_EMAIL || "info@blackrabbitaerials.co.za";
const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || "Black Rabbit Aerials <info@blackrabbitaerials.co.za>";
const SMTP_HOST = process.env.SMTP_HOST || "smtp.zoho.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_USER = process.env.SMTP_USER || "info@blackrabbitaerials.co.za";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

export async function POST(request) {
  try {
    const { name, email, phone, service, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Please complete your name, email and message." },
        { status: 400 }
      );
    }

    if (!SMTP_PASSWORD) {
      return NextResponse.json(
        { error: "Email service is not configured yet. Please contact Black Rabbit directly." },
        { status: 500 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Keep raw values for plain-text email content and create separately escaped
    // values for HTML. Reusing HTML-escaped values in the text version causes
    // entities such as &amp; to appear in customer emails.
    const raw = {
      name: String(name),
      email: String(email),
      phone: String(phone || "Not provided"),
      service: String(service || "General enquiry"),
      subject: String(subject || "Website enquiry"),
      message: String(message),
    };

    const safe = {
      name: escapeHtml(raw.name),
      email: escapeHtml(raw.email),
      phone: escapeHtml(raw.phone),
      service: escapeHtml(raw.service),
      subject: escapeHtml(raw.subject),
      message: escapeHtml(raw.message).replace(/\n/g, "<br />"),
    };

    const logo = await getLogoAttachment();
    const logoHtml = `<img src="cid:black-rabbit-logo" alt="Black Rabbit Aerials" width="190" style="display:block;width:190px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none;margin:0 auto;" />`;

    const attachments = logo
      ? [
          {
            filename: "black-rabbit-logo.png",
            content: logo,
            content_id: "black-rabbit-logo",
            content_type: "image/png",
          },
        ]
      : undefined;

    const teamEmail = {
      from: FROM_EMAIL,
      to: [TEAM_EMAIL],
      reply_to: email,
      subject: `New website enquiry${service ? ` — ${service}` : ""}`,
      html: teamTemplate(safe, logoHtml),
      text: teamText(raw),
      ...(attachments ? { attachments } : {}),
    };

    const clientEmail = {
      from: FROM_EMAIL,
      to: [email],
      subject: "We received your enquiry — Black Rabbit Aerials",
      html: clientTemplate(safe, logoHtml),
      text: clientText(raw),
      ...(attachments ? { attachments } : {}),
    };

    // Send both emails independently so one successful delivery is not lost
    // just because the second request fails.
    const results = await Promise.all([
      sendWithSmtp(teamEmail),
      sendWithSmtp(clientEmail),
    ]);

    if (!results[0].ok || !results[1].ok) {
      console.error("Zoho SMTP delivery error:", results);
      return NextResponse.json(
        { error: "Your enquiry was received, but we could not complete both email notifications. Please contact Black Rabbit if you do not receive a confirmation." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "We couldn't send your message right now. Please try again or call Black Rabbit." },
      { status: 500 }
    );
  }
}

async function sendWithSmtp(body) {
  const message = buildMimeMessage(body);

  return new Promise((resolve) => {
    const socket = tls.connect({ host: SMTP_HOST, port: SMTP_PORT, servername: SMTP_HOST, rejectUnauthorized: true });
    let buffer = "";
    let step = 0;
    let settled = false;

    const finish = (result) => {
      if (settled) return;
      settled = true;
      try { socket.end(); } catch {}
      resolve(result);
    };

    const fail = (detail) => finish({ ok: false, detail });

    socket.setTimeout(20000, () => fail("Zoho SMTP connection timed out"));
    socket.on("error", (error) => fail(error.message));

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      while (true) {
        const newline = buffer.indexOf("\n");
        if (newline === -1) break;
        const line = buffer.slice(0, newline).replace(/\r$/, "");
        buffer = buffer.slice(newline + 1);
        if (!/^\d{3}(?:[ -])/.test(line)) continue;
        const code = Number(line.slice(0, 3));
        const more = line[3] === "-";
        if (more) continue;

        try {
          if (step === 0) {
            if (code !== 220) return fail(line);
            step = 1;
            socket.write(`EHLO ${SMTP_USER.split("@").pop()}\r\n`);
          } else if (step === 1) {
            if (code !== 250) return fail(line);
            step = 2;
            socket.write("AUTH LOGIN\r\n");
          } else if (step === 2) {
            if (code !== 334) return fail(line);
            step = 3;
            socket.write(`${Buffer.from(SMTP_USER).toString("base64")}\r\n`);
          } else if (step === 3) {
            if (code !== 334) return fail(line);
            step = 4;
            socket.write(`${Buffer.from(SMTP_PASSWORD).toString("base64")}\r\n`);
          } else if (step === 4) {
            if (code !== 235) return fail(line);
            step = 5;
            socket.write(`MAIL FROM:<${extractEmail(FROM_EMAIL)}>\r\n`);
          } else if (step === 5) {
            if (code !== 250) return fail(line);
            step = 6;
            socket.write(`RCPT TO:<${body.to[0]}>\r\n`);
          } else if (step === 6) {
            if (code !== 250 && code !== 251) return fail(line);
            step = 7;
            socket.write("DATA\r\n");
          } else if (step === 7) {
            if (code !== 354) return fail(line);
            step = 8;
            socket.write(message + "\r\n.\r\n");
          } else if (step === 8) {
            if (code !== 250) return fail(line);
            finish({ ok: true });
          }
        } catch (error) {
          fail(error.message);
        }
      }
    });
  });
}

function buildMimeMessage(body) {
  const alternativeBoundary = `=_BR_ALT_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const relatedBoundary = `=_BR_RELATED_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const to = body.to[0];
  const replyTo = body.reply_to;
  const subject = encodeMimeHeader(body.subject);
  const attachment = body.attachments?.[0];

  const lines = [
    `From: ${body.from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: ${subject}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(16).slice(2)}@${SMTP_HOST}>`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${alternativeBoundary}"`,
    "",
    `--${alternativeBoundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body.text || "",
    "",
    `--${alternativeBoundary}`,
    `Content-Type: multipart/related; type="text/html"; boundary="${relatedBoundary}"`,
    "",
    `--${relatedBoundary}`,
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body.html || "",
    "",
  ];

  if (attachment) {
    lines.push(
      `--${relatedBoundary}`,
      `Content-Type: ${attachment.content_type || "application/octet-stream"}; name="${attachment.filename}"`,
      "Content-Transfer-Encoding: base64",
      `Content-ID: <${attachment.content_id}>`,
      `Content-Disposition: inline; filename="${attachment.filename}"`,
      "",
      wrapBase64(attachment.content),
      ""
    );
  }

  lines.push(
    `--${relatedBoundary}--`,
    "",
    `--${alternativeBoundary}--`,
    ""
  );

  return dotStuff(lines.filter((line) => line !== null).join("\r\n"));
}
function wrapBase64(value) {
  return String(value).match(/.{1,76}/g)?.join("\r\n") || "";
}

function dotStuff(value) {
  return value.replace(/(^|\r\n)\./g, "$1..");
}

function extractEmail(value) {
  const match = String(value).match(/<([^>]+)>/);
  return match ? match[1] : String(value).trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));
}

function encodeMimeHeader(value) {
  return /[^\x20-\x7E]/.test(String(value))
    ? `=?UTF-8?B?${Buffer.from(String(value), "utf8").toString("base64")}?=`
    : String(value);
}

async function getLogoAttachment() {
  try {
    const logoPath = path.join(process.cwd(), "public", "assets", "img", "logo.png");
    const buffer = await fs.readFile(logoPath);
    return buffer.toString("base64");
  } catch (error) {
    console.warn("Black Rabbit logo could not be loaded for email:", error);
    return null;
  }
}

function emailShell({ preview, logo, title, intro, body, footer }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f2f3f5;font-family:Arial,Helvetica,sans-serif;color:#171717;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f3f5;padding:28px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;">
<tr><td style="background:#050505;padding:28px 30px;text-align:center;">${logo}</td></tr>
<tr><td style="padding:34px 34px 12px;">
<div style="font-size:12px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:#777;margin-bottom:10px;">Black Rabbit Aerials</div>
<h1 style="margin:0 0 14px;font-size:28px;line-height:1.2;color:#111;">${title}</h1>
<p style="margin:0;color:#555;font-size:16px;line-height:1.7;">${intro}</p>
</td></tr>
<tr><td style="padding:12px 34px 34px;">${body}</td></tr>
<tr><td style="padding:24px 34px;background:#fafafa;border-top:1px solid #e9e9e9;">${footer}</td></tr>
</table>
<p style="max-width:640px;margin:16px auto 0;text-align:center;color:#888;font-size:11px;line-height:1.6;">This email was sent from the Black Rabbit Aerials website contact form.</p>
</td></tr>
</table>
</body></html>`;
}

function detailTable(safe) {
  const row = (label, value) => `<tr><td style="padding:12px 14px;border-bottom:1px solid #eee;font-size:12px;font-weight:700;color:#777;text-transform:uppercase;vertical-align:top;width:130px;">${label}</td><td style="padding:12px 14px;border-bottom:1px solid #eee;font-size:15px;color:#222;">${value}</td></tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e7e7e7;border-radius:10px;overflow:hidden;">${row("Name", safe.name)}${row("Email", safe.email)}${row("Phone", safe.phone)}${row("Service", safe.service)}${row("Subject", safe.subject)}</table>`;
}

function teamTemplate(safe, logo) {
  return emailShell({
    preview: `New website enquiry from ${safe.name}`,
    logo,
    title: "New website enquiry",
    intro: "A customer has submitted a new enquiry through the Black Rabbit Aerials website.",
    body: `${detailTable(safe)}<div style="margin-top:22px;padding:18px;background:#f7f7f7;border-left:4px solid #111;border-radius:6px;"><div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#777;margin-bottom:8px;">Customer message</div><div style="font-size:15px;line-height:1.7;color:#222;">${safe.message}</div></div><div style="margin-top:22px;text-align:center;"><a href="mailto:${encodeURIComponent(safe.email)}" style="display:inline-block;padding:13px 20px;background:#111;color:#fff;text-decoration:none;border-radius:7px;font-weight:700;font-size:14px;">Reply to customer</a></div>`,
    footer: `<div style="font-size:13px;line-height:1.7;color:#666;"><strong style="color:#222;">Black Rabbit Aerials</strong><br />418 Cork Avenue, Ferndale, Randburg<br />083 688 2899 · info@blackrabbitaerials.co.za</div>`,
  });
}

function clientTemplate(safe, logo) {
  return emailShell({
    preview: "Your Black Rabbit Aerials enquiry has been received.",
    logo,
    title: `Thanks, ${safe.name}!`,
    intro: "We've received your enquiry and a member of the Black Rabbit Aerials team will review it and get back to you as soon as possible.",
    body: `${detailTable(safe)}<div style="margin-top:22px;padding:18px;background:#f7f7f7;border-left:4px solid #111;border-radius:6px;"><div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#777;margin-bottom:8px;">Your message</div><div style="font-size:15px;line-height:1.7;color:#222;">${safe.message}</div></div><p style="margin:22px 0 0;color:#666;font-size:14px;line-height:1.7;">If your enquiry is urgent, you can contact us directly on <a href="tel:+27836882899" style="color:#111;font-weight:700;">083 688 2899</a>.</p>`,
    footer: `<div style="font-size:13px;line-height:1.7;color:#666;"><strong style="color:#222;">Black Rabbit Aerials</strong><br />418 Cork Avenue, Ferndale, Randburg<br />083 688 2899 · info@blackrabbitaerials.co.za</div>`,
  });
}

function teamText(raw) {
  return `New Black Rabbit Aerials website enquiry\n\nName: ${raw.name}\nEmail: ${raw.email}\nPhone: ${raw.phone}\nService: ${raw.service}\nSubject: ${raw.subject}\n\nMessage:\n${raw.message}`;
}

function clientText(raw) {
  return `Hi ${raw.name},\n\nThank you for contacting Black Rabbit Aerials. We have received your enquiry and a member of our team will get back to you as soon as possible.\n\nService: ${raw.service}\nSubject: ${raw.subject}\n\nYour message:\n${raw.message}\n\nBlack Rabbit Aerials\n418 Cork Avenue, Ferndale, Randburg\n083 688 2899\ninfo@blackrabbitaerials.co.za`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}
