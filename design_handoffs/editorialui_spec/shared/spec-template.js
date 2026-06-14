/* Spec page template helper.
 * Components inject their content via <script type="application/json" id="ed-spec-data">.
 * The helper renders consistent chrome (topbar, title, sections) so we don't
 * duplicate boilerplate across 37 files.
 *
 * Schema:
 *   {
 *     id: "A2",
 *     group: "Inputs",
 *     name: "EdIconButton",
 *     lede: "...",
 *     // chrome auto-renders; sections are rendered inline as <section data-spec="...">
 *   }
 */
(function () {
    const dataEl = document.getElementById('ed-spec-data');
    if (!dataEl) return;
    let data;
    try { data = JSON.parse(dataEl.textContent); } catch (e) { console.error('Bad spec data', e); return; }

    const main = document.querySelector('main.ed-spec');
    if (!main) return;

    // topbar
    const topbar = document.createElement('header');
    topbar.className = 'ed-spec__topbar';
    topbar.innerHTML = `
        <nav class="ed-spec__crumbs"><a href="../00-index.html">EditorialUI</a> <span>/</span> ${data.group} <span>/</span> ${data.name}</nav>
        <div class="ed-spec__topbar-actions">
            <span>${data.id} · v0.1.0</span>
            <button type="button" class="ed-theme-toggle" data-ed-theme-toggle>Dark</button>
        </div>`;
    main.insertBefore(topbar, main.firstChild);

    // title block
    const titleBlock = document.createElement('div');
    titleBlock.innerHTML = `
        <p class="ed-spec__eyebrow">${data.group} · ${data.id}</p>
        <h1 class="ed-spec__title">${data.name}</h1>
        <p class="ed-spec__lede">${data.lede}</p>`;
    topbar.after(titleBlock);

    // foot
    const foot = document.createElement('footer');
    foot.className = 'ed-spec__foot';
    foot.innerHTML = `
        <span>EditorialUI · ${data.name} · v0.1.0</span>
        <span><a href="../00-index.html">Back to index</a></span>`;
    main.appendChild(foot);

    // auto-number sections
    const sections = main.querySelectorAll('section.ed-section');
    sections.forEach((sec, i) => {
        const head = sec.querySelector('.ed-section__head');
        if (head && !head.querySelector('.ed-section__num')) {
            const n = String(i + 1).padStart(2, '0');
            const numEl = document.createElement('span');
            numEl.className = 'ed-section__num';
            numEl.textContent = n;
            head.insertBefore(numEl, head.firstChild);
        }
    });
})();
