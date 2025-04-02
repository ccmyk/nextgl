"use client";

import * as CreateMethods from "./create.js";
import * as ElsMethods from "./els.js";
import * as IOSMethods from "./ios.js";
import * as EventMethods from "./events.js";

/**
 * WebGL Canvas Manager
 */
class Canvas {
  constructor(main) {
    this.main = main;
    this.viewport = { width: 1, height: 1 };
    this.isVisible = false;
    this.ios = [];
    this.iosMap = new Map();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async changeSlides(state = 0) {
    let footer = null;

    const updateElements = (name, callback) => {
      this.updateIosElements(name, state, (element) => {
        if (element.name === "Footer") {
          footer = element;
        }
      });
    };

    if (state === 1) {
      this.updateIosElements("Slides", state);
      await window.waiter(1400);
      updateElements("Roll");
    } else {
      updateElements("Roll");
      this.updateIosElements("Slides", state);
      await window.waiter(800);
    }

    if (footer) {
      footer.onResize(this.viewport, this.main.screen);
    }
  }


  updateIosElements(name, state, callback) {
    for (let [, element] of this.iosMap.entries()) {
      if (element.name === name) {
        element.changeState(state);
      } else if (callback) {
        callback(element);
      }
    }
  }
}

Object.assign(
  Canvas.prototype,
  CreateMethods,
  ElsMethods,
  IOSMethods,
  EventMethods
);

export default Canvas;