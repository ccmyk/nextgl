export function addPop() {
  window.addEventListener('popstate', this.onPopState, { passive: true });
}

// EVENTS
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
  this.isload = 1;

  if (this.mouse) {
    this.mouse.clean();
  }

  let time = 1200;
  this.url = url;

  const request = await fetch(url, {
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  const response = await request.text();
  var push = true;

  if (this.gl) {
    this.gl.cleanTemp();
  }

  await this.page.animOut(link, this.lenis);

  await this.timeout(time);

  await this.onRequest({ push, response, url });
}

// new URL call
export async function onRequest({ push, response, url }) {
  const html = document.createElement('div');
  html.innerHTML = response;

  if (html.querySelector('title')) {
    document.title = html.querySelector('title').textContent;
  }

  this.content = html.querySelector('#content');

  if (push) {
    window.history.pushState({}, document.title, url);
  }

  await this.page.hide();
  this.lenis.scrollTo(0, { immediate: true, lock: true, force: true });
  this.page.DOM.el.remove();

  this.template = this.content.dataset.template;
  this.newpage = this.pages.get(this.template);
  await this.newpage.create(this.content, this.main, null);
}

export async function newView() {
  this.isload = 0;
  this.newpage.show(0);
  this.page = this.newpage;
  this.addControllers();
  this.lenis.start();
}

export function resetLinks() {
  const links = document.querySelectorAll('a');

  const actual = window.location.href;
  for (let link of links) {
    if (link.classList.contains('Awrite')) {
      // link.onmouseenter = () => this.writeFn(link)
      // link.onmouseenter = () => {
      //   this.main.events.animglobal.detail.el = link
      //   document.dispatchEvent(this.main.events.animglobal)
      // }
    }

    let isLocal = link.href.indexOf(this.main.base) === 0;
    const isAnchor = link.href.indexOf('#') > -1;

    if (link.dataset.type && !isAnchor) {
      if (import.meta.env.DEV) {
        isLocal = true;
        if (link.dataset.type) {
          link.href = '/' + link.dataset.type + '.html';
        }
      }
      link.removeAttribute('data-type');
    }

    if (isLocal || isAnchor) {
      link.onclick = async (event) => {
        event.preventDefault();

        import { useRouter } from "next/navigation";

        export default function useNavigation() {
          const router = useRouter();

          function handleLinkClick(event, link) {
            event.preventDefault();
            router.push(link.href);
          }

          return { handleLinkClick };
        }

        } else {
          if (this.nav.isOpen === 1) {
            this.nav.isOpen = 0;
            this.nav.closeMenu();
            await this.timeout(450);
          }
          if (link.href.split('#').length === 2) {
            this.lenis.scrollTo('#' + link.href.split('#')[1], { offset: -100 });
          }
        }
      };
    } else if (link.href.indexOf('mailto') === -1 && link.href.indexOf('tel') === -1) {
      link.rel = 'noopener';
      link.target = '_blank';
    }
    //CLEAN CLASS
    if (actual === link.href) {
      link.classList.add('actLink');
    } else {
      link.classList.remove('actLink');
    }
  }
}
