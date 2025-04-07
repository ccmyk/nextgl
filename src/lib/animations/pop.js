// src/lib/animations/pop.js

'use client';

// React-adapted version of legacy pop.js
// Fully preserves original method logic, now wrapped for React-style consumption where possible

export function addPop(mainRef) {
  if (!mainRef?.current?.onPopState) return;
  window.addEventListener('popstate', mainRef.current.onPopState, { passive: true });
}

export function onPopState(e) {
  if (this.isload === 1) {
    e.preventDefault();
    return false;
  }
  this.onChange({
    url: window.location.pathname,
    link: null,
  });
}

export async function onChange({ url = null, link = null }) {
  url = url.replace(window.location.origin, '');
  if (this.isload === 1 || this.url === url) return;

  this.lenis.stop();
  this.issame = 0;
  this.page.isVisible = false;
  this.isload = 1;

  if (this.mouse) this.mouse.clean();

  let time = 1200;
  this.url = url;
  const request = await fetch(url, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  const response = await request.text();
  const push = true;

  if (this.gl) this.gl.cleanTemp();

  const checkout = await this.page.animOut(link, this.lenis);

  if (Array.isArray(checkout)) {
    time = 0;
    const faketit = document.createElement('div');
    faketit.className = 'faketit c-vw nfo';
    faketit.appendChild(checkout[0].cloneNode(true));
    faketit.appendChild(checkout[1].cloneNode(true));
    checkout[0].remove();
    checkout[1].remove();
    document.body.insertBefore(faketit, document.body.firstChild);
  }

  await this.timeout(time);

  await this.onRequest({ push, response, url });
}

export async function onRequest({ push, response, url }) {
  const html = document.createElement('div');
  html.innerHTML = response;

  const title = html.querySelector('title');
  if (title) document.title = title.textContent;

  this.content = html.querySelector('#content');
  if (push) window.history.pushState({}, document.title, url);

  await this.page.hide();
  this.lenis.scrollTo(0, { immediate: true, lock: true, force: true });
  this.page.DOM.el.remove();

  this.template = this.content.dataset.template;
  this.newpage = this.pages.get(this.template);
  this.newpage.id = this.content.dataset.id;
  this.newpage.ispop = 1;

  await this.newpage.create(this.content, this.main, null);
  if (this.gl) await this.gl.createTemp(this.template);
}

export async function newView() {
  if (this.mouse) this.mouse.reset();

  document.body.style.pointerEvents = '';
  this.isload = 0;
  this.newpage.show(0);
  if (this.canvas) this.canvas.show();

  this.page = this.newpage;
  await this.page.start(0);
  if (this.gl) this.gl.show();

  this.newpage.ispop = 0;

  this.addControllers();
  this.lenis.start();
}

export function resetLinks() {
  const links = document.querySelectorAll('a');
  const actual = window.location.href;

  links.forEach((link) => {
    const isLocal = link.href.startsWith(this.main.base);
    const isAnchor = link.href.includes('#');

    if (link.dataset.type && !isAnchor) {
      if (import.meta.env.DEV) {
        link.href = '/' + link.dataset.type + '.html';
      }
      link.removeAttribute('data-type');
    }

    if (isLocal || isAnchor) {
      link.onclick = async (event) => {
        event.preventDefault();
        if (!isAnchor) {
          this.onChange({
            url: link.href,
            id: link.dataset.id,
            link: link,
          });
        } else {
          if (this.nav.isOpen === 1) {
            this.nav.isOpen = 0;
            this.nav.closeMenu();
            await this.timeout(450);
          }
          const anchorId = link.href.split('#')[1];
          if (anchorId) {
            this.lenis.scrollTo('#' + anchorId, { offset: -100 });
          }
        }
      };
    } else if (!link.href.startsWith('mailto') && !link.href.startsWith('tel')) {
      link.rel = 'noopener';
      link.target = '_blank';
    }

    if (actual === link.href) {
      link.classList.add('actLink');
    } else {
      link.classList.remove('actLink');
    }
  });
}