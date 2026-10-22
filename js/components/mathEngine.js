// ShikshaSetu Interactive Math Solver & Numerical Practice Engine
window.ShikshaMath = {
  // Render a numerical example card with collapsible steps & "Practice Another"
  renderExampleCard: function(ex, index) {
    const cardId = `math-ex-${index}`;
    return `
      <div class="math-card bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition">
        <div class="flex items-start justify-between gap-3">
          <div>
            <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
              ${ex.topic || "Solved Numerical"}
            </span>
            <h4 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-2">
              ${ex.problem}
            </h4>
          </div>
        </div>

        ${ex.formula ? `
          <div class="mt-3 p-3 bg-amber-50 dark:bg-slate-900/60 rounded-lg border border-amber-200 dark:border-amber-800/40 text-xs">
            <span class="font-semibold text-amber-900 dark:text-amber-300">Formula / Rule: </span>
            <code class="font-mono text-slate-800 dark:text-slate-200 font-bold">${ex.formula}</code>
          </div>
        ` : ''}

        <div class="mt-4 flex items-center justify-between">
          <button onclick="ShikshaMath.toggleSteps('${cardId}')" id="btn-toggle-${cardId}" class="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition">
            <i data-lucide="list-ordered" class="w-3.5 h-3.5"></i>
            <span id="label-${cardId}">Show Step-by-Step Solution</span>
          </button>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded">
            Ans: ${ex.answer}
          </span>
        </div>

        <div id="${cardId}" class="hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          ${ex.given ? `<p class="font-semibold text-slate-900 dark:text-slate-200">Given Data: <span class="font-normal">${ex.given}</span></p>` : ''}
          <div class="space-y-1.5 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <p class="font-bold text-slate-800 dark:text-slate-200">Step-by-Step Breakdown:</p>
            <ol class="list-decimal list-inside space-y-1">
              ${ex.steps.map(s => `<li class="leading-relaxed pl-1">${s}</li>`).join('')}
            </ol>
          </div>
          <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-200 dark:border-emerald-800/50 font-bold text-emerald-800 dark:text-emerald-300">
            Final Answer: ${ex.answer}
          </div>
        </div>
      </div>
    `;
  },

  toggleSteps: function(cardId) {
    const el = document.getElementById(cardId);
    const label = document.getElementById(`label-${cardId}`);
    if (el.classList.contains("hidden")) {
      el.classList.remove("hidden");
      if (label) label.textContent = "Hide Solution Steps";
    } else {
      el.classList.add("hidden");
      if (label) label.textContent = "Show Step-by-Step Solution";
    }
  },

  // Interactive Pythagoras Right-Triangle Calculator Tool
  renderPythagorasLab: function(container) {
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="triangle" class="w-5 h-5 text-indigo-600 dark:text-indigo-400"></i>
          Interactive Pythagoras Triplet Lab (c² = a² + b²)
        </h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter base and height to calculate the hypotenuse step-by-step!</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Side 'a' (cm):</label>
            <input type="number" id="pyth-a" value="9" min="1" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Height Side 'b' (cm):</label>
            <input type="number" id="pyth-b" value="12" min="1" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
        </div>

        <button onclick="ShikshaMath.calcPythagoras()" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs transition">
          Calculate Hypotenuse (कर्ण)
        </button>

        <div id="pyth-output" class="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <!-- Filled by calcPythagoras -->
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    this.calcPythagoras();
  },

  calcPythagoras: function() {
    const a = parseFloat(document.getElementById("pyth-a").value) || 0;
    const b = parseFloat(document.getElementById("pyth-b").value) || 0;
    const out = document.getElementById("pyth-output");

    const a2 = a * a;
    const b2 = b * b;
    const c2 = a2 + b2;
    const c = Math.sqrt(c2).toFixed(2);
    const isExact = Number.isInteger(Math.sqrt(c2));

    out.innerHTML = `
      <div class="space-y-1.5 font-mono">
        <p class="text-slate-600 dark:text-slate-400">Formula: c² = a² + b²</p>
        <p>c² = (${a})² + (${b})²</p>
        <p>c² = ${a2} + ${b2} = ${c2}</p>
        <p class="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
          Hypotenuse c = √(${c2}) = ${c} cm ${isExact ? '(Exact Integer Triplet!)' : ''}
        </p>
      </div>
    `;
  },

  // Interactive Compound Interest Calculator
  renderCILab: function(container) {
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 class="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <i data-lucide="dollar-sign" class="w-5 h-5 text-emerald-600 dark:text-emerald-400"></i>
          Interactive Compound Interest Lab (A = P(1 + R/100)ᴺ)
        </h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Simulate bank compound growth with year-by-year compounding!</p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Principal (P ₹):</label>
            <input type="number" id="ci-p" value="10000" min="100" step="500" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Annual Rate (R %):</label>
            <input type="number" id="ci-r" value="10" min="1" max="50" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Years (N):</label>
            <input type="number" id="ci-n" value="3" min="1" max="10" class="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
        </div>

        <button onclick="ShikshaMath.calcCI()" class="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition">
          Calculate Compound Growth
        </button>

        <div id="ci-output" class="mt-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <!-- Filled by calcCI -->
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    this.calcCI();
  },

  calcCI: function() {
    const P = parseFloat(document.getElementById("ci-p").value) || 0;
    const R = parseFloat(document.getElementById("ci-r").value) || 0;
    const N = parseInt(document.getElementById("ci-n").value) || 0;
    const out = document.getElementById("ci-output");

    let tableRows = "";
    let curPrincipal = P;
    for (let yr = 1; yr <= N; yr++) {
      const interest = curPrincipal * (R / 100);
      const endAmount = curPrincipal + interest;
      tableRows += `
        <tr class="border-b border-slate-200 dark:border-slate-800">
          <td class="py-1 px-2 font-semibold">Year ${yr}</td>
          <td class="py-1 px-2">₹${curPrincipal.toFixed(2)}</td>
          <td class="py-1 px-2 text-emerald-600 dark:text-emerald-400">+₹${interest.toFixed(2)}</td>
          <td class="py-1 px-2 font-bold">₹${endAmount.toFixed(2)}</td>
        </tr>
      `;
      curPrincipal = endAmount;
    }

    const totalAmount = P * Math.pow(1 + R / 100, N);
    const totalCI = totalAmount - P;
    const simpleInterest = (P * R * N) / 100;
    const diff = totalCI - simpleInterest;

    out.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-left font-mono">
          <thead>
            <tr class="border-b border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
              <th class="py-1 px-2">Period</th>
              <th class="py-1 px-2">Starting Principal</th>
              <th class="py-1 px-2">Interest Earned</th>
              <th class="py-1 px-2">Ending Amount</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
      <div class="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
        <div>Total Amount (A): <strong class="text-emerald-600 dark:text-emerald-400">₹${totalAmount.toFixed(2)}</strong></div>
        <div>Compound Interest: <strong class="text-indigo-600 dark:text-indigo-400">₹${totalCI.toFixed(2)}</strong></div>
        <div>Extra over Simple Interest: <strong class="text-amber-600 dark:text-amber-400">+₹${diff.toFixed(2)}</strong></div>
      </div>
    `;
  }
};
