/* ==========================================================
   COONEO 酷牛 — script.js (shared by all pages)
   ----------------------------------------------------------
   1. TRANSLATIONS  ← edit all website text here (English + Chinese)
   2. Language switcher
   3. Mobile menu
   4. Header shadow on scroll
   5. Scroll fade-in animations
   6. Enquiry form (contact page only)
   7. WeChat popup (contact page only)
   8. Footer year
   ========================================================== */

document.documentElement.classList.remove("no-js");

/* ==========================================================
   1. TRANSLATIONS
   Each key matches a data-i18n="..." attribute in the HTML pages.
   To change any text, edit it here in BOTH "en" and "zh".
   Items in [square brackets] are placeholders to replace.
   ========================================================== */
const translations = {
  en: {
    /* ---------- Page titles (browser tab) ---------- */
    "meta.home.title": "COONEO | AI-Powered Agricultural Robots for Smart Farming",
    "meta.home.description":
      "COONEO (酷牛) builds AI-powered agricultural robots, robotic arms and end effectors covering tillage, planting, crop management, harvesting and transport.",
    "meta.products.title": "Products | COONEO",
    "meta.products.description":
      "COONEO agricultural robots (RoboOX, RoboOX mini, Stier, Bison, Autonomous Transport Robot), robotic arms, end effectors and the AgriAI app.",
    "meta.contact.title": "Contact Us | COONEO",
    "meta.contact.description":
      "Contact COONEO about agricultural robots, robotic arms, custom development or distribution partnerships.",

    /* ---------- Navigation ---------- */
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.contact": "Contact Us",
    "nav.language": "Language",
    "nav.menu": "Open menu",

    /* ---------- Shared buttons ---------- */
    "btn.enquire": "Enquire Now",
    "btn.specSheet": "Download Spec Sheet",
    "btn.shopee": "Buy on Shopee",
    "btn.shopeeGrippers": "Shop Grippers on Shopee",

    /* ================= HOME PAGE ================= */
    "home.hero.eyebrow": "COONEO Innovation Technology (Shenzhen) Co., Ltd.",
    "home.hero.title": "AI-powered agricultural robots for smart farming",
    "home.hero.subtitle":
      "We apply AI, IoT and robotics to agriculture — with robots, components and software that cover the whole farming cycle.",
    "home.hero.slogan": "Make farming cool · Help more people love agriculture · Healthy food for everyone",
    "home.hero.ctaProducts": "Explore Products",
    "home.hero.ctaContact": "Contact Us",
    "home.hero.imageAlt": "The COONEO family of agricultural robots",

    "cycle.till": "Tillage",
    "cycle.plant": "Planting",
    "cycle.manage": "Crop Management",
    "cycle.harvest": "Harvesting",
    "cycle.transport": "Transport",

    /* About Us */
    "about.eyebrow": "About Us",
    "about.title": "Reshaping modern farming with AI and robotics",
    "about.p1":
      "COONEO is committed to applying advanced AI, IoT and robotics to smart agriculture and environmental protection. Our product line covers the full farming cycle — tillage, planting, crop management, harvesting and transport — making agriculture smarter, more precise and more sustainable, while genuinely cutting costs and raising efficiency for growers.",
    "about.p2":
      "Rather than single-purpose machines, we build a complete smart-farming ecosystem: robot platforms, in-house core components and intelligent algorithms that work together, refined through repeated field trials.",
    "about.p3":
      "Headquartered in Shenzhen, COONEO also has local R&D and operating teams in Yunnan and Guangxi, and business partnerships in countries including Malaysia and Brazil.",
    "about.imageAlt": "RoboOX agricultural robot working in a field",
    "about.layer1.title": "Complete Robot Systems",
    "about.layer1.desc":
      "Modular field robots with autonomous navigation, environmental sensing and quick-swap tools for many terrains and crops.",
    "about.layer2.title": "Core Components",
    "about.layer2.desc":
      "In-house robotic arms, soft and rigid grippers, laser weeders, shears and seeders for picking, weeding and pruning.",
    "about.layer3.title": "Intelligent Algorithms",
    "about.layer3.desc":
      "GPS/RTK and GPS-free navigation, obstacle avoidance and AI recognition of crops, weeds, diseases and pests.",
    "about.v1.title": "Economic Value",
    "about.v1.desc": "Build a new smart-farming ecosystem and unlock the industry's potential.",
    "about.v2.title": "Social Value",
    "about.v2.desc": "Cultivate a new generation of farmers and make farming cool.",
    "about.v3.title": "Environmental Value",
    "about.v3.desc": "Practise green agriculture and protect the ecological balance.",
    "about.h1": "Founder holds a PhD from Wageningen University (Netherlands)",
    "about.h2": "Member of the NVIDIA Inception Program",
    "about.h3": "Featured by China's national broadcaster CCTV",
    "about.h4": "Proven on demonstration farms in China, Australia and Brazil",

    /* Use cases */
    "useCases.eyebrow": "Use Cases",
    "useCases.title": "Where COONEO robots work",
    "useCases.intro": "One modular platform, many jobs — from open fields and greenhouses to hillside orchards and classrooms.",
    "useCases.harvest.title": "Smart Harvesting",
    "useCases.harvest.desc":
      "AI vision judges ripeness while soft and rigid grippers pick flowers, fruit and vegetables with minimal damage.",
    "useCases.weed.title": "Tillage, Seeding & Weeding",
    "useCases.weed.desc":
      "Swap modules for soil preparation, precision seeding and herbicide-free mechanical or laser weeding.",
    "useCases.logistics.title": "Farm Logistics",
    "useCases.logistics.desc":
      "The autonomous transport robot follows workers or drives itself, carrying harvests across fields and hills.",
    "useCases.edu.title": "Education & Research",
    "useCases.edu.desc":
      "Open robotic arms with STM32, ESP32, Raspberry Pi and ROS support for makers, classrooms and university labs.",

    /* Videos */
    "videos.eyebrow": "Videos",
    "videos.title": "See COONEO robots in action",
    "videos.v1": "Field robots: tillage and all-terrain operation",
    "videos.v2": "Autonomous Transport Robot: operating modes",
    "videos.v3": "CCTV-17 report: COONEO at the 32nd Yangling Agricultural Hi-Tech Fair",

    /* Call-to-action band */
    "ctaBand.title": "Have a farm or project in mind?",
    "ctaBand.text": "Tell us about your crops, terrain and goals — we'll help you find the right robot setup.",
    "ctaBand.button": "Send an Enquiry",
    "ctaBand.customTitle": "Need a custom configuration?",
    "ctaBand.customText": "Our robots are modular. Tell us your crop and task, and we'll configure the platform and tools to match.",

    /* ================= PRODUCTS PAGE ================= */
    "products.eyebrow": "Products",
    "products.title": "Our Products",
    "products.intro":
      "From complete robot platforms to core components and AI software — covering every stage of farming.",
    "products.cat.robots": "Agricultural Robots",
    "products.cat.arms": "Robotic Arms",
    "products.cat.effectors": "End Effectors & Modules",
    "products.cat.app": "AgriAI App",

    "robots.title": "Multi-functional smart agricultural robots",
    "robots.intro":
      "Modular, compact platforms that carry soil-preparation, seeding, weeding, pruning and picking tools — one robot covers tillage, planting, management and harvest.",

    "label.modules": "Compatible modules:",
    "label.apps": "Typical uses:",
    "spec.size": "Dimensions",
    "spec.weight": "Weight",
    "spec.payload": "Max. payload",
    "spec.slope": "Max. slope",
    "spec.speed": "Max. speed",
    "spec.drive": "Drive",
    "spec.power": "Power",
    "spec.nav": "Navigation",
    "spec.navValue": "GPS / RTK / vision",
    "spec.comms": "Communication",

    "roboox.kicker": "Tillage / Harvesting Multi-Function Robot",
    "roboox.desc":
      "A high-payload, four-wheel-drive autonomous farm robot. Its powerful independent drive and heavy-duty frame suit long, demanding jobs — on plains as well as hilly land with low mechanisation — and it can work day and night in remote-control or autonomous mode.",
    "roboox.modules": "Soil preparation system, serial/parallel arms, rigid/soft picking grippers",
    "roboox.apps": "Soil preparation, heavy material transport, smart harvesting",
    "roboox.drive": "4-wheel differential",
    "roboox.power": "48 V battery",

    "mini.kicker": "Precision Multi-Functional Agricultural Robot",
    "mini.desc":
      "A compact robot built around AI and automation for precision farming. As the core of our modular system, it connects to the full range of tools — one machine, many tasks — balancing precision and cost.",
    "mini.modules": "Soil preparation, seeding system, laser weeder, serial/parallel arms, rigid/soft picking grippers",
    "mini.apps": "Soil preparation, seeding, mechanical/laser weeding, flower, fruit and vegetable picking",
    "mini.drive": "Differential, hub motors",
    "mini.power": "36 V lithium battery",

    "stier.kicker": "Monitoring / Pruning / Picking Robot",
    "stier.desc":
      "The most compact robot in the range. It turns on the spot and is designed for low canopies and dense crop rows such as strawberry tunnels and vineyards. Ultra-quiet operation suits greenhouses and orchards.",
    "stier.modules": "Serial/parallel arms, rigid/soft picking grippers",
    "stier.apps": "Close-range monitoring, branch pruning, picking",
    "stier.power": "36 V lithium battery",

    "bison.kicker": "Tracked Robot",
    "bison.desc":
      "A modular, lightweight tracked robot. Low ground pressure and strong grip keep it stable on mud, sand and steep slopes, and it can plan routes and avoid obstacles on its own.",
    "bison.modules": "Serial/parallel arms, rigid/soft picking grippers, crop-protection spray boom",
    "bison.apps": "Inspection, crop protection, transport, picking",
    "bison.power": "24 V lithium battery",

    "transport.kicker": "Smart Transport",
    "transport.name": "Autonomous Transport Robot",
    "transport.desc":
      "A compact, agile transport robot that plans its own routes. It handles hills and rough field paths as easily as lifts and narrow corridors.",
    "transport.f1": "Plans its own routes — no tracks or rails needed",
    "transport.f2": "Turns on the spot and fits into lifts and narrow spaces",
    "transport.f3": "Auto-follow: recognises and follows a person, with obstacle avoidance",
    "transport.f4": "Climbs slopes of up to 45°",
    "transport.m1": "Remote control",
    "transport.m2": "Auto-follow",
    "transport.m3": "Autonomous driving",
    "transport.apps": "Harvest-season produce transport, park logistics, warehouse handling, community delivery",

    "arms.title": "Robotic arms for makers, classrooms and labs",
    "arms.intro": "Ready to use out of the box and open for secondary development.",
    "serial.name": "COONEO Serial Robotic Arm",
    "serial.desc":
      "Plug-and-play and open for secondary development — ideal for maker projects, teaching and light-duty applications.",
    "serial.s1": "Compatible with STM32, ESP32 and Raspberry Pi controllers",
    "serial.s2": "Supports ROS / ROS2",
    "serial.s3": "Choice of high-torque servo options",
    "serial.s4": "Highly extensible structure",
    "parallel.name": "COONEO Parallel Robotic Arm",
    "parallel.desc":
      "Ultra-light, low-energy and quiet — suited to small production lines, labs and DIY development.",
    "parallel.s1": "Small AI sorting solution available, with in-house stable algorithms",
    "parallel.s2": "Interchangeable end effectors: soft/rigid grippers, seeding, cutting",
    "parallel.s3": "M3 mounting holes; 30 mm spacing between parallel rods",
    "parallel.s4": "Customisation available",

    "effectors.title": "In-house components for every farming task",
    "effectors.intro":
      "Our self-developed tools fit COONEO robots and arms, covering tillage, seeding, monitoring, weeding, pruning and picking.",
    "effectors.imageAlt": "COONEO robotic arms and end effectors",
    "effectors.soft.title": "Soft Grippers (2- / 3-finger)",
    "effectors.soft.desc": "Soft, bionic materials wrap around produce for damage-free picking of flowers, fruit and vegetables.",
    "effectors.rigid.title": "3-Finger Rigid Gripper",
    "effectors.rigid.desc": "A stable, durable grip for heavier crops such as tomatoes.",
    "effectors.laser.title": "Laser Weeder",
    "effectors.laser.desc": "AI vision finds weeds and removes them with a laser — no herbicides needed.",
    "effectors.shears.title": "Electric & Automatic Shears",
    "effectors.shears.desc": "Precise cutting for pruning and harvesting.",
    "effectors.seeder.title": "Seeder & Soil Preparation",
    "effectors.seeder.desc": "Modules for precision seeding and soil preparation.",
    "effectors.cutting.title": "Cutting Arm",
    "effectors.cutting.desc": "Arm-mounted cutting tool for branch pruning.",

    "agriai.title": "AgriAI: smart crop recognition in your pocket",
    "agriai.desc":
      "AgriAI is an intelligent recognition app built for agriculture — a handy assistant for farmers and an AI data engine for agri-data companies. With image recognition and flexible data interfaces, it serves every link of the agricultural value chain.",
    "agriai.step1": "Data collection",
    "agriai.step2": "Data labelling",
    "agriai.step3": "Model training",
    "agriai.step4": "Model detection",
    "agriai.imageAlt": "AgriAI recognising crops in field images",

    /* ================= CONTACT PAGE ================= */
    "contact.eyebrow": "Contact Us",
    "contact.title": "Let's talk about your project",
    "contact.intro":
      "Whether you need a robot, a custom solution or a distribution partnership, tell us what you're looking for and our team will get back to you.",
    "contact.detailsTitle": "Contact details",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.website": "Website",
    "contact.address": "Address",
    "contact.addressValue": "Shenzhen, China [full address TBC]",
    "contact.direct": "Prefer to chat directly?",
    "contact.whatsapp": "Chat on WhatsApp",
    "contact.wechat": "Add us on WeChat",
    "contact.workTitle": "Ways to work with us",
    "contact.work1": "Robot purchase & custom development",
    "contact.work2": "Robot farm co-building",
    "contact.work3": "Smart farm operation & management",
    "contact.work4": "Industry automation solutions",
    "contact.work5": "Demonstration project co-creation",

    "form.title": "Send an Enquiry",
    "form.requiredNote": "Fields marked * are required.",
    "form.name": "Name",
    "form.namePh": "Your full name",
    "form.company": "Company / School",
    "form.companyPh": "Organisation name (optional)",
    "form.email": "Email",
    "form.emailPh": "you@example.com",
    "form.country": "Country",
    "form.countryPh": "e.g. Singapore",
    "form.interest": "Interested In",
    "form.choose": "Please select",
    "form.optRobots": "Agricultural Robots",
    "form.optArms": "Robotic Arms",
    "form.optEffectors": "End Effectors & Grippers",
    "form.optApp": "AgriAI App",
    "form.optCustom": "Custom Development",
    "form.optPartner": "Partnership / Distribution",
    "form.optOther": "Other",
    "form.message": "Message",
    "form.messagePh": "Tell us about your crops, quantities or project…",
    "form.submit": "Send Enquiry",
    "form.errRequired": "This field is required.",
    "form.errEmail": "Please enter a valid email address.",
    "form.errSelect": "Please choose an option.",
    "form.errMessage": "Please write at least 10 characters.",
    "form.success": "Thank you! Your enquiry has been received. We'll be in touch soon.",

    "modal.title": "Scan to add us on WeChat",
    "modal.qr": "WeChat QR code",
    "modal.id": "WeChat ID: [TBC]",
    "modal.close": "Close",

    /* ---------- Footer ---------- */
    "footer.tagline": "AI-powered agricultural robots for smart farming.",
    "footer.quickLinks": "Quick Links",
    "footer.shopee": "Our Shopee Store",
    "footer.contact": "Contact",
    "footer.follow": "Follow Us",
    "footer.company": "COONEO Innovation Technology (Shenzhen) Co., Ltd.",
    "footer.rights": "All rights reserved.",
  },

  zh: {
    /* ---------- 页面标题 ---------- */
    "meta.home.title": "酷牛 COONEO | 智慧农业机器人解决方案",
    "meta.home.description":
      "酷牛（COONEO）致力于将 AI、物联网与机器人技术应用于智慧农业，产品覆盖耕、种、管、收、运农业生产全流程。",
    "meta.products.title": "产品 | 酷牛 COONEO",
    "meta.products.description":
      "酷牛农业机器人（RoboOX、RoboOX mini、Stier、Bison、自主运输机器人）、机械臂、末端执行器及 AgriAI 应用。",
    "meta.contact.title": "联系我们 | 酷牛 COONEO",
    "meta.contact.description": "咨询农业机器人、机械臂、定制开发或渠道合作，欢迎联系酷牛。",

    /* ---------- 导航 ---------- */
    "nav.home": "首页",
    "nav.products": "产品",
    "nav.contact": "联系我们",
    "nav.language": "语言",
    "nav.menu": "打开菜单",

    /* ---------- 通用按钮 ---------- */
    "btn.enquire": "立即咨询",
    "btn.specSheet": "下载规格书",
    "btn.shopee": "前往 Shopee 购买",
    "btn.shopeeGrippers": "前往 Shopee 选购夹爪",

    /* ================= 首页 ================= */
    "home.hero.eyebrow": "酷牛创新技术（深圳）有限公司",
    "home.hero.title": "AI 驱动的智慧农业机器人",
    "home.hero.subtitle": "我们将 AI、物联网与机器人技术应用于农业，以机器人、核心零部件和智能软件覆盖农业生产全流程。",
    "home.hero.slogan": "让农业很酷 · 让更多人爱上农业 · 让大家吃得健康",
    "home.hero.ctaProducts": "浏览产品",
    "home.hero.ctaContact": "联系我们",
    "home.hero.imageAlt": "酷牛农业机器人产品家族",

    "cycle.till": "耕",
    "cycle.plant": "种",
    "cycle.manage": "管",
    "cycle.harvest": "收",
    "cycle.transport": "运",

    /* 关于我们 */
    "about.eyebrow": "关于我们",
    "about.title": "以 AI 与机器人技术，重塑现代农业生产方式",
    "about.p1":
      "COONEO 酷牛致力于将先进的 AI、IoT、机器人等技术应用于智慧农业、生态环保等领域，重塑现代农业生产方式。我们的产品线全面覆盖耕、种、管、收、运农业生产全流程，旨在推动农业智能化、精准化及可持续发展，真正为农业生产降本增效。",
    "about.p2":
      "我们不做单一功能的机器，而是打造完整的智慧农业生态：机器人平台、自研核心零部件与智能算法协同工作，并经过多轮田间实测不断迭代优化。",
    "about.p3": "公司总部位于深圳，并在云南、广西设有本地研发与运营团队，已与马来西亚、巴西等国家的企业建立业务合作。",
    "about.imageAlt": "RoboOX 农业机器人在田间作业",
    "about.layer1.title": "整机系统",
    "about.layer1.desc": "模块化田间机器人，具备自主导航、环境感知与快速换装能力，适应多种地形与作物。",
    "about.layer2.title": "核心零部件",
    "about.layer2.desc": "自研机械臂、刚/柔性机械爪、激光除草器、机械剪与播种器，胜任采摘、除草与修剪等作业。",
    "about.layer3.title": "智能算法",
    "about.layer3.desc": "GPS/RTK 与无 GPS 导航、动态避障，以及作物、杂草、病虫害的 AI 精准识别。",
    "about.v1.title": "经济价值",
    "about.v1.desc": "构建新型智慧农业生态，激活产业潜能。",
    "about.v2.title": "社会价值",
    "about.v2.desc": "培育新农人，让农业很酷。",
    "about.v3.title": "环境价值",
    "about.v3.desc": "践行绿色农业，守护生态平衡。",
    "about.h1": "创始人毕业于荷兰瓦赫宁根大学，获博士学位",
    "about.h2": "入选英伟达初创加速计划（NVIDIA Inception）",
    "about.h3": "获中央广播电视总台（CCTV）报道",
    "about.h4": "已在中国、澳大利亚、巴西等地开展示范项目",

    /* 应用场景 */
    "useCases.eyebrow": "应用场景",
    "useCases.title": "酷牛机器人的用武之地",
    "useCases.intro": "一个模块化平台，胜任多种作业——从大田、温室到丘陵果园，再到课堂与实验室。",
    "useCases.harvest.title": "智能采摘",
    "useCases.harvest.desc": "AI 视觉判断成熟度，刚/柔性机械爪低损采摘花、果、蔬。",
    "useCases.weed.title": "整地、播种与除草",
    "useCases.weed.desc": "更换功能模块即可完成整地、精准播种，以及无农药的机械或激光除草。",
    "useCases.logistics.title": "农业转运",
    "useCases.logistics.desc": "自主运输机器人可跟随人员或自动驾驶，在田间与山地间转运农产品。",
    "useCases.edu.title": "教学与科研",
    "useCases.edu.desc": "开放式机械臂，兼容 STM32、ESP32、树莓派及 ROS，适用于创客、课堂与高校实验室。",

    /* 视频 */
    "videos.eyebrow": "视频",
    "videos.title": "看看酷牛机器人如何工作",
    "videos.v1": "田间机器人：整地与全地形作业",
    "videos.v2": "自主运输机器人：多种工作模式",
    "videos.v3": "CCTV-17 报道：酷牛亮相第 32 届杨凌农高会",

    /* 行动号召 */
    "ctaBand.title": "有农场或项目想要合作？",
    "ctaBand.text": "告诉我们您的作物、地形与目标，我们帮您找到合适的机器人方案。",
    "ctaBand.button": "发送咨询",
    "ctaBand.customTitle": "需要定制配置？",
    "ctaBand.customText": "我们的机器人采用模块化设计。告诉我们您的作物与作业需求，我们为您匹配平台与功能模块。",

    /* ================= 产品页 ================= */
    "products.eyebrow": "产品",
    "products.title": "我们的产品",
    "products.intro": "从整机平台到核心零部件与 AI 软件，覆盖农业生产各个环节。",
    "products.cat.robots": "农业机器人",
    "products.cat.arms": "机械臂",
    "products.cat.effectors": "末端执行器与功能模块",
    "products.cat.app": "AgriAI 应用",

    "robots.title": "多功能智能农业机器人",
    "robots.intro":
      "采用模块化与小型化设计，可灵活搭载整地、播种、除草、修剪、采摘等功能模块，单一平台即可覆盖耕、种、管、收等核心环节。",

    "label.modules": "适配模块：",
    "label.apps": "典型应用：",
    "spec.size": "尺寸",
    "spec.weight": "自重",
    "spec.payload": "最大负载",
    "spec.slope": "最大爬坡坡度",
    "spec.speed": "最大直线速度",
    "spec.drive": "动力学",
    "spec.power": "动力",
    "spec.nav": "定位导航",
    "spec.navValue": "GPS / RTK / 视觉",
    "spec.comms": "通讯",

    "roboox.kicker": "耕地/采摘多功能机器人",
    "roboox.desc":
      "一款集大负载、四驱、无人驾驶于一体的智能农业机器人。大功率四轮独立驱动与超强承载结构，适用于高负荷、长时间连续作业，不仅适用于平原，也能胜任机械化水平较低的丘陵山地；支持遥控与自动导航双模式，可昼夜作业。",
    "roboox.modules": "整地系统、串/并联机械臂、刚/柔性采摘手等",
    "roboox.apps": "整地、重型物料运输、智能采摘等",
    "roboox.drive": "四轮差速",
    "roboox.power": "48V 电池",

    "mini.kicker": "精准多功能智能农业机器人",
    "mini.desc":
      "一款小型化的精准多功能农业机器人，集成先进自动化技术与 AI 算法。作为模块化系统的核心载体，支持全系功能配件快速连接与切换，实现“一机多用”，兼顾作业精度与经济性。",
    "mini.modules": "整地系统、播种系统、激光除草器、串/并联机械臂、刚/柔性采摘手等",
    "mini.apps": "整地、播种、机械/激光除草、花果蔬采摘等",
    "mini.drive": "差速，轮毂电机",
    "mini.power": "36V 锂电池",

    "stier.kicker": "监测/修剪/采摘多功能机器人",
    "stier.desc":
      "系列中机身最紧凑的机器人，可原地转向，专为低矮冠层与密集作物行间（如草莓棚、葡萄架下）设计；超静音运行，适合温室、果园等对噪音敏感的环境。",
    "stier.modules": "串/并联机械臂、刚/柔性采摘手等",
    "stier.apps": "近距离监测、枝条修剪、采摘等",
    "stier.power": "36V 锂电池",

    "bison.kicker": "履带式机器人",
    "bison.desc":
      "采用模块化、轻量化设计的全地形履带机器人。接地压力低、抓地力强，在泥泞、沙地、陡坡等复杂地形上依然稳定，并可自主规划路径、避开障碍。",
    "bison.modules": "串/并联机械臂、刚/柔性采摘手、植保喷杆等",
    "bison.apps": "巡检、植保、运输、采摘等",
    "bison.power": "24V 锂电池",

    "transport.kicker": "智能转运",
    "transport.name": "自主运输机器人",
    "transport.desc": "一款高度集成、灵巧高效的智能转运设备，可自主规划路线，从丘陵山地、田间小路到电梯与狭窄通道都能轻松应对。",
    "transport.f1": "无轨自主规划路线，摆脱轨道束缚",
    "transport.f2": "机身小巧，支持原地转向，轻松进出电梯与狭窄空间",
    "transport.f3": "自动跟随：精准识别人体目标，并具备避障功能",
    "transport.f4": "可应对 45° 以下坡度",
    "transport.m1": "遥控模式",
    "transport.m2": "自动跟随",
    "transport.m3": "自动驾驶",
    "transport.apps": "农忙果蔬转运、园区物流中转、仓储货物搬运、社区物资配送",

    "arms.title": "面向创客、课堂与实验室的机械臂",
    "arms.intro": "即装即用，支持二次开发。",
    "serial.name": "COONEO 串联机械臂",
    "serial.desc": "即装即用、支持二次开发，适用于创客开发、教学实训及轻量化应用。",
    "serial.s1": "兼容 STM32、ESP32、树莓派等主控",
    "serial.s2": "支持 ROS / ROS2 系统",
    "serial.s3": "可选多档大扭力舵机",
    "serial.s4": "结构拓展性强",
    "parallel.name": "COONEO 并联机械臂",
    "parallel.desc": "超轻机身、低能耗、低噪音，适配小型产线、实验室及 DIY 开发。",
    "parallel.s1": "可提供小型智能 AI 分拣方案，搭载自研稳定算法",
    "parallel.s2": "末端执行器自由替换：柔性/刚性抓取、播种、剪切一键切换",
    "parallel.s3": "连接孔为 M3，两平行杆间距 30mm",
    "parallel.s4": "支持定制",

    "effectors.title": "自研配套零部件，覆盖各类农事作业",
    "effectors.intro": "适配酷牛机器人与机械臂，覆盖自动耕作、精准播种、农业监测、智能除草、枝条修剪及花果蔬采摘等场景。",
    "effectors.imageAlt": "酷牛机械臂与末端执行器",
    "effectors.soft.title": "柔性机械爪（二指 / 三指）",
    "effectors.soft.desc": "仿生柔性材料贴合果实表面，实现花、果、蔬的无损采摘。",
    "effectors.rigid.title": "三指刚性机械爪",
    "effectors.rigid.desc": "抓握稳定、耐用，适合番茄等较重作物。",
    "effectors.laser.title": "激光除草器",
    "effectors.laser.desc": "AI 视觉识别杂草并以激光清除，无需使用除草剂。",
    "effectors.shears.title": "电动剪刀与自动剪刀",
    "effectors.shears.desc": "精准剪切，用于修剪与采收。",
    "effectors.seeder.title": "播种器与整地系统",
    "effectors.seeder.desc": "实现精准播种与整地作业。",
    "effectors.cutting.title": "剪切机械臂",
    "effectors.cutting.desc": "臂载剪切工具，用于枝条修剪。",

    "agriai.title": "AgriAI：掌上的作物智能识别",
    "agriai.desc":
      "AgriAI 是一款专为农业领域打造的智能识别 APP。既是农户的掌上管家，又是数据企业的 AI 数据引擎，通过图像识别与灵活的数据接口，服务于农业产业链的各个环节。",
    "agriai.step1": "数据采集",
    "agriai.step2": "数据标注",
    "agriai.step3": "模型训练",
    "agriai.step4": "模型检测",
    "agriai.imageAlt": "AgriAI 识别田间图像中的作物",

    /* ================= 联系页 ================= */
    "contact.eyebrow": "联系我们",
    "contact.title": "聊聊您的项目",
    "contact.intro": "无论是采购机器人、定制方案还是渠道合作，请告诉我们您的需求，我们的团队会尽快回复。",
    "contact.detailsTitle": "联系方式",
    "contact.email": "邮箱",
    "contact.phone": "电话",
    "contact.website": "官网",
    "contact.address": "地址",
    "contact.addressValue": "中国深圳 [详细地址待确认]",
    "contact.direct": "想直接沟通？",
    "contact.whatsapp": "WhatsApp 联系",
    "contact.wechat": "添加微信",
    "contact.workTitle": "合作方式",
    "contact.work1": "机器人采购 & 定制开发",
    "contact.work2": "机器人农场共建",
    "contact.work3": "智慧农场运营 / 托管",
    "contact.work4": "产业智能化解决方案",
    "contact.work5": "示范项目共创",

    "form.title": "发送咨询",
    "form.requiredNote": "带 * 的为必填项。",
    "form.name": "姓名",
    "form.namePh": "请输入您的姓名",
    "form.company": "公司 / 学校",
    "form.companyPh": "机构名称（选填）",
    "form.email": "电子邮箱",
    "form.emailPh": "you@example.com",
    "form.country": "国家 / 地区",
    "form.countryPh": "例如：新加坡",
    "form.interest": "感兴趣的方向",
    "form.choose": "请选择",
    "form.optRobots": "农业机器人",
    "form.optArms": "机械臂",
    "form.optEffectors": "末端执行器与机械爪",
    "form.optApp": "AgriAI 应用",
    "form.optCustom": "定制开发",
    "form.optPartner": "合作 / 代理分销",
    "form.optOther": "其他",
    "form.message": "留言内容",
    "form.messagePh": "请简要描述您的作物、采购数量或项目情况……",
    "form.submit": "提交咨询",
    "form.errRequired": "此项为必填。",
    "form.errEmail": "请输入有效的电子邮箱地址。",
    "form.errSelect": "请选择一项。",
    "form.errMessage": "请至少输入 10 个字符。",
    "form.success": "感谢您的咨询！我们已收到您的信息，会尽快与您联系。",

    "modal.title": "扫码添加微信",
    "modal.qr": "微信二维码",
    "modal.id": "微信号：[待确认]",
    "modal.close": "关闭",

    /* ---------- 页脚 ---------- */
    "footer.tagline": "AI 驱动的智慧农业机器人。",
    "footer.quickLinks": "快速链接",
    "footer.shopee": "Shopee 官方店铺",
    "footer.contact": "联系方式",
    "footer.follow": "关注我们",
    "footer.company": "酷牛创新技术（深圳）有限公司",
    "footer.rights": "版权所有。",
  },
};

/* ==========================================================
   2. LANGUAGE SWITCHER
   ========================================================== */
const STORAGE_KEY = "cooneo-lang";
const langSelect = document.getElementById("lang-select");
let currentLang = "en";

// Look up a translated string; fall back to English if a key is missing
function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || "";
}

function setLanguage(lang) {
  if (!translations[lang]) lang = "en";
  currentLang = lang;

  // <html lang="..."> — also switches the font via CSS
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  // Normal text
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = t(el.dataset.i18n);
    if (text) el.textContent = text;
  });

  // Input placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  // Image descriptions (alt text)
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    el.alt = t(el.dataset.i18nAlt);
  });

  // Accessible labels (e.g. hamburger and close buttons)
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAriaLabel));
  });

  // <meta name="description">
  document.querySelectorAll("[data-i18n-content]").forEach((el) => {
    el.setAttribute("content", t(el.dataset.i18nContent));
  });

  // Re-translate any form error / success messages already on screen
  document.querySelectorAll("[data-msg-key]").forEach((el) => {
    el.textContent = t(el.dataset.msgKey);
  });

  langSelect.value = lang;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    /* storage unavailable (e.g. private mode) — ignore */
  }
}

// Decide the starting language: saved choice → browser language → English
function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch (e) {
    /* ignore */
  }
  const browserLang = (navigator.language || "").toLowerCase();
  return browserLang.startsWith("zh") ? "zh" : "en";
}

langSelect.addEventListener("change", () => setLanguage(langSelect.value));
setLanguage(getInitialLanguage());

/* ==========================================================
   3. MOBILE MENU (hamburger)
   ========================================================== */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

/* ==========================================================
   4. HEADER SHADOW ON SCROLL
   ========================================================== */
const header = document.getElementById("site-header");
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 10);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

/* ==========================================================
   5. SCROLL FADE-IN ANIMATIONS
   Any element with class="fade-in" fades in when it scrolls into view.
   ========================================================== */
const fadeEls = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  fadeEls.forEach((el) => observer.observe(el));
} else {
  fadeEls.forEach((el) => el.classList.add("visible"));
}

/* ==========================================================
   6. ENQUIRY FORM (only runs on contact.html)
   ========================================================== */
const form = document.getElementById("enquiry-form");

if (form) {
  const successMsg = document.getElementById("form-success");
  const interestSelect = document.getElementById("f-interest");
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Pre-select "Interested In" from the link, e.g. contact.html?interest=agri-robots
  const interestParam = new URLSearchParams(window.location.search).get("interest");
  if (interestParam && interestSelect.querySelector(`option[value="${CSS.escape(interestParam)}"]`)) {
    interestSelect.value = interestParam;
  }

  // Show (or clear) the error under one field. Pass null to clear.
  const setFieldError = (input, msgKey) => {
    const field = input.closest(".field");
    const errorEl = field.querySelector(".error");
    if (msgKey) {
      field.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      errorEl.dataset.msgKey = msgKey; // remembered so it can be re-translated
      errorEl.textContent = t(msgKey);
    } else {
      field.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
      delete errorEl.dataset.msgKey;
      errorEl.textContent = "";
    }
  };

  // Returns the error key for a field, or null if it's valid
  const validateField = (input) => {
    const value = input.value.trim();
    if (input.required && !value) {
      return input.tagName === "SELECT" ? "form.errSelect" : "form.errRequired";
    }
    if (input.type === "email" && value && !EMAIL_PATTERN.test(value)) {
      return "form.errEmail";
    }
    if (input.name === "message" && value.length < 10) {
      return "form.errMessage";
    }
    return null;
  };

  const showSuccess = () => {
    successMsg.dataset.msgKey = "form.success";
    successMsg.textContent = t("form.success");
    successMsg.hidden = false;
    form.reset();
  };

  // Clear an error as soon as the user fixes the field
  form.querySelectorAll("input, select, textarea").forEach((input) => {
    const evt = input.tagName === "SELECT" ? "change" : "input";
    input.addEventListener(evt, () => {
      if (input.closest(".field").classList.contains("invalid")) {
        setFieldError(input, validateField(input));
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalid = null;
    form.querySelectorAll("input, select, textarea").forEach((input) => {
      const error = validateField(input);
      setFieldError(input, error);
      if (error && !firstInvalid) firstInvalid = input;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      successMsg.hidden = true;
      return;
    }

    /* ------------------------------------------------------
       CONNECT A FORM SERVICE HERE (no backend yet)
       Example with Formspree (https://formspree.io):
         1. Create a form on Formspree and copy your form ID.
         2. Replace the "showSuccess()" line below with:

         fetch("https://formspree.io/f/YOUR_FORM_ID", {
           method: "POST",
           headers: { Accept: "application/json" },
           body: new FormData(form),
         })
           .then((res) => {
             if (res.ok) showSuccess();
             else alert("Sorry, something went wrong. Please try again.");
           })
           .catch(() => alert("Network error. Please try again."));
       ------------------------------------------------------ */
    showSuccess();
  });
}

/* ==========================================================
   7. WECHAT POPUP (only runs on contact.html)
   ========================================================== */
const wechatModal = document.getElementById("wechat-modal");
const wechatOpenBtn = document.getElementById("wechat-open");

if (wechatModal && wechatOpenBtn) {
  const onModalKey = (event) => {
    if (event.key === "Escape") closeModal();
  };

  const openModal = () => {
    wechatModal.hidden = false;
    wechatModal.querySelector(".modal-close").focus();
    document.addEventListener("keydown", onModalKey);
  };

  const closeModal = () => {
    wechatModal.hidden = true;
    document.removeEventListener("keydown", onModalKey);
    wechatOpenBtn.focus();
  };

  wechatOpenBtn.addEventListener("click", openModal);
  wechatModal.querySelectorAll("[data-close-modal]").forEach((el) => el.addEventListener("click", closeModal));
}

/* ==========================================================
   8. FOOTER YEAR (updates automatically)
   ========================================================== */
document.getElementById("year").textContent = new Date().getFullYear();
