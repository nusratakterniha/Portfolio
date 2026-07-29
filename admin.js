const storeKey = 'digital-makers-projects';
const form = document.querySelector('#projectForm');
const projectsBox = document.querySelector('#projects');
const status = document.querySelector('#status');
const $ = id => document.querySelector('#' + id);
let projects = JSON.parse(localStorage.getItem(storeKey) || '[]');
const save = () => localStorage.setItem(storeKey, JSON.stringify(projects));
const fileData = file => new Promise((resolve, reject) => { if (!file) return resolve(null); if (file.size > 2 * 1024 * 1024) return reject(new Error('Please choose a file smaller than 2 MB.')); const reader = new FileReader(); reader.onload = () => resolve({name:file.name,type:file.type,data:reader.result}); reader.onerror = reject; reader.readAsDataURL(file); });
function render(){ projectsBox.innerHTML = projects.length ? projects.map(p => `<article class="project"><img class="thumb" src="${p.image?.data || 'assets/digital-makers-logo.svg'}" alt=""><div><h3>${p.title}</h3><p>${p.category} · ${p.year}</p></div><div class="project-actions"><button class="small" data-edit="${p.id}">Edit</button><button class="small" data-delete="${p.id}">Delete</button></div></article>`).join('') : '<p class="empty">No custom projects yet. Add your first project from the form.</p>'; }
function reset(){form.reset(); $('id').value=''; $('year').value=new Date().getFullYear(); $('formTitle').textContent='Add a project'; $('cancel').hidden=true;}
form.addEventListener('submit', async e => { e.preventDefault(); status.textContent='Saving…'; try { const old=projects.find(p=>p.id===$('id').value); const image=$('image').files[0] ? await fileData($('image').files[0]) : old?.image || null; const attachment=$('attachment').files[0] ? await fileData($('attachment').files[0]) : old?.attachment || null; const p={id:$('id').value||crypto.randomUUID(),title:$('title').value.trim(),category:$('category').value.trim(),year:$('year').value.trim(),description:$('description').value.trim(),image,attachment}; projects=old?projects.map(x=>x.id===p.id?p:x):[p,...projects]; save();render();reset();status.textContent='Project saved successfully.'; } catch(err){status.textContent=err.message;} });
projectsBox.addEventListener('click', e=>{const id=e.target.dataset.edit||e.target.dataset.delete;if(!id)return;if(e.target.dataset.delete){projects=projects.filter(p=>p.id!==id);save();render();return}const p=projects.find(p=>p.id===id);$('id').value=p.id;$('title').value=p.title;$('category').value=p.category;$('year').value=p.year;$('description').value=p.description||'';$('formTitle').textContent='Edit project';$('cancel').hidden=false;window.scrollTo({top:0,behavior:'smooth'});});
$('cancel').onclick=reset;
$('export').onclick=()=>{const blob=new Blob([JSON.stringify(projects,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='digital-makers-projects.json';a.click();URL.revokeObjectURL(a.href);};
$('import').onchange=async e=>{try{projects=JSON.parse(await e.target.files[0].text());save();render();status.textContent='Projects imported.';}catch{status.textContent='That file is not a valid project backup.';}};
reset();render();
