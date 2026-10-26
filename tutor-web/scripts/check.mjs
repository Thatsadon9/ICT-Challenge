import {readFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {lessons,extraQuestions} from '../lessons.js';
import {challenges} from '../challenges.js';
import {assessments,assessmentQuestions,cram,urgentOrder,evaluatePretest,sprintQuestionIds} from '../assessment.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const questions=[...JSON.parse(readFileSync(path.join(root,'data/questions.json'),'utf8')),...extraQuestions,...assessmentQuestions];
const ids=new Set(questions.map(q=>q.id));
assert.equal(ids.size,questions.length,'duplicate question IDs');
assert.equal(lessons.length,17);
assert.equal(questions.length,188);
assert.equal(assessmentQuestions.length,136);
assert.equal(urgentOrder.length,10);
assert.equal(new Set(sprintQuestionIds).size,10);
assert.ok(sprintQuestionIds.every(id=>ids.has(id)));
assert.ok(sprintQuestionIds.every(id=>id.startsWith('CHK-')));
for(const q of questions){
 assert.equal(q.options.length,4,q.id);
 assert.ok(q.prompt&&q.explanation,q.id);
 assert.ok(q.correct.length>=1,q.id);
 if(!q.multi)assert.equal(q.correct.length,1,q.id);
 assert.equal(new Set(q.correct).size,q.correct.length,q.id);
 assert.ok(q.correct.every(i=>Number.isInteger(i)&&i>=0&&i<4),q.id);
}
for(const lesson of lessons){
 assert.ok(lesson.steps.length>=3,lesson.id);
 assert.ok(lesson.quiz.every(id=>ids.has(id)),lesson.id);
 assert.ok(lesson.steps.every(s=>s.title&&s.html),lesson.id);
 if(lesson.challenge)assert.ok(challenges.some(c=>c.id===lesson.challenge),lesson.id);
 const bank=assessments[lesson.id];
 assert.equal(bank.pre.length,5,lesson.id);
 assert.equal(bank.post.length,3,lesson.id);
 assert.equal(bank.pre.filter(q=>q.core).length,2,lesson.id);
 assert.equal(cram[lesson.id].length,lesson.steps.length,lesson.id);
 assert.ok(bank.pre.every(q=>q.reviewSteps.length&&q.reviewSteps.every(n=>n>=0&&n<lesson.steps.length)),lesson.id);
 assert.ok(bank.post.every(q=>!bank.pre.some(p=>p.id===q.id||p.prompt===q.prompt)),lesson.id);
 const all=Object.fromEntries(bank.pre.map(q=>[q.id,q.correct]));
 assert.equal(evaluatePretest(lesson.id,all).passed,true,lesson.id);
 const core=bank.pre.find(q=>q.core),noncore=bank.pre.find(q=>!q.core);
 const wrongCore={...all,[core.id]:[]};
 const coreResult=evaluatePretest(lesson.id,wrongCore);
 assert.equal(coreResult.score,4);assert.equal(coreResult.passed,false);
 assert.ok(core.reviewSteps.every(i=>coreResult.reviewSteps.includes(i)));
 assert.equal(evaluatePretest(lesson.id,{...all,[noncore.id]:[]}).passed,true);
 const twoWrong={...all};for(const q of bank.pre.filter(q=>!q.core).slice(0,2))twoWrong[q.id]=[];
 assert.equal(evaluatePretest(lesson.id,twoWrong).passed,false);
 const multi=bank.pre.find(q=>q.multi);
 if(multi){const extra=[0,1,2,3].find(i=>!multi.correct.includes(i));if(extra!==undefined)assert.equal(evaluatePretest(lesson.id,{...all,[multi.id]:[...multi.correct,extra]}).score,4);}
 const uncertain=evaluatePretest(lesson.id,all,{[noncore.id]:true});
 assert.equal(uncertain.score,5);assert.equal(uncertain.passed,true);
 assert.ok(noncore.reviewSteps.every(i=>uncertain.reviewSteps.includes(i)));
}
let total=0;
const normalize=s=>s.replace(/\r\n/g,'\n').split('\n').map(s=>s.trimEnd()).join('\n').trimEnd();
for(const challenge of challenges){
 for(const test of challenge.tests){
  const result=execFileSync('python3',['-c',challenge.solution],{input:test.input,encoding:'utf8',timeout:8000});
  assert.equal(normalize(result),normalize(test.output),challenge.id+' / '+test.name);
  total++;
 }
}
let snippets=0;
for(const question of assessmentQuestions){
 const match=question.prompt.match(/```python\n([\s\S]*?)```/);
 if(!match||!match[1].includes('print('))continue;
 const output=execFileSync('python3',['-c',match[1]],{encoding:'utf8',timeout:3000}).trim();
 assert.equal(question.correct.length,1,question.id);
 assert.equal(output,question.options[question.correct[0]],question.id);
 snippets++;
}
for(const name of ['pyodide.js','pyodide.asm.mjs','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json','LICENSE'])assert.ok(existsSync(path.join(root,'assets/pyodide',name)),name);
assert.ok(existsSync(path.join(root,'assets/NotoSansThai.ttf')));
console.log(`PASS: ${lessons.length} lessons; ${questions.length} unique questions (85 pre-test + 51 transfer + 52 existing); all skip/core/focus rules for 17 lessons; ${snippets} executable assessment snippets; ${challenges.length} coding challenges / ${total} solution cases; local assets.`);
