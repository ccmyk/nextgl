## Legacy Event & DOM Audit — Refactor Tracker

### ✅ Confirmed Problematic Legacy Patterns

#### .onclick Usage
- `main🐙🐙🐙/pop.js:213` — `link.onclick = async(event) => {...}`
- `Nav🌤️/index.js:332` — `this.DOM.burger.onclick = () => {...}`
- `lazyVideo/index.js:119` — `this.DOM.b.onclick = () => {...}`
- `🧮/base.js:264` — `document.querySelector('.cnt_g').onclick = async(e) => {...}`
- `🧮/base.js:354` — `el_md.onclick = async () => {...}`
- `Projects/projects.js:72`, `87` — `accordion.onclick = () => {...}`

#### .scroll or `scrollTo` Usage
- Heavy reliance on `window.scrollY`, `scrollTo`, and class toggling with `scroll-*`
- `main🐙🐙🐙/index.js` — scroll direction detection and class toggling
- `gl🌊🌊🌊/*/*.js` — dynamic Y-offset calculations using `window.scrollY`

#### .classList Manipulation
- Conditional adds/removes on `scroll-up`, `scroll-start`, `nono`, etc.
- `events.js`, `index.js`, `anim.js`, etc.

#### Hardcoded/inline SplitType HTML
- Likely result of saving DOM snapshot post-runtime
- Should be replaced with dynamic SplitType usage in `useEffect`

---

### 🧠 Plan for Migration

#### 1. Replace Inline and Legacy Handlers
- `.onclick` → React `onClick`
- `.scroll`, `scrollTo`, `scrollTop` → Lenis API via `useLenisScroll`, `useSmoothScroll`
- `.classList` toggles → `useState`, `useEffect`, or `useRef` with conditional rendering

#### 2. Refactor SplitType + GSAP
- Move into modular hooks:
  - `useSplitText()` for splitting logic
  - `useScrollAnimation()` or `useGSAPAnimation()` for sequence

#### 3. Rebuild Scroll Behavior
- Replace `scrollFn`, `scrollTo`, `scrollY` tracking with `useScroll()` and `useLenisScroll()`
- Use GSAP's `ScrollTrigger` for animated scroll-linked logic

#### 4. Recreate Global Events with React
- Convert legacy `addEventListener('startscroll')` etc. into `useGlobalEvents()`
- Allow all modules to dispatch/consume via a central event bus or React context

#### 5. Intersection Observers
- Already scaffolded in `useIntersectionObservers`
- Expand to support `.iO`, `.iO-scroll`, `.iO-home`, `.fade`, `.char`, etc.

---

### Recommended Usage
- Place this file in `/docs/dev/legacy-audit.md` or `/refactor/` directory
- Use it to guide JetBrains AI or Cursor refactors
- Check off lines as each file/hook is fully converted to idiomatic React

---

### Todo Files (high priority)
- [ ] `projects.js`
- [ ] `home.js`
- [ ] `Mouse/index.js`
- [ ] `Nav/index.js`
- [ ] `anim.js`
- [ ] `main🐙🐙🐙/events.js`
- [ ] `ios.js` (lazy loaders)
- [ ] `gl🌊🌊🌊/🎞️/base.js` (scroll-linked visuals)

