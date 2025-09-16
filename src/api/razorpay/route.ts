import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import crypto from "crypto"
import nodemailer from "nodemailer"

// 🔹 Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_AUTH_USER,
        pass: process.env.SMTP_AUTH_PASS,
    },
})

type RazorpayWebhookPayload = {
    event: string
    payload: {
        payment?: {
        entity: {
            id: string
            order_id: string
            status: string
            amount: number
            currency: string
            email?: string
            contact?: string
            [key: string]: any
        }
        }
    }
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET
    const signature = req.headers["x-razorpay-signature"] as string
    const body = req.body as RazorpayWebhookPayload

    // ✅ Verify Razorpay signature
    const expectedSignature = crypto
        .createHmac("sha256", secret!)
        .update(JSON.stringify(body))
        .digest("hex")

    if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Invalid signature" })
    }

    const event = body.event
    const payment = body.payload.payment?.entity

    if (!payment) {
        return res.json({ received: true })
    }

    // ✅ Send Email on Success
    if (event === "payment.captured") {
        const htmlContent = `
            <h2>Payment Successful</h2>
            <p>Hi,</p>
            <p>Your payment <b>${payment.id}</b> for <b>${payment.amount / 100} ${payment.currency}</b> was successful.</p>
            <p>Order ID: ${payment.order_id}</p>
        `

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: "naveenraja2310@gmail.com, yogeshramesh2902@gmail.com",
            subject: "Payment Successful - Yadhronics",
            html: htmlContent,
        })

        console.log("✅ Payment success email sent:", payment.id)
    }

    // ❌ Send Email on Failure
    if (event === "payment.failed") {
        const htmlContent = `
            <h2>Payment Failed</h2>
            <p>Hi,</p>
            <p>Your payment <b>${payment.id}</b> for <b>${payment.amount / 100} ${payment.currency}</b> has failed.</p>
            <p>Order ID: ${payment.order_id}</p>
            <p>Please try again.</p>
        `

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: "naveenraja2310@gmail.com, yogeshramesh2902@gmail.com",
            subject: "Payment Failed - Yadhronics",
            html: htmlContent,
        })

        console.log("❌ Payment failure email sent:", payment.id)
    }

    return res.json({ received: true })
}
