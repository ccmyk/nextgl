// src/components/gl/bg/position.js
// 🏜️

export function check(entry, instance) {
  if (!entry.isIntersecting) return false;

  entry.isIntersecting ? instance.start() : instance.stop(entry.boundingClientRect.y);
  return entry.isIntersecting;
}

export function start(instance) {
  if (instance.active === 1) return;
  instance.animstart?.pause();
  instance.active = 1;
}

export function stop(y, instance) {
  if (instance.active === 0) return;

  if (instance.animstart) {
    if (y < -1) {
      instance.animstart.reverse();
      instance.ctr.prog = instance.ctr.progt = 1;
      instance.active = 1;
    } else {
      instance.animstart.play();
      instance.ctr.prog = instance.ctr.progt = 0;
      instance.active = 0;
    }
  }
}

export function updateY(y = 0, instance) {
  if (instance.ctr.stop !== 1) {
    instance.ctr.current = Math.max(0, Math.min(instance.ctr.limit, y - instance.ctr.start));
  }
}

export function updateAnim(instance) {
  instance.ctr.progt = (instance.ctr.current / instance.ctr.limit).toFixed(3);
  instance.ctr.prog = instance.ctr.prog + (instance.ctr.progt - instance.ctr.prog) * 0.045;
  instance.animstart?.progress(1 - instance.ctr.prog);
}

export function updateScale(instance) {
  instance.mesh.scale.x = (instance.viewport[0] * instance.bound[2]) / instance.screen[0];
  instance.mesh.scale.y = (instance.viewport[1] * instance.bound[3]) / instance.screen[1];
}}