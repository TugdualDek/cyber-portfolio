export const COMMANDER_INFO = {
  name: "TUGDUAL AUDREN DE KERDREL",
  rank: "SYSTEM ADMINISTRATOR AT BILENDI",
  status: "ONLINE",
  experience: "2 YEARS",
  clearanceLevel: "LEVEL 5",
  biography:
    "I'm a final-year engineering student at ISEP, specializing in cybersecurity and networks. Passionate about information systems security, I combine technical expertise and curiosity to meet the challenges of cybersecurity. Experience in web development and a strong interest in artificial intelligence.",
};

export const ARSENAL_CATEGORIES = {
  skills: [
    {
      name: "Languages",
      icon: "Languages",
      tools: ["Python", "HTML", "CSS", "JavaScript", "PHP", "Java"],
    },
    {
      name: "Technologies",
      icon: "Cpu",
      tools: ["Docker", "PostgreSql", "LXC", "MariaDB", "Crowdsec", "Traefik"],
    },
    {
      name: "Tools",
      icon: "SatelliteDish",
      tools: ["Raspberry Pi", "Arduino", "ZimaBoard", "SDR"],
    },
    {
      name: "OS",
      icon: "Computer",
      tools: ["Windows", "Linux", "MacOS"],
    },
  ],
  certifications: [
    {
      name: "Toeic",
      icon: "TicketCheck",
      tools: ["965 points", "June 2023"],
    },
    {
      name: "Certificat Voltaire",
      icon: "TicketCheck",
      tools: ["697 points", "December 2021"],
    },
    {
      name: "ARRIS SSTV Award",
      icon: "Antenna",
      tools: ["Lunar Exploration Commemoration", "December 2021"],
    },
    {
      name: "ARRIS SSTV Award",
      icon: "Antenna",
      tools: ["20 years of ARISS", "December 2020"],
    },
  ],
};

export const NAV_ITEMS = [
  { text: "Dashboard", href: "/dashboard" },
  { text: "Projects", href: "/projects" },
  { text: "Contact", href: "/contact" },
];

export const TIMELINE_EVENTS = [
  {
    title: "System, network and security administrator at Bilendi Technology",
    description: "Management of the company's information systems (Linux, LXC, etc.), IT support for employees",
    date: "September 2023 - present",
    type: "experience"
  },
  {
    title: "Technical manager at JuniorISEP",
    description: "Manage and maintain infrastructure and tools, technical monitoring of assignments, technical training for students, technology intelligence",
    date: "May 2023 - May 2024",
    type: "association"
  },
  {
    title: "Toeic - 965/990",
    description: "English language certification",
    date: "2023",
    type: "certification"
  },
  {
    title: "Developper at IsepInvest",
    description: "Web and DIscord bot development",
    date: "October 2021 - July 2024",
    type: "association"
  },
  {
    title: "Student at ISEP - School of engineering",
    description: "International Integrated Cycle, Last year of Engineering Cycle with a specialization in Cybersecurity and Networks",
    date: "2020 - 2025",
    type: "education"
  },
  {
    title: "Student at CVUT - Czech Technical University in Prague",
    description: "Erasmus exchange at Czech Technical University in Prague",
    date: "February 2022 - June 2022",
    type: "education"
  },
  {
    title: "ARISS SSTV Award",
    description: "Received SSTV images from the ISS commemorating Lunar exploration using Software Defined Radio",
    date: "December 2021",
    type: "certification"
  },
  {
    title: "Voltaire Certificate - 697/1000",
    description: "Certification in French language",
    date: "December 2021",
    type: "certification"
  },
  {
    title: "Internship at Adamantia",
    description: "Information system audit, IT awareness and process optimization",
    date: "June 2021 - July 2021",
    type: "experience"
  },
  {
    title: "Toeic - 895/990",
    description: "English language certification",
    date: "2021",
    type: "certification"
  },
  {
    title: "ARISS SSTV Award",
    description: "Received images on the occasion of the 20 years of amateur radio on the ISS using Software Defined Radio",
    date: "December 2020",
    type: "certification"
  },
  {
    title: "Lycée la Rochefoucauld - Paris",
    description: "Scientific Baccalaureate, specialty in Physics-Chemistry",
    date: "September 2017 - July 2020",
    type: "education"
  },
  {
    title: "St Catharine's College - Summer School",
    description: "Summer School in Cambridge with international courses on computer science",
    date: "July 2019",
    type: "education"
  },
];

export const PROJECTS = [
  {
    id: "project-6",
    title: "Web Application Attacks Tester",
    description: `Application that was created to test the security of Web Application with different attacks scenarios.
    Scenarios are made with configurable human readable YAML files.
    - Front-end made in NextJs and Backend in Python to laucnh the attacks
    - Database with PostgreSql`,
    date: "October 2024 - January 2025",
    technologies: ["NextJS", "Python", "PostgreSQL", "Docker", "YAML", "OWASP"],
    image: "/assets/scanner.webp",
    links: {
      github: "https://github.com/TugdualDek/projet-secu-logicielle",
    },
    status: "completed" // Assurez-vous d'utiliser une des trois valeurs autorisées
  },
  {
    id: "project-1",
    title: "PDF Chorale SGP",
    description: `Web application dedicated to managing and organising songs and programmes for the SGP choir.
    Songs can be added with sheet music.
    Programs can be created and pdfs generated automatically.
    - Front-end and back-end made in NextJs
    - Database made with Prisma and PostgreSql`,
    date: "September 2024",
    technologies: ["NextJS", "Prisma", "PostgreSQL", "Docker"],
    image: "/assets/choralesgp.webp",
    links: {
    },
    status: "completed" // Assurez-vous d'utiliser une des trois valeurs autorisées
  },
  {
    id: "project-2",
    title: "Trade Invest",
    description: `Creation of a fictitious trading platform for the InvestDay contest organized by the IsepInvest association.
    It is possible to buy and sell stocks and cryptocurrencies with the real rates of the US market.
    - Front-end and back-end made in NextJs
    - Database made with Prisma and PostgreSql`,
    date: "2023",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "Docker"],
    image: "/assets/trade.webp",
    links: {
      github: "https://github.com/TugdualDek/InvestDay",
    },
    status: "completed" // "completed" | "in-progress" | "planned"
  },
  {
    id: "project-3",
    title: "Carmen",
    description: `Project during the first year of the engineering cycle at ISEP with the aim of acquiring skills in different fields (computer science, telecom, signal, electronics).
    Creation of a project to help hospitals.
    - creation of a complete website linking the different parts of the project
    - Learning the basics of telecom (communication between different sensors and gateways)`,
    date: "2023",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "SQL"],
    image: "/assets/carmen.webp",
    links: {
      github: "https://github.com/naro92/Carmen",
    },
    status: "completed"
  },
  {
    id: "project-4",
    title: "Weather APP",
    description: `Creation of a device allowing to display on an application the temperature measured by a sensor connected to a server and an API thanks to an http request.
    - Creation of the front-end in Flutter
    - Creation of the back-end from Python and a DHT11 sensor`,
    date: "2022",
    technologies: ["Flutter", "Python", "Arduino", "RaspberryPi"],
    image: "/assets/weather.webp",
    links: {
      github: "https://github.com/Sh0lf/IT-Project-Weather-App"
    },
    status: "completed"
  },
  {
    id: "project-5",
    title: "Book where you are the hero",
    description: `Development of a game in python of the type "Book of which you are the hero"
    - Possibility for the user to create his own story, to save it and to share it
    - Possibility for the user to play a story.`,
    date: "2021",
    technologies: ["Python"],
    image: "/assets/hero.webp",
    links: {
      github: "https://github.com/arcreane/jeu-de-role-rasputin"
    },
    status: "completed"
  },
];

export const SOCIAL_LINKS = {
  GITHUB: {
    url: "https://github.com/TugdualDek",
    label: "GITHUB",
    status: "ONLINE"
  },
  LINKEDIN: {
    url: "https://linkedin.com/in/tugdual-de-kerdrel",
    label: "LINKEDIN",
    status: "ONLINE"
  },
  EMAIL: {
    url: "mailto:tugdualk@hotmail.com",
    label: "EMAIL",
    status: "ACTIVE"
  },
  EMAIL_2: {
    url: "mailto:contact@tugdual.com",
    label: "EMAIL",
    status: "ACTIVE"
  },
};

export const PROJECT_IMAGES = [
  '/assets/hero.webp',
  '/assets/carmen.webp',
  '/assets/choralesgp.webp',
  '/assets/carmen.webp',
  '/assets/trade.webp',
  '/assets/weather.webp',
  '/assets/scanner.webp',
];