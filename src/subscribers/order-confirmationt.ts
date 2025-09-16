import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import nodemailer from "nodemailer"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{
  id: string
}>) {
    const notificationModuleService = container.resolve("notification")
  console.log("Order confirmation handler invoked with payload:", data)

  const orderId = data.id

  // ✅ Use remoteQuery (v2 way)
  const remoteQuery = container.resolve("remoteQuery")

  const query = remoteQuery({
    entryPoint: "order",
    fields: [
      "id",
      "display_id",
      "total",
      "subtotal",
      "shipping_total",
      "tax_total",
      "original_total",
      "currency_code",
      "payment_status",
      "items.*",
      "customer.email",
      "customer.first_name",
    ],
    variables: { id: orderId },
  })

  const [order] = await query

  console.log("Retrieved order:", order)

  if (!order || !order.customer?.email) {
    console.error("Order or customer email not found")
    return
  }

  // ✅ Nodemailer config
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  })

  // ✅ Helpers
  const formatAmount = (val: any, currency = "INR") => {
    let num = 0

    if (typeof val?.toNumber === "function") {
      num = val.toNumber()
    } else if (typeof val === "object" && val?.value) {
      num = Number(val.value)
    } else {
      num = Number(val)
    }

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const getNumber = (val: any): number => {
    if (val?.length > 0) return getNumber(val[0])
    if (!val) return 0
    if (typeof val === "number") return val
    if (typeof val?.toNumber === "function") return val.toNumber()
    if (val?.value) return Number(val.value)
    return Number(val)
  }

  // ✅ Email HTML
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #4CAF50;">Order Confirmation</h2>
      <p>Hi ${order.customer.first_name || "there"},</p>
      <p>Your order #${order.display_id} has been placed successfully!</p>

      <p><strong>Order Details:</strong></p>
      <ul>
        ${order.items
          .map(
            (item) => `
            <li>
              ${item.title} x ${getNumber(item.quantity)} 
              — ${formatAmount(item.subtotal)}
            </li>`
          )
          .join("")}
      </ul>

      <p>Subtotal: ${formatAmount(order.subtotal)}</p>
      <p>Shipping: ${formatAmount(order.shipping_total)}</p>
      <p>Tax: ${formatAmount(order.tax_total)}</p>
      <p><strong>Total Amount: ${formatAmount(order.total)}</strong></p>

      <p>Thank you for shopping with Yadhronics!</p>
    </div>
  `
  await notificationModuleService.createNotifications({
    to: order.customer.email,
    channel: "email",
    content: {
      subject: "Order Confirmation - #" + order.display_id,
      text: "",
      html: htmlContent,
    },
    template: "", 
  })
}

export const config: SubscriberConfig = {
  event: ["order.placed"],
}
