import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  admin: {
    vite: (config) => {
      config.server = config.server || {};
      config.server.allowedHosts = ['admin.yadhronics.com'];
      return config;
    },
  },
  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL!,           
              access_key_id: process.env.S3_ACCESS_KEY_ID!,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY!,
              region: process.env.S3_REGION!,
              bucket: process.env.S3_BUCKET!,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          {
            resolve: "@tsc_tech/medusa-plugin-razorpay-payment/providers/razorpay",
            id: "razorpay",
            options: {
              key_id: process.env.RAZORPAY_ID,
              key_secret: process.env.RAZORPAY_SECRET,
              razorpay_account: process.env.RAZORPAY_ACCOUNT,
              webhook_secret: process.env.RAZORPAY_WEBHOOK_SECRET,
              automatic_expiry_period: 30, // 12 min – 30 days in minutes
              manual_expiry_period: 20,
              refund_speed: "normal",
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/notification",
      options: {
        providers: [
          {
            resolve: "medusa-module-smtp",
            id: "notification-smtp",
            options: {
              channels: ["email"],
              from: process.env.SMTP_FROM,
              host: process.env.SMTP_HOST,
              pass: process.env.SMTP_AUTH_PASS,
              port: 465,
              secure: true,
              user: process.env.SMTP_AUTH_USER,
            },
          },
        ],
      },
    },
  ],
})