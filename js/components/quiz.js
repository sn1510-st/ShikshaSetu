// ShikshaSetu Interactive Chapter Quiz Engine
window.ShikshaQuiz = {
  activeChapter: null,
  currentQuestionIdx: 0,
  userAnswers: {}, // { [questionIdx]: optionIndex }
  isSubmitted: false,
  score: 0,

  // Start quiz for a given chapter
  startQuiz: function(chapter) {
    this.activeChapter = chapter;
    this.currentQuestionIdx = 0;
    this.userAnswers = {};
    this.isSubmitted = false;
    this.score = 0;
    window.ShikshaApp.navigateTo("quiz");
  },

  selectOption: function(qIdx, optIdx) {
    if (this.isSubmitted) return;
    this.userAnswers[qIdx] = optIdx;
    this.render();
  },

  nextQuestion: function() {
    const total = this.getQuestions().length;
    if (this.currentQuestionIdx < total - 1) {
      this.currentQuestionIdx++;
      this.render();
    }
  },

  prevQuestion: function() {
    if (this.currentQuestionIdx > 0) {
      this.currentQuestionIdx--;
      this.render();
    }
  },

  submitQuiz: function() {
    const questions = this.getQuestions();
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correct) {
        calculatedScore++;
      }
    });

    this.score = calculatedScore;
    this.isSubmitted = true;

    // Save score in local storage (isolated per user)
    try {
      const storageKey = this.getStorageKey();
      const savedScores = JSON.parse(localStorage.getItem(storageKey) || "{}");
      savedScores[this.activeChapter.id] = {
        score: this.score,
        total: questions.length,
        percentage: Math.round((this.score / questions.length) * 100),
        chapterId: this.activeChapter.id,
        chapterTitle: this.activeChapter.titleEn,
        standard: this.activeChapter.standard,
        subject: this.activeChapter.subject,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(savedScores));
    } catch(e) {
      console.error(e);
    }

    // Mark chapter completed if score >= 60%
    if ((this.score / questions.length) >= 0.6) {
      if (!window.ShikshaSettings.isCompleted(this.activeChapter.id)) {
        window.ShikshaSettings.toggleCompleted(this.activeChapter.id);
      }
    }

    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  getStorageKey: function() {
    const userId = window.ShikshaSettings ? window.ShikshaSettings.getActiveUserId() : "guest_default";
    return `shikshasetu_quiz_${userId}`;
  },

  getAllScores: function() {
    try {
      const storageKey = this.getStorageKey();
      const savedScores = JSON.parse(localStorage.getItem(storageKey) || "{}");
      return savedScores;
    } catch(e) {
      return {};
    }
  },

  retakeQuiz: function() {
    this.currentQuestionIdx = 0;
    this.userAnswers = {};
    this.isSubmitted = false;
    this.score = 0;
    this.render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },

  getSavedScore: function(chId) {
    try {
      const storageKey = this.getStorageKey();
      const savedScores = JSON.parse(localStorage.getItem(storageKey) || "{}");
      if (savedScores[chId]) return savedScores[chId];
      // Fallback check
      const legacyScores = JSON.parse(localStorage.getItem("shikshasetu_quiz_scores") || "{}");
      return legacyScores[chId] || null;
    } catch(e) {
      return null;
    }
  },

  // Start a comprehensive revision quiz spanning all chapters of a subject
  startSubjectMegaQuiz: function(std, subj) {
    const chapters = (window.SHIKSHA_SYLLABUS || []).filter(c => c.standard === std && c.subject === subj);
    let pooledQuestions = [];
    chapters.forEach(ch => {
      if (ch.quiz && ch.quiz.length > 0) {
        pooledQuestions.push(...ch.quiz.slice(0, 2));
      }
    });

    if (pooledQuestions.length === 0) {
      alert("No questions found for this subject.");
      return;
    }

    // Shuffle pooled questions
    pooledQuestions.sort(() => Math.random() - 0.5);
    const selected = pooledQuestions.slice(0, 15);

    const syntheticChapter = {
      id: `mega_${std}_${subj}`,
      isMegaQuiz: true,
      standard: std,
      subject: subj,
      chapterNumber: "All",
      titleEn: `All Chapters Comprehensive Revision Quiz - Class ${std} ${subj.toUpperCase()}`,
      titleMr: `सर्व पाठांची उजळणी महाचाचणी - इयत्ता ${std} वी`,
      titleHi: `सभी अध्यायों की समग्र पुनरावृत्ति परीक्षा - कक्षा ${std}`,
      quiz: selected
    };

    this.startQuiz(syntheticChapter);
  },

  goBackToChapter: function() {
    if (!this.isSubmitted && Object.keys(this.userAnswers).length > 0) {
      if (!confirm("Are you sure you want to exit the quiz? Your current answers will not be saved.")) {
        return;
      }
    }
    if (this.activeChapter && this.activeChapter.isMegaQuiz) {
      window.ShikshaApp.navigateTo("chapterList");
    } else if (this.activeChapter && this.activeChapter.id) {
      window.ShikshaApp.openChapter(this.activeChapter.id);
    } else {
      window.ShikshaApp.navigateTo("chapterList");
    }
  },

  getQuestions: function() {
    if (!this.activeChapter) return [];
    if (this.activeChapter.quiz && this.activeChapter.quiz.length > 0) {
      return this.activeChapter.quiz;
    }
    // Fallback generated questions from exercises if quiz array not explicitly set
    if (this.activeChapter.exercises && this.activeChapter.exercises.length > 0) {
      return this.activeChapter.exercises.map((ex, i) => ({
        q: ex.q,
        options: [
          ex.a,
          "None of the above",
          "Both options apply",
          "Concept under observation"
        ],
        correct: 0,
        explanation: ex.a
      }));
    }
    return [
      {
        q: "What is the primary concept taught in this chapter?",
        options: ["Core Balbharti Principle", "Irrelevant Concept", "Advanced College Topic", "None"],
        correct: 0,
        explanation: "This chapter builds fundamental understanding according to Maharashtra State Board syllabus."
      }
    ];
  },

  // Main Render method called by app router
  render: function(container) {
    if (!container) {
      container = document.getElementById("view-container");
    }
    if (!container || !this.activeChapter) return;

    const t = window.ShikshaApp.getTranslation.bind(window.ShikshaApp);
    const questions = this.getQuestions();
    const ch = this.activeChapter;
    const lang = window.ShikshaApp.currentLanguage;
    const chTitle = lang === "mr" ? ch.titleMr : (lang === "hi" ? ch.titleHi : ch.titleEn);

    if (this.isSubmitted) {
      // -------------------------------------------------------------
      // RESULTS VIEW
      // -------------------------------------------------------------
      const total = questions.length;
      const pct = Math.round((this.score / total) * 100);
      let remark = t("needsPractice");
      let remarkColor = "text-amber-600 dark:text-amber-400";
      let badgeBg = "bg-amber-100 dark:bg-amber-950/60";

      if (pct >= 80) {
        remark = t("greatJob");
        remarkColor = "text-emerald-600 dark:text-emerald-400";
        badgeBg = "bg-emerald-100 dark:bg-emerald-950/60";
      } else if (pct >= 50) {
        remark = t("goodEffort");
        remarkColor = "text-blue-600 dark:text-blue-400";
        badgeBg = "bg-blue-100 dark:bg-blue-950/60";
      }

      container.innerHTML = `
        <div class="max-w-3xl mx-auto space-y-6">
          <!-- Back button banner -->
          <div class="flex items-center justify-between">
            <button onclick="ShikshaQuiz.goBackToChapter()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>${t("backToChapter")}</span>
            </button>
            <span class="text-xs text-slate-500 font-semibold">
              Class ${ch.standard} • ${ch.subject.toUpperCase()} • Chapter ${ch.chapterNumber}
            </span>
          </div>

          <!-- Score Card Card -->
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center relative overflow-hidden">
            <div class="w-24 h-24 mx-auto rounded-full ${badgeBg} flex flex-col items-center justify-center mb-4 shadow-inner">
              <span class="text-3xl font-black ${remarkColor}">${this.score}</span>
              <span class="text-xs font-bold text-slate-500 dark:text-slate-400">${t("of")} ${total}</span>
            </div>

            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${remarkColor} ${badgeBg} mb-2">
              ${pct}% Score
            </span>
            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
              ${remark}
            </h2>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              ${t("quizCompleted")} for <strong>${chTitle}</strong>. Review your answers below to master every concept!
            </p>

            <!-- Action buttons inside Score Card -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button onclick="ShikshaQuiz.retakeQuiz()" class="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2">
                <i data-lucide="rotate-ccw" class="w-4 h-4"></i>
                <span>${t("retakeQuiz")}</span>
              </button>
              <button onclick="ShikshaQuiz.goBackToChapter()" class="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-2">
                <i data-lucide="book-open" class="w-4 h-4"></i>
                <span>${t("backToChapter")}</span>
              </button>
            </div>
          </div>

          <!-- Question-by-Question Review -->
          <div class="space-y-4">
            <h3 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <i data-lucide="clipboard-check" class="w-5 h-5 text-amber-500"></i>
              <span>Detailed Question Review & Explanations</span>
            </h3>

            <div class="space-y-4">
              ${questions.map((q, idx) => {
                const userChoice = this.userAnswers[idx];
                const isCorrect = userChoice === q.correct;
                const statusBorder = isCorrect ? "border-emerald-500 dark:border-emerald-600" : "border-rose-500 dark:border-rose-600";
                const statusBg = isCorrect ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-rose-50 dark:bg-rose-950/30";

                return `
                  <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 ${statusBorder} shadow-sm space-y-3">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-center gap-2">
                        <span class="w-6 h-6 rounded-lg ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'} flex items-center justify-center text-xs font-bold">
                          ${idx + 1}
                        </span>
                        <h4 class="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          ${q.q}
                        </h4>
                      </div>
                      <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isCorrect ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/60 dark:text-emerald-300' : 'text-rose-700 bg-rose-100 dark:bg-rose-900/60 dark:text-rose-300'}">
                        ${isCorrect ? 'Correct ✓' : 'Incorrect ✗'}
                      </span>
                    </div>

                    <!-- Options list -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      ${q.options.map((opt, oIdx) => {
                        let optStyle = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300";
                        if (oIdx === q.correct) {
                          optStyle = "border-emerald-500 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold";
                        } else if (oIdx === userChoice && !isCorrect) {
                          optStyle = "border-rose-500 bg-rose-100 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 line-through font-semibold";
                        }
                        return `
                          <div class="p-2.5 rounded-xl border ${optStyle} flex items-center gap-2">
                            <span class="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                              ${String.fromCharCode(65 + oIdx)}
                            </span>
                            <span>${opt}</span>
                            ${oIdx === q.correct ? '<span class="ml-auto text-emerald-600 font-bold">✓</span>' : ''}
                            ${oIdx === userChoice && !isCorrect ? '<span class="ml-auto text-rose-600 font-bold">✗</span>' : ''}
                          </div>
                        `;
                      }).join('')}
                    </div>

                    <!-- Explanation -->
                    ${q.explanation ? `
                      <div class="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
                        <strong class="text-amber-800 dark:text-amber-300 font-semibold">${t("explanation")}: </strong>
                        <span class="text-slate-700 dark:text-slate-300">${q.explanation}</span>
                      </div>
                    ` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Bottom Return Button -->
          <div class="pt-4 text-center">
            <button onclick="ShikshaQuiz.goBackToChapter()" class="px-8 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-2xl shadow-lg shadow-amber-500/25 transition text-sm inline-flex items-center gap-2">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>${t("backToChapter")}</span>
            </button>
          </div>
        </div>
      `;
    } else {
      // -------------------------------------------------------------
      // ACTIVE QUIZ QUESTION VIEW
      // -------------------------------------------------------------
      const curQ = questions[this.currentQuestionIdx];
      const total = questions.length;
      const progressPct = ((this.currentQuestionIdx + 1) / total) * 100;
      const selected = this.userAnswers[this.currentQuestionIdx];

      container.innerHTML = `
        <div class="max-w-2xl mx-auto space-y-6">
          <!-- Quiz Top Action Bar with Go Back -->
          <div class="flex items-center justify-between">
            <button onclick="ShikshaQuiz.goBackToChapter()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>${t("goBack")}</span>
            </button>
            <div class="text-right">
              <span class="text-xs font-bold text-amber-600 dark:text-amber-400">
                ${t("question")} ${this.currentQuestionIdx + 1} ${t("of")} ${total}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div class="bg-gradient-to-r from-amber-500 to-orange-500 h-2 transition-all duration-300 rounded-full" style="width: ${progressPct}%"></div>
          </div>

          <!-- Question Card -->
          <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div>
              <span class="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                ${chTitle}
              </span>
              <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mt-3 leading-snug">
                ${curQ.q}
              </h3>
            </div>

            <!-- Options Grid -->
            <div class="space-y-3">
              ${curQ.options.map((opt, oIdx) => {
                const isSelected = selected === oIdx;
                return `
                  <button onclick="ShikshaQuiz.selectOption(${this.currentQuestionIdx}, ${oIdx})" class="w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center gap-3 text-xs sm:text-sm ${isSelected ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-bold shadow-md shadow-amber-500/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300'}">
                    <span class="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-amber-500 text-slate-900 shadow-sm' : 'border border-slate-300 dark:border-slate-700 text-slate-500'}">
                      ${String.fromCharCode(65 + oIdx)}
                    </span>
                    <span class="flex-1">${opt}</span>
                    ${isSelected ? '<i data-lucide="check-circle" class="w-5 h-5 text-amber-500 ml-auto"></i>' : ''}
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Nav Buttons -->
            <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button onclick="ShikshaQuiz.prevQuestion()" ${this.currentQuestionIdx === 0 ? 'disabled class="opacity-40 cursor-not-allowed px-4 py-2 text-xs font-semibold text-slate-400"' : 'class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"'}>
                <i data-lucide="arrow-left" class="w-4 h-4"></i>
                <span>${t("prevQuestion")}</span>
              </button>

              ${this.currentQuestionIdx === total - 1 ? `
                <button onclick="ShikshaQuiz.submitQuiz()" class="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-500/25 transition flex items-center gap-2">
                  <span>${t("submitQuiz")}</span>
                  <i data-lucide="check" class="w-4 h-4"></i>
                </button>
              ` : `
                <button onclick="ShikshaQuiz.nextQuestion()" class="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition flex items-center gap-2">
                  <span>${t("nextQuestion")}</span>
                  <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  }
};
