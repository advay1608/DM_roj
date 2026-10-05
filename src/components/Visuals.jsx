import React from 'react';

export function SectionHeader({eyebrow, title, description, accent='cyan'}) {
  return <div className={`section-head accent-${accent}`}>
    <div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}
  </div>;
}

export function ResultCard({label, value, tone='default', sub}) {
  return <div className={`result-card ${tone}`}><div className="result-label">{label}</div><div className="result-value">{value}</div>{sub&&<div className="result-sub">{sub}</div>}</div>;
}

export function Matrix({matrix, labels=[], highlight=false}) {
  if (!matrix?.length) return <div className="empty-visual">No matrix yet.</div>;
  return <div className="matrix-wrap"><table className="matrix"><tbody>
    {matrix.map((row,i)=><tr key={i}>{labels[i] !== undefined && <th>{labels[i]}</th>}{row.map((v,j)=><td key={j} className={highlight && v ? 'lit':''}>{v}</td>)}</tr>)}
  </tbody></table></div>;
}

export function TruthTable({table, vars}) {
  if (!table?.length) return null;
  return <div className="table-scroll"><table className="truth-table"><thead><tr>{vars.map(v=><th key={v}>{v}</th>)}<th>Result</th></tr></thead><tbody>{table.map((r,i)=><tr key={i}>{vars.map(v=><td key={v}><span className={r[v]?'bool true':'bool false'}>{r[v]?'T':'F'}</span></td>)}<td><span className={r.result?'bool true':'bool false'}>{r.result?'T':'F'}</span></td></tr>)}</tbody></table></div>;
}

export function Trace({items=[], title='ALGORITHM TRACE'}) {
  return <div className="trace-card"><div className="trace-title"><span className="trace-dot"/>{title}<span className="trace-live">LIVE</span></div>
    <div className="trace-list">{items.length ? items.map((x,i)=><div className="trace-row" key={i}><span>{String(i+1).padStart(2,'0')}</span><code>{typeof x === 'string' ? x : JSON.stringify(x)}</code></div>) : <div className="trace-empty">Run an operation to stream its steps here.</div>}</div>
  </div>;
}

export function HasseDiagram({nodes=[], edges=[]}) {
  if(!nodes.length) return <div className="empty-visual">Enter a set to build a Hasse diagram.</div>;
  const sorted=[...nodes].sort((a,b)=>Number(a.value)-Number(b.value));
  const levels=[];
  sorted.forEach(n=>{let rank=0;for(const [a,b] of edges){if(b===n.id){const p=sorted.find(x=>x.id===a);if(p)rank=Math.max(rank,(p.rank??0)+1)}}n.rank=rank;levels[rank]??=[];levels[rank].push(n)});
  const width=760,height=Math.max(280,levels.length*110+60);
  const pos={};
  levels.forEach((level,r)=>level.forEach((n,i)=>{pos[n.id]={x:(i+1)*width/(level.length+1),y:height-55-r*100};}));
  return <div className="svg-frame"><svg viewBox={`0 0 ${width} ${height}`} className="structure-svg">
    <defs><marker id="arrowHasse" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="currentColor"/></marker></defs>
    {edges.map(([a,b],i)=><line key={i} x1={pos[a].x} y1={pos[a].y} x2={pos[b].x} y2={pos[b].y} className="edge-line" markerEnd="url(#arrowHasse)"/>)}
    {nodes.map(n=><g key={n.id}><circle cx={pos[n.id].x} cy={pos[n.id].y} r="22" className="node-circle"/><text x={pos[n.id].x} y={pos[n.id].y+5} textAnchor="middle" className="node-text">{n.value}</text></g>)}
  </svg></div>;
}

export function RelationDigraph({set=[],pairs=[]}) {
  if(!set.length) return <div className="empty-visual">Enter a finite set and relation pairs.</div>;
  const n=set.length, cx=320,cy=220,r=140;
  const pos={};set.forEach((v,i)=>{const a=(-Math.PI/2)+(i/n)*Math.PI*2;pos[v]={x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}});
  return <div className="svg-frame"><svg viewBox="0 0 640 440" className="structure-svg">
    <defs><marker id="arrowRel" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="currentColor"/></marker></defs>
    {pairs.map(([a,b],i)=>{
      const A=pos[a],B=pos[b]; if(!A||!B)return null;
      const same=a===b;
      if(same) return <path key={i} d={`M ${A.x-4} ${A.y-20} C ${A.x-40} ${A.y-70}, ${A.x+40} ${A.y-70}, ${A.x+4} ${A.y-20}`} className="edge-line" markerEnd="url(#arrowRel)"/>;
      return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="edge-line" markerEnd="url(#arrowRel)"/>;
    })}
    {set.map(v=><g key={v}><circle cx={pos[v].x} cy={pos[v].y} r="25" className="node-circle"/><text x={pos[v].x} y={pos[v].y+5} textAnchor="middle" className="node-text">{v}</text></g>)}
  </svg></div>;
}

export function FunctionMap({domain=[],codomain=[],mapping=[]}) {
  const W=720,H=Math.max(320,Math.max(domain.length,codomain.length)*72+40);
  const posA={};const posB={};
  domain.forEach((v,i)=>posA[v]={x:120,y:50+i*72}); codomain.forEach((v,i)=>posB[v]={x:600,y:50+i*72});
  return <div className="svg-frame"><svg viewBox={`0 0 ${W} ${H}`} className="structure-svg">
    <defs><marker id="arrowFn" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor"/></marker></defs>
    {mapping.map(([a,b],i)=>posA[a]&&posB[b]?<line key={i} x1={posA[a].x+18} y1={posA[a].y} x2={posB[b].x-18} y2={posB[b].y} className="edge-line" markerEnd="url(#arrowFn)"/>:null)}
    {domain.map(v=><g key={v}><circle cx={posA[v].x} cy={posA[v].y} r="20" className="node-circle"/><text x={posA[v].x} y={posA[v].y+5} textAnchor="middle" className="node-text">{v}</text></g>)}
    {codomain.map(v=><g key={v}><circle cx={posB[v].x} cy={posB[v].y} r="20" className="node-circle"/><text x={posB[v].x} y={posB[v].y+5} textAnchor="middle" className="node-text">{v}</text></g>)}
    <text x="120" y="22" textAnchor="middle" className="svg-label">DOMAIN</text><text x="600" y="22" textAnchor="middle" className="svg-label">CODOMAIN</text>
  </svg></div>;
}

export function CayleyTable({table,opSymbol='⊕'}) {
  if(!table?.length) return null;
  return <div className="table-scroll"><table className="cayley"><thead><tr><th>{opSymbol}</th>{table[0].map((_,i)=><th key={i}>{i}</th>)}</tr></thead><tbody>{table.map((row,i)=><tr key={i}><th>{i}</th>{row.map((v,j)=><td key={j}>{v}</td>)}</tr>)}</tbody></table></div>;
}

export function Tag({children,tone='cyan'}) { return <span className={`tag ${tone}`}>{children}</span>; }

export function Toggle({checked,onChange,label}) { return <button className={`toggle ${checked?'on':''}`} onClick={()=>onChange(!checked)} aria-label={label}><span/></button>; }
