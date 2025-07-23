// pages/api/mpesa/confirmation.js

export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("✅ Confirmation received:");
    console.log(req.body);

    // Save to DB if needed

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Confirmation received successfully",
    });
  }

  res.status(405).end(); // Method not allowed
}
