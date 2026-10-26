import {lessons, groups, extraQuestions} from './lessons.js';
import {challenges} from './challenges.js';
import {assessments,assessmentQuestions,assessmentVersion,evaluatePretest,urgentOrder,cram,sprintQuestionIds} from './assessment.js';

const KEY='ict-study-room-v1';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={
 home:'<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
 book:'<path d="M3 4h7l2 2 2-2h7v15h-7l-2 2-2-2H3z"/><path d="M12 6v15"/>',
 route:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h9a4 4 0 0 1 0 8H8a3 3 0 0 0 0 6h9"/>',
 code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
 flag:'<path d="M5 21V3m0 1h14l-3 4 3 4H5"/>',
 review:'<path d="M3 11a9 9 0 1 1 3 7M3 4v7h7"/><path d="M12 7v5l3 2"/>',
 arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 back:'<path d="M20 12H5m6-6-6 6 6 6"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 network:'<rect x="8" y="2" width="8" height="6" rx="1"/><path d="M12 8v5M4 17v-4h16v4"/><rect x="1" y="17" width="6" height="5" rx="1"/><rect x="9" y="17" width="6" height="5" rx="1"/><rect x="17" y="17" width="6" height="5" rx="1"/>',
 spark:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/>',
 grid:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/>',
 settings:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="white"/><circle cx="15" cy="17" r="3" fill="white"/>',
 play:'<path d="m8 4 12 8-12 8z"/>',
 stop:'<rect x="5" y="5" width="14" height="14" rx="1"/>',
 bulb:'<path d="M8 15a7 7 0 1 1 8 0l-1 3H9zM9 22h6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v.1"/>',
 target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
 shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6z"/><path d="m8 12 3 3 5-6"/>',
 cloud:'<path d="M6 18a5 5 0 1 1 1-10 6 6 0 0 1 11-1 5.5 5.5 0 0 1 0 11z"/>',
 save:'<path d="M4 3h13l4 4v14H3V3zM7 3v6h10V3M7 21v-8h10v8"/>'
};
const icon=(name,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.book}</svg>`;
const inline=text=>escapeHtml(text).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
function rich(text){
 const parts=String(text).split(/```(?:[\w+-]*)\n([\s\S]*?)```/g);
 return parts.map((part,i)=>i%2?`<pre class="lesson-code"><code>${escapeHtml(part.trimEnd())}</code></pre>`:inline(part).replace(/\n\n/g,'<br><br>').replace(/\n/g,'<br>')).join('');
}
let storageAvailable=true;
function fresh(){return {version:1,path:'rapid',lastLesson:'N1',lastCode:'sum-range',lessons:{},answers:{},drafts:{},mastered:{},codes:{},codePassed:{},codeAttempts:{},exams:{},pretests:{},notes:{},font:15};}
function load(){
 try {
  const data=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!data||data.version!==1) return fresh();
  const state={...fresh(),...data};
  for(const key of ['lessons','answers','drafts','mastered','codes','codePassed','codeAttempts','exams','pretests','notes']) if(!state[key]||typeof state[key]!=='object'||Array.isArray(state[key])) state[key]={};
  state.font=Math.min(18,Math.max(14,Number(state.font)||15));
  state.path=state.path==='full'?'full':'rapid';
  return state;
 }catch{return fresh();}
}
const state=load();
let saveTimer;
function save(){
 try {localStorage.setItem(KEY,JSON.stringify(state));}
 catch {storageAvailable=false;showToast('พื้นที่บันทึกไม่พร้อมใช้งาน กดสำรองความคืบหน้าเก็บไว้ได้');}
}
function lazySave(){clearTimeout(saveTimer);saveTimer=setTimeout(save,300);}
window.addEventListener('beforeunload',save);
let toastTimer;
function showToast(message){const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3300);}
let imported;
try {const response=await fetch('./data/questions.json');if(!response.ok)throw Error(response.status);imported=await response.json();}
catch {$('#app').innerHTML='<main class="boot"><h1>เปิดข้อมูลบทเรียนไม่สำเร็จ</h1><p>เปิดเว็บผ่าน start.py หรือไฟล์ เปิดเว็บติว.command แล้วลองใหม่</p><button onclick="location.reload()">ลองอีกครั้ง</button></main>';throw Error('Could not load local course data');}
const questions=new Map([...imported,...extraQuestions,...assessmentQuestions].map(q=>[q.id,q]));
for(const lesson of lessons){lesson.basicQuiz=[...lesson.quiz];lesson.quiz=assessments[lesson.id].post.map(q=>q.id);}
const lessonMap=new Map(lessons.map(l=>[l.id,l]));
const challengeMap=new Map(challenges.map(c=>[c.id,c]));
const domainNames={network:'Network / Security',programming:'Programming',data:'Data / AI',productivity:'ICT / Productivity'};
const domainLesson={network:'N1',programming:'F2',data:'D1',productivity:'T1'};
let current={};
let roadmapFilter='all';
let timerInterval;
let currentRun=null;
let codeResults={};
const countDone=()=>lessons.filter(l=>state.lessons[l.id]?.completed).length;
const wrongQuestions=()=>[...questions.values()].filter(q=>state.answers[q.id]&&!state.answers[q.id].correct&&!(q.phase==='pre'&&state.lessons[q.lesson]?.completionMethod==='study'&&assessments[q.lesson].post.every(p=>state.mastered[p.id])));
const pathLessons=()=>state.path==='full'?lessons:urgentOrder.map(id=>lessonMap.get(id));
function nextLesson(){const path=pathLessons();const last=path.find(l=>l.id===state.lastLesson&&!state.lessons[l.id]?.completed&&(state.pretests[l.id]?.startedAt||state.pretests[l.id]?.mode||state.lessons[l.id]?.read?.length));return last||path.find(l=>!state.lessons[l.id]?.completed)||path[0];}
function getLessonState(id){if(!state.lessons[id]||!Array.isArray(state.lessons[id].read))state.lessons[id]={read:[],completed:false};return state.lessons[id];}
function requiredSteps(lesson){const record=state.pretests[lesson.id];if(record?.submittedAt&&record.mode==='focus'){const focus=evaluatePretest(lesson.id,record.answers,record.uncertain).reviewSteps;if(focus.length)return focus;}return lesson.steps.map((_,i)=>i);}
function requirements(lesson){const ls=getLessonState(lesson.id);return [requiredSteps(lesson).every(i=>ls.read.includes(i)),lesson.quiz.every(id=>state.mastered[id]),state.path==='rapid'||!lesson.challenge||!!state.codePassed[lesson.challenge]];}
function lessonProgress(lesson){const ls=getLessonState(lesson.id);if(ls.completed)return 100;const steps=requiredSteps(lesson),hasCode=lesson.challenge&&state.path==='full';const total=steps.length+lesson.quiz.length+(hasCode?1:0);const value=steps.filter(i=>ls.read.includes(i)).length+lesson.quiz.filter(id=>state.mastered[id]).length+(hasCode&&state.codePassed[lesson.challenge]?1:0);return Math.min(100,Math.round(value/total*100));}
function nav(route){const hash='#/'+route.replace(/^\/+/, '');if(location.hash===hash)render();else location.hash=hash;}
const routeAttr=route=>`data-route="${escapeHtml(route)}"`;
function parseRoute(){const [path,query='']=location.hash.replace(/^#\/?/,'').split('?');const pieces=(path||'home').split('/');return {page:pieces[0],id:pieces[1],params:new URLSearchParams(query)};}

function shell(content,active='home',crumb='ภาพรวม'){
 const done=countDone(),pct=Math.round(done/lessons.length*100),wrong=wrongQuestions().length;
 const navs=[['home','home','ภาพรวม'],['learn','route','เส้นทางการเรียน'],['lab','code','ห้องเขียนโค้ด'],['practice','flag','สนามซ้อม'],['review','review','ทบทวนข้อผิด']];
 return `<div class="shell"><aside class="sidebar" id="sidebar"><div class="brand"><span class="brand-mark">{ }</span><div><div class="brand-title">ICT Study Room</div><div class="brand-sub">LEARN. TRY. UNDERSTAND.</div></div></div><div class="side-label">ห้องเรียนของคุณ</div><nav aria-label="เมนูหลัก">${navs.map(([route,name,label])=>`<button class="nav-link ${active===route?'active':''}" ${routeAttr(route)} ${active===route?'aria-current="page"':''}>${icon(name)}<span>${label}</span>${route==='review'&&wrong?`<span class="nav-count">${wrong}</span>`:''}</button>`).join('')}</nav><div class="side-label">ในเส้นทางนี้</div><div class="side-course">${groups.slice(0,5).map(g=>`<button data-filter-nav="${g.id}">${g.name}</button>`).join('')}</div><div class="sidebar-bottom"><div class="row between small"><strong>ค่อย ๆ เก่งขึ้น</strong><span class="muted">${done}/${lessons.length} บท</span></div><div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${pct}%"></div></div><div class="save-indicator"><i></i>${storageAvailable?'บันทึกอัตโนมัติบนเครื่องนี้':'การบันทึกไม่พร้อมใช้งาน'}</div><button class="text-link" data-action="sources" style="margin-top:18px;font-size:11px">${icon('info')} เกี่ยวกับเนื้อหาและแหล่งข้อมูล</button></div></aside><div class="mobile-overlay" data-action="close-menu"></div><div class="workspace"><header class="topbar"><div class="row"><button class="round-icon menu-button" data-action="menu" aria-label="เปิดเมนู" aria-expanded="false">${icon('menu')}</button><div class="breadcrumb">ห้องเรียน <span>/</span> ${escapeHtml(crumb)}</div></div><div class="top-actions"><span class="top-pill">ICT CHALLENGE · 2026</span><button class="round-icon font-control" data-action="font" data-delta="-1" aria-label="ลดขนาดตัวอักษร">A−</button><button class="round-icon font-control" data-action="font" data-delta="1" aria-label="เพิ่มขนาดตัวอักษร">A+</button><button class="round-icon" data-action="settings" aria-label="จัดการความคืบหน้า">${icon('settings')}</button></div></header>${!storageAvailable?'<div class="storage-warning">เบราว์เซอร์ไม่อนุญาตให้บันทึก กดจัดการความคืบหน้าเพื่อสำรองข้อมูล</div>':''}<main class="main page-enter" id="main" tabindex="-1">${content}</main></div></div>`;
}
function pathToggle(){return `<div class="segmented" aria-label="เลือกเส้นทาง"><button class="${state.path==='rapid'?'active':''}" data-path="rapid" aria-pressed="${state.path==='rapid'}">เร่งด่วนคืนนี้</button><button class="${state.path==='full'?'active':''}" data-path="full" aria-pressed="${state.path==='full'}">เรียนครบทุกบท</button></div>`;}
function lessonRow(lesson,index){
 const done=state.lessons[lesson.id]?.completed,progress=lessonProgress(lesson),current=nextLesson().id===lesson.id;
 const r=state.pretests[lesson.id],result=r?.submittedAt?evaluatePretest(lesson.id,r.answers,r.uncertain):null;
 const label=state.lessons[lesson.id]?.completionMethod==='pretest'?'ข้ามจาก pre-test':done?'เรียนจบแล้ว':result?.passed?'ผ่าน · ข้ามได้':result?`ติวเฉพาะ ${result.reviewSteps.length} ช่วง`:r?.startedAt?'ทำ pre-test ค้างไว้':'pre-test 5 ข้อก่อนเรียน';
 return `<button class="lesson-row" ${routeAttr(`lesson/${lesson.id}`)}><span class="number ${done?'done':current?'current':''}">${done?icon('check'):String(index+1).padStart(2,'0')}</span><span class="grow"><strong>${escapeHtml(lesson.title)}</strong><span class="row-meta"><span>${lesson.id}</span><span>${label}</span>${result?`<span>${result.score}/5 · แกน ${result.coreScore}/${result.coreTotal}</span>`:`<span>วัดก่อนติว ≈ 3–5 นาที</span>`}</span></span>${result?.passed&&!done?'<span class="status-chip">ข้ามได้</span>':current&&!done?'<span class="status-chip">จุดถัดไป</span>':''}${icon('chevron','arrow')}</button>`;
}
function footnote(){return `<p class="source-footnote">สื่อเตรียมตัวอิสระ อ้างอิงขอบเขต ICT Challenge 2026 · ข้อฝึกแต่งใหม่ ไม่ใช่ข้อสอบเก่าหรือเว็บไซต์ของผู้จัด<br>ความคืบหน้าเก็บในเบราว์เซอร์นี้ · <button class="text-link" data-action="sources">ดูหลักฐานและข้อจำกัด</button></p>`;}
function adaptiveHome(){
 const path=pathLessons(),next=nextLesson(),done=countDone();
 const tested=path.filter(l=>state.pretests[l.id]?.submittedAt);
 const skipAvailable=tested.filter(l=>!state.lessons[l.id]?.completed&&evaluatePretest(l.id,state.pretests[l.id].answers,state.pretests[l.id].uncertain).passed);
 const skipped=lessons.filter(l=>state.lessons[l.id]?.completionMethod==='pretest');
 const pending=path.filter(l=>!state.lessons[l.id]?.completed);
 const pre=state.pretests[next.id];
 const cta=!pending.length?'ครบเส้นทางนี้แล้ว ไปซ้อมรวม':pre?.mode==='focus'?'ติวเฉพาะจุดต่อ':pre?.mode==='full'?'อ่านบทที่เลือกต่อ':pre?.submittedAt?'ดูผลแล้วเลือกข้าม':pre?.startedAt?'ทำ pre-test ต่อ':'เริ่มวัดก่อนติว';
 return shell(`<div class="page-topline"><div><div class="greeting">เตรียมสอบแบบใช้เวลาตรงจุด</div><h1>สิ่งที่รู้แล้ว ข้ามได้เลย</h1></div><span class="tag">${icon('target')} วัดจริงก่อนเรียน</span></div><section class="hero adaptive-hero"><div class="hero-copy"><span class="hero-label">ASSESS → FOCUS → VERIFY</span><h1>วัดก่อน<br><span>ติวเฉพาะที่ยังไม่แม่น</span></h1><p>โจทย์ประยุกต์ก่อนทุกบท แยกจากแบบฝึกเดิม<br>ผ่านเกณฑ์แล้วข้ามได้ ไม่ต้องอ่านสิ่งที่รู้อยู่แล้ว</p><div class="row wrap"><button class="btn primary" ${routeAttr(pending.length?`lesson/${next.id}`:'practice')}>${cta} ${icon('arrow')}</button><button class="btn ghost" ${routeAttr('learn')}>เลือกบทเอง</button></div></div><div class="hero-art"><div class="adaptive-method"><div><b>01</b><span>Pre-test 5 ข้อ<small>คำนวณ · ไล่โค้ด · วิเคราะห์สถานการณ์</small></span></div><div><b>02</b><span>รู้แล้ว → เลือกข้าม<small>อย่างน้อย 4/5 + ข้อแกนถูกครบ</small></span></div><div><b>03</b><span>พลาด → ติวเฉพาะจุด<small>แล้วตรวจด้วยโจทย์ใหม่อีกชุด</small></span></div></div></div></section><div class="stats-strip"><div class="stat"><div class="stat-icon">${icon('target')}</div><div><div class="stat-number">${tested.length}<small class="small muted"> / ${path.length}</small></div><div class="stat-label">บทในเส้นทางที่วัดแล้ว</div></div></div><div class="stat"><div class="stat-icon">${icon('arrow')}</div><div><div class="stat-number">${skipAvailable.length}</div><div class="stat-label">บทที่ผ่านและเลือกข้ามได้</div></div></div><div class="stat"><div class="stat-icon">${icon('check')}</div><div><div class="stat-number">${skipped.length}</div><div class="stat-label">บทที่ข้ามด้วยผลทดสอบแล้ว</div></div></div></div><div class="section-title"><div><h2>จัดเวลาให้เรื่องที่ยังไม่แม่น</h2><p>${state.path==='rapid'?'10 บทหลักจาก 4 หมวด · เรียงตามลำดับติวที่แนะนำ':'17 บทครบเส้นทาง · มี pre-test ทุกบท'}</p></div>${pathToggle()}</div><div class="dashboard-grid"><div class="learning-list">${(pending.length?pending:path).slice(0,6).map(l=>lessonRow(l,path.indexOf(l))).join('')}<button class="text-link" ${routeAttr('learn')}>ดูและเลือกทั้งหมด ${path.length} บท ${icon('arrow')}</button></div><div class="sidebar-panels"><section class="panel today-panel"><div class="eyebrow">เส้นทางเร่งด่วน</div><h3 style="margin-top:11px">ไม่เสียเวลากับสิ่งที่ทำได้แล้ว</h3><p>Pre-test ไม่เปิดเฉลยก่อนส่ง ข้อหลายคำตอบต้องถูกครบ และข้อแกนสำคัญพลาดไม่ได้หากจะข้าม</p><p>ถ้าถูกแต่ยังลังเล ให้ทำเครื่องหมายไว้ ระบบจะรวมจุดนั้นในแผนทวนให้ด้วย</p><button class="text-link" ${routeAttr('practice')}>ไปชุดซ้อมรวม ${icon('arrow')}</button></section><section class="panel"><h3>ความคืบหน้ายังอยู่ครบ</h3><p class="small muted">เรียนจบหรือข้ามแล้ว ${done}/${lessons.length} บท<br>โค้ดที่ผ่านจริง ${Object.values(state.codePassed).filter(Boolean).length}/${challenges.length} โจทย์</p><p class="small muted">การผ่านปรนัยไม่เพิ่มสถานะผ่านโจทย์เขียนโค้ด และยังกลับไปอ่านหรือฝึกได้ทุกบท</p></section></div></div>${footnote()}`);
}
function pretestRecord(id){
 let record=state.pretests[id];
 if(!record||record.version!==assessmentVersion){record={version:assessmentVersion,answers:{},uncertain:{},startedAt:null,submittedAt:null,mode:null};state.pretests[id]=record;}
 return record;
}
function pretestPage(id){
 const lesson=lessonMap.get(id);if(!lesson)return notFound();
 state.lastLesson=id;
 const r=pretestRecord(id),list=assessments[id].pre;
 const header=`<button class="text-link" ${routeAttr('learn')}>${icon('back')} กลับเส้นทางเรียน</button><header class="lesson-header"><span class="hero-label" style="margin-top:17px">PRE-TEST · ${id}</span><h1>${lesson.title}</h1><p class="lesson-sub">${lesson.subtitle}</p></header>`;
 if(r.submittedAt)return shell(header+pretestResult(lesson,r),'learn','ผลวัดก่อนติว');
 if(!r.startedAt)return shell(header+`<section class="pre-intro"><div class="pre-intro-icon">${icon('target')}</div><h2>ทำได้อยู่แล้ว ก็ไม่ต้องเรียนซ้ำ</h2><p>5 ข้อจากเนื้อหาบทนี้ เน้นการใช้เหตุผลและจุดที่มักสับสน<br>มีทั้งคำตอบเดียวและหลายคำตอบ ใช้เวลาประมาณ 3–5 นาที</p><div class="pre-rules"><div><strong>4/5 ขึ้นไป</strong><span>และข้อแกนสำคัญถูกครบ จึงเลือกข้ามได้</span></div><div><strong>ไม่เฉลยระหว่างทำ</strong><span>ผลครั้งแรกแยกเก็บไว้ ไม่เอาการจำเฉลยมานับเป็น pre-test ใหม่</span></div><div><strong>ผิดตรงไหน ติวตรงนั้น</strong><span>สรุปจุดพลาด + ช่วงเนื้อหาที่ต้องทวน + โจทย์ยืนยันอีกชุด</span></div></div><div class="row wrap"><button class="btn primary" data-action="start-pre" data-id="${id}">เริ่ม pre-test 5 ข้อ ${icon('arrow')}</button><button class="btn" data-action="study-full" data-id="${id}">เลือกอ่านบทนี้ก่อน</button></div><p class="source-footnote">ข้อฝึกแต่งใหม่จากขอบเขตผู้จัด ระดับและเกณฑ์ข้ามเป็นการออกแบบหลักสูตร ไม่ใช่ข้อสอบจริงหรือเกณฑ์คัดเลือกของผู้จัด</p></section>`,'learn','วัดก่อนติว');
 const answered=list.filter(q=>(r.answers[q.id]||[]).length).length;
 return shell(header+`<div class="pre-test-shell"><div class="pre-test-top"><div><strong>วัดก่อนติว · 5 ข้อ</strong><p id="pre-answered">ตอบแล้ว ${answered}/5 ข้อ · ข้อแกน ${list.filter(q=>q.core).length} ข้อ</p></div><span class="timer">${icon('clock')} <span id="pretest-timer">${formatTime((Date.now()-r.startedAt)/1000)}</span></span></div><p class="small muted">ทำเครื่องหมาย “ยังไม่มั่นใจ” ได้แม้เลือกคำตอบแล้ว เพื่อให้แผนทวนไม่มองข้ามข้อที่เดา</p>${list.map((q,i)=>`<div class="pre-question"><div class="row between"><span class="eyebrow">ข้อ ${i+1} / 5</span>${q.core?'<span class="core-tag">ข้อแกน · ต้องถูกเพื่อข้าม</span>':''}</div>${questionView(q,{mode:'pretest',exam:r})}<label class="uncertain-option"><input type="checkbox" data-uncertain="${q.id}" ${r.uncertain[q.id]?'checked':''}> ข้อนี้ยังไม่มั่นใจ / มีส่วนที่เดา</label></div>`).join('')}<div class="pre-submit"><p>ยังย้อนแก้ได้ก่อนส่ง · จะเปิดเหตุผลหลังส่งทั้งชุด</p><button class="btn primary" data-action="submit-pre" data-id="${id}">ส่ง pre-test และจัดแผนติว ${icon('check')}</button></div></div>`,'learn','ทำ pre-test');
}
function pretestResult(lesson,r){
 const result=evaluatePretest(lesson.id,r.answers,r.uncertain),ls=getLessonState(lesson.id),focus=result.reviewSteps;
 const target=focus.length?focus:lesson.steps.map((_,i)=>i);
 return `<section class="pre-result ${result.passed?'pre-passed':''}"><div class="pre-result-heading"><div><div class="eyebrow">ผลวัดครั้งแรก${r.afterStudy?' · เคยเปิดเนื้อหาแล้ว':''}</div><h2>${result.passed?'ผ่านเกณฑ์ เลือกข้ามบทนี้ได้':result.score>=4?'คะแนนถึง แต่ข้อแกนยังพลาด':'ติวเฉพาะจุดที่ยังไม่แม่น'}</h2><p>${result.passed?'ข้ามหรือทวนเพิ่มได้ตามความมั่นใจ โดยไม่ต้องทำแบบฝึกพื้นฐานซ้ำ':'ไม่ต้องเริ่มอ่านทั้งหมด เลือกทวนช่วงที่เชื่อมกับคำตอบผิดหรือไม่มั่นใจ'}</p></div><div class="pre-score"><strong>${result.score}<small>/5</small></strong><span>แกน ${result.coreScore}/${result.coreTotal} ข้อ</span></div></div><div class="pre-result-stats"><span>${result.wrongIds.length} ข้อที่พลาด</span><span>${result.uncertainIds.length} ข้อที่ยังลังเล</span><span>${focus.length} ช่วงที่แนะนำให้ทวน</span></div>${ls.completionMethod==='pretest'?'<div class="feedback"><strong>ข้ามบทนี้จากผล pre-test แล้ว</strong>ยังกลับมาอ่านหรือฝึกโค้ดได้ทุกเมื่อ สถานะโจทย์เขียนโค้ดเก็บแยกจากคะแนนปรนัย</div>':ls.completed?'<div class="feedback"><strong>ทวนและยืนยันผ่านบทนี้แล้ว</strong>คะแนนด้านบนยังเป็นผลวัดก่อนติวครั้งแรก ไม่เปลี่ยนตามการฝึกหลังเห็นเฉลย</div>':''}<div class="row wrap pre-result-actions">${result.passed&&!ls.completed?`<button class="btn primary" data-action="skip-pre" data-id="${lesson.id}">ข้ามบทนี้ ไปจุดถัดไป ${icon('arrow')}</button>`:''}${focus.length?`<button class="btn ${result.passed?'':'primary'}" data-action="study-focus" data-id="${lesson.id}">ติวเฉพาะ ${focus.length} ช่วงที่พลาด/ลังเล ${icon('target')}</button>`:''}<button class="btn" data-action="study-full" data-id="${lesson.id}">อ่านบทเต็ม</button>${ls.completed?`<button class="btn primary" data-action="advance-adaptive" data-id="${lesson.id}">ไปจุดถัดไป ${icon('arrow')}</button>`:''}</div>${result.passed&&lesson.challenge?'<p class="small muted">การข้ามนี้ยกเว้นบทเรียนความรู้ ไม่เพิ่มสถานะว่าเขียนโปรแกรมผ่าน โจทย์โค้ดยังเปิดให้ลองได้</p>':''}</section>${focus.length?`<section class="cram-panel"><div class="section-title"><div><div class="eyebrow">FOCUS BRIEF</div><h2>สรุปให้ตรงจุด ก่อนลงรายละเอียด</h2></div><span class="tag">${focus.length} ช่วง</span></div>${target.map(i=>`<div class="cram-item"><span>${i+1}</span><div><h3>${lesson.steps[i].title}</h3><p>${rich(cram[lesson.id][i])}</p><button class="text-link" data-action="focus-step" data-id="${lesson.id}" data-step="${i}">เปิดคำอธิบายและตัวอย่าง ${icon('arrow')}</button></div></div>`).join('')}<div class="row wrap"><button class="btn primary" data-action="brief-to-check" data-id="${lesson.id}">อ่านสรุปแล้ว ไปโจทย์ยืนยันชุดใหม่ ${icon('arrow')}</button></div><p class="small muted" style="margin:12px 0 0">ถ้าสรุปยังไม่ชัด ให้เปิดช่วงที่เกี่ยวข้องก่อน ทุกบทกลับมาอ่านเพิ่มได้</p></section>`:''}<details class="pre-explanations"><summary>ดูคำตอบและเหตุผลของ pre-test ทั้ง 5 ข้อ</summary><div class="review-list">${assessments[lesson.id].pre.map(q=>`<div class="pre-snapshot"><div class="question-header"><span class="question-id">${q.id}</span><span class="tag">${equalAnswers(r.answers[q.id]||[],q.correct)?'✓ ถูก':'ควรทวน'}</span></div><div class="question-prompt">${rich(q.prompt)}</div><div class="snapshot-choices">${q.options.map((text,i)=>`<div class="${q.correct.includes(i)?'snapshot-correct':''}"><b>${String.fromCharCode(65+i)}.</b> ${inline(text)} ${(r.answers[q.id]||[]).includes(i)?'<span class="small">← คุณเลือก</span>':''}</div>`).join('')}</div><div class="feedback">${rich(q.explanation)}</div></div>`).join('')}</div></details>`;
}
function advanceAdaptive(id){
 const path=pathLessons(),index=path.findIndex(l=>l.id===id);
 const next=path.slice(index>=0?index+1:0).find(l=>!state.lessons[l.id]?.completed)||path.find(l=>!state.lessons[l.id]?.completed);
 state.lastLesson=next?.id||id;save();nav(next?`lesson/${next.id}`:'learn');
}
function startStudy(id,mode,stepIndex){
 const r=pretestRecord(id);r.mode=mode;save();
 const lesson=lessonMap.get(id),steps=requiredSteps(lesson);
 const index=Number.isInteger(stepIndex)?stepIndex:steps.find(i=>!getLessonState(id).read.includes(i))??steps[0];
 nav(`lesson/${id}?tab=learn&step=${index}`);
}
function submitPretest(id){
 const r=pretestRecord(id);if(r.submittedAt)return;
 r.submittedAt=Date.now();
 for(const q of assessments[id].pre){const selected=r.answers[q.id]||[],correct=equalAnswers(selected,q.correct);state.answers[q.id]={selected:[...selected],correct,at:r.submittedAt,attempts:1};if(correct)state.mastered[q.id]=true;}
 save();closeModal();nav(`pretest/${id}`);
}
function adaptiveAction(el){
 const action=el.dataset.action,id=el.dataset.id;
 if(action==='start-pre'){const r=pretestRecord(id);if(!r.submittedAt){r.startedAt??=Date.now();r.afterStudy=getLessonState(id).read.length>0;r.mode=null;save();render();}return true;}
 if(action==='submit-pre'){const r=pretestRecord(id),missing=assessments[id].pre.filter(q=>!(r.answers[q.id]||[]).length).length;if(missing)modal(`<h2>ยังไม่ได้ตอบ ${missing} ข้อ</h2><p>ข้อเว้นไว้คิดเป็นผิดเพื่อเลือกจุดทวน กลับไปตอบเพิ่มหรือส่งตามที่ทำไว้ได้</p><div class="modal-actions"><button class="btn" data-action="close-modal">กลับไปตรวจ</button><button class="btn primary" data-action="confirm-submit-pre" data-id="${id}">ส่งตามที่ทำไว้</button></div>`);else submitPretest(id);return true;}
 if(action==='confirm-submit-pre'){submitPretest(id);return true;}
 if(action==='skip-pre'){const r=pretestRecord(id);if(r.submittedAt&&evaluatePretest(id,r.answers,r.uncertain).passed){const ls=getLessonState(id);ls.completed=true;ls.completionMethod='pretest';ls.completedAt=Date.now();save();showToast('ข้ามบทนี้ด้วยผล pre-test แล้ว');advanceAdaptive(id);}return true;}
 if(action==='advance-adaptive'){advanceAdaptive(id);return true;}
 if(action==='study-focus'){startStudy(id,'focus');return true;}
 if(action==='study-full'){startStudy(id,'full');return true;}
 if(action==='focus-step'){startStudy(id,'focus',Number(el.dataset.step));return true;}
 if(action==='brief-to-check'){const r=pretestRecord(id);r.mode='focus';const ls=getLessonState(id);for(const i of requiredSteps(lessonMap.get(id)))if(!ls.read.includes(i))ls.read.push(i);save();nav(`lesson/${id}?tab=quiz`);return true;}
 return false;
}

function roadmap(){
 const available=pathLessons();
 const filtered=available.filter(l=>roadmapFilter==='all'||l.group===roadmapFilter);
 return shell(`<div class="page-heading"><div class="eyebrow">LEARNING PATH</div><h1>ทีละบท ไปด้วยกัน</h1><p>เริ่มด้วย pre-test ทุกบท ผ่านแล้วข้ามได้ พลาดแล้วติวเฉพาะจุด</p></div><div class="section-title"><p class="small muted" style="margin:0">${available.length} บท · วัดก่อน → ข้าม / ติวเฉพาะจุด → โจทย์ใหม่</p>${pathToggle()}</div><div class="filter-bar"><button class="filter-chip ${roadmapFilter==='all'?'active':''}" data-filter="all">ทั้งหมด</button>${groups.map(g=>`<button class="filter-chip ${roadmapFilter===g.id?'active':''}" data-filter="${g.id}">${g.name}</button>`).join('')}</div>${groups.map(g=>{const rows=filtered.filter(l=>l.group===g.id);if(!rows.length)return '';return `<section class="roadmap-group"><div class="group-heading"><div class="group-icon color-${g.color}">${icon(g.icon)}</div><div><h2>${g.name}</h2><p>${g.label}</p></div></div><div class="group-lessons">${rows.map(l=>lessonRow(l,available.indexOf(l))).join('')}</div></section>`;}).join('')||'<div class="empty-state"><h2>หมวดนี้อยู่ในเส้นทางเต็ม</h2><p>เลือก “เรียนครบทุกบท” เพื่อดูบทเพิ่มเติมของหมวดนี้</p><button class="btn primary" data-path="full">ดูเส้นทางเต็ม</button></div>'}${footnote()}`,'learn','เส้นทางการเรียน');
}
function outline(lesson,index,tab){
 const ls=getLessonState(lesson.id),required=requiredSteps(lesson),r=state.pretests[lesson.id];
 return `<aside class="lesson-outline"><h3>ในบทนี้</h3><button class="outline-step" ${routeAttr(`pretest/${lesson.id}`)}><i>?</i>Pre-test ${r?.submittedAt?evaluatePretest(lesson.id,r.answers,r.uncertain).score+'/5':'ก่อนติว'}</button>${lesson.steps.map((s,i)=>`<button class="outline-step ${ls.read.includes(i)?'done':''} ${tab==='learn'&&i===index?'active':''} ${!required.includes(i)?'optional-step':''}" ${routeAttr(`lesson/${lesson.id}?tab=learn&step=${i}`)}><i>${ls.read.includes(i)?'✓':i+1}</i><span>${s.title}${!required.includes(i)?' · เสริม':''}</span></button>`).join('')}<button class="outline-step ${tab==='quiz'?'active':''}" ${routeAttr(`lesson/${lesson.id}?tab=quiz`)}><i>✓</i>ยืนยันด้วยโจทย์ใหม่</button>${lesson.challenge?`<button class="outline-step ${tab==='code'?'active':''}" ${routeAttr(`lesson/${lesson.id}?tab=code`)}><i>{ }</i>ลองเขียนโค้ด</button>`:''}<div class="lesson-progress-box"><div class="row between small"><span class="muted">ความคืบหน้า</span><strong>${lessonProgress(lesson)}%</strong></div><div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${lessonProgress(lesson)}%"></div></div><p>${r?.mode==='focus'?'ทวนเฉพาะ '+required.length+' ช่วงจากผล pre-test':'อ่านและตรวจความเข้าใจ'}<br>โจทย์ยืนยันแยกจาก pre-test</p></div></aside>`;
}
function completion(lesson){
 const req=requirements(lesson),ls=getLessonState(lesson.id),done=ls.completed,all=req.every(Boolean),steps=requiredSteps(lesson);
 if(ls.completionMethod==='pretest')return `<section class="completion-panel" id="completion"><h3>ข้ามบทนี้จากผล pre-test แล้ว</h3><p>ไม่บังคับอ่านหรือทำแบบฝึกซ้ำ ยังเปิดอ่านและลองเขียนโค้ดได้ทุกเมื่อ คะแนนโค้ดแยกจากผลปรนัย</p><button class="btn primary" data-action="advance-adaptive" data-id="${lesson.id}">ไปจุดถัดไป ${icon('arrow')}</button></section>`;
 return `<section class="completion-panel" id="completion"><h3>${done?'บทนี้เรียนจบแล้ว':'ยืนยันว่าเข้าใจ แล้วไปต่อ'}</h3><div class="requirement ${req[0]?'done':''}">${icon(req[0]?'check':'book')} ทวนช่วงที่ต้องเก็บ ${steps.filter(i=>ls.read.includes(i)).length}/${steps.length} ช่วง</div><div class="requirement ${req[1]?'done':''}">${icon(req[1]?'check':'target')} ผ่านโจทย์ใหม่ ${lesson.quiz.filter(id=>state.mastered[id]).length}/${lesson.quiz.length} ข้อ</div>${lesson.challenge&&state.path==='full'?`<div class="requirement ${req[2]?'done':''}">${icon(req[2]?'check':'code')} ${req[2]?'ผ่าน test cases ของโจทย์โค้ดแล้ว':'ลองเขียนโค้ดและผ่าน test cases'}</div>`:''}<p>${state.path==='rapid'?'เส้นทางรอบออนไลน์ไม่บังคับโจทย์เขียนโปรแกรม เก็บแรงให้จุดความรู้ที่ยังพลาด':'แบบฝึกพื้นฐานเพิ่มเติมไม่ใช่เงื่อนไขผ่านบทนี้'}</p><button class="btn ${done?'success':'primary'}" data-action="complete" data-lesson="${lesson.id}" ${!all&&!done?'disabled':''}>${done?'ไปจุดถัดไป':'ยืนยันผ่านบทนี้ แล้วไปต่อ'} ${icon('arrow')}</button></section>`;
}
function lessonPage(id,params){
 const lesson=lessonMap.get(id);if(!lesson)return notFound();
 state.lastLesson=id;const record=pretestRecord(id),ls=getLessonState(id);save();
 if(!params.has('tab')&&!params.has('step')){
  if(!record.mode&&!ls.completed)return pretestPage(id);
  const steps=requiredSteps(lesson),unread=steps.find(i=>!ls.read.includes(i));
  params=new URLSearchParams({tab:unread===undefined?'quiz':'learn',step:String(unread??steps[0])});
 }
 let tab=params.get('tab')||'learn';if(!['learn','quiz','code'].includes(tab)||tab==='code'&&!lesson.challenge)tab='learn';
 const index=Math.min(lesson.steps.length-1,Math.max(0,Number(params.get('step'))||0)),steps=requiredSteps(lesson);
 const tabs=`<div class="lesson-tabs" role="tablist" aria-label="ส่วนของบทเรียน"><button class="lesson-tab" role="tab" aria-selected="false" ${routeAttr(`pretest/${id}`)}>${icon('target')} Pre-test</button>${[['learn','book','ติวตรงจุด'],['quiz','check','โจทย์ยืนยัน'],...(lesson.challenge?[['code','code','ลองเขียนโค้ด']]:[])].map(([t,i,label])=>`<button class="lesson-tab ${tab===t?'active':''}" role="tab" aria-selected="${tab===t}" ${routeAttr(`lesson/${id}?tab=${t}${t==='learn'?`&step=${index}`:''}`)}>${icon(i)}${label}</button>`).join('')}</div>`;
 const focus=record.mode==='focus'?`<div class="focus-banner">${icon('target')}<span>แผนเฉพาะจุด: ${steps.length} ช่วงที่พลาด/ลังเล · ไม่ต้องอ่านช่วงเสริมเพื่อจบบท</span><button class="text-link" data-action="study-full" data-id="${id}">อ่านครบแทน</button></div>`:'';
 let body;
 if(tab==='learn'){
  const s=lesson.steps[index],position=steps.indexOf(index),previous=steps.filter(i=>i<index).at(-1);
  body=`${focus}<article class="article"><div class="step-count">ช่วง ${index+1} / ${lesson.steps.length} · ${ls.read.includes(index)?'ทวนแล้ว':steps.includes(index)?'จุดที่ต้องเก็บ':'ช่วงเสริม เลือกอ่านได้'}</div><h2>${s.title}</h2><div class="cram-inline"><strong>แก่นที่ต้องจับให้ได้</strong><p>${rich(cram[id][index])}</p></div>${s.html}${s.lab?labWidget(s.lab):''}</article><div class="article-footer"><button class="btn ghost small" ${previous!==undefined?routeAttr(`lesson/${id}?tab=learn&step=${previous}`):routeAttr(`pretest/${id}`)}>${icon('back')} ${previous!==undefined?'ช่วงก่อนหน้า':'ผล pre-test'}</button><button class="btn primary" data-action="read-next" data-lesson="${id}" data-step="${index}">${!steps.some(i=>i>index)?'ไปโจทย์ยืนยันชุดใหม่':'เข้าใจแล้ว ไปจุดถัดไป'} ${icon('arrow')}</button></div>`;
 }else if(tab==='quiz'){
  body=`${focus}<div class="quiz-container"><div class="quiz-intro"><div><h3>ยืนยันด้วยโจทย์ที่ไม่ซ้ำ pre-test</h3><p>ตรวจการใช้ความเข้าใจ ไม่ใช่จำตัวเลือกจากชุดแรก</p></div><span class="tag">${lesson.quiz.length} ข้อ</span></div>${lesson.quiz.map(qid=>questionView(questions.get(qid))).join('')}<details class="basic-extra"><summary>แบบฝึกพื้นฐานเพิ่มเติม · เลือกทำได้ ไม่บังคับ</summary>${lesson.basicQuiz.map(qid=>questionView(questions.get(qid))).join('')}</details></div>${completion(lesson)}`;
 }else body=`<div class="lesson-embedded-code">${codeWorkspace(challengeMap.get(lesson.challenge))}</div>${completion(lesson)}`;
 return shell(`<button class="text-link" ${routeAttr('learn')}>${icon('back')} กลับเส้นทางเรียน</button><header class="lesson-header"><h1>${lesson.title}</h1><p class="lesson-sub">${lesson.subtitle}</p><div class="lesson-metadata"><span class="tag">${id} · ${groups.find(g=>g.id===lesson.group).name}</span><span>${icon('clock')} เนื้อหาเต็มประมาณ ${lesson.minutes} นาที</span>${ls.completionMethod==='pretest'?'<span class="tag">ข้ามจาก pre-test แล้ว</span>':ls.completed?'<span class="tag">เรียนจบแล้ว</span>':''}</div></header><div class="lesson-layout"><div class="lesson-paper">${tabs}${body}</div>${outline(lesson,index,tab)}</div>`,'learn',lesson.title);
}

function labWidget(type){
 const title=`<div class="lab-title">${icon('spark')} ลองด้วยตัวเอง</div>`;
 if(type==='bits')return `<div class="mini-lab" data-lab="bits">${title}<div class="bits">${[128,64,32,16,8,4,2,1].map(v=>`<div class="bit-cell"><small>${v}</small><button class="${[8,2].includes(v)?'on':''}" data-bit="${v}" aria-label="สลับ bit น้ำหนัก ${v}" aria-pressed="${[8,2].includes(v)}">${[8,2].includes(v)?1:0}</button></div>`).join('')}</div><div class="lab-output" aria-live="polite">เลขฐานสิบ <strong id="bit-result">10</strong><span id="bit-sum">= 8 + 2</span></div></div>`;
 if(type==='network')return `<div class="mini-lab" data-lab="network" data-net="0">${title}<div class="network-stages">${[['grid','เครื่องเรา'],['network','DNS'],['shield','เชื่อมต่อ'],['cloud','เว็บเซิร์ฟเวอร์']].map(([i,label],n)=>`${n?icon('chevron','net-arrow'):''}<div class="net-stage ${n===0?'active':''}"><div class="net-icon">${icon(i)}</div>${label}</div>`).join('')}</div><div class="net-detail" aria-live="polite">1/4 · เครื่องมี IP และค่าตั้งเครือข่ายแล้ว เมื่อพิมพ์ชื่อเว็บต้องหาปลายทางก่อน</div><button class="btn small" data-action="net-next">เดินทางต่อ ${icon('arrow')}</button></div>`;
 if(type==='cloud')return `<div class="mini-lab" data-lab="cloud">${title}<div class="cloud-options">${['IaaS','PaaS','SaaS'].map((x,i)=>`<button class="btn small ${!i?'primary':''}" data-cloud="${x}" aria-pressed="${!i}">${x}</button>`).join('')}</div><div class="responsibility" id="cloud-responsibility">${cloudResponsibilities('IaaS')}</div></div>`;
 if(type==='metrics')return `<div class="mini-lab" data-lab="metrics">${title}<div class="metric-inputs">${[['TP',18],['FP',6],['FN',2]].map(([name,val])=>`<label>${name}<input type="number" min="0" max="1000000" step="1" value="${val}" data-metric="${name}" aria-label="จำนวน ${name}"></label>`).join('')}</div><div class="metric-results" aria-live="polite"><div>Precision<b id="precision">75.0%</b><span>ในสิ่งที่บอกว่า positive ถูกกี่ส่วน</span></div><div>Recall<b id="recall">90.0%</b><span>ใน positive จริงทั้งหมด จับได้กี่ส่วน</span></div></div><p class="small muted" style="margin:12px 0 0;font-size:10px">ถ้าตัวหารเป็น 0 จะแสดง “ไม่นิยาม” แทนการสมมติเป็น 0%</p></div>`;
 if(type==='sheet')return `<div class="mini-lab" data-lab="sheet">${title}<div class="sheet-controls"><label>เลื่อนลง<select data-sheet="row" aria-label="จำนวนแถวที่เลื่อน"><option value="0">0 แถว</option><option value="1" selected>1 แถว</option><option value="2">2 แถว</option></select></label><label>เลื่อนขวา<select data-sheet="col" aria-label="จำนวนคอลัมน์ที่เลื่อน"><option value="0" selected>0 คอลัมน์</option><option value="1">1 คอลัมน์</option><option value="2">2 คอลัมน์</option></select></label></div><div class="formula-transform"><span>=$A2*B$1</span>${icon('arrow')}<b id="formula-result">=$A3*B$1</b></div><p id="formula-detail" class="small muted" style="margin:12px 0 0;font-size:10px">คัดลอก C2 → C3: $A ล็อกคอลัมน์ ส่วน $1 ล็อกแถว</p></div>`;
 return '';
}
function cloudResponsibilities(type){return [['Hardware','ผู้ให้บริการ'],['OS / runtime',type==='IaaS'?'คุณ':'ผู้ให้บริการ'],['Application',type==='SaaS'?'ผู้ให้บริการ':'คุณ'],['บัญชี สิทธิ์ และข้อมูล','คุณยังต้องดูแล']].map(([a,b])=>`<div><strong>${a}</strong><span>${b}</span></div>`).join('');}

function questionView(q,{mode='lesson',exam=null,review=false}={}){
 if(!q)return '';
 const isTest=mode==='exam'||mode==='pretest';
 const record=isTest?null:state.answers[q.id];
 const selected=isTest?(exam.answers[q.id]||[]):record?.selected||state.drafts[q.id]||[];
 const locked=!!record;
 return `<section class="question-card" id="question-${q.id}" data-question="${q.id}" data-mode="${mode}"><div class="question-header"><span class="question-id">${q.id}</span><span class="question-type">${q.multi?'เลือกทุกข้อที่ถูก':'เลือกคำตอบเดียว'}</span>${record?`<span class="tag">${record.correct?'✓ ถูกต้อง':'ทบทวนอีกนิด'}</span>`:''}</div><div class="question-prompt">${rich(q.prompt)}</div><div class="choices">${q.options.map((choice,i)=>{let status=selected.includes(i)?' selected':'';if(locked&&q.correct.includes(i))status+=' correct';else if(locked&&selected.includes(i))status+=' incorrect';return `<label class="choice${status}"><input type="${q.multi?'checkbox':'radio'}" name="choice-${q.id}" value="${i}" data-choice="${q.id}" ${selected.includes(i)?'checked':''} ${locked?'disabled':''}><span class="choice-letter">${String.fromCharCode(65+i)}</span><span class="choice-text">${inline(choice)}</span>${locked&&q.correct.includes(i)?icon('check'):''}</label>`;}).join('')}</div>${isTest?'':`<div class="question-actions">${locked?`<button class="text-link" data-action="retry-question" data-id="${q.id}">${icon('review')} ลองตอบใหม่</button><span class="small muted">${state.mastered[q.id]?'เคยตอบถูกแล้ว':'ทำความเข้าใจ แล้วลองอีกครั้ง'}</span>`:`<button class="btn primary small" data-action="grade" data-id="${q.id}" ${!selected.length?'disabled':''}>ตรวจคำตอบ ${icon('check')}</button><span class="small muted">${q.multi?'เลือกได้มากกว่าหนึ่งข้อ':'เลือกเพียงหนึ่งข้อ'}</span>`}</div>${record?`<div class="feedback ${record.correct?'':'wrong'}" role="status"><strong>${record.correct?'ถูกต้อง เข้าใจแล้วอีกหนึ่งเรื่อง':'ยังไม่ครบ ลองดูวิธีคิดด้วยกัน'} · คำตอบ ${q.correct.map(i=>String.fromCharCode(65+i)).join(', ')}</strong><div>${rich(q.explanation)}</div></div>`:''}`}${review?`<label class="notes-label" for="note-${q.id}">จดสั้น ๆ ว่าพลาดเพราะอะไร</label><textarea class="notes-box" id="note-${q.id}" data-note="${q.id}" placeholder="เช่น อ่านปลาย range รวมเข้าไป → ปลายไม่รวม">${escapeHtml(state.notes[q.id]||'')}</textarea>`:''}</section>`;
}
function codeWorkspace(challenge){
 const c=challenge,code=typeof state.codes[c.id]==='string'?state.codes[c.id]:c.starter;
 return `<div class="coding-layout" data-code-workspace="${c.id}"><section class="problem-panel"><div class="row wrap"><span class="tag">${c.level}</span><span class="small muted" style="font-size:10px">${c.skill}</span>${state.codePassed[c.id]?'<span class="tag" style="color:var(--green)">✓ ผ่านแล้ว</span>':''}</div><h2>${c.title}</h2><p>${escapeHtml(c.description)}</p><h3>ข้อมูลนำเข้า · input</h3><p>${escapeHtml(c.input)}</p><h3>ผลลัพธ์ · output</h3><p>${escapeHtml(c.output)}</p><div class="io-grid"><div class="io-box"><span>ตัวอย่าง input</span><pre>${escapeHtml(c.tests[0].input)}</pre></div><div class="io-box"><span>ตัวอย่าง output</span><pre>${escapeHtml(c.tests[0].output)}</pre></div></div><div class="row wrap" style="margin-top:20px"><button class="text-link" data-action="hint" data-id="${c.id}">${icon('bulb')} ขอคำใบ้</button><button class="text-link" data-action="solution" data-id="${c.id}" style="color:var(--muted)">ดูวิธีทำ</button></div><div id="hint-${c.id}" class="hint hidden">${escapeHtml(c.hint)}</div><div id="solution-${c.id}" class="hidden"><p class="small muted" style="margin-top:16px">อ่านเพื่อเข้าใจ แล้วลองเขียนใหม่ด้วยตัวเอง</p><pre class="lesson-code solution-code"><code>${escapeHtml(c.solution)}</code></pre></div><p class="runner-note">ตรวจความถูกต้องจาก ${c.tests.length} test cases ที่กำหนด ไม่ใช่การพิสูจน์ว่าถูกกับทุก input หรือวัดประสิทธิภาพตามสนามจริง</p></section><div class="editor-workspace"><div class="editor-panel"><div class="editor-toolbar"><span><span class="dot"></span>solution.py <span style="margin-left:8px;color:#74869f">Python</span></span><button data-action="reset-code" data-id="${c.id}">${icon('review')} เริ่มโค้ดใหม่</button></div><label class="skip-link" for="code-${c.id}">โค้ด Python ของคุณ</label><textarea id="code-${c.id}" class="code-editor" data-editor="${c.id}" aria-label="เขียนโค้ด Python" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" wrap="off">${escapeHtml(code)}</textarea><div class="editor-status"><span>Tab เยื้อง · Esc ออกจากช่องโค้ด</span><span>Ctrl / ⌘ + Enter ตรวจคำตอบ</span></div></div><div class="runner-controls"><div class="runner-actions"><button class="btn primary" data-action="run-code" data-mode="check" data-id="${c.id}">${icon('check')} ตรวจคำตอบ</button><button class="btn" data-action="run-code" data-mode="run" data-id="${c.id}">${icon('play')} ทดลองรัน</button><button class="btn danger hidden" data-action="stop-code">${icon('stop')} หยุด</button></div><label class="stdin-label" for="stdin-${c.id}">Input สำหรับ “ทดลองรัน”</label><textarea class="stdin-input" id="stdin-${c.id}" aria-label="ข้อมูลนำเข้าสำหรับทดลองรัน">${escapeHtml(c.tests[0].input)}</textarea><p class="runner-note">รันในเบราว์เซอร์ของคุณ · ไม่ต้องติดตั้ง Python · จำกัดเวลารันครั้งละ 8 วินาที</p></div><div id="code-result" aria-live="polite">${codeResults[c.id]?renderCodeResult(codeResults[c.id],c):'<div class="result-panel"><div class="result-summary muted">'+icon('code')+' พื้นที่ทดลองของคุณ</div><p>เขียนโค้ดแล้วกดตรวจคำตอบ เราจะแสดงผลแต่ละ test case ตรงนี้</p></div>'}</div></div></div>`;
}
function labPage(id){
 const c=challengeMap.get(id)||challengeMap.get(state.lastCode)||challenges[0];state.lastCode=c.id;save();
 return shell(`<div class="page-heading"><div class="eyebrow">CODE LAB</div><h1>คิดแล้ว ลองเขียนดู</h1><p>รับ input พิมพ์ output แล้วตรวจคำตอบได้ทันทีในเบราว์เซอร์</p></div><div class="lab-catalog">${challenges.map(t=>`<button class="lab-card ${t.id===c.id?'active':''}" ${routeAttr(`lab/${t.id}`)}><div class="row between">${icon(state.codePassed[t.id]?'check':'code')}<span class="level">${t.level}</span></div><h3>${t.title}</h3><p>${t.skill}</p></button>`).join('')}</div>${codeWorkspace(c)}`,'lab','ห้องเขียนโค้ด');
}
function renderCodeResult(run,c){
 if(run.error)return `<section class="result-panel"><div class="result-summary fail">${icon('info')}${escapeHtml(run.error)}</div><p>โค้ดยังอยู่ครบ แก้ไขแล้วลองใหม่ได้เลย</p></section>`;
 const results=run.results,passed=results.filter(r=>r.passed).length;
 if(run.mode==='run'){
  const result=results[0];return `<section class="result-panel"><div class="result-summary ${result.error?'fail':'pass'}">${icon(result.error?'info':'check')}${result.error?'โปรแกรมเกิดข้อผิดพลาด':'ทดลองรันเสร็จแล้ว'}</div><p>โหมดทดลองรันยังไม่ตัดสินว่าผ่านโจทย์ กดตรวจคำตอบเพื่อเทียบทุก test case</p><div class="test-output"><pre>${escapeHtml(result.error||result.output||'(ไม่มี output)')}</pre>${result.stderr?`<pre>${escapeHtml(result.stderr)}</pre>`:''}</div></section>`;
 }
 return `<section class="result-panel"><div class="result-summary ${passed===results.length?'pass':'fail'}">${icon(passed===results.length?'check':'target')}${passed===results.length?'ผ่านครบแล้ว เก่งขึ้นอีกก้าว!':`ผ่าน ${passed} จาก ${results.length} test cases`}</div><p>${passed===results.length?'บันทึกผลผ่านโจทย์นี้แล้ว ลองอธิบายวิธีคิดและทดสอบ input ใหม่ด้วยตัวเอง':'เปิดรายละเอียดเพื่อเทียบ input, expected และ output ของคุณ'}</p>${results.map((r,i)=>`<details class="test-result ${r.passed?'pass':'fail'}" ${!r.passed?'open':''}><summary>${icon(r.passed?'check':'close')} ${i+1}. ${escapeHtml(r.name)} · ${r.passed?'ผ่าน':'ยังไม่ผ่าน'}</summary><div class="test-output"><span class="small">Input</span><pre>${escapeHtml(c.tests[i].input||'(ว่าง)')}</pre><span class="small">ผลที่คาดหวัง</span><pre>${escapeHtml(c.tests[i].output)}</pre><span class="small">ผลของคุณ</span><pre>${escapeHtml(r.output||'(ไม่มี output)')}</pre>${r.error?`<span class="small">Error</span><pre>${escapeHtml(r.error)}</pre>`:''}${r.stderr?`<pre>${escapeHtml(r.stderr)}</pre>`:''}</div></details>`).join('')}</section>`;
}
function practice(){
 return shell(`<div class="page-heading"><div class="eyebrow">PRACTICE ARENA</div><h1>ซ้อมวันนี้ มั่นใจขึ้นพรุ่งนี้</h1><p>กดเลือกคำตอบเหมือนทำข้อสอบ แล้วดูผลและคำอธิบายเมื่อส่งครบ</p></div><div class="exam-grid">${[['S','ชุดรวมประยุกต์ · เร่งด่วน','10 ข้อจากโจทย์ยืนยันหลายบท รวม subnet, โค้ด, metrics และสูตรตาราง','15–20 นาที','flag'],['M','อุ่นเครื่องออนไลน์','10 ข้อพื้นฐานผสม ทั้งเลือกคำตอบเดียวและหลายคำตอบ','12 นาที','target'],['D','วัดพื้นฐาน 4 หมวด','20 ข้อเริ่มต้นเพื่อหาภาพรวม ถ้ารู้พื้นฐานแล้วเลือกชุดประยุกต์หรือ pre-test รายบทได้เลย','15 นาที','target']].map(([id,title,desc,time,ic])=>{const ex=state.exams[id];return `<section class="exam-card"><div class="group-icon ${id==='M'?'color-teal':''}">${icon(ic)}</div><h2>${title}</h2><p>${desc}</p><div class="exam-meta"><span>${id==='D'?20:10} ข้อ</span><span>แนะนำ ${time}</span></div>${ex?.submittedAt?`<p>ครั้งล่าสุด ${ex.score}/${id==='D'?20:10} ข้อ</p><div class="row wrap"><button class="btn primary" ${routeAttr(`result/${id}`)}>ดูผลและคำอธิบาย ${icon('arrow')}</button><button class="text-link" data-action="new-exam" data-id="${id}">ซ้อมใหม่</button></div>`:`<button class="btn primary" ${routeAttr(`exam/${id}`)}>${ex?.startedAt?'ทำต่อจากเดิม':'เริ่มชุดนี้'} ${icon('arrow')}</button>`}</section>`;}).join('')}</div><div class="notice">ชุดรวมประยุกต์ใช้โจทย์ยืนยันที่อาจเคยทำในบทเรียน สัดส่วนและเวลาเป็นการออกแบบฝึก ไม่ใช่น้ำหนักข้อสอบจริง รอบออนไลน์จริงปี 2026 ตามเอกสารที่ตรวจไม่จำกัดเวลาสอบ แต่มีเกณฑ์เวลาเมื่อคะแนนเท่ากัน เกณฑ์ในเว็บนี้คือข้อละ 1 คะแนน หลายคำตอบต้องถูกครบชุด ไม่หักคะแนน</div><section class="panel"><h3>ก่อนเริ่ม ลองตกลงกับตัวเอง</h3><div class="row wrap" style="font-size:12px;color:var(--muted);gap:22px"><span>① ตอบด้วยตัวเองก่อนเปิดเอกสาร</span><span>② อ่านทุกตัวเลือกและหน่วย</span><span>③ กลับมาเรียนจากข้อที่ผิด</span></div></section>${footnote()}`,'practice','สนามซ้อม');
}
const examQuestions=id=>id==='S'?sprintQuestionIds.map(id=>questions.get(id)):imported.filter(q=>q.id.startsWith(id));
const equalAnswers=(a,b)=>a.length===b.length&&[...a].sort().every((v,i)=>v===[...b].sort()[i]);
function examPage(id){
 if(!['D','M','S'].includes(id))return notFound();
 if(state.exams[id]?.submittedAt)return resultPage(id);
 if(!state.exams[id]?.startedAt){state.exams[id]={startedAt:Date.now(),answers:{},index:0};save();}
 const ex=state.exams[id],list=examQuestions(id);ex.index=Math.min(list.length-1,Math.max(0,ex.index||0));
 const q=list[ex.index],answered=list.filter(q=>(ex.answers[q.id]||[]).length).length;
 return shell(`<div class="exam-shell"><div class="exam-top"><div><div class="eyebrow">${id==='D'?'DIAGNOSTIC':'MOCK EXAM'}</div><h1>${id==='D'?'วัดพื้นฐาน 4 หมวด':id==='S'?'ชุดรวมประยุกต์ · เร่งด่วน':'อุ่นเครื่องออนไลน์'}</h1></div><div class="timer">${icon('clock')} <span id="exam-timer">${formatTime((Date.now()-ex.startedAt)/1000)}</span></div></div><div class="row between" style="margin-bottom:13px"><span class="small muted"><span id="answered-count">ตอบแล้ว ${answered}/${list.length} ข้อ</span> · ยังย้อนแก้ได้ก่อนส่ง</span><button class="text-link" ${routeAttr('practice')}>พักไว้ก่อน</button></div><nav class="question-grid" aria-label="เลือกข้อสอบ">${list.map((t,i)=>`<button class="question-jump ${(ex.answers[t.id]||[]).length?'answered':''} ${i===ex.index?'active':''}" data-exam-index="${i}" data-exam="${id}" aria-label="ไปข้อ ${i+1}" ${i===ex.index?'aria-current="step"':''}>${i+1}</button>`).join('')}</nav><div class="exam-paper">${questionView(q,{mode:'exam',exam:ex})}<div class="exam-footer"><button class="btn ghost" data-exam-index="${ex.index-1}" data-exam="${id}" ${!ex.index?'disabled':''}>${icon('back')} ก่อนหน้า</button>${ex.index<list.length-1?`<button class="btn primary" data-exam-index="${ex.index+1}" data-exam="${id}">ข้อถัดไป ${icon('arrow')}</button>`:`<button class="btn primary" data-action="submit-exam" data-id="${id}">ส่งคำตอบ ${icon('check')}</button>`}</div></div><p class="source-footnote">บันทึกคำตอบที่เลือกให้อัตโนมัติ · ชุดฝึกแต่งใหม่ · ตัวจับเวลาเพื่อสังเกตเวลาที่ใช้ ไม่ตัดการสอบเมื่อครบเวลาแนะนำ</p></div>`,'practice','ทำชุดฝึก');
}
function formatTime(seconds){seconds=Math.max(0,Math.floor(seconds));return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function resultPage(id){
 const ex=state.exams[id];if(!ex?.submittedAt)return practice();
 const list=examQuestions(id),domains=Object.keys(domainNames);
 const scores=domains.map(domain=>{const qs=list.filter(q=>q.domain===domain);return {domain,total:qs.length,score:qs.filter(q=>equalAnswers(ex.answers[q.id]||[],q.correct)).length};});
 const weak=[...scores].sort((a,b)=>a.score/a.total-b.score/b.total)[0];
 return shell(`<div class="exam-shell"><button class="text-link" ${routeAttr('practice')}>${icon('back')} กลับสนามซ้อม</button><section class="exam-score" style="margin-top:20px"><div class="score-circle"><strong>${ex.score}/${list.length}</strong><span>ข้อที่ตอบถูก</span></div><h2>${ex.score/list.length>=.8?'ฐานเริ่มแน่นแล้ว ไปต่อกัน':'รู้จุดเริ่มต้นแล้ว ค่อย ๆ เติมกัน'}</h2><p>ใช้เวลา ${formatTime((ex.submittedAt-ex.startedAt)/1000)} · คะแนนนี้ใช้วางแผนเรียน ไม่ได้ทำนายอันดับหรือการผ่านคัดเลือก</p><div class="domain-scores">${scores.map(s=>`<div class="domain-score">${domainNames[s.domain]}<b>${s.score}/${s.total}</b><div class="progress-track"><div class="progress-fill" style="width:${Math.round(s.score/s.total*100)}%"></div></div></div>`).join('')}</div>${ex.score<list.length?`<div class="recommendation">${icon('bulb')}<div class="grow"><strong>เริ่มเติมที่ ${domainNames[weak.domain]}</strong><p>ทบทวนแนวคิด แล้วลองอธิบายตัวลวงว่าผิดเพราะอะไร</p></div><button class="btn small" ${routeAttr(`lesson/${domainLesson[weak.domain]}`)}>ไปเรียน ${icon('arrow')}</button></div>`:''}<div class="row" style="justify-content:center"><button class="btn primary" ${routeAttr('review')}>ทบทวนข้อผิด ${icon('review')}</button><button class="btn" data-action="new-exam" data-id="${id}">ทำชุดนี้ใหม่</button></div></section><div class="section-title"><h2>ดูเหตุผลทีละข้อ</h2><span class="small muted">คำตอบ ณ ตอนส่งชุดนี้</span></div><div class="review-list">${list.map(q=>examResultQuestion(q,ex)).join('')}</div>${footnote()}</div>`,'practice','ผลการซ้อม');
}
function examResultQuestion(q,ex){const selected=ex.answers[q.id]||[],ok=equalAnswers(selected,q.correct);return `<section class="question-card"><div class="question-header"><span class="question-id">${q.id}</span><span class="tag" style="color:${ok?'var(--green)':'var(--red)'}">${ok?'✓ ถูกต้อง':'ทบทวนอีกนิด'}</span></div><div class="question-prompt">${rich(q.prompt)}</div><div class="small muted">คุณเลือก ${selected.length?selected.map(i=>String.fromCharCode(65+i)).join(', '):'ยังไม่ได้ตอบ'} · คำตอบ ${q.correct.map(i=>String.fromCharCode(65+i)).join(', ')}</div><div class="feedback ${ok?'':'wrong'}">${rich(q.explanation)}</div></section>`;}
function review(){const wrong=wrongQuestions();return shell(`<div class="page-heading"><div class="eyebrow">LEARN FROM MISTAKES</div><h1>ข้อที่ผิด สอนอะไรเราได้บ้าง</h1><p>ทบทวนเหตุผล แล้วกดลองตอบใหม่ ข้อที่แก้ได้จะออกจากรายการนี้</p></div>${wrong.length?`<div class="section-title"><span class="small muted">${wrong.length} ข้อที่ยังควรทวน</span><button class="text-link" data-action="export">${icon('download')} สำรองความคืบหน้า</button></div><div class="review-list">${wrong.map(q=>questionView(q,{review:true})).join('')}</div>`:`<div class="empty-state"><div class="empty-icon">${icon('review')}</div><h2>ยังไม่มีข้อที่ต้องทวน</h2><p>เมื่อทำแบบฝึก ข้อที่ยังตอบไม่ถูกจะมาอยู่ตรงนี้ พร้อมคำอธิบายและพื้นที่จดความเข้าใจ</p><button class="btn primary" ${routeAttr('practice')}>ไปลองชุดฝึก ${icon('arrow')}</button></div>`}${footnote()}`,'review','ทบทวนข้อผิด');}
function notFound(){return shell(`<div class="empty-state"><h1>ไม่พบบทนี้</h1><p>กลับไปเลือกบทเรียนจากเส้นทางกัน</p><button class="btn primary" ${routeAttr('learn')}>ดูเส้นทางเรียน</button></div>`);}

class PythonRunner {
 worker=null;ready=null;pending=null;initReject=null;initTimer=null;timeout=null;version='';
 ensure(){
  if(this.ready)return this.ready;
  this.worker=new Worker('./python-worker.js',{type:'module'});
  const worker=this.worker;
  this.ready=new Promise((resolve,reject)=>{
   this.initReject=reject;
   this.initTimer=setTimeout(()=>this.stop('โหลด Python ไม่สำเร็จภายใน 45 วินาที ลองใหม่ได้'),45000);
   this.worker.onmessage=({data})=>{
    if(this.worker!==worker)return;
    if(data.type==='ready'){clearTimeout(this.initTimer);this.version=data.version;this.initReject=null;resolve();return;}
    if(data.type==='running'&&this.pending?.id===data.id){clearTimeout(this.timeout);this.timeout=setTimeout(()=>this.stop('หยุดเมื่อครบ 8 วินาที ลองตรวจลูปที่อาจไม่จบ'),8000);return;}
    if(data.type==='case'&&this.pending?.id===data.id){const status=$('#code-live-status');if(status)status.textContent=`กำลังตรวจ test ${data.index+1}…`;return;}
    if(data.type==='result'&&this.pending?.id===data.id){clearTimeout(this.timeout);const pending=this.pending;this.pending=null;pending.resolve(data.results);return;}
    if(data.type==='error'){this.stop('Python ทำงานไม่สำเร็จ: '+data.message);}
   };
   this.worker.onerror=event=>{event.preventDefault();if(this.worker!==worker)return;this.stop('โหลดตัวรัน Python ไม่สำเร็จ ตรวจว่าเปิดผ่านเว็บเซิร์ฟเวอร์แล้วลองใหม่');};
   this.worker.postMessage({type:'init'});
  });
  return this.ready;
 }
 async run(code,cases,mode){await this.ensure();return new Promise((resolve,reject)=>{const id=Date.now()+'-'+Math.random();this.pending={id,resolve,reject};this.worker.postMessage({type:'run',id,code,cases,mode});});}
 stop(message='หยุดโปรแกรมแล้ว แก้ไขแล้วลองใหม่ได้'){
  clearTimeout(this.timeout);clearTimeout(this.initTimer);this.worker?.terminate();this.worker=null;this.ready=null;
  if(this.initReject)this.initReject(new Error(message));this.initReject=null;
  if(this.pending)this.pending.reject(new Error(message));this.pending=null;
 }
}
const runner=new PythonRunner();
async function runCode(id,mode){
 if(currentRun)return;
 const c=challengeMap.get(id),editor=$(`[data-editor="${id}"]`);if(!c||!editor)return;
 const code=editor.value;if(!code.trim()){showToast('ลองเขียนโค้ดก่อน แล้วค่อยตรวจคำตอบ');return;}
 state.codes[id]=code;state.codeAttempts[id]=(state.codeAttempts[id]||0)+1;save();
 const token=Symbol();currentRun=token;
 const cases=mode==='check'?c.tests:[{name:'Input ของคุณ',input:$('#stdin-'+id).value,output:''}];
 $('#code-result').innerHTML=`<section class="result-panel"><div class="result-summary"><span class="spinner"></span><span id="code-live-status">${runner.ready?'กำลังรันโปรแกรม…':'กำลังเตรียม Python ครั้งแรก…'}</span></div><p>หน้าบทเรียนยังใช้งานได้ กดหยุดได้หากต้องการยกเลิก</p></section>`;
 $$('[data-action="run-code"]').forEach(b=>b.disabled=true);$('[data-action="stop-code"]')?.classList.remove('hidden');
 try{
  const results=await runner.run(code,cases,mode);
  codeResults[id]={mode,results};
  if(mode==='check'&&results.length===c.tests.length&&results.every(r=>r.passed)){state.codePassed[id]=true;save();showToast('ผ่านครบทุก test case แล้ว!');}
 }catch(error){codeResults[id]={error:error.message};}
 finally{
  if(currentRun===token){currentRun=null;if($(`[data-editor="${id}"]`)){$('#code-result').innerHTML=renderCodeResult(codeResults[id],c);$$('[data-action="run-code"]').forEach(b=>b.disabled=false);$('[data-action="stop-code"]')?.classList.add('hidden');if(current.page==='lesson'){$('#completion')?.replaceWith(htmlNode(completion(lessonMap.get(current.id))))};}}
 }
}
function htmlNode(html){const template=document.createElement('template');template.innerHTML=html.trim();return template.content.firstElementChild;}
function render({keepScroll=false}={}){
 clearInterval(timerInterval);
 const scroll=window.scrollY;current=parseRoute();
 let html;
 if(current.page==='home')html=adaptiveHome();else if(current.page==='pretest')html=pretestPage(current.id);else if(current.page==='learn')html=roadmap();else if(current.page==='lesson')html=lessonPage(current.id,current.params);else if(current.page==='lab')html=labPage(current.id);else if(current.page==='practice')html=practice();else if(current.page==='exam')html=examPage(current.id);else if(current.page==='result')html=resultPage(current.id);else if(current.page==='review')html=review();else html=notFound();
 $('#app').innerHTML=html;
 document.documentElement.style.setProperty('--font-size',state.font+'px');
 document.documentElement.style.setProperty('--reader-size',state.font+'px');
 document.title=(current.page==='lesson'?lessonMap.get(current.id)?.title+' — ':'')+'ICT Study Room';
 if(keepScroll)window.scrollTo(0,scroll);else window.scrollTo(0,0);
 if($('#pretest-timer')){timerInterval=setInterval(()=>{const el=$('#pretest-timer'),r=state.pretests[current.id];if(el&&r?.startedAt)el.textContent=formatTime((Date.now()-r.startedAt)/1000);},1000);}
 if(current.page==='exam'&&state.exams[current.id]&&!state.exams[current.id].submittedAt){timerInterval=setInterval(()=>{const el=$('#exam-timer');if(el)el.textContent=formatTime((Date.now()-state.exams[current.id].startedAt)/1000);},1000);}
}
function modal(html){$('#modal-content').innerHTML=html;$('#modal').showModal();}
function closeModal(){$('#modal').close();}
function exportProgress(){
 const blob=new Blob([JSON.stringify({...state,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ict-study-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);showToast('สำรองความคืบหน้าเป็นไฟล์แล้ว');
}
function sourceModal(){modal(`<div class="row between"><h2>เรียนจากหลักฐานที่ชัดเจน</h2><button class="round-icon" data-action="close-modal" aria-label="ปิด">${icon('close')}</button></div><p>เนื้อหาตั้งต้นจากการสืบค้นวันที่ 25 ตุลาคม 2569 หัวข้อย่อยและข้อฝึกเรียบเรียงใหม่ ไม่ใช่ข้อสอบเก่า เว็บไซต์นี้ไม่ใช่เว็บไซต์ผู้จัด</p><a class="modal-source" href="https://ict.sit.kmutt.ac.th/topics" target="_blank" rel="noopener">หมวดความรู้ทางการ ปี 2026 ↗<small>ยืนยันขอบเขต 4 หมวด</small></a><a class="modal-source" href="./assets/docs/ICT2026_RulesRegulation.pdf" target="_blank" rel="noopener">กติกา ICT Challenge 2026 ↗<small>ออนไลน์ 10 ข้อรายบุคคล · รอบรองมีปรนัยและเขียนโปรแกรม</small></a><a class="modal-source" href="./assets/docs/ICT2025_RulesRegulation.pdf" target="_blank" rel="noopener">กติกาปี 2025 สำหรับเปรียบเทียบ ↗<small>ใช้ดูแนวโน้ม ไม่ใช้แทนปีปัจจุบัน</small></a><a class="modal-source" href="https://www.sit.kmutt.ac.th/ict-challenge2024/" target="_blank" rel="noopener">รายงานการแข่งขันปี 2024 โดย SIT ↗<small>ข้อมูลรูปแบบงานย้อนหลัง ไม่ใช่คลังข้อสอบ</small></a><a class="modal-source" href="https://docs.python.org/3/tutorial/controlflow.html" target="_blank" rel="noopener">Python Tutorial ↗</a><a class="modal-source" href="https://developers.google.com/machine-learning/crash-course" target="_blank" rel="noopener">Google Machine Learning Crash Course ↗</a><p style="margin-top:18px">ยังไม่พบชุดข้อสอบเก่าพร้อมเฉลยที่ตรวจสอบที่มาได้ในการค้นครั้งนี้ ส่วน runtime ใช้ Pyodide ที่รวมไฟล์ไว้ในเครื่อง โค้ดฝึกไม่ถูกส่งไปตรวจภายนอก</p><p>เกณฑ์คะแนนในเว็บเป็นเกณฑ์ฝึก รายละเอียด runtime เครื่องมือ และคะแนนจริงให้ยึดคำชี้แจงผู้จัด ความคืบหน้าเก็บเฉพาะเบราว์เซอร์และที่อยู่เว็บนี้</p>`);}
function settingsModal(){modal(`<div class="row between"><h2>พื้นที่เรียนของคุณ</h2><button class="round-icon" data-action="close-modal" aria-label="ปิด">${icon('close')}</button></div><p>ความคืบหน้า คำตอบ และโค้ดเก็บในเบราว์เซอร์นี้ ไม่มีบัญชีหรือการซิงก์ข้ามเครื่อง หากล้างข้อมูลเบราว์เซอร์ งานที่เก็บไว้จะหาย</p><div class="row wrap" style="margin:20px 0"><button class="btn" data-action="export">${icon('download')} สำรองความคืบหน้า</button><label class="btn" for="import-progress">${icon('save')} นำความคืบหน้ากลับมา</label><input class="hidden" type="file" id="import-progress" accept="application/json,.json"></div><div class="row"><span class="small muted">ขนาดตัวอักษร</span><button class="round-icon" data-action="font" data-delta="-1" aria-label="ลดขนาดตัวอักษร">A−</button><button class="round-icon" data-action="font" data-delta="1" aria-label="เพิ่มขนาดตัวอักษร">A+</button></div><hr><button class="text-link" data-action="confirm-reset" style="color:var(--red)">ล้างความคืบหน้าและเริ่มใหม่ทั้งหมด</button>`);}
function openMenu(){const menu=$('#sidebar');menu.classList.add('open');$('.mobile-overlay').classList.add('visible');$('[data-action="menu"]').setAttribute('aria-expanded','true');$('.nav-link',menu).focus();}
function closeMenu(){const wasOpen=$('#sidebar')?.classList.contains('open');$('#sidebar')?.classList.remove('open');$('.mobile-overlay')?.classList.remove('visible');$('[data-action="menu"]')?.setAttribute('aria-expanded','false');if(wasOpen)$('[data-action="menu"]')?.focus();}

document.addEventListener('click',event=>{
 const route=event.target.closest('[data-route]');if(route){nav(route.dataset.route);closeMenu();return;}
 const path=event.target.closest('[data-path]');if(path){state.path=path.dataset.path;save();render({keepScroll:true});return;}
 const filter=event.target.closest('[data-filter]');if(filter){roadmapFilter=filter.dataset.filter;render({keepScroll:true});return;}
 const filterNav=event.target.closest('[data-filter-nav]');if(filterNav){roadmapFilter=filterNav.dataset.filterNav;state.path='full';save();nav('learn');closeMenu();return;}
 const bit=event.target.closest('[data-bit]');if(bit){bit.classList.toggle('on');const on=bit.classList.contains('on');bit.textContent=on?'1':'0';bit.setAttribute('aria-pressed',String(on));const bits=$$('[data-bit].on').map(b=>Number(b.dataset.bit));$('#bit-result').textContent=bits.reduce((a,b)=>a+b,0);$('#bit-sum').textContent='= '+(bits.join(' + ')||'0');return;}
 const cloud=event.target.closest('[data-cloud]');if(cloud){$$('[data-cloud]').forEach(b=>{b.classList.toggle('primary',b===cloud);b.setAttribute('aria-pressed',String(b===cloud));});$('#cloud-responsibility').innerHTML=cloudResponsibilities(cloud.dataset.cloud);return;}
 const jump=event.target.closest('[data-exam-index]');if(jump&&!jump.disabled){const ex=state.exams[jump.dataset.exam];ex.index=Number(jump.dataset.examIndex);save();render();return;}
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;
 const action=el.dataset.action,id=el.dataset.id;
 if(adaptiveAction(el))return;
 if(action==='menu')openMenu();
 else if(action==='close-menu')closeMenu();
 else if(action==='sources')sourceModal();
 else if(action==='settings')settingsModal();
 else if(action==='close-modal')closeModal();
 else if(action==='export')exportProgress();
 else if(action==='font'){state.font=Math.min(18,Math.max(14,state.font+Number(el.dataset.delta)));document.documentElement.style.setProperty('--font-size',state.font+'px');document.documentElement.style.setProperty('--reader-size',state.font+'px');save();showToast('ขนาดตัวอักษร '+state.font+' px');}
 else if(action==='read-next'){const lesson=lessonMap.get(el.dataset.lesson),index=Number(el.dataset.step),ls=getLessonState(lesson.id);if(!ls.read.includes(index))ls.read.push(index);const steps=requiredSteps(lesson),next=steps.find(i=>i>index)??steps.find(i=>!ls.read.includes(i));save();nav(`lesson/${lesson.id}?${next===undefined?'tab=quiz':'tab=learn&step='+next}`);}
 else if(action==='complete'){const lesson=lessonMap.get(el.dataset.lesson);if(requirements(lesson).every(Boolean)||getLessonState(lesson.id).completed){const ls=getLessonState(lesson.id);ls.completed=true;ls.completionMethod??='study';ls.completedAt=Date.now();save();showToast('ยืนยันผ่านบทนี้แล้ว');advanceAdaptive(lesson.id);}}
 else if(action==='grade'){const q=questions.get(id),selected=state.drafts[id]||[];if(!selected.length)return;const correct=equalAnswers(selected,q.correct);state.answers[id]={selected:[...selected],correct,attempts:(state.answers[id]?.attempts||0)+1,at:Date.now()};if(correct)state.mastered[id]=true;save();render({keepScroll:true});}
 else if(action==='retry-question'){delete state.answers[id];delete state.drafts[id];save();if(current.page==='review'){const section=$('#question-'+id);if(section)section.outerHTML=questionView(questions.get(id),{review:true});}else render({keepScroll:true});}
 else if(action==='hint')$('#hint-'+id)?.classList.toggle('hidden');
 else if(action==='solution')$('#solution-'+id)?.classList.toggle('hidden');
 else if(action==='run-code')void runCode(id,el.dataset.mode);
 else if(action==='stop-code')runner.stop();
 else if(action==='reset-code')modal(`<h2>เริ่มโค้ดโจทย์นี้ใหม่?</h2><p>โค้ดที่เขียนไว้ในโจทย์นี้จะกลับเป็นโค้ดตั้งต้น คะแนนและบทอื่นยังอยู่</p><div class="modal-actions"><button class="btn" data-action="close-modal">เก็บไว้ก่อน</button><button class="btn primary" data-action="do-reset-code" data-id="${id}">เริ่มใหม่</button></div>`);
 else if(action==='do-reset-code'){state.codes[id]=challengeMap.get(id).starter;delete codeResults[id];save();closeModal();render({keepScroll:true});}
 else if(action==='submit-exam')confirmSubmit(id);
 else if(action==='do-submit-exam'){submitExam(id);closeModal();nav('result/'+id);}
 else if(action==='new-exam')modal(`<h2>เริ่มชุดฝึกใหม่?</h2><p>ผลครั้งล่าสุดของชุดนี้จะถูกแทนที่เมื่อส่งครั้งใหม่ ข้อที่เคยทำถูกและความคืบหน้าบทเรียนยังเก็บไว้</p><div class="modal-actions"><button class="btn" data-action="close-modal">กลับก่อน</button><button class="btn primary" data-action="do-new-exam" data-id="${id}">เริ่มทำใหม่</button></div>`);
 else if(action==='do-new-exam'){delete state.exams[id];save();closeModal();nav('exam/'+id);}
 else if(action==='net-next'){const lab=$('[data-lab="network"]');const n=(Number(lab.dataset.net)+1)%4;lab.dataset.net=n;$$('.net-stage',lab).forEach((e,i)=>e.classList.toggle('active',i===n));$('.net-detail',lab).textContent=['1/4 · เครื่องมี IP และค่าตั้งเครือข่ายแล้ว เมื่อพิมพ์ชื่อเว็บต้องหาปลายทางก่อน','2/4 · DNS ช่วยค้นระเบียนชื่อเพื่อหาที่อยู่ปลายทาง ไม่ได้แจก IP ให้ client เหมือน DHCP','3/4 · เชื่อมต่อไปยังปลายทางตามโปรโตคอลที่ใช้ เช่น HTTPS ป้องกันการสื่อสารด้วย TLS','4/4 · ส่ง HTTP request รับ response แล้ว browser นำข้อมูลไปแสดงผล อาจมี cache หรือ CDN เพิ่มเติม'][n];}
 else if(action==='confirm-reset')modal(`<h2>ล้างพื้นที่เรียนทั้งหมด?</h2><p>จะลบความคืบหน้า คำตอบ โค้ด และบันทึกบนเบราว์เซอร์นี้ ควรสำรองข้อมูลก่อนหากอยากเก็บไว้</p><div class="modal-actions"><button class="btn" data-action="close-modal">เก็บไว้ก่อน</button><button class="btn danger" data-action="do-reset">ล้างและเริ่มใหม่</button></div>`);
 else if(action==='do-reset'){Object.keys(state).forEach(k=>delete state[k]);Object.assign(state,fresh());codeResults={};save();closeModal();nav('home');}
});
function confirmSubmit(id){const ex=state.exams[id],list=examQuestions(id),missing=list.filter(q=>!(ex.answers[q.id]||[]).length).length;modal(`<h2>${missing?`ยังไม่ได้ตอบ ${missing} ข้อ`:'พร้อมดูผลแล้วหรือยัง?'}</h2><p>${missing?'ข้อที่เว้นไว้จะได้ 0 คะแนนในชุดฝึกนี้ กลับไปตอบให้ครบก่อน หรือส่งตามที่ทำไว้ได้':'ส่งแล้วจะเห็นคะแนนแยกหมวด พร้อมคำอธิบายทุกข้อ'}</p><div class="modal-actions"><button class="btn" data-action="close-modal">กลับไปตรวจ</button><button class="btn primary" data-action="do-submit-exam" data-id="${id}">ส่งและดูผล</button></div>`);}
function submitExam(id){const ex=state.exams[id];if(ex.submittedAt)return;ex.submittedAt=Date.now();ex.score=0;for(const q of examQuestions(id)){const selected=ex.answers[q.id]||[],correct=equalAnswers(selected,q.correct);if(correct)ex.score++;state.answers[q.id]={selected:[...selected],correct,at:Date.now(),attempts:(state.answers[q.id]?.attempts||0)+1};if(correct)state.mastered[q.id]=true;}save();}
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.matches('[data-uncertain]')){const r=pretestRecord(current.id);if(!r.submittedAt){r.uncertain[el.dataset.uncertain]=el.checked;save();}return;}
 if(el.matches('[data-choice]')){
  const id=el.dataset.choice,section=el.closest('[data-question]'),selected=$$('input:checked',section).map(e=>Number(e.value));
  if(section.dataset.mode==='pretest'){const r=pretestRecord(current.id);if(r.submittedAt)return;r.answers[id]=selected;save();$('#pre-answered').textContent=`ตอบแล้ว ${assessments[current.id].pre.filter(q=>(r.answers[q.id]||[]).length).length}/5 ข้อ · ข้อแกน 2 ข้อ`;}
  else if(section.dataset.mode==='exam'){state.exams[current.id].answers[id]=selected;save();const count=examQuestions(current.id).filter(q=>(state.exams[current.id].answers[q.id]||[]).length).length;$('#answered-count').textContent=`ตอบแล้ว ${count}/${examQuestions(current.id).length} ข้อ`;const qid=examQuestions(current.id).findIndex(q=>q.id===id);$(`[data-exam-index="${qid}"]`)?.classList.toggle('answered',selected.length>0);}
  else {state.drafts[id]=selected;save();const grade=$('[data-action="grade"]',section);if(grade)grade.disabled=!selected.length;}
  $$('.choice',section).forEach(label=>label.classList.toggle('selected',$('input',label).checked));
 }
 if(el.matches('[data-sheet]')){const row=Number($('[data-sheet="row"]').value),col=Number($('[data-sheet="col"]').value);$('#formula-result').textContent=`=$A${2+row}*${String.fromCharCode(66+col)}$1`;$('#formula-detail').textContent=`คัดลอก C2 → ${String.fromCharCode(67+col)}${2+row}: $A ล็อกคอลัมน์ ส่วน $1 ล็อกแถว`;}
 if(el.id==='import-progress')void importProgress(el.files[0]);
});
document.addEventListener('input',event=>{
 const el=event.target;
 if(el.matches('[data-editor]')){state.codes[el.dataset.editor]=el.value;lazySave();}
 if(el.matches('[data-note]')){state.notes[el.dataset.note]=el.value;lazySave();}
 if(el.matches('[data-metric]')){
  const vals=Object.fromEntries($$('[data-metric]').map(e=>[e.dataset.metric,Math.max(0,Math.floor(Number(e.value)||0))]));
  $('#precision').textContent=vals.TP+vals.FP?`${(vals.TP/(vals.TP+vals.FP)*100).toFixed(1)}%`:'ไม่นิยาม';
  $('#recall').textContent=vals.TP+vals.FN?`${(vals.TP/(vals.TP+vals.FN)*100).toFixed(1)}%`:'ไม่นิยาม';
 }
});
document.addEventListener('keydown',event=>{
 const el=event.target;
 if(el.matches('[data-editor]')){
  if(event.key==='Tab'){event.preventDefault();const pos=el.selectionStart,end=el.selectionEnd;if(!event.shiftKey)el.setRangeText('    ',pos,end,'end');else {const line=el.value.lastIndexOf('\n',pos-1)+1;const count=Math.min(4,(el.value.slice(line).match(/^ */)||[''])[0].length);if(count)el.setRangeText('',line,line+count,'end');}state.codes[el.dataset.editor]=el.value;lazySave();}
  if(event.key==='Enter'&&(event.ctrlKey||event.metaKey)){event.preventDefault();void runCode(el.dataset.editor,'check');}
  if(event.key==='Escape'){event.preventDefault();$('[data-action="run-code"]')?.focus();}
 }else if(event.key==='Escape')closeMenu();
});
async function importProgress(file){
 if(!file)return;
 try {
  if(file.size>2000000)throw Error('ไฟล์ใหญ่เกิน 2 MB');
  const data=JSON.parse(await file.text());if(data.version!==1)throw Error('รูปแบบไฟล์ไม่ตรงกับเว็บนี้');
  for(const k of ['lessons','answers','drafts','mastered','codes','codePassed','codeAttempts','exams','notes'])if(!data[k]||typeof data[k]!=='object'||Array.isArray(data[k]))throw Error('ข้อมูลไม่ครบหรือรูปแบบไม่ถูกต้อง');
  const clean=fresh();clean.path=data.path==='full'?'full':'rapid';
  if(lessonMap.has(data.lastLesson))clean.lastLesson=data.lastLesson;
  if(challengeMap.has(data.lastCode))clean.lastCode=data.lastCode;
  clean.font=Math.min(18,Math.max(14,Number(data.font)||15));
  for(const lesson of lessons){const saved=data.lessons[lesson.id];if(saved&&typeof saved==='object'){clean.lessons[lesson.id]={read:Array.isArray(saved.read)?[...new Set(saved.read.filter(n=>Number.isInteger(n)&&n>=0&&n<lesson.steps.length))]:[],completed:!!saved.completed};}}
  for(const q of questions.values()){
   if(data.mastered[q.id])clean.mastered[q.id]=true;
   const a=data.answers[q.id];if(a&&Array.isArray(a.selected)){const selected=[...new Set(a.selected.filter(n=>Number.isInteger(n)&&n>=0&&n<q.options.length))];clean.answers[q.id]={selected,correct:equalAnswers(selected,q.correct),at:Date.now(),attempts:1};}
   if(Array.isArray(data.drafts[q.id]))clean.drafts[q.id]=[...new Set(data.drafts[q.id].filter(n=>Number.isInteger(n)&&n>=0&&n<q.options.length))];
   if(typeof data.notes[q.id]==='string')clean.notes[q.id]=data.notes[q.id].slice(0,20000);
  }
  for(const c of challenges){if(typeof data.codes[c.id]==='string')clean.codes[c.id]=data.codes[c.id].slice(0,200000);if(data.codePassed[c.id])clean.codePassed[c.id]=true;clean.codeAttempts[c.id]=Math.max(0,Math.floor(Number(data.codeAttempts[c.id])||0));}
  if(data.pretests!==undefined&&(!data.pretests||typeof data.pretests!=='object'||Array.isArray(data.pretests)))throw Error('รูปแบบ pre-test ไม่ถูกต้อง');
  for(const lesson of lessons){
   const r=data.pretests?.[lesson.id];if(!r||r.version!==assessmentVersion)continue;
   const answers={},uncertain={};
   for(const q of assessments[lesson.id].pre){if(Array.isArray(r.answers?.[q.id]))answers[q.id]=[...new Set(r.answers[q.id].filter(n=>Number.isInteger(n)&&n>=0&&n<q.options.length))];if(r.uncertain?.[q.id]===true)uncertain[q.id]=true;}
   const startedAt=Number.isFinite(r.startedAt)?r.startedAt:null,submittedAt=Number.isFinite(r.submittedAt)&&startedAt&&r.submittedAt>=startedAt?r.submittedAt:null;
   clean.pretests[lesson.id]={version:assessmentVersion,answers,uncertain,startedAt,submittedAt,mode:['focus','full'].includes(r.mode)?r.mode:null,afterStudy:!!r.afterStudy};
   if(data.lessons[lesson.id]?.completionMethod==='pretest'&&submittedAt&&evaluatePretest(lesson.id,answers,uncertain).passed){clean.lessons[lesson.id]??={read:[],completed:false};clean.lessons[lesson.id].completed=true;clean.lessons[lesson.id].completionMethod='pretest';}
   else if(data.lessons[lesson.id]?.completionMethod==='study'&&clean.lessons[lesson.id])clean.lessons[lesson.id].completionMethod='study';
  }
  for(const id of ['D','M','S']){const ex=data.exams[id];if(ex&&typeof ex==='object'&&Number.isFinite(ex.startedAt)&&ex.answers&&typeof ex.answers==='object'){const answers={};for(const q of examQuestions(id))if(Array.isArray(ex.answers[q.id]))answers[q.id]=[...new Set(ex.answers[q.id].filter(n=>Number.isInteger(n)&&n>=0&&n<q.options.length))];clean.exams[id]={startedAt:ex.startedAt,answers,index:Math.min(examQuestions(id).length-1,Math.max(0,Number(ex.index)||0))};if(Number.isFinite(ex.submittedAt)){clean.exams[id].submittedAt=ex.submittedAt;clean.exams[id].score=examQuestions(id).filter(q=>equalAnswers(answers[q.id]||[],q.correct)).length;}}}
  modal(`<h2>นำความคืบหน้าจากไฟล์นี้มาใช้?</h2><p>ข้อมูลบนเบราว์เซอร์นี้จะถูกแทนที่ด้วยไฟล์ที่เลือก ควรสำรองข้อมูลปัจจุบันก่อนหากต้องการเก็บไว้</p><div class="modal-actions"><button class="btn" data-action="close-modal">ยกเลิก</button><button class="btn primary" id="confirm-import">นำข้อมูลมาใช้</button></div>`);
  $('#confirm-import').addEventListener('click',()=>{Object.assign(state,clean);save();closeModal();nav('home');showToast('นำความคืบหน้ากลับมาแล้ว');},{once:true});
 }catch(error){showToast('อ่านไฟล์ไม่ได้: '+error.message);}
}
window.addEventListener('hashchange',()=>{if(currentRun)runner.stop('หยุดเมื่อเปลี่ยนหน้า โค้ดยังบันทึกอยู่');render();});
$('#modal').addEventListener('click',event=>{if(event.target===$('#modal')){const rect=$('#modal').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeModal();}});
render();
