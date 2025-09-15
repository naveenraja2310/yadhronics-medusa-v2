import nodemailer from "nodemailer"

export default async function handler(payload) {
    const eventName = payload.event?.name
    const eventData = payload.event?.data

    if (eventName !== "invite.created") return

    const inviteId = eventData.id
    const userService = payload.container.resolve("user")
    const invite = await userService.retrieveInvite(inviteId)

    if (!invite || !invite.token) {
        console.error("Could not load invite or missing token")
        return
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_AUTH_USER,
            pass: process.env.SMTP_AUTH_PASS,
        },
    })

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
            <h2 style="color: #4CAF50;">You're invited!</h2>
            <p>Hello,</p>
            <p>You have been invited to join <strong>Yadhronics Admin</strong>.</p>
            <p>
                Click the button below to accept the invite:
            </p>
            <a href="${process.env.MEDUSA_BACKEND_URL}/app/invite?token=${invite.token}" 
                style="display:inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Accept Invite
            </a>
            <p>Thanks,<br/>Yadhronics Team</p>
        </div>
    `

    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: invite.email,
        subject: "You have been invited to Yadhronics Admin!",
        html: htmlContent,
    })
}

export const config = {
    event: "invite.created",
}
