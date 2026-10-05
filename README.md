# CRYPTOSPHERE — Discrete Mathematics Laboratory

An interactive, browser-based mini project that turns core Discrete Mathematics concepts into visual computational workbenches.

## What it demonstrates

- Logic: propositions, truth tables, equivalence, implication, CNF/DNF, inference
- Number Theory: divisibility, GCD, Euclidean + Extended Euclidean algorithms, primes, factorization, modular arithmetic, Euler phi, modular inverse, RSA
- Relations & Digraphs: relation matrix, digraph, reflexive/symmetric/antisymmetric/transitive checks, Warshall closure, equivalence classes
- Posets & Lattices: partial orders, Hasse diagrams, maximal/minimal elements, lattice checks, LUB/GLB
- Functions: injective/surjective/bijective mappings, composition, identity/inverse checks, Pigeonhole Principle simulation
- Graphs: graph creation/editing, paths, Euler path/circuit, Hamiltonian search, subgraph view, isomorphism, basic planarity analysis
- Algebraic Structures: binary operation tables, semigroup/monoid/group checks, cyclicity, Hamming (7,4) encoding/decoding

## Run

```bash
npm install
npm run dev
```

Then open the URL printed by Vite (normally http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Notes

This project intentionally uses a lightweight React + Vite stack with no graph/math UI dependency. The mathematical algorithms live in `src/algorithms.js`; visual components consume those pure functions. That makes the implementation easy to explain during a viva.

Some security demonstrations (especially RSA) use small educational primes and are **not intended as production cryptography**.
