const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

// Projects created from admin.html are kept in this browser and added below the featured work.
const customProjects = JSON.parse(localStorage.getItem('digital-makers-projects') || '[]');
const projectGrid = document.querySelector('#project-grid');
const escapeHTML = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' })[char]);
if (projectGrid) customProjects.forEach(project => {
  const image = project.image?.data || 'assets/digital-makers-logo.svg';
  const attachment = project.attachment?.data ? `<a href="${project.attachment.data}" download="${escapeHTML(project.attachment.name)}">Download file ↗</a>` : '<span>View case study ↗</span>';
  projectGrid.insertAdjacentHTML('beforeend', `<article class="project"><a href="#contact"><img src="${image}" alt="${escapeHTML(project.title)} project cover" /><div><p>${escapeHTML(project.category)} · ${escapeHTML(project.year)}</p><h3>${escapeHTML(project.title)}</h3>${attachment}</div></a></article>`);
});
