from pathlib import Path
import re,json
root=Path(__file__).resolve().parents[2]
source=(root/'study/03_PRACTICE.md').read_text()
answer=(root/'study/04_ANSWERS.md').read_text()
keys={}
for q,letters,explanation in re.findall(r'^\| (D\d+) \| ([A-D, ]+) \| (.*?) \|$',answer,re.M):
    keys[q]=([ord(c)-65 for c in letters if c in 'ABCD'],explanation)
for match in re.finditer(r'^### (M\d+): ([A-D, ]+)(?: — [^\n]*)?\n(.*?)(?=^### M\d+:|^## หลังตรวจ|\Z)',answer,re.M|re.S):
    q,letters,explanation=match.groups()
    explanation=re.sub(r'```.*?```','',explanation,flags=re.S)
    explanation=re.sub(r'^\|.*\n?','',explanation,flags=re.M).strip()
    keys[q]=([ord(c)-65 for c in letters if c in 'ABCD'],explanation)
questions=[]
for match in re.finditer(r'\*\*((?:D|M)\d+) — (.*?)\*\* (.*?)(?=\n\*\*(?:D|M)\d+ —|\n## |\n### |\Z)',source,re.S):
    q,kind,body=match.groups()
    start=re.search(r'(?:^|\n)A\. ',body)
    if not start: raise ValueError(q)
    prompt=body[:start.start()].strip()
    options=re.split(r'(?:^|\n| {2,})[A-D]\. ',body[start.start():].strip())[1:]
    options=[o.strip() for o in options]
    assert len(options)==4,(q,options)
    if q.startswith('D'):
        domain=['network','programming','data','productivity'][(int(q[1:])-1)//5]
    else:
        domain='network' if int(q[1:])<=3 else 'programming' if int(q[1:])<=6 else 'data' if int(q[1:])<=8 else 'productivity'
    questions.append(dict(id=q,domain=domain,multi='ทุกข้อ' in kind,prompt=prompt,options=options,correct=keys[q][0],explanation=keys[q][1]))
assert len(questions)==30
out=root/'tutor-web/data/questions.json'
out.write_text(json.dumps(questions,ensure_ascii=False,indent=2))
print('Imported',len(questions),'original practice questions')
