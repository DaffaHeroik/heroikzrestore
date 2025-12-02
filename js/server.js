const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  generateRandomString,
  generateQRCode,
  checkPaymentStatus,
  generateUniqueAmount
} = require("./depo.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/pay", async (req, res) => {
  const amount = req.body.amount;

  // buat nominal unik
  const uniq = generateUniqueAmount(amount);
  const finalAmount = uniq.finalAmount;
  const trxId = generateRandomString(12);

  // generate QR dari Zenitsu
  const result = await generateQRCode(finalAmount, trxId);

  if (!result.success) return res.json({ success: false });

  res.json({
    success: true,
    qr: result.data.qrUrl,
    trx: trxId,
    amount: finalAmount
  });
});
