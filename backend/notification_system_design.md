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

---

# 📌 Stage 4 — Performance Optimization & Scalability Strategy

## 🧠 Objective
Improve system performance by reducing database load caused by frequent notification fetching on every page load.

---

## ⚠️ Problem Statement

- Notifications are fetched on every page load
- Database is getting overwhelmed
- Increased latency and poor user experience

---

## 🚀 Proposed Solutions

---

## ✅ 1. Caching (Redis)

### Approach:
- Store user notifications in Redis cache
- On request:
  - Check cache first
  - If cache miss → fetch from DB → update cache

### Flow:
1. User requests notifications  
2. Check Redis  
3. If exists → return instantly  
4. Else → fetch from DB → store in Redis → return  

### Benefits:
- Reduces DB load significantly  
- Faster response time  

### Trade-offs:
- Cache invalidation complexity  
- Slight memory overhead  

---

## ✅ 2. Pagination (Lazy Loading)

### Approach:
- Do not fetch all notifications at once
- Fetch limited data (e.g., 20 per request)

### Example:
GET /notifications?userId=123&page=1&limit=20

### Benefits:
- Reduces DB query size  
- Improves response time  

### Trade-offs:
- Multiple API calls required  
- Slight increase in client-side logic  

---

## ✅ 3. Push-Based Notifications (WebSockets)

### Approach:
- Instead of polling, push notifications in real-time

### Flow:
1. Client opens WebSocket connection  
2. Server pushes new notifications instantly  

### Benefits:
- Eliminates repeated API calls  
- Real-time user experience  

### Trade-offs:
- More complex implementation  
- Requires connection management  

---

## ✅ 4. Background Processing (Queue System)

### Approach:
- Use message queue (Kafka / RabbitMQ)
- Process notification creation asynchronously

### Flow:
1. Event occurs  
2. Push to queue  
3. Worker processes and stores notification  

### Benefits:
- Reduces load on main application  
- Improves system reliability  

### Trade-offs:
- Increased system complexity  
- Requires queue infrastructure  

---

## ✅ 5. Database Optimization

- Use proper indexing (from Stage 3)  
- Use read replicas for scaling reads  
- Partition large tables  

### Benefits:
- Faster query performance  
- Scalable database architecture  

---

## ✅ 6. Notification Aggregation

### Approach:
- Combine multiple notifications into one

### Example:
Instead of:
- "Amazon hiring"
- "Google hiring"

Show:
- "2 new placement notifications"

### Benefits:
- Reduces number of records  
- Better user experience  

### Trade-offs:
- Slight loss of granularity  

---

## ⚡ Recommended Final Architecture

- Redis → caching layer  
- WebSockets → real-time updates  
- Queue (Kafka/RabbitMQ) → async processing  
- Database → persistent storage  

---

## 🏁 Conclusion

To improve performance:
- Use caching to reduce DB load  
- Implement pagination to limit data  
- Use WebSockets for real-time updates  
- Introduce queues for asynchronous processing  

This ensures:
- High scalability  
- Low latency  
- Better user experience

---

# 📌 Stage 5 — Reliable & Scalable Notification Delivery

## 🧠 Objective
Redesign the notification system to handle bulk delivery (50,000 users) reliably and efficiently, avoiding failures and performance bottlenecks.

---

## ❗ Problems in Given Implementation

### 1. Sequential Processing
- Loop processes one user at a time → very slow

### 2. No Fault Tolerance
- If email fails midway → system breaks
- No retry mechanism

### 3. Tight Coupling
- Email + DB + Push are tightly linked
- Failure in one affects others

### 4. No Scalability
- Cannot handle large volume (50,000 users)

---

## ⚠️ Scenario: Email Failed for 200 Users

Problem:
- 49,800 users succeeded
- 200 users missed notifications

👉 Current system has **no retry or recovery mechanism**

---

## 🚀 Proposed Solution — Event-Driven Architecture

### 🔑 Key Idea:
Decouple the system using **message queues (Kafka / RabbitMQ)**

---

## 🏗️ New Flow

1. HR triggers "Notify All"
2. System pushes events to queue
3. Workers process notifications asynchronously:
   - Email Service
   - DB Service
   - Push Notification Service

---

## ✅ Revised Pseudocode

function notify_all(student_ids, message):
    for student_id in student_ids:
        publish_to_queue({
            "studentId": student_id,
            "message": message
        })

---

## 🧩 Worker Processing

### Email Worker

function process_email(event):
    try:
        send_email(event.studentId, event.message)
    except:
        retry(event)

---

### DB Worker

function process_db(event):
    save_to_db(event.studentId, event.message)

---

### Push Worker

function process_push(event):
    push_to_app(event.studentId, event.message)

---

## 🔁 Retry Mechanism

- Failed jobs are retried automatically
- Use exponential backoff

Example:
- Retry after 1s → 5s → 30s

---

## 💡 Should DB Save and Email Happen Together?

❌ No (bad practice)

### Why?
- If email fails → DB insert also fails (data loss)
- Tight coupling reduces reliability

### ✅ Correct Approach:
- Handle each operation independently
- Use eventual consistency

---

## ⚡ Additional Improvements

### 1. Batch Processing
Process users in batches (e.g., 1000 at a time)

### 2. Idempotency
Avoid duplicate notifications using unique IDs

### 3. Dead Letter Queue (DLQ)
Store permanently failed messages for analysis

### 4. Monitoring
Track failures using logs and alerts

---

## 📊 Benefits of New Design

- Highly scalable (handles 50,000+ users)
- Fault-tolerant (failures are retried)
- Faster processing (parallel workers)
- Loose coupling between services

---

## 🏁 Conclusion

The redesigned system:
- Uses asynchronous processing  
- Ensures reliability with retries  
- Improves performance with parallel execution  
- Prevents data loss using decoupled architecture  

This approach is production-ready and suitable for large-scale systems.
