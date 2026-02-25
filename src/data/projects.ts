export type ProjectTag =
  | "AI"
  | "ML"
  | "Data"
  | "NLP"
  | "Consulting"
  | "Strategy"
  | "Automation"
  | "Finance"
  | "Logistics"
  | "Luxury"
  | "Defense"
  | "Transport"
  | "Retail"
  | "SaaS";

export type ProjectCategory = "bdd" | "hackathon" | "consulting" | "school";

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
    title: "IT Project Portfolio Optimization",
    company: "Generali",
    tagline:
      "Analyzing a 15,000+ line dataset of internal IT projects to optimize portfolio management, improve data quality, and propose an AI assistant for project tracking.",
    tags: ["Data", "Consulting", "AI"],
    context:
      "Generali France provided a 15,000+ line dataset covering their internal IT project portfolio. The challenge was to optimize the management of this entire portfolio in just 3 weeks.",
    problem:
      "How to leverage a massive internal IT project dataset to optimize portfolio management, improve data quality, and better understand project complexity at Generali?",
    data: "15,000+ line internal dataset covering Generali's IT project portfolio — project metadata, timelines, statuses, teams, and operational metrics.",
    method:
      "Conducted in-depth analysis of the full dataset to extract actionable insights. Proposed data quality improvements: standardization processes, validation rules, and real-time alerts. Designed collaborative tools (Gantt charts, Kanban boards) to improve mission tracking. Developed a mathematical formula to evaluate project complexity. Proposed GENERALI-A, an AI assistant to optimize project tracking and capture previously uncollected data.",
    result:
      "Won the BDD challenge. Delivered a comprehensive optimization plan for Generali's IT project portfolio with concrete tools and an AI-powered tracking assistant.",
    impact:
      "Directly applicable recommendations for project management at scale. The AI assistant concept (GENERALI-A) demonstrated how GenAI can improve data capture and project oversight in enterprise environments.",
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
    title: "Sales Optimization & Resource Reallocation",
    company: "Henkel",
    tagline:
      "Optimizing and predicting Henkel sales to efficiently reallocate commercial resources across Leroy Merlin and Bricomarche.",
    tags: ["Data", "Strategy", "Consulting", "Retail"],
    context:
      "Henkel needed to optimize its commercial strategy across major DIY retailers. The challenge was to predict sales performance and propose a resource reallocation strategy to maximize impact.",
    problem:
      "How to optimize and predict Henkel sales in order to efficiently reallocate commercial resources while strengthening existing partnerships (Leroy Merlin) and exploring new growth relays (Bricomarche)?",
    data: "Sales data, advertising investment metrics, merchandising KPIs, sales force visit logs, and competitive positioning data across retail channels.",
    method:
      "Built sales prediction models and optimization frameworks. Proposed innovative solutions to reinforce existing partnerships with Leroy Merlin while identifying growth opportunities with Bricomarche as a new relay.",
    result:
      "Won the BDD challenge. Delivered a sales prediction and resource reallocation strategy with concrete recommendations for both retail partners.",
    impact:
      "Actionable commercial strategy applicable to any FMCG company managing multi-retailer distribution with constrained budgets.",
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
    title: "Startup Ecosystem Portrait & Growth Strategy",
    company: "La French Tech",
    tagline:
      "Building a startup database from scratch via web scraping, analyzing the Aix-Marseille ecosystem, and identifying new growth levers — presented to the DG of La French Tech.",
    tags: ["Data", "Strategy", "Consulting", "Automation"],
    context:
      "La French Tech Aix-Marseille Région Sud needed a data-driven portrait of its members and a strategy to unlock new revenue streams. No structured database existed — the data had to be built from scratch.",
    problem:
      "How to create a detailed portrait of La French Tech's startups, highlight typological differences between free and paid memberships, and identify new funding levers for organic and external growth?",
    data: "Custom-built database via web scraping of startup profiles, membership data, funding rounds, sector classifications, and ecosystem metrics. Challenging dataset requiring extensive data cleaning.",
    method:
      "Developed web scraping scripts to build the startup database from scratch. Analyzed typological differences between free and paid memberships. Identified organic and external growth strategies with new funding levers. Presented findings directly to the DG of La French Tech Aix-Marseille Région Sud.",
    result:
      "Won the BDD challenge. Delivered a comprehensive ecosystem portrait with actionable growth and funding strategies.",
    impact:
      "Framework directly applicable to any regional tech ecosystem seeking to scale membership models and unlock new revenue streams.",
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
      "Strategic decisions to promote growth while improving the experience for students, institutions, and partners — featuring ML, new features, and better data collection.",
    tags: ["Strategy", "Consulting", "ML", "SaaS"],
    context:
      "Linkpick connects students with institutions and partner companies. The platform needed a strategic plan to simultaneously grow its user base and improve the experience across all stakeholders.",
    problem:
      "How to make strategic decisions that promote Linkpick's growth while improving the experience of students, institutions, and partner companies?",
    data: "Market research, stakeholder interviews, competitive landscape analysis, and user experience assessments.",
    method:
      "Proposed new platform features, machine learning integration for smarter matching, improved data collection mechanisms, and a complete UX overhaul to enhance the user experience across all stakeholder types.",
    result:
      "Won the BDD challenge. Delivered a multi-stakeholder growth strategy with concrete feature proposals, ML recommendations, and UX improvements.",
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
    tags: ["Luxury", "Strategy", "Data", "AI"],
    context:
      "Louis Vuitton identified South Korea as a high-growth luxury market. The challenge was to develop a market penetration strategy leveraging HKMT (Hong Kong, Macau, Taiwan) regional data.",
    problem:
      "How to propose a strategy to boost the South Korean market on Louis Vuitton products using sales and client data from the HKMT region?",
    data: "Sales data, client segmentation models, regional purchasing patterns, and competitive positioning across the HKMT luxury market.",
    method:
      "Conducted in-depth data analysis on regional purchasing behaviors. Proposed a reimagined online experience mirroring the in-store luxury journey — including new offerings, redesigned digital experience, online exclusivity, and AI-powered cross-selling for a more personalized luxury experience.",
    result:
      "Delivered a comprehensive market strategy for the South Korean expansion with both data-driven insights and innovative digital experience proposals. Reached finalist stage.",
    impact:
      "Strategic framework applicable to luxury brand expansion across Asian markets, combining data analytics with digital customer experience innovation.",
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
      "Analyzed seasonality patterns and weather-incident correlations. Built a predictive maintenance algorithm using the provided data for better resource allocation and maintenance personnel scheduling. Conducted time-of-day analysis on incident frequency. Proposed a climate-control algorithm that adjusts train temperature based on passenger count to reduce average climate energy consumption.",
    result:
      "Delivered a predictive maintenance model plus resource optimization recommendations and an energy-saving climate algorithm. Reached finalist stage.",
    impact:
      "Framework applicable to any infrastructure operator seeking to reduce weather-related disruptions through predictive analytics and optimize operational resource allocation.",
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
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGDTo8mZHU/Cq0_d9VW4HV3vfM0aXLHtQ/view?embed",
    githubUrl: "https://github.com/Maxime-Buisson/groupe2-6miliarite",
    year: "2024",
    duration: "3 days",
    badge: "Finalist",
    category: "hackathon",
    contributors: ["Maxime Buisson", "Eleonore de Bokay", "Alexandre DR"],
  },
  {
    slug: "capgemini-traumatrix-hackathon",
    title: "Commercialization Plan for Traumatrix",
    company: "Capgemini",
    tagline:
      "Inter-Junior Enterprise competition — developing a go-to-market and industrialization plan for Traumatrix, a MedTech innovation. Honorable Mention.",
    tags: ["Strategy", "Consulting"],
    context:
      "Capgemini organized a hackathon competition between Junior Enterprises. The challenge was to build a compelling commercialization and industrialization proposal for Traumatrix, a MedTech product.",
    problem:
      "How to develop a go-to-market strategy and industrialization plan for Traumatrix, positioning it for commercial success in the MedTech market?",
    data: "Market research, competitive landscape analysis, MedTech regulatory frameworks, and industrialization cost models.",
    method:
      "Built a comprehensive commercialization proposal covering market positioning, go-to-market strategy, industrialization roadmap, and financial projections. Competed against other Junior Enterprises.",
    result:
      "Received Honorable Mention in the inter-JE competition. Delivered a full go-to-market and industrialization plan for Traumatrix.",
    impact:
      "Direct experience in MedTech commercialization strategy and inter-JE competitive consulting.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGdCr5c2yo/I0fvQvYcSJR8c5AG6eDhmw/view?embed",
    githubUrl: "",
    year: "2025",
    duration: "Hackathon",
    badge: "Honorable Mention",
    category: "hackathon",
    contributors: ["Anna Spira", "Alexis Arnaud", "Charles Constant", "Farees Aamir"],
  },
  {
    slug: "bnp-paribas-case",
    title: "Client Service Optimization via Data",
    company: "BNP Paribas",
    tagline:
      "Improving BNP Paribas Securities Services client experience by recalibrating SLAs, detecting complex requests, and building an AI-powered front-end — on 3M+ annual service requests.",
    tags: ["Finance", "Data", "AI", "Consulting"],
    context:
      "BNP Paribas Securities Services processes ~3 million Service Requests per year, exchanges 20-30 million emails, and operates across 5,000+ users on 1,300 desks via Hobart, their internal request management system. The system works, but at massive complexity — generating miscalibrated deadlines, heterogeneous workflows, invisible overloads, and unmeasured client friction.",
    problem:
      "As a Client Service Manager, how to improve daily client experience by better exploiting Hobart data to recalibrate SLAs, detect complex requests early, and reduce friction?",
    data: "Service Request logs from Hobart (3M+ annual), email interaction data, desk performance metrics, SLA configuration data, request categorization (1,522 categories), and resolution time distributions.",
    method:
      "1) Recalibrated SLAs using P85 of observed resolution times (46% of deadlines were too generous, 44% too tight). 2) Built a complexity detection system — 5% of SRs generate 15% of workload; flagged requests with >2 inbound or >5 interactions. 3) Created a 'Strongest Desk' score (Speed × Volume × Reliability) for intelligent rerouting. 4) Proposed clustering of 1,522 categories into 390 coherent clusters (4x complexity reduction). 5) Designed an AI front-end: email → auto-classification → analyst validation → instant acknowledgment + Q&A suggestions.",
    result:
      "Finished 2nd in the BDD challenge. Delivered 5 concrete solutions spanning SLA recalibration, complexity detection, intelligent routing, category simplification, and an AI-powered client interface.",
    impact:
      "Directly applicable framework for any large-scale service operations team dealing with high-volume request management and client satisfaction optimization.",
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
    title: "Beer Assortment Optimization with AI",
    company: "Carrefour",
    tagline:
      "Optimizing beer assortment across 3 French regions with an AI-powered Streamlit dashboard, a natural language SQL chatbot, and recommendation algorithms for store managers.",
    tags: ["Data", "Retail", "AI", "Consulting"],
    context:
      "Carrefour needed to optimize its beer category assortment across Grand Est, Normandie, and PACA regions. Consumer preferences vary significantly by geography, and store managers lacked accessible data tools.",
    problem:
      "How to optimize the beer assortment in Carrefour stores across three distinct French regions to maximize sales while giving store managers AI-powered tools to understand and act on their data?",
    data: "Store-level beer sales data, regional consumer preferences, SKU performance metrics, shelf space allocation, and demographic data per region.",
    method:
      "Built a Streamlit dashboard with regional statistics visualization and AI-powered assortment recommendations for store managers. Created a chatbot trained on store data for conversational data exploration. Implemented natural language to SQL queries (e.g., 'which is the best-selling beer?') using AI to generate and execute SQL queries — giving non-technical store managers instant access to insights.",
    result:
      "Reached finalist stage. Delivered a complete data product: Streamlit dashboard with AI recommendations, conversational chatbot, and natural-language SQL interface for store managers.",
    impact:
      "Demonstrated how AI can democratize data access in retail — making complex analytics available to non-technical users through natural language interfaces.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGjPRbPZts/-bZZXQZRUx7XfNCGYH-WYA/view?embed",
    githubUrl: "",
    year: "2025",
    duration: "3 weeks",
    badge: "Finalist",
    category: "bdd",
    contributors: ["Alexandra Arucan", "Alexandre Mouton Bistondi", "Iliane Amadou"],
  },

  // ─── OTHER BDDs ───────────────────────────────────────────
  {
    slug: "cma-cgm-sea-routes",
    title: "Optimal Sea Route Optimization",
    company: "CMA-CGM",
    tagline:
      "Developing two custom algorithms to define optimal maritime routes for CMA-CGM — minimizing costs, time, and carbon footprint on the path to carbon neutrality by 2050.",
    tags: ["Data", "Logistics", "Strategy"],
    context:
      "CMA-CGM, a global leader in maritime transport, is targeting carbon neutrality by 2050. The challenge was to optimize their maritime routes to reduce both costs and ecological footprint.",
    problem:
      "How to define the optimal sea routes for CMA-CGM to minimize costs, transit time, and carbon emissions using custom optimization algorithms?",
    data: "Route distance matrices, fuel consumption models, carbon emission factors, transhipment cost data, port throughput metrics, and CO2 emission datasets.",
    method:
      "Developed two custom algorithms in 3 weeks: (1) a variant of Dijkstra's algorithm finding the shortest path considering 4 key variables (time, cost, transhipment, CO2), and (2) a Travelling Salesman Problem-inspired algorithm optimizing CMA-CGM's full maritime lines end-to-end.",
    result:
      "Delivered two functional optimization algorithms that demonstrably reduce CMA-CGM's carbon footprint while accounting for time, transhipment costs, and emissions constraints.",
    impact:
      "Directly applicable to maritime logistics decarbonization. Demonstrated algorithmic problem-solving at scale for one of the world's largest shipping companies.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAF_-W7vuZQ/rAhI9eN1HvgrcJdpzEK2IA/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
    contributors: ["Baptiste Thuaudet", "Chloé Dallet", "Alexandre Mouton-Bistondi"],
  },
  {
    slug: "ministere-armees-qlik-dashboard",
    title: "Predictive HR Dashboard",
    company: "Ministere des Armees",
    tagline:
      "Building an analytical and predictive Qlik Sense dashboard for the Minister of Armed Forces to supervise workforce evolution.",
    tags: ["Data", "Defense", "Strategy"],
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
      "https://www.canva.com/design/DAGT7FNNA6o/lanapZvI07TyWiQ9VDETmg/view?embed",
    githubUrl: "",
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
    contributors: ["Chloé Dallet", "Mathias Bourdet"],
  },
  {
    slug: "edmond-de-rothschild-fund-analysis",
    title: "Euro High Yield Fund Flow Analysis & Prediction",
    company: "Edmond de Rothschild",
    tagline:
      "3 weeks analyzing the Euro High Yield fund collections — combining data analysis, deep learning, and sentiment analysis to predict and optimize inflows/outflows.",
    tags: ["Finance", "Data", "AI", "ML", "NLP"],
    context:
      "Edmond de Rothschild manages the EDR Fund Euro High Yield, one of its key investment vehicles. The challenge was to analyze where, when, and why collections could have been optimized over the past years.",
    problem:
      "How to analyze the inflows and outflows of the EDR Fund Euro High Yield, identify client typologies, and build predictive models to anticipate fund movements based on macro and internal indicators?",
    data: "4 years of fund flow data (inflows/outflows), client typology data, macroeconomic indicators (COVID, financial crises, geopolitical tensions, corporate bankruptcy rates), and market sentiment data.",
    method:
      "Analyzed client typologies and their behavioral responses to macroeconomic events. Built a deep learning predictive model enriched with sentiment analysis scores and scenario modeling capabilities. Incorporated macroeconomic factors (global events, European crises, interest rates) to forecast fund movements and enable proactive collection management.",
    result:
      "Delivered a comprehensive analysis with a predictive deep learning model, scenario simulation tools, and client-specific strategy recommendations for proactive fund management.",
    impact:
      "Equipped Edmond de Rothschild with tools for proactive and optimized collection management — anticipating future movements and personalizing strategies by client segment.",
    isNDA: true,
    year: "2024",
    duration: "3 weeks",
    category: "bdd",
    contributors: ["Enzo Natali", "Anna Spira", "Alexis Arnaud"],
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

  // ─── CONSULTING MISSIONS ─────────────────────────────
  {
    slug: "x-hec-startup-database",
    title: "Startup Investment Simulation Platform",
    company: "X-HEC Entrepreneurs",
    tagline:
      "Designed a database tracking all startups founded by X-HEC Entrepreneur alumni with their valuations, plus investment simulation tools.",
    tags: ["Data", "Finance", "Consulting"],
    context:
      "X-HEC Entrepreneurs is the entrepreneurship program of Ecole Polytechnique and HEC Paris. They needed a structured way to track the ecosystem of startups founded by their alumni and simulate investment scenarios.",
    problem:
      "How to design a comprehensive database tracing all startups founded by X-HEC Entrepreneur alumni, track their valuations, and create investment simulation tools to model portfolio performance?",
    data: "Alumni startup data, company valuations, funding rounds, sector classifications, and historical performance metrics.",
    method:
      "Designed and built a structured database capturing all X-HEC startups with their key metrics. Created investment simulation models allowing users to test portfolio allocation strategies across the alumni startup ecosystem.",
    result:
      "Delivered a fully functional database with investment simulation capabilities for the X-HEC Entrepreneurs program.",
    impact:
      "Tool enabling the X-HEC ecosystem to track alumni entrepreneurial impact and simulate investment strategies across their startup portfolio.",
    year: "2025",
    duration: "Consulting Mission",
    category: "consulting",
  },
  {
    slug: "villablu-startup-sourcing",
    title: "Startup Sourcing for Corporate Venture",
    company: "Villablu (Robertet)",
    tagline:
      "Built a startup pipeline for Villablu, Robertet's corporate venture accelerator — sourcing, qualifying, and pitching startups for program integration.",
    tags: ["Strategy", "Consulting"],
    context:
      "Villablu is the corporate venture accelerator of Robertet, a global leader in natural ingredients. They needed to identify and qualify promising startups for integration into their acceleration program.",
    problem:
      "How to build a structured pipeline of high-potential startups aligned with Robertet's strategic priorities, qualify them, and present them for integration into the Villablu accelerator?",
    data: "Startup ecosystem databases, sector mapping, Robertet's strategic priorities, and qualification criteria for the Villablu program.",
    method:
      "Built a comprehensive startup database aligned with Robertet's verticals. Qualified candidates through structured analysis. Conducted outreach and meetings with target startups to pitch the Villablu program.",
    result:
      "Delivered a curated pipeline of qualified startups and conducted direct outreach to integrate top candidates into the Villablu accelerator.",
    impact:
      "End-to-end consulting mission from market intelligence to direct business development — demonstrating startup sourcing and corporate venture advisory skills.",
    year: "2025",
    duration: "Consulting Mission",
    category: "consulting",
  },

  // ─── SCHOOL PROJECTS ──────────────────────────────────
  {
    slug: "finovera",
    title: "Finovera — AI Stock Portfolio Advisor",
    company: "ML Project",
    tagline:
      "An AI-powered app that delivers personalized stock portfolio recommendations based on investor profiles, combining financial data with news sentiment analysis.",
    tags: ["AI", "ML", "Finance", "NLP"],
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
  {
    slug: "pca-fifa-player-analysis",
    title: "PCA Analysis on Football Player Performance",
    company: "Maths Project",
    tagline:
      "Applying Principal Component Analysis (PCA) and SVD to the FIFA 23 dataset to identify key performance factors, segment player profiles, and generate recruitment insights via K-means clustering.",
    tags: ["Data", "ML"],
    context:
      "A mathematics project applying dimensionality reduction techniques to a real-world dataset — European football player statistics from FIFA 23 — to uncover hidden performance patterns.",
    problem:
      "How to reduce the high dimensionality of football player statistics to identify the primary factors that differentiate player profiles and support data-driven recruitment strategies?",
    data: "FIFA 23 Complete Player Dataset from Kaggle — performance metrics for European football players including physical, technical, and tactical attributes.",
    method:
      "Data preparation (missing values, outlier detection, Z-score standardization). Constructed correlation matrices and determined optimal components. Applied PCA with correlation circle visualization and player projections onto factorial planes. Implemented SVD on normalized matrices and compared with PCA results. Applied K-means clustering on principal components to segment player profiles.",
    result:
      "Identified primary performance factors explaining player variance. Segmented players into distinct profiles using K-means on PCA components. Generated actionable recruitment and training strategy recommendations.",
    impact:
      "Demonstrated strong mathematical foundations in statistics and linear algebra applied to real data — from PCA theory to actionable player segmentation insights.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGgrrrrT6A/KhIfGuKfNVH_RoL3qXZHcQ/view?embed",
    githubUrl: "https://github.com/jbouniol/maths-project-fifa",
    year: "2025",
    duration: "School Project",
    category: "school",
    contributors: ["Sacha Nardoux", "Amandine Barcelo", "Enzo Natali"],
  },
  {
    slug: "llm-distillation-research-paper",
    title: "Divide-or-Conquer? LLM Distillation Strategies",
    company: "ML Research Paper",
    tagline:
      "Presentation and analysis of Apple × Cornell's research paper on LLM distillation — separating decomposition (planning) from resolution (solving) to reduce inference costs while maintaining performance.",
    tags: ["AI", "ML", "NLP"],
    context:
      "LLMs are powerful for complex reasoning tasks but expensive and difficult to customize. This Apple × Cornell paper explores whether reasoning can be split into decomposition (planning) and resolution (solving), and which part benefits most from distillation into smaller models.",
    problem:
      "Can we effectively separate decomposition and resolution in LLM reasoning to reduce inference costs, facilitate local adaptation via fine-tuning/distillation, and still maintain good performance?",
    data: "Three benchmark datasets: GSM8K (7.5K math problems, Exact Match), DROP (77.4K QA on long texts, F1 score), and Bamboogle (125 complex nested questions, Accuracy). Models tested: GPT and Vicuna-13B.",
    method:
      "Evaluated three strategies: Single-Stage (direct answer), Two-Stage (static decomposition then resolution), and Self-Ask/Interactive (dynamic sub-question generation). Tested distillation of the decomposer (planning) into a smaller model while keeping a large solver, and vice versa. Compared static vs. dynamic decomposition on token efficiency.",
    result:
      "Key finding: distilling the decomposer yields the best cost-performance tradeoff — a small distilled decomposer paired with a large solver achieves near-GPT performance at a fraction of the cost. Static two-stage decomposition uses 4x fewer tokens than dynamic approaches with comparable accuracy.",
    impact:
      "Deep understanding of LLM reasoning architectures, knowledge distillation, and the cost-performance tradeoffs in deploying AI systems at scale.",
    canvaEmbedUrl:
      "https://www.canva.com/design/DAGjN8-GlFk/pAkFvQrBCrwcQD-PKgNvkg/view?embed",
    githubUrl: "",
    year: "2025",
    duration: "School Project",
    category: "school",
    contributors: ["Marc Zahwa"],
  },
];

export const allTags: ProjectTag[] = [
  "AI",
  "ML",
  "Data",
  "NLP",
  "Consulting",
  "Strategy",
  "Finance",
  "Retail",
  "Luxury",
  "Defense",
  "Transport",
  "Logistics",
  "Automation",
  "SaaS",
];
