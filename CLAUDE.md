# CLAUDE.md — Development Guardrails 🛡️

## 💎 Project Philosophy
This is the **Design Skill OS**, an elite cognitive layer for AI agents. We don't build "assets"; we build **reasoning systems**. Every code change must improve the AI's ability to think like a master designer.

## 🛠 Command Center
- **Sync Dependencies**: `npm install`
- **Global Dev Install**: `npm install -g .`
- **Local Test Sync**: `design-skill init --ai claude --offline`
- **Maintenance**: `design-skill versions` | `design-skill update`

## 🧩 Architecture Snapshot
- **`cli/`**: The deployment engine. Uses `commander` and `fs-extra` to map the Skill OS to various assistants.
- **`src/design-skill/`**: The Core Intelligence (The "Brain").
  - `SKILL.md`: The 900+ line master knowledge base.
  - `data/`: Industry-specific reasoning rules (161+ rules).
  - `scripts/`: Python-based logic engines.
  - `templates/`: High-fidelity UI pattern library.

## 🧪 Development Standards
1. **The Brain is Sacred**: Changes to `SKILL.md` must be rooted in proven design principles (Glaser, Lupton, etc.).
2. **Adversarial First**: Every new feature must be compatible with the **Red Team Protocol** (Section 23).
3. **Multi-Assistant Native**: Always verify path resolution across `claude`, `cursor`, `windsurf`, `antigravity`, and `copilot`.
4. **Pro-Max Output**: CLI feedback should be informative and use `chalk` for high-fidelity terminal styling.

## 📂 Folder Map
- `/cli`: Node.js CLI source.
- `/src/design-skill`: Core design logic.
- `/docs`: Strategy and historical context.
- `/.claude`: Development/Test environment for Claude Code.

---
**Build with intent. Design for the future.**
