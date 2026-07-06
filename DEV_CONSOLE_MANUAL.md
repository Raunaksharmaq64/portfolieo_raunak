# 🖥️ RaunakOS Dev Console — User Manual & Command Guide

Welcome to the **RaunakOS Dev Console**! This floating developer widget is a retro-modern CLI shell built to navigate, query, and interact with Raunak's portfolio directly from the command line.

---

## 🚀 1. Getting Started

### 🟢 How to Open / Minimize
* **Open:** Click the floating golden circular button containing the terminal icon (`>_ Dev Console`) located in the **bottom-right corner** of the screen.
* **Minimize:** Click the red dot in the window header, press the `X` button on the top-right, or type the command `exit` and press Enter.
* **Focus:** Click anywhere inside the dark terminal window body to focus the cursor on the command prompt line.

---

## ⌨️ 2. Advanced Shell Features

To make the console feel like a real native terminal, the shell supports advanced command utilities:
1. **Tab Autocomplete:** Type the first few letters of a command (e.g. `sk` or `neo`) and press the `Tab` key to auto-complete the command instantly.
2. **Command History (Up/Down Arrows):** Press the `ArrowUp` key on your keyboard to recall the last command you typed. Keep pressing it to cycle backwards through your command history. Use `ArrowDown` to cycle forwards.

---

## 📋 3. Command Reference Cheat Sheet

| Command | Arguments | Description | Example Usage |
| :--- | :--- | :--- | :--- |
| **`help`** | *None* | Lists all available console commands | `help` |
| **`neofetch`** | *None* | Prints visual ASCII cat art & system specifications | `neofetch` |
| **`about`** | *None* | Displays Raunak's profile biography | `about` |
| **`skills`** | *None* | Prints the tech stacks (Frontend, Backend, Java, etc.) | `skills` |
| **`projects`** | *None* | Enumerates all 17 projects in a indexed directory | `projects` |
| **`projects`** | `<number>` or `<id>` | Displays full features & codes of a specific project | `projects 1` or `projects hostelbuddy` |
| **`contact`** | *None* | Outputs direct email and workspace addresses | `contact` |
| **`socials`** | *None* | Prints clickable links to LinkedIn, GitHub, and Instagram | `socials` |
| **`resume`** | *None* | Triggers a download of Raunak's developer Resume PDF | `resume` |
| **`theme`** | *None* | Toggles the site theme (Dark Mode ↔️ Light Mode) | `theme` |
| **`locate`** | `<section>` | Scrolls the webpage to that section (e.g. projects, contact) | `locate projects` or `locate contact` |
| **`visitor`** | *None* | Greets the visitor by the name entered in welcome popup | `visitor` |
| **`clear` / `cls`** | *None* | Clears the terminal screen buffer | `cls` or `clear` |
| **`exit`** | *None* | Minimizes the terminal window | `exit` |

---

## 🛠️ 4. Interaction Examples

### 📂 How to inspect details of a project:
1. Type `projects` and press Enter to see the complete catalog of projects.
2. Find the project number or id you are interested in (e.g., number `1` is HostelBuddy).
3. Type `projects 1` or `projects hostelbuddy` and press Enter.
4. The console will print the title, tagline, description, tech stack, key features, and live links for you!

### 🧭 How to navigate the page:
* Type `locate certifications` and press Enter. The webpage will smoothly scroll directly down to the Certifications list.
* Type `locate contact` to scroll to the message form.

### 🌓 How to toggle theme:
* Type `theme` and press Enter. The portfolio will swap between Dark and Light mode.
