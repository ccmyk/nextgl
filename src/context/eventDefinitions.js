// src/context/eventDefinitions.js

export const eventDefinitions = {
  startScroll: new Event("startscroll"),
  stopScroll: new Event("stopscroll"),
  scrollTo: new CustomEvent("scrollto", {
    bubbles: true,
    detail: { id: "" },
  }),
  anim: new CustomEvent("anim", {
    detail: { el: null, state: 0, style: 0, params: [0] },
  }),
  nextPrj: new CustomEvent("nextprj", {
    detail: { el: null, url: "" },
  }),
  newLinks: new Event("newlinks"),
  openMenu: new Event("openmenu"),
  closeMenu: new Event("closemenu"),
  visibilityChange: new Event("visibilitychange"),
  popState: new Event("popstate"),
  // Additional custom definitions as needed:
  // animShow: new CustomEvent("animshow", { detail: { el: null, param: 0 } }),
  // animHide: new CustomEvent("animhide", { detail: { el: null, param: 0 } }),
  // animCreate: new CustomEvent("animcreate", { detail: { el: null, param: 0 } }),
};