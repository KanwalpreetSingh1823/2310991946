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

---

# 📌 Stage 2 — Database Design & Storage Strategy

## 🧠 Objective
Design a reliable and scalable database system to store notifications based on the APIs defined in Stage 1.

---

## 🗄️ Database Choice

### ✅ Selected: NoSQL (MongoDB)

### 🔍 Why MongoDB?
- Flexible schema (notifications may evolve)
- High write throughput (real-time notifications)
- Easy horizontal scaling (sharding)
- JSON-like structure matches API response

---

## 🧱 Collection: notifications

### Schema

{
  "_id": "ObjectId",
  "userId": "string",
  "title": "string",
  "message": "string",
  "type": "placement | event | result",
  "priority": "low | medium | high",
  "isRead": false,
  "createdAt": "ISODate"
}

---

## 📌 Indexing Strategy

To optimize performance:

- Index on userId → fast retrieval of user notifications  
- Index on createdAt → sorting recent notifications  
- Compound index: (userId, isRead) → filter unread notifications  

---

## 🔍 Sample Queries

### 1. Insert Notification

db.notifications.insertOne({
  userId: "123",
  title: "New Job Opportunity",
  message: "Amazon is hiring SDEs",
  type: "placement",
  priority: "high",
  isRead: false,
  createdAt: new Date()
})

---

### 2. Get Notifications for User

db.notifications.find({ userId: "123" }).sort({ createdAt: -1 })

---

### 3. Mark as Read

db.notifications.updateOne(
  { _id: ObjectId("abc123") },
  { $set: { isRead: true } }
)

---

### 4. Delete Notification

db.notifications.deleteOne({ _id: ObjectId("abc123") })

---

## ⚠️ Challenges with Large Data

### 1. High Write Volume
- Many notifications generated in real-time

### 2. Large Data Size
- Millions of notifications stored

### 3. Slow Queries
- Fetching user-specific data may become slow

---

## 🚀 Solutions

### ✅ 1. Indexing
Improves read performance significantly

### ✅ 2. Sharding
Distribute data across multiple servers based on userId

### ✅ 3. Pagination
Fetch limited notifications instead of all

Example:
db.notifications.find({ userId: "123" }).limit(20)

### ✅ 4. TTL (Time-To-Live Index)
Automatically delete old notifications

Example:
db.notifications.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
)

(Deletes after 30 days)

---

## ⚡ Scalability Strategy

- Horizontal scaling using MongoDB shards  
- Load balancing for API requests  
- Caching frequently accessed data (Redis optional)  

---

## 🏁 Conclusion

This database design ensures:
- High scalability  
- Efficient read/write operations  
- Real-time notification handling  
- Optimized performance with indexing and sharding


---

# 📌 Stage 3 — Query Optimization & Indexing Strategy

## 🧠 Objective
Analyze the performance of an existing SQL query, identify bottlenecks, and propose optimizations for large-scale data.

---

## 🔍 Given Query

SELECT * FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC;

---

## ❗ Is this query accurate?

Yes, functionally the query is correct because:
- It fetches unread notifications for a specific student
- It sorts them by latest notifications

However, it is **not optimized for large-scale data**.

---

## ⚠️ Why is this query slow?

### 1. Full Table Scan
Without proper indexing, the database scans the entire table (millions of rows).

### 2. Sorting Cost (ORDER BY)
Sorting large datasets without index support is expensive.

### 3. High Data Volume
- 50,000 students
- 5,000,000 notifications  
→ Leads to heavy I/O operations

---

## ❌ Should we add index on every column?

No — this is a bad practice.

### Why?
- Increases write cost (INSERT/UPDATE become slower)
- Consumes more storage
- Indexes may not be used effectively

👉 We should create **targeted indexes based on query patterns**

---

## ✅ Optimized Index Strategy

### Best Index (Composite Index)

CREATE INDEX idx_notifications_user_read_created
ON notifications (studentID, isRead, createdAt DESC);

---

## 💡 Why this works

- Filters using studentID → fast lookup  
- Filters using isRead → reduces dataset  
- Uses createdAt → avoids extra sorting  

👉 This makes query execution much faster

---

## ⚡ Optimized Query (Best Practice)

SELECT id, title, message, type, createdAt
FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt DESC
LIMIT 20;

---

## 🚀 Improvements

- Avoid SELECT * → fetch only required columns  
- Use LIMIT → prevents large data transfer  
- Index eliminates full table scan  

---

## 📊 Time Complexity (Before vs After)

| Case | Complexity |
|------|----------|
| Without Index | O(n log n) |
| With Index | O(log n) |

---

## 🔍 Additional Query Requirement

### Find students who received "placement" notifications in last 7 days

SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= NOW() - INTERVAL 7 DAY;

---

## 📌 Index for this Query

CREATE INDEX idx_type_date
ON notifications (notificationType, createdAt);

---

## ⚡ Further Optimization Ideas

### 1. Pagination
Use OFFSET or cursor-based pagination

### 2. Partitioning
Partition table by date (e.g., monthly)

### 3. Archiving
Move old notifications to cold storage

### 4. Caching
Use Redis for frequently accessed notifications

---

## 🏁 Conclusion

- Original query is correct but inefficient  
- Proper indexing drastically improves performance  
- Avoid unnecessary indexes  
- Use pagination and filtering for scalability  
