# Agent 工作區

這個資料夾讓 Claude Code 與 OpenAI Codex 用同一套工作方式接手 CHARM VILLA。原則是「入口短、狀態可續接、修正可累積」：穩定規則只放在根目錄 `AGENTS.md`，會變動的計畫與經驗則留在這裡，避免大型 handoff 變成互相矛盾的第二份規格。

## 每次開始的閱讀順序

1. [`../../AGENTS.md`](../../AGENTS.md)：權限、架構、品牌與驗證等穩定規則。
2. [`PLAN.md`](PLAN.md)：目前是否有未完成任務、下一步與證明方式。
3. [`LESSONS.md`](LESSONS.md)：使用者最近糾正過、最容易再次踩到的行為。
4. [`../CODEX_HANDOFF.md`](../CODEX_HANDOFF.md)：主線歷史、Preview、WIP 分支與外部依賴的時間點快照。
5. 任務直接相關的 `.translation/`、`docs/qa/`、`docs/research/` 或程式碼相鄰註解；不要為了「完整閱讀」載入無關歷史。

`CLAUDE.md` 只以 `@AGENTS.md` 導入相同入口，不另複製規則。Codex 直接讀 `AGENTS.md`。兩邊不得各自維護一份專案事實。

## 文件責任

| 文件 | 放什麼 | 何時更新 |
| --- | --- | --- |
| `AGENTS.md` | 長期且會改變所有 agent 行為的規則 | 架構、授權、品牌或驗證原則確定改變時 |
| `PLAN.md` | 一個進行中任務的目標、步驟、證據、失敗嘗試與接續點 | 多步任務開始、範圍改變、兩次失敗、暫停或完成時 |
| `LESSONS.md` | 使用者糾正後可泛用的「遇到 X，應做 Y」 | 每次出現可重用的糾正時，最新放最上面 |
| `CODEX_HANDOFF.md` | 已完成狀態、重要 commit／Preview、WIP 與風險 | 重大功能、部署歸屬、外部依賴或 WIP 狀態改變時 |

## 計畫與交接規則

- 短小、單檔且低風險的修改不必製造形式化計畫；直接做最小改動並驗證。
- 多檔、跨頁、資料遷移、外部服務、部署、未審分支或需求有關鍵歧義時，必須填 `PLAN.md`。每一步都要有可觀察的完成證據，不能只寫「完成開發」。
- 同一步驟失敗兩次，停止重試，在計畫裡記錄錯誤、已排除項目與新假設後再繼續。
- 暫停時保留明確的「下一個安全動作」、工作樹狀態與尚未執行的檢查。完成後把狀態設為 `completed`，確認 handoff 已更新，再把計畫重設為空白模板。
- 不在文件中寫入 token、密碼、私人 URL、客戶資料或只能由某台機器存取的憑證。

## Lessons 的品質標準

一條 lesson 要能改變下一次的具體行為。避免「要更小心」；改寫成「當商品事實沒有可追溯來源時，保留待確認狀態，不自行補寫或稱為核准文案」。若一條 lesson 已經穩定、跨任務適用且得到使用者同意，將它合併進 `AGENTS.md`，再從 `LESSONS.md` 移除重複內容。

## Claude Code 與 Codex 的工具差異

兩個 agent 讀同一份 `AGENTS.md` 與本資料夾，但手邊的工具與記憶不同。接手時照下表換成自己的工具，不要照抄另一邊的指令。

| 項目 | Codex（到 2026-10-12 16:52） | Claude Code |
| --- | --- | --- |
| 個人記憶 | `~/.codex/memories/`（大多是 09 月其他資料夾的事）；影像規則在 `~/.codex/memories/skills/charmvilla-product-image-fidelity/SKILL.md` | `~/.claude/projects/-Users-kuan-Documents-Codex-10-02-charmvilla-demo2/memory/`：使用者的語氣、字級、茶標、刺繡、禮盒、情境照等大量規格，生圖前必讀 |
| 對話紀錄（考古用） | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` | `~/.claude/projects/<專案>/*.jsonl` |
| 影像生成 | 內建 imagegen；原始檔在 `~/.codex/generated_images` | 依使用者記憶一律用 Higgsfield CLI：保留參考商品用 `nano_banana_2_1`，純文字／憑空生成用 `gpt_image_2_5 --variant sunburst`；一次一張、先給使用者看 |
| 瀏覽器 QA | ego-browser（截圖要用明確 viewport＋`raw:true`，先驗 `innerWidth`） | `ego-browser` skill 或 Claude in Chrome；同樣要驗實際 viewport |
| Node 24 | 暫存的 Node 24 runtime | 本機預設 Node 20、沒有 nvm：`npx -y -p node@24 -c 'npm run check'`（實測 v24.19.0） |

共同的部署事實（2026-10-12 查證）：

- push `main` → Git 觸發 `tentenco/charmvilla-demo2` Production（`https://charmvilla-demo2.vercel.app`）。所以「push」就等於「上線」，只在使用者授權發布時做。
- 只要 Preview、不要上線：`vercel deploy --yes --target preview --scope tentenco`（`.vercelignore` 已排除 `.env*` 與 `temp/`）。Preview 有 Vercel 登入保護。
- `charmvilla-gallery-site`（`siteUrl`）是另一個沒連 Git 的專案；`www.charmvilla.com` 是品牌正式網站，絕對不碰。

接手時已知、要問使用者才能定案的衝突：

- 茶標材質（已定案）：使用者 2026-10-12 回覆「霧面金，不要像鏡子那樣亮（亮應該是打光造成的）」。Claude 記憶裡舊的「金色鋁箔」說法作廢；仍維持無孔、棉線黏在裡面。
- 內文字級：10-12 使用者指定的內文層級是 17px（見 handoff），比 Claude 記憶裡 10-07／10-08 的 16px 新，以 17px 為準。
- 沖泡區版型：Claude 記憶的「bramwel 奶黃卡片」（10-08）已被 10-12 的 Agasis 列表、再被「方案 01＋02 左圖右文」取代。
