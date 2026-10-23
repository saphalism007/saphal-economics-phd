import{r as o,j as e}from"./react-CI6SGl1L.js";import{u as $,P as B,I as l,n as D,aI as L,g as I,o as E,z as P,aJ as S,M as z,p as R,O,aK as F}from"./index-DLOpr-K_.js";import{S as Q}from"./Mastery-D5xxhWJx.js";import{M as H}from"./Md-BoHh2lWx.js";import{a as W}from"./curriculum-CJe0LaJR.js";const J=["Inbox","Lectures","Microeconomics","Macroeconomics","Econometrics","Mathematics","Papers","Research ideas","Nepal economy","Applications","Teaching","Journal"],A=[{id:"blank",title:"Blank note",book:"Inbox",blurb:"A clean page.",body:""},{id:"cornell",title:"Lecture notes (Cornell method)",book:"Lectures",blurb:"Notes, cue questions and a summary: the format that makes revision easy.",tags:["lecture"],body:`### Course and date
Course:
Lecture:

### Notes
-

### Cue questions
Write one question per main idea. Cover the notes and answer them when you revise.
-

### Key equations
$$ $$

### Summary in three sentences
1.
2.
3.
`},{id:"paper",title:"Paper summary",book:"Papers",blurb:"Question, design, data, results, critique and ideas, the way referees read.",tags:["paper"],body:`### Citation
Authors (year). Title. Journal.

### Question
What causal or descriptive question does the paper answer?

### Why it matters

### Identification or model
What variation identifies the effect? What is the key assumption?

### Data

### Main results
-

### Robustness and threats
-

### My critique
-

### Ideas for my own research (Nepal angle)
-
`},{id:"idea",title:"Research idea",book:"Research ideas",blurb:"Turn a hunch into a question, a design and a first step.",tags:["idea"],body:`### Question in one sentence

### Why it matters (for Nepal and for the literature)

### Closest papers
- [[potential-outcomes]]

### Data I could use

### Identification strategy
Source of variation:
Key assumption:
How I would test it:

### Biggest risk

### Next step this week
- [ ]
`},{id:"derivation",title:"Derivation practice",book:"Mathematics",blurb:"Write a derivation from memory, then check it.",tags:["derivation"],body:`### What I am deriving

### Assumptions
-

### Steps (from memory)
1. $$ $$
2. $$ $$

### Where I got stuck

### Checked against the derivation book: correct / corrected
`},{id:"graph",title:"Graph explanation",book:"Microeconomics",blurb:"Explain a graph in words as an examiner would expect.",tags:["graph"],body:`### Graph
Axes:
Curves:
Equilibrium:

### The shock

### What moves and why
1.
2.

### Welfare and policy conclusion
`},{id:"meeting",title:"Meeting with a supervisor",book:"Research ideas",blurb:"Agenda, advice and actions.",tags:["meeting"],body:`### With / date

### Agenda
-

### Advice received
-

### Actions and deadlines
- [ ]
`},{id:"application",title:"Programme research",book:"Applications",blurb:"Everything about one programme on one page.",tags:["application"],body:`### Programme

### Funding (with official link and date checked)

### Deadline and requirements

### Faculty who fit my interests
-

### Why this programme, in two sentences

### Questions to ask current students
-
`},{id:"teach",title:"Teach it back",book:"Teaching",blurb:"Explain a topic as if teaching a first year class: the fastest test of understanding.",tags:["teaching"],body:`### Topic

### The one idea students must leave with

### A real example from Nepal

### The graph or equation

### Two questions to check understanding
1.
2.

### A common misconception and how to correct it
`},{id:"journal",title:"Daily reflection",book:"Journal",blurb:"Five minutes at the end of the day.",tags:["journal"],body:`### What I learned today

### What confused me

### What I will do first tomorrow

### One thing I am grateful for
`}],K=s=>s.trim()?s.trim().split(/\s+/).length:0,U=s=>[...new Set([...s.matchAll(/\[\[([a-z0-9-]+)(\|[^\]]*)?\]\]/g)].map(i=>i[1]))].filter(i=>W[i]),q=s=>{var i;return s.title||((i=s.body.split(`
`).find(u=>u.trim()&&!u.startsWith("#")))==null?void 0:i.slice(0,60))||"Untitled"},Y=[{label:"B",before:"**",after:"**",title:"Bold"},{label:"H",before:`
### `,title:"Heading"},{label:"List",before:`
- `,title:"Bullet list"},{label:"1.",before:`
1. `,title:"Numbered list"},{label:"x",before:"$",after:"$",title:"Inline maths"},{label:"Eq",before:`
$$ `,after:` $$
`,title:"Display equation"},{label:"Topic",before:"[[",after:"]]",title:"Link a topic by id, for example [[solow]]"},{label:"Table",before:`
| Column | Column |
| --- | --- |
| | |
`,title:"Table"},{label:"Note",before:`
> `,title:"Callout"}];function G({note:s}){const[i,u]=o.useState(s.title),[n,g]=o.useState(s.body),[v,c]=o.useState(s.tags.join(", ")),[h,d]=o.useState(()=>Date.now()-s.created<1e4||!s.body?window.innerWidth>900?"split":"write":"read"),j=o.useRef(null),x=o.useRef(void 0),w=$(a=>a.notes),f=o.useMemo(()=>[...new Set([...J,...w.map(a=>a.book)])],[w]),m=o.useRef(null),p=()=>{m.current&&(S(s.id,m.current),m.current=null)},b=a=>{m.current={...m.current||{},...a},window.clearTimeout(x.current),x.current=window.setTimeout(p,500)};o.useEffect(()=>()=>{window.clearTimeout(x.current),p()},[]);const C=(a,r="")=>{const y=j.current;if(!y)return;const k=y.selectionStart,T=y.selectionEnd,M=n.slice(0,k)+a+n.slice(k,T)+r+n.slice(T);g(M),b({body:M}),requestAnimationFrame(()=>{y.focus(),y.selectionStart=y.selectionEnd=k+a.length+(T-k)})},N=U(n),t=()=>E((i||"note").replace(/[^\w ]+/g,"").trim().replace(/\s+/g,"-")+".md",`# ${i||"Untitled"}

${n}
`,"text/markdown");return e.jsxs("div",{children:[e.jsxs("div",{className:"row between",style:{marginBottom:10,flexWrap:"wrap",gap:8},children:[e.jsxs("a",{className:"btn small ghost",href:"#/notes",onClick:p,children:[e.jsx(l,{name:"back",size:14}),"All notes"]}),e.jsx(P,{label:"Mode",value:h,onChange:d,options:[{v:"write",label:"Write"},{v:"split",label:"Write and preview"},{v:"read",label:"Read"}]})]}),e.jsx("input",{className:"input note-title",value:i,placeholder:"Title","aria-label":"Title",onChange:a=>{u(a.target.value),b({title:a.target.value})}}),e.jsxs("div",{className:"row tight",style:{margin:"8px 0",flexWrap:"wrap"},children:[e.jsx("select",{className:"input compact",style:{width:"auto"},value:s.book,"aria-label":"Notebook",onChange:a=>S(s.id,{book:a.target.value}),children:f.map(a=>e.jsx("option",{children:a},a))}),e.jsx("input",{className:"input compact",style:{flex:"1 1 200px"},value:v,placeholder:"Tags, separated by commas","aria-label":"Tags",onChange:a=>{c(a.target.value),b({tags:a.target.value.split(",").map(r=>r.trim().toLowerCase()).filter(Boolean)})}}),e.jsxs("button",{className:"btn small"+(s.pinned?" good":""),onClick:()=>S(s.id,{pinned:!s.pinned}),children:[e.jsx(l,{name:"star",size:14}),s.pinned?"Pinned":"Pin"]})]}),e.jsxs("div",{className:"note-editor "+h,children:[h!=="read"&&e.jsxs("div",{className:"note-write",children:[e.jsx("div",{className:"note-toolbar",role:"toolbar","aria-label":"Formatting",children:Y.map(a=>e.jsx("button",{type:"button",className:"btn small",title:a.title,onMouseDown:r=>r.preventDefault(),onClick:()=>C(a.before,a.after),children:a.label},a.label))}),e.jsx("textarea",{ref:j,className:"input note-body",value:n,onChange:a=>{g(a.target.value),b({body:a.target.value})},placeholder:"Write here. Maths with $x^2$ or $$\\frac{a}{b}$$, links to topics with [[solow]], lists with -, headings with ###."})]}),h!=="write"&&e.jsx("div",{className:"note-read card flat",children:n.trim()?e.jsx(H,{src:n}):e.jsx("p",{className:"muted",children:"Nothing written yet."})})]}),N.length>0&&e.jsxs("div",{className:"chips",style:{marginTop:10},children:[e.jsx("span",{className:"tiny muted",children:"Linked topics:"}),N.map(a=>e.jsx("a",{className:"badge outline",href:"#/learn/"+a,children:W[a].title},a))]}),e.jsxs("div",{className:"row between",style:{marginTop:12,flexWrap:"wrap",gap:8},children:[e.jsxs("span",{className:"tiny muted",children:[K(n)," words. Saved automatically",s.from?e.jsxs(e.Fragment,{children:[". Captured from ",e.jsx("a",{href:"#"+s.from,children:s.from})]}):null,"."]}),e.jsxs("span",{className:"row tight",children:[e.jsxs("button",{className:"btn small",onClick:()=>{p(),z({front:i||q(s),back:n,deck:"Notes"}),R("Added to review cards")},children:[e.jsx(l,{name:"cards",size:14}),"Make a review card"]}),e.jsxs("button",{className:"btn small",onClick:t,children:[e.jsx(l,{name:"download",size:14}),"Export"]}),e.jsx(O,{label:e.jsxs(e.Fragment,{children:[e.jsx(l,{name:"trash",size:14}),"Delete"]}),confirm:"Delete this note?",onYes:()=>{F(s.id),I("/notes",!0)}})]})]})]})}function te({id:s}){const i=$(t=>t.notes),u=$(t=>t.topics),n=o.useMemo(()=>Object.entries(u).filter(([,t])=>{var a;return(a=t.notes)==null?void 0:a.trim()}),[u]),[g,v]=o.useState(""),[c,h]=o.useState(""),[d,j]=o.useState(""),[x,w]=o.useState(!1),f=s?i.find(t=>t.id===s):void 0,m=o.useMemo(()=>{const t=g.toLowerCase().split(/\s+/).filter(Boolean);return i.filter(a=>(!c||a.book===c)&&(!d||a.tags.includes(d))&&t.every(r=>(a.title+" "+a.body+" "+a.tags.join(" ")).toLowerCase().includes(r))).sort((a,r)=>+!!r.pinned-+!!a.pinned||r.updated-a.updated)},[i,g,c,d]);if(s&&f)return e.jsx(G,{note:f},f.id);if(s&&!f)return e.jsxs("div",{className:"empty",children:[e.jsx("h3",{children:"Note not found"}),e.jsx("a",{href:"#/notes",children:"All notes"})]});const p=[...new Set(i.map(t=>t.book))],b=[...new Set(i.flatMap(t=>t.tags))].sort(),C=(t=A[0])=>{const a=L({title:t.id==="blank"?"":t.title,body:t.body,book:t.book,tags:t.tags||[]});I("/notes/"+a)},N=()=>E("saphal-notes.md",i.map(t=>`# ${t.title||"Untitled"}

Notebook: ${t.book}. Tags: ${t.tags.join(", ")||"none"}. Updated ${new Date(t.updated).toISOString().slice(0,10)}.

${t.body}
`).join(`
---

`),"text/markdown");return e.jsxs("div",{children:[e.jsx(B,{eyebrow:"Workbench",title:"Notebook",lede:"Lecture notes, paper summaries, derivations, research ideas and reflections, with maths and links to topics. Saved on this device and included in your backup file.",actions:e.jsxs("button",{className:"btn primary",onClick:()=>w(!x),children:[e.jsx(l,{name:"plus",size:16}),"New note"]})}),x&&e.jsx("div",{className:"grid g3 stagger",style:{marginBottom:16},children:A.map(t=>e.jsxs("button",{className:"card link-card template-pick",onClick:()=>C(t),children:[e.jsx("span",{className:"card-title",children:t.title}),e.jsx("span",{className:"small muted",children:t.blurb})]},t.id))}),e.jsx("div",{className:"filter-bar",children:e.jsx(Q,{value:g,onChange:v,placeholder:"Search notes"})}),(p.length>1||b.length>0)&&e.jsxs("div",{className:"chips",style:{margin:"10px 0"},children:[e.jsxs("button",{className:"chip","aria-pressed":!c&&!d,onClick:()=>{h(""),j("")},children:["All ",i.length]}),p.map(t=>e.jsx("button",{className:"chip","aria-pressed":c===t,onClick:()=>h(c===t?"":t),children:t},t)),b.map(t=>e.jsxs("button",{className:"chip","aria-pressed":d===t,onClick:()=>j(d===t?"":t),children:["#",t]},t))]}),i.length===0?e.jsxs("div",{className:"empty",children:[e.jsx(l,{name:"edit",size:28}),e.jsx("h3",{children:"Your notebook is empty"}),e.jsx("p",{children:"Start with a template: lecture notes in the Cornell format, a paper summary, or a research idea. The Note button at the bottom of every page captures a thought without leaving what you are reading."}),e.jsx("button",{className:"btn primary",onClick:()=>w(!0),children:"Choose a template"})]}):e.jsxs("div",{className:"grid g2 top stagger",style:{marginTop:12},children:[m.map(t=>e.jsxs("a",{className:"card link-card note-card",href:"#/notes/"+t.id,children:[e.jsxs("div",{className:"row between",children:[e.jsx("span",{className:"card-title",style:{margin:0},children:q(t)}),t.pinned&&e.jsx(l,{name:"star",size:14})]}),e.jsxs("span",{className:"tiny muted",children:[t.book,", ",D(t.updated),t.tags.length?", #"+t.tags.join(" #"):""]}),e.jsx("p",{className:"small muted clamp2",style:{margin:"6px 0 0"},children:t.body.replace(/[#*$>[\]|`-]/g," ").replace(/\s+/g," ").slice(0,180)||"Empty note"})]},t.id)),!m.length&&e.jsx("p",{className:"muted",children:"No note matches."})]}),n.length>0&&e.jsxs("section",{style:{marginTop:20},children:[e.jsx("h2",{className:"section-title",children:"Notes inside encyclopedia topics"}),e.jsx("div",{className:"chips",children:n.map(([t])=>{var a;return e.jsx("a",{className:"badge outline",href:"#/learn/"+t,children:((a=W[t])==null?void 0:a.title)||t},t)})})]}),i.length>0&&e.jsxs("div",{className:"row tight",style:{marginTop:18},children:[e.jsxs("button",{className:"btn small",onClick:N,children:[e.jsx(l,{name:"download",size:14}),"Export all notes as Markdown"]}),e.jsx("span",{className:"tiny muted",children:"Markdown opens in Obsidian, Notion, Typora or any text editor."})]})]})}export{te as default};
