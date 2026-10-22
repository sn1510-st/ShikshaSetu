// ShikshaSetu Comprehensive Numerically Solved Maths Repository
window.SHIKSHA_MATH_BANK = {
  // -------------------------------------------------------------
  // CLASS 5 NUMERICALS
  // -------------------------------------------------------------
  std5: [
    {
      topic: "Roman Numerals",
      level: "Class 5",
      problem: "Write the Hindu-Arabic numbers for: (a) LXXVIII, (b) XLIV, (c) XCVI",
      formula: "Decompose into standard symbols: L = 50, X = 10, V = 5, I = 1, C = 100",
      steps: [
        "For LXXVIII: L(50) + XX(20) + V(5) + III(3) = 50 + 20 + 5 + 3 = 78",
        "For XLIV: XL(50 - 10 = 40) + IV(5 - 1 = 4) = 40 + 4 = 44",
        "For XCVI: XC(100 - 10 = 90) + VI(5 + 1 = 6) = 90 + 6 = 96"
      ],
      answer: "(a) 78, (b) 44, (c) 96"
    },
    {
      topic: "Large Numbers Addition & Subtraction",
      level: "Class 5",
      problem: "A sugar factory produced 35,46,780 bags of sugar in the first year and 28,95,450 bags in the second year. How many bags were produced in both years together? How many more bags were produced in the first year?",
      formula: "Total bags = Year 1 + Year 2; Difference = Year 1 - Year 2",
      steps: [
        "Step 1: Total bags = 35,46,780 + 28,95,450",
        "Units: 0 + 0 = 0",
        "Tens: 8 + 5 = 13 (3, carry 1)",
        "Hundreds: 7 + 4 + 1 = 12 (2, carry 1)",
        "Thousands: 6 + 5 + 1 = 12 (2, carry 1)",
        "Ten Thousands: 4 + 9 + 1 = 14 (4, carry 1)",
        "Lakhs: 5 + 8 + 1 = 14 (4, carry 1)",
        "Ten Lakhs: 3 + 2 + 1 = 6 => 64,42,230 bags",
        "Step 2: Difference = 35,46,780 - 28,95,450 = 6,51,330 bags"
      ],
      answer: "Total = 64,42,230 bags; More in first year = 6,51,330 bags"
    },
    {
      topic: "Operations on Fractions",
      level: "Class 5",
      problem: "Solve: (3/8 + 5/12) and (7/10 - 2/5)",
      formula: "Find LCM of denominators to convert into like fractions",
      steps: [
        "Part A: Denominators are 8 and 12. LCM(8, 12) = 24",
        "3/8 = (3 x 3)/(8 x 3) = 9/24",
        "5/12 = (5 x 2)/(12 x 2) = 10/24",
        "Sum = 9/24 + 10/24 = 19/24",
        "Part B: Denominators are 10 and 5. LCM(10, 5) = 10",
        "2/5 = (2 x 2)/(5 x 2) = 4/10",
        "Difference = 7/10 - 4/10 = 3/10"
      ],
      answer: "Part A = 19/24; Part B = 3/10"
    },
    {
      topic: "Multiplication of Large Numbers",
      level: "Class 5",
      problem: "A bicycle costs ₹3,475. A school purchased 125 bicycles for its students. What was the total amount spent?",
      formula: "Total cost = Cost per bicycle x Number of bicycles",
      steps: [
        "Multiply 3,475 x 125",
        "3475 x 5 = 17,375",
        "3475 x 20 = 69,500",
        "3475 x 100 = 3,47,500",
        "Sum = 17375 + 69500 + 347500 = ₹4,34,375"
      ],
      answer: "Total amount spent = ₹4,34,375"
    }
  ],

  // -------------------------------------------------------------
  // CLASS 6 NUMERICALS
  // -------------------------------------------------------------
  std6: [
    {
      topic: "Integers Arithmetic",
      level: "Class 6",
      problem: "Evaluate: (-34) + 52 - (-18) + (-27) - 15",
      formula: "Remove parentheses with sign rules: -(-a) = +a, +(-a) = -a",
      steps: [
        "Rewrite: -34 + 52 + 18 - 27 - 15",
        "Group positive numbers: 52 + 18 = +70",
        "Group negative numbers: (-34) + (-27) + (-15) = -76",
        "Combine: 70 - 76 = -6"
      ],
      answer: "-6"
    },
    {
      topic: "HCF by Division / Ladder Method",
      level: "Class 6",
      problem: "Find the greatest number which divides 144, 180, and 192 without leaving any remainder.",
      formula: "Greatest common divisor = HCF(144, 180, 192)",
      steps: [
        "Prime factorize 144 = 2^4 x 3^2",
        "Prime factorize 180 = 2^2 x 3^2 x 5",
        "Prime factorize 192 = 2^6 x 3^1",
        "Common prime factors with lowest powers = 2^2 x 3^1 = 4 x 3 = 12"
      ],
      answer: "The greatest number is 12"
    },
    {
      topic: "LCM Word Problem (Paving / Tiles)",
      level: "Class 6",
      problem: "A room floor is 8 meters long and 6 meters wide. Find the minimum number of identical square tiles required to pave the entire floor without cutting any tile.",
      formula: "Tile size = HCF(Length, Breadth); Number of tiles = Area of floor / Area of 1 tile",
      steps: [
        "Length = 8 m = 800 cm, Breadth = 6 m = 600 cm",
        "Find HCF(800, 600) = 200 cm = 2 meters (side of largest square tile)",
        "Area of floor = 800 x 600 = 4,80,000 cm^2",
        "Area of 1 tile = 200 x 200 = 40,000 cm^2",
        "Number of tiles = 4,80,000 / 40,000 = 12 tiles"
      ],
      answer: "12 square tiles of side 2 meters each"
    },
    {
      topic: "Ratio and Proportion",
      level: "Class 6",
      problem: "If 15 workers can build a wall in 48 hours, how many workers will be required to do the same work in 30 hours?",
      formula: "Inverse proportion: Workers x Hours = Constant (w1 x h1 = w2 x h2)",
      steps: [
        "15 x 48 = w2 x 30",
        "720 = 30 x w2",
        "w2 = 720 / 30 = 24 workers"
      ],
      answer: "24 workers"
    }
  ],

  // -------------------------------------------------------------
  // CLASS 7 NUMERICALS
  // -------------------------------------------------------------
  std7: [
    {
      topic: "Laws of Indices",
      level: "Class 7",
      problem: "Simplify and write in index form: [ (3^5)^2 x (3^2)^3 ] / (3^4)^3",
      formula: "(a^m)^n = a^(m x n); a^m x a^n = a^(m + n); a^m / a^n = a^(m - n)",
      steps: [
        "(3^5)^2 = 3^(5 x 2) = 3^10",
        "(3^2)^3 = 3^(2 x 3) = 3^6",
        "Numerator = 3^10 x 3^6 = 3^(10 + 6) = 3^16",
        "Denominator = (3^4)^3 = 3^(4 x 3) = 3^12",
        "Fraction = 3^16 / 3^12 = 3^(16 - 12) = 3^4 = 81"
      ],
      answer: "3^4 = 81"
    },
    {
      topic: "Pythagoras Theorem Word Problem",
      level: "Class 7",
      problem: "A tree was broken by the wind at a height of 5 meters from the ground, and its top touched the ground at a distance of 12 meters from the base of the tree. Find the original total height of the tree.",
      formula: "c^2 = a^2 + b^2 where a = height broken (5 m), b = distance on ground (12 m), c = broken part",
      steps: [
        "Broken part forms hypotenuse c of right-angled triangle",
        "c^2 = 5^2 + 12^2",
        "c^2 = 25 + 144 = 169",
        "c = sqrt(169) = 13 meters",
        "Original height of tree = Standing stem + Fallen top = 5 + 13 = 18 meters"
      ],
      answer: "Original height of the tree = 18 meters"
    },
    {
      topic: "Algebraic Expansion of Squares",
      level: "Class 7",
      problem: "Evaluate: (1) (3a + 5b)^2, (2) (4x - 7y)^2, (3) 998 x 1002 using identities",
      formula: "(a + b)^2 = a^2 + 2ab + b^2; (a - b)^2 = a^2 - 2ab + b^2; (x - y)(x + y) = x^2 - y^2",
      steps: [
        "(1) (3a + 5b)^2 = (3a)^2 + 2(3a)(5b) + (5b)^2 = 9a^2 + 30ab + 25b^2",
        "(2) (4x - 7y)^2 = (4x)^2 - 2(4x)(7y) + (7y)^2 = 16x^2 - 56xy + 49y^2",
        "(3) 998 x 1002 = (1000 - 2)(1000 + 2) = (1000)^2 - 2^2 = 10,00,000 - 4 = 9,99,996"
      ],
      answer: "(1) 9a^2 + 30ab + 25b^2, (2) 16x^2 - 56xy + 49y^2, (3) 9,99,996"
    },
    {
      topic: "Circle Circumference & Area",
      level: "Class 7",
      problem: "The radius of a circular garden is 28 meters. A 4-round wire fence has to be put around it at ₹50 per meter. Find the total cost of fencing.",
      formula: "Circumference C = 2πr; Total wire length = 4 x C; Total Cost = Wire length x Rate",
      steps: [
        "r = 28 m, π = 22/7",
        "Circumference = 2 x (22/7) x 28 = 2 x 22 x 4 = 176 meters",
        "Length of wire for 4 rounds = 176 x 4 = 704 meters",
        "Cost of fencing = 704 x ₹50 = ₹35,200"
      ],
      answer: "Total cost of fencing = ₹35,200"
    }
  ],

  // -------------------------------------------------------------
  // CLASS 8 NUMERICALS
  // -------------------------------------------------------------
  std8: [
    {
      topic: "Expansion Formulae - Cubes",
      level: "Class 8",
      problem: "If x + 1/x = 5, find the value of x^3 + 1/x^3.",
      formula: "(a + b)^3 = a^3 + b^3 + 3ab(a + b) => a^3 + b^3 = (a + b)^3 - 3ab(a + b)",
      steps: [
        "Let a = x and b = 1/x. Notice a x b = x x (1/x) = 1",
        "Take cube on both sides of x + 1/x = 5:",
        "(x + 1/x)^3 = 5^3",
        "x^3 + 1/x^3 + 3(x)(1/x)(x + 1/x) = 125",
        "x^3 + 1/x^3 + 3(1)(5) = 125",
        "x^3 + 1/x^3 + 15 = 125",
        "x^3 + 1/x^3 = 125 - 15 = 110"
      ],
      answer: "x^3 + 1/x^3 = 110"
    },
    {
      topic: "Compound Interest Step-by-Step",
      level: "Class 8",
      problem: "Find the difference between Simple Interest and Compound Interest on ₹25,000 for 2 years at 12% per annum.",
      formula: "SI = (P x R x N)/100; CI = P(1 + R/100)^N - P; Difference = CI - SI",
      steps: [
        "Step 1: Simple Interest = (25000 x 12 x 2) / 100 = 250 x 24 = ₹6,000",
        "Step 2: Compound Amount A = 25000 x (1 + 12/100)^2",
        "A = 25000 x (1.12)^2 = 25000 x 1.2544 = ₹31,360",
        "Compound Interest CI = 31360 - 25000 = ₹6,360",
        "Step 3: Difference = CI - SI = 6360 - 6000 = ₹360"
      ],
      answer: "Difference between CI and SI = ₹360"
    },
    {
      topic: "Surface Area & Volume of Cylinder",
      level: "Class 8",
      problem: "A well with inner diameter 7 meters is dug 20 meters deep. The earth taken out of it has been spread evenly all around it to a width of 3.5 meters to form an embankment. Find the height of the embankment.",
      formula: "Volume of cylinder = πr^2h; Volume of embankment = π(R^2 - r^2) x H",
      steps: [
        "Well inner radius r = 7/2 = 3.5 m, depth h = 20 m",
        "Volume of soil dug out = π x (3.5)^2 x 20 = (22/7) x 12.25 x 20 = 770 m^3",
        "Outer radius of embankment R = 3.5 + 3.5 = 7 m",
        "Base area of embankment = π(R^2 - r^2) = (22/7) x (7^2 - 3.5^2)",
        "= (22/7) x (49 - 12.25) = (22/7) x 36.75 = 115.5 m^2",
        "Height of embankment H = Volume / Area = 770 / 115.5 = 6.67 meters (or 6 2/3 m)"
      ],
      answer: "Height of embankment = 6.67 meters"
    },
    {
      topic: "Factorization of Algebraic Expressions",
      level: "Class 8",
      problem: "Factorize: (1) 2x^2 + 9x + 10, (2) x^3 - 64y^3",
      formula: "(1) Splitting middle term: find numbers whose sum = 9 and product = 2 x 10 = 20; (2) a^3 - b^3 = (a - b)(a^2 + ab + b^2)",
      steps: [
        "Part 1: 2x^2 + 9x + 10",
        "Factors of 20 that add to 9 are 4 and 5 (4 + 5 = 9, 4 x 5 = 20)",
        "= 2x^2 + 4x + 5x + 10",
        "= 2x(x + 2) + 5(x + 2) = (x + 2)(2x + 5)",
        "Part 2: x^3 - 64y^3 = x^3 - (4y)^3",
        "= (x - 4y)(x^2 + x(4y) + (4y)^2)",
        "= (x - 4y)(x^2 + 4xy + 16y^2)"
      ],
      answer: "Part 1: (x + 2)(2x + 5); Part 2: (x - 4y)(x^2 + 4xy + 16y^2)"
    }
  ]
};
