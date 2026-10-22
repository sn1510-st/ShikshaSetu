// ShikshaSetu Core Application Controller & Router
// Complete digital learning platform for Maharashtra State Board (Balbharati) Standards 5, 6, 7 & 8

window.ShikshaApp = {
  currentView: "login", // Starts with login/signup screen as requested
  currentUser: null,
  currentStandard: 7,
  currentMedium: "english",
  currentSubject: "science",
  currentChapterId: null,
  currentTopicId: null,
  currentLanguage: "en", // 'en', 'mr', 'hi'
  theme: "light", // 'light', 'dark'
  fontSize: "normal", // 'normal', 'large', 'extra'
  searchQuery: "",
  mobileMenuOpen: false,
  historyStack: [],

  // Explore Books Catalogue Filter State (Strict e-Balbharati Filter Order)
  bookFilters: {
    syllabusYear: "all",
    bookType: "all",
    standard: "all",
    medium: "all",
    subject: "all",
    search: ""
  },

  init: function() {
    try {
      // Restore language, theme & font preferences
      const savedLang = localStorage.getItem("shikshasetu_lang");
      if (savedLang) this.currentLanguage = savedLang;

      const savedTheme = localStorage.getItem("shikshasetu_theme");
      if (savedTheme) this.theme = savedTheme;

      const savedSize = localStorage.getItem("shikshasetu_fontSize");
      if (savedSize) this.fontSize = savedSize;

      // Check if user is logged in
      this.currentUser = window.ShikshaAuth ? window.ShikshaAuth.getUser() : null;
      if (this.currentUser) {
        if (this.currentUser.standard) this.currentStandard = parseInt(this.currentUser.standard);
        if (this.currentUser.medium) this.currentMedium = this.currentUser.medium;
        if (this.currentUser.language) this.currentLanguage = this.currentUser.language;
        this.currentView = "home";
      } else {
        // Website starts with Login screen
        this.currentView = "login";
      }
    } catch(e) {
      console.error("App init error:", e);
      this.currentView = "login";
    }

    this.applyTheme();
    this.render();
  },

  getTranslation: function(key) {
    const dict = (window.SHIKSHA_TRANSLATIONS && window.SHIKSHA_TRANSLATIONS[this.currentLanguage]) ||
                 (window.SHIKSHA_TRANSLATIONS && window.SHIKSHA_TRANSLATIONS.en) || {};
    return dict[key] || (window.SHIKSHA_TRANSLATIONS && window.SHIKSHA_TRANSLATIONS.en && window.SHIKSHA_TRANSLATIONS.en[key]) || key;
  },

  setLanguage: function(lang) {
    this.currentLanguage = lang;
    localStorage.setItem("shikshasetu_lang", lang);

    // If user is logged in, sync to profile
    if (this.currentUser) {
      this.currentUser.language = lang;
      if (window.ShikshaAuth) window.ShikshaAuth.setSession(this.currentUser);
    }

    this.render();
  },

  setTheme: function(theme) {
    this.theme = theme;
    localStorage.setItem("shikshasetu_theme", theme);
    this.applyTheme();
    this.render();
  },

  applyTheme: function() {
    if (this.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  navigateTo: function(view, addToHistory = true) {
    if (window.ShikshaSettings) window.ShikshaSettings.stopAudio();
    if (addToHistory && this.currentView !== view) {
      this.historyStack.push({
        view: this.currentView,
        standard: this.currentStandard,
        subject: this.currentSubject,
        chapterId: this.currentChapterId,
        topicId: this.currentTopicId
      });
    }
    this.currentView = view;
    this.mobileMenuOpen = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  goBack: function() {
    if (window.ShikshaSettings) window.ShikshaSettings.stopAudio();
    if (this.historyStack.length > 0) {
      const prev = this.historyStack.pop();
      this.currentView = prev.view;
      this.currentStandard = prev.standard;
      this.currentSubject = prev.subject;
      this.currentChapterId = prev.chapterId;
      this.currentTopicId = prev.topicId;
    } else {
      // Natural hierarchical fallbacks
      if (this.currentView === "quiz") {
        this.currentView = this.currentTopicId ? "topic" : "chapterDetail";
      } else if (this.currentView === "topic") {
        this.currentView = "chapterDetail";
      } else if (this.currentView === "chapterDetail") {
        this.currentView = "chapterList";
      } else if (this.currentView === "chapterList") {
        this.currentView = "subject";
      } else if (this.currentView === "subject") {
        this.currentView = "standard";
      } else if (this.currentView === "standard") {
        this.currentView = "home";
      } else {
        this.currentView = "home";
      }
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.render();
  },

  selectStandard: function(std) {
    this.currentStandard = parseInt(std);
    this.navigateTo("subject");
  },

  selectSubject: function(subj) {
    this.currentSubject = subj;
    this.navigateTo("chapterList");
  },

  openChapter: function(chId) {
    this.currentChapterId = chId;
    const ch = (window.SHIKSHA_SYLLABUS || []).find(c => c.id === chId);
    if (ch) {
      this.currentStandard = ch.standard;
      this.currentSubject = ch.subject;
      if (window.ShikshaSettings) window.ShikshaSettings.recordHistory(ch);
    }
    this.navigateTo("chapterDetail");
  },

  openTopic: function(chId, topicId) {
    this.currentChapterId = chId;
    this.currentTopicId = topicId;
    const ch = (window.SHIKSHA_SYLLABUS || []).find(c => c.id === chId);
    if (ch) {
      this.currentStandard = ch.standard;
      this.currentSubject = ch.subject;
      const topics = window.ShikshaTopics ? window.ShikshaTopics.getTopicsForChapter(ch) : [];
      const topic = topics.find(t => t.id === topicId) || topics[0];
      if (window.ShikshaSettings) window.ShikshaSettings.recordHistory(ch, topic);
    }
    this.navigateTo("topic");
  },

  openSettingsModal: function() {
    let modal = document.getElementById("settings-modal-container");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "settings-modal-container";
      document.body.appendChild(modal);
    }
    if (window.ShikshaSettings) window.ShikshaSettings.renderModal(modal);
  },

  closeSettingsModal: function() {
    const modal = document.getElementById("settings-modal-container");
    if (modal) modal.innerHTML = "";
  },

  toggleMobileMenu: function() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const menu = document.getElementById("mobile-menu");
    if (menu) {
      if (this.mobileMenuOpen) menu.classList.remove("hidden");
      else menu.classList.add("hidden");
    }
  },

  // -------------------------------------------------------------
  // MAIN RENDER CONTROLLER
  // -------------------------------------------------------------
  render: function() {
    const root = document.getElementById("app-root");
    if (!root) return;

    // Check auth-specific screens
    if (this.currentView === "login") {
      root.innerHTML = this.renderShellHeaderFooter(`<div id="view-container"></div>`);
      const container = document.getElementById("view-container");
      if (window.ShikshaAuth) window.ShikshaAuth.renderLoginScreen(container);
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    if (this.currentView === "signup") {
      root.innerHTML = this.renderShellHeaderFooter(`<div id="view-container"></div>`);
      const container = document.getElementById("view-container");
      if (window.ShikshaAuth) window.ShikshaAuth.renderSignupScreen(container);
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    // Render App Shell with Main View
    root.innerHTML = this.renderShellHeaderFooter(`<div id="view-container"></div>`);
    if (window.lucide) window.lucide.createIcons();

    const viewContainer = document.getElementById("view-container");
    if (!viewContainer) return;

    switch(this.currentView) {
      case "home":
        this.renderHomeView(viewContainer);
        break;
      case "books":
        this.renderBooksView(viewContainer);
        break;
      case "standard":
        this.renderStandardView(viewContainer);
        break;
      case "subject":
        this.renderSubjectView(viewContainer);
        break;
      case "chapterList":
        this.renderChapterListView(viewContainer);
        break;
      case "chapterDetail":
        this.renderChapterDetailView(viewContainer);
        break;
      case "topic":
        this.renderTopicView(viewContainer);
        break;
      case "quiz":
        if (window.ShikshaQuiz) window.ShikshaQuiz.render(viewContainer);
        break;
      case "mathLab":
        this.renderMathLabView(viewContainer);
        break;
      case "dashboard":
        this.renderDashboardView(viewContainer);
        break;
      case "about":
        this.renderAboutView(viewContainer);
        break;
      default:
        this.renderHomeView(viewContainer);
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // App Shell containing Top Navigation Bar, Breadcrumbs & Footer
  renderShellHeaderFooter: function(contentHtml) {
    const t = this.getTranslation.bind(this);
    const user = this.currentUser;

    return `
      <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
        <!-- Top Navigation Bar -->
        <header class="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 gap-3">
              <!-- Brand Logo & Name -->
              <div class="flex items-center gap-3 cursor-pointer shrink-0" onclick="ShikshaApp.navigateTo('home')">
                <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/25">
                  <i data-lucide="book-marked" class="w-6 h-6"></i>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                      शिक्षा<span class="text-amber-500">सेतु</span>
                    </span>
                    <span class="text-[10px] font-black uppercase tracking-wider bg-slate-900 text-amber-400 dark:bg-amber-400 dark:text-slate-950 px-1.5 py-0.5 rounded">
                      Balbharati
                    </span>
                  </div>
                  <p class="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 leading-none">
                    ${t("tagline")}
                  </p>
                </div>
              </div>

              <!-- Desktop Navigation Links -->
              <nav class="hidden lg:flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                <button onclick="ShikshaApp.navigateTo('home')" class="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${this.currentView === 'home' ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-slate-800' : ''}">
                  ${t("navHome")}
                </button>
                <button onclick="ShikshaApp.navigateTo('books')" class="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 ${this.currentView === 'books' ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-slate-800' : ''}">
                  <i data-lucide="book-open" class="w-3.5 h-3.5 text-amber-500"></i>
                  <span>${t("navBooks")}</span>
                </button>
                <button onclick="ShikshaApp.navigateTo('standard')" class="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${this.currentView === 'standard' || this.currentView === 'subject' ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-slate-800' : ''}">
                  ${t("navSubjects")}
                </button>
                <button onclick="ShikshaApp.navigateTo('dashboard')" class="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 ${this.currentView === 'dashboard' ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-slate-800' : ''}">
                  <i data-lucide="layout-dashboard" class="w-3.5 h-3.5 text-emerald-500"></i>
                  <span>${t("navMyLearning")}</span>
                </button>
                <button onclick="ShikshaApp.navigateTo('mathLab')" class="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1.5 ${this.currentView === 'mathLab' ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-slate-800' : ''}">
                  <i data-lucide="calculator" class="w-3.5 h-3.5 text-indigo-500"></i>
                  <span>${t("navMathLab")}</span>
                </button>
                <button onclick="ShikshaApp.navigateTo('about')" class="px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${this.currentView === 'about' ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-50 dark:bg-slate-800' : ''}">
                  ${t("navAbout")}
                </button>
              </nav>

              <!-- Right Action Controls -->
              <div class="flex items-center gap-2">
                <!-- Language Selector -->
                <div class="relative inline-block">
                  <select onchange="ShikshaApp.setLanguage(this.value)" class="appearance-none bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-1.5 pl-2.5 pr-7 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="en" ${this.currentLanguage === 'en' ? 'selected' : ''}>English</option>
                    <option value="mr" ${this.currentLanguage === 'mr' ? 'selected' : ''}>मराठी</option>
                    <option value="hi" ${this.currentLanguage === 'hi' ? 'selected' : ''}>हिंदी</option>
                  </select>
                  <i data-lucide="globe" class="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none"></i>
                </div>

                <!-- Theme Toggle -->
                <button onclick="ShikshaApp.setTheme(ShikshaApp.theme === 'dark' ? 'light' : 'dark')" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition" title="Toggle Light/Dark Theme">
                  <i data-lucide="${this.theme === 'dark' ? 'sun' : 'moon'}" class="w-4 h-4"></i>
                </button>

                <!-- Settings Modal Trigger -->
                <button onclick="ShikshaApp.openSettingsModal()" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition hidden sm:inline-flex" title="Settings">
                  <i data-lucide="settings" class="w-4 h-4"></i>
                </button>

                <!-- Auth Buttons or Profile Menu -->
                ${user ? `
                  <div class="flex items-center gap-1.5 pl-1">
                    <button onclick="ShikshaApp.navigateTo('dashboard')" class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-amber-500/15 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs font-bold text-slate-900 dark:text-amber-300 hover:bg-amber-500/25 transition">
                      <div class="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[11px]">
                        ${user.name ? user.name.charAt(0).toUpperCase() : 'S'}
                      </div>
                      <span class="max-w-[80px] sm:max-w-[120px] truncate hidden sm:inline">${user.name}</span>
                    </button>
                    <button onclick="ShikshaAuth.logout()" class="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition" title="Log Out">
                      <i data-lucide="log-out" class="w-4 h-4"></i>
                    </button>
                  </div>
                ` : `
                  <div class="flex items-center gap-1.5">
                    <button onclick="ShikshaApp.navigateTo('login')" class="px-3 py-1.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      ${t("login")}
                    </button>
                    <button onclick="ShikshaApp.navigateTo('signup')" class="px-3.5 py-1.5 text-xs font-black rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 shadow-md shadow-amber-500/20 transition">
                      ${t("signup")}
                    </button>
                  </div>
                `}

                <!-- Mobile Hamburger Toggle -->
                <button onclick="ShikshaApp.toggleMobileMenu()" class="p-2 rounded-xl lg:hidden text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <i data-lucide="menu" class="w-5 h-5"></i>
                </button>
              </div>
            </div>

            <!-- Mobile Dropdown Menu -->
            <div id="mobile-menu" class="hidden lg:hidden border-t border-slate-200 dark:border-slate-800 py-3 space-y-1 text-xs font-bold text-slate-700 dark:text-slate-200">
              <button onclick="ShikshaApp.navigateTo('home')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="home" class="w-4 h-4 text-amber-500"></i>
                <span>${t("navHome")}</span>
              </button>
              <button onclick="ShikshaApp.navigateTo('books')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4 text-amber-500"></i>
                <span>${t("navBooks")}</span>
              </button>
              <button onclick="ShikshaApp.navigateTo('standard')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="graduation-cap" class="w-4 h-4 text-sky-500"></i>
                <span>${t("navSubjects")}</span>
              </button>
              <button onclick="ShikshaApp.navigateTo('dashboard')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="layout-dashboard" class="w-4 h-4 text-emerald-500"></i>
                <span>${t("navMyLearning")}</span>
              </button>
              <button onclick="ShikshaApp.navigateTo('mathLab')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="calculator" class="w-4 h-4 text-indigo-500"></i>
                <span>${t("navMathLab")}</span>
              </button>
              <button onclick="ShikshaApp.navigateTo('about')" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
                <i data-lucide="info" class="w-4 h-4 text-slate-400"></i>
                <span>${t("navAbout")}</span>
              </button>
              <button onclick="ShikshaApp.openSettingsModal()" class="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-2">
                <i data-lucide="settings" class="w-4 h-4 text-slate-400"></i>
                <span>${t("settings")}</span>
              </button>
            </div>
          </div>
        </header>

        <!-- Secondary Sub-header: Breadcrumb Navigation & Go Back -->
        ${this.currentView !== "home" ? `
          <div class="bg-amber-50/70 dark:bg-slate-900/80 border-b border-amber-200/50 dark:border-slate-800 px-4 sm:px-8 py-2.5">
            <div class="max-w-7xl mx-auto flex items-center justify-between text-xs">
              <button onclick="ShikshaApp.goBack()" class="inline-flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-400 hover:underline">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>${t("goBack")}</span>
              </button>

              <div class="hidden sm:flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
                <span onclick="ShikshaApp.navigateTo('home')" class="cursor-pointer hover:text-amber-600">${t("navHome")}</span>
                ${this.currentView === 'books' ? `
                  <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  <span class="text-slate-900 dark:text-white font-bold">${t("navBooks")}</span>
                ` : (this.currentView === 'dashboard' ? `
                  <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  <span class="text-slate-900 dark:text-white font-bold">${t("navMyLearning")}</span>
                ` : (this.currentView === 'about' ? `
                  <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  <span class="text-slate-900 dark:text-white font-bold">${t("navAbout")}</span>
                ` : `
                  <i data-lucide="chevron-right" class="w-3 h-3"></i>
                  <span onclick="ShikshaApp.navigateTo('standard')" class="cursor-pointer hover:text-amber-600">Standard ${this.currentStandard}th</span>
                  ${this.currentSubject ? `
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                    <span onclick="ShikshaApp.navigateTo('chapterList')" class="cursor-pointer hover:text-amber-600 capitalize">${this.currentSubject}</span>
                  ` : ''}
                  ${this.currentView === 'chapterDetail' ? `
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                    <span class="text-slate-900 dark:text-white font-bold">Chapter Detail</span>
                  ` : (this.currentView === 'topic' ? `
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                    <span class="text-amber-600 dark:text-amber-400 font-bold">Topic View</span>
                  ` : (this.currentView === 'quiz' ? `
                    <i data-lucide="chevron-right" class="w-3 h-3"></i>
                    <span class="text-amber-600 dark:text-amber-400 font-bold">Quiz Assessment</span>
                  ` : ''))}
                `))}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Main Body Workspace -->
        <main class="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          ${contentHtml}
        </main>

        <!-- Professional Educational Footer -->
        <footer class="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 px-4 sm:px-8 text-xs text-slate-500 dark:text-slate-400">
          <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <!-- Col 1: Identity -->
            <div class="space-y-3 md:col-span-1">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <i data-lucide="book-marked" class="w-5 h-5"></i>
                </div>
                <span class="text-base font-black text-slate-900 dark:text-white">
                  शिक्षा<span class="text-amber-500">सेतु</span>
                </span>
              </div>
              <p class="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                ${t("tagline")}. An open digital learning platform for Maharashtra State Board (Balbharati) students.
              </p>
              <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                <i data-lucide="check-circle" class="w-3 h-3"></i>
                <span>100% Free & Open Access</span>
              </div>
            </div>

            <!-- Col 2: Middle School Standards -->
            <div class="space-y-2">
              <h5 class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Standards (इयत्ता)</h5>
              <ul class="space-y-1.5">
                <li><button onclick="ShikshaApp.selectStandard(5)" class="hover:text-amber-600 transition">Standard 5 (इयत्ता ५ वी)</button></li>
                <li><button onclick="ShikshaApp.selectStandard(6)" class="hover:text-amber-600 transition">Standard 6 (इयत्ता ६ वी)</button></li>
                <li><button onclick="ShikshaApp.selectStandard(7)" class="hover:text-amber-600 transition">Standard 7 (इयत्ता ७ वी)</button></li>
                <li><button onclick="ShikshaApp.selectStandard(8)" class="hover:text-amber-600 transition">Standard 8 (इयत्ता ८ वी)</button></li>
              </ul>
            </div>

            <!-- Col 3: Core Subjects -->
            <div class="space-y-2">
              <h5 class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Core Subjects</h5>
              <ul class="space-y-1.5">
                <li><button onclick="ShikshaApp.currentStandard=7; ShikshaApp.selectSubject('science')" class="hover:text-amber-600 transition">General Science (सामान्य विज्ञान)</button></li>
                <li><button onclick="ShikshaApp.currentStandard=7; ShikshaApp.selectSubject('maths')" class="hover:text-amber-600 transition">Mathematics (गणित)</button></li>
                <li><button onclick="ShikshaApp.currentStandard=7; ShikshaApp.selectSubject('english')" class="hover:text-amber-600 transition">English Balbharati (इंग्रजी)</button></li>
                <li><button onclick="ShikshaApp.currentStandard=7; ShikshaApp.selectSubject('socialScience')" class="hover:text-amber-600 transition">Social Science (इतिहास व नागरिकशास्त्र)</button></li>
              </ul>
            </div>

            <!-- Col 4: Platform & Mission -->
            <div class="space-y-2">
              <h5 class="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Platform Resources</h5>
              <ul class="space-y-1.5">
                <li><button onclick="ShikshaApp.navigateTo('books')" class="hover:text-amber-600 transition">e-Balbharati Textbook Catalogue</button></li>
                <li><button onclick="ShikshaApp.navigateTo('mathLab')" class="hover:text-amber-600 transition">Interactive Maths Solver Lab</button></li>
                <li><button onclick="ShikshaApp.navigateTo('dashboard')" class="hover:text-amber-600 transition">My Learning Progress</button></li>
                <li><button onclick="ShikshaApp.navigateTo('about')" class="hover:text-amber-600 transition">College CEP Project Information</button></li>
              </ul>
            </div>
          </div>

          <!-- Bottom Disclaimers -->
          <div class="max-w-7xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p class="font-bold text-slate-700 dark:text-slate-300">
              ShikshaSetu • Maharashtra State Board Digital Educational Initiative (Classes 5 to 8)
            </p>
            <p class="max-w-3xl mx-auto text-[11px] text-slate-400 leading-relaxed">
              ${t("disclaimer")}
            </p>
          </div>
        </footer>
      </div>
    `;
  },

  // =============================================================
  // VIEW 1: Grand Impressive Homepage
  // =============================================================
  renderHomeView: function(container) {
    const t = this.getTranslation.bind(this);
    const user = this.currentUser;
    const progress = window.ShikshaSettings ? window.ShikshaSettings.calculateProgress(this.currentStandard) : { percentage: 0 };
    const history = window.ShikshaSettings ? window.ShikshaSettings.getHistory() : [];
    const lastVisited = history.length > 0 ? history[0] : null;

    container.innerHTML = `
      <div class="space-y-10 sm:space-y-14">
        <!-- 1. Hero Section -->
        <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
          <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div class="lg:col-span-7 space-y-5">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-wide">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>Maharashtra State Board Middle School Portal</span>
              </div>

              <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
                ${t("heroHeading")}
              </h1>

              <p class="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                ${t("heroSubtext")}
              </p>

              <div class="pt-2 flex flex-wrap items-center gap-3">
                <button onclick="ShikshaApp.navigateTo('standard')" class="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5 text-sm sm:text-base flex items-center gap-2">
                  <i data-lucide="play-circle" class="w-5 h-5"></i>
                  <span>${t("startLearning")}</span>
                </button>
                <button onclick="ShikshaApp.navigateTo('books')" class="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 transition text-sm sm:text-base flex items-center gap-2 backdrop-blur">
                  <i data-lucide="book-open" class="w-5 h-5 text-amber-400"></i>
                  <span>${t("exploreBooks")}</span>
                </button>
              </div>

              <!-- Quick proof points -->
              <div class="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div class="flex items-center gap-1.5">
                  <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
                  <span>229 Balbharati Chapters</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i data-lucide="flask-conical" class="w-4 h-4 text-sky-400"></i>
                  <span>11 HTML5 Science Labs</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <i data-lucide="file-text" class="w-4 h-4 text-amber-400"></i>
                  <span>Downloadable PDFs</span>
                </div>
              </div>
            </div>

            <!-- Hero Interactive Preview Card -->
            <div class="lg:col-span-5">
              <div class="bg-gradient-to-tr from-white/10 to-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-white/10">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span class="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                    <span class="text-[11px] font-bold text-slate-300 ml-1">ShikshaSetu Live Console</span>
                  </div>
                  <span class="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
                </div>

                <!-- Learning Progress Preview -->
                <div class="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-slate-400">Class 7 Balbharti Mastery</span>
                    <span class="font-black text-amber-400">22 / 57 Done (38%)</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div class="bg-gradient-to-r from-amber-500 to-emerald-400 h-2 rounded-full" style="width: 38%"></div>
                  </div>
                </div>

                <!-- 3 Quick Live Feature Cards -->
                <div class="space-y-2 text-xs">
                  <div onclick="ShikshaApp.openChapter('std7_sci_ch1')" class="cursor-pointer p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                        <i data-lucide="play" class="w-4 h-4"></i>
                      </div>
                      <div>
                        <strong class="block text-white text-[11px]">The Living World: Adaptation</strong>
                        <span class="text-[10px] text-slate-400">Science • Interactive Lab</span>
                      </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500"></i>
                  </div>

                  <div onclick="ShikshaApp.openChapter('std7_math_ch13')" class="cursor-pointer p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                        <i data-lucide="calculator" class="w-4 h-4"></i>
                      </div>
                      <div>
                        <strong class="block text-white text-[11px]">Pythagoras' Theorem (a² + b² = c²)</strong>
                        <span class="text-[10px] text-slate-400">Maths • Step-by-Step Solver</span>
                      </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 2. Continue Learning Section (Prominent!) -->
        <section class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Personalized Learning Stream
              </span>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                ${t("continueLearning")}
              </h2>
            </div>
            ${user ? `
              <button onclick="ShikshaApp.navigateTo('dashboard')" class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                <span>View Full Dashboard</span>
                <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
              </button>
            ` : ''}
          </div>

          ${lastVisited ? `
            <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-amber-50/50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-amber-200/60 dark:border-slate-700">
              <div class="md:col-span-8 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
                    Std ${lastVisited.standard} • ${lastVisited.subject.toUpperCase()}
                  </span>
                  <span class="text-xs text-slate-400">Chapter ${lastVisited.chapterNumber}</span>
                </div>
                <h3 class="text-lg font-extrabold text-slate-900 dark:text-white">
                  ${lastVisited.titleEn}
                </h3>
                <p class="text-xs text-amber-700 dark:text-amber-400 font-serif">
                  ${lastVisited.titleMr}
                </p>
              </div>
              <div class="md:col-span-4 flex items-center justify-end gap-2">
                <button onclick="ShikshaApp.openChapter('${lastVisited.id}')" class="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 transition">
                  <i data-lucide="play" class="w-4 h-4"></i>
                  <span>${t("resumeButton")}</span>
                </button>
              </div>
            </div>
          ` : `
            <div class="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <i data-lucide="sparkles" class="w-8 h-8 text-amber-500 mx-auto"></i>
              <h4 class="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Ready to begin your Maharashtra Balbharati studies?
              </h4>
              <p class="text-xs text-slate-500 max-w-md mx-auto">
                ${t("noActiveSession")}
              </p>
              <div class="pt-2 flex justify-center gap-2">
                <button onclick="ShikshaApp.selectStandard(7)" class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
                  Explore Class 7th
                </button>
                <button onclick="ShikshaAuth.loginAsDemo()" class="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs">
                  Try Demo Account
                </button>
              </div>
            </div>
          `}
        </section>

        <!-- 3. Explore by Standard (इयत्ता निवडा) -->
        <section class="space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Maharashtra State Board Middle School
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                ${t("selectStandard")} (इयत्ता निवडा)
              </h2>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            ${[
              { std: 5, label: "Standard 5 (इयत्ता ५ वी)", count: 56, desc: "Foundations of Solar System, Water Cycle, Roman Numerals, Fractions, and Stone Age Civilizations.", color: "from-blue-500 to-cyan-500", icon: "compass" },
              { std: 6, label: "Standard 6 (इयत्ता ६ वी)", count: 56, desc: "Living World, States of Matter, Integers, HCF/LCM, Ratio-Proportion, and Harappan Culture.", color: "from-emerald-500 to-teal-500", icon: "feather" },
              { std: 7, label: "Standard 7 (इयत्ता ७ वी)", count: 57, desc: "Plant Adaptations, Human Digestion, Pythagoras Theorem, Indices, and Chhatrapati Shivaji Maharaj Swaraj.", color: "from-amber-500 to-orange-500", icon: "award" },
              { std: 8, label: "Standard 8 (इयत्ता ८ वी)", count: 60, desc: "Atomic Model, Current Electricity, Expansion Formulae, Compound Interest, and 1857 Freedom War.", color: "from-purple-500 to-indigo-500", icon: "zap" }
            ].map(s => `
              <div onclick="ShikshaApp.selectStandard(${s.std})" class="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${s.color} shadow-md">
                      Class ${s.std}
                    </span>
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-600 dark:text-slate-300 flex items-center justify-center transition">
                      <i data-lucide="${s.icon}" class="w-5 h-5"></i>
                    </div>
                  </div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                    ${s.label}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    ${s.desc}
                  </p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  <span>${s.count} Verified Chapters</span>
                  <div class="flex items-center gap-1">
                    <span>Explore Class</span>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 transform group-hover:translate-x-1 transition"></i>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </section>

        <!-- 4. Explore Subjects (विषय निवडा) -->
        <section class="space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Core Balbharati Curriculum
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                ${t("selectSubject")} (विषय निवडा)
              </h2>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            ${[
              { id: "science", titleEn: "General Science", titleMr: "सामान्य विज्ञान", icon: "flask-conical", color: "from-blue-500 to-indigo-600", badge: "11 Active Simulations", desc: "Solar System, Water Cycle, Living World, Photosynthesis, Electric Circuits, Digestive System, and Bohr's Atom." },
              { id: "maths", titleEn: "Mathematics", titleMr: "गणित", icon: "calculator", color: "from-amber-500 to-orange-600", badge: "Step-by-Step Solved", desc: "Numbers, Fractions, HCF/LCM ladder method, Pythagoras Theorem, Algebraic Formulae, and Compound Interest." },
              { id: "english", titleEn: "English Balbharati", titleMr: "इंग्रजी बालभारती", icon: "book-open", color: "from-emerald-500 to-teal-600", badge: "Poems & Literature", desc: "Inspiring poems, classic stories by Emily Brontë and Tagore, glossaries, rhyming schemes, and grammar exercises." },
              { id: "socialScience", titleEn: "Social Science", titleMr: "इतिहास व नागरिकशास्त्र", icon: "landmark", color: "from-rose-500 to-pink-600", badge: "History & Civics", desc: "Harappan Civilization, Chhatrapati Shivaji Maharaj Swaraj, 1857 Freedom War, Indian Constitution & Parliament." }
            ].map(sub => `
              <div onclick="ShikshaApp.selectSubject('${sub.id}')" class="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${sub.color} text-white flex items-center justify-center shadow-lg mb-4">
                    <i data-lucide="${sub.icon}" class="w-6 h-6"></i>
                  </div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
                    ${sub.badge}
                  </span>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                    ${sub.titleEn}
                  </h3>
                  <p class="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                    ${sub.titleMr}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    ${sub.desc}
                  </p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  <span>Explore Chapters</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition"></i>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  },

  // =============================================================
  // VIEW 2: Dedicated e-Balbharati Inspired Textbook Catalogue
  // =============================================================
  renderBooksView: function(container) {
    const t = this.getTranslation.bind(this);
    const books = window.SHIKSHA_BOOKS || [];
    const f = this.bookFilters;

    // Apply strict multi-filter in e-Balbharati order:
    // 1. Syllabus Year, 2. Book Type, 3. Standard, 4. Medium, 5. Subject, 6. Search
    let filtered = books.filter(b => {
      if (f.syllabusYear !== "all" && b.syllabusYear !== f.syllabusYear) return false;
      if (f.bookType !== "all" && b.bookType !== f.bookType) return false;
      if (f.standard !== "all" && b.standard !== parseInt(f.standard)) return false;
      if (f.medium !== "all" && b.medium !== f.medium) return false;
      if (f.subject !== "all" && b.subject !== f.subject) return false;
      if (f.search && f.search.trim() !== "") {
        const q = f.search.toLowerCase();
        const matches = b.titleEn.toLowerCase().includes(q) ||
                        b.titleMr.toLowerCase().includes(q) ||
                        b.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Catalogue Title & Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <i data-lucide="book-open" class="w-4 h-4"></i>
              </span>
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                ${t("catalogueTitle")}
              </h1>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ${t("catalogueSubtitle")} • Official Maharashtra State Bureau of Textbook Production (e-Balbharati)
            </p>
          </div>
          <button onclick="ShikshaApp.resetBookFilters()" class="self-start sm:self-auto px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
            <span>${t("clearFilters")}</span>
          </button>
        </div>

        <!-- Strict Catalogue Filter Bar (6 Ordered Filters) -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
            <!-- 1. Syllabus Year -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${t("filterYear")}
              </label>
              <select onchange="ShikshaApp.bookFilters.syllabusYear = this.value; ShikshaApp.renderBooksView(document.getElementById('view-container'))" class="w-full py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all" ${f.syllabusYear === 'all' ? 'selected' : ''}>All Years</option>
                <option value="2024-25" ${f.syllabusYear === '2024-25' ? 'selected' : ''}>2024-25 (Latest)</option>
                <option value="2023-24" ${f.syllabusYear === '2023-24' ? 'selected' : ''}>2023-24</option>
                <option value="2022-23" ${f.syllabusYear === '2022-23' ? 'selected' : ''}>2022-23</option>
              </select>
            </div>

            <!-- 2. Book Type -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${t("filterType")}
              </label>
              <select onchange="ShikshaApp.bookFilters.bookType = this.value; ShikshaApp.renderBooksView(document.getElementById('view-container'))" class="w-full py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all" ${f.bookType === 'all' ? 'selected' : ''}>All Types</option>
                <option value="textbook" ${f.bookType === 'textbook' ? 'selected' : ''}>Textbooks</option>
                <option value="notes" ${f.bookType === 'notes' ? 'selected' : ''}>Supplementary Notes</option>
                <option value="workbook" ${f.bookType === 'workbook' ? 'selected' : ''}>Workbooks</option>
              </select>
            </div>

            <!-- 3. Standard -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${t("filterStandard")}
              </label>
              <select onchange="ShikshaApp.bookFilters.standard = this.value; ShikshaApp.renderBooksView(document.getElementById('view-container'))" class="w-full py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all" ${f.standard === 'all' ? 'selected' : ''}>All Standards</option>
                <option value="5" ${f.standard === '5' ? 'selected' : ''}>Standard 5</option>
                <option value="6" ${f.standard === '6' ? 'selected' : ''}>Standard 6</option>
                <option value="7" ${f.standard === '7' ? 'selected' : ''}>Standard 7</option>
                <option value="8" ${f.standard === '8' ? 'selected' : ''}>Standard 8</option>
              </select>
            </div>

            <!-- 4. Medium -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${t("filterMedium")}
              </label>
              <select onchange="ShikshaApp.bookFilters.medium = this.value; ShikshaApp.renderBooksView(document.getElementById('view-container'))" class="w-full py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all" ${f.medium === 'all' ? 'selected' : ''}>All Mediums</option>
                <option value="english" ${f.medium === 'english' ? 'selected' : ''}>English Medium</option>
                <option value="marathi" ${f.medium === 'marathi' ? 'selected' : ''}>मराठी माध्यम (Marathi)</option>
                <option value="hindi" ${f.medium === 'hindi' ? 'selected' : ''}>हिंदी माध्यम (Hindi)</option>
              </select>
            </div>

            <!-- 5. Subject -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${t("filterSubject")}
              </label>
              <select onchange="ShikshaApp.bookFilters.subject = this.value; ShikshaApp.renderBooksView(document.getElementById('view-container'))" class="w-full py-2 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="all" ${f.subject === 'all' ? 'selected' : ''}>All Subjects</option>
                <option value="maths" ${f.subject === 'maths' ? 'selected' : ''}>Mathematics (गणित)</option>
                <option value="science" ${f.subject === 'science' ? 'selected' : ''}>Science (सामान्य विज्ञान)</option>
                <option value="english" ${f.subject === 'english' ? 'selected' : ''}>English Balbharati</option>
                <option value="socialScience" ${f.subject === 'socialScience' ? 'selected' : ''}>Social Science (इतिहास/भूगोल)</option>
              </select>
            </div>

            <!-- 6. Search keyword -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                ${t("filterSearch")}
              </label>
              <div class="relative">
                <i data-lucide="search" class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5"></i>
                <input type="text" placeholder="${t("searchBooksPlaceholder")}" value="${f.search}" oninput="ShikshaApp.bookFilters.search = this.value; ShikshaApp.renderBooksView(document.getElementById('view-container'))" class="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
              </div>
            </div>
          </div>

          <!-- Filter Result Status Bar -->
          <div class="pt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>
              ${t("showingBooks")}: <strong>${filtered.length}</strong> of ${books.length} publications
            </span>
            <span class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
              <span>Verified Balbharati Metadata</span>
            </span>
          </div>
        </div>

        <!-- Books Grid -->
        ${filtered.length === 0 ? `
          <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <i data-lucide="book-x" class="w-12 h-12 text-slate-400 mx-auto"></i>
            <h3 class="text-base font-bold text-slate-700 dark:text-slate-300">${t("noBooksFound")}</h3>
            <p class="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
            <button onclick="ShikshaApp.resetBookFilters()" class="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
              ${t("clearFilters")}
            </button>
          </div>
        ` : `
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            ${filtered.map(b => {
              const chTarget = `std${b.standard}_${b.subject.substring(0,3)}_ch1`;
              const chObj = (window.SHIKSHA_SYLLABUS || []).find(c => c.standard === b.standard && c.subject === b.subject);

              return `
                <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <!-- Book Header / Cover Simulation -->
                  <div class="bg-gradient-to-r ${b.coverColor} p-6 text-white relative">
                    <div class="flex items-center justify-between mb-3">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-black/30 backdrop-blur">
                        Class ${b.standard} • ${b.medium.toUpperCase()}
                      </span>
                      <span class="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded-full">
                        ${b.syllabusYear}
                      </span>
                    </div>

                    <div class="flex items-center gap-3 mt-2">
                      <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center font-bold text-white shrink-0">
                        <i data-lucide="${b.coverIcon}" class="w-6 h-6"></i>
                      </div>
                      <div>
                        <h3 class="font-black text-base leading-tight">${b.titleEn}</h3>
                        <p class="text-xs text-white/80 font-serif mt-0.5">${b.titleMr}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Book Details Body -->
                  <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                      <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                        ${b.description}
                      </p>

                      <div class="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span class="font-semibold">Publisher: ${b.board}</span>
                        <span>•</span>
                        <span>${b.totalChapters} Chapters</span>
                        <span>•</span>
                        <span>${b.fileSize}</span>
                      </div>
                    </div>

                    <!-- Book Actions -->
                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                      <button onclick="ShikshaApp.openBookDetail('${b.id}')" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm">
                        <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                        <span>${t("viewBook")}</span>
                      </button>

                      <div class="flex items-center gap-1.5">
                        ${chObj ? `
                          <button onclick="ShikshaPDF.openReader(window.SHIKSHA_SYLLABUS.find(c => c.id === '${chObj.id}'))" class="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition flex items-center gap-1" title="In-browser Reader">
                            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                            <span class="hidden sm:inline">${t("openPdf")}</span>
                          </button>
                        ` : ''}
                        <button onclick="ShikshaPDF.downloadPDF('${chTarget}')" class="px-2.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition flex items-center gap-1" title="Download Verified Notes">
                          <i data-lucide="download" class="w-3.5 h-3.5"></i>
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  resetBookFilters: function() {
    this.bookFilters = {
      syllabusYear: "all",
      bookType: "all",
      standard: "all",
      medium: "all",
      subject: "all",
      search: ""
    };
    this.renderBooksView(document.getElementById("view-container"));
  },

  openBookDetail: function(bookId) {
    const book = (window.SHIKSHA_BOOKS || []).find(b => b.id === bookId);
    if (!book) return;
    this.currentStandard = book.standard;
    this.currentSubject = book.subject;
    this.navigateTo("chapterList");
  },

  // =============================================================
  // VIEW 3: Standard Page
  // =============================================================
  renderStandardView: function(container) {
    const t = this.getTranslation.bind(this);
    const standards = [
      { std: 5, titleEn: "5th Standard (इयत्ता ५ वी)", desc: "Foundations of Solar System, Earth motions, Roman Numerals, Fractions, and Indian History.", badge: "Class 5", color: "from-blue-500 to-cyan-500", icon: "compass" },
      { std: 6, titleEn: "6th Standard (इयत्ता ६ वी)", desc: "States of matter, Natural resources, Integers, HCF/LCM, Ratio & Proportion, Harappan civilization.", badge: "Class 6", color: "from-emerald-500 to-teal-500", icon: "feather" },
      { std: 7, titleEn: "7th Standard (इयत्ता ७ वी)", desc: "Living world adaptations, Human digestion, Static electricity, Pythagoras theorem, Swaraj foundation.", badge: "Class 7", color: "from-amber-500 to-orange-500", icon: "award" },
      { std: 8, titleEn: "8th Standard (इयत्ता ८ वी)", desc: "Atomic structure, Current electricity & magnetism, Expansion formulae, Compound interest, 1857 war.", badge: "Class 8", color: "from-purple-500 to-indigo-500", icon: "zap" }
    ];

    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Maharashtra State Board Syllabus
          </span>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            ${t("selectStandard")} (इयत्ता निवडा)
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ${t("selectStandardDesc")}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${standards.map(s => {
            const count = (window.SHIKSHA_SYLLABUS || []).filter(c => c.standard === s.std).length;
            return `
              <div onclick="ShikshaApp.selectStandard(${s.std})" class="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="px-3 py-1 rounded-full text-xs font-black text-white bg-gradient-to-r ${s.color} shadow-md">
                      ${s.badge}
                    </span>
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-amber-500 group-hover:text-slate-950 text-slate-600 dark:text-slate-300 flex items-center justify-center transition">
                      <i data-lucide="${s.icon}" class="w-5 h-5"></i>
                    </div>
                  </div>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                    ${s.titleEn}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    ${s.desc}
                  </p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  <span>${count} Active Chapters</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition"></i>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // =============================================================
  // VIEW 4: Choose Subject
  // =============================================================
  renderSubjectView: function(container) {
    const t = this.getTranslation.bind(this);
    const std = this.currentStandard || 7;

    const subjects = [
      { id: "science", titleEn: t("science"), titleMr: "सामान्य विज्ञान", icon: "flask-conical", color: "from-blue-500 to-indigo-600", badge: "Interactive Simulations", desc: "Solar System, Water Cycle, Photosynthesis, Molecular Motion, Electric Circuits, Digestive Peristalsis, Reflection & Atoms." },
      { id: "maths", titleEn: t("maths"), titleMr: "गणित", icon: "calculator", color: "from-amber-500 to-orange-600", badge: "Numerically Solved Steps", desc: "Large numbers, Fractions, Integers, HCF/LCM ladder method, Pythagoras Theorem, Indices, Algebraic expansions, Compound Interest." },
      { id: "english", titleEn: t("english"), titleMr: "इंग्रजी बालभारती", icon: "book-open", color: "from-emerald-500 to-teal-600", badge: "Poems & Literature", desc: "Inspiring poems by Emily Bronte and Phoebe Cary, comprehension glossaries, rhyming schemes, and grammar exercises." },
      { id: "socialScience", titleEn: t("socialScience"), titleMr: "इतिहास व नागरिकशास्त्र", icon: "landmark", color: "from-rose-500 to-pink-600", badge: "History & Geography", desc: "Harappan civilization, Chhatrapati Shivaji Maharaj Swaraj foundation, 1857 Freedom struggle, Earth graticules & local time." }
    ];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Standard ${std}th Curriculum
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              ${t("selectSubject")} (विषय निवडा)
            </h2>
          </div>
          <button onclick="ShikshaApp.navigateTo('standard')" class="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold">
            Change Standard
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${subjects.map(s => {
            const count = (window.SHIKSHA_SYLLABUS || []).filter(c => c.standard === std && c.subject === s.id).length;
            return `
              <div onclick="ShikshaApp.selectSubject('${s.id}')" class="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-lg mb-4">
                    <i data-lucide="${s.icon}" class="w-6 h-6"></i>
                  </div>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-2">
                    ${s.badge}
                  </span>
                  <h3 class="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                    ${s.titleEn}
                  </h3>
                  <p class="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                    ${s.titleMr}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    ${s.desc}
                  </p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                  <span>${count} Chapters</span>
                  <i data-lucide="arrow-right" class="w-4 h-4 transform group-hover:translate-x-1 transition"></i>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // =============================================================
  // VIEW 5: Chapter List
  // =============================================================
  renderChapterListView: function(container) {
    const t = this.getTranslation.bind(this);
    const std = this.currentStandard || 7;
    const subj = this.currentSubject || "science";

    let chapters = (window.SHIKSHA_SYLLABUS || []).filter(c => c.standard === std && c.subject === subj);
    chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      chapters = chapters.filter(c =>
        c.titleEn.toLowerCase().includes(q) ||
        c.titleMr.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q)
      );
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top bar with search & info -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Class ${std}th • ${subj.toUpperCase()}
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              ${t("selectChapter")} (धडा निवडा)
            </h2>
          </div>

          <!-- Search box -->
          <div class="relative w-full sm:w-72">
            <i data-lucide="search" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
            <input type="text" placeholder="${t("searchPlaceholder")}" value="${this.searchQuery}" oninput="ShikshaApp.searchQuery = this.value; ShikshaApp.renderChapterListView(document.getElementById('view-container'));" class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500">
          </div>
        </div>

        <!-- Chapters List Grid -->
        ${chapters.length === 0 ? `
          <div class="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <i data-lucide="book-x" class="w-12 h-12 text-slate-400 mx-auto mb-3"></i>
            <h4 class="font-bold text-slate-700 dark:text-slate-300">No chapters found</h4>
            <p class="text-xs text-slate-500 mt-1">Try a different search term or subject.</p>
          </div>
        ` : `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${chapters.map(ch => {
              const lang = this.currentLanguage;
              const chTitle = lang === "mr" ? ch.titleMr : (lang === "hi" ? ch.titleHi : ch.titleEn);
              const isDone = window.ShikshaSettings ? window.ShikshaSettings.isCompleted(ch.id) : false;
              const quizScore = window.ShikshaQuiz ? window.ShikshaQuiz.getSavedScore(ch.id) : null;

              return `
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                  <div>
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-3">
                        <span class="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/20">
                          ${ch.chapterNumber}
                        </span>
                        <div>
                          <h4 class="font-bold text-base text-slate-900 dark:text-white leading-tight">
                            ${chTitle}
                          </h4>
                          <span class="text-xs text-slate-400 font-serif">${ch.titleMr}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1.5 flex-wrap justify-end">
                        ${isDone ? `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <i data-lucide="check" class="w-3 h-3"></i>
                            <span>${t("completedBadge")}</span>
                          </span>
                        ` : ''}
                        ${quizScore ? `
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center gap-1 border border-amber-300/50">
                            <i data-lucide="award" class="w-3 h-3"></i>
                            <span>Quiz: ${quizScore.percentage}%</span>
                          </span>
                        ` : ''}
                      </div>
                    </div>

                    <p class="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                      ${ch.summary}
                    </p>

                    <!-- Feature Badges -->
                    <div class="flex flex-wrap gap-1.5 mt-3">
                      ${ch.simulationId ? `
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300">
                          <i data-lucide="play-circle" class="w-3 h-3"></i>
                          <span>Interactive Animation</span>
                        </span>
                      ` : ''}
                      ${ch.solvedExamples && ch.solvedExamples.length > 0 ? `
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          <i data-lucide="calculator" class="w-3 h-3"></i>
                          <span>${ch.solvedExamples.length} Solved Numericals</span>
                        </span>
                      ` : ''}
                      ${ch.quiz && ch.quiz.length > 0 ? `
                        <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300">
                          <i data-lucide="help-circle" class="w-3 h-3"></i>
                          <span>${ch.quiz.length} Quiz Questions</span>
                        </span>
                      ` : ''}
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        <i data-lucide="file-text" class="w-3 h-3"></i>
                        <span>PDF Ready</span>
                      </span>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                    <button onclick="ShikshaApp.openChapter('${ch.id}')" class="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl transition flex items-center gap-1">
                      <span>Study Chapter</span>
                      <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                    </button>
                    <div class="flex items-center gap-1.5">
                      <button onclick="event.stopPropagation(); ShikshaQuiz.startQuiz(window.SHIKSHA_SYLLABUS.find(c => c.id === '${ch.id}'))" class="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 font-bold rounded-xl transition flex items-center gap-1 border border-amber-300/40" title="Take Chapter Quiz">
                        <i data-lucide="help-circle" class="w-3.5 h-3.5"></i>
                        <span>Quiz</span>
                      </button>
                      <button onclick="ShikshaPDF.openReader(window.SHIKSHA_SYLLABUS.find(c => c.id === '${ch.id}'))" class="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition" title="Read Textbook PDF">
                        <i data-lucide="book-open" class="w-3.5 h-3.5"></i>
                      </button>
                      <button onclick="ShikshaPDF.downloadPDF('${ch.id}')" class="px-2 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition" title="Download PDF Notes">
                        <i data-lucide="download" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- All-Chapters Subject Mega Revision Quiz Card -->
          <div class="mt-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-300/60 dark:border-amber-700/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <i data-lucide="award" class="w-7 h-7"></i>
              </div>
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">All-Chapters Comprehensive Test</span>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">
                  ${subj.toUpperCase()} All-Chapters Revision Quiz
                </h3>
                <p class="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                  Test your mastery across all ${chapters.length} chapters in <strong>Class ${std} ${subj.toUpperCase()}</strong> with a randomized multi-chapter knowledge test!
                </p>
              </div>
            </div>
            <button onclick="ShikshaQuiz.startSubjectMegaQuiz(${std}, '${subj}')" class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/25 transition whitespace-nowrap flex items-center gap-2 text-sm">
              <i data-lucide="play" class="w-4 h-4"></i>
              <span>Take All-Chapters Quiz</span>
            </button>
          </div>
        `}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // =============================================================
  // VIEW 6: Chapter Detail View (Topics, Simulation, Exercises)
  // =============================================================
  renderChapterDetailView: function(container) {
    const t = this.getTranslation.bind(this);
    const ch = (window.SHIKSHA_SYLLABUS || []).find(c => c.id === this.currentChapterId);
    if (!ch) {
      container.innerHTML = `<p class="p-6">Chapter not found.</p>`;
      return;
    }

    const lang = this.currentLanguage;
    const chTitle = lang === "mr" ? ch.titleMr : (lang === "hi" ? ch.titleHi : ch.titleEn);
    const isDone = window.ShikshaSettings ? window.ShikshaSettings.isCompleted(ch.id) : false;
    const quizScore = window.ShikshaQuiz ? window.ShikshaQuiz.getSavedScore(ch.id) : null;
    const quizQuestions = (ch.quiz && ch.quiz.length > 0) ? ch.quiz : (ch.exercises || []);
    const topics = window.ShikshaTopics ? window.ShikshaTopics.getTopicsForChapter(ch) : [];

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Chapter Header Banner -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950">
                Class ${ch.standard} • ${ch.subject.toUpperCase()}
              </span>
              <span class="text-xs font-serif text-slate-400">Chapter ${ch.chapterNumber}</span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ${chTitle}
            </h1>
            <p class="text-sm font-serif text-amber-600 dark:text-amber-400 mt-0.5">
              ${ch.titleMr}
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="flex flex-wrap items-center gap-2">
            <button onclick="ShikshaQuiz.startQuiz(window.SHIKSHA_SYLLABUS.find(c => c.id === '${ch.id}'))" class="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="help-circle" class="w-4 h-4"></i>
              <span>${t("takeQuiz")}</span>
            </button>
            <button id="ch-audio-btn" onclick="ShikshaSettings.toggleAudio('${ch.summary.replace(/'/g, "\\'")}', 'ch-audio-btn')" class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-transparent" title="Listen to summary (click to play or stop)">
              <i data-lucide="volume-2" class="w-4 h-4 text-amber-500"></i>
              <span>${t("readAloud")}</span>
            </button>
            <button onclick="ShikshaPDF.openReader(window.SHIKSHA_SYLLABUS.find(c => c.id === '${ch.id}'))" class="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition">
              <i data-lucide="book-open" class="w-4 h-4"></i>
              <span>${t("openPdf")}</span>
            </button>
            <button onclick="ShikshaPDF.downloadPDF('${ch.id}')" class="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition">
              <i data-lucide="download" class="w-4 h-4"></i>
              <span>${t("downloadPdf")}</span>
            </button>
            <button onclick="ShikshaSettings.toggleCompleted('${ch.id}')" class="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'}">
              <i data-lucide="${isDone ? 'check-circle-2' : 'circle'}" class="w-4 h-4"></i>
              <span>${isDone ? t("completedBadge") : t("markCompleted")}</span>
            </button>
          </div>
        </div>

        <!-- Topics Under this Chapter (Curriculum Hierarchy) -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="list-tree" class="w-5 h-5 text-amber-500"></i>
              <span>Chapter Topics & Deep Dives (${topics.length} Topics)</span>
            </h3>
            <span class="text-xs text-slate-400">Step-by-step reading modules</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            ${topics.map(top => `
              <div onclick="ShikshaApp.openTopic('${ch.id}', '${top.id}')" class="group cursor-pointer p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 bg-slate-50/50 dark:bg-slate-800/40 transition flex items-center justify-between gap-3">
                <div class="flex items-center gap-3">
                  <span class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-400 font-black flex items-center justify-center text-xs">
                    ${top.topicNumber}
                  </span>
                  <div>
                    <h4 class="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-500 transition">
                      ${lang === 'mr' ? top.titleMr : (lang === 'hi' ? top.titleHi : top.titleEn)}
                    </h4>
                    <span class="text-[11px] text-slate-400 line-clamp-1">${top.objectives[0]}</span>
                  </div>
                </div>
                <button class="px-3 py-1.5 bg-amber-500 group-hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0">
                  <span>Read</span>
                  <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Interactive Science Simulation (if present) -->
        ${ch.simulationId ? `
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="play-circle" class="w-5 h-5 text-sky-500"></i>
                <span>${t("openSim")} (सक्रिय विज्ञान ॲनिमेशन)</span>
              </h3>
              <span class="text-xs text-slate-400">Interactive Controls Active</span>
            </div>
            <div id="sim-mount-point"></div>
          </div>
        ` : ''}

        <!-- Can you recall? callout -->
        ${ch.canYouRecall ? `
          <div class="p-5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border-l-4 border-sky-500 text-sm">
            <h4 class="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2 mb-1">
              <i data-lucide="help-circle" class="w-5 h-5"></i>
              <span>${t("canYouRecall")}</span>
            </h4>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-1">
              ${ch.canYouRecall}
            </p>
          </div>
        ` : ''}

        <!-- Key Concepts -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="layers" class="w-5 h-5 text-amber-500"></i>
            <span>${t("keyConcepts")}</span>
          </h3>
          <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            ${ch.summary}
          </p>
          ${ch.keyPoints ? `
            <div class="space-y-2 pt-2">
              <h5 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Essential Learning Outcomes:</h5>
              <ul class="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-5">
                ${ch.keyPoints.map(kp => `<li class="leading-relaxed">${kp}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Solved Numericals -->
        ${ch.solvedExamples && ch.solvedExamples.length > 0 ? `
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="calculator" class="w-5 h-5 text-indigo-500"></i>
                <span>${t("solvedExamples")} (${ch.solvedExamples.length} Examples)</span>
              </h3>
            </div>
            <div class="grid grid-cols-1 gap-4">
              ${ch.solvedExamples.map((ex, i) => window.ShikshaMath.renderExampleCard(ex, i)).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Exercises -->
        ${ch.exercises && ch.exercises.length > 0 ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="check-square" class="w-5 h-5 text-emerald-500"></i>
              <span>${t("exercise")}</span>
            </h3>
            <div class="space-y-3">
              ${ch.exercises.map((item, idx) => `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
                  <p class="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Q.${idx + 1} ${item.q}
                  </p>
                  <p class="mt-2 text-slate-700 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-emerald-500">
                    <strong class="text-emerald-600 dark:text-emerald-400">Answer:</strong> ${item.a}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Chapter Quiz Section -->
        <div class="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40 rounded-3xl p-6 sm:p-8 border-2 border-amber-400/60 dark:border-amber-600/40 shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <i data-lucide="help-circle" class="w-5 h-5"></i>
                </span>
                <h3 class="text-xl font-black text-slate-900 dark:text-white">
                  ${t("quizTitle")} (${quizQuestions.length} Questions)
                </h3>
              </div>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Test your mastery of <strong>${chTitle}</strong> with instant scoring and detailed review!
              </p>
            </div>

            ${quizScore ? `
              <div class="px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 shadow-sm text-center">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Previous Best</span>
                <span class="text-lg font-black text-amber-600 dark:text-amber-400">${quizScore.score}/${quizScore.total} (${quizScore.percentage}%)</span>
              </div>
            ` : ''}
          </div>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button onclick="ShikshaQuiz.startQuiz(window.SHIKSHA_SYLLABUS.find(c => c.id === '${ch.id}'))" class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/25 transition inline-flex items-center gap-2 text-sm">
              <i data-lucide="play-circle" class="w-5 h-5"></i>
              <span>${quizScore ? t("retakeQuiz") : t("takeQuiz")}</span>
            </button>
            <span class="text-xs text-slate-500 dark:text-slate-400">
              Score ≥ 60% automatically awards chapter completion!
            </span>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    if (ch.simulationId) {
      const mount = document.getElementById("sim-mount-point");
      if (mount && window.ShikshaSimulations) {
        window.ShikshaSimulations.init(ch.simulationId, mount);
      }
    }
  },

  // =============================================================
  // VIEW 7: Distraction-Free Topic Learning Page
  // =============================================================
  renderTopicView: function(container) {
    const t = this.getTranslation.bind(this);
    const ch = (window.SHIKSHA_SYLLABUS || []).find(c => c.id === this.currentChapterId);
    if (!ch) {
      container.innerHTML = `<p class="p-6">Chapter not found.</p>`;
      return;
    }

    const topics = window.ShikshaTopics ? window.ShikshaTopics.getTopicsForChapter(ch) : [];
    const topicIdx = topics.findIndex(t => t.id === this.currentTopicId);
    const currentTopic = topicIdx !== -1 ? topics[topicIdx] : topics[0];
    const prevTopic = topicIdx > 0 ? topics[topicIdx - 1] : null;
    const nextTopic = topicIdx < topics.length - 1 ? topics[topicIdx + 1] : null;

    const lang = this.currentLanguage;
    const topicTitle = lang === "mr" ? currentTopic.titleMr : (lang === "hi" ? currentTopic.titleHi : currentTopic.titleEn);
    const isDone = window.ShikshaSettings ? window.ShikshaSettings.isCompleted(ch.id) : false;

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Topic Header & Navigation -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-slate-950">
              Std ${ch.standard} • ${ch.subject.toUpperCase()} • Topic ${currentTopic.topicNumber} of ${topics.length}
            </span>
            <span class="text-xs text-slate-400 font-serif">Chapter ${ch.chapterNumber}: ${ch.titleEn}</span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
            ${topicTitle}
          </h1>

          <div class="pt-2 flex flex-wrap items-center gap-2">
            <button id="top-audio-btn" onclick="ShikshaSettings.toggleAudio('${currentTopic.intro.replace(/'/g, "\\'")}', 'top-audio-btn')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition border border-transparent" title="Listen to topic intro (click to play or stop)">
              <i data-lucide="volume-2" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>${t("readAloud")}</span>
            </button>
            <button onclick="ShikshaPDF.downloadPDF('${ch.id}')" class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Download Topic PDF</span>
            </button>
            <button onclick="ShikshaSettings.toggleCompleted('${ch.id}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${isDone ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'}">
              <i data-lucide="${isDone ? 'check-circle-2' : 'circle'}" class="w-3.5 h-3.5"></i>
              <span>${isDone ? t("completedBadge") : t("markCompleted")}</span>
            </button>
          </div>
        </div>

        <!-- 1. Learning Objectives -->
        <div class="bg-amber-50/70 dark:bg-slate-900/60 rounded-3xl p-6 border border-amber-200/60 dark:border-slate-800 space-y-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <i data-lucide="target" class="w-4 h-4"></i>
            <span>${t("topicObjectives")}</span>
          </h3>
          <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
            ${currentTopic.objectives.map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>

        <!-- 2. Simple Introduction (Age 10-14 Friendly) -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-amber-500"></i>
            <span>${t("topicIntroduction")}</span>
          </h3>
          <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            ${currentTopic.intro}
          </p>
        </div>

        <!-- 3. Detailed Explanation -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="book-open" class="w-4 h-4 text-sky-500"></i>
            <span>${t("topicExplanation")}</span>
          </h3>
          <div class="text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-3">
            ${currentTopic.explanation}
          </div>
        </div>

        <!-- 4. Important Definitions & Terminology (Cards) -->
        ${currentTopic.definitions && currentTopic.definitions.length > 0 ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="bookmark" class="w-4 h-4 text-emerald-500"></i>
              <span>${t("keyDefinitions")}</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${currentTopic.definitions.map(def => `
                <div class="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-xs space-y-1">
                  <strong class="text-emerald-800 dark:text-emerald-300 font-bold block text-sm">${def.term}</strong>
                  <p class="text-slate-600 dark:text-slate-300 leading-relaxed">${def.meaning}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 5. Examples from Everyday Life -->
        ${currentTopic.examples && currentTopic.examples.length > 0 ? `
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="lightbulb" class="w-4 h-4 text-amber-500"></i>
              <span>${t("realLifeExamples")}</span>
            </h3>
            <div class="space-y-2">
              ${currentTopic.examples.map(ex => `
                <div class="p-3.5 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border-l-4 border-amber-500 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  ${ex}
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 6. Key Points to Remember & Summary -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="space-y-2">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ${t("keyPointsToRemember")}
            </h3>
            <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
              ${currentTopic.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
            </ul>
          </div>
          <div class="pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              ${t("topicSummary")}
            </h4>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ${currentTopic.summary}
            </p>
          </div>
        </div>

        <!-- Previous, Next & Practice Quiz Controls -->
        <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            ${prevTopic ? `
              <button onclick="ShikshaApp.openTopic('${ch.id}', '${prevTopic.id}')" class="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>${t("previousTopic")}</span>
              </button>
            ` : '<div></div>'}
            ${nextTopic ? `
              <button onclick="ShikshaApp.openTopic('${ch.id}', '${nextTopic.id}')" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5">
                <span>${t("nextTopic")}</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </button>
            ` : ''}
          </div>

          <button onclick="ShikshaQuiz.startQuiz(window.SHIKSHA_SYLLABUS.find(c => c.id === '${ch.id}'))" class="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-amber-500/20">
            <i data-lucide="help-circle" class="w-4 h-4"></i>
            <span>${t("practiceQuiz")}</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // =============================================================
  // VIEW 8: Mathematics Lab
  // =============================================================
  renderMathLabView: function(container) {
    const t = this.getTranslation.bind(this);
    const stdKey = `std${this.currentStandard || 7}`;
    const bank = (window.SHIKSHA_MATH_BANK && window.SHIKSHA_MATH_BANK[stdKey]) || (window.SHIKSHA_MATH_BANK && window.SHIKSHA_MATH_BANK.std7) || [];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Interactive Mathematics Lab
            </span>
            <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              ${t("navMathLab")} (गणितीय उदाहरण प्रयोगशाळा)
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Step-by-step numerically solved Maharashtra Balbharati examples with calculation rules
            </p>
          </div>

          <!-- Class Selector for Math Lab -->
          <div class="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button onclick="ShikshaApp.currentStandard = 5; ShikshaApp.render();" class="px-3 py-1.5 rounded-xl ${this.currentStandard === 5 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-600 dark:text-slate-400'}">Std 5</button>
            <button onclick="ShikshaApp.currentStandard = 6; ShikshaApp.render();" class="px-3 py-1.5 rounded-xl ${this.currentStandard === 6 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-600 dark:text-slate-400'}">Std 6</button>
            <button onclick="ShikshaApp.currentStandard = 7; ShikshaApp.render();" class="px-3 py-1.5 rounded-xl ${this.currentStandard === 7 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-600 dark:text-slate-400'}">Std 7</button>
            <button onclick="ShikshaApp.currentStandard = 8; ShikshaApp.render();" class="px-3 py-1.5 rounded-xl ${this.currentStandard === 8 ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-600 dark:text-slate-400'}">Std 8</button>
          </div>
        </div>

        <!-- Interactive Calculator Tools -->
        ${this.currentStandard === 7 ? `
          <div id="pyth-lab-mount"></div>
        ` : ''}

        ${this.currentStandard === 8 ? `
          <div id="ci-lab-mount"></div>
        ` : ''}

        <!-- Bank of Solved Numericals -->
        <div class="space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i data-lucide="book-check" class="w-5 h-5 text-amber-500"></i>
            <span>Class ${this.currentStandard} Numerically Solved Examples</span>
          </h3>
          <div class="grid grid-cols-1 gap-4">
            ${bank.map((ex, i) => window.ShikshaMath ? window.ShikshaMath.renderExampleCard(ex, `bank-${i}`) : '').join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    if (this.currentStandard === 7) {
      const pMount = document.getElementById("pyth-lab-mount");
      if (pMount && window.ShikshaMath) window.ShikshaMath.renderPythagorasLab(pMount);
    } else if (this.currentStandard === 8) {
      const ciMount = document.getElementById("ci-lab-mount");
      if (ciMount && window.ShikshaMath) window.ShikshaMath.renderCILab(ciMount);
    }
  },

  // =============================================================
  // VIEW 9: Personalized Student Dashboard ("My Learning")
  // =============================================================
  renderDashboardView: function(container) {
    const t = this.getTranslation.bind(this);
    const user = this.currentUser || { name: "Guest Student", standard: 7, language: "en", isGuest: true };
    const std = user.standard || this.currentStandard || 7;
    const progress = window.ShikshaSettings ? window.ShikshaSettings.calculateProgress(std) : { percentage: 0, bySubject: {} };
    const history = window.ShikshaSettings ? window.ShikshaSettings.getHistory() : [];
    const quizScores = window.ShikshaQuiz ? window.ShikshaQuiz.getAllScores() : {};
    const quizAttempts = Object.values(quizScores);
    const completedList = window.ShikshaSettings ? window.ShikshaSettings.getCompleted() : [];
    const streak = window.ShikshaSettings ? window.ShikshaSettings.calculateStreak() : 1;

    // Average Quiz Score
    let avgScore = 0;
    if (quizAttempts.length > 0) {
      const sum = quizAttempts.reduce((acc, q) => acc + (q.percentage || 0), 0);
      avgScore = Math.round(sum / quizAttempts.length);
    }

    container.innerHTML = `
      <div class="space-y-8">
        <!-- Student Greeting Banner -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-10 text-slate-950 shadow-xl shadow-amber-500/20">
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-2">
              <span class="inline-block px-3 py-1 rounded-full bg-slate-950/10 text-slate-950 text-xs font-black uppercase tracking-wider">
                Class ${std} Student Dashboard
              </span>
              <h1 class="text-3xl sm:text-4xl font-black tracking-tight">
                ${t("welcomeStudent")}, ${user.name}! 🌟
              </h1>
              <p class="text-xs sm:text-sm text-slate-900/80 font-semibold max-w-xl">
                Track your syllabus completion, test scores, study streak, and continue your Balbharati journey.
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button onclick="ShikshaApp.navigateTo('books')" class="px-4 py-2.5 bg-slate-950 text-white hover:bg-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md">
                <i data-lucide="book-open" class="w-4 h-4 text-amber-400"></i>
                <span>Explore Books</span>
              </button>
              <button onclick="ShikshaApp.navigateTo('standard')" class="px-4 py-2.5 bg-white text-slate-950 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md">
                <i data-lucide="compass" class="w-4 h-4"></i>
                <span>Explore Subjects</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 4 Key Metrics Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <i data-lucide="flame" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-2xl font-black text-slate-900 dark:text-white">${streak} Days</span>
              <p class="text-xs text-slate-400 font-semibold">${t("studyStreak")}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <i data-lucide="check-circle" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-2xl font-black text-slate-900 dark:text-white">${completedList.length}</span>
              <p class="text-xs text-slate-400 font-semibold">${t("chaptersCompleted")}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
              <i data-lucide="help-circle" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-2xl font-black text-slate-900 dark:text-white">${quizAttempts.length}</span>
              <p class="text-xs text-slate-400 font-semibold">${t("quizzesTaken")}</p>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-2xl font-black text-slate-900 dark:text-white">${avgScore}%</span>
              <p class="text-xs text-slate-400 font-semibold">${t("avgQuizScore")}</p>
            </div>
          </div>
        </div>

        <!-- Overall Syllabus Progress Breakdown -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">
                ${t("overallProgress")} (Class ${std})
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">Calculated from completed Balbharati chapters</p>
            </div>
            <span class="text-2xl font-black text-amber-500">${progress.percentage}%</span>
          </div>

          <div class="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
            <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style="width: ${progress.percentage}%"></div>
          </div>

          <!-- Subject wise bars -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            ${["science", "maths", "english", "socialScience"].map(sub => {
              const stat = (progress.bySubject && progress.bySubject[sub]) || { total: 0, completed: 0, percentage: 0 };
              return `
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-bold capitalize text-slate-800 dark:text-slate-200">${sub}</span>
                    <span class="font-black text-amber-600 dark:text-amber-400">${stat.completed}/${stat.total}</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div class="bg-amber-500 h-1.5 rounded-full" style="width: ${stat.percentage}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Recent Chapters & Recent Quizzes Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Recent Chapters -->
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="clock" class="w-4 h-4 text-amber-500"></i>
                <span>${t("recentChapters")}</span>
              </h3>
              ${history.length > 0 ? `
                <button onclick="ShikshaSettings.clearHistory()" class="text-xs text-rose-500 hover:underline">Clear</button>
              ` : ''}
            </div>

            ${history.length === 0 ? `
              <p class="text-xs text-slate-500 py-6 text-center">${t("noHistoryYet")}</p>
            ` : `
              <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                ${history.slice(0, 5).map(h => `
                  <div onclick="ShikshaApp.openChapter('${h.id}')" class="cursor-pointer p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50/50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-between transition">
                    <div>
                      <h4 class="font-bold text-xs text-slate-900 dark:text-white">${h.titleEn}</h4>
                      <span class="text-[10px] text-slate-400">Class ${h.standard} • ${h.subject.toUpperCase()} • Ch ${h.chapterNumber}</span>
                    </div>
                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 text-slate-400"></i>
                  </div>
                `).join('')}
              </div>
            `}
          </div>

          <!-- Recent Quiz Attempts -->
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4 text-emerald-500"></i>
                <span>${t("recentQuizzes")}</span>
              </h3>
            </div>

            ${quizAttempts.length === 0 ? `
              <p class="text-xs text-slate-500 py-6 text-center">${t("noQuizzesYet")}</p>
            ` : `
              <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                ${quizAttempts.slice(0, 5).map(q => `
                  <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <h4 class="font-bold text-slate-900 dark:text-white">${q.chapterTitle || 'Chapter Quiz'}</h4>
                      <span class="text-[10px] text-slate-400">${new Date(q.timestamp).toLocaleDateString()}</span>
                    </div>
                    <span class="px-2.5 py-1 rounded-full font-black text-xs ${q.percentage >= 60 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}">
                      ${q.score}/${q.total} (${q.percentage}%)
                    </span>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // =============================================================
  // VIEW 10: About Us Page
  // =============================================================
  renderAboutView: function(container) {
    const t = this.getTranslation.bind(this);

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- About Header -->
        <div class="text-center space-y-3 py-4">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-xs">
            <i data-lucide="book-marked" class="w-4 h-4"></i>
            <span>Educational Technology Initiative</span>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
            ${t("aboutTitle")}
          </h1>
          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            ${t("aboutTagline")}
          </p>
        </div>

        <!-- Mission & Vision -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <i data-lucide="target" class="w-5 h-5"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">${t("aboutMission")}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ${t("aboutMissionText")}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">${t("aboutCepTitle")}</h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ${t("aboutCepText")}
            </p>
          </div>
        </div>

        <!-- 6 Core Principles -->
        <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <h3 class="text-xl font-black text-slate-900 dark:text-white">Our Core Principles</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <strong class="text-slate-900 dark:text-white block font-bold">1. Free Access Always</strong>
              <p class="text-slate-500">Zero subscriptions, paywalls, or commercial advertisements.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <strong class="text-slate-900 dark:text-white block font-bold">2. Balbharati Alignment</strong>
              <p class="text-slate-500">True to the official Maharashtra State Board curriculum.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <strong class="text-slate-900 dark:text-white block font-bold">3. Trilingual Learning</strong>
              <p class="text-slate-500">Supports English, Marathi (मराठी), and Hindi (हिंदी) mediums.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <strong class="text-slate-900 dark:text-white block font-bold">4. Useful Animations</strong>
              <p class="text-slate-500">11 focused science labs that genuinely enhance conceptual clarity.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <strong class="text-slate-900 dark:text-white block font-bold">5. Solved Numericals</strong>
              <p class="text-slate-500">Complete step-by-step arithmetic breakdown for school exams.</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
              <strong class="text-slate-900 dark:text-white block font-bold">6. Offline Accessibility</strong>
              <p class="text-slate-500">In-browser reading and lightweight PDF downloads.</p>
            </div>
          </div>
        </div>

        <!-- Academic Disclaimer -->
        <div class="p-6 rounded-3xl bg-amber-50/50 dark:bg-slate-900/60 border border-amber-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
          <h4 class="font-bold text-slate-800 dark:text-slate-200">Legal & Academic Notice</h4>
          <p class="leading-relaxed">
            ${t("disclaimer")}
          </p>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};

// Auto-initialize when document loads
if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    window.ShikshaApp.init();
  });
}
