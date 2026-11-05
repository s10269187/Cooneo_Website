/* ==========================================================
   COONEO 酷牛 — PRODUCT DATA (shop)
   ----------------------------------------------------------
   This is the ONE place to edit what the online shop sells:
   names, descriptions, photos, prices and options.

   PRICES: all prices are in Chinese Yuan (¥ / CNY) and follow
   the COONEO Taobao store. The store could not be opened when
   this file was made, so every price is 0 and marked "TODO".
   A price of 0 is shown on the website as "Price TBC".
   Like on Taobao, the listed price is only a DEPOSIT — customer
   service confirms the final price. No payment happens online.

   HOW A PRODUCT IS WRITTEN
   {
     id:          "roboox",            ← short unique name, used in links (product.html?id=roboox)
     category:    "robots",            ← "robots", "arms" or "effectors" (the shop filter)
     name:        { en: "...", zh: "..." },
     tagline:     { en: "...", zh: "..." },   ← short line under the name
     description: { en: "...", zh: "..." },
     images:      ["Assets/Images/...jpg", ...],  ← first one is used on the shop grid
     basePrice:   0,                   ← price in ¥ before options
     specSheet:   "roboox",            ← (optional) PDF in Assets/Docs/spec-sheets/
     optionGroups: [
       {
         id: "functions",              ← short unique name inside this product
         label: { en: "...", zh: "..." },
         type: "multi",                ← "single" = choose one, "multi" = choose any
         required: false,              ← true = the customer must choose before Add to Cart
         choices: [
           { id: "tilling", label: { en: "Tilling", zh: "耕地" }, price: 0 },  ← price = extra ¥ added
         ],
       },
     ],
   }
   ========================================================== */

// Approximate exchange rate used to show a small SGD price next to the ¥ price.
// TODO: update this now and then (1 CNY ≈ ? SGD).
const CNY_TO_SGD = 0.18;

const PRODUCTS = [
  /* ---------------- Agricultural robots ---------------- */
  {
    id: "roboox",
    category: "robots",
    name: { en: "RoboOX", zh: "RoboOX 机器牛" },
    tagline: { en: "Tillage / Harvesting Multi-Function Robot", zh: "耕地/采摘多功能机器人" },
    description: {
      en: "A high-payload, four-wheel-drive autonomous farm robot. Its powerful independent drive and heavy-duty frame suit long, demanding jobs — on plains as well as hilly land with low mechanisation — and it can work day and night in remote-control or autonomous mode.",
      zh: "一款集大负载、四驱、无人驾驶于一体的智能农业机器人。大功率四轮独立驱动与超强承载结构，适用于高负荷、长时间连续作业，不仅适用于平原，也能胜任机械化水平较低的丘陵山地；支持遥控与自动导航双模式，可昼夜作业。",
    },
    images: [
      "Assets/Images/products/roboox.jpg",
      "Assets/Images/products/roboox-2.jpg",
      "Assets/Images/products/roboox-3.jpg",
      "Assets/Images/products/roboox-4.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "roboox",
    optionGroups: [
      {
        id: "functions",
        label: { en: "Add functions", zh: "选择功能" },
        type: "multi",
        required: false,
        choices: [
          { id: "tilling", label: { en: "Tilling", zh: "耕地" }, price: 0 }, // TODO: price
          { id: "weeding", label: { en: "Weeding", zh: "除草" }, price: 0 }, // TODO: price
          { id: "spraying", label: { en: "Spraying", zh: "喷洒" }, price: 0 }, // TODO: price
          { id: "harvesting", label: { en: "Harvesting assist", zh: "采收辅助" }, price: 0 }, // TODO: price
        ],
      },
    ],
  },
  {
    id: "roboox-mini",
    category: "robots",
    name: { en: "RoboOX mini", zh: "RoboOX mini" },
    tagline: { en: "Precision Multi-Functional Agricultural Robot", zh: "精准多功能智能农业机器人" },
    description: {
      en: "A compact robot built around AI and automation for precision farming. As the core of our modular system, it connects to the full range of tools — one machine, many tasks — balancing precision and cost.",
      zh: "一款小型化的精准多功能农业机器人，集成先进自动化技术与 AI 算法。作为模块化系统的核心载体，支持全系功能配件快速连接与切换，实现“一机多用”，兼顾作业精度与经济性。",
    },
    images: [
      "Assets/Images/products/roboox-mini.jpg",
      "Assets/Images/products/roboox-mini-2.jpg",
      "Assets/Images/products/roboox-mini-3.jpg",
      "Assets/Images/products/roboox-mini-4.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "roboox-mini",
    optionGroups: [
      {
        // TODO: placeholder options (taken from the brochure's compatible modules) — check against Taobao
        id: "modules",
        label: { en: "Add-on modules", zh: "选配模块" },
        type: "multi",
        required: false,
        choices: [
          { id: "soil", label: { en: "Soil preparation system", zh: "整地系统" }, price: 0 }, // TODO
          { id: "seeding", label: { en: "Seeding system", zh: "播种系统" }, price: 0 }, // TODO
          { id: "laser-weeder", label: { en: "Laser weeder", zh: "激光除草器" }, price: 0 }, // TODO
          { id: "arm", label: { en: "Robotic arm (serial / parallel)", zh: "机械臂（串联/并联）" }, price: 0 }, // TODO
          { id: "gripper", label: { en: "Picking gripper (rigid / soft)", zh: "采摘手（刚性/柔性）" }, price: 0 }, // TODO
        ],
      },
    ],
  },
  {
    id: "stier",
    category: "robots",
    name: { en: "Stier", zh: "Stier" },
    tagline: { en: "Monitoring / Pruning / Picking Robot", zh: "监测/修剪/采摘多功能机器人" },
    description: {
      en: "The most compact robot in the range. It turns on the spot and is designed for low canopies and dense crop rows such as strawberry tunnels and vineyards. Its ultra-quiet operation suits greenhouses and orchards.",
      zh: "系列中机身最紧凑的机器人，可原地转向，专为低矮冠层与密集作物行间（如草莓棚、葡萄架下）设计；超静音运行，适合温室、果园等对噪音敏感的环境。",
    },
    images: [
      "Assets/Images/products/stier.jpg",
      "Assets/Images/products/stier-2.jpg",
      "Assets/Images/products/stier-3.jpg",
      "Assets/Images/products/stier-4.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "stier",
    optionGroups: [
      {
        // TODO: placeholder options (from the brochure's compatible modules) — check against Taobao
        id: "modules",
        label: { en: "Add-on modules", zh: "选配模块" },
        type: "multi",
        required: false,
        choices: [
          { id: "arm", label: { en: "Robotic arm (serial / parallel)", zh: "机械臂（串联/并联）" }, price: 0 }, // TODO
          { id: "gripper", label: { en: "Picking gripper (rigid / soft)", zh: "采摘手（刚性/柔性）" }, price: 0 }, // TODO
        ],
      },
    ],
  },
  {
    id: "bison",
    category: "robots",
    name: { en: "Bison", zh: "Bison" },
    tagline: { en: "Tracked Robot", zh: "履带式机器人" },
    description: {
      en: "A modular, lightweight tracked robot. Low ground pressure and strong grip keep it stable on mud, sand and steep slopes, and it can plan routes and avoid obstacles on its own.",
      zh: "采用模块化、轻量化设计的全地形履带机器人。接地压力低、抓地力强，在泥泞、沙地、陡坡等复杂地形上依然稳定，并可自主规划路径、避开障碍。",
    },
    images: [
      "Assets/Images/products/bison.jpg",
      "Assets/Images/products/bison-2.jpg",
      "Assets/Images/products/bison-3.jpg",
      "Assets/Images/products/bison-4.jpg",
      "Assets/Images/products/bison-5.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "bison",
    optionGroups: [
      {
        // TODO: placeholder options (from the brochure's compatible modules) — check against Taobao
        id: "modules",
        label: { en: "Add-on modules", zh: "选配模块" },
        type: "multi",
        required: false,
        choices: [
          { id: "arm", label: { en: "Robotic arm (serial / parallel)", zh: "机械臂（串联/并联）" }, price: 0 }, // TODO
          { id: "gripper", label: { en: "Picking gripper (rigid / soft)", zh: "采摘手（刚性/柔性）" }, price: 0 }, // TODO
          { id: "spray-boom", label: { en: "Crop-protection spray boom", zh: "植保喷杆" }, price: 0 }, // TODO
        ],
      },
    ],
  },
  {
    id: "transport-robot",
    category: "robots",
    name: { en: "Autonomous Transport Robot", zh: "自主运输机器人" },
    tagline: { en: "Smart Transport", zh: "智能转运" },
    description: {
      en: "A compact, agile transport robot that plans its own routes. It handles hills and rough field paths as easily as lifts and narrow corridors.",
      zh: "一款高度集成、灵巧高效的智能转运设备，可自主规划路线，从丘陵山地、田间小路到电梯与狭窄通道都能轻松应对。",
    },
    images: [
      "Assets/Images/products/transport-robot.jpg",
      "Assets/Images/products/transport-robot-2.jpg",
      "Assets/Images/products/transport-robot-3.jpg",
      "Assets/Images/products/transport-robot-4.jpg",
      "Assets/Images/products/transport-robot-5.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "transport-robot",
    optionGroups: [], // TODO: add options here if the Taobao listing has any
  },

  /* ---------------- Robotic arms (grouping follows brochure page 17) ---------------- */
  {
    id: "serial-arm",
    category: "arms",
    name: { en: "Serial Robotic Arm", zh: "串联机械臂" },
    tagline: { en: "For makers, classrooms and labs", zh: "适用于创客、教学与实验室" },
    description: {
      en: "Plug-and-play and open for secondary development — ideal for maker projects, teaching and light-duty applications.",
      zh: "即装即用、支持二次开发，适用于创客开发、教学实训及轻量化应用。",
    },
    images: [
      "Assets/Images/products/serial-arm.jpg",
      "Assets/Images/products/serial-arm-2.jpg",
      "Assets/Images/products/serial-arm-3.jpg",
      "Assets/Images/products/serial-arm-4.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "serial-arm",
    optionGroups: [
      {
        // TODO: placeholder — the brochure mentions "a choice of high-torque servo options"; use the real Taobao choices
        id: "servo",
        label: { en: "Servo", zh: "舵机" },
        type: "single",
        required: true,
        choices: [
          { id: "standard", label: { en: "Standard servo (TODO)", zh: "标准舵机（待定）" }, price: 0 }, // TODO
          { id: "high-torque", label: { en: "High-torque servo (TODO)", zh: "大扭矩舵机（待定）" }, price: 0 }, // TODO
        ],
      },
    ],
  },
  {
    id: "parallel-arm",
    category: "arms",
    name: { en: "Parallel Robotic Arm", zh: "并联机械臂" },
    tagline: { en: "For small production lines, labs and DIY", zh: "适用于小型产线、实验室与 DIY" },
    description: {
      en: "Ultra-light, low-energy and quiet — suited to small production lines, labs and DIY development.",
      zh: "超轻机身、低能耗、低噪音，适配小型产线、实验室及 DIY 开发。",
    },
    images: [
      "Assets/Images/products/parallel-arm.jpg",
      "Assets/Images/products/parallel-arm-2.jpg",
      "Assets/Images/products/parallel-arm-3.jpg",
      "Assets/Images/products/parallel-arm-4.jpg",
    ],
    basePrice: 0, // TODO: price from Taobao
    specSheet: "parallel-arm",
    optionGroups: [
      {
        // TODO: placeholder — the brochure lists these interchangeable end effectors; check against Taobao
        id: "end-effector",
        label: { en: "End effector", zh: "末端执行器" },
        type: "single",
        required: true,
        choices: [
          { id: "soft-gripper", label: { en: "Soft gripper", zh: "柔性机械爪" }, price: 0 }, // TODO
          { id: "rigid-gripper", label: { en: "Rigid gripper", zh: "刚性机械爪" }, price: 0 }, // TODO
          { id: "seeding", label: { en: "Seeding", zh: "播种" }, price: 0 }, // TODO
          { id: "cutting", label: { en: "Cutting", zh: "剪切" }, price: 0 }, // TODO
        ],
      },
    ],
  },
  {
    id: "cutting-arm",
    category: "arms",
    name: { en: "Cutting Robotic Arm", zh: "剪切机械臂" },
    tagline: { en: "Branch pruning", zh: "枝条修剪" },
    description: {
      en: "Arm-mounted cutting tool for branch pruning.",
      zh: "臂载剪切工具，用于枝条修剪。",
    },
    images: ["Assets/Images/shop/cutting-arm.jpg"],
    basePrice: 0, // TODO: price from Taobao
    optionGroups: [],
  },
  {
    id: "laser-weeder",
    category: "arms",
    name: { en: "Laser Weeder", zh: "激光除草器" },
    tagline: { en: "Herbicide-free weeding", zh: "无需除草剂的智能除草" },
    description: {
      en: "AI vision finds weeds and removes them with a laser — no herbicides needed.",
      zh: "AI 视觉识别杂草并以激光清除，无需使用除草剂。",
    },
    images: ["Assets/Images/shop/laser-weeder.jpg"],
    basePrice: 0, // TODO: price from Taobao
    optionGroups: [],
  },
  {
    id: "seeder",
    category: "arms",
    name: { en: "Seeder", zh: "播种器" },
    tagline: { en: "Precision seeding", zh: "精准播种" },
    description: {
      en: "A module for precision seeding.",
      zh: "实现精准播种作业。",
    },
    images: ["Assets/Images/shop/seeder.jpg"],
    basePrice: 0, // TODO: price from Taobao
    optionGroups: [],
  },

  /* ---------------- End effectors ---------------- */
  {
    id: "soft-gripper",
    category: "effectors",
    name: { en: "Soft Gripper", zh: "柔性机械爪" },
    tagline: { en: "2-finger / 3-finger", zh: "二指 / 三指" },
    description: {
      en: "Soft, bionic materials wrap around produce for damage-free picking of flowers, fruit and vegetables.",
      zh: "仿生柔性材料贴合果实表面，实现花、果、蔬的无损采摘。",
    },
    images: ["Assets/Images/shop/soft-gripper-3.jpg", "Assets/Images/shop/soft-gripper-2.jpg"],
    basePrice: 0, // TODO: price from Taobao
    optionGroups: [
      {
        id: "fingers",
        label: { en: "Fingers", zh: "手指数量" },
        type: "single",
        required: true,
        choices: [
          { id: "2-finger", label: { en: "2-finger", zh: "二指" }, price: 0 }, // TODO: price
          { id: "3-finger", label: { en: "3-finger", zh: "三指" }, price: 0 }, // TODO: price
        ],
      },
    ],
  },
  {
    id: "rigid-gripper",
    category: "effectors",
    name: { en: "3-Finger Rigid Gripper", zh: "三指刚性机械爪" },
    tagline: { en: "For heavier crops", zh: "适合较重作物" },
    description: {
      en: "A stable, durable grip for heavier crops such as tomatoes.",
      zh: "抓握稳定、耐用，适合番茄等较重作物。",
    },
    images: ["Assets/Images/shop/rigid-gripper.jpg"],
    basePrice: 0, // TODO: price from Taobao
    optionGroups: [],
  },
  {
    id: "shears",
    category: "effectors",
    name: { en: "Shears", zh: "剪刀" },
    tagline: { en: "Electric / automatic", zh: "电动 / 自动" },
    description: {
      en: "Precise cutting for pruning and harvesting.",
      zh: "精准剪切，用于修剪与采收。",
    },
    images: ["Assets/Images/shop/electric-shears.jpg", "Assets/Images/shop/auto-shears.jpg"],
    basePrice: 0, // TODO: price from Taobao
    optionGroups: [
      {
        id: "type",
        label: { en: "Type", zh: "类型" },
        type: "single",
        required: true,
        choices: [
          { id: "electric", label: { en: "Electric shears", zh: "电动剪刀" }, price: 0 }, // TODO: price
          { id: "automatic", label: { en: "Automatic shears", zh: "自动剪刀" }, price: 0 }, // TODO: price
        ],
      },
    ],
  },
];
