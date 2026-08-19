import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, phone, service, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Please complete your name, email and message." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.BLACK_RABBIT_TEAM_EMAIL) {
      return NextResponse.json({ error: "Email service is not configured yet. Please contact Black Rabbit directly." }, { status: 500 });
    }

    const payloads = [
      {
        from: process.env.RESEND_FROM_EMAIL,
        to: [process.env.BLACK_RABBIT_TEAM_EMAIL],
        reply_to: email,
        subject: `New website enquiry${service ? ` — ${service}` : ""}`,
        html: `<h2>New Black Rabbit Aerials enquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
          <p><strong>Service:</strong> ${escapeHtml(service || "General enquiry")}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject || "Website enquiry")}</p>
          <p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`
      },
      {
        from: process.env.RESEND_FROM_EMAIL,
        to: [email],
        subject: "We received your enquiry — Black Rabbit Aerials",
        html: `<h2>Thank you, ${escapeHtml(name)}.</h2>
          <p>We have received your enquiry and a member of the Black Rabbit Aerials team will get back to you as soon as possible.</p>
          <p><strong>Service:</strong> ${escapeHtml(service || "General enquiry")}</p>
          <p><strong>Your message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          <p>Black Rabbit Aerials<br>418 Cork Avenue, Ferndale, Randburg<br>info@blackrabbit.co.za</p>`
      }
    ];

    for (const body of payloads) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend error:", detail);
        throw new Error("Email provider rejected the request");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "We couldn't send your message right now. Please try again or call Black Rabbit." }, { status: 500 });
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
