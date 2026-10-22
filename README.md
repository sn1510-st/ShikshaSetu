# शिक्षासेतु (ShikshaSetu)
### Maharashtra State Board (Balbharati) Digital Learning Platform for Standards 5, 6, 7 & 8
**"Bridging the Gap Between Students and Education."**

---

## 🌟 Executive Summary & Academic Project Identity

**ShikshaSetu** is a comprehensive, student-centric, trilingual digital educational platform developed for Maharashtra State Board (Balbharati) middle school students across **Standards 5, 6, 7, and 8**. It is engineered to bridge the educational divide for students who cannot afford expensive private coaching classes or paid commercial apps.

Developed as a flagship **College Community Engagement Project (CEP)** and symposium presentation, ShikshaSetu provides an official e-Balbharati-inspired digital learning environment featuring **229 verified curriculum chapters**, an e-Balbharati textbook discovery catalogue, 11 interactive HTML5 science simulators, step-by-step numerically solved mathematics, distraction-free topic learning modules, optional chapter mastery quizzes, cryptographic student authentication, and instant PDF downloads.

---

## 🚀 Key Architectural Pillars & Features

### 1. High-Impact Homepage
- **Hero Section**: Prominent mission headline *"Every Student Deserves the Opportunity to Learn"* with dual CTAs ("Start Learning" and "Explore Textbooks") and interactive learning status visual.
- **Continue Learning Stream**: Dynamically tracks each student's last studied chapter/topic and allows 1-click continuation with live syllabus progress percentages.
- **Explore by Standard**: Dedicated interactive cards for Standard 5, 6, 7, and 8 with curriculum outlines.
- **Explore Subjects**: 4 core Balbharati subject categories (General Science, Mathematics, English Balbharati, and Social Science).
- **How ShikshaSetu Works**: Visual 4-step learning path (Select Class & Medium $\rightarrow$ Explore Concepts & Simulations $\rightarrow$ Step-by-Step Numericals $\rightarrow$ Quiz Mastery & Badges).
- **Academic CEP Symposium Banner**: Highlights the college community engagement project goals and educational equality mission.
- **Universal Educational Footer**: Disclaimers and navigation.

### 2. Textbook Catalogue — Inspired by e-Balbharati
A dedicated **Explore Books** page providing multi-criteria discovery matching the official e-Balbharati portal:
1. **Syllabus Year Filter**: 2024-25 (Latest), 2023-24, 2022-23, or All.
2. **Book Type Filter**: Textbooks, Supplementary Notes, Practice Workbooks, or All.
3. **Standard Filter**: Class 5, 6, 7, 8, or All.
4. **Medium Filter**: English, Marathi (मराठी), Hindi (हिंदी), or All.
5. **Subject Filter**: Mathematics, Science, English, Social Science, or All.
6. **Search**: Live keyword search across book titles, subjects, and descriptions.
- **Catalogue Results**: 37 verified Balbharati books with official cover styling, syllabus year badges, chapter counts, "Read Online" in-browser reader, and "Download PDF" actions.

### 3. Cryptographic Authentication & Student Profile Engine
- **Password Hashing**: Implements SHA-256 cryptographic hashing via the standard Web Crypto API (`crypto.subtle.digest`).
- **Student Registration**: Validates full name, unique username, valid email, minimum 6-character passwords, password confirmation, standard selection (5-8), and preferred medium/language.
- **Student Login**: Validates credentials, includes password show/hide eye toggle, remember session, and a safe "Forgot Password" reset modal.
- **Evaluator Demo Mode**: 1-click **"Demo Student"** button (`aarav` / `Balbharti@2026`) pre-seeded with sample history and test scores for seamless symposium presentations.
- **Guest Mode**: Instant trial without requiring registration.
- **Per-User Data Isolation**: History, completed chapters, and quiz scores are strictly scoped by user ID in `localStorage` (`shikshasetu_history_{userId}`, `shikshasetu_completed_{userId}`, `shikshasetu_quiz_{userId}`).

### 4. Complete Learning Hierarchy
Follows the structured journey:
$$\text{Homepage} \longrightarrow \text{Standard} \longrightarrow \text{Subject} \longrightarrow \text{Chapter} \longrightarrow \text{Topic} \longrightarrow \text{Learning Material} \longrightarrow \text{Optional Quiz} \longrightarrow \text{Results}$$

- **Chapter Overview**: Includes Balbharati "Can You Recall?" and "Do You Know?" callouts, sub-topic listing, interactive simulation mount, and chapter exercises.
- **Dedicated Topic Learning Page**:
  - Breadcrumb navigation trail.
  - Learning objectives checklist.
  - Student-friendly introduction tailored for ages 10–14.
  - In-depth concept explanation.
  - Important Definitions & Terminology glossary cards.
  - Real-world examples from everyday Indian life.
  - Key points to remember & summary.
  - Previous / Next topic navigation controls.
  - Mark as Completed toggle.
  - Practice Quiz launcher.

### 5. Interactive Science Lab (11 HTML5 Canvas Simulators)
1. **The Solar System (सूर्यमाला)**: 8 orbital planets with Keplerian motion.
2. **The Water Cycle (जलचक्र)**: Solar heat, evaporation, cloud formation, rain, and runoff.
3. **Photosynthesis & Stomata (प्रकाशसंश्लेषण)**: Solar photons, chloroplasts, stomata toggle, and $O_2$ release.
4. **States of Matter & Molecular Motion (द्रव्याच्या अवस्था)**: 60-particle kinetic simulator with temperature slider ($-20^\circ\text{C}$ to $150^\circ\text{C}$).
5. **Electric Circuit Simulator (विद्युत परिपथ)**: Battery voltage regulator, switch, electron flow, and lightbulb glow.
6. **Human Digestive System (मानवी पचनसंस्था)**: 4-stage interactive digestion from mouth to intestines.
7. **Plant Cell Structure (वनस्पती पेशीरचना)**: Clickable organelles (cell wall, nucleus, chloroplasts, vacuoles).
8. **Laws of Reflection of Light (प्रकाशाचे परावर्तन)**: Incident angle slider proving $\angle i = \angle r$.
9. **Bohr's Atomic Model (अणूचे अंतरंग)**: Protons, neutrons, concentric $K, L, M$ shells, and element selector.
10. **Newton's Laws of Motion & Force ($F = ma$)**: Dynamic cart with mass and applied force gauges.
11. **Acid, Base & Litmus Indicator Lab (आम्ल व आम्लारी)**: pH slider ($1$ to $14$), color transitions, and litmus strips.

### 6. Numerically Solved Mathematics Lab
- Structured problem breakdown: $\text{Problem} \rightarrow \text{Given Data} \rightarrow \text{Formula} \rightarrow \text{Step-by-Step Calculations} \rightarrow \text{Final Answer with Units}$.
- **Pythagoras Triplet Calculator**: Interactive visual right-triangle solver ($a^2 + b^2 = c^2$).
- **Compound Interest Calculator**: Interactive formula breakdown ($A = P(1 + R/100)^N$).

### 7. Optional Chapter Mastery Quizzes
- Quizzes are completely optional — students can study without being forced to take a quiz.
- Multiple-choice questions with visual selection states, question navigation, and progress tracking.
- Detailed post-submission review: Total score, percentage, correct answer keys, and clear pedagogical explanations.
- Scoring $\ge 60\%$ automatically records completion in the student's profile.
- **All-Chapters Subject Mega Revision Quiz**: Pools questions across all chapters for comprehensive subject revision.

### 8. Trilingual Localization
- Full UI localization across **English**, **Marathi (मराठी)**, and **Hindi (हिंदी)**.
- Covers navigation, buttons, filter controls, dashboard metrics, topic cards, and settings.
- Textbook medium filter is handled independently from UI language.

### 9. PDF Generation & Offline Reading
- Built-in Balbharati-styled in-browser textbook reader mode.
- Working client-side PDF downloads generated using `jsPDF`.
- Printable clean textbook layout (`@media print`).

---

## 📂 Project Directory Structure

```
shikshasetu/
├── index.html                  # Single-page application entry point
├── README.md                   # Complete architectural documentation
├── server.py                   # Local development HTTP server (Python 3)
├── start_shikshasetu.bat       # 1-click launcher for Windows
├── test_suite.py               # Comprehensive verification test suite
├── css/
│   └── styles.css              # Custom styling, fonts, and print styles
└── js/
    ├── app.js                  # Master application router & view controller
    ├── components/
    │   ├── auth.js             # Cryptographic multi-user authentication (SHA-256)
    │   ├── mathEngine.js       # Solved maths renderer & interactive calculators
    │   ├── pdfGenerator.js     # Balbharati reader modal & jsPDF download engine
    │   ├── quiz.js             # Interactive quiz engine & score manager
    │   ├── settings.js         # Progress calculation, streak & downloads manager
    │   └── simulations.js      # 11 HTML5 Canvas interactive science simulators
    └── data/
        ├── books.js            # 37 verified Balbharati textbooks catalogue (e-Balbharati)
        ├── mathExamples.js     # Solved numerical problems bank
        ├── syllabus.js         # Master syllabus aggregator
        ├── syllabus_std5.js    # Std 5 curriculum (56 chapters)
        ├── syllabus_std6.js    # Std 6 curriculum (56 chapters)
        ├── syllabus_std7.js    # Std 7 curriculum (57 chapters)
        ├── syllabus_std8.js    # Std 8 curriculum (60 chapters)
        ├── topics.js           # Structured topic breakdown & definitions
        └── translations.js     # Complete English, Marathi, Hindi dictionaries
```

---

## 💻 How to Run and Test ShikshaSetu

### Method 1: 1-Click Windows Launcher (Recommended)
Double-click `start_shikshasetu.bat` located inside the project directory:
```
C:\Users\DELL\.gemini\antigravity\scratch\shikshasetu\start_shikshasetu.bat
```
This automatically starts the local HTTP server and opens `http://localhost:8000` in your default browser.

### Method 2: Command Line (PowerShell / Command Prompt)
```powershell
cd C:\Users\DELL\.gemini\antigravity\scratch\shikshasetu
python server.py
```
Then navigate to `http://localhost:8000`.

### Method 3: Direct Browser Launch
Open `index.html` directly in any modern browser (Chrome, Edge, Firefox, Safari).

### Running the Verification Test Suite
```powershell
python C:\Users\DELL\.gemini\antigravity\scratch\shikshasetu\test_suite.py
```

---

## 🎓 College CEP Symposium Presentation Guide

For demonstrating **ShikshaSetu** during evaluation:
1. **Show the Homepage**: Highlight the mission, the 4-step learning journey, and the responsive navigation bar.
2. **Demonstrate 1-Click Demo Login**: Click **"Log In"** $\rightarrow$ click **"Demo Student"** to immediately showcase a realistic student profile with active streak, syllabus progress, and test history.
3. **Demonstrate Textbook Catalogue**: Click **"Explore Books"** $\rightarrow$ filter by *Standard 7*, *Marathi Medium*, *Mathematics* to show the e-Balbharati multi-filter in action.
4. **Demonstrate Topic Learning**: Navigate to *Standard 7* $\rightarrow$ *Science* $\rightarrow$ *Chapter 1* $\rightarrow$ *Topic 1* to show the distraction-free learning screen with learning objectives, age-appropriate explanations, definitions cards, real-life examples, and PDF download.
5. **Demonstrate Interactive Science Lab**: Open an interactive simulation (e.g. *Solar System*, *Water Cycle*, or *Electric Circuit*) and interact with the controls.
6. **Demonstrate Solved Mathematics**: Navigate to *Math Lab* or *Std 7 Pythagoras Theorem* to showcase the step-by-step numerical breakdown and the interactive triangle calculator.
7. **Demonstrate Multilingual Support**: Use the language dropdown in the header to switch between **English**, **मराठी (Marathi)**, and **हिंदी (Hindi)** and observe the instant UI update.
8. **Demonstrate Offline PDF**: Click **"Download PDF"** on any chapter to demonstrate client-side PDF generation.
