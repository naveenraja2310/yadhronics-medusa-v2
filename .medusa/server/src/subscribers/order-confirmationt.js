"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
async function orderPlacedHandler({ event: { data }, container, }) {
    const notificationModuleService = container.resolve("notification");
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
    if (!order || !order.customer?.email) {
        console.error("Order or customer email not found");
        return;
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItY29uZmlybWF0aW9udC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zdWJzY3JpYmVycy9vcmRlci1jb25maXJtYXRpb250LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFDQTBHQztBQTFHYyxLQUFLLFVBQVUsa0JBQWtCLENBQUMsRUFDL0MsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQ2YsU0FBUyxHQUdUO0lBQ0EsTUFBTSx5QkFBeUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRW5FLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUE7SUFFdkIsNkJBQTZCO0lBQzdCLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFcEQsTUFBTSxLQUFLLEdBQUcsV0FBVyxDQUFDO1FBQ3hCLFVBQVUsRUFBRSxPQUFPO1FBQ25CLE1BQU0sRUFBRTtZQUNOLElBQUk7WUFDSixZQUFZO1lBQ1osT0FBTztZQUNQLFVBQVU7WUFDVixnQkFBZ0I7WUFDaEIsV0FBVztZQUNYLGdCQUFnQjtZQUNoQixlQUFlO1lBQ2YsZ0JBQWdCO1lBQ2hCLFNBQVM7WUFDVCxnQkFBZ0I7WUFDaEIscUJBQXFCO1NBQ3RCO1FBQ0QsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtLQUMzQixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxLQUFLLENBQUE7SUFFM0IsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1FBQ2xELE9BQU07SUFDUixDQUFDO0lBRUQsWUFBWTtJQUNaLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBUSxFQUFFLFFBQVEsR0FBRyxL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