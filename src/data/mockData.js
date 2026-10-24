// Initial mock data pre-configured for HackShift PS-4 demonstration
export const INITIAL_EVENTS = [
  {
    id: 'evt-1',
    name: 'HackShift 2026: Cmd+Shift+Create',
    organizer: 'IEEE Student Branch & HackShift Team',
    category: 'Hackathon',
    date: '2026-10-24',
    endDate: '2026-10-25',
    time: '09:00 AM - 06:00 PM',
    venue: 'Campus Innovation Hub & Auditorium',
    locationType: 'In-Person',
    fee: 'Free',
    eligibility: 'All Engineering, BCA & MCA Students',
    registrationDeadline: '2026-10-20T23:59',
    sourceUrl: 'https://hackshift2026.devfolio.co',
    sourceType: 'Poster OCR',
    status: 'Registered', // Registered, Saved, Deadline Approaching, Completed
    description: 'A 24-hour flagship hackathon designed to empower student innovators to solve real-world campus & industrial challenges across AI, Web3, and HealthTech.',
    tags: ['AI/ML', 'Full Stack', 'Web3', 'Campus Innovation'],
    prizePool: '₹1,50,000',
    teamSize: '2 - 4 Members',
    checklist: [
      { id: 'c1', text: 'Form team: Team VANGUARD (Ritesh, Shantanu, Pranjal)', completed: true },
      { id: 'c2', text: 'Select Problem Statement: PS 4 - MyCampus', completed: true },
      { id: 'c3', text: 'Submit project abstract & architecture diagram', completed: true },
      { id: 'c4', text: 'Build functional prototype with OCR & Timeline', completed: true },
      { id: 'c5', text: 'Prepare presentation pitch deck for finale judges', completed: false },
      { id: 'c6', text: 'Carry College ID cards & laptops to Auditorium', completed: false }
    ],
    reminders: [
      { time: '24 hours before deadline', active: true },
      { time: '1 hour before kickoff', active: true }
    ],
    hasClash: true,
    clashDetails: {
      conflictingWith: 'CS302: Data Structures & Algorithms Mid-Term Exam',
      conflictDate: '2026-10-25',
      conflictTime: '10:00 AM - 01:00 PM',
      severity: 'high',
      notes: 'HackShift Day 2 project presentation overlaps with official university mid-term exam schedule!'
    }
  },
  {
    id: 'evt-2',
    name: 'CS302: Data Structures & Algorithms Mid-Term Exam',
    organizer: 'Department of Computer Science & Engineering',
    category: 'Academic',
    date: '2026-10-25',
    endDate: '2026-10-25',
    time: '10:00 AM - 01:00 PM',
    venue: 'Academic Block 3, Examination Hall B',
    locationType: 'In-Person',
    fee: 'Free',
    eligibility: 'Semester 3 / 5 CS & IT Students',
    registrationDeadline: '2026-10-22T17:00',
    sourceUrl: 'https://portal.university.edu/exams/cs302',
    sourceType: 'Google Calendar Sync',
    status: 'Registered',
    description: 'Mandatory midterm evaluation covering Trees, Graphs, Dynamic Programming, and Amortized Analysis.',
    tags: ['Academics', 'Exam', 'Mandatory'],
    prizePool: 'Grade Weightage: 30%',
    teamSize: 'Individual',
    checklist: [
      { id: 'c21', text: 'Revise Graph Algorithms (Dijkstra, Bellman-Ford)', completed: true },
      { id: 'c22', text: 'Solve past 3 years previous midterm questions', completed: false },
      { id: 'c23', text: 'Print admit card and check seating arrangement', completed: false }
    ],
    reminders: [
      { time: '2 days before', active: true },
      { time: 'Morning of exam (7:30 AM)', active: true }
    ],
    hasClash: true,
    clashDetails: {
      conflictingWith: 'HackShift 2026: Cmd+Shift+Create',
      conflictDate: '2026-10-25',
      conflictTime: '09:00 AM - 06:00 PM',
      severity: 'high',
      notes: 'Scheduled during HackShift presentation slot.'
    }
  },
  {
    id: 'evt-3',
    name: 'ACM ICPC Regional Prelims 2026',
    organizer: 'ACM Student Chapter',
    category: 'Coding Contest',
    date: '2026-10-28',
    endDate: '2026-10-28',
    time: '04:00 PM - 08:00 PM',
    venue: 'Central Computer Center - Lab 4',
    locationType: 'Hybrid',
    fee: '₹450 / Team',
    eligibility: 'Undergraduate College Students',
    registrationDeadline: '2026-10-22T23:59',
    sourceUrl: 'https://icpc.global/regionals/prelims-2026',
    sourceType: 'Browser Extension',
    status: 'Deadline Approaching',
    description: 'The premier collegiate competitive programming contest. Teams of three solve complex algorithmic problems under time pressure.',
    tags: ['Competitive Programming', 'Algorithms', 'C++', 'ACM'],
    prizePool: '₹75,000 + Regional Finalist Slot',
    teamSize: '3 Members',
    checklist: [
      { id: 'c31', text: 'Finalize 3-member roster & reserve team handle', completed: true },
      { id: 'c32', text: 'Pay registration fee of ₹450 & upload college NOC', completed: false },
      { id: 'c33', text: 'Do 1 team mock contest on Codeforces', completed: false }
    ],
    reminders: [
      { time: '12 hours before deadline', active: true }
    ],
    hasClash: false
  },
  {
    id: 'evt-4',
    name: 'Smart India Hackathon (SIH 2026) College Round',
    organizer: 'Ministry of Education & Institutional Innovation Council',
    category: 'Hackathon',
    date: '2026-11-05',
    endDate: '2026-11-06',
    time: '10:00 AM - 05:00 PM',
    venue: 'Auditorium Seminar Hall 1',
    locationType: 'In-Person',
    fee: 'Free',
    eligibility: 'Regular bona-fide college students (6 members with at least 1 female teammate)',
    registrationDeadline: '2026-11-01T18:00',
    sourceUrl: 'https://www.sih.gov.in',
    sourceType: 'Manual Entry',
    status: 'Saved',
    description: 'Nationwide initiative to provide students a platform to solve pressing problems of ministries, departments, and industries.',
    tags: ['GovTech', 'AI', 'Smart Cities', 'National'],
    prizePool: '₹1,00,000 per problem statement',
    teamSize: '6 Members (Mandatory Gender Diversity)',
    checklist: [
      { id: 'c41', text: 'Form 6-member squad satisfying diversity rule', completed: false },
      { id: 'c42', text: 'Select problem statement from Ministry list', completed: false },
      { id: 'c43', text: 'Get endorsement letter signed by College Principal', completed: false }
    ],
    reminders: [
      { time: '3 days before deadline', active: true }
    ],
    hasClash: false
  },
  {
    id: 'evt-5',
    name: 'Google Cloud & GenAI DevFest 2026',
    organizer: 'GDG On Campus & Google Cloud Team',
    category: 'Workshop',
    date: '2026-11-12',
    endDate: '2026-11-12',
    time: '10:00 AM - 04:30 PM',
    venue: 'Convention Center, Main Campus',
    locationType: 'In-Person',
    fee: 'Free (RSVP Required)',
    eligibility: 'Open to all students & tech enthusiasts',
    registrationDeadline: '2026-11-08T23:59',
    sourceUrl: 'https://gdg.community.dev/events/devfest-2026',
    sourceType: 'Gmail Import',
    status: 'Saved',
    description: 'Hands-on workshops on Gemini 2.5/Flash, Cloud Run, Vertex AI, and building multimodal applications with Google Developer Experts.',
    tags: ['GenAI', 'Gemini', 'Google Cloud', 'Workshops'],
    prizePool: 'Google Cloud Badges & Swag Kits',
    teamSize: 'Individual',
    checklist: [
      { id: 'c51', text: 'Complete Google Cloud Skills Boost prerequisite lab', completed: false },
      { id: 'c52', text: 'Install Google Cloud SDK and VSCode extensions', completed: false }
    ],
    reminders: [
      { time: '24 hours before', active: true }
    ],
    hasClash: false
  }
];

// Active Hackathons for Project-to-Hackathon Matcher
export const HACKATHONS_DATABASE = [
  {
    id: 'hack-1',
    name: 'HackShift 2026: Cmd+Shift+Create',
    organizer: 'IEEE Student Branch',
    dates: 'Oct 24-25, 2026',
    deadline: '2026-10-20',
    prize: '₹1,50,000',
    mode: 'In-Person (Campus Hub)',
    tracks: ['Campus Life & EdTech', 'GenAI & Agents', 'Web3 & Security', 'Open Innovation'],
    preferredTech: ['React', 'Next.js', 'Python', 'FastAPI', 'Node.js', 'OCR', 'LLMs', 'Tailwind CSS'],
    problemStatements: [
      'PS 4: MyCampus - Unified student event capture, AI verification, schedule clash detection, and personal journey planning',
      'PS 1: Smart Campus Energy & IoT Management',
      'PS 2: Autonomous AI Research Co-Pilot for Student Labs'
    ],
    eligibility: 'All undergraduate and postgraduate college students'
  },
  {
    id: 'hack-2',
    name: 'AI HealthHacks 2026 Global',
    organizer: 'BioTech AI Consortium',
    dates: 'Nov 14-16, 2026',
    deadline: '2026-11-05',
    prize: '$15,000 USD',
    mode: 'Virtual / Online',
    tracks: ['Medical Imaging', 'Patient Assistance Agents', 'Preventive Diagnostics', 'Wearable Sensors'],
    preferredTech: ['Python', 'PyTorch', 'TensorFlow', 'FastAPI', 'OpenCV', 'React', 'Docker'],
    problemStatements: [
      'Early disease detection from multimodal radiographic and clinical telemetry',
      'Privacy-preserving federated learning for hospital record collaboration'
    ],
    eligibility: 'Open worldwide to student & early-career developers'
  },
  {
    id: 'hack-3',
    name: 'ETHIndia 2026 Web3 Summit',
    organizer: 'Devfolio & Ethereum Foundation',
    dates: 'Dec 04-06, 2026',
    deadline: '2026-11-20',
    prize: '$100,000 USD in Bounties',
    mode: 'In-Person (Bangalore)',
    tracks: ['Account Abstraction', 'DeFi Primitives', 'Decentralized Identity', 'Zero Knowledge Proofs'],
    preferredTech: ['Solidity', 'Ethereum', 'ethers.js', 'Hardhat', 'Rust', 'React', 'Next.js'],
    problemStatements: [
      'Build zero-knowledge credential verification for verifiable academic diplomas',
      'Gasless peer-to-peer micro-lending for campus communities'
    ],
    eligibility: 'Global developers, students, and Web3 enthusiasts'
  },
  {
    id: 'hack-4',
    name: 'Smart India Hackathon (SIH 2026)',
    organizer: 'Government of India (MoE / AICTE)',
    dates: 'Nov 28-30, 2026',
    deadline: '2026-11-01',
    prize: '₹1,00,000 per Problem Statement',
    mode: 'Hybrid (Campus Nodal Centers)',
    tracks: ['Smart Education', 'Agriculture & Rural Development', 'Clean & Green Tech', 'Disaster Management'],
    preferredTech: ['Python', 'Django', 'React', 'Node.js', 'PostgreSQL', 'Flutter', 'IoT'],
    problemStatements: [
      'Unified Student Lifecycle & Opportunity Navigation Portal for State Universities',
      'AI-driven crop pest detection and harvest yield forecasting via satellite & drone imagery'
    ],
    eligibility: 'Indian college students (teams of 6 with at least 1 female participant)'
  },
  {
    id: 'hack-5',
    name: 'CleanTech EcoHacks 2026',
    organizer: 'Sustainability Foundation & UNEP',
    dates: 'Dec 12-14, 2026',
    deadline: '2026-12-01',
    prize: '$25,000 USD',
    mode: 'Virtual',
    tracks: ['Carbon Footprint Tracking', 'Smart Renewable Grids', 'Circular Economy', 'ESG Reporting'],
    preferredTech: ['IoT', 'Arduino', 'MQTT', 'React', 'Python', 'Time-Series Analysis', 'Node.js'],
    problemStatements: [
      'Real-time automated energy audit and HVAC optimization for institutional buildings',
      'Gamified campus recycling and localized plastic collection ledger'
    ],
    eligibility: 'University students and eco-innovators'
  }
];

// Sample Projects for Quick Matcher Demonstration
export const SAMPLE_PROJECTS = [
  {
    title: 'MyCampus: Student Event Journey & Smart Matcher',
    repoUrl: 'https://github.com/vanguard-team/mycampus-hackshift',
    description: 'A student-first web application that captures events from flyers/URLs via OCR + LLM, prevents calendar clashes, creates preparation checklists, and matches student projects to relevant hackathons.',
    techStack: ['React', 'Tailwind CSS', 'Node.js', 'LLMs', 'OCR', 'FastAPI', 'PostgreSQL'],
    tracks: ['Campus Life & EdTech', 'GenAI & Agents', 'Open Innovation']
  },
  {
    title: 'HealthScan-AI: Multimodal Medical Vision Assistant',
    repoUrl: 'https://github.com/vanguard-team/healthscan-ai',
    description: 'Deep learning diagnostic pipeline using PyTorch and OpenCV to analyze chest X-rays and dermatological lesions with explanation heatmaps and doctor report summaries.',
    techStack: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'React', 'Docker'],
    tracks: ['Medical Imaging', 'Preventive Diagnostics', 'GenAI & Agents']
  },
  {
    title: 'CampusP2P: Decentralized Micro-Grant & Bounty Escrow',
    repoUrl: 'https://github.com/vanguard-team/campus-p2p-web3',
    description: 'Smart contract escrow for campus project funding, student club prize payouts, and verifiable achievement credential badges on Ethereum.',
    techStack: ['Solidity', 'Ethereum', 'ethers.js', 'Hardhat', 'React', 'Next.js'],
    tracks: ['Web3 & Security', 'DeFi Primitives', 'Decentralized Identity']
  },
  {
    title: 'EcoCampus: IoT Energy & Water Conservation Telemetry',
    repoUrl: 'https://github.com/vanguard-team/ecocampus-iot',
    description: 'Real-time telemetry system connecting campus smart meters to an interactive dashboard for peak electricity load shedding and water tank leakage alerts.',
    techStack: ['IoT', 'Arduino', 'MQTT', 'React', 'Python', 'Time-Series Analysis'],
    tracks: ['Clean & Green Tech', 'Carbon Footprint Tracking', 'Smart Campus Energy']
  }
];

// Sample Posters for OCR Quick Capture
export const SAMPLE_POSTERS = [
  {
    id: 'poster-1',
    title: 'HackShift 2026 Flagship Poster',
    thumbnailColor: 'from-emerald-700 to-teal-900',
    eventName: 'HackShift 2026: Cmd+Shift+Create',
    category: 'Hackathon',
    source: 'Official Campus Poster Flyer',
    date: '2026-10-24',
    time: '09:00 AM - 06:00 PM',
    venue: 'Campus Innovation Hub Auditorium',
    fees: 'Free',
    eligibility: 'All Engineering & Technology Students',
    extractedConfidence: 98.4,
    notes: 'Detected dates: Oct 24-25. Detected Problem Statement 4 - MyCampus.'
  },
  {
    id: 'poster-2',
    title: 'TechSprint 2026 Overlap Poster (Clash Test)',
    thumbnailColor: 'from-rose-600 to-amber-700',
    eventName: 'Inter-College TechSprint Coders Cup',
    category: 'Coding Contest',
    source: 'Notice Board Flyer',
    date: '2026-10-25', // Clashes with HackShift day 2 & DSA Exam!
    time: '11:00 AM - 03:00 PM',
    venue: 'CS Seminar Hall 2',
    fees: '₹200 / Solo',
    eligibility: 'Open to All Branches',
    extractedConfidence: 96.1,
    notes: '⚠️ Overlaps directly with CS302 Mid-Term Exam and HackShift Day 2.'
  },
  {
    id: 'poster-3',
    title: 'RoboWars & Drone Prix 2026',
    thumbnailColor: 'from-blue-700 to-indigo-900',
    eventName: 'Campus RoboWars & Drone Prix 2026',
    category: 'Robotics',
    source: 'Student Activity Center Poster',
    date: '2026-11-18',
    time: '10:00 AM - 05:00 PM',
    venue: 'Open Air Amphitheatre',
    fees: '₹800 / Team',
    eligibility: 'Engineering & Polytechnic Teams (max 5)',
    extractedConfidence: 97.2,
    notes: 'Weight restriction 15kg; RC transmitter frequency checks required.'
  }
];

// Sample Gmail & Calendar Imported Events
export const MOCK_GMAIL_IMPORTS = [
  {
    subject: 'Confirmation: Your DevFest 2026 RSVP is Confirmed!',
    from: 'events@gdgcampus.org',
    date: 'Yesterday, 4:15 PM',
    eventTitle: 'Google Cloud & GenAI DevFest 2026',
    eventDate: '2026-11-12',
    eventVenue: 'Convention Center, Main Campus'
  },
  {
    subject: 'Invitation: AWS Cloud Practitioner Student BootCamp',
    from: 'training@awseducate.com',
    date: 'Oct 14, 10:30 AM',
    eventTitle: 'AWS Cloud Practitioner Student BootCamp',
    eventDate: '2026-11-22',
    eventVenue: 'Virtual via Zoom'
  }
];
