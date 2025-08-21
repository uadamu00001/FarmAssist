Notification Scheduler Module

This standalone Nest module provides a simple in-memory scheduler for sending notifications (email or SMS).

How to run (development):

Run the module directly with ts-node (dev dependency exists in this repo):

npm run start:notifications:dev

How to run (after build):

1. npm run build
2. npm run start:notifications

Environment variables (optional):
- NOTIFICATION_PORT: port to listen on (default 4501)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM: to enable real email sending via SMTP
- SMS_PROVIDER/TWILIO_*: if you add a real SMS provider implementation

API Endpoints:
- GET /notifications -- list notifications
- POST /notifications -- schedule a new notification (body matches DTO in src/dto)
- GET /notifications/:id -- get single notification
- DELETE /notifications/:id -- cancel scheduled notification
