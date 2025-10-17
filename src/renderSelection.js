import { CELL } from './config.js';

/**
 * Renders selection rectangle based on state.drag {active, r0, c0, r1, c1}
 * @param gSel D3 selector for the selection layer g element of the app.
 * @param state JS object with the current state information for the app.
 */
export function renderSelection(gSel, state) {
    gSel.selectAll('*').remove();
    if (!state.drag.active) return;
    const r0 = Math.min(state.drag.r0, state.drag.r1);
    const r1 = Math.max(state.drag.r0, state.drag.r1);
    const c0 = Math.min(state.drag.c0, state.drag.c1);
    const c1 = Math.max(state.drag.c0, state.drag.c1);
    gSel.append('rect')
        .attr('x', c0 * CELL + 0.5)
        .attr('y', r0 * CELL + 0.5)
        .attr('width', (c1 - c0 + 1) * CELL - 1)
        .attr('height', (r1 - r0 + 1) * CELL - 1)
        .attr('fill', getComputedStyle(document.documentElement).getPropertyValue('--select-fill'))
        .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--select-stroke'))
        .attr('stroke-width', 1.5);
}