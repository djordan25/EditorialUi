/* Spec page — shared theme toggle.
 * Light is default. Click the toggle to flip to dark; persists in localStorage.
 */
(function () {
    const STORAGE_KEY = 'ed-spec-theme';
    const root = document.documentElement;

    function apply(mode) {
        root.setAttribute('data-theme', mode);
        const btns = document.querySelectorAll('[data-ed-theme-toggle]');
        btns.forEach(b => { b.textContent = mode === 'dark' ? 'Light' : 'Dark'; });
    }

    function init() {
        let stored;
        try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { stored = null; }
        apply(stored === 'dark' ? 'dark' : 'light');

        document.addEventListener('click', e => {
            const t = e.target.closest('[data-ed-theme-toggle]');
            if (!t) return;
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
            apply(next);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
