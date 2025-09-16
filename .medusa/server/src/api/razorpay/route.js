"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// 🔹 Setup Nodemailer transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
    },
});
const POST = async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];
    const body = req.body;
    // ✅ Verify Razorpay signature
    const expectedSignature = crypto_1.default
        .createHmac("sha256", secret)
        .update(JSON.stringify(body))
        .digest("hex");
    if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Invalid signature" });
    }
    const event = body.event;
    const payment = body.payload.payment?.entity;
    if (!payment) {
        return res.json({ received: true });
    }
    // ✅ Send Email on Success
    if (event === "payment.captured") {
        const htmlContent = `
            <h2>Payment Successful</h2>
            <p>Hi,</p>
            <p>Your payment <b>${payment.id}</b> for <b>${payment.amount / 100} ${payment.currency}</b> was successful.</p>
            <p>Order ID: ${payment.order_id}</p>
        `;
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: "naveenraja2310@gmail.com, yogeshramesh2902@gmail.com",
            subject: "Payment Successful - Yadhronics",
            html: htmlContent,
        });
        console.log("✅ Payment success email sent:", payment.id);
    }
    // ❌ Send Email on Failure
    if (event === "payment.failed") {
        const htmlContent = `
            <h2>Payment Failed</h2>
            <p>Hi,</p>
            <p>Your payment <b>${payment.id}</b> for <b>${payment.amount / 100} ${payment.currency}</b> has failed.</p>
            <p>Order ID: ${payment.order_id}</p>
            <p>Please try again.</p>
        `;
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: "naveenraja2310@gmail.com, yogeshramesh2902@gmail.com",
            subject: "Payment Failed - Yadhronics",
            html: htmlContent,
        });
        console.log("❌ Payment failure email sent:", payment.id);
    }
    return res.json({ received: true });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3Jhem9ycGF5L3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG9EQUEyQjtBQUMzQiw0REFBbUM7QUFFbkMsa0NBQWtDO0FBQ2xDLE1BQU0sV0FBVyxHQUFHLG9CQUFVLENBQUMsZUFBZSxDQUFDO0lBQzNDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7SUFDM0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQztJQUNuQyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEtBQUssTUFBTTtJQUMxQyxJQUFJLEVBQUU7UUFDRixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO1FBQ2hDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7S0FDbkM7Q0FDSixDQUFDLENBQUE7QUFvQkssTUFBTSxJQUFJLEdBQUcsS0FBSyxFQUFFLEdBQWtCLEVBQUUsR0FBbUIsRUFBRSxFQUFFO0lBQ2xFLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUE7SUFDbEQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBVyxDQUFBO0lBQy9ELE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUE4QixDQUFBO0lBRS9DLDhCQUE4QjtJQUM5QixNQUFNLGlCQUFpQixHQUFHLGdCQUFNO1NBQzNCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTyxDQUFDO1NBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVsQixJQUFJLGlCQUFpQixLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ2xDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO0lBQ3hCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQTtJQUU1QyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDWCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0lBRUQsMEJBQTBCO0lBQzFCLElBQUksS0FBSyxLQUFLLGtCQUFrQixFQUFFLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUc7OztpQ0FHSyxPQUFPLENBQUMsRUFBRSxlQUFlLE9BQU8sQ0FBQyxNQUFNLEdBQUcsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFROzJCQUN2RSxPQUFPLENBQUMsUUFBUTtTQUNsQyxDQUFBO1FBRUQsTUFBTSxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7WUFDM0IsRUFBRSxFQUFFLHNEQUFzRDtZQUMxRCxPQUFPLEVBQUUsaUNBQWlDO1lBQzFDLElBQUksRUFBRSxXQUFXO1NBQ3BCLENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFFRCwwQkFBMEI7SUFDMUIsSUFBSSxLQUFLLEtBQUssZ0JBQWdCLEVBQUUsQ0FBQztRQUM3QixNQUFNLFdBQVcsR0FBRzs7O2lDQUdLLE9BQU8sQ0FBQyxFQUFFLGVBQWUsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLFFBQVE7MkJBQ3ZFLE9BQU8sQ0FBQyxRQUFROztTQUVsQyxDQUFBO1FBRUQsTUFBTSxXQUFXLENBQUMsUUFBUSxDQUFDO1lBQ3ZCLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVM7WUFDM0IsRUFBRSxFQUFFLHNEQUFzRDtZQUMxRCxPQUFPLEVBQUUsNkJBQTZCO1lBQ3RDLElBQUksRUFBRSxXQUFXO1NBQ3BCLENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzVELENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN2QyxDQUFDLENBQUE7QUE5RFksUUFBQSxJQUFJLFFBOERoQiJ9