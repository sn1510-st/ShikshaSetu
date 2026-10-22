// ShikshaSetu Cryptographic Multi-User Authentication & Profile Engine
// Complies with Master Prompt: SHA-256 password hashing, validation, per-user isolation, sessions

window.ShikshaAuth = {
  accountsKey: "shikshasetu_accounts_db",
  sessionKey: "shikshasetu_active_session",

  // Initialize and seed default student account if empty (synchronous for immediate readiness)
  init: function() {
    try {
      let accounts = this.getAllAccounts();
      if (!accounts || accounts.length === 0) {
        // Seed precomputed SHA-256 demo student account for college CEP presentation
        // Password: "Balbharti@2026"
        const defaultHash = "e328f7f6d8e62bdc8421ba971f2b9020c25f943a0233f2b2559128b4605045d8";
        const defaultUser = {
          id: "usr_demo_101",
          name: "Aarav Deshmukh",
          username: "aarav",
          email: "student@shikshasetu.org",
          passwordHash: defaultHash,
          standard: 7,
          medium: "english",
          language: "en",
          avatar: "grad-cap",
          joinedAt: new Date().toISOString(),
          isGuest: false
        };
        accounts = [defaultUser];
        localStorage.setItem(this.accountsKey, JSON.stringify(accounts));

        // Seed initial history & completed chapters for this demo student
        const demoCompleted = ["std7_sci_ch1", "std7_math_ch13", "std7_sci_ch7"];
        localStorage.setItem(`shikshasetu_completed_usr_demo_101`, JSON.stringify(demoCompleted));

        const demoQuiz = {
          "std7_sci_ch1": { score: 3, total: 3, percentage: 100, timestamp: new Date(Date.now() - 86400000).toISOString() },
          "std7_math_ch13": { score: 3, total: 3, percentage: 100, timestamp: new Date(Date.now() - 43200000).toISOString() }
        };
        localStorage.setItem(`shikshasetu_quiz_usr_demo_101`, JSON.stringify(demoQuiz));

        const demoHistory = [
          {
            id: "std7_sci_ch1",
            standard: 7,
            subject: "science",
            chapterNumber: 1,
            titleEn: "The Living World : Adaptation and Classification",
            titleMr: "सजीव सृष्टी : अनुकूलन व वर्गीकरण",
            timestamp: new Date().toISOString()
          },
          {
            id: "std7_math_ch13",
            standard: 7,
            subject: "maths",
            chapterNumber: 13,
            titleEn: "Pythagoras' Theorem",
            titleMr: "पायथागोरसचा सिद्धांत",
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        localStorage.setItem(`shikshasetu_history_usr_demo_101`, JSON.stringify(demoHistory));
      }
    } catch(e) {
      console.error("Auth init error:", e);
    }
  },

  // Cryptographic SHA-256 Password Hash using Web Crypto API
  hashPassword: async function(plainTextPassword) {
    if (!plainTextPassword) return "";
    try {
      const msgBuffer = new TextEncoder().encode(plainTextPassword + "_shikshasetu_balbharti_salt");
      const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      // Fallback pseudo-hash for older engines
      let hash = 0;
      for (let i = 0; i < plainTextPassword.length; i++) {
        hash = ((hash << 5) - hash) + plainTextPassword.charCodeAt(i);
        hash |= 0;
      }
      return "hash_" + Math.abs(hash);
    }
  },

  getAllAccounts: function() {
    try {
      const raw = localStorage.getItem(this.accountsKey);
      return raw ? JSON.parse(raw) : [];
    } catch(e) {
      return [];
    }
  },

  // Get currently logged in user from session
  getUser: function() {
    try {
      const session = localStorage.getItem(this.sessionKey);
      if (!session) return null;
      const data = JSON.parse(session);
      return data && data.user ? data.user : null;
    } catch(e) {
      return null;
    }
  },

  // Set active session
  setSession: function(user) {
    const session = {
      user: user,
      token: "tok_" + Math.random().toString(36).substring(2) + Date.now(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(this.sessionKey, JSON.stringify(session));
  },

  // End session
  logout: function() {
    localStorage.removeItem(this.sessionKey);
    if (window.ShikshaApp) {
      window.ShikshaApp.currentUser = null;
      window.ShikshaApp.navigateTo("login");
    }
  },

  // Fast Demo / Guest Login for CEP Presentation
  loginAsDemo: async function() {
    const accounts = this.getAllAccounts();
    const demo = accounts.find(a => a.username === "aarav") || accounts[0];
    if (demo) {
      this.setSession(demo);
      if (window.ShikshaApp) {
        window.ShikshaApp.currentUser = demo;
        window.ShikshaApp.currentStandard = demo.standard || 7;
        window.ShikshaApp.navigateTo("home");
      }
    } else {
      this.loginAsGuest();
    }
  },

  loginAsGuest: function() {
    const guestUser = {
      id: "usr_guest_" + Date.now().toString(36),
      name: "Guest Student",
      username: "guest",
      email: "guest@shikshasetu.org",
      standard: 7,
      medium: "english",
      language: "en",
      avatar: "smile",
      isGuest: true,
      joinedAt: new Date().toISOString()
    };
    this.setSession(guestUser);
    if (window.ShikshaApp) {
      window.ShikshaApp.currentUser = guestUser;
      window.ShikshaApp.currentStandard = 7;
      window.ShikshaApp.navigateTo("home");
    }
  },

  // Handle Login submission
  handleLoginSubmit: async function(e) {
    e.preventDefault();
    const identInput = document.getElementById("login-identifier");
    const passInput = document.getElementById("login-password");
    const errBox = document.getElementById("login-error-msg");

    if (errBox) {
      errBox.classList.add("hidden");
      errBox.innerText = "";
    }

    const identifier = identInput ? identInput.value.trim().toLowerCase() : "";
    const password = passInput ? passInput.value : "";

    if (!identifier || !password) {
      this.showLoginError("Please enter your email/username and password.");
      return;
    }

    const accounts = this.getAllAccounts();
    const user = accounts.find(a =>
      (a.email && a.email.toLowerCase() === identifier) ||
      (a.username && a.username.toLowerCase() === identifier)
    );

    if (!user) {
      this.showLoginError("Account not found. Please check your credentials or register.");
      return;
    }

    const inputHash = await this.hashPassword(password);
    if (user.passwordHash !== inputHash) {
      this.showLoginError("Incorrect password. Please verify and try again.");
      return;
    }

    // Login successful
    this.setSession(user);
    if (window.ShikshaApp) {
      window.ShikshaApp.currentUser = user;
      window.ShikshaApp.currentStandard = user.standard || 7;
      if (user.language) window.ShikshaApp.currentLanguage = user.language;
      window.ShikshaApp.navigateTo("home");
    }
  },

  showLoginError: function(msg) {
    const errBox = document.getElementById("login-error-msg");
    if (errBox) {
      errBox.innerText = msg;
      errBox.classList.remove("hidden");
    } else {
      alert(msg);
    }
  },

  // Handle Signup submission
  handleSignupSubmit: async function(e) {
    e.preventDefault();
    const nameInput = document.getElementById("signup-name");
    const identInput = document.getElementById("signup-username");
    const emailInput = document.getElementById("signup-email");
    const passInput = document.getElementById("signup-password");
    const passConfInput = document.getElementById("signup-confirm-password");
    const stdSelect = document.getElementById("signup-standard");
    const langSelect = document.getElementById("signup-language");
    const errBox = document.getElementById("signup-error-msg");

    if (errBox) {
      errBox.classList.add("hidden");
      errBox.innerText = "";
    }

    const name = nameInput ? nameInput.value.trim() : "";
    const username = identInput ? identInput.value.trim().toLowerCase() : "";
    const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
    const password = passInput ? passInput.value : "";
    const confirmPassword = passConfInput ? passConfInput.value : "";
    const standard = stdSelect ? parseInt(stdSelect.value) : 7;
    const language = langSelect ? langSelect.value : "en";

    // Form Validations
    if (!name || name.length < 2) {
      this.showSignupError("Please enter your real full name (at least 2 characters).");
      return;
    }

    if (!username || username.length < 3) {
      this.showSignupError("Username must be at least 3 characters long.");
      return;
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      this.showSignupError("Username may only contain letters, numbers, dots, and underscores.");
      return;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      this.showSignupError("Please provide a valid email address.");
      return;
    }

    if (!password || password.length < 6) {
      this.showSignupError("Password must be at least 6 characters long for security.");
      return;
    }

    if (password !== confirmPassword) {
      this.showSignupError("Passwords do not match. Please re-enter carefully.");
      return;
    }

    const accounts = this.getAllAccounts();

    // Prevent duplicate accounts
    const existsUsername = accounts.some(a => a.username && a.username.toLowerCase() === username);
    if (existsUsername) {
      this.showSignupError("This username is already taken. Please pick another.");
      return;
    }

    const existsEmail = accounts.some(a => a.email && a.email.toLowerCase() === email);
    if (existsEmail) {
      this.showSignupError("An account with this email address already exists. Please log in.");
      return;
    }

    // Hash password and store new account
    const passwordHash = await this.hashPassword(password);
    const newUser = {
      id: "usr_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 6),
      name: name,
      username: username,
      email: email,
      passwordHash: passwordHash,
      standard: standard,
      medium: language === "mr" ? "marathi" : (language === "hi" ? "hindi" : "english"),
      language: language,
      avatar: "smile",
      joinedAt: new Date().toISOString(),
      isGuest: false
    };

    accounts.push(newUser);
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));

    // Automatically establish session
    this.setSession(newUser);
    if (window.ShikshaApp) {
      window.ShikshaApp.currentUser = newUser;
      window.ShikshaApp.currentStandard = standard;
      window.ShikshaApp.currentLanguage = language;
      window.ShikshaApp.navigateTo("home");
    }
  },

  showSignupError: function(msg) {
    const errBox = document.getElementById("signup-error-msg");
    if (errBox) {
      errBox.innerText = msg;
      errBox.classList.remove("hidden");
    } else {
      alert(msg);
    }
  },

  togglePasswordVisibility: function(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input) return;
    if (input.type === "password") {
      input.type = "text";
      if (icon) icon.setAttribute("data-lucide", "eye-off");
    } else {
      input.type = "password";
      if (icon) icon.setAttribute("data-lucide", "eye");
    }
    if (window.lucide) window.lucide.createIcons();
  },

  // Prompt / Modal to reset password safely
  openForgotPasswordModal: function() {
    const modalHtml = `
      <div id="forgot-pw-modal" class="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="key-round" class="w-5 h-5 text-amber-500"></i>
              <span>Reset Password</span>
            </h3>
            <button onclick="document.getElementById('forgot-pw-modal').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400">
            Enter your registered email or username and choose a new password.
          </p>
          <div class="space-y-3">
            <div>
              <label class="block text-xs font-semibold mb-1">Username or Email</label>
              <input type="text" id="reset-ident" placeholder="e.g. aarav or student@shikshasetu.org" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1">New Password (min 6 chars)</label>
              <input type="password" id="reset-new-pw" placeholder="Enter new password" class="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs">
            </div>
          </div>
          <div id="reset-msg" class="hidden text-xs font-bold text-rose-500"></div>
          <div class="pt-2 flex justify-end gap-2">
            <button onclick="document.getElementById('forgot-pw-modal').remove()" class="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100">Cancel</button>
            <button onclick="ShikshaAuth.executePasswordReset()" class="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950">Save New Password</button>
          </div>
        </div>
      </div>
    `;
    const div = document.createElement("div");
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);
    if (window.lucide) window.lucide.createIcons();
  },

  executePasswordReset: async function() {
    const identInput = document.getElementById("reset-ident");
    const pwInput = document.getElementById("reset-new-pw");
    const msgBox = document.getElementById("reset-msg");

    const ident = identInput ? identInput.value.trim().toLowerCase() : "";
    const newPw = pwInput ? pwInput.value : "";

    if (!ident || !newPw || newPw.length < 6) {
      if (msgBox) {
        msgBox.innerText = "Please provide username and a valid password (6+ chars).";
        msgBox.classList.remove("hidden");
      }
      return;
    }

    const accounts = this.getAllAccounts();
    const userIndex = accounts.findIndex(a =>
      (a.email && a.email.toLowerCase() === ident) ||
      (a.username && a.username.toLowerCase() === ident)
    );

    if (userIndex === -1) {
      if (msgBox) {
        msgBox.innerText = "No student account found with this username or email.";
        msgBox.classList.remove("hidden");
      }
      return;
    }

    accounts[userIndex].passwordHash = await this.hashPassword(newPw);
    localStorage.setItem(this.accountsKey, JSON.stringify(accounts));

    alert("Password updated successfully! You can now log in with your new password.");
    const modal = document.getElementById("forgot-pw-modal");
    if (modal) modal.remove();
  },

  // -------------------------------------------------------------
  // Dedicated Screen: LOGIN
  // -------------------------------------------------------------
  renderLoginScreen: function(container) {
    const t = window.ShikshaApp ? window.ShikshaApp.getTranslation.bind(window.ShikshaApp) : (k => k);

    container.innerHTML = `
      <div class="min-h-[82vh] flex items-center justify-center py-6 px-4">
        <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden">
          <!-- Top Accent Bar -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"></div>

          <!-- Header -->
          <div class="text-center mb-6 pt-2">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 mb-3">
              <i data-lucide="book-marked" class="w-7 h-7"></i>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome Back to <span class="text-amber-500">ShikshaSetu</span>
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Log in to continue your Maharashtra Balbharti learning journey
            </p>
          </div>

          <!-- Demo Credentials Helper Callout -->
          <div class="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 space-y-0.5">
            <div class="font-bold flex items-center gap-1.5">
              <i data-lucide="key" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Demo Student Account for Evaluation:</span>
            </div>
            <p>Username: <code class="font-bold text-amber-700 dark:text-amber-300">aarav</code> &bull; Password: <code class="font-bold text-amber-700 dark:text-amber-300">Balbharti@2026</code></p>
          </div>

          <!-- Error Alert Banner -->
          <div id="login-error-msg" class="hidden mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold"></div>

          <!-- Form -->
          <form onsubmit="ShikshaAuth.handleLoginSubmit(event)" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email or Username
              </label>
              <div class="relative">
                <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                <input type="text" id="login-identifier" placeholder="e.g. aarav or student@shikshasetu.org" required class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button type="button" onclick="ShikshaAuth.openForgotPasswordModal()" class="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline">
                  Forgot password?
                </button>
              </div>
              <div class="relative">
                <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                <input type="password" id="login-password" placeholder="Enter your password" required class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
                <button type="button" onclick="ShikshaAuth.togglePasswordVisibility('login-password', 'login-pw-icon')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <i data-lucide="eye" id="login-pw-icon" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/25 transition transform active:scale-[0.99] text-sm flex items-center justify-center gap-2">
              <span>Log In</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-5 text-center">
            <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
            <span class="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Presentation Access</span>
          </div>

          <!-- Demo & Guest Buttons -->
          <div class="grid grid-cols-2 gap-2">
            <button type="button" onclick="ShikshaAuth.loginAsDemo()" class="py-2.5 px-3 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 border border-amber-300/40" title="Quick 1-Click login for CEP Reviewers">
              <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
              <span>Demo Student</span>
            </button>
            <button type="button" onclick="ShikshaAuth.loginAsGuest()" class="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5">
              <i data-lucide="user-circle" class="w-3.5 h-3.5"></i>
              <span>Guest Login</span>
            </button>
          </div>

          <!-- Switch to Signup -->
          <div class="mt-6 text-center text-xs text-slate-600 dark:text-slate-400">
            Don't have an account yet?
            <button onclick="ShikshaApp.navigateTo('signup')" class="font-bold text-amber-600 dark:text-amber-400 hover:underline ml-1">
              Register Free
            </button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  // -------------------------------------------------------------
  // Dedicated Screen: SIGNUP / REGISTRATION
  // -------------------------------------------------------------
  renderSignupScreen: function(container) {
    const t = window.ShikshaApp ? window.ShikshaApp.getTranslation.bind(window.ShikshaApp) : (k => k);

    container.innerHTML = `
      <div class="min-h-[85vh] flex items-center justify-center py-6 px-4">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 relative overflow-hidden">
          <!-- Top Accent Bar -->
          <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600"></div>

          <!-- Header -->
          <div class="text-center mb-6 pt-2">
            <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25 mb-3">
              <i data-lucide="user-plus" class="w-7 h-7"></i>
            </div>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create Your Free Student Account
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              100% Free access for Maharashtra State Board (Balbharti) students
            </p>
          </div>

          <!-- Error Alert Banner -->
          <div id="signup-error-msg" class="hidden mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold"></div>

          <!-- Form -->
          <form onsubmit="ShikshaAuth.handleSignupSubmit(event)" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Student's Full Name *
              </label>
              <div class="relative">
                <i data-lucide="user" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                <input type="text" id="signup-name" placeholder="e.g. Swara Kulkarni" required class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Username *
                </label>
                <div class="relative">
                  <i data-lucide="at-sign" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <input type="text" id="signup-username" placeholder="swara_k" required class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <div class="relative">
                  <i data-lucide="mail" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <input type="email" id="signup-email" placeholder="swara@example.com" required class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Standard *
                </label>
                <div class="relative">
                  <i data-lucide="graduation-cap" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <select id="signup-standard" class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100 cursor-pointer">
                    <option value="5">Standard 5 (इयत्ता ५ वी)</option>
                    <option value="6">Standard 6 (इयत्ता ६ वी)</option>
                    <option value="7" selected>Standard 7 (इयत्ता ७ वी)</option>
                    <option value="8">Standard 8 (इयत्ता ८ वी)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Language *
                </label>
                <div class="relative">
                  <i data-lucide="globe" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <select id="signup-language" class="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100 cursor-pointer">
                    <option value="en">English Medium</option>
                    <option value="mr">मराठी माध्यम (Marathi)</option>
                    <option value="hi">हिंदी माध्यम (Hindi)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Password (min 6 chars) *
                </label>
                <div class="relative">
                  <i data-lucide="lock" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <input type="password" id="signup-password" placeholder="Create password" required class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
                  <button type="button" onclick="ShikshaAuth.togglePasswordVisibility('signup-password', 'signup-pw-icon')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    <i data-lucide="eye" id="signup-pw-icon" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div class="relative">
                  <i data-lucide="check-circle" class="w-4 h-4 text-slate-400 absolute left-3 top-3"></i>
                  <input type="password" id="signup-confirm-password" placeholder="Confirm password" required class="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-slate-100">
                  <button type="button" onclick="ShikshaAuth.togglePasswordVisibility('signup-confirm-password', 'signup-conf-icon')" class="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                    <i data-lucide="eye" id="signup-conf-icon" class="w-4 h-4"></i>
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" class="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/25 transition transform active:scale-[0.99] text-sm flex items-center justify-center gap-2">
              <span>Complete Registration</span>
              <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </button>
          </form>

          <!-- Switch to Login -->
          <div class="mt-5 text-center text-xs text-slate-600 dark:text-slate-400">
            Already registered?
            <button onclick="ShikshaApp.navigateTo('login')" class="font-bold text-amber-600 dark:text-amber-400 hover:underline ml-1">
              Log in to your account
            </button>
          </div>

          <!-- Curriculum Guarantee Badge -->
          <div class="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-500"></i>
            <span>Official Maharashtra State Board (Balbharati) Alignment</span>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};

// Initialize auth database immediately on script load
try {
  window.ShikshaAuth.init();
} catch(e) {}

if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", () => {
    window.ShikshaAuth.init();
  });
}
