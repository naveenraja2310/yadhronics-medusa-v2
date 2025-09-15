import nodemailer from "nodemailer";

export default async function handler(payload) {
  console.log("Order confirmation handler invoked with payload:", payload);
  const eventName = payload.event?.name;
  const eventData = payload.event?.data;

  if (eventName !== "order.placed") return;

  const orderId = eventData.id;

  // ✅ Use remoteQuery instead of orderService
  const remoteQuery = payload.container.resolve("remoteQuery");

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
    variables: {
      id: orderId,
    },
  });

  const [order] = await query;

  console.log("Retrieved order:", order);

  if (!order || !order.customer?.email) {
    console.error("Order or customer email not found");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_AUTH_PASS,
    },
  });

  // ✅ Helper
const formatAmount = (val, currency = "INR") => {
  let num = 0

  if (typeof val?.toNumber === "function") {
    num = val.toNumber()
  } else if (typeof val === "object" && val?.value) {
    num = Number(val.value)
  } else {
    num = Number(val)
  }

  // Format nicely with currency
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

const getNumber = (val) => {
  console.log("getNumber called with:", val);
  if(val?.length > 0) {
    console.log("Array detected, returning first element:", val[0]);
    return getNumber(val[0]);
  }
  if (!val) return 0
  if (typeof val === "number") return val
  if (typeof val?.toNumber === "function") return val.toNumber()
  if (val?.value) return Number(val.value)   // for raw_quantity
  return Number(val)
}


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
`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: order.customer.email,
    subject: `Order Confirmation - #${order.display_id}`,
    html: htmlContent,
  });
}

export const config = {
  event: "order.placed",
};
