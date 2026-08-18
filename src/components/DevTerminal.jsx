import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';
import './DevTerminal.css';

export default function DevTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isMatrixActive, setIsMatrixActive] = useState(false);
  const [secretNumber, setSecretNumber] = useState(() => Math.floor(Math.random() * 20) + 1);
  const [guessAttempts, setGuessAttempts] = useState(0);

  const matrixCanvasRef = useRef(null);

  const [history, setHistory] = useState([
    { text: "Raunak's Terminal OS v1.5.0", type: 'system' },
    { text: "Type 'help' to see active commands, 'matrix' for digital rain, or 'game' to play mini-games.", type: 'system' },
    { text: "", type: 'empty' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const availableCmds = [
    'about', 'skills', 'projects', 'contact', 'resume', 'resume view', 'theme', 
    'locate', 'visitor', 'socials', 'neofetch', 'matrix', 'hire', 'sudo', 'game', 
    'game guess', 'game coin', 'game dice', 'coffee', 'quote', 'weather', 'cat', 
    'history', 'cls', 'clear', 'exit', 'help', 'man'
  ];

  const techQuotes = [
    "“Talk is cheap. Show me the code.” — Linus Torvalds",
    "“Stay hungry, stay foolish.” — Steve Jobs",
    "“The best way to predict the future is to invent it.” — Alan Kay",
    "“Simplicity is prerequisite for reliability.” — Edsger W. Dijkstra",
    "“It's not a bug – it's an undocumented feature.” — Anonymous",
    "“First, solve the problem. Then, write the code.” — John Johnson",
    "“Make it work, make it right, make it fast.” — Kent Beck",
    "“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” — Martin Fowler"
  ];

  useEffect(() => {
    // Show helper hint 2.5 seconds after page load if the user has not opened it yet
    const openedBefore = localStorage.getItem('portfolioTerminalOpened');
    if (!openedBefore) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (terminalEndRef.current && !isMatrixActive) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen, showManual, isMatrixActive]);

  // Matrix Rain Canvas Animation Effect
  useEffect(() => {
    if (!isMatrixActive) return;
    const canvas = matrixCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth || 620;
    canvas.height = canvas.parentElement.clientHeight || 420;

    const characters = '0123456789ABCDEFRAUNAKSHARMA01010101<>{}[]/*+~#@$%^&*';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationFrameId;

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#22c55e';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillStyle = (drops[i] * fontSize > canvas.height * 0.8 && Math.random() > 0.85) ? '#ffffff' : '#22c55e';
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMatrixActive]);

  const handleOpenTerminal = () => {
    setIsOpen(true);
    setShowHint(false);
    localStorage.setItem('portfolioTerminalOpened', 'true');
  };

  // Handle Tab and Up/Down Arrow keys
  const handleKeyDown = (e) => {
    if (isMatrixActive) {
      setIsMatrixActive(false);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const match = availableCmds.find(c => c.startsWith(inputVal.trim().toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < cmdHistory.length) {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = historyIdx - 1;
      if (nextIdx >= 0) {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else {
        setHistoryIdx(-1);
        setInputVal('');
      }
    }
  };

  const handleCommand = (cmdStr) => {
    if (isMatrixActive) {
      setIsMatrixActive(false);
      return;
    }

    const trimmed = cmdStr.trim();
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    const newLines = [{ text: `guest@raunak-pc:~$ ${cmdStr}`, type: 'prompt' }];

    if (trimmed === '') {
      setHistory(prev => [...prev, ...newLines]);
      return;
    }

    // Add to command history list
    setCmdHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1); // Reset index pointer

    switch (cmd) {
      case 'man':
      case 'help':
        setShowManual(true);
        return;
      case 'matrix':
        setIsMatrixActive(true);
        newLines.push({ text: "🟢 MATRIX DIGITAL RAIN INITIALIZED. Click anywhere or press any key to return.", type: 'matrix' });
        break;
      case 'hire':
        newLines.push(
          { text: "================ 🚀 RECRUITER DOSSIER ================", type: 'hire' },
          { text: "CANDIDATE:    Raunak Sharma", type: 'hire' },
          { text: "ROLE TARGET:  Full-Stack Engineer / AI Systems Developer", type: 'hire' },
          { text: "AVAILABILITY: Open for Collaborations, Internships & Roles", type: 'hire' },
          { text: "WHY HIRE RAUNAK?", type: 'system' },
          { text: "  ✔ Shipped 17+ complete interactive projects & applications", type: 'output' },
          { text: "  ✔ AI-accelerated high-velocity engineering workflow", type: 'output' },
          { text: "  ✔ Solid core foundation: JavaScript, Java, SQL, Python, React", type: 'output' },
          { text: "DIRECT CONTACT:", type: 'system' },
          { text: "  📧 Email:    raunaksharma88630mt@gmail.com", type: 'output' },
          { text: "  🔗 LinkedIn: linkedin.com/in/raunak-sharma-q64", type: 'output' },
          { text: "  📄 Resume:   Type 'resume' or 'resume view'", type: 'output' },
          { text: "======================================================", type: 'hire' }
        );
        break;
      case 'sudo':
        if (arg === 'hire' || arg === 'hire raunak') {
          handleCommand('hire');
          return;
        } else {
          newLines.push(
            { text: "[sudo] password for guest: *******", type: 'cmd-desc' },
            { text: "🔒 Permission Denied: Guest user has read-only access. Try 'sudo hire raunak' 😉", type: 'error' }
          );
        }
        break;
      case 'game':
        if (!arg || arg === 'help') {
          newLines.push(
            { text: "🎮 MINI-GAMES ARCADE:", type: 'system' },
            { text: "  1. game guess <number>  — Guess the secret number (1-20)", type: 'output' },
            { text: "  2. game coin            — Flip a coin (Heads / Tails)", type: 'output' },
            { text: "  3. game dice (or roll)  — Roll a 20-sided D20 dice", type: 'output' }
          );
        } else if (arg.startsWith('guess')) {
          const guessVal = parseInt(arg.replace('guess', '').trim(), 10);
          if (isNaN(guessVal) || guessVal < 1 || guessVal > 20) {
            newLines.push({ text: "Usage: game guess <1-20> (e.g. game guess 7)", type: 'error' });
          } else {
            const nextAttempts = guessAttempts + 1;
            setGuessAttempts(nextAttempts);

            if (guessVal === secretNumber) {
              newLines.push(
                { text: `🎉 BINGO! You guessed the secret number (${secretNumber}) in ${nextAttempts} attempt(s)!`, type: 'matrix' },
                { text: "A new secret number has been generated for your next game! 🎯", type: 'system' }
              );
              setSecretNumber(Math.floor(Math.random() * 20) + 1);
              setGuessAttempts(0);
            } else if (guessVal < secretNumber) {
              newLines.push({ text: `📈 TOO LOW! The secret number is higher than ${guessVal}. (Attempt: ${nextAttempts})`, type: 'system' });
            } else {
              newLines.push({ text: `📉 TOO HIGH! The secret number is lower than ${guessVal}. (Attempt: ${nextAttempts})`, type: 'system' });
            }
          }
        } else if (arg === 'coin') {
          const outcome = Math.random() > 0.5 ? '🪙 HEADS! 🌟' : '🪙 TAILS! ✨';
          newLines.push(
            { text: "Flipping coin...", type: 'cmd-desc' },
            { text: `Result: ${outcome}`, type: 'system' }
          );
        } else if (arg === 'dice' || arg === 'roll') {
          const roll = Math.floor(Math.random() * 20) + 1;
          const status = roll === 20 ? '🔥 NATURAL 20! CRITICAL HIT!' : roll === 1 ? '💀 CRITICAL MISS (1)!' : `Result: ${roll} / 20`;
          newLines.push(
            { text: "Rolling a D20 die 🎲...", type: 'cmd-desc' },
            { text: `🎲 ${status}`, type: roll === 20 ? 'matrix' : 'system' }
          );
        } else {
          newLines.push({ text: `Unknown game mode '${arg}'. Type 'game' to view options.`, type: 'error' });
        }
        break;
      case 'coffee':
      case 'brew':
        newLines.push(
          { text: "    (  )   (   )  )", type: 'system' },
          { text: "     ) (   )  (  (", type: 'system' },
          { text: "    ( )  (    ) )", type: 'system' },
          { text: "    _____________", type: 'output' },
          { text: "   |_____________|", type: 'output' },
          { text: "   |             | ===\\", type: 'output' },
          { text: "   |  Espresso   |    |", type: 'output' },
          { text: "   |   Active    | ===/", type: 'output' },
          { text: "   \\_____________/", type: 'output' },
          { text: "☕ Fresh dark roast brewed for 10x engineering velocity!", type: 'hire' }
        );
        break;
      case 'quote':
      case 'inspire':
        const randomQuote = techQuotes[Math.floor(Math.random() * techQuotes.length)];
        newLines.push(
          { text: "💡 DAILY DEV INSPIRATION:", type: 'system' },
          { text: randomQuote, type: 'output' }
        );
        break;
      case 'weather':
        newLines.push(
          { text: "📍 Location: Bhopal, Madhya Pradesh, India", type: 'system' },
          { text: "🌤️ Conditions: 28°C, Clear Skies, Wind: 7 km/h", type: 'output' },
          { text: "💻 Status: 100% chance of shipping high quality code today 🚀", type: 'matrix' }
        );
        break;
      case 'cat':
        if (!arg) {
          newLines.push({ text: "Usage: cat <filename> (e.g. cat resume.txt, cat about.txt, cat secret.txt)", type: 'error' });
        } else if (arg === 'resume.txt' || arg === 'resume') {
          newLines.push(
            { text: "RAUNAK SHARMA — Full-Stack & AI Software Engineer", type: 'system' },
            { text: "Education: B.Tech CSE at LNCTS Bhopal (Expected Graduation: 2029)", type: 'output' },
            { text: "17+ Shipped Projects | Certified by JP Morgan, AWS, Siemens", type: 'output' }
          );
        } else if (arg === 'about.txt' || arg === 'about') {
          newLines.push({ text: "Passionate developer crafting high-velocity full-stack software and AI automation workflows.", type: 'output' });
        } else if (arg === 'secret.txt' || arg === 'secrets.txt') {
          newLines.push(
            { text: "🎉 You found the hidden secret file!", type: 'matrix' },
            { text: "“Opportunities don't happen. You create them.” — Looking forward to connecting with you!", type: 'output' }
          );
        } else {
          newLines.push({ text: `cat: ${arg}: No such file or directory. Try: cat resume.txt, cat secret.txt`, type: 'error' });
        }
        break;
      case 'neofetch':
        newLines.push(
          { text: "      /\\_/\\       OS: RaunakOS v1.5.0", type: 'output' },
          { text: "     ( o.o )      College: LNCTS, Bhopal", type: 'output' },
          { text: "      > ^ <       Degree: B.Tech CSE (2023 - 2029 Expected)", type: 'output' },
          { text: "                  Uptime: 2 hours, 18 minutes", type: 'output' },
          { text: "                  Shell: RaunakBash v1.5", type: 'output' },
          { text: "                  Status: Open to Work 💼", type: 'output' }
        );
        break;
      case 'about':
        newLines.push({
          text: "Raunak Sharma - B.Tech CSE student at Lakshmi Narain College of Technology & Science (LNCTS), Bhopal. Full-stack developer specializing in intelligent automation models and responsive web designs.",
          type: 'output'
        });
        break;
      case 'skills':
        newLines.push(
          { text: "LANGUAGES:  JavaScript, Python, Java, SQL, HTML5, CSS3", type: 'output' },
          { text: "FRONTEND:   React.js, Responsive UI/UX, CSS Animations", type: 'output' },
          { text: "BACKEND:    Node.js, Express.js, FastAPI, REST APIs", type: 'output' },
          { text: "DATABASES:  PostgreSQL, MongoDB, SQL connectivities", type: 'output' },
          { text: "DEV/TOOLS:  Git, GitHub, Vercel, Render, Postman", type: 'output' }
        );
        break;
      case 'projects':
        if (!arg) {
          newLines.push({ text: "================ ALL CREATIONS ================", type: 'system' });
          projectsData.forEach((p, idx) => {
            newLines.push({ text: `  [${idx + 1}] ${p.title} (${p.category})`, type: 'output' });
          });
          newLines.push({ text: "-----------------------------------------------", type: 'system' });
          newLines.push({ text: "Type 'projects <number>' or 'projects <id>' to view full details (e.g. projects 1, projects hostelbuddy).", type: 'system' });
        } else {
          const pIdx = parseInt(arg, 10);
          const found = projectsData.find((p, idx) => 
            p.id.toLowerCase() === arg || (idx + 1) === pIdx
          );

          if (found) {
            newLines.push(
              { text: `================ PROJECT DETAILS ================`, type: 'system' },
              { text: `Title:       ${found.title}`, type: 'output' },
              { text: `Category:    ${found.category.toUpperCase()}`, type: 'output' },
              { text: `Tagline:     ${found.tagline}`, type: 'output' },
              { text: `Description: ${found.description}`, type: 'output' },
              { text: `Tech Stack:  ${found.techStack.join(', ')}`, type: 'output' },
              { text: `Key Features:`, type: 'output' }
            );
            found.keyFeatures.forEach(feat => {
              newLines.push({ text: `  - ${feat}`, type: 'cmd-desc' });
            });
            if (found.liveLink) newLines.push({ text: `Live Demo:   ${found.liveLink}`, type: 'output' });
            if (found.githubLink) newLines.push({ text: `GitHub Link: ${found.githubLink}`, type: 'output' });
            newLines.push({ text: `=================================================`, type: 'system' });
          } else {
            newLines.push({ text: `Project '${arg}' not found. Type 'projects' to view the numbers directory.`, type: 'error' });
          }
        }
        break;
      case 'contact':
        newLines.push(
          { text: "Email:      raunaksharma88630mt@gmail.com", type: 'output' },
          { text: "GitHub:     github.com/Raunaksharmaq64", type: 'output' },
          { text: "LinkedIn:   linkedin.com/in/raunak-sharma-q64", type: 'output' }
        );
        break;
      case 'resume':
        if (arg === 'view') {
          newLines.push({ text: "Opening live resume in new tab...", type: 'system' });
          window.open(import.meta.env.BASE_URL + 'resume.html', '_blank');
        } else {
          newLines.push({ text: "Triggering resume PDF download...", type: 'system' });
          const link = document.createElement('a');
          link.href = import.meta.env.BASE_URL + "assets/images/Raunak_Resume.pdf";
          link.download = "Raunak_Sharma_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        break;
      case 'theme':
        newLines.push({ text: "Toggling visual theme...", type: 'system' });
        const themeBtn = document.querySelector('.theme-toggle');
        if (themeBtn) {
          themeBtn.click();
        }
        break;
      case 'locate':
        if (!arg) {
          newLines.push({ text: "Usage: locate <section_name> (e.g. locate projects, locate services, locate contact)", type: 'error' });
        } else {
          const sectionId = arg === 'home' ? 'hero' : arg;
          const targetSection = document.getElementById(sectionId);
          if (targetSection) {
            newLines.push({ text: `Locating section '${sectionId}'...`, type: 'system' });
            targetSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            newLines.push({ text: `Section '${sectionId}' not found. Try: about, services, skills, projects, experience, certifications, contact.`, type: 'error' });
          }
        }
        break;
      case 'visitor':
        const name = localStorage.getItem('portfolioVisitorName') || 'Guest';
        newLines.push({ text: `Hello, ${name}! Welcome to Raunak's space. Connection status: ACTIVE.`, type: 'output' });
        break;
      case 'socials':
        newLines.push(
          { text: "🔗 LinkedIn:  https://www.linkedin.com/in/raunak-sharma-q64/", type: 'output' },
          { text: "🔗 GitHub:    https://github.com/Raunaksharmaq64", type: 'output' },
          { text: "🔗 Instagram: https://www.instagram.com/raunak_sharma73", type: 'output' }
        );
        break;
      case 'history':
        newLines.push({ text: "--- Shell Command History ---", type: 'system' });
        cmdHistory.forEach((h, idx) => {
          newLines.push({ text: `  ${idx + 1}  ${h}`, type: 'cmd-desc' });
        });
        break;
      case 'cls':
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      case 'exit':
        setIsOpen(false);
        setIsMatrixActive(false);
        setInputVal('');
        return;
      default:
        newLines.push({ text: `command not found: ${cmd}. Type 'help' for commands.`, type: 'error' });
    }

    setHistory(prev => [...prev, ...newLines, { text: "", type: 'empty' }]);
    setInputVal('');
  };

  return (
    <div className="dev-terminal-container">
      {!isOpen && (
        <div style={{ position: 'relative' }}>
          {showHint && (
            <div className="terminal-hint-bubble">
              <span>✨ Press Tab or type 'help'!</span>
              <button className="hint-close-btn" onClick={(e) => { e.stopPropagation(); setShowHint(false); }}>&times;</button>
            </div>
          )}
          <button className="terminal-floating-btn" onClick={handleOpenTerminal}>
            <i className="fas fa-terminal"></i>
            <span>Dev Console</span>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="terminal-window">
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="dot red" onClick={() => setIsOpen(false)} title="Close"></span>
              <span className="dot yellow" onClick={() => setHistory([])} title="Clear Screen"></span>
              <span className="dot green" onClick={() => setShowManual(!showManual)} title="Toggle Manual"></span>
            </div>
            <span className="terminal-title">guest@raunak-pc:~ (RaunakBash v1.5)</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                className="terminal-man-btn" 
                onClick={() => setShowManual(!showManual)}
                title="Interactive Guide"
              >
                {showManual ? "Terminal" : "Help ?"}
              </button>
              <button className="terminal-close-btn" onClick={() => setIsOpen(false)}>&times;</button>
            </div>
          </div>

          {isMatrixActive && (
            <div className="terminal-matrix-container" onClick={() => setIsMatrixActive(false)}>
              <canvas ref={matrixCanvasRef} className="terminal-matrix-canvas" />
              <div className="terminal-matrix-overlay">
                <h3>THE MATRIX HAS YOU...</h3>
                <p>Click anywhere or type to return to shell</p>
              </div>
            </div>
          )}

          {showManual && !isMatrixActive ? (
            <div className="terminal-body terminal-manual">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(251, 191, 36, 0.3)', paddingBottom: '8px', marginBottom: '12px' }}>
                <h4 style={{ color: '#fbbf24', margin: 0, fontSize: '0.95rem' }}>📖 Terminal Command Manual</h4>
                <button 
                  onClick={() => setShowManual(false)}
                  style={{ background: '#fbbf24', color: '#030712', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Return to Shell
                </button>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '12px' }}>
                Tip: Press <kbd style={{ background: '#374151', padding: '2px 4px', borderRadius: '3px' }}>Tab</kbd> for autocompletion or <kbd style={{ background: '#374151', padding: '2px 4px', borderRadius: '3px' }}>↑</kbd>/<kbd style={{ background: '#374151', padding: '2px 4px', borderRadius: '3px' }}>↓</kbd> for command history.
              </p>
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#34d399', textAlign: 'left' }}>
                    <th style={{ padding: '6px 0' }}>Command</th>
                    <th style={{ padding: '6px 0' }}>Description</th>
                    <th style={{ padding: '6px 0' }}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>matrix</code></td>
                    <td style={{ padding: '4px 0' }}>Falling green Matrix code rain</td>
                    <td style={{ padding: '4px 0' }}><code>matrix</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>hire</code> / <code>sudo hire raunak</code></td>
                    <td style={{ padding: '4px 0' }}>Recruiter dossier & perks</td>
                    <td style={{ padding: '4px 0' }}><code>hire</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>game guess &lt;num&gt;</code></td>
                    <td style={{ padding: '4px 0' }}>Number guessing game (1-20)</td>
                    <td style={{ padding: '4px 0' }}><code>game guess 7</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>game coin</code> / <code>game dice</code></td>
                    <td style={{ padding: '4px 0' }}>Flip coin or roll a D20 dice</td>
                    <td style={{ padding: '4px 0' }}><code>game roll</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>coffee</code></td>
                    <td style={{ padding: '4px 0' }}>Brews an ASCII espresso</td>
                    <td style={{ padding: '4px 0' }}><code>coffee</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>quote</code></td>
                    <td style={{ padding: '4px 0' }}>Random tech developer quote</td>
                    <td style={{ padding: '4px 0' }}><code>quote</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>weather</code></td>
                    <td style={{ padding: '4px 0' }}>Shows Bhopal weather status</td>
                    <td style={{ padding: '4px 0' }}><code>weather</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>cat &lt;file&gt;</code></td>
                    <td style={{ padding: '4px 0' }}>Print file (resume, secret.txt)</td>
                    <td style={{ padding: '4px 0' }}><code>cat secret.txt</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>neofetch</code></td>
                    <td style={{ padding: '4px 0' }}>System specs and ASCII logo</td>
                    <td style={{ padding: '4px 0' }}><code>neofetch</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>projects</code></td>
                    <td style={{ padding: '4px 0' }}>Lists all 17 projects indexes</td>
                    <td style={{ padding: '4px 0' }}><code>projects</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>theme</code></td>
                    <td style={{ padding: '4px 0' }}>Toggles Dark / Light mode theme</td>
                    <td style={{ padding: '4px 0' }}><code>theme</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>locate &lt;sec&gt;</code></td>
                    <td style={{ padding: '4px 0' }}>Scrolls to section on the page</td>
                    <td style={{ padding: '4px 0' }}><code>locate services</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>resume</code> / <code>resume view</code></td>
                    <td style={{ padding: '4px 0' }}>Download PDF / View live resume</td>
                    <td style={{ padding: '4px 0' }}><code>resume view</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>about</code> / <code>skills</code> / <code>contact</code></td>
                    <td style={{ padding: '4px 0' }}>Core developer profile summaries</td>
                    <td style={{ padding: '4px 0' }}><code>skills</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>cls</code> / <code>clear</code></td>
                    <td style={{ padding: '4px 0' }}>Clears terminal screen logs</td>
                    <td style={{ padding: '4px 0' }}><code>cls</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>exit</code></td>
                    <td style={{ padding: '4px 0' }}>Closes the terminal window</td>
                    <td style={{ padding: '4px 0' }}><code>exit</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : !isMatrixActive ? (
            <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
              {history.map((line, idx) => (
                <div key={idx} className={`terminal-line ${line.type}`}>
                  {line.text}
                </div>
              ))}
              <form onSubmit={(e) => { e.preventDefault(); handleCommand(inputVal); }} className="terminal-input-line">
                <span className="terminal-prompt">guest@raunak-pc:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="terminal-input"
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </form>
              <div ref={terminalEndRef} />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
