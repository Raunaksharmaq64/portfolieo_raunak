import React, { useState, useEffect, useRef } from 'react';
import { projectsData } from '../data/projectsData';
import './DevTerminal.css';

export default function DevTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [history, setHistory] = useState([
    { text: "Raunak's Terminal OS v1.4.0", type: 'system' },
    { text: "Type 'help' to see active command lists or click the '?' button above for the interactive guide.", type: 'system' },
    { text: "", type: 'empty' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  const availableCmds = ['about', 'skills', 'projects', 'contact', 'resume', 'resume view', 'theme', 'locate', 'visitor', 'socials', 'neofetch', 'history', 'cls', 'clear', 'exit', 'help', 'man'];

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
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen, showManual]);

  const handleOpenTerminal = () => {
    setIsOpen(true);
    setShowHint(false);
    localStorage.setItem('portfolioTerminalOpened', 'true');
  };

  // Handle Tab and Up/Down Arrow keys
  const handleKeyDown = (e) => {
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
      case 'neofetch':
        newLines.push(
          { text: "      /\\_/\\       OS: RaunakOS v1.4.0", type: 'output' },
          { text: "     ( o.o )      College: LNCTS, Bhopal", type: 'output' },
          { text: "      > ^ <       Degree: B.Tech CSE (2023 - Present)", type: 'output' },
          { text: "                  Uptime: 2 hours, 18 minutes", type: 'output' },
          { text: "                  Shell: RaunakBash v1.4", type: 'output' },
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
          newLines.push({ text: "Usage: locate <section_name> (e.g. locate projects, locate contact)", type: 'error' });
        } else {
          const sectionId = arg === 'home' ? 'hero' : arg;
          const targetSection = document.getElementById(sectionId);
          if (targetSection) {
            newLines.push({ text: `Locating section '${sectionId}'...`, type: 'system' });
            targetSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            newLines.push({ text: `Section '${sectionId}' not found. Try: about, skills, projects, experience, certifications, contact.`, type: 'error' });
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
      {/* Floating Action Button */}
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

      {/* Terminal Window */}
      {isOpen && (
        <div className="terminal-window">
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="dot red" onClick={() => setIsOpen(false)}></span>
              <span className="dot yellow" onClick={() => setIsOpen(false)}></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-title">guest@raunak-pc: ~</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button 
                className="terminal-help-btn" 
                onClick={() => setShowManual(!showManual)} 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: showManual ? '#fbbf24' : '#9ca3af', 
                  cursor: 'pointer', 
                  fontSize: '1rem',
                  transition: 'color 0.2s ease'
                }}
                title="Toggle Help Manual"
              >
                <i className="fas fa-question-circle"></i>
              </button>
              <button className="terminal-close-btn" onClick={() => setIsOpen(false)} style={{ marginRight: '6px' }}>&times;</button>
            </div>
          </div>

          {showManual ? (
            <div className="terminal-manual-overlay" style={{ padding: '1.2rem', overflowY: 'auto', flexGrow: 1, fontSize: '0.82rem', lineHeight: '1.6', color: '#e2e8f0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(251, 191, 36, 0.3)', paddingBottom: '0.5rem', marginBottom: '0.8rem' }}>
                <h4 style={{ color: '#fbbf24', margin: 0, fontFamily: 'var(--font-display)', fontWeight: 600 }}>📖 CLI Cheat Sheet</h4>
                <button className="btn btn-primary" onClick={() => setShowManual(false)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', borderRadius: '4px' }}>Back to Shell</button>
              </div>
              <p style={{ margin: '0 0 0.8rem 0', color: '#9ca3af' }}>Type commands and press Enter. Support <strong>Tab</strong> autocomplete & <strong>Up/Down</strong> history.</p>
              
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 0', color: '#34d399' }}>Command</th>
                    <th style={{ padding: '4px 0', color: '#fbbf24' }}>Description</th>
                    <th style={{ padding: '4px 0', color: '#9ca3af' }}>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>neofetch</code></td>
                    <td style={{ padding: '4px 0' }}>ASCII art & LNCTS details</td>
                    <td style={{ padding: '4px 0' }}><code>neofetch</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>projects</code></td>
                    <td style={{ padding: '4px 0' }}>Lists all 17 projects indexes</td>
                    <td style={{ padding: '4px 0' }}><code>projects</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>projects &lt;id&gt;</code></td>
                    <td style={{ padding: '4px 0' }}>Inspects details of a project</td>
                    <td style={{ padding: '4px 0' }}><code>projects 1</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>theme</code></td>
                    <td style={{ padding: '4px 0' }}>Toggles Dark / Light mode theme</td>
                    <td style={{ padding: '4px 0' }}><code>theme</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>locate &lt;sec&gt;</code></td>
                    <td style={{ padding: '4px 0' }}>Scrolls to section on the page</td>
                    <td style={{ padding: '4px 0' }}><code>locate projects</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>resume</code></td>
                    <td style={{ padding: '4px 0' }}>Downloads resume PDF directly</td>
                    <td style={{ padding: '4px 0' }}><code>resume</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>resume view</code></td>
                    <td style={{ padding: '4px 0' }}>Opens live resume in new tab</td>
                    <td style={{ padding: '4px 0' }}><code>resume view</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>about</code></td>
                    <td style={{ padding: '4px 0' }}>Quick bio & introduction</td>
                    <td style={{ padding: '4px 0' }}><code>about</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>contact</code></td>
                    <td style={{ padding: '4px 0' }}>Email, GitHub & LinkedIn</td>
                    <td style={{ padding: '4px 0' }}><code>contact</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>socials</code></td>
                    <td style={{ padding: '4px 0' }}>Lists social accounts links</td>
                    <td style={{ padding: '4px 0' }}><code>socials</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>visitor</code></td>
                    <td style={{ padding: '4px 0' }}>Shows current visitor greeting</td>
                    <td style={{ padding: '4px 0' }}><code>visitor</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>history</code></td>
                    <td style={{ padding: '4px 0' }}>Shows shell command history</td>
                    <td style={{ padding: '4px 0' }}><code>history</code></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '4px 0' }}><code>cls</code> / <code>clear</code></td>
                    <td style={{ padding: '4px 0' }}>Clears the terminal screen logs</td>
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
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
