
const DATA_URL="data/software.json";
let software=[];
const $=s=>document.querySelector(s);
async function loadSoftware(){
  try{const r=await fetch(DATA_URL); if(!r.ok) throw Error("data"); software=await r.json(); return software}
  catch(e){console.error(e); return []}
}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function initials(name){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function card(s){return `<article class="card"><div class="icon" aria-hidden="true">${esc(initials(s.name))}</div><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p><div class="meta"><span class="tag">${esc(s.category)}</span><span class="tag">${esc(s.license)}</span><span class="tag">${esc(s.platforms.join(" • "))}</span></div><a class="btn" href="software.html?id=${encodeURIComponent(s.id)}">View Details</a></article>`}
function renderCards(list, target){const el=$(target); if(!el)return; el.innerHTML=list.length?list.map(card).join(""):`<div class="empty">No software found.<br>Try another search term.</div>`}
function setupMenu(){const b=$(".menu-toggle"),n=$(".nav");if(b&&n)b.addEventListener("click",()=>{n.classList.toggle("open");b.setAttribute("aria-expanded",n.classList.contains("open"))})}
function setupSearch(){const f=$("#searchForm"),i=$("#searchInput");if(f)f.addEventListener("submit",e=>{e.preventDefault();location.href=`search.html?q=${encodeURIComponent(i.value.trim())}`})}
async function home(){
  software=await loadSoftware();
  renderCards(software.filter(s=>s.popular).slice(0,8),"#popular");
  renderCards([...software].sort((a,b)=>b.updated.localeCompare(a.updated)).slice(0,8),"#latest");
}
async function searchPage(){
  software=await loadSoftware();const q=new URLSearchParams(location.search).get("q")||"";
  const input=$("#searchInput"); if(input)input.value=q;
  const results=software.filter(s=>(s.name+" "+s.description+" "+s.category+" "+s.platforms.join(" ")+" "+s.license).toLowerCase().includes(q.toLowerCase()));
  $("#resultCount").textContent=`${results.length} result${results.length===1?"":"s"} found`;
  renderCards(results,"#results");
}
async function categoryPage(){
  software=await loadSoftware();const q=(new URLSearchParams(location.search).get("category")||"").toLowerCase();
  const cats=[...new Set(software.map(s=>s.category))];const f=$("#filters");
  if(f)f.innerHTML=`<button class="active" data-cat="">All</button>`+cats.map(c=>`<button data-cat="${esc(c)}">${esc(c)}</button>`).join("");
  const render=cat=>{document.querySelectorAll("#filters button").forEach(b=>b.classList.toggle("active",b.dataset.cat.toLowerCase()===cat.toLowerCase()));renderCards(cat?software.filter(s=>s.category.toLowerCase()===cat.toLowerCase()):software,"#results")};
  f?.addEventListener("click",e=>{const b=e.target.closest("button");if(b)render(b.dataset.cat)});
  render(q);
}
async function softwarePage(){
  software=await loadSoftware();const id=new URLSearchParams(location.search).get("id");const s=software.find(x=>x.id===id);const main=$("#softwareDetail");
  if(!s){main.innerHTML=`<div class="empty"><h2>Software Not Found</h2><p>The software you are looking for does not exist.</p><a class="btn" href="category.html">Back to Software</a></div>`;return}
  document.title=`${s.name} Download - Free & Open Source Software`;
  main.innerHTML=`<div class="detail"><div class="detail-icon">${esc(initials(s.name))}</div><div><h1>${esc(s.name)}</h1><p class="description">${esc(s.description)}</p><div class="info-table">
  <div class="info-row"><strong>Version</strong><span>${esc(s.version)}</span></div><div class="info-row"><strong>Developer</strong><span>${esc(s.developer)}</span></div><div class="info-row"><strong>License</strong><span>${esc(s.license)}</span></div><div class="info-row"><strong>Platforms</strong><span>${esc(s.platforms.join(", "))}</span></div><div class="info-row"><strong>Category</strong><span>${esc(s.category)}</span></div><div class="info-row"><strong>Updated</strong><span>${esc(s.updated)}</span></div></div>
  <div class="actions"><a class="btn" href="download.html?id=${encodeURIComponent(s.id)}">Download ${esc(s.name)}</a><a class="btn secondary" href="${esc(s.officialUrl)}" target="_blank" rel="noopener noreferrer">Official Website</a></div></div></div>
  <div class="notice">This is an independent software directory. The download continues on the official developer website. Always review the developer's license and terms before installing software.</div>
  <h2>About ${esc(s.name)}</h2><p>${esc(s.description)}</p><h3>Platforms</h3><ul class="features">${s.platforms.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>`;
}
async function downloadPage(){
  software=await loadSoftware();const id=new URLSearchParams(location.search).get("id"),s=software.find(x=>x.id===id),box=$("#downloadBox");
  if(!s){box.innerHTML=`<div class="empty"><h2>Software Not Found</h2><p>The software you are looking for does not exist.</p><a class="btn" href="category.html">Back to Software</a></div>`;return}
  document.title=`Download ${s.name} - Software Directory`;
  box.innerHTML=`<h1>Your download is starting...</h1><p>${esc(s.name)} · ${esc(s.platforms.join(" / "))}</p><div class="spinner" aria-label="Preparing download"></div><div class="progress" aria-hidden="true"><span></span></div><p id="downloadStatus">Preparing your download...</p>`;
  setTimeout(()=>{box.innerHTML=`<h1>Download Ready</h1><p>${esc(s.name)}</p><p class="notice">This download continues on the official developer website.</p><a class="btn" href="${esc(s.downloadUrl)}" target="_blank" rel="noopener noreferrer">Download Now</a><p><a href="${esc(s.officialUrl)}" target="_blank" rel="noopener noreferrer">Visit official website</a></p>`},3000);
}
function init(){setupMenu();setupSearch();const p=document.body.dataset.page;if(p==="home")home();if(p==="search")searchPage();if(p==="category")categoryPage();if(p==="software")softwarePage();if(p==="download")downloadPage()}
document.addEventListener("DOMContentLoaded",init);
