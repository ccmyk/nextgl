import Pg from './Pg';
import * as position from './position';
import vertexShader from './shaders/pg.vert.glsl';
import fragmentShader from './shaders/pg.frag.glsl';

export default Pg;
export { position, vertexShader, fragmentShader };