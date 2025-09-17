"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
(0, utils_1.loadEnv)(process.env.NODE_ENV || 'development', process.cwd());
module.exports = (0, utils_1.defineConfig)({
    projectConfig: {
        databaseUrl: process.env.DATABASE_URL,
        databaseDriverOptions: {
            ssl: { rejectUnauthorized: false }, // allows self-signed certs in dev
        },
        redisUrl: process.env.REDIS_URL,
        http: {
            storeCors: process.env.STORE_CORS,
            adminCors: process.env.ADMIN_CORS,
            authCors: process.env.AUTH_CORS,
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
                            file_url: process.env.S3_FILE_URL,
                            access_key_id: process.env.S3_ACCESS_KEY_ID,
                            secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                            region: process.env.S3_REGION,
                            bucket: process.env.S3_BUCKET,
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
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkdXNhLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL21lZHVzYS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxREFBaUU7QUFFakUsSUFBQSxlQUFPLEVBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLElBQUksYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0FBRTdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBQSxvQkFBWSxFQUFDO0lBQzVCLGFBQWEsRUFBRTtRQUNiLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVk7UUFDckMscUJBQXFCLEVBQUU7WUFDckIsR0FBRyxFQUFFLEVBQUUsa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEVBQUUsa0NBQWtDO1NBQ3ZFO1FBQ0QsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUztRQUMvQixJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFXO1lBQ2xDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVc7WUFDbEMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTtZQUNoQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksYUFBYTtZQUNsRCxZQUFZLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLElBQUksYUFBYTtTQUN6RDtLQUNGO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsSUFBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDZixNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUN0RCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUDtZQUNFLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsbUJBQW1CO3dCQUM1QixFQUFFLEVBQUUsSUFBSTt3QkFDUixPQUFPLEVBQUU7NEJBQ1AsUUFBUSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBWTs0QkFDbEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWlCOzRCQUM1QyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFxQjs0QkFDcEQsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTs0QkFDOUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBVTt5QkFDL0I7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0Q7WUFDRSxPQUFPLEVBQUUsMEJBQTBCO1lBQ25DLE9BQU8sRUFBRTtnQkFDUCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsT0FBTyxFQUFFLDZEQUE2RDt3QkFDdEUsRUFBRSxFQUFFLFVBQVU7d0JBQ2QsT0FBTyxFQUFFOzRCQUNQLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7NEJBQy9CLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWU7NEJBQ3ZDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCOzRCQUM5QyxjQUFjLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUI7NEJBQ25ELHVCQUF1QixFQUFFLEVBQUUsRUFBRSw4QkFBOEI7NEJBQzNELG9CQUFvQixFQUFFLEVBQUU7NEJBQ3hCLFlBQVksRUFBRSxRQUFRO3lCQUN2QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFDRDtZQUNFLE9BQU8sRUFBRSwrQkFBK0I7WUFDeEMsT0FBTyxFQUFFO2dCQUNQLFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxPQUFPLEVBQUUsb0JBQW9CO3dCQUM3QixFQUFFLEVBQUUsbUJBQW1CO3dCQUN2QixPQUFPLEVBQUU7NEJBQ1AsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDOzRCQUNuQixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTOzRCQUMzQixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTOzRCQUMzQixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjOzRCQUNoQyxJQUFJLEVBQUUsR0FBRzs0QkFDVCxNQUFNLEVBQUUsSUFBSTs0QkFDWixJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjO3lCQUNqQztxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQSJ9