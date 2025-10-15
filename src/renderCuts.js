import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { CELL, GRID_W, GRID_H } from './config.js';

// Renders cut lines based on state.cuts {rows:Set, columns:Set}
export function renderCuts(gCuts, state) {
const vData = Array.from(state.cuts.columns).map(c => ({ c }));
const v = gCuts.selectAll('line.vcut').data(vData, d => d.c);
v.join(
        enter => enter.append('line')
            .attr('class', 'vcut')
            .attr('x1', d => d.c * CELL + 0.5)
            .attr('x2', d => d.c * CELL + 0.5)
            .attr('y1', 0).attr('y2', GRID_H)
            .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--grid-stroke-bold'))
            .attr('stroke-width', 2.5),
        update => update.attr('x1', d => d.c * CELL + 0.5).attr('x2', d => d.c * CELL + 0.5),
        exit => exit.remove()
    );

    const hData = Array.from(state.cuts.rows).map(r => ({ r }));
    const h = gCuts.selectAll('line.hcut').data(hData, d => d.r);
    h.join(
        enter => enter.append('line')
            .attr('class', 'hcut')
            .attr('y1', d => d.r * CELL + 0.5)
            .attr('y2', d => d.r * CELL + 0.5)
            .attr('x1', 0).attr('x2', GRID_W)
            .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--grid-stroke-bold'))
            .attr('stroke-width', 2.5),
        update => update.attr('y1', d => d.r * CELL + 0.5).attr('y2', d => d.r * CELL + 0.5),
        exit => exit.remove()
    );
}