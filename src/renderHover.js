import { CELL, GRID_H, GRID_W, GUTTER } from './config.js';

/**
 * Renders hover line based on state.hover {type:'row'|'col', index}
 * @param gHover D3 selector for the hover layer g element for the app.
 * @param state JS object with the current state information for the app.
 */
export function renderHover(gHover, state) {
    gHover.selectAll('*').remove();
    if (!state.hover.type || state.hover.index == null) return;
    if (state.hover.type === 'col') {
        const x = state.hover.index * CELL + 0.5;
        gHover.append('line')
            .attr('x1', x).attr('x2', x)
            .attr('y1', -GUTTER).attr('y2', GRID_H)
            .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--hover-line'))
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-width', 1.5);
    } else {
        const y = state.hover.index * CELL + 0.5;
        gHover.append('line')
            .attr('y1', y).attr('y2', y)
            .attr('x1', -GUTTER).attr('x2', GRID_W)
            .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--hover-line'))
            .attr('stroke-dasharray', '3,3')
            .attr('stroke-width', 1.5);
    }
}