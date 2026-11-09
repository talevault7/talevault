(function(){
    var toggle = document.querySelector('.mkm-menu-toggle');
    var menu = document.getElementById('mkm-mobile-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', function(){
            var open = menu.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }
    // If a long logo/menu won't fit in one row, use the mobile menu instead of squashing labels.
    var header = document.querySelector('.mkm-header');
    var headerInner = document.querySelector('.mkm-header-inner');
    var nav = document.querySelector('.mkm-nav');
    var navList = document.querySelector('.mkm-menu');
    var brand = document.querySelector('.mkm-brand');
    var actions = document.querySelector('.mkm-header-actions');
    function fitHeaderMenu() {
        if (!header || !headerInner || !nav || !navList || !brand || !actions) return;
        header.classList.remove('is-compact-menu');
        if (window.innerWidth <= 1024) return;
        var style = window.getComputedStyle(headerInner);
        var available = headerInner.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        var gap = parseFloat(style.columnGap) || 0;
        var needed = brand.scrollWidth + navList.scrollWidth + actions.scrollWidth + gap * 2;
        if (needed > available + 1) header.classList.add('is-compact-menu');
        else if (menu && toggle && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false');
        }
    }
    fitHeaderMenu();
    window.addEventListener('resize', fitHeaderMenu, { passive: true });
    window.addEventListener('load', fitHeaderMenu, { once: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeaderMenu);
    // Add accessible, separate disclosure controls without changing working parent links.
    var submenuCount = 0;
    var disclosureText = (typeof mkmMenuText !== 'undefined' && mkmMenuText.toggle) || 'Toggle submenu:';
    document.querySelectorAll('.mkm-menu li, .mkm-mobile-nav li').forEach(function(item) {
        var children = Array.prototype.slice.call(item.children);
        var sub = children.find(function(el){ return el.tagName === 'UL' && el.classList.contains('sub-menu'); });
        var link = children.find(function(el){ return el.tagName === 'A'; });
        if (!sub || !link) return;
        item.classList.add('mkm-has-submenu');
        sub.id = 'mkm-submenu-' + (++submenuCount);
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'mkm-submenu-toggle';
        button.setAttribute('aria-controls', sub.id);
        button.setAttribute('aria-label', disclosureText + ' ' + link.textContent.trim());
        button.setAttribute('aria-expanded', 'false');
        sub.hidden = true;
        item.insertBefore(button, sub);
        function setOpen(open) {
            sub.hidden = !open;
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (labelButton) labelButton.setAttribute('aria-expanded', open ? 'true' : 'false');
            if (open && item.closest('.mkm-nav')) {
                sub.style.left = ''; sub.style.right = '';
                var rect = sub.getBoundingClientRect();
                if (rect.right > window.innerWidth - 8) {
                    sub.style.left = 'auto';
                    sub.style.right = item.parentElement.classList.contains('sub-menu') ? '100%' : '0';
                }
            }
        }
        var hoverOpened = false;
        function toggleSubmenu(){
            // A first click after hover keeps the menu open; a second click closes it.
            if (hoverOpened && !sub.hidden) { hoverOpened = false; return; }
            hoverOpened = false; setOpen(sub.hidden);
        }
        button.addEventListener('click', toggleSubmenu);
        // A custom menu label without a URL should also open the submenu when clicked.
        var labelButton = null;
        if (!link.getAttribute('href') || link.getAttribute('href') === '#') {
            labelButton = document.createElement('button');
            labelButton.type = 'button'; labelButton.className = 'mkm-menu-label';
            labelButton.textContent = link.textContent;
            labelButton.setAttribute('aria-controls', sub.id);
            labelButton.setAttribute('aria-expanded', 'false');
            link.replaceWith(labelButton);
            labelButton.addEventListener('click', toggleSubmenu);
        }
        if (item.closest('.mkm-nav')) {
            item.addEventListener('pointerenter', function(e){ if (e.pointerType === 'mouse' && sub.hidden) { setOpen(true); hoverOpened = true; } });
            item.addEventListener('pointerleave', function(e){ if (e.pointerType === 'mouse') { hoverOpened = false; if (!item.contains(document.activeElement)) setOpen(false); } });
            item.addEventListener('focusout', function(e){ if (!item.contains(e.relatedTarget) && !item.matches(':hover')) setOpen(false); });
        }
        item.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !sub.hidden) { e.stopPropagation(); setOpen(false); button.focus(); } });
    });
    fitHeaderMenu();
    document.addEventListener('click', function(e){
        document.querySelectorAll('.mkm-has-submenu').forEach(function(item){
            if (item.contains(e.target)) return;
            var btn = Array.prototype.slice.call(item.children).find(function(el){ return el.classList.contains('mkm-submenu-toggle'); });
            if (btn && btn.getAttribute('aria-expanded') === 'true') { var controlled = document.getElementById(btn.getAttribute('aria-controls')); if (controlled) controlled.hidden = true; btn.setAttribute('aria-expanded', 'false'); var label = item.querySelector(':scope > .mkm-menu-label'); if (label) label.setAttribute('aria-expanded', 'false'); }
        });
    });
    // Whitespace is not a search term. Prevent accidental empty searches.
    document.querySelectorAll('form.mkm-search').forEach(function(form){
        var input = form.querySelector('input[name="s"]');
        if (!input) return;
        input.addEventListener('input', function(){ input.setCustomValidity(''); });
        form.addEventListener('submit', function(event){
            if (!input.value.replace(/[\s\u200B\uFEFF]/g, '')) {
                event.preventDefault();
                input.setCustomValidity((typeof mkmMenuText !== 'undefined' && mkmMenuText.search_required) || 'Please enter a search keyword.');
                input.reportValidity();
                input.focus();
            } else { input.setCustomValidity(''); input.value = input.value.trim(); }
        });
    });
    document.querySelectorAll('.mkm-hero-slider').forEach(function(slider) {
        var slides = slider.querySelectorAll('.mkm-hero-slide');
        var controls = slider.querySelector('.mkm-slider-controls');
        if (slides.length < 2 || !controls) return;
        var current = 0, timer;
        var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) { slide.hidden = i !== current; });
        }
        function stop() { clearInterval(timer); timer = null; }
        function start() {
            stop();
            if (!reduceMotion || !reduceMotion.matches) timer = setInterval(function(){ show(current + 1); }, 6000);
        }
        controls.hidden = false;
        controls.querySelector('.mkm-slider-prev').addEventListener('click', function(){ show(current - 1); });
        controls.querySelector('.mkm-slider-next').addEventListener('click', function(){ show(current + 1); });
        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', function(){ if (!slider.contains(document.activeElement)) start(); });
        slider.addEventListener('focusin', stop);
        slider.addEventListener('focusout', function(e){ if (!slider.contains(e.relatedTarget) && !slider.matches(':hover')) start(); });
        if (reduceMotion && reduceMotion.addEventListener) reduceMotion.addEventListener('change', start);
        start();
    });
    var back = document.querySelector('.mkm-back-to-top');
    if (back) {
        function updateBackToTop() { back.classList.toggle('is-visible', window.scrollY > 600); }
        window.addEventListener('scroll', updateBackToTop, { passive: true });
        updateBackToTop();
        back.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
    }
})();
