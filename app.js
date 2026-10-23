'use strict';
const $=id=>document.getElementById(id), KEY='tarot-oracle-history-v1';
let current=null, shown=new Set(), records=[];
const themes={工作:'工作上，將這個提示對照你的目標、資源與合作方式。',感情:'感情上，將這個提示對照自己的需求、界線與實際溝通；別以牌面推定他人的心意。',家庭:'家庭中，將這個提示對照分工、照顧需求與彼此的界線。',其他:'想一件可以確認的事實，以及一項自己能採取的小行動。'};
function message(t){$('message').textContent=t;}
function node(tag,text,cls){const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;}
function persist(next){try{localStorage.setItem(KEY,JSON.stringify(next));records=next;return true;}catch{message('無法儲存，瀏覽器可能停用儲存空間或空間已滿。請下載文字備份。');return false;}}
function valid(r){return r&&typeof r.key==='string'&&typeof r.date==='string'&&typeof r.question==='string'&&typeof r.note==='string'&&Object.hasOwn(themes,r.category)&&Array.isArray(r.cards)&&r.cards.length===5&&new Set(r.cards.map(c=>c.id)).size===5&&r.cards.every(c=>Number.isInteger(c.id)&&c.id>=0&&c.id<22&&typeof c.reversed==='boolean');}
try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(data)||!data.every(valid))throw Error();records=data;}catch{message('無法讀取本機紀錄；既有資料未被覆寫。可繼續抽牌並下載文字備份。');}
function meaning(c){const card=Tarot.cards[c.id];return `${c.reversed?card.down:card.up}。${c.reversed?card.reverseAdvice:card.advice}`;}
function fullText(r){return ['拾光 · 塔羅手記｜五張直抽大十字',new Date(r.date).toLocaleString('zh-TW'),`主題：${r.category}`,`問題：${r.question||'未填寫'}`,...r.cards.map((c,i)=>`${i+1} ${Tarot.positions[i][0]}｜${Tarot.cards[c.id].name}・${c.reversed?'逆位':'正位'}\n${Tarot.positions[i][1]}${meaning(c)}`),themes[r.category],`我的觀察：${r.note||'未填寫'}`,'預先整理牌義，供自我反思；問題備註不參與解讀。'].join('\n\n');}
function download(content,name,type){const url=URL.createObjectURL(new Blob([content],{type}));const a=node('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function render(){
 $('result').hidden=false;$('context').textContent=`${current.category} · ${current.question||'留一點空間給當下的感受'}`;
 $('spread').replaceChildren();
 current.cards.forEach((c,i)=>{const card=Tarot.cards[c.id],visible=shown.has(i),b=node('button',undefined,`tarot slot-${i}${visible?' face':''}`);b.type='button';b.disabled=visible||i!==shown.size;b.setAttribute('aria-label',visible?`${i+1} ${Tarot.positions[i][0]} ${card.name} ${c.reversed?'逆位':'正位'}`:`翻開第 ${i+1} 張：${Tarot.positions[i][0]}`);b.append(node('span',`${String(i+1).padStart(2,'0')} · ${Tarot.positions[i][0]}`,'position'));if(visible){b.append(node('small',String(c.id).padStart(2,'0')),node('span',card.symbol,`symbol${c.reversed?' upside':''}`),node('strong',card.name),node('span',card.en,'english'),node('span',c.reversed?'逆位':'正位','orientation'));}else{b.append(node('span','✦','symbol'),node('span',i===shown.size?'點擊翻牌':'等待翻牌','back-text'));}b.onclick=()=>{shown.add(i);render();};$('spread').append(b);});
 const complete=shown.size===5;$('reading').hidden=!complete;$('reveal').disabled=complete;
 if(complete){$('interpretation').replaceChildren();current.cards.forEach((c,i)=>{const section=node('section');section.append(node('h3',`${i+1} · ${Tarot.positions[i][0]}｜${Tarot.cards[c.id].name}・${c.reversed?'逆位':'正位'}`),node('p',Tarot.positions[i][1]),node('p',meaning(c)));$('interpretation').append(section);});$('synthesis').textContent=`先從「${Tarot.cards[current.cards[0].id].name}」辨認當下，再以「${Tarot.cards[current.cards[2].id].name}」的建議選一個小行動。「${Tarot.cards[current.cards[4].id].name}」提供整體反思課題。${themes[current.category]}`;}
}
$('form').onsubmit=e=>{e.preventDefault();if(current)current.note=$('note').value;current={key:crypto.randomUUID(),date:new Date().toISOString(),category:$('category').value,question:$('question').value.trim(),note:'',cards:Tarot.draw($('reversed').checked)};shown=new Set();$('note').value='';$('save').disabled=false;render();message('已抽出五張牌。請從第一張開始翻牌。');$('result').scrollIntoView({behavior:'smooth',block:'start'});};
$('reveal').onclick=()=>{shown=new Set([0,1,2,3,4]);render();};
$('save').onclick=()=>{if(!current||shown.size<5)return;current.note=$('note').value;if(persist([{...current},...records.filter(r=>r.key!==current.key)])){renderHistory();message('已儲存這次塔羅手記。');}};
$('copy').onclick=async()=>{current.note=$('note').value;try{await navigator.clipboard.writeText(fullText(current));message('已複製解讀。');}catch{message('瀏覽器未允許複製，請使用「下載文字」。');}};
$('download').onclick=()=>{current.note=$('note').value;download(fullText(current),'塔羅手記.txt','text/plain;charset=utf-8');};
$('export').onclick=()=>{if(!records.length){message('還沒有已儲存的紀錄。');return;}download(JSON.stringify(records,null,2),'塔羅手記備份.json','application/json');};
function renderHistory(){ $('history').replaceChildren();if(!records.length){$('history').append(node('p','還沒有紀錄。從一個問題、五張牌開始。','empty'));return;}records.forEach(r=>{const a=node('article',undefined,'history-item');a.append(node('small',`${new Date(r.date).toLocaleString('zh-TW')} · ${r.category}`),node('h3',r.question||'未填寫問題'),node('p',r.cards.map(c=>`${Tarot.cards[c.id].name}（${c.reversed?'逆':'正'}）`).join(' · ')));if(r.note)a.append(node('p',r.note));const actions=node('div',undefined,'actions'),view=node('button','查看'),del=node('button','刪除');view.onclick=()=>{current=structuredClone(r);shown=new Set([0,1,2,3,4]);$('note').value=r.note;$('save').disabled=false;render();$('result').scrollIntoView({behavior:'smooth'});message('已載入紀錄；再次儲存會更新這筆紀錄。');};del.onclick=()=>{if(confirm('刪除這筆塔羅手記？')){if(persist(records.filter(x=>x.key!==r.key)))renderHistory();}};actions.append(view,del);a.append(actions);$('history').append(a);});}
renderHistory();

