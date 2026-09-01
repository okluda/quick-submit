const TARGET_KEY = "quickSubmitTarget";
chrome.runtime.onInstalled.addListener(() => chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}));
chrome.runtime.onStartup.addListener(() => chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}));
const allowed = url => { try { const u=new URL(url); return u.protocol==="http:"||u.protocol==="https:"; } catch { return false; } };
const pageKey = url => { const u=new URL(url); return u.origin+u.pathname; };
async function getTarget(){const r=await chrome.storage.session.get(TARGET_KEY);return r[TARGET_KEY]||null;}
async function notify(target,reason){try{await chrome.runtime.sendMessage({type:"TARGET_CHANGED",payload:{target,reason}});}catch{}}
chrome.runtime.onMessage.addListener((m,s,reply)=>{
  if(m.type==="GET_TARGET"){getTarget().then(target=>reply({success:true,target}));return true;}
  if(m.type==="SET_TARGET"){(async()=>{const tab=await chrome.tabs.get(m.tabId);if(!tab||!allowed(tab.url))throw Error("目前分頁不是可操作的 HTTP/HTTPS 網頁。");const u=new URL(tab.url);const target={tabId:tab.id,title:tab.title||"",origin:u.origin,pathname:u.pathname,pageKey:pageKey(tab.url),status:"active"};await chrome.storage.session.set({[TARGET_KEY]:target});await notify(target,"selected");return target;})().then(target=>reply({success:true,target})).catch(e=>reply({success:false,error:e.message}));return true;}
  if(m.type==="CLEAR_TARGET"){chrome.storage.session.remove(TARGET_KEY).then(()=>notify(null,"cleared")).then(()=>reply({success:true}));return true;}
});
chrome.tabs.onRemoved.addListener(async id=>{const t=await getTarget();if(t?.tabId===id){await chrome.storage.session.remove(TARGET_KEY);await notify(null,"closed");}});
chrome.tabs.onUpdated.addListener(async(id,change,tab)=>{const t=await getTarget();if(!t||t.tabId!==id)return;const url=change.url||tab.url||"";if(!allowed(url)||pageKey(url)!==t.pageKey){const next={...t,status:"page-changed"};await chrome.storage.session.set({[TARGET_KEY]:next});await notify(next,"page-changed");return;}if(change.status==="loading"){const next={...t,status:"loading"};await chrome.storage.session.set({[TARGET_KEY]:next});await notify(next,"loading");}if(change.status==="complete"){const next={...t,status:"active",title:tab.title||t.title};await chrome.storage.session.set({[TARGET_KEY]:next});await notify(next,"active");}});
