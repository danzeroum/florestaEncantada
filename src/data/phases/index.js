/**
 * Catálogo de fases — fonte única de verdade.
 * Adicionar uma fase nova = adicionar um arquivo + import aqui.
 */

import phase01 from './phase-01.js';
import phase02 from './phase-02.js';

export const PHASES = [phase01, phase02];

export const TOTAL_PHASES = PHASES.length;
