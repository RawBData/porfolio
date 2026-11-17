/* Portfolio content. Everything a visitor can read lives here, separate from game code. */
window.PORTFOLIO = {
  name: 'Ben Rawner',
  tagline: 'Web developer and project manager, San Francisco Bay Area',
  lookingFor: 'Open to web developer and project manager roles.',
  links: { email: 'BenRaw11@gmail.com', linkedin: 'https://www.linkedin.com/in/benjaminrawner/', github: 'https://github.com/RawBData' },
  summary: 'Web developer with four years of professional front-end and CMS work and a full-stack background in React, JavaScript, Node and Rails. I build and ship client sites end to end, from responsive front ends and Stripe checkout flows to analytics tracking, hosting and AI agent workflows.',
  skillBricks: [
    'JavaScript', 'React', 'React Native', 'Redux', 'Node.js', 'Rails', 'PostgreSQL', 'MongoDB',
    'HTML5', 'CSS3', 'SQL', 'Swift', 'WordPress', 'Contentful', 'Stripe API', 'GA4 + GTM', 'n8n', 'Docker', 'Git', 'Claude Code',
  ],
  skillGroups: [
    ['Languages', 'JavaScript (ES6+), HTML5, CSS3, SQL, Ruby, Swift'],
    ['Front end', 'React, React Native, Redux, jQuery, responsive and mobile-first builds, accessibility (WAI, Section 508)'],
    ['Back end and data', 'Node.js, Express, Ruby on Rails, REST APIs, PostgreSQL, MongoDB, SQLite'],
    ['CMS and platforms', 'WordPress, Contentful, Magnolia CMS, Stripe API'],
    ['Analytics and automation', 'Google Tag Manager, Google Analytics (GA4), Microsoft Clarity, n8n'],
    ['AI', 'Agent workflows with Claude Code and the Claude, OpenAI and Gemini APIs'],
    ['DevOps and tools', 'Git, Docker, VPS hosting (CyberPanel, HestiaCP), RSpec, test-driven development'],
  ],
  projects: [
    {
      id: 'sfrider', name: 'SFRider', sub: 'Bike data on a map', color: 'blue', tags: ['React', 'JavaScript', 'HTML', 'CSS'],
      blurb: 'A single-page React app that lays San Francisco bicycle data over several maps at once.',
      points: [
        'Pulls from multiple OpenSF data API endpoints and shapes the JSON for each display.',
        'Custom markers, pop-ups and routes keep the layers easy to tell apart.',
        'A hand-built legend component replaces the stock one so every layer stays readable.',
      ],
      link: 'https://github.com/RawBData/SFRider',
    },
    {
      id: 'wordstar', name: 'Child Word Star', sub: 'iOS reading app', color: 'yellow', tags: ['Swift', 'iOS', 'CoreData', 'AVFoundation'],
      blurb: 'A multilingual, multimedia iOS app that helps children learn to read, and that parents can fully customize.',
      points: [
        'Designed, built and released from the ground up.',
        'Recorded and edited 400 sound bites in 4 languages in Pro Tools.',
        'Parents can record their own audio in any language with AVFoundation.',
        "CoreData keeps each family's recordings, images and text between sessions.",
      ],
    },
    {
      id: 'checkoff', name: 'Checkoff', sub: 'Full-stack to-do app', color: 'green', tags: ['Rails', 'React', 'Redux', 'PostgreSQL'],
      blurb: 'A full-stack single-page app inspired by Remember the Milk, with to-dos, lists, schedules and tags.',
      points: [
        'Encrypted sign-in with Rails, BCrypt, session tokens and React Router.',
        'A PostgreSQL schema with Rails associations for fast access to user data.',
        'Redux holds non-sensitive data for quick display and updates.',
        'Responsive, mobile-friendly React interface.',
      ],
      link: 'https://github.com/RawBData/Checkoff',
    },
    {
      id: 'tower', name: 'Tower Guard', sub: 'Tower defense game', color: 'stone', tags: ['JavaScript', 'HTML', 'CSS'],
      blurb: 'A single-player tower defense game in vanilla JavaScript.',
      points: [
        'A 2D physics engine written from scratch handles collision detection and scoring.',
        'Tuned to keep the frame rate steady as waves grow.',
      ],
    },
  ],
  jobs: [
    {
      id: 'freelance', name: 'Freelance Web Developer', sub: '2025 to now', when: '2025 to present', years: 2, color: 'red', role: 'Independent contractor, San Francisco (remote)',
      points: [
        'Design, build and deploy web apps and e-commerce sites in React, JavaScript, HTML and CSS, tuned mobile-first for fast loading.',
        'Build secure checkout and payment flows with the Stripe API.',
        'Run one shared Google Tag Manager and Analytics framework across several client domains.',
        'Automate client operations with AI agent workflows in n8n and Claude Code on the Claude, OpenAI and Gemini APIs.',
        'Configure VPS hosting and Docker deployments with CyberPanel and HestiaCP.',
      ],
    },
    {
      id: 'braindo', name: 'BrainDo', sub: '2022 to 2025', when: '2022 to 2025', years: 3, color: 'blue', role: 'Project manager with hands-on web development, Philadelphia (remote)',
      points: [
        'Built and maintained client sites on WordPress, Contentful and Magnolia CMS alongside senior developers, from months-long builds to daily updates.',
        'Coordinated timelines and stakeholders, and checked deliverables against functional and technical requirements.',
        'Ran QA and regression testing for new features and production releases on web and mobile.',
        'Specified the data-layer events and interaction tracking that client reporting relied on.',
        'Kept accessibility (WAI, Section 508) and front-end performance standards in every release.',
      ],
    },
    {
      id: 'behb', name: 'BEHB Law', sub: '2013 to 2019', when: '2013 to 2019', years: 6, color: 'yellow', role: "Accountant's assistant, San Francisco",
      points: [
        'Designed the procedures the firm used to track, manage and appeal billed-time deductions for partners and associates.',
        'Named employee of the year for the cut those procedures made in firm losses.',
      ],
    },
  ],
  education: [
    { school: 'App Academy', when: 'San Francisco, 2019', detail: 'Immersive full-stack program: Ruby, Rails, MongoDB, Express, React, Node, Redux, SQL.' },
    { school: 'UC Berkeley', when: '2004 to 2008', detail: 'BA in Sociology, focused on organizational structure.' },
  ],
  volunteer: ['Taught a technology class for 20+ seniors at the SF 30th Street Senior Center.', 'Uhuru Furniture, a charitable donations furniture store.', 'Poll worker on election days.'],
};
