# 🐍 Snake — React + TypeScript Edition

A minimalist Snake clone built with React, TypeScript, and HTML Canvas — focused on mastering game loops, keyboard input, and UI feedback using React hooks and refs.
_Visualize your LinkedIn network like a constellation — built with React, TypeScript, and TailwindCSS._ 🦝

[![CI](https://github.com/NickTheDevOpsGuy/Constellation/actions/workflows/constellation-ci.yml/badge.svg?branch=main)](https://github.com/NickTheDevOpsGuy/Snake/actions/workflows/constellation-ci.yml)
![Built with React](https://img.shields.io/badge/Built%20with-React-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/github/license/NickTheDevOpsGuy/Constellation)
![Last Commit](https://img.shields.io/github/last-commit/NickTheDevOpsGuy/Constellation)
![Contributions welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)

---

## 🎯 Features
- ⚡ Smooth Canvas Rendering — real-time updates without unnecessary re-renders
- 🎮 Arrow Key Controls — responsive, with spacebar restart
- 🍎 Dynamic Food Spawning — random positions, never overlaps the snake
- 💥 Collision Detection — walls and self-collision instantly end the game
- 🔁 Clean Restart Logic — quick replay loop with instant feedback
- 💫 Animated Score Pop — subtle CSS bump when you eat food
- 🌑 Dark Grid Aesthetic — modern look with subtle borders and Tailwind styling


---

## 📂 Project Structure

<details>
<summary>📁 Click to expand project file structure</summary>

```plaintext
├── .github
│   └── snake-ci.yml
├── .gitignore
├── .husky
│   ├── _
│   │   ├── .gitignore
│   │   ├── applypatch-msg
│   │   ├── commit-msg
│   │   ├── h
│   │   ├── husky.sh
│   │   ├── post-applypatch
│   │   ├── post-checkout
│   │   ├── post-commit
│   │   ├── post-merge
│   │   ├── post-rewrite
│   │   ├── pre-applypatch
│   │   ├── pre-auto-gc
│   │   ├── pre-commit
│   │   ├── pre-merge-commit
│   │   ├── pre-push
│   │   ├── pre-rebase
│   │   └── prepare-commit-msg
│   ├── pre-commit
│   └── pre-push
├── .prettierignore
├── .prettierrc
├── .prettierrc.json
├── .prettierrc.yml
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── scripts
│   └── precheck.sh
├── src
│   └── app
│       ├── App.js
│       ├── App.tsx
│       ├── components
│       │   ├── SnakeCanvas.js
│       │   └── SnakeCanvas.tsx
│       ├── main.js
│       ├── main.tsx
│       └── styles
│           └── App.css
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

</details>

🦝 Author

Nick Clark — @NickDoesDevOps
Building fun learning projects & DevOps experiments, one raccoon mission at a time. 🦝
