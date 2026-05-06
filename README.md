# 🚀 Campus Notification & Vehicle Maintenance System

## 📌 Overview

This project is part of a multi-stage backend evaluation where the goal was to design and implement a scalable, production-ready system covering:

- Logging Middleware  
- API Design  
- Database Design  
- Query Optimization  
- System Scalability  
- Distributed System Architecture  
- Priority-Based Notification Engine  
- Algorithmic Optimization (Knapsack + Top-K)  

The solution demonstrates real-world backend engineering practices including API integration, system design, performance optimization, and scalable architecture.

---

# 🧩 Project Components

## 1️⃣ Logging Middleware

- Built a reusable logging utility:
  Log(stack, level, package, message)
- Sends logs to external API  
- Used across all modules for observability  
- Structured logs for debugging and monitoring  

---

## 2️⃣ Vehicle Maintenance Scheduler

### 📊 Problem
Optimize vehicle servicing tasks based on:
- Duration (time constraint)  
- Impact (importance score)  

### 🧠 Approach
- Implemented 0/1 Knapsack Algorithm  
- Maximizes total impact within available mechanic hours  

### ⚙️ Features
- Fetch data from external APIs  
- Process multiple depots  
- Return:
  - Max Impact  
  - Selected Task IDs  

### 🧮 Complexity
- Time: O(n × capacity)  
- Space: O(n × capacity)  

---

## 3️⃣ Notification System Design (Stage 1–5)

### ✅ Stage 1 — API Design
- Designed REST APIs for:
  - Send notification  
  - Get notifications  
  - Mark as read  
  - Delete notification  
- Added WebSocket-based real-time system  

---

### ✅ Stage 2 — Database Design
- Selected MongoDB (NoSQL) for scalability  
- Designed schema and indexing strategy  
- Handles high write throughput and flexible schema  

---

### ✅ Stage 3 — Query Optimization
- Identified slow SQL query  
- Applied composite indexing  
- Improved complexity from O(n log n) → O(log n)  
- Avoided unnecessary indexes  

---

### ✅ Stage 4 — Scalability Improvements
Implemented:
- Redis caching  
- Pagination  
- WebSockets (real-time updates)  
- Message queues (Kafka / RabbitMQ)  
- Read replicas & partitioning  

---

### ✅ Stage 5 — Distributed System Design
Replaced synchronous processing with event-driven architecture:

- Queue-based processing  
- Retry mechanism  
- Dead Letter Queue (DLQ)  
- Parallel execution  

---

## 4️⃣ Priority Notification System (Stage 6)

### 📊 Problem
Display Top K (10) notifications based on:
- Priority (Type)  
- Recency (Timestamp)  

---

### 🧠 Approach

Priority Weights:
- Placement → 3  
- Result → 2  
- Event → 1  

Score Formula:
score = weight × large_constant + timestamp

---

### ⚙️ Implementation
- Fetch notifications via API  
- Compute score  
- Sort and return Top 10 notifications  

---

### 🚀 Optimization
- Current: Sorting → O(n log n)  
- Improved: Min Heap → O(n log k)  

---

### 🔄 Real-Time Handling
- Maintain Top-K dynamically  
- Replace lowest priority when new notification arrives  

---

# 🏗️ System Architecture

Client  
↓  
Server (Express)  
↓  
Logging Middleware  
↓  
Scheduler / Notification Engine  
↓  
External APIs (Depots, Vehicles, Notifications)  
↓  
Optimization Logic (Knapsack / Top-K)  
↓  
Output  

---

# ⚙️ Technologies Used

- Node.js  
- Express.js  
- Axios  
- MongoDB (Design)  
- Redis (Conceptual)  
- Kafka / RabbitMQ (Conceptual)  
- JavaScript  

---

# 📈 Key Highlights

- API Integration with protected routes  
- Centralized Logging System  
- Knapsack Algorithm Implementation  
- Top-K Priority Optimization  
- Database Design & Indexing  
- Query Optimization  
- Distributed System Design  
- Scalable Architecture  

---

# 📸 Output Screenshots

## ✅ Logging Middleware API

Demonstrates successful API logging with request body, response, and response time.

<img width="942" height="642" alt="Postman_5tBkWjaf2R" src="https://github.com/user-attachments/assets/141501e5-0b8a-4f45-b433-bacf73bbf14c" />

---

## ✅ Priority Notification System Output

Displays top priority notifications based on weighted scoring and recency.

<img width="893" height="482" alt="Code_i8OxeTJe2L" src="https://github.com/user-attachments/assets/40bbea77-4dfa-45b4-89b5-0999530d8275" />

---

## ✅ Vehicle Maintenance Scheduler Output

Shows optimized task selection and maximum impact calculation for depots using the Knapsack algorithm.

<img width="778" height="403" alt="Code_1Kqyv87EIu" src="https://github.com/user-attachments/assets/415e0dda-a4b7-4f9a-b545-07b8c48fca55" />


---

# 🧠 Learnings

- Designing systems for scale and performance  
- Importance of indexing and query optimization  
- Using event-driven architecture for reliability  
- Combining DSA + System Design in real-world problems  
- Building production-ready backend services  

---

# 🏁 Conclusion

This project demonstrates a complete backend system involving:

- Real-world API integration  
- Scalable system design  
- Algorithmic problem solving  
- Performance optimization  
- Distributed system architecture  

It reflects strong understanding of backend engineering principles used in modern production systems.

---

# 👨‍💻 Author

Kanwalpreet Singh  

---

# 📌 Note

This project was built as part of a backend evaluation and showcases both implementation and system design capabilities.
