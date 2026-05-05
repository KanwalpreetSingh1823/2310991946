# 📌 Stage 1 — Notification System API Design

## 🧠 Objective
Design REST APIs for a campus notification system that delivers real-time updates (placements, events, results) to students.

---

## 🏗️ Core Features
- Send notifications
- Fetch notifications for a user
- Mark notification as read
- Delete notification
- Real-time notification delivery

---

## 🔗 Base URL
/api/v1/notifications

---

## 📬 1. Send Notification

### Endpoint
POST /api/v1/notifications

### Request Body
{
  "userId": "123",
  "type": "placement",
  "title": "New Job Opportunity",
  "message": "Amazon is hiring SDEs",
  "priority": "high"
}

### Response
{
  "success": true,
  "notificationId": "abc123",
  "createdAt": "2026-05-05T10:00:00Z"
}

### Headers
Authorization: Bearer <token>  
Content-Type: application/json  

---

## 📥 2. Get Notifications

### Endpoint
GET /api/v1/notifications?userId=123

### Response
{
  "notifications": [
    {
      "id": "abc123",
      "title": "New Job Opportunity",
      "message": "Amazon is hiring SDEs",
      "type": "placement",
      "isRead": false,
      "createdAt": "2026-05-05T10:00:00Z"
    }
  ]
}

---

## ✅ 3. Mark as Read

### Endpoint
PATCH /api/v1/notifications/:id/read

### Response
{
  "success": true,
  "message": "Notification marked as read"
}

---

## ❌ 4. Delete Notification

### Endpoint
DELETE /api/v1/notifications/:id

### Response
{
  "success": true,
  "message": "Notification deleted"
}

---

## ⚡ Real-Time Notification Design

We use WebSockets for real-time updates.

### Flow:
1. Client connects via WebSocket  
2. Server maintains user connection  
3. When a notification is created → push instantly to user  

### Example Event:
{
  "event": "NEW_NOTIFICATION",
  "data": {
    "title": "Exam Result Declared",
    "message": "Check your result now"
  }
}

---

## 🧱 Data Model (Schema)

{
  "id": "string",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "placement | event | result",
  "priority": "low | medium | high",
  "isRead": "boolean",
  "createdAt": "timestamp"
}

---

## 🛡️ Error Handling

{
  "error": "Invalid request",
  "code": 400
}

---

## 🧩 Design Considerations

- Scalable for large number of users  
- Supports real-time delivery  
- Uses REST + WebSocket hybrid  
- Clean and consistent API naming  
- Extensible for future notification types  

---

## 🏁 Conclusion

This design ensures:
- Efficient notification delivery  
- Real-time updates  
- Scalable and maintainable architecture  
