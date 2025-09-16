import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"

export default async function inviteCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{
  id: string
}>) {
  const query = container.resolve("query")
  const notificationModuleService = container.resolve("notification")

  // fetch invite details
  const { data: [invite] } = await query.graph({
    entity: "invite",
    fields: ["email", "token"],
    filters: { id: data.id },
  })

  if (!invite) {
    console.error("Invite not found")
    return
  }

  // resolve backend url
  const backend_url = process.env.MEDUSA_ADMIN_BACKEND_URL

  const adminPath = "/app"

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
  `

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
  })
}

export const config: SubscriberConfig = {
  event: ["invite.created", "invite.resent"],
}
