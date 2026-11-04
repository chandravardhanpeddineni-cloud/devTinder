const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  return new SendEmailCommand({
    Source: fromAddress,

    Destination: {
      ToAddresses: [toAddress],
    },

    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },

      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: body,
        },
      },
    },

    // Enable SES email event tracking
    ConfigurationSetName: "devtinder-email-events",
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "chandravardhan800@gmail.com", 
    "chandravardhanpeddineni@gmail.com",
    subject,
    body
  );

  try {
    const response = await sesClient.send(sendEmailCommand);
    console.log("Email sent successfully:", response.MessageId);
    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};

module.exports = { run };