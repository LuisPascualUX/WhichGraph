# WhichGraph

WhichGraph is a visual chart-selection atlas inspired by the Financial Times Visual Vocabulary.  
It helps you explore chart types by data relationship, with bilingual support (Spanish/English), chart previews, and practical descriptions for each chart.

## Features

- 70+ chart cards grouped by analytical intent (change over time, distribution, correlation, etc.)
- Bilingual interface (`ESP` / `ENG`)
- Reference-based chart descriptions (from the Visual Vocabulary PDFs)
- Interactive filtering by category and search
- Dynamic chart mini-previews rendered with D3

## Tech Stack

- React
- Vite
- D3
- Tailwind CSS

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Run in development

```bash
npm run dev
```

Open: `http://localhost:5173`

### 3) Build for production

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Project Structure

```text
src/
  App.jsx                 # Main app and chart catalog logic
  chartPreview.js         # D3 mini-preview renderer
  components/ui/          # UI primitives
  lib/utils.js            # Utility helpers
```

## Reference Sources

- `Visual-vocabulary-es.pdf`
- `Visual-vocabulary-en.pdf`

These files are used as the content reference for chart naming and descriptions.

