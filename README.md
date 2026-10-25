# 拾光 · 塔羅手記

JavaScript 靜態網頁，發布於 https://wf880180.github.io/tarot-oracle/ 。無須安裝套件；核心抽牌邏輯維持 JavaScript。

## 使用流程

1. 以圓點單選偉特、托特或馬賽塔羅，查看卡背與愚者預覽。
2. 按「使用這副牌，下一步」，填主題與問題，選擇是否包含逆位。
3. 固定從所選牌組的 22 張大阿爾克那中不重複抽五張。
4. 逐張翻開或翻開全部，閱讀後儲存手記。

牌陣維持五張直抽大十字：現況（左）、阻礙（右）、建議（上）、發展（下）、整體結果（中）。不使用四張牌號加總求第五張的版本。不提供 78 張牌庫或其他牌陣選項。

## 三種牌組

- 偉特：力量 VIII、正義 XI。
- 托特：調整 VIII、慾望 XI、藝術 XIV、新紀元 XX、宇宙 XXI；預設不使用逆位，可自行開啟現代反思式逆位。
- 馬賽：正義 VIII、力量 XI，愚者無印刷編號；本工具內部以 id 0 儲存愚者。

`core.js` 保留 22 張牌的固定象徵 id，使用 Web Crypto 拒絕取樣亂數抽取五張，並獨立決定正逆位。`decks.js` 依牌組映射牌名、印刷編號、牌義與提示；因此流派號碼差異不影響舊紀錄中的牌身分。

解讀為現代語入門整理，非原典逐字翻譯、專業完整流派教學或即時 AI 預測。不計算占星、卡巴拉與元素尊貴。問題只作備註。

## 圖片預覽與來源

`assets/` 僅有卡背與愚者的小型辨識預覽。實際抽牌的卡背及愚者使用對應圖片，其餘 21 張以幾何符號與牌名呈現。目前並未收錄三副完整22張牌畫。圖片權利屬原作者／出版社，僅用於流派辨識比較，不表示合作或授權銷售。

- 偉特（Rider–Waite／U.S. Games 版）：https://www.aeclectic.net/tarot/cards/rider-waite/ ，愚者 rider-waite-03676.jpg，卡背 rider-waite-03684.jpg。
- 托特（Aleister Crowley／Frieda Harris）：https://www.aeclectic.net/tarot/cards/aleister-crowley-thoth/ ，愚者 aleister-crowley-thoth-03685.jpg，卡背 aleister-crowley-thoth-03694.jpg。
- 馬賽歷史愚者（Jean Dodal, 1701–1715，公共領域）：https://commons.wikimedia.org/wiki/File:Jean_Dodal_Tarot_trump_Fool.jpg 。
- 馬賽現代 Dodal 系卡背：https://www.learntarot.com/mrdesc.htm ，mrback.gif。馬賽兩張示範圖非同一印次，頁面有註明。

馬賽並非單一出版社牌組，因此使用具名代表版本，不宣稱卡背為所有馬賽牌的共同圖樣。

## 紀錄與部署

紀錄只儲存在目前網站、目前瀏覽器的 localStorage，不會上傳 GitHub。舊版紀錄未存牌組時，預設為偉特，可繼續查看與更新。可複製、下載文字或匯出 JSON 備份（目前無匯入功能）。讀取紀錄失敗時不覆蓋原始資料，仍可抽牌與下載文字。

GitHub Pages 使用 main 分支的 /(root)；部署檔案為 index.html、style.css、core.js、decks.js、app.js、assets/、.nojekyll、README.md、test.cjs。不要上傳 .openai、tmp、預覽伺服器或生成草稿。

## 驗證

執行 `node test.cjs`：驗證1000次不重複抽牌、正逆位邊界、三副各22張、編號映射與六張圖片存在。瀏覽器驗證涵蓋先選牌才能繼續、托特全正位預設、五張抽牌、翻牌解讀與牌組紀錄重新載入。
