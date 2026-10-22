// ShikshaSetu Structured Topic Engine & Repository
// Maps Maharashtra Balbharti chapters into focused, age-appropriate learning topics (Ages 10-14)

window.ShikshaTopics = {
  // Topic repository indexed by chapterId
  customTopicBank: {
    // -------------------------------------------------------------
    // STD 5 SCIENCE CH 1: Solar System
    // -------------------------------------------------------------
    "std5_sci_ch1": [
      {
        id: "top_std5_sci_ch1_1",
        topicNumber: 1,
        titleEn: "The Sun and the Eight Planets",
        titleMr: "सूर्य आणि आठ ग्रह",
        titleHi: "सूर्य और आठ ग्रह",
        objectives: [
          "Understand why the Sun is at the center of the solar system",
          "Memorize the order of the 8 planets in increasing distance from the Sun",
          "Distinguish between self-luminous stars and planets"
        ],
        intro: "Have you ever looked at the sky and wondered where the Sun goes at night or why stars twinkle? Our Earth is not alone in space! It belongs to a grand cosmic family called the Solar System, with the Sun as the generous head of the family.",
        explanation: `
          <p>At the center of our solar system is the <strong>Sun</strong>. The Sun is a massive star made of scorching hot gases that produces its own immense heat and light. Because of its tremendous mass, the Sun exerts a powerful gravitational pull that keeps eight planets revolving around it in fixed elliptical paths called <strong>orbits</strong>.</p>
          <div class="my-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <h5 class="font-bold text-amber-900 dark:text-amber-200 mb-2">The 8 Planets in Order from the Sun:</h5>
            <ol class="list-decimal pl-5 space-y-1 text-xs text-slate-700 dark:text-slate-300">
              <li><strong>Mercury (बुध)</strong> - Closest to the Sun, fastest orbit, no atmosphere.</li>
              <li><strong>Venus (शुक्र)</strong> - Hottest planet, often seen as morning or evening star.</li>
              <li><strong>Earth (पृथ्वी)</strong> - Our home planet, the only known world with liquid water and life.</li>
              <li><strong>Mars (मंगळ)</strong> - The Red Planet with iron-rich soil and polar ice caps.</li>
              <li><strong>Jupiter (गुरु)</strong> - The largest planet, a gas giant with a Great Red Spot.</li>
              <li><strong>Saturn (शनी)</strong> - Famous for its spectacular, shining concentric rings made of ice and dust.</li>
              <li><strong>Uranus (युरेनस)</strong> - An ice giant with a severe axial tilt, spinning almost on its side.</li>
              <li><strong>Neptune (नेपच्यून)</strong> - The farthest planet from the Sun, dark, cold, and whipped by supersonic winds.</li>
            </ol>
          </div>
          <p>A simple trick to remember the order of the planets is the mnemonic: <em>"My Very Educated Mother Just Showed Us Neptune!"</em></p>
        `,
        definitions: [
          { term: "Star (तारा)", meaning: "A celestial body of hot gas that generates its own light and heat through nuclear energy (e.g., The Sun)." },
          { term: "Planet (ग्रह)", meaning: "A large celestial body that revolves around a star and does not produce its own light." },
          { term: "Orbit (कक्षा)", meaning: "The specific oval-shaped pathway along which a planet travels around the Sun." }
        ],
        examples: [
          "Think of a merry-go-round at a village fair: just as the horses move in a circle around the center pole without bumping into each other, each planet stays in its own lane (orbit) around the Sun.",
          "When you light a diya in the dark, you can see objects nearby because of its light; similarly, the planets reflect the Sun's light to become visible to us."
        ],
        keyPoints: [
          "The Sun is a self-luminous star situated at the gravitational center of our solar system.",
          "There are 8 recognized planets; Pluto was reclassified as a 'dwarf planet' in 2006 by the IAU.",
          "Planets do not twinkle like distant stars because they are closer to us and reflect sunlight steadily."
        ],
        summary: "The Solar System is made of the central Sun and eight orbiting planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Gravity holds each planet in its designated orbit.",
        pdfName: "Std5_Sci_Ch1_Topic1_Sun_and_Planets.pdf"
      },
      {
        id: "top_std5_sci_ch1_2",
        topicNumber: 2,
        titleEn: "Satellites, Asteroids, and India's Space Feats",
        titleMr: "उपग्रह, लघुग्रह आणि भारताची अंतराळ भरारी",
        titleHi: "उपग्रह, क्षुद्रग्रह और भारत का अंतरिक्ष अभियान",
        objectives: [
          "Explain what natural and man-made satellites are",
          "Identify the location of the Asteroid Belt",
          "Learn about ISRO's Mangalyaan and Chandrayaan missions"
        ],
        intro: "Did you know that while planets revolve around the Sun, other smaller celestial bodies revolve around the planets? And India's scientists at ISRO have launched incredible spacecraft to explore them!",
        explanation: `
          <p>A celestial body that revolves around a planet is called a <strong>Satellite (उपग्रह)</strong>. The <strong>Moon</strong> is the Earth's only natural satellite. It completes one trip around the Earth in about 27.3 days. Humans have also sent thousands of <strong>artificial satellites</strong> into orbit for weather forecasts, mobile communication, and GPS maps.</p>
          <p class="mt-3">Between the orbits of Mars and Jupiter lies a wide band of millions of rocky fragments called the <strong>Asteroid Belt (लघुग्रहांचा पट्टा)</strong>. These are rocky leftovers from the early formation of the solar system.</p>
          <div class="my-4 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800">
            <h5 class="font-bold text-sky-900 dark:text-sky-200 mb-1">India's Pride: ISRO's Space Missions</h5>
            <p class="text-xs text-slate-700 dark:text-slate-300">
              In 2008, the Indian Space Research Organisation (ISRO) launched <strong>Chandrayaan-1</strong> and discovered water molecules on the Moon. In 2013, ISRO launched <strong>Mangalyaan (Mars Orbiter Mission)</strong>, making India the first country in the world to reach Martian orbit on its very first attempt, and at a fraction of the cost of Hollywood films!
            </p>
          </div>
        `,
        definitions: [
          { term: "Satellite (उपग्रह)", meaning: "A smaller body that revolves around a planet (e.g., Moon for Earth, Titan for Saturn)." },
          { term: "Asteroid (लघुग्रह)", meaning: "Small, rocky remnants orbiting the Sun between the orbits of Mars and Jupiter." },
          { term: "Gravity (गुरुत्वाकर्षण)", meaning: "The universal force of attraction between all matter in the cosmos." }
        ],
        examples: [
          "When you watch live cricket on television or check tomorrow's rain forecast on a smartphone, you are receiving signals relayed by artificial satellites orbiting high above Earth.",
          "The Moon shining at night is not glowing by itself; it acts like a giant mirror in space reflecting sunlight onto Earth."
        ],
        keyPoints: [
          "The Moon is Earth's only natural satellite.",
          "The Asteroid Belt is located strictly between the orbits of Mars and Jupiter.",
          "ISRO is India's premier space agency, known globally for reliable launch vehicles like PSLV and GSLV."
        ],
        summary: "Satellites revolve around planets. The Asteroid belt lies between Mars and Jupiter. India's ISRO has achieved historic success with Chandrayaan and Mangalyaan.",
        pdfName: "Std5_Sci_Ch1_Topic2_Satellites_and_ISRO.pdf"
      }
    ],

    // -------------------------------------------------------------
    // STD 7 SCIENCE CH 1: Living World Adaptation
    // -------------------------------------------------------------
    "std7_sci_ch1": [
      {
        id: "top_std7_sci_ch1_1",
        topicNumber: 1,
        titleEn: "Adaptation in Aquatic and Desert Plants",
        titleMr: "जलीय व वाळवंटी वनस्पतींमधील अनुकूलन",
        titleHi: "जलीय और मरुस्थलीय पौधों में अनुकूलन",
        objectives: [
          "Define what biological adaptation means",
          "Identify structural features of aquatic plants like Lotus",
          "Explain how desert plants like Cactus conserve scarce water"
        ],
        intro: "Why doesn't a lotus rot under water? Why can a cactus survive in the blistering Thar desert without watering for months? Nature equips every living organism with special survival tools!",
        explanation: `
          <p><strong>Adaptation (अनुकूलन)</strong> is the gradual modification in the body parts, structures, and behavioral habits of an organism that helps it live, feed, defend itself, and reproduce successfully in its specific environment.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <h5 class="font-bold text-blue-900 dark:text-blue-200 text-sm mb-1">Aquatic Plants (Lotus, Hydrilla)</h5>
              <ul class="list-disc pl-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <li>Stems are soft, flexible, and slender to bend with water currents.</li>
                <li>Leaves and stems have a waxy coating so water droplets roll right off.</li>
                <li>Spongy petioles contain air spaces that provide buoyancy for floating.</li>
              </ul>
            </div>
            <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <h5 class="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1">Desert Plants (Cactus, Acacia)</h5>
              <ul class="list-disc pl-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
                <li>Leaves are modified into sharp thorns/spines to minimize water loss by transpiration.</li>
                <li>The fleshy green stem performs photosynthesis and stores water and food.</li>
                <li>Roots penetrate deep into the ground in search of moisture.</li>
              </ul>
            </div>
          </div>
        `,
        definitions: [
          { term: "Adaptation (अनुकूलन)", meaning: "Gradual evolutionary changes in body parts and behaviors that enable survival in a habitat." },
          { term: "Transpiration (बाष्पोत्सर्जन)", meaning: "The process by which plants release excess water vapor into the air through microscopic stomata." },
          { term: "Petiole (देठ)", meaning: "The stalk that attaches the leaf blade to the plant stem, often spongy in aquatic flora." }
        ],
        examples: [
          "If you dip your hand into oily water, water droplets roll off your skin; similarly, the waxy layer on lotus leaves stops water from rotting the delicate leaf cells.",
          "Camels have long eyelashes and sealable nostrils to keep out blowing desert sand during dust storms."
        ],
        keyPoints: [
          "Aquatic plants float easily thanks to air chambers in their stems and waxy leaf coatings.",
          "Desert plants transform leaves into thorns to prevent water loss; their green stems make food.",
          "Adaptations occur slowly over hundreds of generations."
        ],
        summary: "Living organisms develop specific physical adaptations to thrive in their surroundings. Aquatic plants possess buoyancy chambers, while desert plants minimize transpiration with thorns.",
        pdfName: "Std7_Sci_Ch1_Topic1_Plant_Adaptations.pdf"
      }
    ],

    // -------------------------------------------------------------
    // STD 7 MATHS CH 13: Pythagoras Theorem
    // -------------------------------------------------------------
    "std7_math_ch13": [
      {
        id: "top_std7_math_ch13_1",
        topicNumber: 1,
        titleEn: "The Pythagoras Theorem: Hypotenuse and Legs",
        titleMr: "पायथागोरसचा सिद्धांत: कर्ण आणि काटकोन करणाऱ्या बाजू",
        titleHi: "पाइथागोरस प्रमेय: कर्ण और लंब-आधार भुजाएँ",
        objectives: [
          "Identify the hypotenuse in any right-angled triangle",
          "State and write the Pythagoras Theorem formula: a² + b² = c²",
          "Calculate the unknown hypotenuse using step-by-step arithmetic"
        ],
        intro: "Over 2,500 years ago, Greek philosopher Pythagoras and ancient Indian mathematician Baudhayana discovered a magical relationship among the three sides of any right-angled triangle that engineers and architects still use every day to build sturdy buildings and bridges!",
        explanation: `
          <p>In a <strong>right-angled triangle (काटकोन त्रिकोण)</strong>, one angle measures exactly <strong>90°</strong>. The side directly opposite the 90° angle is the longest side and is called the <strong>Hypotenuse (कर्ण)</strong>.</p>
          <div class="my-4 p-5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 text-center">
            <span class="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">The Golden Formula</span>
            <h4 class="text-2xl font-black text-slate-900 dark:text-white my-2">
              (Hypotenuse)² = (Side 1)² + (Side 2)²
            </h4>
            <p class="text-sm font-mono text-amber-800 dark:text-amber-300">
              c² = a² + b²
            </p>
          </div>
          <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h5 class="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">Step-by-Step Worked Problem:</h5>
            <p class="text-xs font-bold text-slate-800 dark:text-slate-200">
              Problem: In right-angled △PQR, ∠Q = 90°. If side PQ = 6 cm and side QR = 8 cm, find the length of hypotenuse PR.
            </p>
            <div class="mt-2 text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono">
              <p>Step 1: Given: PQ = 6 cm, QR = 8 cm, ∠Q = 90°</p>
              <p>Step 2: By Pythagoras Theorem: (PR)² = (PQ)² + (QR)²</p>
              <p>Step 3: (PR)² = 6² + 8² = 36 + 64 = 100</p>
              <p>Step 4: PR = √100 = 10 cm</p>
              <p class="text-emerald-600 dark:text-emerald-400 font-bold">Final Answer: The hypotenuse PR is 10 cm.</p>
            </div>
          </div>
        `,
        definitions: [
          { term: "Hypotenuse (कर्ण)", meaning: "The longest side of a right-angled triangle, situated strictly opposite the right (90°) angle." },
          { term: "Right Angle (काटकोन)", meaning: "An angle measuring exactly 90 degrees." },
          { term: "Pythagorean Triplet (पायथागोरियन त्रिकूट)", meaning: "Three natural numbers (a, b, c) such that a² + b² = c² (e.g., 3, 4, 5 or 5, 12, 13)." }
        ],
        examples: [
          "Carpenters and builders verify if a room's corner is a perfect 90° square by measuring 3 feet along one wall, 4 feet along the adjoining wall, and checking if the diagonal distance between the points is exactly 5 feet!",
          "If a 15-meter ladder leans against a vertical wall with its base 9 meters away from the wall, Pythagoras theorem lets you immediately find the exact height where the ladder touches the wall."
        ],
        keyPoints: [
          "The theorem applies ONLY to right-angled triangles.",
          "The hypotenuse is always the longest side.",
          "Pythagorean Triplet test: check if the square of the largest number equals the sum of squares of the other two numbers."
        ],
        summary: "Pythagoras theorem states that in any right triangle, the square of the hypotenuse equals the sum of the squares of the two perpendicular sides: c² = a² + b².",
        pdfName: "Std7_Maths_Ch13_Pythagoras_Theorem.pdf"
      }
    ]
  },

  // Dynamic topic generator for all other chapters in Balbharti syllabus
  getTopicsForChapter: function(chapter) {
    if (!chapter) return [];

    // If pre-defined custom topics exist, return them
    if (this.customTopicBank[chapter.id]) {
      return this.customTopicBank[chapter.id];
    }

    // Otherwise, generate 2-3 structured, comprehensive topics derived from authentic chapter content
    const lang = window.ShikshaApp ? window.ShikshaApp.currentLanguage : "en";
    const chTitle = lang === "mr" ? chapter.titleMr : (lang === "hi" ? chapter.titleHi : chapter.titleEn);
    const keyPts = chapter.keyPoints || [];
    const pt1 = keyPts[0] || "Foundational principles and terminology.";
    const pt2 = keyPts[1] || "Core concepts, mechanisms, and real-world observations.";
    const pt3 = keyPts[2] || "Practical applications, solved questions, and review.";

    return [
      {
        id: `${chapter.id}_top1`,
        topicNumber: 1,
        titleEn: `Introduction & Fundamentals of ${chapter.titleEn}`,
        titleMr: `${chapter.titleMr} ची तोंडओळख व मूलभूत संबोध`,
        titleHi: `${chapter.titleHi} का परिचय और मूलभूत अवधारणाएँ`,
        objectives: [
          `Understand the primary definition and scope of ${chapter.titleEn}`,
          "Explore historical or practical context aligned with Maharashtra Balbharti",
          "Learn key terminology and essential scientific or mathematical formulas"
        ],
        intro: `Welcome to Topic 1 of Chapter ${chapter.chapterNumber}. In this topic, we break down the foundational principles of ${chTitle} with clear, age-appropriate explanations and Indian examples.`,
        explanation: `
          <p class="leading-relaxed">${chapter.summary}</p>
          <div class="my-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
            <h5 class="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1">Key Observation:</h5>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${pt1}</p>
          </div>
          ${chapter.canYouRecall ? `
            <div class="my-3 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/30 border-l-4 border-sky-500 text-xs">
              <strong class="text-sky-800 dark:text-sky-300">Recall from Previous Classes:</strong>
              <p class="text-slate-700 dark:text-slate-300 mt-0.5">${chapter.canYouRecall}</p>
            </div>
          ` : ''}
        `,
        definitions: [
          { term: `${chapter.titleEn} Core Concept`, meaning: pt1 },
          { term: "Balbharti Standard Reference", meaning: `Class ${chapter.standard} curriculum framework for ${chapter.subject.toUpperCase()}.` }
        ],
        examples: [
          `Everyday application: How ${chapter.titleEn} is observed in nature, machines, or daily household activities.`,
          `Practical exercise: Relating textbook concepts to environmental and community observations in Maharashtra.`
        ],
        keyPoints: [
          pt1,
          pt2,
          "Always review the chapter diagram or numerical steps to reinforce your conceptual foundation."
        ],
        summary: `This topic introduced the essential concepts of ${chTitle}. Mastering these fundamentals sets you up for advanced problem-solving in the next topic.`,
        pdfName: `${chapter.id}_Topic1_Notes.pdf`
      },
      {
        id: `${chapter.id}_top2`,
        topicNumber: 2,
        titleEn: `In-Depth Analysis & Practical Applications`,
        titleMr: `सखोल अभ्यास व प्रत्यक्ष उपयोजन`,
        titleHi: `गहन अध्ययन और व्यावहारिक अनुप्रयोग`,
        objectives: [
          "Deepen your understanding of mechanisms and principles",
          "Apply mathematical rules, formulas, or scientific experiments",
          "Solve typical school exam questions with full working steps"
        ],
        intro: `Now that you understand the fundamentals, let's explore how ${chTitle} operates in depth through practical experiments, numericals, and Balbharti textbook exercises.`,
        explanation: `
          <p class="leading-relaxed">${pt2}</p>
          <div class="my-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <h5 class="font-bold text-emerald-900 dark:text-emerald-200 text-sm mb-1">Curriculum Takeaway:</h5>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${pt3}</p>
          </div>
          ${chapter.doYouKnow ? `
            <div class="my-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 text-xs">
              <strong class="text-amber-800 dark:text-amber-300">Do You Know? (माहीत आहे का तुम्हांला?)</strong>
              <p class="text-slate-700 dark:text-slate-300 mt-0.5">${chapter.doYouKnow}</p>
            </div>
          ` : ''}
        `,
        definitions: [
          { term: "Exam Tip", meaning: "Write answers with labeled points, units, and clear formulas to score full marks." },
          { term: "Practical Rule", meaning: pt3 }
        ],
        examples: [
          "Exam-style practice: Analyze the given question, list known parameters, apply the exact Balbharti rule, and verify the result.",
          "Real-life connection: Recognizing these phenomena in Maharashtra's geography, industry, or agriculture."
        ],
        keyPoints: [
          pt2,
          pt3,
          "Consistent practice of worked examples ensures rapid recall during periodic and semester tests."
        ],
        summary: `In Topic 2, we mastered detailed applications, problem-solving, and practical implications of ${chTitle}.`,
        pdfName: `${chapter.id}_Topic2_Notes.pdf`
      }
    ];
  }
};
