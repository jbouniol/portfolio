export type ProjectTag =
  | "AI"
  | "Data"
  | "Consulting"
  | "Automation"
  | "Finance"
  | "Logistics"
  | "Luxury"
  | "Strategy"
  | "Defense"
  | "Marketing"
  | "ML"
  | "Transport"
  | "Retail"
  | "FinTech"
  | "NLP"
  | "SaaS";

export type ProjectCategory = "bdd" | "school" | "personal";

export interface Project {
  slug: string;
  title: string;
  company: string;
  tagline: string;
  tags: ProjectTag[];
  context: string;
  problem: string;
  data: string;
  method: string;
  result: string;
  impact: string;
  canvaEmbedUrl?: string;
  githubUrl?: string;
  isPrivate?: boolean;
  isNDA?: boolean;
  year: string;
  duration: string;
  badge?: string;
  category: ProjectCategory;
  contributors?: string[];
}

export const projects: Project[] = [
  // ─── WINNERS ──────────────────────────────────────────────
  {
    slug: "generali-it-practices",
    title: "IT Practices Audit & Optimization",
    company: "Generali",
    tagline:
      "Analysis of a 15,000-line dataset to visualize IT practices, identify inconsistencies, and propose concrete optimizations.",
    tags: ["Data", "Consulting", "Automation"],
    context:
      "Generali, one of Europe's largest insurers, needed visibility into its IT practices across teams. A 15,000-line dataset captured operational processes but lacked structure and actionable insight.",
    problem:
      "How to turn a massive, unstructured IT operations dataset into clear visualizations that reveal inconsistencies and drive concrete improvement projects?",
    data: "15,000-line internal IT practices dataset covering team workflows, tool usage, process compliance, and incident logs.",
    method:
      "Cleaned and structured the raw dataset. Built dashboards to visualize patterns and anomalies. Identified key inconsistencies across teams. Proposed targeted optimizations with implementation roadmaps.",
    result:
      "Delivered a comprehensive audit with prioritized recommendations. Won the BDD challenge for this project.",
    impact:
      "Actionable improvement roadmap adopted by the team. Demonstrated how data-driven audits can surface hidden operational inefficiencies at enterprise scale.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGQ1iFjoI0/zpuuh-DHBZI5CruBac087w/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    badge: "Winner",
    category: "bdd",
    contributors: ["Enzo Natali", "Anna Spira", "Alexis Arnaud"],
  },
  {
    slug: "henkel-commercial-optimization",
    title: "Commercial Resource Optimization",
    company: "Henkel",
    tagline:
      "Optimizing commercial resources at Leroy Merlin and Bricomarche using sales, advertising, and merchandising data.",
    tags: ["Data", "Strategy", "Consulting", "Retail"],
    context:
      "Henkel distributes products through major DIY retailers including Leroy Merlin and Bricomarche. The challenge was to optimize commercial resource allocation while supporting local brand growth.",
    problem:
      "How, using sales, advertising investment, merchandising data, and sales force visit frequency, to optimize commercial resources at Leroy Merlin and Bricomarche while maintaining a dominant position and supporting local DIY brands?",
    data: "Sales data, advertising investment metrics, merchandising KPIs, sales force visit logs, and competitive positioning data across retail channels.",
    method:
      "Cross-referenced sales force activity with commercial outcomes. Built optimization models to reallocate resources toward highest-impact touchpoints. Benchmarked performance against competitors.",
    result:
      "Delivered a resource allocation framework that maximized ROI across both retail channels. Won the BDD challenge.",
    impact:
      "Applicable model for any FMCG company managing multi-retailer distribution with constrained commercial budgets.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGW0n4ghss/3j1y2s9NqWCFFMhvPxt8zw/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    badge: "Winner",
    category: "bdd",
    contributors: ["Guillaume Rabeau"],
  },
  {
    slug: "la-french-tech-aix-marseille",
    title: "Startup Ecosystem Growth Analysis",
    company: "La French Tech",
    tagline:
      "Web scraping to build a startup database, then descriptive analysis of the Aix-Marseille ecosystem to identify new income levers.",
    tags: ["Data", "Strategy", "Consulting", "Automation"],
    context:
      "La French Tech Aix-Marseille supports a growing ecosystem of startups. The organization needed a data-driven portrait of its members to unlock new revenue streams — but no structured database existed.",
    problem:
      "How to build a descriptive analysis of the Aix-Marseille startup ecosystem (robot portrait of members) and identify new income levers for both organic and external growth?",
    data: "Custom-built database via web scraping of startup profiles, funding rounds, sector classifications, growth metrics, revenue models, and ecosystem partnership data.",
    method:
      "Developed web scraping scripts to build a comprehensive startup database from scratch. Segmented members by growth potential and sector. Identified underexploited income levers through comparative analysis with other French Tech hubs.",
    result:
      "Delivered an actionable growth strategy with identified revenue streams. Won the BDD challenge.",
    impact:
      "Framework directly applicable to any regional tech ecosystem seeking to scale funding and partnership models. Demonstrated end-to-end data acquisition via scraping.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAF1vnl1DTI/aacddqChXnBDihu6_zGsvg/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    badge: "Winner",
    category: "bdd",
    contributors: ["Anna Spira", "Namie Pajot", "Enzo Natali"],
  },
  {
    slug: "linkpick-growth-strategy",
    title: "Strategic Growth Plan",
    company: "Linkpick",
    tagline:
      "Strategic decisions to promote growth while improving the experience for students, institutions, and partners — no data, pure strategy.",
    tags: ["Strategy", "Consulting"],
    context:
      "Linkpick connects students with institutions and partner companies. The platform needed a strategic plan to simultaneously grow its user base and improve stakeholder experience.",
    problem:
      "How to effectively make strategic decisions that promote Linkpick's growth while improving the experience of students, institutions, and partner companies?",
    data: "Market research, stakeholder interviews, competitive landscape analysis, and user experience assessments.",
    method:
      "Analyzed stakeholder needs across all user types. Identified friction points and growth opportunities. Built a strategic recommendation framework with concrete action plans.",
    result:
      "Delivered a multi-stakeholder growth strategy with actionable recommendations. Won the BDD challenge.",
    impact:
      "Scalable framework for any marketplace platform balancing growth across multiple user segments.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAF58ho6p1Y/-rNxgpDyBH6l1azx8k4UqQ/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    badge: "Winner",
    category: "bdd",
    contributors: ["Anna Spira", "Enzo Natali"],
  },

  // ─── FINALISTS / PODIUM ───────────────────────────────────
  {
    slug: "louis-vuitton-south-korea",
    title: "South Korean Market Strategy",
    company: "Louis Vuitton",
    tagline:
      "Strategy to boost Louis Vuitton's position in the South Korean market using sales and client data from the HKMT region.",
    tags: ["Luxury", "Strategy", "Data"],
    context:
      "Louis Vuitton identified South Korea as a high-growth luxury market. The challenge was to develop a market penetration strategy leveraging HKMT (Hong Kong, Macau, Taiwan) regional data.",
    problem:
      "How to propose a strategy to boost the South Korean market on Louis Vuitton products using sales and client data from the HKMT region?",
    data: "Sales data, client segmentation models, regional purchasing patterns, and competitive positioning across the HKMT luxury market.",
    method:
      "Analyzed cross-regional purchasing behaviors. Identified transferable insights from HKMT markets to South Korea. Built a market entry optimization strategy leveraging client data patterns.",
    result:
      "Delivered a comprehensive market strategy for the South Korean expansion. Reached finalist stage of the BDD challenge.",
    impact:
      "Strategic framework applicable to luxury brand expansion across Asian markets with culturally nuanced consumer behaviors.",
    isNDA: true,
    year: "2024",
    duration: "3 weeks",
    badge: "Finalist",
    category: "bdd",
    contributors: ["Enzo Natali", "Guillaume Rabeau", "Alexis Arnaud"],
  },
  {
    slug: "sncf-railway-prediction",
    title: "Railway Incident Prediction via ML",
    company: "SNCF",
    tagline:
      "Analyzing the correlation between weather conditions and railway incidents to predict daily defects using machine learning.",
    tags: ["AI", "ML", "Data", "Transport"],
    context:
      "SNCF, France's national railway company, faces weather-related infrastructure incidents that disrupt operations. Predicting these defects would enable preventive maintenance.",
    problem:
      "How to analyze the correlation between weather conditions and the frequency of railway incidents, then use machine learning to predict daily defects?",
    data: "Historical weather data (temperature, precipitation, wind), railway incident logs, track maintenance records, and geographic infrastructure mapping.",
    method:
      "Built correlation models between weather variables and incident frequency. Trained ML models to predict daily defect probabilities. Validated against historical incident data.",
    result:
      "Delivered a predictive model capable of forecasting daily railway defect likelihood based on weather forecasts. Reached finalist stage.",
    impact:
      "Framework applicable to any infrastructure operator seeking to reduce weather-related disruptions through predictive analytics.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAF90X1BVhE/mzURIjhieeJP_lgpR3hpLQ/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    badge: "Finalist",
    category: "bdd",
    contributors: ["Khadidja Addi", "Enzo Natali", "Florent Negaf"],
  },
  {
    slug: "hackathon-ia-ministere-armees",
    title: "Military Vehicle Recognition with AI",
    company: "Ministere des Armees",
    tagline:
      "3-day hackathon — training a ResNet18 model for vehicle recognition and exploring military applications of computer vision.",
    tags: ["AI", "ML", "Defense"],
    context:
      "The French Ministry of Armed Forces organized an AI hackathon to explore how deep learning could enhance military intelligence capabilities, specifically in vehicle identification.",
    problem:
      "How to create a model using ResNet18 pretrained weights to recognize vehicle types, and identify how this class of algorithms could serve Ministry of Armed Forces use cases?",
    data: "Vehicle image datasets, ResNet18 pretrained weights, military application scenario requirements.",
    method:
      "Imported ResNet18 architecture with pretrained weights. Fine-tuned the model on vehicle recognition tasks. Evaluated accuracy and explored transfer learning potential for military-specific applications.",
    result:
      "Built a functional vehicle recognition model. Presented viable military applications of computer vision. Reached finalist stage.",
    impact:
      "Demonstrated practical AI applicability for defense scenarios. Hands-on experience with transfer learning and real-time classification systems.",
    canvaEmbedUrl: "",
    githubUrl: "",
    year: "2024",
    duration: "3 days",
    badge: "Finalist",
    category: "bdd",
  },
  {
    slug: "bnp-paribas-case",
    title: "BNP Paribas Strategic Case",
    company: "BNP Paribas",
    tagline:
      "Business deep dive on BNP Paribas — strategic analysis with data-driven methodology. Finished 2nd.",
    tags: ["Finance", "Data", "Consulting", "Strategy"],
    context:
      "BNP Paribas, Europe's largest banking group, operates across 65+ countries. This BDD focused on analyzing strategic business challenges through data-driven approaches.",
    problem:
      "Strategic business problem addressed through data analysis and consulting methodology as part of the Albert School BDD program.",
    data: "Banking operational data, financial performance metrics, and strategic indicators provided by BNP Paribas for the case study.",
    method:
      "Applied structured consulting methodology with data analysis. Built frameworks to address the strategic challenge and delivered actionable recommendations.",
    result:
      "Delivered a comprehensive strategic analysis with data-backed recommendations to BNP Paribas stakeholders. Finished 2nd in the BDD challenge.",
    impact:
      "Direct experience working on real banking strategic challenges with one of the world's largest financial institutions.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAHBGuOas40/NnKwWMauiM6t5nDjB1idRg/view?embed",
    githubUrl: "https://github.com/jbouniol/bdd-bnpparibas",
    year: "2024",
    duration: "3 weeks",
    badge: "2nd Place",
    category: "bdd",
    contributors: ["Sacha Nardoux", "Anna Spira", "Keira Chang"],
  },
  {
    slug: "carrefour-beer-assortment",
    title: "Beer Assortment Optimization",
    company: "Carrefour",
    tagline:
      "Optimizing the beer assortment strategy across Carrefour stores in Grand Est, Normandie, and PACA regions.",
    tags: ["Data", "Retail", "Strategy", "Consulting"],
    context:
      "Carrefour, France's largest retailer, needed to optimize its beer category assortment across regional stores. Consumer preferences vary significantly between Grand Est, Normandie, and PACA.",
    problem:
      "How to optimize the beer assortment in Carrefour stores across three distinct French regions (Grand Est, Normandie, PACA) to maximize sales while adapting to local consumer preferences?",
    data: "Store-level beer sales data, regional consumer preference surveys, SKU performance metrics, shelf space allocation, competitor assortment benchmarks, and demographic data per region.",
    method:
      "Analyzed sales patterns by region and store format. Identified underperforming SKUs and regional preference gaps. Built an assortment optimization model factoring in local tastes, shelf constraints, and margin targets.",
    result:
      "Delivered a regionalized assortment strategy with tailored recommendations per geography. Reached finalist stage of the BDD challenge.",
    impact:
      "Applicable to any retail category management challenge requiring regional customization at scale.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGjPRbPZts/-bZZXQZRUx7XfNCGYH-WYA/view?embed",
    githubUrl: "",
    year: "2025",
    duration: "3 weeks",
    badge: "Finalist",
    category: "bdd",
  },

  // ─── OTHER BDDs ───────────────────────────────────────────
  {
    slug: "cma-cgm-sea-routes",
    title: "Optimal Sea Route Optimization",
    company: "CMA-CGM",
    tagline:
      "Defining optimal sea routes for CMA-CGM to minimize costs and carbon footprint using an optimization algorithm.",
    tags: ["Data", "Logistics", "Automation"],
    context:
      "CMA-CGM, the world's 3rd largest shipping company, operates 600+ vessels across global routes. Fuel costs and environmental regulations create pressure to optimize routing decisions.",
    problem:
      "How to define the optimal sea routes for CMA-CGM to minimize both operational costs and carbon footprint using an optimization algorithm?",
    data: "Route distance matrices, fuel consumption models, carbon emission factors, port throughput data, and weather/sea condition datasets.",
    method:
      "Built an optimization algorithm balancing cost minimization with carbon footprint reduction. Modeled multiple routing scenarios with varying constraint weights. Benchmarked against existing routes.",
    result:
      "Delivered an optimization model identifying routes with significant cost and emission reduction potential versus current operations.",
    impact:
      "Directly applicable to maritime logistics decarbonization strategies. Combines operational efficiency with ESG compliance objectives.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAF_-W7vuZQ/rAhI9eN1HvgrcJdpzEK2IA/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
  },
  {
    slug: "bcg-drone-business-plan",
    title: "Industrial Drone Business Plan",
    company: "Boston Consulting Group",
    tagline:
      "Building a 3-year business plan in Excel to estimate funds needed to launch an industrial drone company.",
    tags: ["Consulting", "Finance", "Strategy"],
    context:
      "BCG partnered with Albert School to challenge students on a classic strategy consulting exercise: building a comprehensive financial model for a new market entrant.",
    problem:
      "How to make a 3-year business plan proposal in Excel and estimate the funds to be raised to launch an industrial drone company by analyzing the market?",
    data: "Market sizing data, competitive landscape analysis, unit economics, manufacturing cost structures, and regulatory framework data for drone operations.",
    method:
      "Conducted market analysis and competitive benchmarking. Built a detailed 3-year financial model in Excel including revenue projections, cost structures, and funding requirements. Stress-tested assumptions.",
    result:
      "Delivered a comprehensive business plan with a clear funding roadmap, breakeven analysis, and growth scenarios for investor presentation.",
    impact:
      "End-to-end strategy consulting exercise from market analysis to financial modeling. Directly applicable to startup fundraising and venture strategy.",
    year: "2023",
    duration: "3 weeks",
    category: "bdd",
  },
  {
    slug: "jellyfish-marketing-genai",
    title: "Digital Marketing Strategy with GenAI",
    company: "Jellyfish",
    tagline:
      "Allocating a 1M euro marketing budget across 5 digital channels for an eco-responsible hiking brand, using GenAI for ad creation.",
    tags: ["Marketing", "AI", "Strategy"],
    context:
      "Jellyfish, a global digital marketing agency, challenged students to think like media planners. The brief: launch an eco-responsible hiking equipment product line with a constrained budget.",
    problem:
      "How to spend 1 million euros in marketing budget across 5 digital channels for a hiking equipment brand launching an eco-responsible product line? And how to use GenAI tools to create the ad?",
    data: "Channel performance benchmarks, audience segmentation data, CPM/CPC rates, conversion funnel metrics, and eco-consumer behavioral data.",
    method:
      "Built a multi-channel budget allocation model optimizing for reach and conversion. Segmented audiences by eco-sensitivity. Used GenAI tools to produce ad creatives aligned with brand positioning.",
    result:
      "Delivered a complete media plan with channel-by-channel allocation, projected KPIs, and GenAI-produced ad creatives ready for deployment.",
    impact:
      "Demonstrated practical GenAI integration in marketing workflows. Applicable framework for any brand managing multi-channel digital campaigns with sustainability positioning.",
    canvaEmbedUrl: "",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
    contributors: ["Sacha Nardoux", "Vincent Le Duigou", "Diana Serfati"],
  },
  {
    slug: "ministere-armees-qlik-dashboard",
    title: "Predictive HR Dashboard",
    company: "Ministere des Armees",
    tagline:
      "Building an analytical and predictive Qlik Sense dashboard for the Minister of Armed Forces to supervise workforce evolution.",
    tags: ["Data", "Defense", "Automation"],
    context:
      "The French Ministry of Armed Forces needed a decision-support tool for senior leadership to monitor workforce dynamics and anticipate strategic human resource challenges.",
    problem:
      "How to develop an analytical and predictive Qlik Sense dashboard to allow the Minister and high authorities to supervise workforce evolution and anticipate human and strategic issues?",
    data: "Workforce demographics, recruitment pipelines, attrition data, skills inventories, deployment schedules, and strategic planning scenarios.",
    method:
      "Designed and built an interactive Qlik Sense dashboard. Integrated descriptive analytics with predictive models for workforce evolution. Created executive-level views for strategic decision-making.",
    result:
      "Delivered a fully functional Qlik Sense dashboard with both analytical and predictive capabilities for senior defense leadership.",
    impact:
      "Decision-support tool applicable to any large organization managing complex workforce planning at scale. Direct experience with sovereign data environments.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGDTo8mZHU/Cq0_d9VW4HV3vfM0aXLHtQ/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
    contributors: ["Maxime Buisson", "Eleonore de Bokay", "Alexandre DR"],
  },
  {
    slug: "edmond-de-rothschild-fund-analysis",
    title: "Euro High Yield Fund Flow Analysis",
    company: "Edmond de Rothschild",
    tagline:
      "Analyzing 4 years of fund inflows and outflows to identify patterns, optimize collection periods, and model customer behavior.",
    tags: ["Finance", "Data", "Strategy"],
    context:
      "Edmond de Rothschild manages the EDR Fund Euro High Yield, one of its key investment vehicles. Understanding flow dynamics is critical for liquidity management and growth strategy.",
    problem:
      "How, using internal and external data, to analyse the inflows and outflows of the EDR Fund Euro High Yield over the last 4 years, identify reasons for these flows, optimize collection periods and geographies, and model customer behaviour according to internal and external indicators?",
    data: "4 years of fund flow data (inflows/outflows), geographic collection data, customer behavioral metrics, market condition indicators, and competitor fund performance.",
    method:
      "Analyzed temporal flow patterns to identify seasonality and triggers. Mapped geographic collection efficiency. Built customer behavior models correlating internal activity with external market indicators.",
    result:
      "Delivered a comprehensive flow analysis with actionable recommendations for collection optimization and customer retention strategies.",
    impact:
      "Framework applicable to any asset manager seeking to optimize fund distribution and anticipate investor behavior based on market conditions.",
    isNDA: true,
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
  },
  {
    slug: "asmodee-bga-game-recommendation",
    title: "Game Recommendation Engine from Player Behavior",
    company: "Asmodee",
    tagline:
      "Analyzing 20GB+ of player behavior data on Board Game Arena to map natural game connections and build personalized game journey recommendations.",
    tags: ["Data", "AI", "Strategy"],
    context:
      "Board Game Arena (BGA), owned by Asmodee, is the world's largest online board gaming platform with 11M+ users and 1,000+ games. Player habits generate massive amounts of behavioral data — repeated plays of the same game, frequent transitions between games — creating implicit links between titles.",
    problem:
      "User gaming habits on BGA generate natural connections between games, whether through multiple plays of a single title or frequent transitions from one game to another. How to analyze and visualize these connections in order to recommend personalized game journeys based on player profiles?",
    data: "20GB+ of raw player behavior data from Board Game Arena — including game session logs, user play histories, game-to-game transition patterns, and player profile metadata. Required SQL-based processing due to the massive data volume.",
    method:
      "Used SQL extensively to query, filter, and aggregate the 20GB+ dataset into workable structures. Mapped game-to-game transition networks from player sessions. Identified natural game clusters and player archetypes. Built visualization of game connections and designed a recommendation logic based on player behavior profiles.",
    result:
      "Delivered a game connection analysis with visual mapping of player journeys and a recommendation framework for personalized game paths based on user profiles.",
    impact:
      "Directly applicable to BGA's product strategy — improving game discovery, increasing session time, and reducing churn through smarter recommendations. Demonstrated ability to handle large-scale real-world datasets.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGg5vod7cI/2-KvH74aUv3g7M7Hp3OWeQ/view?embed",
    githubUrl: "",
    year: "2025",
    duration: "3 weeks",
    badge: "Finalist",
    category: "bdd",
    contributors: ["Keira Chang"],
  },

  // ─── SCHOOL PROJECTS ──────────────────────────────────
  {
    slug: "finovera",
    title: "Finovera — AI Stock Portfolio Advisor",
    company: "ML Project",
    tagline:
      "An AI-powered app that delivers personalized stock portfolio recommendations based on investor profiles, combining financial data with news sentiment analysis.",
    tags: ["AI", "ML", "Finance", "Data"],
    context:
      "Individual investors struggle to make informed stock picks without professional tools. Finovera was built to bridge this gap using AI-driven analysis of market data and news sentiment.",
    problem:
      "How to provide personalized, daily stock recommendations by combining financial metrics with real-time news sentiment, tailored to each investor's risk profile?",
    data: "Historical stock/ETF data (open/close prices, volume, daily variations) via Yahoo Finance API. Press article sentiment scores from NewsAPI using VADER sentiment analysis.",
    method:
      "Built a full data pipeline fusing market data with sentiment scores. Trained a Random Forest classifier (tested against LogisticRegression, XGBoost, LSTM) to predict daily asset performance. The system selects the 5 highest-probability assets daily for personalized buy recommendations.",
    result:
      "Functional app with a Streamlit interface and Swift mobile frontend. 44 commits, full ML pipeline from data ingestion to daily recommendations.",
    impact:
      "End-to-end AI project demonstrating data engineering, ML modeling, NLP sentiment analysis, and product design — from API integration to user-facing app.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGm9bup1tc/rjDPjCaAjYsNOY5MUVb70A/view?embed",
    githubUrl: "https://github.com/jbouniol/finovera",
    year: "2025",
    duration: "School Project",
    category: "school",
    contributors: ["Sacha Nardoux", "Guillaume Rabeau"],
  },
];

export const allTags: ProjectTag[] = [
  "AI",
  "ML",
  "Data",
  "Consulting",
  "Automation",
  "Finance",
  "Logistics",
  "Luxury",
  "Strategy",
  "Defense",
  "Marketing",
  "Transport",
  "Retail",
  "FinTech",
  "NLP",
  "SaaS",
];
