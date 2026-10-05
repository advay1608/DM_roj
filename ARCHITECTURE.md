# CRYPTOSPHERE Architecture

```text
React UI
  |
  +-- App.jsx -------------------- routing/workbench orchestration
  |
  +-- components/
  |     +-- Shell.jsx ------------ sidebar, top bar, cards, trace panel
  |     +-- Visuals.jsx ---------- Hasse, relation digraph, truth-table helpers
  |
  +-- pages/ (implemented inline as workbench components)
  |     LogicLab
  |     NumberLab
  |     RelationsLab
  |     PosetLab
  |     FunctionsLab
  |     GraphLab
  |     AlgebraLab
  |     CodingLab
  |
  +-- algorithms.js -------------- pure DM algorithms and validators
  |
  +-- styles.css ------------------ design system + responsive UI
```

## Design principle

Every workbench follows the same pattern:

**INPUT → REPRESENTATION → ALGORITHM TRACE → RESULT**

This is deliberate: the application should be demonstrable academically. A professor should be able to see where a syllabus concept is implemented rather than only seeing a final answer.

## State

All state is local React state. No server is required. The app can run fully offline after `npm install`.

## Extension points

- Add persistence through localStorage or a backend.
- Add export-to-PDF screenshots of workbench states.
- Add Dijkstra/BFS/DFS and a richer graph layout engine.
- Add general propositional proof search and larger Hamming-code families.
