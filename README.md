# ⛈️ Weatherly: National Weather Big Data Analytics Platform

**Weatherly** is an enterprise-grade, distributed big data analytics platform designed to bridge the **"Last-Mile Visual Blindspot"** in national weather monitoring. While macro-level satellites and radars track large storm systems from space, they often miss street-level structural impacts like localized flash floods, waterlogged roads, or fallen power lines. 

Our platform continuously monitors public internet channels and social media streams for posts tagged with `#IMD` and relevant weather hashtags. It runs this chaotic streaming data through a robust **Multi-Stage AI Validation Pipeline** to filter out fake news, remove duplicate entries, analyze multi-lingual text, and display verified, actionable intelligence on a real-time command dashboard for emergency dispatchers.

---

## ✨ Core Features & Innovations

### 🛡️ 1. Multi-Stage AI Truth-Filter (Anti-Fake News)
*   **Perceptual Hashing (pHash):** Generates a distinct visual fingerprint for uploaded photos and cross-checks them against a fast vector index of historical Indian disaster news. If a user uploads a recycled video or image from an old cyclone, the system flags it as `RECYCLED_MEDIA` and isolates it.
*   **Sarcasm & Sentiment Detection:** Built on fine-tuned **IndicBERT**, the text engine detects emotional tones and sarcasm (e.g., *"Wow, great job IMD, my car is now a boat outside my house 🛶"*), preventing ironic or misleading posts from triggering false alarms.

### 🗺️ 2. Cross-Modal Geospatial Deduplication (DBSCAN)
*   When hundreds of citizens report the exact same waterlogged intersection or broken bridge within a tight time window, our backend applies the **DBSCAN Clustering Algorithm**. It automatically collapses duplicate reports into a singular **Parent Emergency Pin** with an elevated confidence rating, keeping the map interface clean and readable.

### 🔌 3. Ground-Truth Hardware Cross-Validation
*   Once a high-risk citizen report passes text and image filters, the system triggers an automated API call to the nearest physical **Automatic Weather Station (AWS)**. If a post claims a "destructive storm" is active, but local physical hardware reports clear skies and low wind speed, the AI flags a `Data Anomaly Conflict` for admin review.

### 🎛️ 4. Enterprise Administrative Dashboard
*   Built with **Next.js** and **Mapbox GL**, providing a responsive war-room control panel.
*   Supports three-dimensional filtering concurrently: **Date-wise**, **IMD Event-wise**, and **Location-wise** (State/District/Block level).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend & Mapping** | Next.js (React), Tailwind CSS, Mapbox GL / Leaflet.js |
| **Backend & APIs** | Python, FastAPI, WebSockets |
| **Ingestion & Streaming** | Apache Kafka |
| **AI / ML Pipeline** | PyTorch, IndicBERT, ImageHash (pHash), Scikit-Learn (DBSCAN) |
| **Database & GIS** | PostgreSQL with PostGIS extension |
| **Infrastructure** | Docker |
