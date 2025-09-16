"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = inviteCreatedHandler;
async function inviteCreatedHandler({ event: { data }, container, }) {
    const query = container.resolve("query");
    const notificationModuleService = container.resolve("notification");
    // fetch invite details
    const { data: [invite] } = await query.graph({
        entity: "invite",
        fields: ["email", "token"],
        filters: { id: data.id },
    });
    if (!invite) {
        console.error("Invite not found");
        return;
    }
    // resolve backend url
    const backend_url = process.env.MEDUSA_ADMIN_BACKEND_URL;
    const adminPath = "/app";
    // construct HTML content
    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">You're invited!</h2>
      <p>Hello,</p>
      <p>You have been invited to join <strong>Yadhronics Admin</strong>.</p>
      <p>
        Click the button below to accept the invite:
      </p>
      <a href="${backend_url}${adminPath}/invite?token=${invite.token}" 
        style="display:inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Accept Invite
      </a>
      <p>Thanks,<br/>Yadhronics Team</p>
    </div>
  `;
    // send email via notification module
    await notificationModuleService.createNotifications({
        to: invite.email,
        channel: "email",
        content: {
            subject: "You have been invited to Yadhronics Admin",
            text: "",
            html: htmlContent,
        },
        template: "",
    });
}
exports.config = {
    event: ["invite.created", "invite.resent"],
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1pbnZpdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL3VzZXItaW52aXRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSx1Q0FzREM7QUF0RGMsS0FBSyxVQUFVLG9CQUFvQixDQUFDLEVBQ2pELEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxFQUNmLFNBQVMsR0FHVDtJQUNBLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDeEMsTUFBTSx5QkFBeUIsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBRW5FLHVCQUF1QjtJQUN2QixNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxFQUFFLFFBQVE7UUFDaEIsTUFBTSxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztRQUMxQixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRTtLQUN6QixDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7UUFDakMsT0FBTTtJQUNSLENBQUM7SUFFRCxzQkFBc0I7SUFDdEIsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3QkFBd0IsQ0FBQTtJQUV4RCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUE7SUFFeEIseUJBQXlCO0lBQ3pCLE1BQU0sV0FBVyxHQUFHOzs7Ozs7OztpQkFRTCxXQUFXLEdBQUcsU0FBUyxpQkFBaUIsTUFBTSxDQUFDLEtBQUs7Ozs7OztHQU1sRSxDQUFBO0lBRUQscUNBQXFDO0lBQ3JDLE1BQU0seUJBQXlCLENBQUMsbUJBQW1CLENBQUM7UUFDbEQsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLO1FBQ2hCLE9BQU8sRUFBRSxPQUFPO1FBQ2hCLE9BQU8sRUFBRTtZQUNQLE9BQU8sRUFBRSwyQ0FBMkM7WUFDcEQsSUFBSSxFQUFFLEVBQUU7WUFDUixJQUFJLEVBQUUsV0FBVztTQUNsQjtRQUNELFFBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQUVZLFFBQUEsTUFBTSxHQUFxQjtJQUN0QyxLQUFLLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUM7Q0FDM0MsQ0FBQSJ9