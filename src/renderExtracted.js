import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

/**
 * Renders extracted matrices in the specified container
 * @param containerSel The container div to render the user-extracted matrix in.
 * @param state JS object with the current state information for the app.
 */
export function renderExtracted(containerSel, state) {
    const container = d3.select(containerSel);
    const cards = container.selectAll('div.mini').data(state.extracted, d => d.id);


    const enter = cards.enter().append('div')
        .attr('class', 'mini')
        .on('click', (_, d) => {
        state.selectedExtractedId = d.id;
            renderExtracted(containerSel, state);
        });


    enter.append('h4');
    enter.append('div').attr('class', 'mini-svg');


    const all = enter.merge(cards);
    all.classed('selected', d => d.id === state.selectedExtractedId);


    all.select('h4')
    .text(d => `r${d.rect.r0}–${d.rect.r1}, c${d.rect.c0}–${d.rect.c1} (${d.data.length}×${d.data[0].length})`);


    all.each(function(d) {
        const s = d3.select(this).select('.mini-svg');
        s.selectAll('*').remove();
        const cellPx = 14;
        const w = 120;
        const h = Math.max(90, d.data.length * cellPx);
        const svgMini = s.append('svg').attr('width', w).attr('height', h);
        const cellW = Math.floor(w / d.data[0].length);
        const cellH = Math.floor(h / d.data.length);
        const g = svgMini.append('g');


        for (let r = 0; r < d.data.length; r++) {
            for (let c = 0; c < d.data[0].length; c++) {
                    g.append('rect')
                    .attr('x', c * cellW)
                    .attr('y', r * cellH)
                    .attr('width', cellW)
                    .attr('height', cellH)
                    .attr('fill', '#fff')
                    .attr('stroke', '#e5e7eb');
                }
            }
        g.append('rect')
        .attr('x', 0).attr('y', 0)
        .attr('width', d.data[0].length * cellW)
        .attr('height', d.data.length * cellH)
        .attr('fill', 'none')
        .attr('stroke', '#9ca3af')
        .attr('stroke-width', 1.2);
    });


    cards.exit().remove();
}