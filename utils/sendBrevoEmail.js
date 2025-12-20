import fetch from "node-fetch";

const sendBrevoEmail = async ({ to, subject, html }) => {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME || "Finance Manager",
        },
        to: [{ email: to }],   // expects STRING email
        subject,
        htmlContent: html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ Brevo REST error:", data);
      return false;
    }

    console.log("✅ Brevo email sent");
    return true;
  } catch (err) {
    console.error("❌ Brevo REST exception:", err.message);
    return false;
  }
};

export default sendBrevoEmail;

