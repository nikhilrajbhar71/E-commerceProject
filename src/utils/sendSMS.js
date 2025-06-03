import twilio from "twilio";

export const sendOTP = async (phoneNumber, OTP) => {
  const accountSid = process.env.TWILIO_ACCOUNTSID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  await client.messages
    .create({
      body: `Hello, your OTP for registration is ${OTP}. It is valid for 5 minutes.`,
      from: `${process.env.TWILIO_PHONE_NUMBER}`,
      to: phoneNumber,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.error("SMS Error:", err));
};
