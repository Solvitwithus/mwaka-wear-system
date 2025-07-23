// pages/api/mpesa/validation.js

export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("✅ Validation received:");
    console.log(req.body);

    // Logic to approve or reject transaction can go here

    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Validation successful",
    });
  }

  res.status(405).end(); // Method not allowed
}
