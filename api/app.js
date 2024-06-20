const cors = require("cors");
// const cryptojs = require("crypto-js");
const crypto = require("crypto");

const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization",
  })
);

const secret = "8gBm/:&EnhH.1/q";

function generateHmacSHA256Signature(message) {
  console.log(message);
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  const signature = hmac.digest("base64");
  console.log(signature);
  return signature;
}

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "server is running good",
  });
});

app.post("/order", (req, res) => {
  const amount = 100;
  const tax_amount = 10;
  const total_amount = amount + tax_amount;
  const transaction_uuid = `${uuidv4()}`;
  const product_code = "EPAYTEST";
  const product_service_charge = 0;
  const product_delivery_charge = 0;
  const success_url = "http://localhost:5173/success";
  const failure_url = "https://google.com";
  const signed_field_names = "total_amount,transaction_uuid,product_code";
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const signature = generateHmacSHA256Signature(message);

  res.status(200).json({
    status: "success",
    message: "order created successfully",
    data: {
      amount,
      tax_amount,
      total_amount,
      transaction_uuid,
      product_code,
      product_service_charge,
      product_delivery_charge,
      success_url,
      failure_url,
      signed_field_names,
      signature,
    },
  });
});

app.get("/success", async (req, res) => {
  const { data } = req.query;
  const responseBody = Buffer.from(data, "base64").toString("utf8");
  const response = JSON.parse(responseBody);

  const {
    transaction_code,
    status,
    total_amount,
    transaction_uuid,
    product_code,
    signed_field_names,
    signature,
  } = response;

  const message = `transaction_code=${transaction_code},status=${status},total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code},signed_field_names=${signed_field_names}`;
  const generatedSignature = generateHmacSHA256Signature(message);
  console.log(generatedSignature === signature);
  if (generatedSignature === signature) {
    console.log("Signature is valid");
    // Process the successful payment
    res.status(200).json({ message: "Payment successful", response });
  } else {
    console.log("Invalid signature");
    res.status(400).json({ message: "Invalid signature" });
  }
});

module.exports = app;
