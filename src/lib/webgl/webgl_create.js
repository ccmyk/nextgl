import { Camera, Plane, Triangle, Mesh, Geometry, Texture, Text, RenderTarget, Transform, Program, Vec2 } from 'ogl';

// import imurl from './e.jpeg?url';

export async function create(texs = []) {
  // this.camera = await this.createCamera()
  // await this.createScene()

  // const fntAss = await this.createMSDF()
  // console.log(fntAss)
  // this.fontMSDF = fntAss[0]

  // await this.createPrograms()
  // console.log('creo tex')
  await this.createAssets(texs);
  // console.log('termino tex')

  let div = document.createElement('div');
  div.dataset.temp = 'loader';

  this.loader = await this.createEls(div);

  await this.onResize();

  if (typeof this.isVisible === 'number') {
    this.isVisible = String(this.isVisible);
  }
  this.isVisible = '1';
}

export function createCamera(gl = this.gl) {
  let camera = new Camera(gl);
  const positionZ = camera.position.z.toString();
  camera.position.z = Number(positionZ);
  camera.position.z = 45;
  return camera;
}

export function createScene() {
  this.scene = new Transform();
}

export async function cleanTemp() {
  for (let [i, a] of this.iosmap.entries()) {
    if (a.active === 1) {
      a.removeEvents();
    } else {
      if (a.renderer) {
        a.renderer.gl.getExtension('WEBGL_lose_context').loseContext();
        a.canvas.remove();
      }
    }
  }

  // this.isVisible = 0

  // for(let a of this.ios){

  //   a.removeEvents()
  //   a.el.removeAttribute('data-oi')

  //   this.obs.unobserve(a.el)
  //   this.scene.removeChild(a.plane)
  // }
}

export async function createTemp(temp) {
  this.ios = [];
  const tempString = String(temp || 'base');
  this.temp = tempString;

  for (let [i, a] of this.iosmap.entries()) {
    this.iosmap.delete(i);
  }

  this.iosmap = new Map();

  await this.createIos();
}

export async function createIos() {
  let ios = document.querySelectorAll('main .Oi');

  // let triangle = new Triangle(this.gl)

  for (let [i, ioel] of ios.entries()) {
    ioel.dataset.oi = i;
    let io = null;

    let objio = [];
    let mesh = '';
    let geometry = '';
    let text = '';
    let plane = '';
    let tex = '';
    let program = '';

    let geometext = '';
    let meshtext = '';
    let target = '';

    let exp = ioel.dataset.temp || 'base';

    io = await this.createEls(ioel);

    if (io.isready === 0) {
      io.isready = 1;
      io.el.style.visibility = 'hidden';
      io.isdone = 0;

      io.onResize(this.viewport, this.main.screen);

      this.iosmap.set(i, io);
    } else if (io.el.classList.contains('Oi-pgel')) {
      this.iosmap.set(i, io);
      ioel.dataset.oi = io.pos;
    }
  }

  await this.loadIos();
  if (typeof this.isVisible === 'number') {
    this.isVisible = String(this.isVisible);
  }
  this.isVisible = '1';
}

export async function show() {
  this.showIos();
  await this.timeout(64);
  this.callIos();
}
