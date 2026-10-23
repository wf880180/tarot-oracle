const assert=require('node:assert/strict');
const {cards,draw,positions}=require('./core.js');
assert.equal(cards.length,22);assert.equal(positions.length,5);assert.equal(new Set(cards.map(c=>c.id)).size,22);
for(const c of cards)for(const key of ['name','en','symbol','up','down','advice','reverseAdvice'])assert.ok(c[key]);
for(let i=0;i<1000;i++){const r=draw();assert.equal(r.length,5);assert.equal(new Set(r.map(c=>c.id)).size,5);assert.ok(r.every(c=>c.id>=0&&c.id<22&&typeof c.reversed==='boolean'));assert.ok(draw(false).every(c=>!c.reversed));}
assert.deepEqual(draw(true,()=>0),[0,1,2,3,4].map(id=>({id,reversed:false})));
assert.deepEqual(draw(true,n=>n-1),[21,20,19,18,17].map(id=>({id,reversed:true})));
console.log('PASS: 22 張牌、五個牌位、1000 次不重複抽牌、全正位及抽牌邊界。');
