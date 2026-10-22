// ShikshaSetu Balbharti Chapter PDF Generator & In-App Reader
window.ShikshaPDF = {
  // Open the interactive Balbharti-style PDF Textbook Reader Modal
  openReader: function(chapter) {
    let modal = document.getElementById("pdf-reader-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "pdf-reader-modal";
      modal.className = "fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4";
      document.body.appendChild(modal);
    }

    const lang = window.ShikshaApp ? window.ShikshaApp.currentLanguage : "en";
    const title = lang === "mr" ? chapter.titleMr : (lang === "hi" ? chapter.titleHi : chapter.titleEn);
    const subLabel = chapter.subject.toUpperCase();

    modal.innerHTML = `
      <div class="w-full max-w-4xl h-[92vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-300 dark:border-slate-700">
        <!-- Top Action Bar -->
        <div class="px-4 py-3 bg-slate-800 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-700">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-lg bg-amber-500 text-slate-900 font-bold flex items-center justify-center text-xs">
              ${chapter.standard}
            </span>
            <div>
              <h3 class="font-bold text-sm leading-tight text-amber-300">${title}</h3>
              <p class="text-[10px] text-slate-400">Balbharti Textbook Reader • Class ${chapter.standard} • ${subLabel}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="ShikshaPDF.printDocument()" class="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>Print</span>
            </button>
            <button onclick="ShikshaPDF.downloadPDF('${chapter.id}')" class="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1.5 transition">
              <i data-lucide="download" class="w-3.5 h-3.5"></i>
              <span>Download PDF</span>
            </button>
            <button onclick="ShikshaPDF.closeReader()" class="p-1.5 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Document Sheet (Scrollable) -->
        <div id="pdf-printable-area" class="flex-1 overflow-y-auto p-6 sm:p-10 bg-amber-50/40 dark:bg-slate-950 font-serif leading-relaxed text-slate-800 dark:text-slate-200">
          <!-- Balbharti Watermark / Header -->
          <div class="border-b-2 border-amber-500 pb-4 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-xs font-sans font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                  Maharashtra State Board • Balbharti Syllabus
                </span>
                <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  Chapter ${chapter.chapterNumber}: ${title}
                </h1>
                <p class="text-sm font-sans text-slate-600 dark:text-slate-400 italic">
                  ${chapter.titleMr} | Class ${chapter.standard}th Standard (${subLabel})
                </p>
              </div>
              <div class="w-14 h-14 rounded-full border-2 border-amber-500 flex items-center justify-center bg-amber-100 dark:bg-amber-950 font-bold text-amber-800 dark:text-amber-300 text-xs text-center p-1">
                बालभारती
              </div>
            </div>
          </div>

          <!-- Can you recall? box -->
          ${chapter.canYouRecall ? `
            <div class="mb-6 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border-l-4 border-sky-500 font-sans text-sm">
              <strong class="text-sky-800 dark:text-sky-300 flex items-center gap-1.5 mb-1">
                <i data-lucide="help-circle" class="w-4 h-4"></i>
                Can you recall? (आठवा पाहू! / जरा डोके चालवा)
              </strong>
              <p class="text-slate-700 dark:text-slate-300">${chapter.canYouRecall}</p>
            </div>
          ` : ''}

          <!-- Chapter Summary & Key Concepts -->
          <div class="mb-6">
            <h2 class="text-lg font-sans font-bold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-800 pb-2 mb-3">
              1. Overview & Core Concepts
            </h2>
            <p class="text-sm leading-relaxed mb-4 text-justify">
              ${chapter.summary}
            </p>
            ${chapter.keyPoints ? `
              <ul class="space-y-2 text-sm font-sans pl-5 list-disc text-slate-700 dark:text-slate-300">
                ${chapter.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
              </ul>
            ` : ''}
          </div>

          <!-- Do You Know? Callout -->
          ${chapter.doYouKnow ? `
            <div class="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 font-sans text-sm">
              <strong class="text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1">
                <i data-lucide="lightbulb" class="w-4 h-4"></i>
                Do you know? (माहीत आहे का तुम्हांला?)
              </strong>
              <p class="text-slate-700 dark:text-slate-300">${chapter.doYouKnow}</p>
            </div>
          ` : ''}

          <!-- Solved Examples (Especially detailed for Maths) -->
          ${chapter.solvedExamples && chapter.solvedExamples.length > 0 ? `
            <div class="mb-6 font-sans">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-800 pb-2 mb-4">
                2. Step-by-Step Solved Numericals & Examples
              </h2>
              <div class="space-y-4">
                ${chapter.solvedExamples.map((ex, i) => `
                  <div class="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
                    <p class="font-bold text-slate-900 dark:text-slate-100 text-sm mb-2">Example ${i + 1}: ${ex.problem}</p>
                    ${ex.given ? `<p class="text-slate-600 dark:text-slate-400 mb-1"><strong>Given:</strong> ${ex.given}</p>` : ''}
                    ${ex.formula ? `<p class="text-amber-700 dark:text-amber-300 mb-2 font-mono"><strong>Formula:</strong> ${ex.formula}</p>` : ''}
                    <div class="pl-3 border-l-2 border-indigo-400 my-2 space-y-1">
                      ${ex.steps.map(s => `<p class="text-slate-700 dark:text-slate-300">${s}</p>`).join('')}
                    </div>
                    <p class="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-2">Ans: ${ex.answer}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Balbharti Textbook Exercise & Solutions -->
          ${chapter.exercises && chapter.exercises.length > 0 ? `
            <div class="mb-6 font-sans">
              <h2 class="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-800 pb-2 mb-4">
                3. Balbharti Textbook Exercises & Model Answers (स्वाध्याय)
              </h2>
              <div class="space-y-3">
                ${chapter.exercises.map((item, idx) => `
                  <div class="p-3.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs">
                    <p class="font-bold text-slate-800 dark:text-slate-200">Q.${idx + 1} ${item.q}</p>
                    <p class="mt-1.5 text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      <strong class="text-emerald-700 dark:text-emerald-400">Answer:</strong> ${item.a}
                    </p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Footer Signature -->
          <div class="mt-8 pt-4 border-t border-slate-300 dark:border-slate-800 text-center font-sans text-xs text-slate-500">
            ShikshaSetu • Maharashtra State Board Textbook Digital Edition • Prepared for School Students
          </div>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
    if (window.lucide) window.lucide.createIcons();
  },

  closeReader: function() {
    const modal = document.getElementById("pdf-reader-modal");
    if (modal) modal.classList.add("hidden");
  },

  printDocument: function() {
    window.print();
  },

  // Generate and download a formatted PDF file
  downloadPDF: function(chapterId) {
    const chapter = window.SHIKSHA_SYLLABUS.find(c => c.id === chapterId);
    if (!chapter) return;

    // Use jsPDF from window.jspdf if available
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 40;
      let y = 45;

      // Header Banner
      doc.setFillColor(245, 158, 11); // Amber
      doc.rect(margin, y, pageWidth - 2 * margin, 40, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("SHIKSHASETU - MAHARASHTRA STATE BOARD (BALBHARTI)", margin + 15, y + 25);
      y += 60;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text(`Class ${chapter.standard} ${chapter.subject.toUpperCase()} - Chapter ${chapter.chapterNumber}`, margin, y);
      y += 22;
      doc.setFontSize(13);
      doc.setTextColor(217, 119, 6);
      doc.text(chapter.titleEn, margin, y);
      y += 25;

      // Summary
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text("1. CHAPTER SUMMARY & CONCEPTS:", margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const splitSummary = doc.splitTextToSize(chapter.summary, pageWidth - 2 * margin);
      doc.text(splitSummary, margin, y);
      y += splitSummary.length * 12 + 15;

      // Key Points
      if (chapter.keyPoints && chapter.keyPoints.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("2. KEY LEARNING POINTS:", margin, y);
        y += 16;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        chapter.keyPoints.forEach(kp => {
          const splitKp = doc.splitTextToSize(`• ${kp}`, pageWidth - 2 * margin - 10);
          if (y + splitKp.length * 12 > 780) {
            doc.addPage();
            y = 45;
          }
          doc.text(splitKp, margin + 5, y);
          y += splitKp.length * 12 + 4;
        });
        y += 10;
      }

      // Solved Examples
      if (chapter.solvedExamples && chapter.solvedExamples.length > 0) {
        if (y > 700) { doc.addPage(); y = 45; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("3. SOLVED NUMERICALS & EXAMPLES:", margin, y);
        y += 16;

        chapter.solvedExamples.forEach((ex, i) => {
          if (y > 720) { doc.addPage(); y = 45; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          const probLines = doc.splitTextToSize(`Example ${i+1}: ${ex.problem}`, pageWidth - 2 * margin);
          doc.text(probLines, margin, y);
          y += probLines.length * 11 + 4;

          if (ex.formula) {
            doc.setFont("courier", "bold");
            doc.setFontSize(8.5);
            doc.setTextColor(180, 83, 9);
            doc.text(`Formula: ${ex.formula}`, margin + 8, y);
            y += 12;
          }

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          ex.steps.forEach(s => {
            const stepLines = doc.splitTextToSize(`- ${s}`, pageWidth - 2 * margin - 15);
            if (y > 780) { doc.addPage(); y = 45; }
            doc.text(stepLines, margin + 8, y);
            y += stepLines.length * 10 + 2;
          });

          doc.setFont("helvetica", "bold");
          doc.setTextColor(16, 185, 129);
          doc.text(`Answer: ${ex.answer}`, margin + 8, y);
          y += 16;
        });
      }

      // Exercises
      if (chapter.exercises && chapter.exercises.length > 0) {
        if (y > 700) { doc.addPage(); y = 45; }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text("4. BALBHARTI EXERCISES & SOLUTIONS:", margin, y);
        y += 16;

        chapter.exercises.forEach((item, idx) => {
          if (y > 740) { doc.addPage(); y = 45; }
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(30, 41, 59);
          const qLines = doc.splitTextToSize(`Q${idx+1}: ${item.q}`, pageWidth - 2 * margin);
          doc.text(qLines, margin, y);
          y += qLines.length * 11 + 2;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const aLines = doc.splitTextToSize(`Ans: ${item.a}`, pageWidth - 2 * margin);
          doc.text(aLines, margin + 8, y);
          y += aLines.length * 11 + 8;
        });
      }

      // Save PDF file
      const fileName = `ShikshaSetu_Std${chapter.standard}_${chapter.subject}_Ch${chapter.chapterNumber}.pdf`;
      doc.save(fileName);
    } else {
      // Fallback: trigger print dialog for saving as PDF
      alert("Opening print view - please choose 'Save as PDF' in the destination dropdown!");
      this.openReader(chapter);
      setTimeout(() => window.print(), 500);
    }
  }
};
