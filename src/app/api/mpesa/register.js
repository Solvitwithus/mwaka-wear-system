// pages/api/mpesa/register.js

export default async function handler(req, res) {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  const shortcode = process.env.MPESA_SHORTCODE; // e.g. 600XXX
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  // Get access token
  const tokenResponse = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    method: "GET",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Register URLs
  const callbackUrl = "https://your-ngrok-url.ngrok.io"; // Update with your actual public URL (Ngrok)
  const registerUrl = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";

  const response = await fetch(registerUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ShortCode: shortcode,
      ResponseType: "Completed",
      ConfirmationURL: `${callbackUrl}/api/mpesa/confirmation`,
      ValidationURL: `${callbackUrl}/api/mpesa/validation`,
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
