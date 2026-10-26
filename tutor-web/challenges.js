export const challenges = [
 {
  id:'sum-range',lesson:'F2',title:'รวมเลข 1 ถึง n',level:'เริ่มต้น',skill:'Loop · Accumulator',
  description:'รับจำนวนเต็ม n แล้วแสดงผลรวม 1 + 2 + … + n ถ้า n เป็น 0 ให้ตอบ 0 ลองใช้ลูปก่อน แล้วจึงคิดว่ามีสูตรที่เร็วกว่าไหม',
  input:'หนึ่งบรรทัด: จำนวนเต็ม n โดย 0 ≤ n ≤ 1,000,000',output:'หนึ่งบรรทัด: ผลรวมเป็นจำนวนเต็ม',
  starter:'n = int(input())\n\n# คำนวณผลรวม แล้ว print คำตอบ\n',
  hint:'เริ่ม total = 0 แล้ววน i ใน range(1, n + 1) บวก i เข้า total ก่อน print หลังจบลูป ระวัง n=0',
  solution:'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)\n',
  tests:[{name:'ตัวอย่าง',input:'5\n',output:'15\n'},{name:'ค่าต่ำสุด',input:'0\n',output:'0\n'},{name:'หนึ่งจำนวน',input:'1\n',output:'1\n'},{name:'มากขึ้น',input:'10\n',output:'55\n'},{name:'ตรวจขอบลูป',input:'100\n',output:'5050\n'}]
 },
 {
  id:'even-odd',lesson:'P1',title:'นับเลขคู่ รวมเลขคี่',level:'เริ่มต้น',skill:'Array · Conditions',
  description:'รับจำนวนเต็ม n ตัว แสดงจำนวนสมาชิกที่เป็นเลขคู่ และผลรวมของสมาชิกที่เป็นเลขคี่ ค่าศูนย์เป็นเลขคู่ และจำนวนติดลบก็นับตามความเป็นคู่คี่ตามปกติ',
  input:'บรรทัดแรก n (1 ≤ n ≤ 100,000) บรรทัดที่สองมี n จำนวน แต่ละค่าอยู่ระหว่าง −1,000,000 ถึง 1,000,000',output:'หนึ่งบรรทัด: จำนวนเลขคู่ ตามด้วยผลรวมเลขคี่ คั่นด้วยช่องว่าง',
  starter:'n = int(input())\nvalues = list(map(int, input().split()))\n\n# นับเลขคู่และสะสมผลรวมเลขคี่\n',
  hint:'ใช้ตัวแปรสองตัว เริ่ม 0 ทั้งคู่ ถ้า value % 2 == 0 เพิ่มตัวนับ มิฉะนั้นเพิ่มผลรวมเลขคี่ แล้ว print ทั้งสองค่า',
  solution:'n = int(input())\nvalues = list(map(int, input().split()))\neven_count = 0\nodd_sum = 0\nfor value in values:\n    if value % 2 == 0:\n        even_count += 1\n    else:\n        odd_sum += value\nprint(even_count, odd_sum)\n',
  tests:[{name:'ตัวอย่าง',input:'5\n1 2 3 4 5\n',output:'2 9\n'},{name:'ค่าศูนย์',input:'1\n0\n',output:'1 0\n'},{name:'เลขติดลบ',input:'4\n-3 -2 0 7\n',output:'2 4\n'},{name:'เลขคู่ทั้งหมด',input:'3\n2 4 6\n',output:'3 0\n'},{name:'เลขคี่ทั้งหมด',input:'3\n-1 1 3\n',output:'0 3\n'}]
 },
 {
  id:'binary-search',lesson:'P2',title:'พบหรือไม่ ในข้อมูลเรียง',level:'ประยุกต์',skill:'Binary search',
  description:'รับ array ที่เรียงจากน้อยไปมากและค่าค้นหา q ค่า ตอบ YES ถ้าพบแต่ละค่า หรือ NO ถ้าไม่พบ ให้ฝึก binary search หรือ bisect แทนการค้นทีละตัว',
  input:'บรรทัดแรก n q; บรรทัดที่สอง n จำนวนเรียงแล้ว; บรรทัดที่สาม q ค่าที่ค้นหา โดย 1 ≤ n,q ≤ 100,000 และแต่ละค่าอยู่ในช่วง −10⁹ ถึง 10⁹',output:'q บรรทัด แต่ละบรรทัดเป็น YES หรือ NO ตามลำดับค่าค้นหา',
  starter:'n, q = map(int, input().split())\nvalues = list(map(int, input().split()))\ntargets = list(map(int, input().split()))\n\nfor target in targets:\n    # ค้นหา target แล้ว print YES หรือ NO\n    pass\n',
  hint:'เริ่ม left=0, right=n-1 ขณะที่ left<=right ให้เทียบค่ากลาง ถ้าน้อยกว่า target ขยับ left=mid+1 มิฉะนั้นลด right=mid-1 อย่าลืมกรณีพบและกรณีจบโดยไม่พบ',
  solution:'from bisect import bisect_left\nn, q = map(int, input().split())\nvalues = list(map(int, input().split()))\ntargets = list(map(int, input().split()))\nfor target in targets:\n    i = bisect_left(values, target)\n    print("YES" if i < n and values[i] == target else "NO")\n',
  tests:[{name:'ตัวอย่าง',input:'5 3\n2 5 8 12 19\n12 4 2\n',output:'YES\nNO\nYES\n'},{name:'สมาชิกเดียว',input:'1 3\n0\n0 -1 1\n',output:'YES\nNO\nNO\n'},{name:'ข้อมูลซ้ำ',input:'4 3\n1 1 1 3\n1 2 3\n',output:'YES\nNO\nYES\n'},{name:'ติดลบและขอบปลาย',input:'3 4\n-5 0 9\n-5 9 -6 10\n',output:'YES\nYES\nNO\nNO\n'}]
 },
 {
  id:'frequency',lesson:'P3',title:'อักษรที่พบบ่อยที่สุด',level:'ประยุกต์',skill:'Frequency · Tie-break',
  description:'รับข้อความตัวพิมพ์เล็ก a–z แสดงอักษรที่พบบ่อยที่สุดและจำนวนครั้ง ถ้ามีหลายอักษรเสมอกัน ให้เลือกอักษรที่มาก่อนตามลำดับ a–z',
  input:'หนึ่งบรรทัด: ข้อความ a–z ยาว 1 ถึง 100,000 ตัว ไม่มีช่องว่าง',output:'หนึ่งบรรทัด: อักษร ตามด้วยจำนวนครั้ง คั่นด้วยช่องว่าง',
  starter:'text = input().strip()\n\n# นับความถี่ แล้วตัดสินกรณีเสมอ\n',
  hint:'เก็บ counts ของแต่ละอักษร จากนั้นวนอักษรที่เรียง a–z อัปเดต best เฉพาะเมื่อพบจำนวนมากกว่าเดิม จะคงอักษรที่มาก่อนเมื่อเสมอ',
  solution:'text = input().strip()\ncounts = {}\nfor ch in text:\n    counts[ch] = counts.get(ch, 0) + 1\nbest = min(counts, key=lambda ch: (-counts[ch], ch))\nprint(best, counts[best])\n',
  tests:[{name:'ตัวอย่าง',input:'banana\n',output:'a 3\n'},{name:'เสมอและพบ b ก่อน',input:'bbaa\n',output:'a 2\n'},{name:'อักษรเดียว',input:'z\n',output:'z 1\n'},{name:'เท่ากันทั้งหมด',input:'zyxcba\n',output:'a 1\n'},{name:'เสมอหลายตัว',input:'ccbbbaaa\n',output:'a 3\n'}]
 },
 {
  id:'prefix-sum',lesson:'P4',title:'ผลรวมช่วงหลายคำถาม',level:'ท้าทาย',skill:'Prefix sum · Indexing',
  description:'รับ array และคำถาม q ช่วง l..r ให้แสดงผลรวมในแต่ละช่วง โดยโจทย์นี้ใช้ตำแหน่งเริ่มที่ 1 และรวมปลายทั้งสองด้าน เตรียม prefix sum เพื่อไม่ต้องเดินรวมใหม่ทุกช่วง',
  input:'บรรทัดแรก n q; บรรทัดถัดไป n จำนวน; ตามด้วย q บรรทัด l r โดย 1 ≤ l ≤ r ≤ n และ n,q ≤ 100,000 ค่าสมาชิกอยู่ในช่วง −10⁶ ถึง 10⁶',output:'q บรรทัด แต่ละบรรทัดเป็นผลรวมช่วงนั้น',
  starter:'n, q = map(int, input().split())\nvalues = list(map(int, input().split()))\n\n# เตรียม prefix sum\n\nfor _ in range(q):\n    left, right = map(int, input().split())\n    # print ผลรวมช่วง left..right (ตำแหน่งเริ่ม 1)\n',
  hint:'สร้าง prefix=[0] แล้ว append(prefix[-1]+value) สำหรับโจทย์ที่เริ่มตำแหน่ง 1 คำตอบช่วง left..right คือ prefix[right]-prefix[left-1]',
  solution:'n, q = map(int, input().split())\nvalues = list(map(int, input().split()))\nprefix = [0]\nfor value in values:\n    prefix.append(prefix[-1] + value)\nfor _ in range(q):\n    left, right = map(int, input().split())\n    print(prefix[right] - prefix[left - 1])\n',
  tests:[{name:'ตัวอย่าง',input:'4 3\n3 1 4 2\n1 4\n2 4\n3 3\n',output:'10\n7\n4\n'},{name:'สมาชิกเดียว',input:'1 1\n-5\n1 1\n',output:'-5\n'},{name:'ติดลบและศูนย์',input:'3 3\n-2 0 5\n1 2\n2 3\n1 3\n',output:'-2\n5\n3\n'},{name:'ช่วงต้นและท้าย',input:'5 2\n1 2 3 4 5\n1 1\n5 5\n',output:'1\n5\n'}]
 },
 {
  id:'brackets',lesson:'C2',title:'วงเล็บสมดุล',level:'ท้าทาย',skill:'Stack · Edge cases',
  description:'รับข้อความที่มีเฉพาะวงเล็บ ()[]{} ให้ตอบ YES ถ้าวงเล็บทุกคู่จับคู่ถูกชนิดและซ้อนกันถูกลำดับ มิฉะนั้นตอบ NO ข้อความว่างถือว่าสมดุล',
  input:'หนึ่งบรรทัด: ข้อความยาว 0 ถึง 100,000 ตัว มีเฉพาะ ()[]{}',output:'หนึ่งบรรทัด: YES หรือ NO',
  starter:'text = input().strip()\nstack = []\n\n# ตรวจชนิดและลำดับวงเล็บ แล้ว print YES หรือ NO\n',
  hint:'ถ้าเป็นวงเล็บเปิดให้ push ถ้าเป็นวงเล็บปิด stack ต้องไม่ว่างและ top ต้องตรงคู่ เมื่อจบ stack ต้องว่างด้วย ใช้ dict จับคู่ปิด→เปิด',
  solution:'text = input().strip()\nstack = []\npairs = {")": "(", "]": "[", "}": "{"}\nvalid = True\nfor ch in text:\n    if ch in "([{":\n        stack.append(ch)\n    elif not stack or stack.pop() != pairs[ch]:\n        valid = False\n        break\nprint("YES" if valid and not stack else "NO")\n',
  tests:[{name:'ตัวอย่าง',input:'([]){}\n',output:'YES\n'},{name:'ซ้อนผิดลำดับ',input:'([)]\n',output:'NO\n'},{name:'ปิดก่อนเปิด',input:') (\n'.replace(' ',''),output:'NO\n'},{name:'เปิดค้าง',input:'((\n',output:'NO\n'},{name:'ข้อความว่าง',input:'\n',output:'YES\n'},{name:'หลายชั้น',input:'{[()()]}\n',output:'YES\n'}]
 }
];
