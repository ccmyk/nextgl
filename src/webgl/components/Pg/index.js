'use client'

import Pg from './Pg';
import * as position from './geometry';
import vertexShader from './shaders/main.vert.glsl';
import fragmentShader from './shaders/main.frag.glsl';

export default Pg;
export { position, vertexShader, fragmentShader };