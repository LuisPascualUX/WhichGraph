import * as d3 from "d3";

/** Normaliza para comparar claves sin acentos */
function norm(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim();
}

/**
 * Identificador de preview por nombre exacto de la lista (74 gráficas).
 * Orden: coincidencias más específicas primero.
 */
export function getPreviewId(chartName) {
  const n = norm(chartName);
  const table = [
    ["grafico de abanico", "fan"],
    ["mapa de calor calendario", "calendarHeat"],
    ["linea + columna temporal", "comboLineColumn"],
    ["cronologia de priestley", "priestley"],
    ["linea de tiempo circular", "circleTimeline"],
    ["dispersion conectada", "connectedScatter"],
    ["linea de tiempo vertical", "verticalTimeline"],
    ["grafico de velas", "candlestick"],
    ["grafico de torrente", "streamgraph"],
    ["grafico de area", "area"],
    ["sismograma", "seismogram"],
    ["columna emparejada", "pairedColumns"],
    ["barra emparejada", "pairedBars"],
    ["columna/barra apilada", "stackedBar"],
    ["isotipo (pictograma)", "pictogram"],
    ["grafico de piruletas", "lollipop"],
    ["simbolo proporcional ordenado", "orderedSymbols"],
    ["simbolos proporcionales", "proportionalSymbols"],
    ["simbolo proporcional", "proportionalSymbols"],
    ["coordenadas paralelas", "parallelCoords"],
    ["grafico de bala", "bullet"],
    ["barra divergente apilada", "divergingStacked"],
    ["barra divergente", "divergingBar"],
    ["linea superavit/deficit", "surplusLine"],
    ["spine chart", "spine"],
    ["columnas ordenadas", "orderedColumns"],
    ["diagrama de tira de puntos", "dotStrip"],
    ["barras ordenadas", "orderedBars"],
    ["bump chart", "bump"],
    ["mapa de calor xy", "xyHeatmap"],
    ["grafico de tarta", "pie"],
    ["grafico de anillos", "donut"],
    ["mapa de arbol", "treemap"],
    ["diagrama de cuadrilla", "waffle"],
    ["diagrama de venn", "venn"],
    ["mapa coropletico", "choropleth"],
    ["cartograma a escala", "cartogramScaled"],
    ["cartograma ecualizado", "cartogramEqual"],
    ["mapa de contorno", "contour"],
    ["densidad de puntos", "densityDots"],
    ["mapa de calor", "geoHeat"],
    ["barras agrupadas", "groupedBars"],
    ["mapa de flujo", "flowMap"],
    ["histograma", "histogram"],
    ["caja y bigotes", "boxplot"],
    ["diagrama de violin", "violin"],
    ["piramide de poblacion", "pyramid"],
    ["curva acumulativa", "cumulative"],
    ["diagrama de puntos", "dotPlot"],
    ["beeswarm", "beeswarm"],
    ["poligonos de frecuencia", "frequencyPolygon"],
    ["grafico de codigo de barras", "barcode"],
    ["marimekko", "marimekko"],
    ["voronoi", "voronoi"],
    ["arco", "arcPart"],
    ["cascada", "waterfall"],
    ["sankey", "sankey"],
    ["cuerdas", "chord"],
    ["red", "network"],
    ["burbujas", "bubble"],
    ["dispersion", "scatter"],
    ["radar", "radar"],
    ["pendiente", "slope"],
    ["linea", "line"],
    ["columna", "column"],
    ["barra", "barH"],
  ];
  const sorted = [...table].sort((a, b) => b[0].length - a[0].length);
  for (const [key, id] of sorted) {
    if (n.includes(key)) return id;
  }
  return "column";
}

function bg(g, w, h) {
  g.append("rect").attr("width", w).attr("height", h).attr("rx", 10).attr("fill", "rgba(4,10,20,.35)").attr("stroke", "rgba(140,170,255,.17)");
}

export function drawChartPreview(container, chartName, seed, rng) {
  const width = 280;
  const height = 108;
  const svg = d3.select(container).html("").append("svg").attr("viewBox", `0 0 ${width} ${height}`);
  const g = svg.append("g").attr("transform", "translate(8,8)");
  const w = width - 16;
  const h = height - 16;
  const a = `hsl(${seed % 360} 85% 62%)`;
  const b = `hsl(${(seed + 140) % 360} 75% 58%)`;
  const c = `hsl(${(seed + 70) % 360} 70% 55%)`;
  bg(g, w, h);
  const id = getPreviewId(chartName);

  const xPad = [12, w - 12];
  const yPad = [h - 12, 12];

  const draw = {
    column() {
      const vals = d3.range(7).map(() => 10 + rng() * 32);
      const x = d3.scaleBand().domain(d3.range(vals.length)).range(xPad).padding(0.2);
      const y = d3.scaleLinear().domain([0, 45]).range(yPad);
      g.selectAll("rect")
        .data(vals)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d))
        .attr("rx", 3)
        .attr("fill", a);
    },
    barH() {
      const vals = d3.range(5).map(() => 15 + rng() * 40);
      const y = d3.scaleBand().domain(d3.range(vals.length)).range([14, h - 14]).padding(0.25);
      const x = d3.scaleLinear().domain([0, 60]).range([18, w - 10]);
      g.selectAll("rect")
        .data(vals)
        .join("rect")
        .attr("x", 18)
        .attr("y", (_, i) => y(i))
        .attr("width", (d) => x(d) - 18)
        .attr("height", y.bandwidth())
        .attr("rx", 3)
        .attr("fill", a);
    },
    pairedColumns() {
      const x = d3.scaleBand().domain(d3.range(4)).range(xPad).padding(0.25);
      const y = d3.scaleLinear().domain([0, 40]).range(yPad);
      const sub = d3.scaleBand().domain([0, 1]).range([0, x.bandwidth()]).padding(0.1);
      d3.range(4).forEach((i) => {
        [12, 22].forEach((v, j) => {
          g.append("rect")
            .attr("x", x(i) + sub(j))
            .attr("y", y(v + rng() * 6))
            .attr("width", sub.bandwidth())
            .attr("height", y(0) - y(v))
            .attr("rx", 2)
            .attr("fill", j ? b : a);
        });
      });
    },
    pairedBars() {
      const y = d3.scaleBand().domain(d3.range(4)).range([12, h - 12]).padding(0.2);
      const x = d3.scaleLinear().domain([0, 50]).range([w / 2 - 6, 14]);
      const xr = d3.scaleLinear().domain([0, 50]).range([w / 2 + 6, w - 14]);
      d3.range(4).forEach((i) => {
        const v = 15 + rng() * 20;
        g.append("rect").attr("x", x(v)).attr("y", y(i)).attr("width", w / 2 - 6 - x(v)).attr("height", y.bandwidth()).attr("rx", 2).attr("fill", a);
        g.append("rect").attr("x", w / 2 + 6).attr("y", y(i)).attr("width", xr(v) - (w / 2 + 6)).attr("height", y.bandwidth()).attr("rx", 2).attr("fill", b);
      });
    },
    line() {
      const vals = d3.range(12).map((i) => 12 + Math.sin(i / 2) * 10 + rng() * 8);
      const x = d3.scaleLinear().domain([0, vals.length - 1]).range(xPad);
      const y = d3.scaleLinear().domain([0, 40]).range(yPad);
      g.append("path")
        .datum(vals)
        .attr("d", d3.line().curve(d3.curveMonotoneX).x((_, i) => x(i)).y((d) => y(d)))
        .attr("fill", "none")
        .attr("stroke", a)
        .attr("stroke-width", 2.2);
    },
    area() {
      const vals = d3.range(12).map((i) => 8 + i * 2 + rng() * 5);
      const x = d3.scaleLinear().domain([0, vals.length - 1]).range(xPad);
      const y = d3.scaleLinear().domain([0, 45]).range(yPad);
      g.append("path")
        .datum(vals)
        .attr(
          "d",
          d3.area().curve(d3.curveMonotoneX).x((_, i) => x(i)).y0(y(0)).y1((d) => y(d))
        )
        .attr("fill", a)
        .attr("opacity", 0.35);
      g.append("path")
        .datum(vals)
        .attr("d", d3.line().curve(d3.curveMonotoneX).x((_, i) => x(i)).y((d) => y(d)))
        .attr("fill", "none")
        .attr("stroke", b)
        .attr("stroke-width", 1.8);
    },
    fan() {
      const cx = w / 2;
      const cy = h - 8;
      const base = -Math.PI * 0.85;
      d3.range(5).forEach((k) => {
        const pts = d3.range(8).map((i) => {
          const t = base + (Math.PI * 0.7 * i) / 7;
          const r = 18 + k * 8 + rng() * 4;
          return [cx + Math.cos(t) * r, cy + Math.sin(t) * r * 0.55];
        });
        g.append("path")
          .datum(pts)
          .attr("d", d3.line().curve(d3.curveCardinal)(pts))
          .attr("fill", "none")
          .attr("stroke", d3.interpolate(a, b)(k / 5))
          .attr("stroke-width", 1.4)
          .attr("opacity", 0.55);
      });
    },
    comboLineColumn() {
      const vals = d3.range(6).map(() => 12 + rng() * 22);
      const x = d3.scaleBand().domain(d3.range(vals.length)).range(xPad).padding(0.22);
      const y = d3.scaleLinear().domain([0, 40]).range(yPad);
      g.selectAll("rect")
        .data(vals)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d))
        .attr("rx", 2)
        .attr("fill", a)
        .attr("opacity", 0.55);
      const lineY = vals.map((d, i) => y(d * 0.65 + 8));
      const lineX = vals.map((_, i) => x(i) + x.bandwidth() / 2);
      g.append("path")
        .datum(lineY.map((ly, i) => [lineX[i], ly]))
        .attr("d", d3.line()(lineY.map((ly, i) => [lineX[i], ly])))
        .attr("fill", "none")
        .attr("stroke", b)
        .attr("stroke-width", 2);
    },
    calendarHeat() {
      const cols = 7;
      const rows = 4;
      const cw = (w - 16) / cols;
      const ch = (h - 16) / rows;
      const color = d3.scaleSequential(d3.interpolateBlues).domain([0, 1]);
      d3.range(cols * rows).forEach((i) => {
        const v = ((i * 7 + seed) % 13) / 12;
        g.append("rect")
          .attr("x", 8 + (i % cols) * cw)
          .attr("y", 8 + Math.floor(i / cols) * ch)
          .attr("width", cw - 2)
          .attr("height", ch - 2)
          .attr("rx", 2)
          .attr("fill", color(v));
      });
    },
    priestley() {
      const y = d3.scaleBand().domain(d3.range(4)).range([10, h - 10]).padding(0.2);
      d3.range(4).forEach((row) => {
        let x0 = 14;
        d3.range(3).forEach(() => {
          const len = 30 + rng() * 45;
          g.append("rect").attr("x", x0).attr("y", y(row)).attr("width", len).attr("height", y.bandwidth()).attr("rx", 2).attr("fill", a).attr("opacity", 0.75);
          x0 += len + 4;
        });
      });
    },
    circleTimeline() {
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.38;
      const arc = d3.arc().innerRadius(r * 0.55).outerRadius(r);
      const pie = d3.pie().value(1).sort(null)(d3.range(8));
      g.append("g")
        .attr("transform", `translate(${cx},${cy})`)
        .selectAll("path")
        .data(pie)
        .join("path")
        .attr("d", arc)
        .attr("fill", (_, i) => (i % 2 ? a : b))
        .attr("opacity", 0.75);
    },
    connectedScatter() {
      const pts = d3.range(9).map((i) => [14 + (i / 8) * (w - 28), 12 + Math.sin(i) * 18 + rng() * 10]);
      const x = d3.scaleLinear().domain(d3.extent(pts, (d) => d[0])).range(xPad);
      const y = d3.scaleLinear().domain(d3.extent(pts, (d) => d[1])).range(yPad);
      const scaled = pts.map((p) => [x(p[0]), y(p[1])]);
      g.append("path").datum(scaled).attr("d", d3.line()(scaled)).attr("fill", "none").attr("stroke", b).attr("stroke-width", 1.5).attr("opacity", 0.7);
      g.selectAll("circle")
        .data(scaled)
        .join("circle")
        .attr("cx", (d) => d[0])
        .attr("cy", (d) => d[1])
        .attr("r", 3.2)
        .attr("fill", a);
    },
    verticalTimeline() {
      const x0 = w / 2;
      const ys = d3.range(5).map((i) => 14 + (i / 4) * (h - 28));
      g.append("line").attr("x1", x0).attr("x2", x0).attr("y1", ys[0]).attr("y2", ys[4]).attr("stroke", "#5a6d9a").attr("stroke-width", 2);
      ys.forEach((yy, i) => {
        g.append("circle").attr("cx", x0).attr("cy", yy).attr("r", i === 2 ? 5 : 3).attr("fill", i === 2 ? b : a);
      });
    },
    seismogram() {
      const pts = d3.range(80).map((i) => [4 + (i / 79) * (w - 8), h / 2 + Math.sin(i * 0.45) * (8 + (i % 7)) * 0.8]);
      g.append("path").datum(pts).attr("d", d3.line().curve(d3.curveLinear)(pts)).attr("fill", "none").attr("stroke", a).attr("stroke-width", 1.2);
    },
    candlestick() {
      const x = d3.scaleBand().domain(d3.range(6)).range(xPad).padding(0.35);
      const y = d3.scaleLinear().domain([0, 50]).range(yPad);
      d3.range(6).forEach((i) => {
        const o = 20 + rng() * 20;
        const c = o + (rng() - 0.5) * 12;
        const hi = Math.max(o, c) + 4;
        const lo = Math.min(o, c) - 4;
        const cx = x(i) + x.bandwidth() / 2;
        g.append("line").attr("x1", cx).attr("x2", cx).attr("y1", y(hi)).attr("y2", y(lo)).attr("stroke", "#8a9bc4").attr("stroke-width", 1.2);
        g.append("rect")
          .attr("x", x(i))
          .attr("y", y(Math.max(o, c)))
          .attr("width", x.bandwidth())
          .attr("height", Math.abs(y(o) - y(c)) || 2)
          .attr("rx", 1)
          .attr("fill", c >= o ? b : a);
      });
    },
    streamgraph() {
      const m = 22;
      const data = d3.range(m).map((i) => ({
        x: i,
        s1: 4 + Math.sin(i / 3) * 3 + rng() * 2,
        s2: 3 + Math.cos(i / 4) * 2.5 + rng() * 2,
        s3: 2.5 + Math.sin(i / 2) * 2 + rng() * 1.5,
      }));
      const series = d3.stack().keys(["s1", "s2", "s3"])(data);
      const x = d3.scaleLinear().domain([0, m - 1]).range(xPad);
      const maxY = d3.max(series, (layer) => d3.max(layer, (d) => d[1]));
      const y = d3.scaleLinear().domain([0, maxY]).range(yPad);
      const area = d3
        .area()
        .x((d) => x(d.data.x))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]))
        .curve(d3.curveBasis);
      series.forEach((layer, j) => {
        g.append("path").datum(layer).attr("d", area).attr("fill", [a, b, c][j]).attr("opacity", 0.55);
      });
    },
    histogram() {
      const bins = [6, 14, 22, 18, 10, 5];
      const x = d3.scaleBand().domain(d3.range(bins.length)).range(xPad).padding(0.08);
      const y = d3.scaleLinear().domain([0, d3.max(bins)]).range(yPad);
      g.selectAll("rect")
        .data(bins)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d))
        .attr("fill", a);
    },
    boxplot() {
      const boxes = [
        { x: 40, q1: 48, q2: 38, q3: 28, lo: 58, hi: 18 },
        { x: 100, q1: 46, q2: 36, q3: 26, lo: 54, hi: 16 },
        { x: 160, q1: 50, q2: 40, q3: 30, lo: 60, hi: 20 },
      ];
      boxes.forEach((B) => {
        g.append("line").attr("x1", B.x).attr("x2", B.x).attr("y1", B.hi).attr("y2", B.lo).attr("stroke", "#7c8eb8").attr("stroke-width", 1);
        g.append("rect").attr("x", B.x - 10).attr("y", B.q3).attr("width", 20).attr("height", B.q1 - B.q3).attr("rx", 2).attr("fill", a).attr("opacity", 0.7);
        g.append("line").attr("x1", B.x - 10).attr("x2", B.x + 10).attr("y1", B.q2).attr("y2", B.q2).attr("stroke", "#e8ecff").attr("stroke-width", 1.5);
      });
    },
    violin() {
      [55, 120, 185].forEach((cx) => {
        const pts = d3.range(12).map((i) => {
          const t = (i / 11) * Math.PI;
          const width = Math.sin(t) * 22 + 2;
          return [cx + width, 12 + (i / 11) * (h - 24)];
        });
        const left = pts.map((p) => [2 * cx - p[0], p[1]]).reverse();
        const path = d3.line().curve(d3.curveBasis)([...pts, ...left, pts[0]]);
        g.append("path").attr("d", path).attr("fill", a).attr("opacity", 0.45);
      });
    },
    pyramid() {
      const mid = w / 2;
      const rows = 6;
      const y = d3.scaleBand().domain(d3.range(rows)).range([10, h - 10]).padding(0.15);
      d3.range(rows).forEach((i) => {
        const v = 8 + i * 3;
        g.append("rect").attr("x", mid - v * 2.2).attr("y", y(i)).attr("width", v * 2.2).attr("height", y.bandwidth()).attr("fill", a).attr("opacity", 0.8);
        g.append("rect").attr("x", mid).attr("y", y(i)).attr("width", v * 2.0).attr("height", y.bandwidth()).attr("fill", b).attr("opacity", 0.8);
      });
    },
    cumulative() {
      const pts = d3.range(15).map((i) => [8 + (i / 14) * (w - 16), h - 14 - (i / 14) * (h - 28) * (0.4 + rng() * 0.5)]);
      g.append("path").datum(pts).attr("d", d3.line().curve(d3.curveStepAfter)(pts)).attr("fill", "none").attr("stroke", a).attr("stroke-width", 2);
    },
    dotPlot() {
      const cats = d3.range(4);
      const y = d3.scaleBand().domain(cats).range([14, h - 10]).padding(0.35);
      cats.forEach((ci) => {
        d3.range(6).forEach((j) => {
          g.append("circle")
            .attr("cx", 20 + j * ((w - 40) / 5) + rng() * 4)
            .attr("cy", y(ci) + y.bandwidth() / 2)
            .attr("r", 2.8)
            .attr("fill", j > 3 ? b : a);
        });
      });
    },
    beeswarm() {
      const baseY = h / 2;
      d3.range(22).forEach((i) => {
        const x = 12 + (i / 21) * (w - 24);
        const dy = Math.sin(i * 1.2 + seed) * 10;
        g.append("circle").attr("cx", x).attr("cy", baseY + dy).attr("r", 2.6).attr("fill", a).attr("opacity", 0.85);
      });
    },
    frequencyPolygon() {
      const bins = [4, 10, 22, 28, 18, 8];
      const x = d3.scaleLinear().domain([0, bins.length - 1]).range(xPad);
      const y = d3.scaleLinear().domain([0, d3.max(bins)]).range(yPad);
      const pts = bins.map((v, i) => [x(i), y(v)]);
      const closed = [...pts, [x(bins.length - 1), y(0)], [x(0), y(0)]];
      g.append("path").attr("d", d3.line().curve(d3.curveLinear)(closed)).attr("fill", a).attr("opacity", 0.22);
      g.append("path").attr("d", d3.line().curve(d3.curveLinear)(pts)).attr("fill", "none").attr("stroke", b).attr("stroke-width", 2);
    },
    barcode() {
      d3.range(40).forEach((i) => {
        const t = (i + seed) % 5;
        if (t === 0) return;
        g.append("line")
          .attr("x1", 6 + i * ((w - 12) / 40))
          .attr("x2", 6 + i * ((w - 12) / 40))
          .attr("y1", 14 + (i % 3) * 4)
          .attr("y2", h - 10 - (i % 4) * 3)
          .attr("stroke", a)
          .attr("stroke-width", t > 2 ? 2.2 : 1)
          .attr("opacity", 0.75);
      });
    },
    dotStrip() {
      const y = h / 2;
      d3.range(14).forEach((i) => {
        g.append("circle").attr("cx", 16 + i * ((w - 32) / 13)).attr("cy", y + (i % 3) * 2 - 2).attr("r", 3).attr("fill", i % 4 === 0 ? b : a);
      });
    },
    lollipop() {
      const vals = d3.range(6).map(() => 12 + rng() * 28);
      const x = d3.scalePoint().domain(d3.range(vals.length)).range([16, w - 16]);
      const y = d3.scaleLinear().domain([0, 45]).range(yPad);
      g.selectAll("line")
        .data(vals)
        .join("line")
        .attr("x1", (_, i) => x(i))
        .attr("x2", (_, i) => x(i))
        .attr("y1", y(0))
        .attr("y2", (d) => y(d))
        .attr("stroke", "#6a7dad")
        .attr("stroke-width", 2);
      g.selectAll("circle")
        .data(vals)
        .join("circle")
        .attr("cx", (_, i) => x(i))
        .attr("cy", (d) => y(d))
        .attr("r", 4.5)
        .attr("fill", a);
    },
    pictogram() {
      d3.range(4).forEach((row) =>
        d3.range(6).forEach((col) => {
          g.append("circle")
            .attr("cx", 18 + col * 14)
            .attr("cy", 16 + row * 14)
            .attr("r", 4)
            .attr("fill", row * 6 + col < 18 ? a : "#3a4a6a")
            .attr("opacity", 0.85);
        })
      );
    },
    proportionalSymbols() {
      const pts = [
        [40, 30, 6],
        [90, 50, 10],
        [140, 28, 7],
        [190, 45, 12],
      ];
      g.append("path").attr("d", "M 10 55 Q 80 40 150 52 T 240 48").attr("fill", "none").attr("stroke", "#3d5280").attr("stroke-width", 1);
      pts.forEach((p) => g.append("circle").attr("cx", p[0]).attr("cy", p[1]).attr("r", p[2]).attr("fill", a).attr("opacity", 0.65));
    },
    radar() {
      const cx = w / 2;
      const cy = h / 2;
      const R = 32;
      const n = 6;
      const verts = d3.range(n).map((i) => {
        const ang = (-Math.PI / 2 + (i * 2 * Math.PI) / n);
        return [cx + Math.cos(ang) * R, cy + Math.sin(ang) * R * 0.85];
      });
      g.selectAll("line.axis")
        .data(verts)
        .join("line")
        .attr("class", "axis")
        .attr("x1", cx)
        .attr("y1", cy)
        .attr("x2", (d) => d[0])
        .attr("y2", (d) => d[1])
        .attr("stroke", "#4a5d8a")
        .attr("stroke-width", 0.8);
      const poly = verts.map((_, i) => {
        const t = 0.45 + 0.45 * rng();
        const ang = (-Math.PI / 2 + (i * 2 * Math.PI) / n);
        return [cx + Math.cos(ang) * R * t, cy + Math.sin(ang) * R * 0.85 * t];
      });
      g.append("path").datum([...poly, poly[0]]).attr("d", d3.line()(poly.concat([poly[0]]))).attr("fill", a).attr("fill-opacity", 0.35).attr("stroke", b).attr("stroke-width", 1.5);
    },
    parallelCoords() {
      const axes = 5;
      const xs = d3.range(axes).map((i) => 16 + (i * (w - 32)) / (axes - 1));
      const y = d3.scaleLinear().domain([0, 100]).range(yPad);
      xs.forEach((xv) => g.append("line").attr("x1", xv).attr("x2", xv).attr("y1", y(0)).attr("y2", y(100)).attr("stroke", "#3f5078").attr("stroke-width", 1));
      d3.range(3).forEach((k) => {
        const pts = xs.map((xv, i) => {
          const raw = 20 + (((i + k * 3) * 17 + seed) % 80);
          return [xv, y(raw)];
        });
        g.append("path").datum(pts).attr("d", d3.line()(pts)).attr("fill", "none").attr("stroke", k % 2 ? b : a).attr("stroke-width", 1.4).attr("opacity", 0.85);
      });
    },
    marimekko() {
      let x0 = 10;
      [0.35, 0.3, 0.35].forEach((bw, col) => {
        const W = (w - 20) * bw;
        let y0 = h - 12;
        [0.4, 0.35, 0.25].forEach((bh) => {
          const H = (h - 24) * bh;
          y0 -= H;
          g.append("rect").attr("x", x0).attr("y", y0).attr("width", W - 2).attr("height", H).attr("fill", col % 2 ? a : b).attr("opacity", 0.7);
        });
        x0 += W;
      });
    },
    bullet() {
      const y0 = h / 2 - 6;
      g.append("rect").attr("x", 18).attr("y", y0 + 8).attr("width", w - 36).attr("height", 14).attr("rx", 2).attr("fill", "#1f2d4d");
      g.append("rect").attr("x", 18).attr("y", y0).attr("width", (w - 36) * 0.62).attr("height", 10).attr("rx", 2).attr("fill", a);
      g.append("line").attr("x1", 18 + (w - 36) * 0.78).attr("x2", 18 + (w - 36) * 0.78).attr("y1", y0 - 4).attr("y2", y0 + 22).attr("stroke", b).attr("stroke-width", 2);
    },
    divergingBar() {
      const vals = [-12, 8, -6, 18, -4, 14];
      const x = d3.scaleBand().domain(d3.range(vals.length)).range(xPad).padding(0.2);
      const y = d3.scaleLinear().domain([-20, 22]).range(yPad);
      g.append("line").attr("x1", 12).attr("x2", w - 12).attr("y1", y(0)).attr("y2", y(0)).attr("stroke", "#7a8ab0").attr("stroke-width", 1);
      g.selectAll("rect")
        .data(vals)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => (d >= 0 ? y(d) : y(0)))
        .attr("width", x.bandwidth())
        .attr("height", (d) => Math.abs(y(d) - y(0)))
        .attr("rx", 2)
        .attr("fill", (d) => (d < 0 ? "#6b7cb0" : a));
    },
    divergingStacked() {
      const y = d3.scaleBand().domain([0, 1, 2]).range([12, h - 12]).padding(0.25);
      const parts = [
        [0.2, 0.15, 0.35, 0.15, 0.15],
        [0.15, 0.2, 0.35, 0.2, 0.1],
        [0.22, 0.18, 0.3, 0.18, 0.12],
      ];
      const cols = ["#6a5fb6", "#7a84d3", "#7487a8", "#58b6e0", "#3ad7ff"];
      parts.forEach((row, ri) => {
        let x0 = 14;
        row.forEach((p, j) => {
          const ww = p * (w - 28);
          g.append("rect").attr("x", x0).attr("y", y(ri)).attr("width", ww - 1).attr("height", y.bandwidth()).attr("fill", cols[j]).attr("opacity", 0.85);
          x0 += ww;
        });
      });
    },
    surplusLine() {
      const valsA = d3.range(12).map((i) => 22 + Math.sin(i / 2) * 6);
      const valsB = valsA.map((v) => v - 8 - rng() * 4);
      const x = d3.scaleLinear().domain([0, 11]).range(xPad);
      const y = d3.scaleLinear().domain([0, 40]).range(yPad);
      const area = d3
        .area()
        .x((_, i) => x(i))
        .y0((_, i) => y(valsB[i]))
        .y1((_, i) => y(valsA[i]))
        .curve(d3.curveMonotoneX);
      g.append("path").datum(valsA).attr("d", area).attr("fill", a).attr("opacity", 0.25);
      g.append("path").datum(valsA.map((v, i) => [x(i), y(v)])).attr("d", d3.line().curve(d3.curveMonotoneX)).attr("fill", "none").attr("stroke", b).attr("stroke-width", 1.5);
    },
    spine() {
      const mid = h / 2;
      g.append("rect").attr("x", 16).attr("y", mid - 16).attr("width", (w - 32) * 0.55).attr("height", 14).attr("rx", 2).attr("fill", a);
      g.append("rect").attr("x", 16 + (w - 32) * 0.55).attr("y", mid - 2).attr("width", (w - 32) * 0.45).attr("height", 14).attr("rx", 2).attr("fill", b);
    },
    orderedColumns() {
      const vals = [32, 28, 22, 16, 12, 8];
      const x = d3.scaleBand().domain(d3.range(vals.length)).range(xPad).padding(0.18);
      const y = d3.scaleLinear().domain([0, 36]).range(yPad);
      g.selectAll("rect")
        .data(vals)
        .join("rect")
        .attr("x", (_, i) => x(i))
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => y(0) - y(d))
        .attr("rx", 3)
        .attr("fill", (_, i) => d3.interpolate(a, b)(i / vals.length));
    },
    orderedBars() {
      const vals = [40, 32, 24, 18, 12];
      const y = d3.scaleBand().domain(d3.range(vals.length)).range([12, h - 12]).padding(0.18);
      const x = d3.scaleLinear().domain([0, 45]).range([18, w - 12]);
      g.selectAll("rect")
        .data(vals)
        .join("rect")
        .attr("x", 18)
        .attr("y", (_, i) => y(i))
        .attr("width", (d) => x(d) - 18)
        .attr("height", y.bandwidth())
        .attr("rx", 2)
        .attr("fill", (_, i) => d3.interpolate(a, c)(i / vals.length));
    },
    orderedSymbols() {
      const r = [14, 11, 9, 7, 5];
      const x = d3.scalePoint().domain(d3.range(r.length)).range([22, w - 22]);
      r.forEach((rad, i) => g.append("circle").attr("cx", x(i)).attr("cy", h / 2).attr("r", rad).attr("fill", a).attr("opacity", 0.75 - i * 0.08));
    },
    slope() {
      const x1 = 24;
      const x2 = w - 24;
      const y = d3.scaleLinear().domain([0, 100]).range(yPad);
      const left = [22, 38, 55, 72].map((v) => y(v));
      const right = [62, 28, 70, 40].map((v) => y(v));
      d3.range(4).forEach((i) => {
        g.append("line")
          .attr("x1", x1)
          .attr("y1", left[i])
          .attr("x2", x2)
          .attr("y2", right[i])
          .attr("stroke", i % 2 ? b : a)
          .attr("stroke-width", 2)
          .attr("opacity", 0.9);
      });
      g.append("line").attr("x1", x1).attr("x2", x1).attr("y1", 12).attr("y2", h - 12).attr("stroke", "#3d4f78").attr("stroke-width", 1);
      g.append("line").attr("x1", x2).attr("x2", x2).attr("y1", 12).attr("y2", h - 12).attr("stroke", "#3d4f78").attr("stroke-width", 1);
    },
    bump() {
      const series = [
        d3.range(6).map((i) => 5 - i + rng() * 0.5),
        d3.range(6).map((i) => i * 0.6 + rng() * 0.5),
      ];
      const x = d3.scaleLinear().domain([0, 5]).range(xPad);
      const y = d3.scaleLinear().domain([0, 6]).range(yPad);
      series.forEach((s, k) => {
        g.append("path")
          .datum(s.map((v, i) => [x(i), y(v)]))
          .attr("d", d3.line().curve(d3.curveBasis))
          .attr("fill", "none")
          .attr("stroke", k ? b : a)
          .attr("stroke-width", 2);
      });
    },
    scatter() {
      const pts = d3.range(14).map(() => [14 + rng() * (w - 28), 14 + rng() * (h - 28)]);
      g.selectAll("circle").data(pts).join("circle").attr("cx", (d) => d[0]).attr("cy", (d) => d[1]).attr("r", 2.8).attr("fill", a).attr("opacity", 0.75);
    },
    bubble() {
      const pts = d3.range(8).map(() => [14 + rng() * (w - 28), 14 + rng() * (h - 28), 3 + rng() * 10]);
      g.selectAll("circle").data(pts).join("circle").attr("cx", (d) => d[0]).attr("cy", (d) => d[1]).attr("r", (d) => d[2]).attr("fill", a).attr("opacity", 0.55);
    },
    xyHeatmap() {
      const rows = 5;
      const cols = 8;
      const cw = (w - 16) / cols;
      const ch = (h - 16) / rows;
      const color = d3.scaleSequential(d3.interpolateViridis).domain([0, 1]);
      d3.range(rows * cols).forEach((i) => {
        const v = ((i * 11 + seed) % 17) / 16;
        g.append("rect")
          .attr("x", 8 + (i % cols) * cw)
          .attr("y", 8 + Math.floor(i / cols) * ch)
          .attr("width", cw - 1.5)
          .attr("height", ch - 1.5)
          .attr("rx", 1)
          .attr("fill", color(v));
      });
    },
    stackedBar() {
      const x = d3.scaleBand().domain([0, 1, 2]).range(xPad).padding(0.25);
      const y = d3.scaleLinear().domain([0, 40]).range(yPad);
      const stacks = [
        [8, 12, 10],
        [10, 8, 14],
        [6, 16, 8],
      ];
      stacks.forEach((seg, i) => {
        let acc = 0;
        seg.forEach((v, j) => {
          g.append("rect")
            .attr("x", x(i))
            .attr("y", y(acc + v))
            .attr("width", x.bandwidth())
            .attr("height", y(acc) - y(acc + v))
            .attr("fill", [a, b, c][j])
            .attr("opacity", 0.85);
          acc += v;
        });
      });
    },
    pie() {
      const c = g.append("g").attr("transform", `translate(${w / 2},${h / 2})`);
      const data = d3.pie().sort(null)([30, 22, 18, 30]);
      c.selectAll("path")
        .data(data)
        .join("path")
        .attr("d", d3.arc().innerRadius(0).outerRadius(34))
        .attr("fill", (_, i) => [a, b, c, "#5a7fd4"][i])
        .attr("stroke", "#0a1020");
    },
    donut() {
      const c = g.append("g").attr("transform", `translate(${w / 2},${h / 2})`);
      const data = d3.pie().sort(null)([28, 24, 20, 28]);
      c.selectAll("path")
        .data(data)
        .join("path")
        .attr("d", d3.arc().innerRadius(16).outerRadius(36))
        .attr("fill", (_, i) => [a, b, c, "#6a8ae8"][i])
        .attr("stroke", "#0a1020");
    },
    treemap() {
      const root = d3.hierarchy({ children: d3.range(7).map(() => ({ v: 5 + rng() * 25 })) }).sum((d) => d.v);
      d3.treemap().size([w - 16, h - 16]).padding(2)(root);
      g.selectAll("rect")
        .data(root.leaves())
        .join("rect")
        .attr("x", (d) => d.x0 + 8)
        .attr("y", (d) => d.y0 + 8)
        .attr("width", (d) => d.x1 - d.x0)
        .attr("height", (d) => d.y1 - d.y0)
        .attr("rx", 2)
        .attr("fill", (_, i) => (i % 2 ? b : a))
        .attr("opacity", 0.75);
    },
    voronoi() {
      const pts = [
        [40, 30],
        [90, 55],
        [130, 28],
        [180, 48],
        [220, 32],
      ];
      const vor = d3.Delaunay.from(pts).voronoi([8, 8, w - 8, h - 8]);
      const fills = [a, b, c, a, b];
      pts.forEach((_, i) => {
        const poly = vor.cellPolygon(i);
        if (!poly || !poly.length) return;
        g.append("path")
          .attr("d", `M${poly.map((p) => p.join(",")).join("L")}Z`)
          .attr("fill", fills[i % fills.length])
          .attr("opacity", 0.32)
          .attr("stroke", "rgba(255,255,255,.08)");
      });
      pts.forEach((p) => g.append("circle").attr("cx", p[0]).attr("cy", p[1]).attr("r", 2.5).attr("fill", "#e8ecff"));
    },
    arcPart() {
      const c = g.append("g").attr("transform", `translate(${w / 2},${h - 6})`);
      const pie = d3.pie().startAngle(-Math.PI / 2).endAngle(Math.PI / 2).value((d) => d)([26, 22, 18, 14, 20]);
      c.selectAll("path")
        .data(pie)
        .join("path")
        .attr("d", d3.arc().innerRadius(22).outerRadius(40))
        .attr("fill", (_, i) => [a, b, c, "#6d8cff", "#8ab4ff"][i])
        .attr("opacity", 0.85);
    },
    waffle() {
      const cols = 10;
      const rows = 4;
      d3.range(rows * cols).forEach((i) => {
        const on = (i + seed) % 3 !== 0;
        g.append("rect")
          .attr("x", 10 + (i % cols) * 10)
          .attr("y", 14 + Math.floor(i / cols) * 10)
          .attr("width", 7)
          .attr("height", 7)
          .attr("rx", 1)
          .attr("fill", on ? a : "#1c2744");
      });
    },
    waterfall() {
      let x = 16;
      const blocks = [12, -6, 18, -8, 10];
      const y = d3.scaleLinear().domain([-10, 40]).range(yPad);
      let acc = 0;
      blocks.forEach((v, i) => {
        const hgt = Math.abs(y(acc) - y(acc + v));
        const yy = v >= 0 ? y(acc + v) : y(acc);
        g.append("rect").attr("x", x).attr("y", yy).attr("width", 22).attr("height", hgt).attr("rx", 2).attr("fill", v >= 0 ? a : b);
        acc += v;
        x += 28;
      });
    },
    venn() {
      g.append("circle").attr("cx", w * 0.42).attr("cy", h * 0.48).attr("r", 26).attr("fill", a).attr("opacity", 0.45);
      g.append("circle").attr("cx", w * 0.58).attr("cy", h * 0.48).attr("r", 26).attr("fill", b).attr("opacity", 0.45);
    },
    choropleth() {
      const polys = [
        "M 20 20 L 70 18 L 85 55 L 35 62 Z",
        "M 90 22 L 150 25 L 140 58 L 95 52 Z",
        "M 155 28 L 220 22 L 235 60 L 165 65 Z",
      ];
      polys.forEach((d, i) => g.append("path").attr("d", d).attr("fill", d3.interpolate(a, b)(i / 3)).attr("opacity", 0.75).attr("stroke", "#2a3a5c"));
    },
    cartogramScaled() {
      d3.range(6).forEach((i) => {
        g.append("rect")
          .attr("x", 12 + i * 12)
          .attr("y", 20 + (i % 2) * 8)
          .attr("width", 18 + i * 4)
          .attr("height", 24 - i * 2)
          .attr("rx", 2)
          .attr("fill", a)
          .attr("opacity", 0.55 + i * 0.05);
      });
    },
    cartogramEqual() {
      d3.range(5).forEach((row) =>
        d3.range(8).forEach((col) => {
          g.append("rect")
            .attr("x", 12 + col * 14)
            .attr("y", 14 + row * 14)
            .attr("width", 11)
            .attr("height", 11)
            .attr("rx", 1)
            .attr("fill", (row + col + seed) % 4 ? b : a)
            .attr("opacity", 0.7);
        })
      );
    },
    contour() {
      d3.range(3).forEach((i) => {
        g.append("ellipse")
          .attr("cx", w / 2 + (i - 1) * 8)
          .attr("cy", h / 2)
          .attr("rx", 28 + i * 12)
          .attr("ry", 16 + i * 8)
          .attr("fill", "none")
          .attr("stroke", a)
          .attr("stroke-width", 1.2)
          .attr("opacity", 0.45 - i * 0.1);
      });
    },
    flowMap() {
      const pts = [
        [30, 50],
        [120, 30],
        [200, 55],
      ];
      g.append("path")
        .attr("d", `M ${pts[0]} Q 80 20 ${pts[1]} T ${pts[2]}`)
        .attr("fill", "none")
        .attr("stroke", a)
        .attr("stroke-width", 3)
        .attr("opacity", 0.6);
      pts.forEach((p) => g.append("circle").attr("cx", p[0]).attr("cy", p[1]).attr("r", 4).attr("fill", b));
    },
    geoHeat() {
      d3.range(6).forEach((row) =>
        d3.range(10).forEach((col) => {
          const v = ((row * 10 + col + seed) % 7) / 6;
          g.append("rect")
            .attr("x", 10 + col * 12)
            .attr("y", 12 + row * 12)
            .attr("width", 10)
            .attr("height", 10)
            .attr("rx", 1)
            .attr("fill", d3.interpolateInferno(v));
        })
      );
    },
    densityDots() {
      d3.range(80).forEach(() => {
        g.append("circle")
          .attr("cx", 20 + rng() * (w - 40))
          .attr("cy", 16 + rng() * (h - 32))
          .attr("r", 1.2)
          .attr("fill", a)
          .attr("opacity", 0.35 + rng() * 0.5);
      });
    },
    sankey() {
      const layers = [18, w * 0.45, w - 18];
      const bands = [
        { y0: 18, h: 14 },
        { y0: 40, h: 12 },
        { y0: 62, h: 10 },
      ];
      bands.forEach((b) => {
        const d = `M ${layers[0]} ${b.y0} C ${layers[0] + 50} ${b.y0}, ${layers[1] - 40} ${b.y0}, ${layers[1]} ${b.y0} L ${layers[1]} ${b.y0 + b.h} C ${layers[1] - 40} ${b.y0 + b.h}, ${layers[0] + 50} ${b.y0 + b.h}, ${layers[0]} ${b.y0 + b.h} Z`;
        g.append("path").attr("d", d).attr("fill", a).attr("opacity", 0.22);
        g.append("rect").attr("x", layers[0] - 8).attr("y", b.y0).attr("width", 26).attr("height", b.h).attr("fill", a).attr("opacity", 0.5);
        g.append("rect").attr("x", layers[2] - 30).attr("y", b.y0).attr("width", 34).attr("height", b.h).attr("fill", b).attr("opacity", 0.45);
      });
    },
    chord() {
      const c = g.append("g").attr("transform", `translate(${w / 2},${h / 2})`);
      c.append("circle").attr("r", 30).attr("fill", "none").attr("stroke", "#4a5d8a").attr("stroke-width", 1.2);
      d3.range(5).forEach((i) => {
        const ang = (i / 5) * Math.PI * 2;
        c.append("path")
          .attr("d", `M ${Math.cos(ang) * 22} ${Math.sin(ang) * 18} Q 0 0 ${Math.cos(ang + 1.2) * 22} ${Math.sin(ang + 1.2) * 18}`)
          .attr("fill", "none")
          .attr("stroke", i % 2 ? b : a)
          .attr("stroke-width", 1.8)
          .attr("opacity", 0.55);
      });
    },
    network() {
      const nodes = d3.range(8).map((i) => ({ id: i }));
      const links = d3.range(14).map(() => ({ source: Math.floor(rng() * 8), target: Math.floor(rng() * 8) }));
      const sim = d3
        .forceSimulation(nodes)
        .force("link", d3.forceLink(links).id((d) => d.id).distance(26))
        .force("charge", d3.forceManyBody().strength(-40))
        .force("center", d3.forceCenter(w / 2, h / 2))
        .stop();
      for (let i = 0; i < 50; i += 1) sim.tick();
      g.selectAll("line")
        .data(links)
        .join("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y)
        .attr("stroke", "rgba(120,150,220,.35)")
        .attr("stroke-width", 1);
      g.selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 3.8)
        .attr("fill", a);
    },
    groupedBars() {
      const cats = d3.range(3);
      const x = d3.scaleBand().domain(cats).range(xPad).padding(0.22);
      const sub = d3.scaleBand().domain([0, 1, 2]).range([0, x.bandwidth()]).padding(0.08);
      const y = d3.scaleLinear().domain([0, 30]).range(yPad);
      cats.forEach((ci) => {
        d3.range(3).forEach((j) => {
          const v = 8 + ((j + ci + seed) % 5) * 4;
          g.append("rect")
            .attr("x", x(ci) + sub(j))
            .attr("y", y(v))
            .attr("width", sub.bandwidth())
            .attr("height", y(0) - y(v))
            .attr("rx", 2)
            .attr("fill", [a, b, c][j]);
        });
      });
    },
  };

  const fn = draw[id];
  if (fn) fn();
  else draw.column();
}
