"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function orderPlacedHandler({ event: { data }, container, }) {
    const notificationModuleService = container.resolve("notification");
    console.log("Order confirmation handler invoked with payload:", data);
    const orderId = data.id;
    // ✅ Use remoteQuery (v2 way)
    const remoteQuery = container.resolve("remoteQuery");
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
    });
    const [order] = await query;
    console.log("Retrieved order:", order);
    if (!order || !order.customer?.email) {
        console.error("Order or customer email not found");
        return;
    }
    // ✅ Nodemailer config
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS,
        },
    });
    // ✅ Helpers
    const formatAmount = (val, currency = "INR") => {
        let num = 0;
        if (typeof val?.toNumber === "function") {
            num = val.toNumber();
        }
        else if (typeof val === "object" && val?.value) {
            num = Number(val.value);
        }
        else {
            num = Number(val);
        }
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };
    const getNumber = (val) => {
        if (val?.length > 0)
            return getNumber(val[0]);
        if (!val)
            return 0;
        if (typeof val === "number")
            return val;
        if (typeof val?.toNumber === "function")
            return val.toNumber();
        if (val?.value)
            return Number(val.value);
        return Number(val);
    };
    // ✅ Email HTML
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #4CAF50;">Order Confirmation</h2>
      <p>Hi ${order.customer.first_name || "there"},</p>
      <p>Your order #${order.display_id} has been placed successfully!</p>

      <p><strong>Order Details:</strong></p>
      <ul>
        ${order.items
        .map((item) => `
            <li>
              ${item.title} x ${getNumber(item.quantity)} 
              — ${formatAmount(item.subtotal)}
            </li>`)
        .join("")}
      </ul>

      <p>Subtotal: ${formatAmount(order.subtotal)}</p>
      <p>Shipping: ${formatAmount(order.shipping_total)}</p>
      <p>Tax: ${formatAmount(order.tax_total)}</p>
      <p><strong>Total Amount: ${formatAmount(order.total)}</strong></p>

      <p>Thank you for shopping with Yadhronics!</p>
    </div>
  `;
    await notificationModuleService.createNotifications({
        to: order.customer.email,
        channel: "email",
        content: {
            subject: "Order Confirmation - #" + order.display_id,
            text: "",
            html: htmlContent,
        },
        template: "",
    });
}
exports.config = {
    event: ["order.placed"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItY29uZmlybWF0aW9udC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdWJzY3JpYmVycy9vcmRlci1jb25maXJtYXRpb250LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUdBLHFDQXdIQztBQTFIRCw0REFBbUM7QUFFcEIsS0FBSyxVQUFVLGtCQUFrQixDQUFDLEVBQy9DLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUNmLFNBQVMsR0FHVDtJQUNFLE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLGtEQUFrRCxFQUFFLElBQUksQ0FBQyxDQUFBO0lBRXJFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUE7SUFFdkIsNkJBQTZCO0lBQzdCLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFcEQsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRTtZQUNOLElBQUk7WUFDSixZQUFZO1lBQ1osT0FBTztZQUNQLFVBQVU7WUFDVixnQkFBZ0I7WUFDaEIsV0FBVztZQUNYLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsZ0JBQWdCO1lBQ2hCLFNBQVM7WUFDVCxnQkFBZ0I7WUFDaEIscUJBQXFCO1NBQ3RCO1FBQ0QsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtLQUMzQixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUE7SUFFM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUV0QyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FB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