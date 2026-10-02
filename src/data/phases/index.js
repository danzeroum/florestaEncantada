/**
 * Catálogo de fases — fonte única de verdade.
 * Adicionar uma fase nova = adicionar um arquivo + import aqui.
 */

import phase01 from './phase-01.js';
import phase02 from './phase-02.js';
import phase03 from './phase-03.js';
import phase04 from './phase-04.js';
import phase05 from './phase-05.js';
import phase06 from './phase-06.js';
import phase07 from './phase-07.js';
import phase08 from './phase-08.js';
import phase09 from './phase-09.js';
import phase10 from './phase-10.js';

export const PHASES = [
  phase01,
  phase02,
  phase03,
  phase04,
  phase05,
  phase06,
  phase07,
  phase08,
  phase09,
  phase10,
];

export const TOTAL_PHASES = PHASES.length;
