import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from './data/projectsData';
import TiltCard from './components/TiltCard';
import InteractiveBackground from './components/InteractiveBackground';
import DevTerminal from './components/DevTerminal';

// ==========================================
// CONFIGURATIONS
// ==========================================
// To receive emails directly in your inbox from the contact form:
// 1. Go to https://web3forms.com and enter your email address.
// 2. You will receive a free Access Key in your email inbox immediately.
// 3. Paste that Access Key in the quotes below:
const WEB3FORMS_ACCESS_KEY = "YOUR_ACCESS_KEY_HERE";

// ==========================================
// MAIN REACT CONTROLLER
// =============================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [theme, setTheme] = useState('dark');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [popupNameInput, setPopupNameInput] = useState('');
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const [typewriterText, setTypewriterText] = useState('');
  const [activeBioTab, setActiveBioTab] = useState('short');
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const [greeting, setGreeting] = useState('Welcome 👋');
  const typewriterTimerRef = useRef(null);

  // Contact Form States
  const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error' | 'missing_key'
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE") {
      setFormStatus('missing_key');
      return;
    }

    setFormStatus('sending');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          subject: `Portfolio Contact from ${contactForm.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        setFormStatus('success');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);

    const hour = new Date().getHours();
    let timeGreeting = "Good Morning ☀️";
    if (hour >= 12 && hour < 17) timeGreeting = "Good Afternoon 🌤️";
    else if (hour >= 17) timeGreeting = "Good Evening 🌙";
    setGreeting(timeGreeting);

    const savedName = localStorage.getItem('portfolioVisitorName');
    let popupTimer = null;
    if (savedName) {
      setVisitorName(savedName);
    } else {
      popupTimer = setTimeout(() => {
        setShowWelcomePopup(true);
      }, 1500);
    }

    return () => {
      clearTimeout(timer);
      if (popupTimer) clearTimeout(popupTimer);
    };
  }, []);

  useEffect(() => {
    setTheme('dark');
    document.body.classList.remove('light-theme');
    localStorage.setItem('portfolioTheme', 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolioTheme', nextTheme);
    if (nextTheme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 50);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const phrases = [
      "intelligent software",
      "scalable web apps",
      "business automations",
      "interactive UI/UX designs",
      "AI-powered solutions"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let speed = 100;

    const tick = () => {
      const currentPhrase = phrases[phraseIdx];

      if (deleting) {
        setTypewriterText(currentPhrase.substring(0, charIdx - 1));
        charIdx--;
        speed = 50;
      } else {
        setTypewriterText(currentPhrase.substring(0, charIdx + 1));
        charIdx++;
        speed = 100;
      }

      if (!deleting && charIdx === currentPhrase.length) {
        speed = 2000;
        deleting = true;
      } else if (deleting && charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 500;
      }

      typewriterTimerRef.current = setTimeout(tick, speed);
    };

    typewriterTimerRef.current = setTimeout(tick, 1000);
    return () => clearTimeout(typewriterTimerRef.current);
  }, []);

  const handleNameSubmit = () => {
    const name = popupNameInput.trim();
    if (name) {
      localStorage.setItem('portfolioVisitorName', name);
      setVisitorName(name);
      setShowWelcomePopup(false);
    }
  };

  const filteredProjects = projectFilter === 'all'
    ? projectsData
    : projectsData.filter(p => p.category === projectFilter);

  return (
    <>
      {/* 1. Page Loader */}
      {loading && (
        <div className="page-loader" id="page-loader">
          <div className="loader-content">
            <div className="loader-logo">Raunak</div>
            <div className="loader-bar">
              <div className="loader-progress"></div>
            </div>
            <p>Building Digital Experience...</p>
          </div>
        </div>
      )}

      {/* 2. Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }}></div>

      {/* 3. Welcome Popup Modal */}
      {showWelcomePopup && (
        <div className="popup-overlay active">
          <div className="popup-content">
            <div className="popup-icon">🚀</div>
            <h2>Welcome to my space!</h2>
            <p>Before we begin, may I know your name?</p>
            <div className="popup-form">
              <input
                type="text"
                placeholder="Enter your name..."
                value={popupNameInput}
                onChange={(e) => setPopupNameInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                autoComplete="off"
                autoFocus
              />
              <button onClick={handleNameSubmit}>Explore Space <i className="fas fa-arrow-right"></i></button>
            </div>
            <button className="skip-popup-btn" onClick={() => setShowWelcomePopup(false)}>Skip for now</button>
          </div>
        </div>
      )}

      {/* 4. Header & Navbar Navigation */}
      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="logo">
          <a href="#hero">R<span>aunak</span></a>
        </div>

        <nav className={`navbar ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#about" className={`nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>About</a></li>
            <li><a href="#skills" className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
            <li><a href="#projects" className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
            <li><a href="#experience" className={`nav-link ${activeSection === 'experience' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Experience</a></li>
            <li><a href="#certifications" className={`nav-link ${activeSection === 'certifications' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Certifications</a></li>
            <li><a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
          </ul>
        </nav>

        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <i className={theme === 'light' ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <a href={import.meta.env.BASE_URL + "resume.html"} className="btn-resume-view" target="_blank" rel="noopener noreferrer">View Resume <i className="fas fa-eye"></i></a>
          <a href={import.meta.env.BASE_URL + "assets/images/Raunak_Resume.pdf"} className="btn-resume" download="Raunak_Sharma_Resume.pdf">Download <i className="fas fa-download"></i></a>
          <button className={`hamburger ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Open menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </header>

      {/* 5. Hero Section with Interactive Background & Glow Profile Image */}
      <section id="hero" className="hero-section">
        <InteractiveBackground />
        <div className="hero-mesh"></div>
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="welcome-badge">
                {visitorName ? `Welcome, ${visitorName} 👋` : "Welcome, Visitor 👋"}
              </div>
              <h2>{greeting}</h2>
              <h1 className="hero-title">I'm <span className="highlight-name">Raunak Sharma</span></h1>

              <div className="typing-wrapper">
                <span className="static-text">I build </span>
                <span className="dynamic-text">{typewriterText}</span>
              </div>

              <p className="hero-desc">
                Computer Science Student | Full-Stack Developer | AI Enthusiast
              </p>

              <div className="hero-actions">
                <a href="#projects" className="btn btn-primary">View My Work</a>
                <a href="#contact" className="btn btn-secondary">Let's Connect</a>
              </div>

              <div className="social-links">
                <a href="https://github.com/Raunaksharmaq64" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="https://www.linkedin.com/in/raunak-sharma-q64/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://www.instagram.com/raunak_sharma73?igsh=MW14bHFjbHY2bWtybA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="hero-image-area">
              <TiltCard className="hero-image-card">
                <div className="hero-image-glow"></div>
                <img src={import.meta.env.BASE_URL + "assets/images/raunak.png"} alt="Raunak Sharma" className="hero-profile-img" />
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Enhanced Premium About Section */}
      <section id="about" className="about-section">
        <div className="about-glow"></div>
        <div className="container">
          <div className="section-header">
            <span className="subtitle">My Background</span>
            <h2 className="title">About Raunak</h2>
            <div className="header-line"></div>
          </div>

          <div className="about-content">
            <div className="about-left">
              <p className="bio-highlight">
                Translating complex logical challenges into elegant, highly performant software products.
              </p>

              <div className="about-stats-grid">
                <div className="stat-card">
                  <div className="stat-num">17+</div>
                  <div className="stat-label">Projects Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">AI</div>
                  <div className="stat-label">Automation Focus</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">Full</div>
                  <div className="stat-label">Stack Capabilities</div>
                </div>
                <div className="stat-card">
                  <div className="stat-num">Bhopal</div>
                  <div className="stat-label">Madhya Pradesh, IN</div>
                </div>
              </div>

              <div className="bio-card">
                <div className="bio-tabs">
                  <button className={`bio-tab ${activeBioTab === 'short' ? 'active' : ''}`} onClick={() => setActiveBioTab('short')}>
                    <i className="fas fa-bolt"></i> Quick Story
                  </button>
                  <button className={`bio-tab ${activeBioTab === 'detailed' ? 'active' : ''}`} onClick={() => setActiveBioTab('detailed')}>
                    <i className="fas fa-book"></i> Detailed Journey
                  </button>
                </div>
                <div className="bio-tab-content">
                  {activeBioTab === 'short' ? (
                    <div className="tab-pane active">
                      <p>Hi, I'm Raunak Sharma — a B.Tech Computer Science student at Lakshmi Narain College of Technology & Science (LNCTS), Full-Stack Developer, and AI enthusiast passionate about building intelligent software and premium digital experiences. I specialize in creating scalable web applications, AI-powered automation systems, and modern user interfaces that combine clean design with high performance.</p>
                      <p>My approach goes beyond writing code. I enjoy understanding real-world problems, designing thoughtful solutions, and transforming ideas into impactful products. From AI agents and SaaS platforms to immersive websites and business automation tools, I focus on building technology that is both functional and meaningful.</p>
                    </div>
                  ) : (
                    <div className="tab-pane active">
                      <p>Hi, I'm <strong>Raunak Sharma</strong>, currently pursuing my B.Tech in Computer Science & Engineering from Lakshmi Narain College of Technology & Science (LNCTS), Bhopal. I am a full-stack developer with a growing specialization in Artificial Intelligence, intelligent automation, and modern web technologies. I enjoy building software that goes beyond functionality—products that solve real business problems, improve user experiences, and create measurable value. For me, programming is not just about writing code; it's about understanding challenges, designing thoughtful solutions, and transforming ideas into impactful digital products.</p>
                      <p>My journey into technology began with curiosity about how software works, but it quickly evolved into a passion for building complete products from the ground up. Over time, I have developed expertise across the full development lifecycle, working with technologies such as React, JavaScript, Node.js, Express.js, Python, FastAPI, Java, PostgreSQL, MongoDB, Git, and modern deployment platforms. I enjoy designing scalable backend systems just as much as crafting visually engaging frontend experiences with smooth animations, responsive layouts, and clean user interfaces.</p>
                      <p>One area that particularly excites me is Artificial Intelligence and Agentic AI. I am fascinated by systems that can analyze information, make decisions, automate repetitive workflows, and help businesses operate more efficiently. Rather than building simple applications, I aim to create intelligent products that combine AI, automation, and exceptional user experience.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="about-right">
              <TiltCard className="profile-dashboard-card" restTransform="perspective(1000px) rotateY(-10deg) rotateX(5deg)">
                <div className="card-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
                <div className="profile-header">
                  <div className="profile-avatar">
                    <img src={import.meta.env.BASE_URL + "assets/images/raunak.png"} alt="Raunak Sharma" />
                  </div>
                  <div>
                    <h4>Raunak Sharma</h4>
                    <p>Software Engineer</p>
                  </div>
                </div>

                <div className="skills-meter-section">
                  <h5>Active Stack Competency</h5>

                  <div className="meter-item">
                    <div className="meter-info">
                      <span>Full-Stack Web (JS/React)</span>
                      <span>95%</span>
                    </div>
                    <div className="meter-bar"><div className="meter-fill" style={{ width: '95%' }}></div></div>
                  </div>

                  <div className="meter-item">
                    <div className="meter-info">
                      <span>Java & Database Systems</span>
                      <span>90%</span>
                    </div>
                    <div className="meter-bar"><div className="meter-fill" style={{ width: '90%' }}></div></div>
                  </div>

                  <div className="meter-item">
                    <div className="meter-info">
                      <span>Python & FastAPI (Backend)</span>
                      <span>85%</span>
                    </div>
                    <div className="meter-bar"><div className="meter-fill" style={{ width: '85%' }}></div></div>
                  </div>

                  <div className="meter-item">
                    <div className="meter-info">
                      <span>AI Agentic Automations</span>
                      <span>80%</span>
                    </div>
                    <div className="meter-bar"><div className="meter-fill" style={{ width: '80%' }}></div></div>
                  </div>
                </div>

                <div className="dashboard-status">
                  <span className="status-indicator"></span>
                  <span>Open for Opportunities & Collaborations</span>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Skills Section */}
      <section id="skills" className="skills-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Core Competencies</span>
            <h2 className="title">Technical Toolbox</h2>
            <div className="header-line"></div>
          </div>

          <div className="skills-grid">
            <div className="skill-category">
              <div className="category-header">
                <i className="fas fa-code"></i>
                <h3>Languages</h3>
              </div>
              <ul className="skill-list">
                <li>JavaScript (ES6+)</li>
                <li>Python</li>
                <li>Java (Core)</li>
                <li>SQL</li>
                <li>HTML5 / CSS3</li>
              </ul>
            </div>

            <div className="skill-category">
              <div className="category-header">
                <i className="fab fa-react"></i>
                <h3>Frontend Development</h3>
              </div>
              <ul className="skill-list">
                <li>React.js</li>
                <li>Vite</li>
                <li>Responsive UI/UX</li>
                <li>CSS Grid & Flexbox</li>
                <li>CSS Animations / GSAP</li>
              </ul>
            </div>

            <div className="skill-category">
              <div className="category-header">
                <i className="fas fa-server"></i>
                <h3>Backend & Database</h3>
              </div>
              <ul className="skill-list">
                <li>Node.js / Express.js</li>
                <li>FastAPI</li>
                <li>REST APIs</li>
                <li>PostgreSQL / MongoDB</li>
                <li>JWT Auth / Security</li>
              </ul>
            </div>

            <div className="skill-category">
              <div className="category-header">
                <i className="fas fa-tools"></i>
                <h3>DevOps & Tools</h3>
              </div>
              <ul className="skill-list">
                <li>Git & GitHub</li>
                <li>Vercel / Render / Netlify</li>
                <li>Playwright (Testing)</li>
                <li>Postman / API Tools</li>
                <li>VS Code / IntelliJ</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Projects Section with 3D Tilt Cards */}
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Showcase</span>
            <h2 className="title">My Creations</h2>
            <div className="header-line"></div>
          </div>

          {/* Project Filters */}
          <div className="project-filters">
            <button className={`filter-tab ${projectFilter === 'all' ? 'active' : ''}`} onClick={() => setProjectFilter('all')}>All Projects</button>
            <button className={`filter-tab ${projectFilter === 'fullstack' ? 'active' : ''}`} onClick={() => setProjectFilter('fullstack')}>Full-Stack & Interactive</button>
            <button className={`filter-tab ${projectFilter === 'java' ? 'active' : ''}`} onClick={() => setProjectFilter('java')}>Java & SQL</button>
            <button className={`filter-tab ${projectFilter === 'frontend' ? 'active' : ''}`} onClick={() => setProjectFilter('frontend')}>Frontend & Design</button>
          </div>

          {/* Projects Display with 3D Tilt Wrapper */}
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <TiltCard className={`project-card card-${project.category}`} key={project.id} onClick={() => setSelectedProject(project)}>
                <div className="project-card-header">
                  <span className="project-badge">{project.category}</span>
                  <div className="project-icon-wrapper">
                    <i className={
                      project.category === 'fullstack' ? 'fas fa-laptop-code' :
                      project.category === 'frontend' ? 'fab fa-react' : 'fab fa-java'
                    }></i>
                  </div>
                </div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.tagline}</p>
                <div className="project-card-tech">
                  {project.techStack.map((tech, index) => (
                    <span className="tech-tag" key={index}>{tech}</span>
                  ))}
                </div>
                <div className="project-card-actions">
                  <button className="project-card-btn">
                    View Case Study <i className="fas fa-arrow-right"></i>
                  </button>
                  <div className="project-card-links" onClick={(e) => e.stopPropagation()}>
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer" aria-label="Live Demo"><i className="fas fa-external-link-alt"></i></a>}
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Project Details Case Study Modal */}
      {selectedProject && (
        <div className="modal-overlay active" onClick={(e) => e.target.classList.contains('modal-overlay') && setSelectedProject(null)}>
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setSelectedProject(null)} aria-label="Close details">&times;</button>
            <div className="modal-body">
              <span className="modal-badge">{selectedProject.category}</span>
              <h2>{selectedProject.title}</h2>
              <p className="tagline">{selectedProject.tagline}</p>

              <div className="modal-section">
                <h3>Overview</h3>
                <p>{selectedProject.description}</p>
              </div>

              <div className="modal-section">
                <h3>Tech Stack</h3>
                <div className="modal-tech-stack">
                  {selectedProject.techStack.map((tech, idx) => (
                    <span className="tech-tag" key={idx}>{tech}</span>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>Key Features</h3>
                <ul className="modal-features-list">
                  {selectedProject.keyFeatures.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div className="modal-footer-actions">
                {selectedProject.liveLink && <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Live Demo <i className="fas fa-external-link-alt"></i></a>}
                {selectedProject.githubLink && <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">Source Code <i className="fab fa-github"></i></a>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. Experience Timeline */}
      <section id="experience" className="experience-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Timeline</span>
            <h2 className="title">Journey & Highlights</h2>
            <div className="header-line"></div>
          </div>

          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">Present</div>
              <div className="timeline-content">
                <h3>Full-Stack & AI Agent Developer</h3>
                <p>Designing intelligent workflow automations, experimenting with LLM prompts, building responsive SaaS models, and custom client interfaces.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2024 - 2025</div>
              <div className="timeline-content">
                <h3>Database & Java System Designs</h3>
                <p>Built robust JDBC transaction frameworks, custom database management models, and console logic games applying OOP architectures in Java.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-date">2023 - Present</div>
              <div className="timeline-content">
                <h3>B.Tech in Computer Science & Engineering</h3>
                <p>Lakshmi Narain College of Technology & Science (LNCTS), Bhopal. Focus on core programming concepts, data structures, algorithms, SQL querying, and responsive web development interfaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10.5. Certifications & Achievements Section */}
      <section id="certifications" className="certifications-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Credentials</span>
            <h2 className="title">Certifications & Training</h2>
            <div className="header-line"></div>
          </div>

          <div className="certifications-grid">
            <TiltCard className="certificate-card" restTransform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)">
              <div className="cert-header">
                <span className="cert-badge">Software Engineering</span>
                <div className="cert-icon-wrapper"><i className="fas fa-chart-line"></i></div>
              </div>
              <h3 className="cert-title">JP Morgan Chase & Co.</h3>
              <p className="cert-sub">Software Engineering Job Simulation</p>
              
              <p className="cert-description">
                Engineered interactive data charts and visualization feeds using React and Perspective. Formulated real-time stock dashboards and structured object-oriented system components.
              </p>

              <div className="cert-skills">
                <span className="cert-skill-tag">React</span>
                <span className="cert-skill-tag">Data Visualizer</span>
                <span className="cert-skill-tag">OOP</span>
              </div>
              
              <a href={import.meta.env.BASE_URL + "assets/certificates/jpmorgan.pdf"} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate <i className="fas fa-file-pdf"></i>
              </a>
            </TiltCard>

            <TiltCard className="certificate-card" restTransform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)">
              <div className="cert-header">
                <span className="cert-badge">Cloud Infrastructure</span>
                <div className="cert-icon-wrapper"><i className="fab fa-aws"></i></div>
              </div>
              <h3 className="cert-title">Amazon Web Services (AWS)</h3>
              <p className="cert-sub">Cloud Practitioner & Architecture Foundations</p>

              <p className="cert-description">
                Deployed backend APIs and frontend bundles using EC2 and S3. Configured VPC network routing parameters, security groups, and cost-effective AWS Lambda routes.
              </p>

              <div className="cert-skills">
                <span className="cert-skill-tag">AWS EC2</span>
                <span className="cert-skill-tag">S3 Storage</span>
                <span className="cert-skill-tag">Serverless</span>
              </div>

              <a href={import.meta.env.BASE_URL + "assets/certificates/aws.pdf"} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate <i className="fas fa-file-pdf"></i>
              </a>
            </TiltCard>

            <TiltCard className="certificate-card" restTransform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)">
              <div className="cert-header">
                <span className="cert-badge">Secure Engineering</span>
                <div className="cert-icon-wrapper"><i className="fas fa-shield-alt"></i></div>
              </div>
              <h3 className="cert-title">Commonwealth Bank</h3>
              <p className="cert-sub">Software Engineering Job Simulation</p>

              <p className="cert-description">
                Secured REST APIs with token authorization parameters. Applied cryptography routines for user details encryption and audited potential vector risks using threat modeling templates.
              </p>

              <div className="cert-skills">
                <span className="cert-skill-tag">Cryptography</span>
                <span className="cert-skill-tag">API Security</span>
                <span className="cert-skill-tag">Threat Modeling</span>
              </div>

              <a href={import.meta.env.BASE_URL + "assets/certificates/commonwealth.pdf"} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate <i className="fas fa-file-pdf"></i>
              </a>
            </TiltCard>

            <TiltCard className="certificate-card" restTransform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)">
              <div className="cert-header">
                <span className="cert-badge">Industrial Dev</span>
                <div className="cert-icon-wrapper"><i className="fas fa-industry"></i></div>
              </div>
              <h3 className="cert-title">Siemens</h3>
              <p className="cert-sub">Software Engineering Simulation</p>

              <p className="cert-description">
                Explored factory automation architectures, analyzed IoT communication models, and developed test suites to evaluate diagnostic program performance.
              </p>

              <div className="cert-skills">
                <span className="cert-skill-tag">IIoT</span>
                <span className="cert-skill-tag">Automation Testing</span>
                <span className="cert-skill-tag">System Pipelines</span>
              </div>

              <a href={import.meta.env.BASE_URL + "assets/certificates/siemens.pdf"} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate <i className="fas fa-file-pdf"></i>
              </a>
            </TiltCard>

            <TiltCard className="certificate-card" restTransform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)">
              <div className="cert-header">
                <span className="cert-badge">Artificial Intelligence</span>
                <div className="cert-icon-wrapper"><i className="fas fa-robot"></i></div>
              </div>
              <h3 className="cert-title">Tata Consultancy Services</h3>
              <p className="cert-sub">Generative AI Career Experience</p>

              <p className="cert-description">
                Integrated LLM services into SaaS products, designed effective prompting styles, managed temperature parameters, and analyzed data safety compliance standards.
              </p>

              <div className="cert-skills">
                <span className="cert-skill-tag">GenAI</span>
                <span className="cert-skill-tag">LLMs</span>
                <span className="cert-skill-tag">Prompt Design</span>
              </div>

              <a href={import.meta.env.BASE_URL + "assets/certificates/tatagenai.pdf"} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate <i className="fas fa-file-pdf"></i>
              </a>
            </TiltCard>

            <TiltCard className="certificate-card" restTransform="perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)">
              <div className="cert-header">
                <span className="cert-badge">Leadership & Growth</span>
                <div className="cert-icon-wrapper"><i className="fas fa-users"></i></div>
              </div>
              <h3 className="cert-title">All India Career Summit</h3>
              <p className="cert-sub">Emerging Leader Participant</p>

              <p className="cert-description">
                Coordinated cross-functional task teams to propose technical sustainability designs. Practiced agile task flows and presented solutions directly to engineering panels.
              </p>

              <div className="cert-skills">
                <span className="cert-skill-tag">Leadership</span>
                <span className="cert-skill-tag">Agile Workflows</span>
                <span className="cert-skill-tag">Collaboration</span>
              </div>

              <a href={import.meta.env.BASE_URL + "assets/certificates/careersummit.pdf"} target="_blank" rel="noopener noreferrer" className="cert-link">
                View Certificate <i className="fas fa-file-pdf"></i>
              </a>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* 11. Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <span className="subtitle">Get In Touch</span>
            <h2 className="title">Let's Build Something Together</h2>
            <div className="header-line"></div>
          </div>

          <div className="contact-grid">
            <div className="contact-info">
              <h3>Contact Info</h3>
              <p>Feel free to reach out for project collaboration, job opportunities, or just to say hi!</p>

              <div className="info-links">
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h4>Email</h4>
                    <a href="mailto:raunaksharma88630mt@gmail.com">raunaksharma88630mt@gmail.com</a>
                  </div>
                </div>

                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h4>Location</h4>
                    <span>Bhopal, Madhya Pradesh, India</span>
                  </div>
                </div>
              </div>

              <div className="contact-socials">
                <a href="https://github.com/Raunaksharmaq64" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i></a>
                <a href="https://www.linkedin.com/in/raunak-sharma-q64/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                <a href="https://www.instagram.com/raunak_sharma73?igsh=MW14bHFjbHY2bWtybA==" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            <div className="contact-form-wrapper">
              {formStatus === 'success' ? (
                <div className="form-success-message" style={{ textAlign: 'center', padding: '2rem' }}>
                  <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h3>Message Sent Successfully!</h3>
                  <p style={{ color: 'hsl(var(--text-secondary))', margin: '1rem 0 2rem' }}>
                    Thank you for reaching out. I have received your message and will reply to your email address shortly.
                  </p>
                  <button className="btn btn-primary" onClick={() => setFormStatus('idle')}>Send Another Message</button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="form-name">Name</label>
                    <input 
                      type="text" 
                      id="form-name" 
                      placeholder="Your Name" 
                      value={contactForm.name} 
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required 
                      autoComplete="off" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-email">Email Address</label>
                    <input 
                      type="email" 
                      id="form-email" 
                      placeholder="name@example.com" 
                      value={contactForm.email} 
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required 
                      autoComplete="off" 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="form-body">Message</label>
                    <textarea 
                      id="form-body" 
                      rows="5" 
                      placeholder="Write your message here..." 
                      value={contactForm.message} 
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  {formStatus === 'missing_key' && (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', color: '#ef4444' }}>
                      <strong>Action Required:</strong> Please register a free access key at <a href="https://web3forms.com" target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>web3forms.com</a> and paste it into the <code>WEB3FORMS_ACCESS_KEY</code> constant at the top of <code>src/App.jsx</code> to enable emails.
                    </div>
                  )}

                  {formStatus === 'error' && (
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem', color: '#ef4444' }}>
                      ❌ FAILED: Unable to submit form. Please check your network connection or try again.
                    </div>
                  )}

                  <button type="submit" className="btn btn-primary submit-btn" disabled={formStatus === 'sending'}>
                    {formStatus === 'sending' ? (
                      <>Sending Message... <i className="fas fa-spinner fa-spin" style={{ marginLeft: '0.5rem' }}></i></>
                    ) : (
                      <>Send Message <i className="fas fa-paper-plane"></i></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 12. Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Raunak Sharma. Crafted with precision & purpose.</p>
        </div>
      </footer>
      <DevTerminal />
    </>
  );
}
