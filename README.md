# Mini CRM Platform  

A lightweight **Customer Relationship Management (CRM) platform** that allows businesses to ingest customer data, build audience segments, and launch personalized campaigns.  

Built with **React (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)**.  

---

## 🚀 Features  

- **Google OAuth login** (secure authentication)  
- **Customer ingestion** with attributes like spend, visits, and last order date  
- **Segment builder** (rule-based audience targeting)  
- **Campaign creation** with personalized templates (`{name}`, `{spend}`)  
- **Simulated vendor API** for campaign delivery (90% success / 10% failure)  
- **Delivery receipts & logging** (sent vs failed)  
- **Dashboard** with campaign statistics and progress visualization  
- **AI Integration**:  
  - Converts **natural language prompts into segmentation rules** (via LLM)  
  - Suggests **message variants** for campaigns  

---

## 🛠 Tech Stack  

- **Frontend**: React 18, React Router, Vite, TailwindCSS, Font Awesome  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose ODM  
- **Auth**: Google OAuth 2.0  
- **Optional Simulation**: Vendor API for delivery + receipts  
- **AI Tools**:  
  - LLM API (for **message suggestions** + **natural language → rules**)  

---

## ⚙️ Local Setup  

### Prerequisites  
- Node.js >= 18  
- MongoDB (local or Atlas)  
- Git  

### Steps  

1. **Clone repo**
   ```bash
   git clone https://github.com/Atharvagharge/Mini--CRM-Platform.git
   cd Mini--CRM-Platform
   ```

2. **Backend setup**  
   ```bash
   cd backend
   npm install
   ```
   Create `.env`:
   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/mini-crm
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   BACKEND_URL=http://localhost:5000
   FRONTEND_URL=http://localhost:3000
   SESSION_SECRET=supersecret
   ```
   Run backend:
   ```bash
   npm start
   ```
   Seeds DB with sample customers:
   ```bash
   node seed.js
   ```

3. **Frontend setup**  
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open: [http://localhost:3000](http://localhost:3000)

---

## 🏗 Architecture  

```plaintext
                ┌───────────────────────────┐
                │         Frontend          │
                │ React + Vite + Tailwind   │
                │  - Login (Google OAuth)   │
                │  - Dashboard              │
                │  - Campaign Builder       │
                └───────────┬──────────────┘
                            │ REST API calls
                            ▼
                ┌───────────────────────────┐
                │         Backend           │
                │ Node.js + Express         │
                │  - Auth routes            │
                │  - Segment builder        │
                │  - Campaign creation      │
                │  - Vendor simulation API  │
                └───────────┬──────────────┘
                            │ Mongoose queries
                            ▼
                ┌───────────────────────────┐
                │         Database          │
                │     MongoDB Atlas / Local │
                │  - Customers              │
                │  - Segments               │
                │  - Campaigns              │
                │  - Communication Logs     │
                └───────────────────────────┘
```

---

## 🤖 AI Features  


- **Message Suggestions**:  
  AI generates campaign text variations (e.g., promotional, win-back, discount-focused).  

---

## ⚠️ Known Limitations  

- Campaign delivery uses a **simulated vendor API** (not real email/SMS provider).  
- No **real-time push updates** (dashboard requires refresh).  
- AI features rely on **external APIs** (mocked in demo).  
- No advanced error handling (e.g., retry queues, Kafka, or batching).  
- Deployment tested only on **local + basic hosting**.  

---

## 📹 Demo Video  

👉 [Upload Loom/YouTube link here after recording your demo]  

---

## 📦 Submission Checklist  

- [x] Public GitHub repo  
- [x] Local setup guide  
- [x] Architecture diagram  
- [x] AI integration summary  
- [ ] Demo video (to be recorded)  
