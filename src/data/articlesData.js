export const articlesData = [
  {
    id: "ai-pilot-engineering",
    title: "Architecting 17+ Full-Stack Projects in College: The AI-Pilot Workflow",
    date: "February 2026",
    readTime: "4 min read",
    tag: "Engineering & AI",
    icon: "fas fa-rocket",
    summary: "How blending strong computer science fundamentals with Large Language Model prompting workflows allowed me to design, build, test, and ship 17+ complete web & Java applications.",
    sections: [
      {
        heading: "1. Architecture Before Automation",
        body: "Before writing any code or prompting an AI model, I map out database schemas (PostgreSQL / MongoDB), API route signatures, and component hierarchies. Having clear boundaries ensures the generated code fits smoothly into the architecture without redundant refactoring."
      },
      {
        heading: "2. Context-Rich Prompt Engineering",
        body: "Supplying LLMs with exact TypeScript/JavaScript interface definitions, edge cases, and technical constraints leads to production-ready, bug-free components. I treat AI not as a magic black box, but as a pair-programmer that executes specific specifications at 10x speed."
      },
      {
        heading: "3. Automated Verification Loops",
        body: "Using Vite's lightning fast HMR, Playwright test runners, and browser console validations, every feature is continuously verified against functional and responsive criteria across all device viewports."
      }
    ]
  },
  {
    id: "aura-synthesizer-deepdive",
    title: "Building Custom Synthesizers with Vanilla Canvas & Web Audio API",
    date: "January 2026",
    readTime: "5 min read",
    tag: "Frontend & Web Audio",
    icon: "fas fa-wave-square",
    summary: "A technical deep dive into designing AURA — translating luxury fragrance olfactory notes (Bergamot, Amber, Rose) into real-time visual radar charts and Web Audio waveforms.",
    sections: [
      {
        heading: "1. Mapping Scent to Resonance",
        body: "The core challenge of AURA was translating abstract scent profiles into multi-sensory feedback. Each olfactory note is mapped to a harmonic frequency: fresh citrus notes generate higher sinusoidal frequencies, while deep base notes like Amber and Oud produce warm, low-frequency oscillations."
      },
      {
        heading: "2. Real-time Canvas Rendering",
        body: "Using HTML5 Canvas API, user choices dynamically composite the fragrance bottle's cap material, collar metal finish, liquid color tint, and custom laser-engraved typography on demand at 60 frames per second."
      },
      {
        heading: "3. Zero Heavy Framework Overhead",
        body: "Built entirely with modular Vanilla JavaScript to keep load times instantaneous and animations perfectly smooth on all mobile and desktop devices."
      }
    ]
  },
  {
    id: "jdbc-transaction-security",
    title: "From Console to Production: Mastering JDBC & SQL Transaction Security",
    date: "December 2025",
    readTime: "4 min read",
    tag: "Java & Database Systems",
    icon: "fas fa-database",
    summary: "Key lessons learned from designing robust Java enterprise database suites, preventing SQL injection with PreparedStatements, and implementing ACID transaction controls.",
    sections: [
      {
        heading: "1. Defensive Querying Against Injections",
        body: "Every single parameterized SQL query in my Java systems uses PreparedStatement objects. This strictly separates SQL logic from user inputs, preventing SQL Injection risks."
      },
      {
        heading: "2. ACID Compliant Transactions",
        body: "In multi-table operations (such as room booking and customer billing), manual autoCommit(false) controls paired with automatic rollback hooks on SQLException ensure database consistency and prevent orphaned records."
      },
      {
        heading: "3. Connection Pooling & Resource Cleanup",
        body: "Strictly closing ResultSets, Statements, and Connections in finally blocks or utilizing try-with-resources prevents resource exhaustion in high-concurrency environments."
      }
    ]
  }
];
