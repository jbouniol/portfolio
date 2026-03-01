export const GENERIC_CV_LATEX_TEMPLATE = String.raw`%-------------------------
% CV — dates-left layout (single page)
%-------------------------
\documentclass[a4paper,10pt]{article}

\usepackage{iftex}
\ifPDFTeX
  \usepackage[utf8]{inputenc}
  \usepackage[T1]{fontenc}
  \usepackage{lmodern}
\else
  \usepackage{fontspec}
  \setmainfont{Latin Modern Roman}
\fi

\newcommand{\uline}[1]{\underline{#1}}
\usepackage[hidelinks]{hyperref}
\usepackage[a4paper,left=0.48in,right=0.48in,top=0.28in,bottom=0.22in]{geometry}
\usepackage{enumitem}
\usepackage{microtype}
\usepackage{tabularx}
\usepackage{xcolor}

\pagenumbering{gobble}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\raggedright

\definecolor{rulecolor}{gray}{0.30}

% ---- date column width ----
\newlength{\datecol}
\setlength{\datecol}{1.08in}
\newlength{\maincol}
\setlength{\maincol}{\dimexpr\textwidth-\datecol-8pt\relax}

% ---- list style ----
\setlist[itemize]{leftmargin=0.14in, itemsep=0pt, topsep=0.5pt, parsep=0pt, partopsep=0pt}
\renewcommand\labelitemi{\textbullet}

% ---- section heading ----
\newcommand{\sectionheading}[1]{%
  \vspace{4pt}%
  {\large\textbf{\uppercase{#1}}}%
  \par\vspace{-3.5pt}%
  {\color{rulecolor}\rule{\textwidth}{0.4pt}}%
  \par\vspace{2pt}%
}

% ---- entry: date left, content right ----
\newcommand{\entry}[4]{%
  \noindent
  \begin{tabularx}{\textwidth}{@{}p{\datecol}@{\hspace{8pt}}X@{}}
    \raggedright\small #1 &
    \textbf{#2} \hfill \textit{#4} \\[-2pt]
    & \textit{#3}
  \end{tabularx}\par
  \vspace{-1pt}
}

% bullet block indented to main column
\newenvironment{bullets}{%
  \vspace{-0.5pt}%
  \begin{minipage}[t]{\textwidth}%
  \hspace{\dimexpr\datecol+8pt\relax}%
  \begin{minipage}[t]{\maincol}%
  \hyphenpenalty=10000
  \exhyphenpenalty=10000
  \tolerance=2000
  \emergencystretch=1.5em
  \begin{itemize}
}{%
  \end{itemize}%
  \end{minipage}%
  \end{minipage}\par
  \vspace{1.5pt}
}

\begin{document}

% ===== HEADER =====
\begin{center}
  {\LARGE \textbf{Jonathan Bouniol}}\\[2pt]
  \small
  +33 6 18 24 55 37 \;\textbar\;
  \href{mailto:jbouniol@albertschool.com}{jbouniol@albertschool.com} \;\textbar\;
  \href{https://www.linkedin.com/in/jonathanbouniol/}{linkedin.com/in/jonathanbouniol} \;\textbar\;
  \href{https://github.com/jbouniol}{github.com/jbouniol} \;\textbar\;
  Paris
\end{center}

\vspace{-5pt}
\begin{center}
  \small\textit{Data \& AI for Business student, admitted to the Joint Degree MSc in Data and AI for Business,
  seeking an apprenticeship in Data (4~days/week in company, 1~day/week at school).}
\end{center}
\vspace{-2pt}

% ===== EDUCATION =====
\sectionheading{Education}

\entry{2026 -- 2028}{Mines Paris -- PSL \& Albert School}{Joint Degree MSc in Data \& AI for Business (Admitted)}{Paris}
\begin{bullets}
  \item \uline{Courses:} Deep Learning, RAG \& Agentic Systems, LLMOps \& Product Delivery, Data Engineering \& MLOps, NLP, Advanced Cloud Computing, AI in Business \& Data-Driven Decision Making.
  \item \uline{Tools:} PyTorch, LLM Ops \& Evaluation, RAG Pipelines and Agentic Systems, MLOps \& Deployment Automation, Data Engineering Workflows (ETL, Warehousing), NLP, Cloud AI.
\end{bullets}

\entry{2023 -- 2026}{Mines Paris -- PSL \& Albert School}{Bachelor's Degree in Business and Data}{Paris}
\begin{bullets}
  \item \uline{Courses:} Economics, Finance (Corporate \& Market), Marketing, Strategy, Data, Mathematics.
  \item \uline{Tools:} Excel, SQL, Power BI, Python (Pandas, NumPy, NetworkX, scikit-learn, web scraping, data visualization), GenAI.
\end{bullets}

% ===== EXPERIENCE =====
\sectionheading{Work Experience}

\entry{2025 -- Present}{Commissariat au Numérique de Défense (CND)}{Data Analyst -- Data Engineer \textbar{} Reserve Sergeant}{France}
\begin{bullets}
  \item Performed confidential analytics for the French Armed Forces, focusing on data structuring and operational analysis.
  \item Built structured datasets to improve operational efficiency, enabling faster and more reliable access to key information.
\end{bullets}

\entry{Jul -- Dec 2025}{Generali}{Data and IT Transformation Intern}{Saint-Denis}
\begin{bullets}
  \item Built operational dashboards (Power BI, Excel) from raw data to track performance and delivery across teams.
  \item Automated 15+ workflows (Power Automate), saving the team roughly 10 person-days of manual effort each month.
  \item Developed internal tools and AI agents to improve information access and project execution across Tech \& Ops teams (Copilot Studio, Python).
\end{bullets}

\entry{May -- Jul 2024}{Sunver}{CEO Right-Hand (Growth and Operations)}{Boulogne-Billancourt}
\begin{bullets}
  \item Built a GenAI chatbot prototype (Mistral) integrated into the Sunver app, improving onboarding and overall user experience.
  \item Launched and monitored 2 Meta Ads campaigns (3,000+ reach, 14\% lead conversion rate).
\end{bullets}

\entry{May 2024}{CMA CGM}{Data Consulting Case --- Network \& Route Optimization}{Marseille}
\begin{bullets}
  \item Modeled a maritime network (372 ports, 3,020 routes) via graph optimization and multi-criteria analysis; achieved --4.6\% CO\textsubscript{2} per TEU for 54\% of shipping lines at only +0.09\% additional cost.
\end{bullets}

% ===== LEADERSHIP =====
\sectionheading{Leadership \& Involvement}

\entry{Jul 2024 -- Jul 2025}{Albert Junior Consulting}{Vice President and CTO}{Paris}
\begin{bullets}
  \item Doubled revenue vs.\ previous mandate; drove growth via SEO and social media, generating over 22,000 total impressions.
  \item Led end-to-end recruitment and selection, attracting 80 candidates and operationalizing the full hiring funnel.
  \item Built and deployed a CRM (100+ prospects) and automated core internal workflows using Notion, Zapier, and Make.
\end{bullets}

\entry{Oct 2025 -- Present}{Notion}{Campus Leader}{Paris}
\begin{bullets}
  \item Selected as a Notion international Campus Leader; promoted collaborative tools and digital productivity across campus.
  \item Promoted Notion at Albert School with hands-on workshops and published 3 templates on the Notion Marketplace.
\end{bullets}

% ===== SKILLS (no date column) =====
\sectionheading{Technical Skills}

\small
\textbf{Data \& Analytics:} Python (Pandas, NumPy), SQL, EDA, data cleaning, analytical modeling, dashboards.\\[1pt]
\textbf{Machine Learning \& AI:} scikit-learn, supervised and unsupervised learning, model evaluation, applied Generative AI.\\[1pt]
\textbf{Automation \& Ops:} Workflow orchestration, Zapier, ETL, process automation.
\normalsize

% ===== CERTIFICATIONS, LANGUAGES & INTERESTS =====
\sectionheading{Languages \& Interests}

\small
French (Native) \;\textbar\; English (Professional -- C1) \hfill Cinema, strength training
\normalsize

\end{document}
`;

export const GENERIC_COVER_LETTER_TEMPLATE = String.raw`\documentclass[a4paper,11pt]{article}

\usepackage{iftex}
\ifPDFTeX
  \usepackage[utf8]{inputenc}
  \usepackage[T1]{fontenc}
  \usepackage{lmodern}
\else
  \usepackage{fontspec}
  \setmainfont{Latin Modern Roman}
\fi

\usepackage[hidelinks]{hyperref}
\usepackage[a4paper,left=1in,right=1in,top=0.9in,bottom=0.9in]{geometry}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0.7em}
\pagenumbering{gobble}

\begin{document}

\textbf{Jonathan Bouniol} \\
Paris, France \\
+33 6 18 24 55 37 \\
\href{mailto:jbouniol@albertschool.com}{jbouniol@albertschool.com} \\
\href{https://www.linkedin.com/in/jonathanbouniol/}{linkedin.com/in/jonathanbouniol}

\vspace{1em}
\today

\vspace{1em}
Hiring Team \\
Company Name \\
Company Address

\vspace{1em}
\textbf{Subject: Application for [Role Title]}

Dear Hiring Team,

I am writing to apply for the [Role Title] position at [Company Name]. I am currently pursuing a joint Data \& AI for Business track at Mines Paris -- PSL and Albert School, and I am looking for an apprenticeship where I can contribute to impactful data products in production settings.

Across my experiences (Generali, defense analytics, and consulting projects), I have delivered dashboards, automation workflows, and AI prototypes that improved decision speed, operational visibility, and team productivity. I enjoy translating ambiguous business questions into robust data pipelines and clear decision tools.

I am especially interested in [Company Name] because [specific company motivation linked to role and mission]. I would bring a strong blend of business understanding, hands-on implementation, and ownership mindset.

I would welcome the opportunity to discuss how I can contribute to your team.

Sincerely, \\
Jonathan Bouniol

\end{document}
`;
