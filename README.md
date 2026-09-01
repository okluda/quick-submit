# 快速網頁送出 0.1.5

## 功能定位

本插件將多個框選元素視為互斥的快速操作方案。每次只執行使用者點選的單一方案，成功後立即跳轉並標記送出按鈕，不會批次執行其他方案，也不會自動送出。

## 使用方式

1. 開啟目標 HTTP/HTTPS 網頁，再開啟 Side Panel。
2. 在「設定」按「使用目前分頁」。
3. 依需要框選最多 5 組互斥操作元素。
4. 框選送出按鈕並完成設定。
5. 在快速操作區輸入內容值，按對應列的「執行並轉跳」。
6. 插件只執行該列，成功後將送出按鈕捲動到中央並標記。
7. 若鍵盤焦點仍在 Side Panel，按 F6 切換到網頁，再自行按 Enter、Space 或滑鼠送出。

## 0.1.0 支援範圍

- 文字輸入框與 textarea
- 數字輸入框
- 原生 select 下拉選單
- 可辨識的增加、減少 button
- 原生 button、input button、input submit 作為送出按鈕
- 目標分頁重新整理、關閉及路徑變更狀態
- 每次執行互斥鎖定及逐次重新查找按鈕

## 已知限制

- 不自動點擊送出按鈕。
- Side Panel 無法保證直接取得網頁鍵盤焦點，必要時需按 F6。
- 暫不支援 iframe、封閉 Shadow DOM、自訂下拉元件、密碼、驗證碼及檔案上傳。
- 增減按鈕的完成驗證目前以成功點擊次數為準，若需核對實際數量，後續需增加「數量顯示元素」設定。
- 頁面識別目前使用 origin + pathname，不包含 query string。


### 0.1.1 變更
- 快速操作區順序調整為「刷新頁面」、「只跳轉到送出鈕」、5 組獨立送出。
- 新增「刷新頁面」，重新載入已鎖定的目標網頁，不清除已保存設定。
- 每組「執行並轉跳」按鈕約占卡片寬度三分之一。
- 跳轉到送出按鈕後，高亮框與 tooltip 於 3 秒後自動消失。
- 設定區順序調整為「目標網頁」、「送出按鈕」、「快速操作方案」。


### 0.1.2 修正
- 快速操作方案框選改為可偵測原生 button 與 role=button，並擴充圖示、class、data 屬性的增減判斷。
- 框選改用 pointerdown 捕捉，停用狀態的送出按鈕也可被記錄。
- 送出按鈕框選允許 disabled 與 aria-disabled 狀態，但實際轉跳或送出前仍要求元素已 Enable。
- Side Panel 新增「取消框選（Esc）」；Side Panel 或目標網頁按 Esc 均可取消並重新框選。
- 新增 PING 回應，避免每次操作重複嘗試注入 Content Script。


#### 0.1.4 修正
- 框選改用最高層級透明遮罩，所有選取行為由遮罩接收，再以 elementsFromPoint 反查底層元素。
- 框選期間攔截 pointer、mouse、click、double click、context menu 及 form submit，避免設定時誤觸網頁操作或送出。
- 完成選取後仍保留 600ms click/submit 防護，避免移除遮罩後的尾端事件落到原網頁。
- 取消或完成框選時完整移除遮罩與暫時事件守門器，恢復網頁正常操作。


##### 0.1.5 修正
- disabled 元素若因 pointer-events:none 未出現在 elementsFromPoint 結果，改以 getBoundingClientRect 幾何範圍備援定位。
- 幾何候選掃描目前網頁所有可見按鈕，再選取游標座標所在且面積最精確的元素。
- Selector 優先使用 nextBtn 等穩定 class，排除 v-btn--disabled、disabledBtn、theme 與 elevation 狀態 class。
- 保留最高層遮罩、事件攔截、表單 submit 防護與 Esc 取消。
