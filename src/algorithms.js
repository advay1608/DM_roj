// Pure, dependency-free Discrete Mathematics algorithms used by CRYPTOSPHERE.

export function parseSet(input) {
  const s = input.trim().replace(/[{}]/g, '');
  if (!s) return [];
  return [...new Set(s.split(/[,\s]+/).map(v => v.trim()).filter(Boolean))];
}

export function gcd(a, b) {
  a = Math.abs(Number(a)); b = Math.abs(Number(b));
  const trace = [];
  while (b !== 0) {
    const q = Math.floor(a / b);
    const r = a % b;
    trace.push(`${a} = ${b} × ${q} + ${r}`);
    [a, b] = [b, r];
  }
  return { value: a, trace };
}

export function extendedGcd(a, b) {
  const origA = Number(a), origB = Number(b);
  const trace = [];
  let oldR = Math.abs(origA), r = Math.abs(origB);
  let oldS = 1, s = 0, oldT = 0, t = 1;
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    trace.push(`r₀=${oldR}, r₁=${r}, q=${q}`);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
    [oldT, t] = [t, oldT - q * t];
  }
  if (origA < 0) oldS = -oldS;
  if (origB < 0) oldT = -oldT;
  return { gcd: oldR, x: oldS, y: oldT, trace };
}

export function mod(a, n) {
  return ((Number(a) % Number(n)) + Number(n)) % Number(n);
}

export function modInverse(a, n) {
  const eg = extendedGcd(a, n);
  if (eg.gcd !== 1) return { exists: false, ...eg };
  return { exists: true, inverse: mod(eg.x, n), ...eg };
}

export function sieve(limit) {
  limit = Math.max(2, Math.floor(Number(limit)));
  const prime = Array(limit + 1).fill(true);
  prime[0] = prime[1] = false;
  const steps = [];
  for (let p = 2; p * p <= limit; p++) {
    if (prime[p]) {
      const crossed = [];
      for (let x = p * p; x <= limit; x += p) {
        if (prime[x]) crossed.push(x);
        prime[x] = false;
      }
      steps.push({ p, crossed });
    }
  }
  return { primes: prime.map((v, i) => v ? i : null).filter(Number.isInteger), steps };
}

export function factorize(n) {
  let x = Math.abs(Math.floor(Number(n)));
  const factors = [];
  if (x < 2) return factors;
  for (let p = 2; p * p <= x; p += p === 2 ? 1 : 2) {
    while (x % p === 0) { factors.push(p); x /= p; }
  }
  if (x > 1) factors.push(x);
  return factors;
}

export function phi(n) {
  let x = Math.abs(Math.floor(Number(n)));
  if (x === 0) return 0;
  let result = x;
  for (const p of [...new Set(factorize(x))]) result -= result / p;
  return Math.round(result);
}

export function powMod(base, exp, modulus) {
  base = mod(base, modulus); exp = Math.floor(Number(exp)); modulus = Number(modulus);
  if (modulus === 1) return 0;
  let result = 1 % modulus;
  const trace = [];
  while (exp > 0) {
    trace.push({ exp, base, result, bit: exp % 2 });
    if (exp % 2 === 1) result = (result * base) % modulus;
    base = (base * base) % modulus;
    exp = Math.floor(exp / 2);
  }
  return { value: result, trace };
}

export function rsaDemo(p, q, e, message) {
  p = Number(p); q = Number(q); e = Number(e);
  const n = p * q;
  const phiN = (p - 1) * (q - 1);
  const inv = modInverse(e, phiN);
  if (!inv.exists) return { ok: false, error: `e=${e} has no modular inverse modulo φ(n)=${phiN}.` };
  const d = inv.inverse;
  const chars = [...String(message)];
  const encoded = chars.map(ch => ch.charCodeAt(0));
  if (encoded.some(v => v >= n)) return { ok: false, error: 'Every character code must be smaller than n for this educational demo.' };
  const cipher = encoded.map(v => powMod(v, e, n).value);
  const decodedCodes = cipher.map(v => powMod(v, d, n).value);
  const decoded = decodedCodes.map(v => String.fromCharCode(v)).join('');
  return {
    ok: true, p, q, n, phiN, e, d, encoded, cipher, decodedCodes, decoded,
    trace: [
      `Choose primes p=${p}, q=${q}`,
      `n = p×q = ${n}`,
      `φ(n) = (p−1)(q−1) = ${phiN}`,
      `Find d ≡ e⁻¹ (mod φ(n)): d=${d}`,
      `Encrypt each symbol c = m^e mod n`,
      `Decrypt each symbol m = c^d mod n`,
      `Decoded message = “${decoded}”`
    ]
  };
}

function normalizeOp(op) {
  return op.replace(/\s+/g, '').replace(/¬/g, '!').replace(/∧/g, '&').replace(/∨/g, '|').replace(/→/g, '->').replace(/↔/g, '<->').replace(/~/g, '!');
}

export function tokenizeLogic(raw) {
  let s = normalizeOp(raw);
  const out = [];
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    if (rest.startsWith('<->')) { out.push('<->'); i += 3; continue; }
    if (rest.startsWith('->')) { out.push('->'); i += 2; continue; }
    const ch = s[i];
    if ('()!&|'.includes(ch)) { out.push(ch); i++; continue; }
    if (/[A-Za-z]/.test(ch)) { let j = i + 1; while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++; out.push(s.slice(i, j)); i = j; continue; }
    throw new Error(`Unexpected character “${ch}” in logic expression.`);
  }
  return out;
}

class LogicParser {
  constructor(tokens, env) { this.t = tokens; this.i = 0; this.env = env; }
  peek() { return this.t[this.i]; }
  eat(x) { if (this.peek() === x) { this.i++; return true; } return false; }
  parse() {
    const value = this.iff();
    if (this.i < this.t.length) throw new Error(`Unexpected token ${this.peek()}`);
    return value;
  }
  iff() { let v = this.imp(); while (this.eat('<->')) v = v === this.imp(); return v; }
  imp() { let v = this.or(); if (this.eat('->')) { const rhs = this.imp(); v = (!v) || rhs; } return v; }
  or() { let v = this.and(); while (this.eat('|')) { const rhs = this.and(); v = v || rhs; } return v; }
  and() { let v = this.not(); while (this.eat('&')) { const rhs = this.not(); v = v && rhs; } return v; }
  not() { if (this.eat('!')) return !this.not(); return this.atom(); }
  atom() {
    if (this.eat('(')) { const v = this.iff(); if (!this.eat(')')) throw new Error('Missing closing parenthesis.'); return v; }
    const key = this.peek();
    if (!key) throw new Error('Unexpected end of expression.');
    this.i++;
    if (!(key in this.env)) throw new Error(`Unknown proposition ${key}`);
    return Boolean(this.env[key]);
  }
}

export function evalLogic(expression, env) {
  return new LogicParser(tokenizeLogic(expression), env).parse();
}

export function logicVariables(...expressions) {
  const vars = new Set();
  for (const exp of expressions) {
    try {
      for (const tok of tokenizeLogic(exp)) if (/^[A-Za-z]/.test(tok)) vars.add(tok);
    } catch {}
  }
  return [...vars].sort();
}

export function truthTable(expression) {
  const vars = logicVariables(expression);
  if (vars.length > 8) throw new Error('Use at most 8 propositions for a truth table.');
  const rows = [];
  for (let mask = 0; mask < (1 << vars.length); mask++) {
    const env = {};
    vars.forEach((v, i) => { env[v] = Boolean((mask >> (vars.length - i - 1)) & 1); });
    rows.push({ ...env, result: evalLogic(expression, env) });
  }
  return { vars, rows };
}

export function cnfDnf(expression) {
  const { vars, rows } = truthTable(expression);
  const termsTrue = rows.filter(r => r.result).map(r => `(${vars.map(v => r[v] ? v : `¬${v}`).join(' ∧ ')})`);
  const termsFalse = rows.filter(r => !r.result).map(r => `(${vars.map(v => r[v] ? `¬${v}` : v).join(' ∨ ')})`);
  return {
    dnf: termsTrue.length ? termsTrue.join(' ∨ ') : 'FALSE',
    cnf: termsFalse.length ? termsFalse.join(' ∧ ') : 'TRUE'
  };
}

export function implicationValid(premises, conclusion) {
  const exprs = [...premises.filter(Boolean), conclusion].join('|');
  const vars = logicVariables(...premises, conclusion);
  const rows = [];
  let valid = true;
  for (let mask = 0; mask < (1 << vars.length); mask++) {
    const env = {};
    vars.forEach((v, i) => env[v] = Boolean((mask >> (vars.length - i - 1)) & 1));
    const ps = premises.filter(Boolean).map(p => evalLogic(p, env));
    const c = evalLogic(conclusion, env);
    const violation = ps.every(Boolean) && !c;
    if (violation) valid = false;
    rows.push({ ...env, premisesTrue: ps.every(Boolean), conclusion: c, violation });
  }
  return { valid, rows, exprs };
}

function matrixFromRelation(set, pairs) {
  return set.map(a => set.map(b => pairs.some(([x,y]) => String(x) === String(a) && String(y) === String(b)) ? 1 : 0));
}

export function parseRelation(input) {
  const pairs = [];
  const re = /\(\s*([^,]+?)\s*,\s*([^\)]+?)\s*\)/g;
  let m;
  while ((m = re.exec(input)) !== null) pairs.push([m[1].trim(), m[2].trim()]);
  return pairs;
}

export function relationAnalysis(setInput, relationInput) {
  const set = parseSet(setInput);
  const pairs = parseRelation(relationInput);
  const m = matrixFromRelation(set, pairs);
  const n = set.length;
  let reflexive = true, symmetric = true, antisymmetric = true, transitive = true;
  for (let i=0;i<n;i++) if (!m[i][i]) reflexive = false;
  for (let i=0;i<n;i++) for (let j=0;j<n;j++) {
    if (m[i][j] !== m[j][i]) symmetric = false;
    if (i !== j && m[i][j] && m[j][i]) antisymmetric = false;
    for (let k=0;k<n;k++) if (m[i][j] && m[j][k] && !m[i][k]) transitive = false;
  }
  const closure = m.map(r=>[...r]);
  const trace = [];
  for (let k=0;k<n;k++) {
    for (let i=0;i<n;i++) for (let j=0;j<n;j++) closure[i][j] = closure[i][j] || (closure[i][k] && closure[k][j]) ? 1 : 0;
    trace.push({ k: k+1, via: set[k], matrix: closure.map(r=>[...r]) });
  }
  const equivalence = reflexive && symmetric && transitive;
  const classes = equivalence ? equivalenceClasses(set, pairs) : [];
  return { set, pairs, matrix:m, closure, trace, properties:{reflexive,symmetric,antisymmetric,transitive,equivalence}, classes };
}

export function equivalenceClasses(set, pairs) {
  const out = [];
  const seen = new Set();
  for (const a of set) {
    if (seen.has(a)) continue;
    const c = set.filter(b => pairs.some(([x,y]) => String(x)===String(a) && String(y)===String(b)));
    c.forEach(x=>seen.add(x));
    if (!c.length) { c.push(a); seen.add(a); }
    out.push(c);
  }
  return out;
}

function relationDivides(a,b) {
  const na = Number(a), nb = Number(b);
  return Number.isFinite(na) && Number.isFinite(nb) && nb % na === 0;
}

export function hasseDivisibility(setInput) {
  let set = parseSet(setInput).sort((a,b)=>Number(a)-Number(b));
  const nodes = set.map((value, i) => ({ id:String(value), value:String(value), i }));
  const edges = [];
  for (const a of set) for (const b of set) {
    if (a === b || !relationDivides(a,b)) continue;
    let cover = true;
    for (const c of set) {
      if (c===a || c===b) continue;
      if (relationDivides(a,c) && relationDivides(c,b)) { cover = false; break; }
    }
    if (cover) edges.push([String(a),String(b)]);
  }
  return { nodes, edges };
}

export function posetAnalysis(setInput) {
  const { nodes, edges } = hasseDivisibility(setInput);
  const values = nodes.map(n=>n.value);
  const comparable = (a,b) => a===b || relationDivides(a,b) || relationDivides(b,a);
  const minimal = values.filter(a => !values.some(b => b!==a && relationDivides(b,a)));
  const maximal = values.filter(a => !values.some(b => b!==a && relationDivides(a,b)));
  const least = values.find(a => values.every(b => relationDivides(a,b))) ?? null;
  const greatest = values.find(a => values.every(b => relationDivides(b,a))) ?? null;
  let lattice = true;
  const joins = [], meets = [];
  for (const a of values) for (const b of values) {
    const uppers = values.filter(x => relationDivides(a,x) && relationDivides(b,x));
    const lowers = values.filter(x => relationDivides(x,a) && relationDivides(x,b));
    const lubs = uppers.filter(x => uppers.every(y => !relationDivides(y,x) || x===y));
    const glbs = lowers.filter(x => lowers.every(y => !relationDivides(x,y) || x===y));
    if (lubs.length !== 1 || glbs.length !== 1) lattice = false;
    if (lubs.length===1) joins.push({a,b,value:lubs[0]});
    if (glbs.length===1) meets.push({a,b,value:glbs[0]});
  }
  // For divisibility order, meet is gcd and join is lcm when the values lie in the set.
  return { nodes, edges, minimal, maximal, least, greatest, lattice, joins, meets, comparable };
}

export function parseMapping(input) {
  return input.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean).map(pair=> {
    const m = pair.match(/^(.+?)\s*(?:->|→)\s*(.+)$/);
    return m ? [m[1].trim(), m[2].trim()] : null;
  }).filter(Boolean);
}

export function functionAnalysis(domainInput, codomainInput, mappingInput) {
  const domain = parseSet(domainInput), codomain = parseSet(codomainInput), mapping = parseMapping(mappingInput);
  const map = new Map(mapping);
  const values = domain.map(x => map.get(x));
  const validFunction = domain.every(x=>map.has(x)) && values.every(v=>codomain.includes(v));
  const injective = validFunction && new Set(values).size === values.length;
  const surjective = validFunction && codomain.every(y=>values.includes(y));
  return { domain,codomain,mapping,validFunction,injective,surjective,bijective:injective&&surjective };
}

export function composeMappings(first, second) {
  const f = new Map(first), g = new Map(second); const result=[];
  for (const [x,y] of f.entries()) if (g.has(y)) result.push([x,g.get(y)]);
  return result;
}

export function hammingEncode4(data) {
  const bits = String(data).replace(/[^01]/g,'').padStart(4,'0').slice(-4).split('').map(Number);
  const [d1,d2,d3,d4] = bits;
  const p1 = d1 ^ d2 ^ d4;
  const p2 = d1 ^ d3 ^ d4;
  const p4 = d2 ^ d3 ^ d4;
  return [p1,d1,p2,d2,p4,d3,d4];
}

export function hammingDecode7(bitsInput) {
  const bits = String(bitsInput).replace(/[^01]/g,'').padStart(7,'0').slice(-7).split('').map(Number);
  const [b1,b2,b3,b4,b5,b6,b7] = bits;
  const s1 = b1 ^ b2 ^ b4 ^ b5 ^ b7;
  const s2 = b3 ^ b2 ^ b4 ^ b6 ^ b7;
  const s4 = b5 ^ b4 ^ b6 ^ b7;
  const errorPos = s1*1 + s2*2 + s4*4;
  const corrected = [...bits];
  if (errorPos >= 1 && errorPos <= 7) corrected[errorPos-1] ^= 1;
  const data = [corrected[1],corrected[3],corrected[5],corrected[6]].join('');
  return { bits, syndrome:`${s4}${s2}${s1}`, errorPos, corrected, data };
}

export function operationTable(size, op) {
  const table=[];
  for (let a=0;a<size;a++) {
    const row=[];
    for(let b=0;b<size;b++) row.push(op==='add' ? (a+b)%size : (a*b)%size);
    table.push(row);
  }
  return table;
}

export function algebraAnalysis(sizeInput, operation='add') {
  const size=Math.max(1,Math.min(12,Math.floor(Number(sizeInput))));
  const table=operationTable(size,operation), elems=[...Array(size).keys()].map(String);
  const closure=true;
  let associative=true, identity=null, inverses=[], commutative=true;
  for(let a=0;a<size;a++) for(let b=0;b<size;b++) {
    if(table[a][b]!==table[b][a]) commutative=false;
    for(let c=0;c<size;c++) if(table[table[a][b]][c]!==table[a][table[b][c]]) associative=false;
  }
  for(let e=0;e<size;e++) if(elems.every((_,a)=>table[e][a]===a && table[a][e]===a)) identity=e;
  if(identity!==null) for(let a=0;a<size;a++) { const inv=elems.find((_,b)=>table[a][b]===identity && table[b][a]===identity); if(inv!==undefined) inverses.push([a,inv]); }
  const monoid=closure&&associative&&identity!==null, group=monoid&&inverses.length===size;
  const generators=[];
  if(operation==='add') {
    for(let g=0;g<size;g++) { const generated=new Set([0]); let cur=0; for(let i=0;i<size;i++){cur=(cur+g)%size;generated.add(cur);} if(generated.size===size) generators.push(g); }
  } else if(group && identity===1%size) {
    for(let g=0;g<size;g++){const generated=new Set([1%size]);let cur=1%size;for(let i=0;i<size;i++){cur=(cur*g)%size;generated.add(cur);}if(generated.size===size)generators.push(g);}
  }
  return {size,operation,table,associative,identity,inverses,commutative,monoid,group,generators,cyclic:generators.length>0};
}

export function hamiltonianPath(graph) {
  const n=graph.nodes.length, ids=graph.nodes.map(n=>n.id), adj=new Map(ids.map(id=>[id,new Set()]));
  graph.edges.forEach(([a,b])=>{adj.get(a).add(b); if(!graph.directed) adj.get(b).add(a);});
  if(n===0) return [];
  function backtrack(path, used){ if(path.length===n) return path; const last=path[path.length-1]; for(const next of adj.get(last)||[]){ if(!used.has(next)){used.add(next);path.push(next);const r=backtrack(path,used);if(r)return r;path.pop();used.delete(next);} } return null; }
  for(const s of ids){const r=backtrack([s],new Set([s])); if(r) return r;}
  return [];
}

export function eulerTrail(graph) {
  const nodes=graph.nodes.map(n=>n.id); const adj=new Map(nodes.map(id=>[id,[]]));
  for(const [a,b] of graph.edges){adj.get(a).push(b); if(!graph.directed)adj.get(b).push(a);}
  const degrees=nodes.map(id=>adj.get(id).length); const odd=nodes.filter((_,i)=>degrees[i]%2);
  if(graph.directed) return {trail:[],possible:false,reason:'Euler directed trail conditions are simplified in this teaching implementation.'};
  if(!([0,2].includes(odd.length))) return {trail:[],possible:false,reason:`There are ${odd.length} odd-degree vertices; an Euler trail requires 0 or 2.`};
  const start=odd[0]||nodes.find(id=>adj.get(id).length>0); if(!start) return {trail:[],possible:true};
  const work=new Map(nodes.map(id=>[id,[...adj.get(id)]]));
  const stack=[start], circuit=[];
  while(stack.length){const v=stack[stack.length-1]; if(work.get(v).length){const u=work.get(v).pop(); if(!work.has(u)) work.set(u,[]); const idx=work.get(u).indexOf(v); if(idx>=0) work.get(u).splice(idx,1); stack.push(u);} else circuit.push(stack.pop());}
  const trail=circuit.reverse(); const edgeCount=graph.edges.length;
  return {trail,possible:trail.length===edgeCount+1,reason:trail.length===edgeCount+1?'Euler trail found.':'Graph is disconnected or the traversal could not consume all edges.',odd};
}

export function isomorphic(graphA, graphB) {
  const nA=graphA.nodes.length,nB=graphB.nodes.length, directed=!!graphA.directed;
  if(nA!==nB || graphA.edges.length!==graphB.edges.length || nA>8) return {isomorphic:false,mapping:null,reason:nA!==nB?'Different vertex counts.':nA>8?'Brute-force mode is limited to 8 vertices.':'Different edge counts.'};
  const aIds=graphA.nodes.map(n=>n.id), bIds=graphB.nodes.map(n=>n.id);
  const deg=g=>{const m=new Map(g.nodes.map(n=>[n.id,0]));g.edges.forEach(([a,b])=>{m.set(a,m.get(a)+1);m.set(b,m.get(b)+1);});return m;};
  const da=deg(graphA),db=deg(graphB);
  if([...da.values()].sort((x,y)=>x-y).join(',')!==[...db.values()].sort((x,y)=>x-y).join(',')) return {isomorphic:false,mapping:null,reason:'Degree sequences differ.'};
  const has=(g,a,b)=>g.edges.some(([x,y])=>(x===a&&y===b)||(!directed&&x===b&&y===a));
  function permute(arr,l=0){
    if(l===arr.length){ const m=new Map(aIds.map((id,i)=>[id,arr[i]])); for(const a of aIds) for(const b of aIds) if(has(graphA,a,b)!==has(graphB,m.get(a),m.get(b))) return null; return m; }
    for(let i=l;i<arr.length;i++){[arr[l],arr[i]]=[arr[i],arr[l]];const r=permute(arr,l+1);if(r)return r;[arr[l],arr[i]]=[arr[i],arr[l]];} return null;
  }
  const m=permute([...bIds]);
  return {isomorphic:!!m,mapping:m?[...m.entries()]:null,reason:m?'A structure-preserving vertex mapping was found.':'No structure-preserving mapping found.'};
}

export function graphPlanarityNotes(graph) {
  const n=graph.nodes.length,e=graph.edges.length;
  const edgeBound = n>=3 ? e<=3*n-6 : true;
  const completeK5 = n===5 && e===10;
  const bipartite = graph.nodes.length>=2 && false;
  return {n,e,edgeBound,warning:completeK5?'K₅ has been detected; it is a classic non-planar graph.':edgeBound?'No immediate Euler-edge-count obstruction was found.':'For a simple planar graph with n≥3, m≤3n−6 is necessary; this graph exceeds it.', disclaimer:'Full planarity testing is a deeper graph algorithm; this UI combines Euler’s necessary bound with visual crossing analysis and classic-obstruction warnings.'};
}

export function inducedSubgraph(graph, selectedIds) {
  const set=new Set(selectedIds); return {nodes:graph.nodes.filter(n=>set.has(n.id)),edges:graph.edges.filter(([a,b])=>set.has(a)&&set.has(b)),directed:graph.directed};
}
