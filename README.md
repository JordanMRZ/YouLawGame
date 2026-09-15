# Word Bridge 3D

Browser 3D obstacle course for teachers learning English. React + TypeScript + Three.js + Rapier.

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

Controls: W run · A/D strafe · Space jump · Shift sprint · Esc pause · mouse wheel zoom.

Progress is stored in `localStorage`. Swap `src/data/storage.ts` for Firebase later via `setSaveAdapter`.
Replace listening clips in `public/audio/listening/` and register them in `src/audio/listening.ts`.
