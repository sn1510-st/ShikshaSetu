// ShikshaSetu Settings, Learning History, Isolated User Progress & Downloads Engine
// Ensures student data isolation per user ID, accurate progress calculation, and download management

window.ShikshaSettings = {
  // Get active user ID for storage scoping
  getActiveUserId: function() {
    const user = window.ShikshaAuth ? window.ShikshaAuth.getUser() : null;
    return user ? user.id : "guest_default";
  },

  // Record visited chapter / topic in user's isolated history
  recordHistory: function(chapter, topic) {
    const userId = this.getActiveUserId();
    const key = `shikshasetu_history_${userId}`;
    let history = this.getHistory();

    // Remove if already exists to bring to the top
    history = history.filter(h => h.id !== chapter.id);

    history.unshift({
      id: chapter.id,
      standard: chapter.standard,
      subject: chapter.subject,
      chapterNumber: chapter.chapterNumber,
      titleEn: chapter.titleEn,
      titleMr: chapter.titleMr,
      topicId: topic ? topic.id : null,
      topicTitle: topic ? topic.titleEn : null,
      timestamp: new Date().toISOString()
    });

    if (history.length > 50) history = history.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(history));

    // Also update active session's last activity
    const user = window.ShikshaAuth ? window.ShikshaAuth.getUser() : null;
    if (user) {
      user.lastActiveChapterId = chapter.id;
      user.lastActiveStandard = chapter.standard;
      user.lastActiveSubject = chapter.subject;
      window.ShikshaAuth.setSession(user);
    }
  },

  getHistory: function() {
    const userId = this.getActiveUserId();
    const key = `shikshasetu_history_${userId}`;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch(e) {
      return [];
    }
  },

  clearHistory: function() {
    const userId = this.getActiveUserId();
    const key = `shikshasetu_history_${userId}`;
    if (confirm("Are you sure you want to clear your learning history?")) {
      localStorage.removeItem(key);
      if (window.ShikshaApp) window.ShikshaApp.render();
    }
  },

  // Chapter completion toggle (isolated per user)
  toggleCompleted: function(chapterId) {
    const userId = this.getActiveUserId();
    const key = `shikshasetu_completed_${userId}`;
    let completed = this.getCompleted();

    if (completed.includes(chapterId)) {
      completed = completed.filter(id => id !== chapterId);
    } else {
      completed.push(chapterId);
    }

    localStorage.setItem(key, JSON.stringify(completed));
    if (window.ShikshaApp) window.ShikshaApp.render();
  },

  getCompleted: function() {
    const userId = this.getActiveUserId();
    const key = `shikshasetu_completed_${userId}`;
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch(e) {
      return [];
    }
  },

  isCompleted: function(chapterId) {
    return this.getCompleted().includes(chapterId);
  },

  // Calculate actual syllabus progress for the student's standard
  calculateProgress: function(standard) {
    const std = standard || (window.ShikshaApp ? window.ShikshaApp.currentStandard : 7);
    const syllabus = window.SHIKSHA_SYLLABUS || [];
    const stdChapters = syllabus.filter(c => c.standard === std);
    const completed = this.getCompleted();

    const stdCompleted = stdChapters.filter(c => completed.includes(c.id));
    const totalCount = stdChapters.length || 1;
    const completedCount = stdCompleted.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    // Subject-wise breakdown
    const subjects = ["science", "maths", "english", "socialScience"];
    const subjectStats = {};

    subjects.forEach(sub => {
      const subChapters = stdChapters.filter(c => c.subject === sub);
      const subCompleted = subChapters.filter(c => completed.includes(c.id));
      subjectStats[sub] = {
        total: subChapters.length,
        completed: subCompleted.length,
        percentage: subChapters.length > 0 ? Math.round((subCompleted.length / subChapters.length) * 100) : 0
      };
    });

    return {
      standard: std,
      totalChapters: totalCount,
      completedChapters: completedCount,
      percentage: percentage,
      bySubject: subjectStats
    };
  },

  // Calculate study streak based on history days
  calculateStreak: function() {
    const history = this.getHistory();
    if (history.length === 0) return 1;

    const uniqueDays = new Set();
    history.forEach(h => {
      if (h.timestamp) {
        const day = new Date(h.timestamp).toISOString().split('T')[0];
        uniqueDays.add(day);
      }
    });

    return Math.max(1, uniqueDays.size);
  },

  // Web Speech API text-to-speech audio reader with interactive Toggle & Stop capability
  isSpeaking: false,
  currentAudioBtnId: null,

  toggleAudio: function(text, btnId) {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported by your browser.");
      return;
    }

    // If already speaking, stop it immediately!
    if (this.isSpeaking) {
      this.stopAudio();
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    const lang = window.ShikshaApp ? window.ShikshaApp.currentLanguage : "en";
    if (lang === "mr") utterance.lang = "mr-IN";
    else if (lang === "hi") utterance.lang = "hi-IN";
    else utterance.lang = "en-IN";

    this.isSpeaking = true;
    this.currentAudioBtnId = btnId;
    this.updateAudioButtonState(btnId, true);

    utterance.onend = () => {
      this.isSpeaking = false;
      this.updateAudioButtonState(btnId, false);
      this.currentAudioBtnId = null;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.updateAudioButtonState(btnId, false);
      this.currentAudioBtnId = null;
    };

    window.speechSynthesis.speak(utterance);
  },

  speakText: function(text) {
    this.toggleAudio(text, this.currentAudioBtnId);
  },

  stopAudio: function() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    if (this.currentAudioBtnId) {
      this.updateAudioButtonState(this.currentAudioBtnId, false);
      this.currentAudioBtnId = null;
    }
  },

  updateAudioButtonState: function(btnId, isPlaying) {
    if (!btnId) return;
    const btn = document.getElementById(btnId);
    if (!btn) return;
    const t = window.ShikshaApp ? window.ShikshaApp.getTranslation.bind(window.ShikshaApp) : (k => k);
    if (isPlaying) {
      btn.innerHTML = `
        <i data-lucide="square" class="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse"></i>
        <span class="text-rose-600 dark:text-rose-400 font-bold">Stop Audio</span>
      `;
      btn.classList.add("bg-rose-100", "border-rose-300", "dark:bg-rose-950/60");
    } else {
      btn.innerHTML = `
        <i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-500"></i>
        <span>${t("readAloud")}</span>
      `;
      btn.classList.remove("bg-rose-100", "border-rose-300", "dark:bg-rose-950/60");
    }
    if (window.lucide) window.lucide.createIcons();
  },

  // Render Full Settings Modal / View
  renderModal: function(container) {
    const app = window.ShikshaApp;
    const t = app.getTranslation.bind(app);
    const user = window.ShikshaAuth ? window.ShikshaAuth.getUser() : null;
    const history = this.getHistory();
    const completed = this.getCompleted();
    const streak = this.calculateStreak();
    const books = window.SHIKSHA_BOOKS || [];

    container.innerHTML = `
      <div class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
        <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[92vh] flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <i data-lucide="settings" class="w-4 h-4"></i>
              </div>
              <div>
                <h3 class="font-extrabold text-base leading-tight">${t("settings")}</h3>
                <p class="text-[10px] text-slate-400">Manage language, downloads & account</p>
              </div>
            </div>
            <button onclick="ShikshaApp.closeSettingsModal()" class="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>

          <!-- Tabs Content (Scrollable) -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300">
            <!-- 1. Language Settings -->
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div class="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                <i data-lucide="globe" class="w-4 h-4 text-amber-500"></i>
                <h4>1. ${t("chooseLanguage")} (इंटरफेस भाषा)</h4>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Updates all buttons, navigation, dashboard labels, and quiz indicators immediately.
              </p>
              <div class="grid grid-cols-3 gap-2">
                <button onclick="ShikshaApp.setLanguage('en')" class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${app.currentLanguage === 'en' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20' : 'border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'}">
                  <span>English</span>
                </button>
                <button onclick="ShikshaApp.setLanguage('mr')" class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${app.currentLanguage === 'mr' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20' : 'border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'}">
                  <span>मराठी (Marathi)</span>
                </button>
                <button onclick="ShikshaApp.setLanguage('hi')" class="py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${app.currentLanguage === 'hi' ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20' : 'border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'}">
                  <span>हिंदी (Hindi)</span>
                </button>
              </div>
            </div>

            <!-- 2. Downloads & Offline Materials -->
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <i data-lucide="download" class="w-4 h-4 text-emerald-500"></i>
                  <h4>2. Downloads & Offline Resources</h4>
                </div>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Ready Offline
                </span>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Download verified chapter notes, textbook guides, and exercise solutions as high-resolution PDFs.
              </p>
              <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                ${books.slice(0, 4).map(b => `
                  <div class="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <h5 class="font-bold text-slate-900 dark:text-white">${b.titleEn}</h5>
                      <span class="text-[10px] text-slate-400">Std ${b.standard} • ${b.subject.toUpperCase()} • ${b.fileSize}</span>
                    </div>
                    <button onclick="ShikshaPDF.downloadPDF('std${b.standard}_${b.subject.substring(0,3)}_ch1')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-[11px] flex items-center gap-1 transition">
                      <i data-lucide="download" class="w-3 h-3"></i>
                      <span>Download</span>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 3. Account Settings -->
            <div class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <i data-lucide="user-check" class="w-4 h-4 text-indigo-500"></i>
                  <h4>3. Student Profile & Account Settings</h4>
                </div>
                ${user && !user.isGuest ? `
                  <span class="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                    Active Student
                  </span>
                ` : `
                  <span class="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                    Guest Session
                  </span>
                `}
              </div>

              ${user ? `
                <div class="space-y-3 pt-1">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Full Name</span>
                      <strong class="text-slate-900 dark:text-white">${user.name}</strong>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Email / Username</span>
                      <strong class="text-slate-900 dark:text-white">${user.email || user.username}</strong>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Enrolled Class</span>
                      <div class="flex items-center gap-2 mt-1">
                        <select onchange="ShikshaSettings.changeUserStandard(parseInt(this.value))" class="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 dark:text-white">
                          <option value="5" ${user.standard === 5 ? 'selected' : ''}>Standard 5</option>
                          <option value="6" ${user.standard === 6 ? 'selected' : ''}>Standard 6</option>
                          <option value="7" ${user.standard === 7 ? 'selected' : ''}>Standard 7</option>
                          <option value="8" ${user.standard === 8 ? 'selected' : ''}>Standard 8</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <span class="text-slate-400 block text-[10px] uppercase font-bold">Active Streak</span>
                      <strong class="text-amber-600 dark:text-amber-400 font-black text-sm">${streak} Day(s) 🌟</strong>
                    </div>
                  </div>

                  <div class="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                    <button onclick="ShikshaAuth.openForgotPasswordModal()" class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">
                      Change Password
                    </button>
                    <button onclick="ShikshaApp.closeSettingsModal(); ShikshaAuth.logout();" class="px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
                      <i data-lucide="log-out" class="w-3.5 h-3.5"></i>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ` : `
                <div class="text-xs text-slate-500">
                  <p>You are currently browsing as a visitor. Sign up or log in to preserve your progress across devices.</p>
                  <button onclick="ShikshaApp.closeSettingsModal(); ShikshaApp.navigateTo('login')" class="mt-2 px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                    Log In / Sign Up
                  </button>
                </div>
              `}
            </div>

            <!-- Clear History Action -->
            <div class="flex items-center justify-between text-xs pt-1">
              <span class="text-slate-400">Visited ${history.length} chapter(s)</span>
              <button onclick="ShikshaSettings.clearHistory()" class="text-rose-500 hover:underline font-semibold">
                Clear Learning History
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // Change student's enrolled standard
  changeUserStandard: function(newStd) {
    const user = window.ShikshaAuth ? window.ShikshaAuth.getUser() : null;
    if (user) {
      user.standard = newStd;
      window.ShikshaAuth.setSession(user);

      // Update in accounts store too
      const accounts = window.ShikshaAuth.getAllAccounts();
      const idx = accounts.findIndex(a => a.id === user.id);
      if (idx !== -1) {
        accounts[idx].standard = newStd;
        localStorage.setItem(window.ShikshaAuth.accountsKey, JSON.stringify(accounts));
      }
    }
    if (window.ShikshaApp) {
      window.ShikshaApp.currentStandard = newStd;
      window.ShikshaApp.render();
      this.renderModal(document.getElementById("settings-modal-container"));
    }
  }
};
