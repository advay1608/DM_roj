import React, {useMemo, useState} from 'react';
import {
  algebraAnalysis, cnfDnf, composeMappings, eulerTrail, extendedGcd, factorize, functionAnalysis,
  gcd, graphPlanarityNotes, hammingDecode7, hammingEncode4, hasseDivisibility, hamiltonianPath,
  inducedSubgraph, implicationValid, isomorphic, mod, modInverse, parseMapping, phi, posetAnalysis,
  powMod, relationAnalysis, rsaDemo, sieve, truthTable
} from './algorithms';
import { CayleyTable, FunctionMap, HasseDiagram, Matrix, RelationDigraph, ResultCard, SectionHeader, Tag, Trace, TruthTable, Toggle } from './components/Visuals';

const NAV = [
  ['home','⌂','Mission Control','Overview of the lab'],
  ['logic','∴','Logic Lab','Propositions & inference'],
  ['number','◈','Number Theory','Crypto & modular arithmetic'],
  ['relations','⇄','Relations','Relations & digraphs'],
  ['posets','◇','Posets & Lattices','Orders & Hasse diagrams'],
  ['functions','ƒ','Functions','Mappings & pigeonhole'],
  ['graphs','⬡','Graph Lab','Create & analyze graphs'],
  ['algebra','⊕','Algebra','Groups & Cayley tables'],
  ['coding','⌁','Error Control','Hamming (7,4)'],
];

export function App(){
  const [page,setPage]=useState('home');
  const [dark,setDark]=useState(true);
  const current=NAV.find(n=>n[0]===page)||NAV[0];
  return <div className={dark?'app dark':'app light'}>
    <div className="noise" />
    <aside className="sidebar">
      <div className="brand" onClick={()=>setPage('home')}>
        <div className="brand-mark"><span>∿</span><span>◈</span><span>∿</span></div>
        <div><div className="brand-name">CRYPTOSPHERE</div><div className="brand-sub">DISCRETE MATH LAB</div></div>
      </div>
      <div className="system-status"><span className="pulse"/>SYSTEM ONLINE <span>v1.0</span></div>
      <nav>{NAV.map(([id,icon,label,sub])=><button key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>setPage(id)}>
        <span className="nav-icon">{icon}</span><span className="nav-copy"><strong>{label}</strong><small>{sub}</small></span>{page===id&&<span className="nav-arrow">›</span>}
      </button>)}</nav>
      <div className="sidebar-foot"><div>FY • CSBS</div><div>DM MINI PROJECT</div></div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div><div className="crumb">WORKBENCH / <span>{current[2].toUpperCase()}</span></div><h1>{current[2]}</h1></div>
        <div className="top-actions"><button className="ghost-btn" onClick={()=>setDark(!dark)}>{dark?'☼':'☾'} {dark?'LIGHT':'DARK'}</button><div className="avatar">DM</div></div>
      </header>
      <div className="page-body">
        {page==='home' && <Dashboard setPage={setPage}/>} 
        {page==='logic' && <LogicLab/>}
        {page==='number' && <NumberLab/>}
        {page==='relations' && <RelationsLab/>}
        {page==='posets' && <PosetsLab/>}
        {page==='functions' && <FunctionsLab/>}
        {page==='graphs' && <GraphLab/>}
        {page==='algebra' && <AlgebraLab/>}
        {page==='coding' && <CodingLab/>}
      </div>
    </main>
  </div>
}

function Dashboard({setPage}){
  const cards=[
    ['logic','01','Logic','Truth tables, equivalence, implication & inference','∴'],
    ['number','02','Number Theory','GCD, primes, modular arithmetic & RSA','◈'],
    ['relations','03','Relations','Digraphs, matrices, closures & Warshall','⇄'],
    ['posets','04','Posets & Lattices','Hasse diagrams, bounds & lattice checks','◇'],
    ['functions','05','Functions','Mappings, injective/surjective & pigeonhole','ƒ'],
    ['graphs','06','Graph Theory','Create graphs, Euler/Hamiltonian & isomorphism','⬡'],
    ['algebra','07','Algebraic Structures','Semigroup → group → cyclic structure','⊕'],
    ['coding','08','Error Control','Hamming encoding, syndrome & correction','⌁'],
  ];
  return <>
    <section className="hero">
      <div className="hero-grid"/>
      <div className="hero-copy"><div className="eyebrow">INTERACTIVE MATHEMATICAL OPERATING SYSTEM</div><h2>Where discrete mathematics<br/><em>becomes executable.</em></h2><p>Build structures. Run algorithms. Watch the mathematics happen step by step.</p>
        <div className="hero-actions"><button className="primary-btn" onClick={()=>setPage('graphs')}>OPEN GRAPH WORKBENCH <span>↗</span></button><button className="secondary-btn" onClick={()=>setPage('number')}>RUN RSA DEMO</button></div>
      </div>
      <div className="hero-orbit"><div className="orbit o1"/><div className="orbit o2"/><div className="orbit-core">DM<br/><span>ENGINE</span></div><div className="orbit-node n1">∴</div><div className="orbit-node n2">◈</div><div className="orbit-node n3">⬡</div><div className="orbit-node n4">⊕</div></div>
    </section>
    <div className="stats-row"><ResultCard label="WORKBENCHES" value="08" sub="full syllabus coverage"/><ResultCard label="CORE ALGORITHMS" value="30+" sub="pure JS implementations"/><ResultCard label="VISUAL STRUCTURES" value="07" sub="SVG + interactive editors"/><ResultCard label="OFFLINE READY" value="100%" sub="no server required"/></div>
    <SectionHeader eyebrow="THE LAB" title="Choose your mathematical system" description="Every module follows INPUT → REPRESENTATION → ALGORITHM TRACE → RESULT."/>
    <div className="module-grid">{cards.map(c=><button className="module-card" key={c[0]} onClick={()=>setPage(c[0])}><div className="module-num">{c[1]}</div><div className="module-symbol">{c[4]}</div><div className="module-title">{c[2]}</div><div className="module-sub">{c[3]}</div><div className="module-open">OPEN WORKBENCH <span>→</span></div></button>)}</div>
    <section className="principle-band"><div><div className="eyebrow">DESIGN PRINCIPLE</div><h3>The answer is never enough.</h3><p>Cryptosphere exposes the representation and algorithm trace behind every result, so the work can be defended in a viva—not just displayed.</p></div><div className="flow-mini"><span>INPUT</span><i>→</i><span>MODEL</span><i>→</i><span>ALGORITHM</span><i>→</i><span>TRACE</span><i>→</i><span>RESULT</span></div></section>
  </>
}

function LabShell({children, title, eyebrow, desc, trace=[]}){
  return <><SectionHeader eyebrow={eyebrow} title={title} description={desc}/>{children}{trace?.length>0 && <div className="wide-trace"><Trace items={trace}/></div>}</>;
}

function LogicLab(){
  const [expr,setExpr]=useState('(P → Q) ∧ P'); const [expr2,setExpr2]=useState('P ∧ Q'); const [prem,setPrem]=useState('P → Q; P'); const [conc,setConc]=useState('Q');
  const table=useMemo(()=>{try{return truthTable(expr)}catch(e){return null}},[expr]);
  const forms=useMemo(()=>{try{return cnfDnf(expr)}catch{return null}},[expr]);
  const equiv=useMemo(()=>{try{const a=truthTable(expr).rows.map(r=>r.result);const b=truthTable(expr2).rows.map(r=>r.result);return a.length===b.length&&a.every((v,i)=>v===b[i])}catch{return null}},[expr,expr2]);
  const inf=useMemo(()=>{try{return implicationValid(prem.split(';').map(x=>x.trim()).filter(Boolean),conc)}catch{return null}},[prem,conc]);
  return <LabShell eyebrow="01 / LOGIC ENGINE" title="Logic Lab" desc="Parse propositional formulas, generate truth tables, derive normal forms and validate inference.">
    <div className="two-col">
      <Panel title="PROPOSITION WORKBENCH" kicker="TRUTH TABLE + NORMAL FORM">
        <Field label="Expression"><input value={expr} onChange={e=>setExpr(e.target.value)} placeholder="(P → Q) ∧ P"/><div className="hint">Use P, Q, R… and operators ∧ ∨ ¬ → ↔ or & | ! -&gt; &lt;-&gt;</div></Field>
        {table ? <><div className="sub-grid"><ResultCard label="VARIABLES" value={table.vars.join(', ')||'—'}/><ResultCard label="ROWS" value={table.rows.length}/><ResultCard label="TAUTOLOGY" value={table.rows.every(r=>r.result)?'YES':'NO'} tone={table.rows.every(r=>r.result)?'good':'default'}/></div><TruthTable table={table.rows} vars={table.vars}/></> : <div className="error-box">Invalid expression. Check parentheses/operators.</div>}
        {forms&&<div className="formula-panel"><div><span>CNF</span><code>{forms.cnf}</code></div><div><span>DNF</span><code>{forms.dnf}</code></div></div>}
      </Panel>
      <Panel title="EQUIVALENCE CHECKER" kicker="COMPARE TWO PROPOSITIONS">
        <Field label="Formula A"><input value={expr} readOnly/></Field><Field label="Formula B"><input value={expr2} onChange={e=>setExpr2(e.target.value)}/></Field>
        <div className={`verdict ${equiv?'good':'bad'}`}><strong>{equiv===null?'—':equiv?'LOGICALLY EQUIVALENT ✓':'NOT EQUIVALENT ✕'}</strong><span>Same truth value for every assignment of the variables.</span></div>
        <div className="logic-gates"><span>¬ NOT</span><span>∧ AND</span><span>∨ OR</span><span>→ IMPLIES</span><span>↔ IFF</span></div>
      </Panel>
    </div>
    <div className="two-col">
      <Panel title="INFERENCE ENGINE" kicker="PREMISES → CONCLUSION">
        <Field label="Premises (separate with ;)"><input value={prem} onChange={e=>setPrem(e.target.value)}/></Field><Field label="Conclusion"><input value={conc} onChange={e=>setConc(e.target.value)}/></Field>
        {inf&&<><div className={`verdict ${inf.valid?'good':'bad'}`}><strong>{inf.valid?'VALID INFERENCE ✓':'INVALID INFERENCE ✕'}</strong><span>{inf.valid?'No valuation makes all premises true while the conclusion is false.':'A counterexample valuation exists.'}</span></div><div className="table-scroll"><table className="truth-table"><thead><tr>{logicVars(inf.rows[0]||{}).map(v=><th key={v}>{v}</th>)}<th>PREMISES</th><th>CONCLUSION</th><th>COUNTEREXAMPLE</th></tr></thead><tbody>{inf.rows.map((r,i)=><tr key={i}>{logicVars(r).map(v=><td key={v}>{r[v]?'T':'F'}</td>)}<td>{r.premisesTrue?'T':'F'}</td><td>{r.conclusion?'T':'F'}</td><td>{r.violation?'YES':''}</td></tr>)}</tbody></table></div></>}
      </Panel>
      <Panel title="PREDICATES + INDUCTION" kicker="SYLLABUS COMPANION">
        <div className="concept-demo"><div className="concept-symbol">∀x∈D, P(x)</div><p>Finite-domain quantifier mode is represented as a proof-friendly evaluator: test the predicate for every member (∀) or at least one member (∃).</p><div className="quant-row"><Tag>∀ FOR ALL</Tag><Tag tone="purple">∃ EXISTS</Tag><Tag tone="green">INDUCTION</Tag></div></div>
        <div className="induction"><div className="step"><b>01</b><span>Base case</span><small>Prove P(1).</small></div><div className="step"><b>02</b><span>Inductive hypothesis</span><small>Assume P(k).</small></div><div className="step"><b>03</b><span>Inductive step</span><small>Show P(k+1).</small></div></div>
      </Panel>
    </div>
  </LabShell>
}
function logicVars(row){return Object.keys(row).filter(k=>!['premisesTrue','conclusion','violation'].includes(k));}

function NumberLab(){
  const [a,setA]=useState('252'),[b,setB]=useState('105'),[primeLimit,setPrimeLimit]=useState('50');
  const [p,setP]=useState('61'),[q,setQ]=useState('53'),[e,setE]=useState('17'),[msg,setMsg]=useState('HELLO');
  const g=useMemo(()=>gcd(a,b),[a,b]), eg=useMemo(()=>extendedGcd(a,b),[a,b]); const inv=useMemo(()=>modInverse(a||1,b||1),[a,b]); const fs=useMemo(()=>factorize(a),[a]); const ph=useMemo(()=>phi(a),[a]);
  const primes=useMemo(()=>sieve(primeLimit),[primeLimit]); const rsa=useMemo(()=>rsaDemo(p,q,e,msg),[p,q,e,msg]);
  return <LabShell eyebrow="02 / ARITHMETIC ENGINE" title="Number Theory" desc="Turn divisibility, primes and modular arithmetic into a working cryptographic pipeline.">
    <div className="three-col">
      <Panel title="EUCLIDEAN ALGORITHM" kicker="GCD + EXTENDED EUCLID"><div className="field-row"><Field label="a"><input type="number" value={a} onChange={e=>setA(e.target.value)}/></Field><Field label="b"><input type="number" value={b} onChange={e=>setB(e.target.value)}/></Field></div><div className="sub-grid"><ResultCard label="GCD" value={g.value}/><ResultCard label="BEZOUT x" value={eg.x}/><ResultCard label="BEZOUT y" value={eg.y}/></div><Trace items={g.trace}/></Panel>
      <Panel title="PRIME FORGE" kicker="SIEVE OF ERATOSTHENES"><Field label="Generate primes ≤ N"><input type="number" value={primeLimit} onChange={e=>setPrimeLimit(e.target.value)} min="2" max="500"/></Field><div className="prime-grid">{primes.primes.map(n=><span key={n} className="prime-chip">{n}</span>)}</div><div className="micro-trace">{primes.steps.slice(0,4).map((s,i)=><div key={i}>Cross out multiples of <b>{s.p}</b> → {s.crossed.slice(0,12).join(', ')}{s.crossed.length>12?'…':''}</div>)}</div></Panel>
      <Panel title="MODULAR LAB" kicker="INVERSE + Φ(n) + POWER"><Field label="Value"><input type="number" value={a} onChange={e=>setA(e.target.value)}/></Field><Field label="Modulus"><input type="number" value={b} onChange={e=>setB(e.target.value)}/></Field><div className="sub-grid"><ResultCard label="a mod n" value={b?mod(a,b):'—'}/><ResultCard label="φ(a)" value={ph}/><ResultCard label="a⁻¹ mod n" value={inv.exists?inv.inverse:'NONE'} tone={inv.exists?'good':'bad'}/></div><div className="factor-line"><span>PRIME FACTORIZATION</span><code>{fs.length?fs.join(' × '):'—'}</code></div></Panel>
    </div>
    <Panel title="RSA DEMONSTRATOR" kicker="APPLICATION OF NUMBER THEORY"><div className="rsa-grid"><div><div className="field-row three"><Field label="Prime p"><input type="number" value={p} onChange={e=>setP(e.target.value)}/></Field><Field label="Prime q"><input type="number" value={q} onChange={e=>setQ(e.target.value)}/></Field><Field label="Public exponent e"><input type="number" value={e} onChange={e=>setE(e.target.value)}/></Field></div><Field label="Message"><input value={msg} onChange={e=>setMsg(e.target.value)}/></Field>{rsa.ok?<div className="crypto-chain"><div><small>n = pq</small><b>{rsa.n}</b></div><i>→</i><div><small>φ(n)</small><b>{rsa.phiN}</b></div><i>→</i><div><small>private d</small><b>{rsa.d}</b></div></div>:<div className="error-box">{rsa.error}</div>}</div><div className="cipher-card"><span>PLAINTEXT</span><code>{rsa.ok?msg:'—'}</code><div className="cipher-arrow">↓ ENCRYPT</div><span>CIPHERTEXT</span><code>{rsa.ok?rsa.cipher.join(' '):'—'}</code><div className="cipher-arrow">↓ DECRYPT</div><span>RECOVERED</span><code>{rsa.ok?rsa.decoded:'—'}</code></div></div><Trace items={rsa.ok?rsa.trace:[]}/></Panel>
  </LabShell>
}

function RelationsLab(){
  const [set,setSet]=useState('1,2,3,4'); const [rel,setRel]=useState('(1,1),(1,2),(2,2),(2,3),(3,3)'); const r=useMemo(()=>relationAnalysis(set,rel),[set,rel]);
  return <LabShell eyebrow="03 / RELATION ENGINE" title="Relations & Digraphs" desc="Represent one relation as a pair set, matrix and directed graph—then run property checks and Warshall closure.">
    <Panel title="RELATION CONSTRUCTOR" kicker="SET → PAIRS → MATRIX → DIGRAPH"><div className="field-row"><Field label="Finite set"><input value={set} onChange={e=>setSet(e.target.value)}/></Field><Field label="Relation pairs"><input value={rel} onChange={e=>setRel(e.target.value)}/></Field></div><div className="property-grid">{[['REFLEXIVE',r.properties.reflexive],['SYMMETRIC',r.properties.symmetric],['ANTISYMMETRIC',r.properties.antisymmetric],['TRANSITIVE',r.properties.transitive],['EQUIVALENCE',r.properties.equivalence]].map(([k,v])=><div className={`property ${v?'pass':'fail'}`} key={k}><span>{v?'✓':'×'}</span>{k}</div>)}</div></Panel>
    <div className="two-col"><Panel title="RELATION MATRIX" kicker="ADJACENCY REPRESENTATION"><Matrix matrix={r.matrix} labels={r.set}/><div className="matrix-caption">Rows are source elements; columns are target elements.</div></Panel><Panel title="DIGRAPH" kicker="VISUAL REPRESENTATION"><RelationDigraph set={r.set} pairs={r.pairs}/></Panel></div>
    <div className="two-col"><Panel title="WARSHALL CLOSURE" kicker="R₀ → R₁ → … → Rₙ"><Matrix matrix={r.closure} labels={r.set} highlight/><div className="closure-steps">{r.trace.map((s,i)=><div key={i}><b>K={s.k}</b><span>Allow paths through {s.via}</span><em>{s.matrix.flat().filter(Boolean).length} reachable pairs</em></div>)}</div></Panel><Panel title="EQUIVALENCE CLASSES" kicker="ONLY WHEN R IS EQUIVALENCE"><div className="class-cloud">{r.classes.length?r.classes.map((c,i)=><div className="eq-class" key={i}><span>[{c[0]}]</span>{c.map(v=><b key={v}>{v}</b>)}</div>):<div className="empty-visual">Relation is not an equivalence relation yet.</div>}</div></Panel></div>
  </LabShell>
}

function PosetsLab(){
  const [set,setSet]=useState('1,2,3,6,12'); const p=useMemo(()=>posetAnalysis(set),[set]); const h=useMemo(()=>hasseDivisibility(set),[set]);
  return <LabShell eyebrow="04 / ORDER ENGINE" title="Posets & Lattices" desc="Generate a Hasse diagram from the divisibility partial order and inspect minimal/maximal elements and lattice structure.">
    <Panel title="HASSE GENERATOR" kicker="DIVISIBILITY ORDER"><Field label="Finite set of positive integers"><input value={set} onChange={e=>setSet(e.target.value)}/><div className="hint">Example: {`{1,2,3,6,12}`}</div></Field><div className="poset-stats"><ResultCard label="MINIMAL" value={p.minimal.join(', ')||'—'}/><ResultCard label="MAXIMAL" value={p.maximal.join(', ')||'—'}/><ResultCard label="LEAST" value={p.least??'NONE'}/><ResultCard label="GREATEST" value={p.greatest??'NONE'}/><ResultCard label="LATTICE" value={p.lattice?'YES':'NO'} tone={p.lattice?'good':'bad'}/></div></Panel>
    <div className="two-col"><Panel title="HASSE DIAGRAM" kicker="COVER RELATIONS ONLY"><HasseDiagram nodes={h.nodes} edges={h.edges}/></Panel><Panel title="ORDER ANALYSIS" kicker="LUB / GLB"><div className="bound-list"><div><span>LOWEST-LEVEL ELEMENTS</span><b>{p.minimal.join(' • ')||'—'}</b></div><div><span>HIGHEST-LEVEL ELEMENTS</span><b>{p.maximal.join(' • ')||'—'}</b></div><div><span>JOIN (LUB)</span><b>{p.lattice?'Every pair has a unique join.':'Not defined for every pair.'}</b></div><div><span>MEET (GLB)</span><b>{p.lattice?'Every pair has a unique meet.':'Not defined for every pair.'}</b></div></div><div className="lattice-badges"><Tag tone={p.lattice?'green':'red'}>{p.lattice?'LATTICE ✓':'NOT A LATTICE'}</Tag><Tag>PARTIAL ORDER</Tag><Tag tone="purple">HASSE</Tag></div></Panel></div>
  </LabShell>
}

function FunctionsLab(){
  const [domain,setDomain]=useState('1,2,3'); const [codomain,setCodomain]=useState('a,b,c,d'); const [mapping,setMapping]=useState('1->a, 2->b, 3->c'); const f=useMemo(()=>functionAnalysis(domain,codomain,mapping),[domain,codomain,mapping]);
  const [dom2,setDom2]=useState('a,b,c,d'),[cod2,setCod2]=useState('x,y'),[map2,setMap2]=useState('a->x,b->y,c->x,d->y'); const comp=useMemo(()=>composeMappings(parseMapping(mapping),parseMapping(map2)),[mapping,map2]);
  const [objects,setObjects]=useState(10),[boxes,setBoxes]=useState(7);
  return <LabShell eyebrow="05 / FUNCTION ENGINE" title="Functions" desc="Build domain-to-codomain mappings, classify them, compose them and experiment with the Pigeonhole Principle.">
    <Panel title="FUNCTION VISUALIZER" kicker="DOMAIN → CODOMAIN"><div className="field-row three"><Field label="Domain"><input value={domain} onChange={e=>setDomain(e.target.value)}/></Field><Field label="Codomain"><input value={codomain} onChange={e=>setCodomain(e.target.value)}/></Field><Field label="Mapping"><input value={mapping} onChange={e=>setMapping(e.target.value)}/></Field></div><div className="property-grid"><div className={`property ${f.validFunction?'pass':'fail'}`}><span>{f.validFunction?'✓':'×'}</span>VALID FUNCTION</div><div className={`property ${f.injective?'pass':'fail'}`}><span>{f.injective?'✓':'×'}</span>INJECTIVE</div><div className={`property ${f.surjective?'pass':'fail'}`}><span>{f.surjective?'✓':'×'}</span>SURJECTIVE</div><div className={`property ${f.bijective?'pass':'fail'}`}><span>{f.bijective?'✓':'×'}</span>BIJECTIVE</div></div><FunctionMap domain={f.domain} codomain={f.codomain} mapping={f.mapping}/></Panel>
    <div className="two-col"><Panel title="COMPOSITION" kicker="g ∘ f"><div className="field-row"><Field label="First mapping g/f"><input value={mapping} onChange={e=>setMapping(e.target.value)}/></Field><Field label="Second mapping"><input value={map2} onChange={e=>setMap2(e.target.value)}/></Field></div><div className="formula-panel"><div><span>COMPOSITE</span><code>{comp.map(([a,b])=>`${a} → ${b}`).join(', ')||'No compatible pairs'}</code></div></div></Panel><Panel title="PIGEONHOLE SIMULATOR" kicker="OBJECTS VS BOXES"><div className="pigeon-control"><Field label="Objects"><input type="number" min="1" value={objects} onChange={e=>setObjects(Number(e.target.value))}/></Field><Field label="Boxes"><input type="number" min="1" value={boxes} onChange={e=>setBoxes(Number(e.target.value))}/></Field></div><div className="pigeon-visual">{Array.from({length:Math.min(objects,30)},(_,i)=><span key={i} className={`dot ${i>=boxes?'collision':''}`}>{i+1}</span>)}</div><div className={`verdict ${objects>boxes?'good':'default'}`}><strong>{objects>boxes?'PIGEONHOLE GUARANTEE ✓':'NO GUARANTEE YET'}</strong><span>{objects>boxes?`At least one box contains at least 2 of the ${objects} objects.`:`Add more objects than boxes to trigger the principle.`}</span></div></Panel></div>
  </LabShell>
}

function GraphLab(){
  const initialA={nodes:[{id:'A',x:170,y:120},{id:'B',x:340,y:70},{id:'C',x:510,y:130},{id:'D',x:260,y:250},{id:'E',x:450,y:260}],edges:[['A','B'],['A','D'],['B','C'],['B','D'],['C','E'],['D','E']],directed:false};
  const initialB={nodes:[{id:'1',x:170,y:120},{id:'2',x:340,y:70},{id:'3',x:510,y:130},{id:'4',x:260,y:250},{id:'5',x:450,y:260}],edges:[['1','2'],['1','4'],['2','3'],['2','4'],['3','5'],['4','5']],directed:false};
  const [graph,setGraph]=useState(initialA); const [mode,setMode]=useState('move'); const [pending,setPending]=useState(null); const [selected,setSelected]=useState([]); const [graphB,setGraphB]=useState(initialB); const [start,setStart]=useState('A');
  const euler=useMemo(()=>eulerTrail(graph),[graph]); const ham=useMemo(()=>hamiltonianPath(graph),[graph]); const iso=useMemo(()=>isomorphic(graph,graphB),[graph,graphB]); const plan=useMemo(()=>graphPlanarityNotes(graph),[graph]); const sub=useMemo(()=>inducedSubgraph(graph,selected),[graph,selected]);
  const addNode=(x,y)=>{const id=String.fromCharCode(65+graph.nodes.length);setGraph(g=>({...g,nodes:[...g.nodes,{id,x,y}]}))};
  const nodeClick=id=>{if(mode==='connect'){if(pending===null)setPending(id);else if(pending!==id && !graph.edges.some(([a,b])=>(a===pending&&b===id)||(a===id&&b===pending))){setGraph(g=>({...g,edges:[...g.edges,[pending,id]]}));setPending(null)}else setPending(null)}else setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])};
  const moveNode=(id,x,y)=>setGraph(g=>({...g,nodes:g.nodes.map(n=>n.id===id?{...n,x,y}:n)}));
  return <LabShell eyebrow="06 / GRAPH STUDIO" title="Graph Lab" desc="Create graphs with the mouse, manipulate vertices and run Euler, Hamiltonian, isomorphism and subgraph analysis.">
    <div className="graph-toolbar"><button className={mode==='move'?'active-tool':''} onClick={()=>{setMode('move');setPending(null)}}>↖ MOVE / SELECT</button><button className={mode==='connect'?'active-tool':''} onClick={()=>{setMode('connect');setPending(null)}}>⛓ CONNECT</button><button onClick={()=>addNode(120+Math.random()*440,80+Math.random()*250)}>＋ ADD VERTEX</button><button onClick={()=>setGraph(initialA)}>↻ RESET</button><span className="toolbar-note">{mode==='connect'?(pending?`CONNECT FROM ${pending}`:'CLICK TWO VERTICES'): 'Click empty space to add a vertex in MOVE mode.'}</span></div>
    <div className="two-col graph-top"><Panel title="GRAPH CONSTRUCTOR" kicker={`${graph.nodes.length} VERTICES / ${graph.edges.length} EDGES`}><GraphCanvas graph={graph} mode={mode} pending={pending} selected={selected} onNodeClick={nodeClick} onBackgroundClick={p=>{if(mode==='move')addNode(p.x,p.y)}} onMoveNode={moveNode}/></Panel><Panel title="LIVE ANALYSIS" kicker="STRUCTURAL PROPERTIES"><div className="sub-grid"><ResultCard label="VERTICES" value={graph.nodes.length}/><ResultCard label="EDGES" value={graph.edges.length}/><ResultCard label="ODD DEGREE" value={euler.odd?.length??'—'}/></div><div className={`verdict ${euler.possible?'good':'default'}`}><strong>EULER {euler.possible?'✓':'—'}</strong><span>{euler.reason}</span></div><div className={`verdict ${ham.length?'good':'default'}`}><strong>HAMILTONIAN {ham.length?'PATH FOUND ✓':'NO PATH FOUND'}</strong><span>{ham.length?ham.join(' → '):'Backtracking searched all starts for a simple Hamiltonian path.'}</span></div><div className={`verdict ${plan.edgeBound?'good':'bad'}`}><strong>PLANARITY SCREEN {plan.edgeBound?'PASS':'FAIL'}</strong><span>{plan.warning}</span></div></Panel></div>
    <div className="two-col"><Panel title="SUBGRAPH EXTRACTOR" kicker="INDUCED SUBGRAPH FROM SELECTED VERTICES"><div className="selection-row">{graph.nodes.map(n=><button key={n.id} className={selected.includes(n.id)?'selected-chip':''} onClick={()=>nodeClick(n.id)}>{n.id}</button>)}</div><div className="sub-caption">Selected: {selected.length?selected.join(', '):'none'}</div><MiniGraph graph={sub}/></Panel><Panel title="GRAPH ISOMORPHISM" kicker="BRUTE-FORCE MAPPING ≤ 8 VERTICES"><GraphCompare graphA={graph} graphB={graphB} onSwap={()=>setGraphB(g=>({...g,nodes:g.nodes.map((n,i)=>({...n,x:100+(i%3)*180,y:100+Math.floor(i/3)*130}))}))}/><div className={`verdict ${iso.isomorphic?'good':'bad'}`}><strong>{iso.isomorphic?'ISOMORPHIC ✓':'NOT ISOMORPHIC ✕'}</strong><span>{iso.reason}</span></div>{iso.mapping&&<div className="mapping-line">{iso.mapping.map(([a,b])=><span key={a}>{a} → {b}</span>)}</div>}</Panel></div>
  </LabShell>
}

function GraphCanvas({graph,mode,pending,selected,onNodeClick,onBackgroundClick,onMoveNode}){
  const drag=React.useRef(null);
  const [mouse,setMouse]=useState(null);
  const point=(evt)=>{const r=evt.currentTarget.getBoundingClientRect();return {x:(evt.clientX-r.left)/r.width*640,y:(evt.clientY-r.top)/r.height*380}};
  return <div className="graph-canvas"><svg viewBox="0 0 640 380" onMouseMove={e=>{setMouse(point(e));if(drag.current){const p=point(e);onMoveNode(drag.current.id,p.x,p.y)}}} onMouseUp={()=>drag.current=null} onClick={e=>{if(e.target.tagName==='svg'){const p=point(e);onBackgroundClick(p)}}}>
    <defs><marker id="arrowGraph" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor"/></marker></defs>
    {graph.edges.map(([a,b],i)=>{const A=graph.nodes.find(n=>n.id===a),B=graph.nodes.find(n=>n.id===b); if(!A||!B)return null;return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="graph-edge"/>})}
    {graph.nodes.map(n=><g key={n.id} onClick={e=>{e.stopPropagation();onNodeClick(n.id)}} onMouseDown={e=>{e.stopPropagation();if(mode==='move')drag.current=n}} className="graph-node"><circle cx={n.x} cy={n.y} r="25" className={`graph-node-circle ${pending===n.id?'pending':''} ${selected.includes(n.id)?'selected':''}`}/><text x={n.x} y={n.y+5}>{n.id}</text></g>)}
    <text x="20" y="25" className="canvas-hint">{mode==='connect'?'CONNECT MODE':'MOVE / SELECT MODE'}</text>
  </svg></div>
}
function MiniGraph({graph}){return <div className="mini-graph"><svg viewBox="0 0 500 250">{graph.edges.map(([a,b],i)=>{const A=graph.nodes.find(n=>n.id===a),B=graph.nodes.find(n=>n.id===b);return A&&B?<line key={i} x1={A.x*0.78} y1={A.y*0.55} x2={B.x*0.78} y2={B.y*0.55} className="graph-edge"/>:null})}{graph.nodes.map(n=><g key={n.id}><circle cx={n.x*0.78} cy={n.y*0.55} r="16" className="graph-node-circle"/><text x={n.x*0.78} y={n.y*0.55+5}>{n.id}</text></g>)}</svg></div>}
function GraphCompare({graphA,graphB,onSwap}){return <div className="compare-graphs"><div><span>G₁</span><MiniGraph graph={graphA}/></div><div className="compare-arrow">≅</div><div><span>G₂</span><MiniGraph graph={graphB}/></div><button className="small-btn" onClick={onSwap}>RERENDER G₂</button></div>}

function AlgebraLab(){
  const [size,setSize]=useState(3),[op,setOp]=useState('add'); const a=useMemo(()=>algebraAnalysis(size,op),[size,op]);
  return <LabShell eyebrow="07 / STRUCTURE ENGINE" title="Algebraic Structures" desc="Generate Cayley tables and progressively test closure, associativity, identity, inverses, commutativity and cyclicity.">
    <Panel title="CAYLEY LAB" kicker="BINARY OPERATION → STRUCTURE"><div className="field-row"><Field label="Set = {0,1,…,n−1}"><input type="number" min="1" max="12" value={size} onChange={e=>setSize(Number(e.target.value))}/></Field><Field label="Operation"><select value={op} onChange={e=>setOp(e.target.value)}><option value="add">Addition mod n</option><option value="mul">Multiplication mod n</option></select></Field></div><CayleyTable table={a.table} opSymbol={op==='add'?'⊕':'⊗'}/><div className="property-grid"><div className="property pass"><span>✓</span>CLOSURE</div><div className={`property ${a.associative?'pass':'fail'}`}><span>{a.associative?'✓':'×'}</span>ASSOCIATIVE</div><div className={`property ${a.identity!==null?'pass':'fail'}`}><span>{a.identity!==null?'✓':'×'}</span>IDENTITY {a.identity!==null?`(${a.identity})`:''}</div><div className={`property ${a.group?'pass':'fail'}`}><span>{a.group?'✓':'×'}</span>GROUP</div><div className={`property ${a.cyclic?'pass':'fail'}`}><span>{a.cyclic?'✓':'×'}</span>CYCLIC</div></div></Panel>
    <div className="two-col"><Panel title="STRUCTURE LADDER" kicker="WHAT PROPERTIES HAVE BEEN PROVEN?"><div className="ladder">{[['BINARY OPERATION',true],['SEMIGROUP',a.associative],['MONOID',a.monoid],['GROUP',a.group],['CYCLIC GROUP',a.cyclic]].map(([name,ok],i)=><div className={ok?'ladder-step on':'ladder-step'} key={name}><span>{String(i+1).padStart(2,'0')}</span><b>{name}</b><i>{ok?'✓':'—'}</i></div>)}</div></Panel><Panel title="INVERSES & GENERATORS" kicker="STRUCTURAL WITNESS"><div className="bound-list"><div><span>IDENTITY</span><b>{a.identity??'none'}</b></div><div><span>INVERSE PAIRS</span><b>{a.inverses.map(([x,y])=>`${x}↔${y}`).join(' · ')||'none'}</b></div><div><span>GENERATORS</span><b>{a.generators.join(', ')||'none'}</b></div></div></Panel></div>
  </LabShell>
}

function CodingLab(){
  const [data,setData]=useState('1011'); const [channel,setChannel]=useState(''); const [flipped,setFlipped]=useState(null); const encoded=useMemo(()=>hammingEncode4(data),[data]); const tx=flipped===null?encoded.map(String).join(''):(()=>{const a=[...encoded];if(flipped>=0)a[flipped]^=1;return a.join('')})(); const dec=useMemo(()=>hammingDecode7(channel||tx),[channel,tx]);
  const inject=i=>{setFlipped(flipped===i?null:i)};
  return <LabShell eyebrow="08 / ERROR CONTROL" title="Hamming Code" desc="Encode four data bits, inject a single-bit error and let the syndrome locate and correct it.">
    <div className="two-col"><Panel title="ENCODER" kicker="HAMMING (7,4)"><Field label="4-bit data"><input value={data} onChange={e=>setData(e.target.value.replace(/[^01]/g,'').slice(0,4))}/></Field><div className="bit-row">{encoded.map((b,i)=><button key={i} className={i%2===0?'parity-bit':''} onClick={()=>inject(i)}><small>{[1,2,4].includes(i+1)?`P${i+1}`:`D${i+1}`}</small><b>{b}</b></button>)}</div><div className="error-box info">Click any transmitted bit to flip it. Parity bits are P1/P2/P4.</div></Panel><Panel title="DECODER" kicker="SYNDROME → CORRECTION"><Field label="Received 7-bit word (editable)"><input value={channel||tx} onChange={e=>setChannel(e.target.value.replace(/[^01]/g,'').slice(0,7))}/></Field><div className="sub-grid"><ResultCard label="SYNDROME" value={dec.syndrome}/><ResultCard label="ERROR POSITION" value={dec.errorPos||'NONE'} tone={dec.errorPos?'bad':'good'}/><ResultCard label="RECOVERED DATA" value={dec.data}/></div><div className="correction-strip">{dec.corrected.map((b,i)=><span key={i} className={dec.errorPos===i+1?'corrected-bit':''}>{b}</span>)}</div><div className="verdict good"><strong>{dec.errorPos?`ERROR AT POSITION ${dec.errorPos} → CORRECTED ✓`:'NO ERROR DETECTED ✓'}</strong><span>Syndrome = S4S2S1 = {dec.syndrome} in binary.</span></div></Panel></div>
    <Panel title="MINIMUM DISTANCE" kicker="CODING-THEORY LINK"><div className="distance-band"><div><b>dₘᵢₙ = 3</b><span>Hamming (7,4) can detect up to 2 bit errors and correct 1 bit error.</span></div><div className="codeword">{encoded.join('')}</div><div className="codeword muted">{dec.corrected.join('')}</div></div></Panel>
  </LabShell>
}

function Panel({title,kicker,children}){return <section className="panel"><div className="panel-head"><div><div className="panel-kicker">{kicker}</div><h3>{title}</h3></div><span className="panel-index">◌</span></div>{children}</section>}
function Field({label,children}){return <label className="field"><span>{label}</span>{children}</label>}
