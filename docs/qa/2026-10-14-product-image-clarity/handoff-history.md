# Agent 接手快照（Claude Code ⇄ OpenAI Codex）

更新時間：2026-10-14（Asia/Taipei，商品主圖清晰度已發布並完成線上驗證）。檔名沿用 `CODEX_HANDOFF.md`，因為其他文件都連到這裡；內容是雙向的。

這份文件是「時間點快照」。2026-10-12 上午 Codex 從 Claude Code 接手；同日 17:20 再由 Claude Code 從 Codex 接回。每次開始工作仍要重新執行 Git 檢查；若本文件與最新使用者指示或 Git 現況不同，以後兩者為準。

## 2026-10-14 商品頁桌機主圖清晰度（已發布）

- 使用者回報銀杏茶匙桌機大圖模糊。已重現：1024×1400、DPR 1 時，`sizes=50vw` 選到 640×800，但 `object-fit: cover` 依容器高度需要約 1005px 寬，造成放大；原圖有 1792×2240。
- `ProductGallery.tsx` 現以 picture/source 在桌機 >=768px 直接使用既有 WebP 原圖，手機與縮圖保留 Next 最佳化。首張用 eager + high fetchPriority，避免預載另一張未使用的壓縮主圖。資產、商品內容、裁切、版型與互動均保留。
- Node 24 `npm run check` 通過（0 errors／7 個既有 lint warnings，79 個靜態頁）。正式 build 的本機中英文／1440／390／較高桌機／DPR 1–3／767–768 breakpoint／reduced motion 均通過；另驗證春曉多圖庫、鍵盤、選色切換及圖片失敗後可切換下一張。
- QA：[`docs/qa/2026-10-14-product-image-clarity/README.md`](qa/2026-10-14-product-image-clarity/README.md)，內含 JSON 與 200% 前後對照；桌機取完整原圖會比小型壓縮圖多用流量（銀杏茶匙約 163 KB）。
- 使用者指示「直接發布」後，實作 `4b1e83ac2be3f64c064746c590f97cca20b47a7d` 已提交並推送到 `tentenco/charmvilla_shopify_official/main`。Git 觸發 Production `dpl_2yd5e4hb4ALp8iB8iWwhR8NFrbjh` READY、aliasAssigned=true，`charmvilla-demo2.vercel.app` 5 組中英文／桌機／手機 live QA 通過。未另建 Preview；後續僅補 QA／交接文件，不改應用程式。
- 線上桌機確認原圖 1792×2240；手機仍載入 Next responsive image。春曉鍵盤縮圖／切色／下一張正常，零 app error。完整證據在上述 QA 的 `production/`。
- **網域現況更正：** 本次發布後 API 查核顯示 `www.charmvilla.com` 與 `charmvilla.com` 在本次 push 前已綁定同一專案，故 Git Production 會同步更新既有正式網域；www 商品頁也已只讀確認新原圖載入。本次未更改 domain／DNS。下方歷史敘述「正式網域仍是另一專案」已不符合現況；未來發布前應回讀 project domains。`charmvilla-gallery-site` 仍非本次操作目標。
- 本次本機預覽使用 port 3138；既有 port 3123 server 未由本次啟動或停止。

## 2026-10-14 最新 GitHub 目標：charmvilla_shopify_official

- 使用者明確指定並要求記住：之後本專案的修改都傳到 `https://github.com/tentenco/charmvilla_shopify_official`。
- GitHub API 確認新名稱仍是同一 repository ID `1399251640`，公開狀態、預設分支 `main` 與 admin／push 權限保留。15 個遠端分支 SHA 與前次查核相同，沒有 tags。
- 本機 origin fetch／push URL 已改為 `https://github.com/tentenco/charmvilla_shopify_official.git`，`git fetch --all --prune` 成功；`main` 與 `origin/main` 均為 `61e3a1adab6150e07a348d72f2d28472ab1feeac`，ahead／behind = `0／0`。
- Vercel Git link 原先仍顯示舊名稱，已使用 `vercel git connect` 更新原專案；API 回讀確認 `org=tentenco`、`repo=charmvilla_shopify_official`、`repoId=1399251640`、`productionBranch=main`。Vercel project 仍是 `tentenco/charmvilla-demo2`（`prj_QWvvqmrK6UCFkDhY9DyPAQe2Cx23`），不可把 project 名稱與 GitHub repo 名稱混淆。
- 新推送目標已寫入 `AGENTS.md`，並依使用者「記住」要求新增 Codex 記憶更新 note。下方移轉時的舊名稱僅作歷史紀錄。
- 本次未修改應用程式／資產，未執行 lint、typecheck、build；未 commit／push、未建立 Preview／Production。專案規則與交接文件目前僅本機更新。

## 2026-10-14 GitHub repository 已移轉至 tentenco（更名前紀錄）

- 使用者明確要求移轉到 GitHub organization `tentenco`。已透過 GitHub 原生 transfer 完成：`kuankuan16/charmvilla_demo2` → `tentenco/charmvilla_demo2`；名稱、公開狀態與預設分支 `main` 保留。
- GitHub API 已確認 owner 為 `tentenco`、type 為 `Organization`，repository ID 仍是 `1399251640`，目前登入帳號仍有 admin/push 權限。舊 repo URL 回應 HTTP 301 至新 repo。
- 本機 origin 已更新為 `https://github.com/tentenco/charmvilla_demo2.git`；`git fetch --all --prune` 成功。移轉前後 15 個遠端分支的 SHA 逐一相同，沒有 tags；`main` = `origin/main` = `61e3a1adab6150e07a348d72f2d28472ab1feeac`。
- Vercel 實際 API 查核：專案 `prj_QWvvqmrK6UCFkDhY9DyPAQe2Cx23`、team `team_uIcYhBfO11q1gcwk3BB6OgPt` 的 Git link 已自動更新為 `tentenco/charmvilla_demo2`，repoId `1399251640`、productionBranch `main`。GitHub repo 使用底線，Vercel project 名稱仍為 `charmvilla-demo2`，不要混淆。
- Vercel 最新既有 Production deployment `dpl_FDTy4aF72HUG4oYZK4FGTf47hhFa` 的 API 狀態為 `READY`；本次沒有建立 Preview／Production、沒有 push，亦未用新推送實測部署觸發或做網站 UI 驗證。
- 本次只修改 Git remote 與本機交接文件，未修改應用程式／資產，未執行 lint、typecheck、build。開始時 12 個工作樹均乾淨；其他歷史 WIP 保留。下方 10-12／10-13 的 Git 與待發布狀態均為歷史紀錄，不能代替本節或即時查核。
