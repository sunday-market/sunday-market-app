const sendEmail = require("../utils/sendEmail");
const ErrorResponse = require("../utils/errorResponse");

exports.contactSupport = async (req, res, next) => {
  if (!req.body.name) {
    return next(new ErrorResponse("No name provided", 400));
  }

  if (!req.body.email) {
    return next(new ErrorResponse("No email provided", 400));
  }

  if (!req.body.contactReason) {
    return next(new ErrorResponse("No contact reason provided", 400));
  }

  if (!req.body.comments) {
    return next(new ErrorResponse("No comment provided", 400));
  }

  const { name, email, contactReason, comments } = req.body;

  const receiverMessage = `
  <h1>Support Message</h1>
  <p>${name} has contacted Sunday Markets Support.</p>
  <p>Details of this message have been outlined below.</p>
  <hr/>
  <p>
    <strong>MESSAGE DETAILS</strong> <br/>
  </p>
  <p>
    <strong>Message Received From</strong> <br/> ${name}
  </p>
  <p>
    <strong>Senders Email</strong> <br/> ${email}
  </p>
  <p>
    <strong>Contact Reason</strong> <br/> ${contactReason}
  </p>
  <p>
    <strong>Comments</strong> <br/> ${comments}
  </p>
`;

  const senderMessage = `
<h1>Sunday Markets Support</h1>
<p>Hi ${name}, Thank you for contacting Sunday Markets Support.</p>
<p>Your message is important to us and if required, we will contact you to discuss further.</p>
<hr/>
<p>
  <strong>MESSAGE DETAILS</strong> <br/>
</p>
<p>
  <strong>Your Name</strong> <br/> ${name}
</p>
<p>
  <strong>Your Email</strong> <br/> ${email}
</p>
<p>
  <strong>Reason for contact</strong> <br/> ${contactReason}
</p>
<p>
  <strong>Comments</strong> <br/> ${comments}
</p>
`;

  try {
    await sendEmail({
      to: "SundayMarketApp@gmail.com",
      subject: `Support Request from ${name}`,
      text: receiverMessage,
    });

    await sendEmail({
      to: email,
      subject: "Sunday Markets Support",
      text: senderMessage,
    });

    res.status(200).send("Message sent");
  } catch (error) {
    next(error);
  }
};
