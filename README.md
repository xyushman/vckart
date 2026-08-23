# VCKart: The Future of Conversational Commerce

[![Deployed on Vercel](https://vercelbutton.com/api/button.svg)](https://vckart-gamma.vercel.app/)

Hey there! 👋 Welcome to VCKart. We're incredibly excited you're here. 

**[🚀 Try the Live Demo here!](https://vckart-gamma.vercel.app/)** *(You can easily test the app using the "Continue as Guest" button—no account required!)*

VCKart isn't just another shopping app or a basic digital grocery list. We built this platform because we believe the way we shop online is broken. Think about it—when you walk into a real store, you don't scroll through endless grids of data. You find an assistant and say, *"Hey, I'm looking for a black cotton shirt under 1,500 rupees."* 

**That natural, human interaction is exactly what VCKart brings to the digital world.**

---

## 🌟 Our Vision & Motive
**Our mission is to make shopping feel conversational, intelligent, and deeply personal.**

We noticed that traditional e-commerce platforms force users to do all the heavy lifting: typing out queries, ticking tiny filter checkboxes, and navigating through dozens of nested category menus. It's exhausting. 

Our motive was simple: **What if you could just *talk* to your shopping app like a human being?** 

We envisioned a world where your device actually listens to you, understands your intent, remembers the context of your conversation, and does the hard work of searching and filtering for you. Whether you're buying weekly groceries, searching for electronics, or picking out clothes, VCKart is designed to be your personal, AI-powered shopping concierge.

---

## ✨ Features That Feel Like Magic

We've packed VCKart with features designed to make your life easier, all wrapped in a gorgeous, premium dark-mode interface.

### 🎙️ Two-Way Conversational Voice UI
Just tap the mic and speak naturally!
- **Multi-Turn Memory:** If you say *"I need sugar"*, and then follow up with *"Under 250 rupees"*, VCKart remembers you are still talking about sugar.
- **Native Text-to-Speech:** VCKart literally speaks back to you, telling you how many options it found so you don't even have to look at the screen!

### 🧠 Deep Multi-Intent Parsing
You don't have to talk like a robot. Say complex things like:
> *"Add two bottles of organic milk, remove the apples, and find me the cheapest brown sugar you have."*

VCKart's brain (powered by Google Gemini AI) will instantly unpack that sentence into distinct actions and execute them simultaneously. 

### 🌍 Speak Your Native Language
Shop in English, Hindi, Spanish, or whatever you prefer! VCKart automatically detects your language, translates your intent, and even speaks back to you in that exact same language.

### 💡 Smart Substitutes & Seasonal Picks
If you ask for an item that is out of season or out of stock, our AI doesn't just give you a dead end. It acts like a real store clerk, suggesting smart substitutes (like *Almond Milk* instead of regular milk) or recommending items that are currently in season!

### 🖼️ Real-Time Dynamic Imagery
To ensure your shopping list always looks beautiful, VCKart dynamically generates highly accurate, gorgeous product images on the fly if an item isn't strictly found in our catalog yet.

### 🛠️ A Unified, Category-Agnostic Catalog
Behind the scenes, we aren't just built for groceries. Our architecture uses dynamic attributes, meaning VCKart seamlessly handles the shift from filtering a shirt by `"size: medium"` to filtering a phone by `"RAM: 16GB"`.

---

## 🏗️ How We Built It (System Architecture)
We didn't just want this to work well; we wanted it to be lightning fast and visually stunning.

### Frontend
- **Framework:** Next.js 16 (App Router) with React 19 for instantaneous Server-Side Rendering (SSR).
- **Styling:** Tailwind CSS v4 in a premium, hand-crafted Dark Mode UI.
- **Voice:** Native Browser Web Speech API for low-latency streaming transcription.

### AI / NLP Pipeline
- **Engine:** Google Gemini 2.5 Flash acts as the brain.
- **Intent Mapping:** User queries are mapped to strict JSON intent schemas (e.g., `PRODUCT_SEARCH`, `FILTER_UPDATE`, `ADD_TO_LIST`, `COMPARE_PRODUCTS`).
- **Contextual State:** The AI maintains a continuous conversation state (remembering previous filters and categories) so users can refine searches naturally.

### Database & Backend
- **Database:** PostgreSQL (hosted via Neon) managed by Prisma ORM.
- **Core Models:** 
  - `User`: Handles multi-tenant authentication for regular users and admins.
  - `Product`: A highly normalized catalog using dynamic JSON schemas for category-agnostic attributes.
  - `StoreListing`: Supports cross-store inventory mappings (e.g., pulling prices from D-Mart vs BlinkIt).
  - `ConversationSession`: Persists the AI's search state and contextual memory across page reloads.

---

## 🗺️ Application Structure

VCKart is actually three tightly integrated applications in one repository:

1. **The Voice Assistant (`/assistant`)**: The flagship consumer interface where users speak and shop. Includes the interactive shopping list (`/shopping-list`).
2. **The Admin Dashboard (`/admin`)**: A comprehensive internal tool for managing users, overriding product inventory, and tracking platform analytics.
3. **The Developer Documentation (`/docs`)**: A beautiful, interactive Next.js-powered documentation site detailing the system architecture and AI endpoints.

---

## 🚀 Getting Started

Want to spin this up locally and try it out? It takes less than two minutes:

1. **Install dependencies:** 
   ```bash
   npm install
   ```
2. **Setup your environment:** Create a `.env` file with your keys.
   ```env
   DATABASE_URL="postgres://..."
   GEMINI_API_KEY="your_api_key_here"
   ```
3. **Sync the Database & Seed dummy data:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```
4. **Boot it up:**
   ```bash
   npm run dev
   ```

---
*Welcome to the future of shopping. Just tap the mic and say hello!* 🎙️✨
