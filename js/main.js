(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Header: scrolled state + mobile nav toggle
       ------------------------------------------------------------------ */
    var header = document.querySelector('.site_header');
    var navToggle = document.querySelector('.nav_toggle');

    function onScrollHeader() {
        if (window.scrollY > 8) {
            header.classList.add('is_scrolled');
        } else {
            header.classList.remove('is_scrolled');
        }
    }
    if (header) {
        onScrollHeader();
        window.addEventListener('scroll', onScrollHeader, { passive: true });
    }
    if (navToggle && header) {
        navToggle.addEventListener('click', function () {
            header.classList.toggle('nav_open');
        });
        document.querySelectorAll('.gnb_list a').forEach(function (link) {
            link.addEventListener('click', function () {
                header.classList.remove('nav_open');
            });
        });
    }

    /* ------------------------------------------------------------------
       Active nav link on scroll (scrollspy)
       ------------------------------------------------------------------ */
    var sections = Array.prototype.slice.call(document.querySelectorAll('main [id]'));
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.gnb_list a'));

    function setActiveLink() {
        var scrollPos = window.scrollY + 140;
        var current = sections[0];
        sections.forEach(function (sec) {
            if (sec.offsetTop <= scrollPos) current = sec;
        });
        navLinks.forEach(function (link) {
            var isMatch = current && link.getAttribute('href') === '#' + current.id;
            link.classList.toggle('is_active', !!isMatch);
        });
    }
    if (sections.length && navLinks.length) {
        setActiveLink();
        window.addEventListener('scroll', setActiveLink, { passive: true });
    }

    /* ------------------------------------------------------------------
       Scroll reveal (IntersectionObserver)
       ------------------------------------------------------------------ */
    var revealTargets = document.querySelectorAll('.reveal, .timeline, .skill_checks');
    if ('IntersectionObserver' in window && revealTargets.length) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is_visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealTargets.forEach(function (el) { io.observe(el); });
    } else {
        revealTargets.forEach(function (el) { el.classList.add('is_visible'); });
    }

    /* stagger delay for timeline items */
    document.querySelectorAll('.timeline_item').forEach(function (el, i) {
        el.style.setProperty('--d', (i % 6) * 0.06 + 's');
    });
    document.querySelectorAll('.skill_check').forEach(function (el, i) {
        el.style.setProperty('--d', (i % 4) * 0.06 + 's');
    });

    /* ------------------------------------------------------------------
       Back to top
       ------------------------------------------------------------------ */
    var backToTop = document.querySelector('.back_to_top');
    if (backToTop) {
        window.addEventListener('scroll', function () {
            backToTop.classList.toggle('is_visible', window.scrollY > 640);
        }, { passive: true });
        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ------------------------------------------------------------------
       Lightbox for preview / architecture images
       ------------------------------------------------------------------ */
    var lightbox = document.querySelector('.lightbox');
    var lightboxImg = lightbox ? lightbox.querySelector('img') : null;

    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.classList.add('is_open');
        document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is_open');
        document.body.style.overflow = '';
    }
    document.querySelectorAll('[data-lightbox]').forEach(function (el) {
        el.addEventListener('click', function () {
            var img = el.querySelector('img');
            if (img) openLightbox(img.currentSrc || img.src, img.alt);
        });
    });
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target.closest('.lightbox_close')) closeLightbox();
        });
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    /* ------------------------------------------------------------------
       Only allow one project accordion open at a time (optional, nicer UX)
       ------------------------------------------------------------------ */
    var projectDetails = document.querySelectorAll('.project_detail');
    projectDetails.forEach(function (detail) {
        detail.addEventListener('toggle', function () {
            if (detail.open) {
                projectDetails.forEach(function (other) {
                    if (other !== detail) other.open = false;
                });
            }
        });
    });

    /* Open the project accordion targeted by the URL hash (from timeline links) */
    function openFromHash() {
        var id = window.location.hash.replace('#', '');
        if (!id) return;
        var target = document.getElementById(id);
        if (target && target.tagName === 'DETAILS') {
            target.open = true;
            setTimeout(function () {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();

    /* ------------------------------------------------------------------
       Footer year
       ------------------------------------------------------------------ */
    var yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
