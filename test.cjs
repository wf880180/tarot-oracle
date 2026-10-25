const assert=require('node:assert/strict');
const {cards,draw,positions}=require('./core.js');
assert.equal(cards.length,22);assert.equal(positions.length,5);assert.equal(new Set(cards.map(c=>c.id)).size,22);
for(const c of cards)for(const key of ['name','en','symbol','up','down','advice','reverseAdvice'])assert.ok(c[key]);
for(let i=0;i<1000;i++){const r=draw();assert.equal(r.length,5);assert.equal(new Set(r.map(c=>c.id)).size,5);assert.ok(r.every(c=>c.id>=0&&c.id<22&&typeof c.reversed==='boolean'));assert.ok(draw(false).every(c=>!c.reversed));}
assert.deepEqual(draw(true,()=>0),[0,1,2,3,4].map(id=>({id,reversed:false})));
assert.deepEqual(draw(true,n=>n-1),[21,20,19,18,17].map(id=>({id,reversed:true})));
console.log('PASS: 22 張牌、五個牌位、1000 次不重複抽牌、全正位及抽牌邊界。');
global.Tarot={cards};
const {configs,getCard}=require('./decks.js');
const fs=require('node:fs'),path=require('node:path');
assert.deepEqual(Object.keys(configs),['waite','thoth','marseille']);
for(const [deck,config]of Object.entries(configs)){
 const mapped=cards.map(c=>getCard(deck,c.id));
 assert.equal(mapped.length,22);assert.equal(new Set(mapped.map(c=>c.id)).size,22);
 for(const c of mapped)for(const k of ['name','en','up','down','advice','reverseAdvice'])assert.ok(c[k]);
 assert.equal(new Set(mapped.map(c=>c.number)).size,22);
 for(const image of [config.back,config.front])assert.ok(fs.statSync(path.join(__dirname,image)).size>1000);
}
assert.equal(getCard('waite',8).number,8);assert.equal(getCard('waite',11).number,11);
assert.equal(getCard('thoth',8).name,'慾望');assert.equal(getCard('thoth',8).number,11);
assert.equal(getCard('thoth',11).name,'調整');assert.equal(getCard('thoth',11).number,8);
assert.equal(getCard('marseille',0).number,null);assert.equal(getCard('marseille',8).number,11);
assert.notEqual(getCard('thoth',14).advice,getCard('waite',14).advice);
assert.notEqual(getCard('marseille',0).advice,getCard('waite',0).advice);
assert.throws(()=>getCard('unknown',0));assert.throws(()=>getCard('waite',22));
assert.equal(cards[8].name,'力量');
console.log('PASS: 三牌組各22張、流派牌名與編號、牌義差異、六張圖片檔案。');
