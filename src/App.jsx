import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { drawChartPreview } from "./chartPreview";
import { hashString, seededRng } from "./lib/utils";

const BASE_CATEGORIES = [
  { id: "cambio-tiempo", es: "Cambio en el tiempo", en: "Change over time", charts: ["Columna", "Gráfico de abanico (proyección)", "Línea + columna temporal", "Mapa de calor calendario", "Línea", "Cronología de Priestley", "Línea de tiempo circular", "Dispersión conectada", "Línea de tiempo vertical", "Sismograma", "Gráfico de velas", "Gráfico de área", "Gráfico de torrente"] },
  { id: "magnitud", es: "Magnitud", en: "Magnitude", charts: ["Columna emparejada", "Barra emparejada", "Barra", "Columna", "Isotipo (pictograma)", "Gráfico de piruletas", "Símbolo proporcional", "Radar", "Coordenadas paralelas", "Marimekko", "Gráfico de bala"] },
  { id: "desviacion", es: "Desviación", en: "Deviation", charts: ["Barra divergente", "Barra divergente apilada", "Línea superávit/déficit", "Spine chart"] },
  { id: "ranking", es: "Ranking", en: "Ranking", charts: ["Columnas ordenadas", "Símbolo proporcional ordenado", "Gráfico de piruletas", "Pendiente", "Diagrama de tira de puntos", "Barras ordenadas", "Bump chart"] },
  { id: "correlacion", es: "Correlación", en: "Correlation", charts: ["Línea + columna temporal", "Dispersión conectada", "Burbujas", "Mapa de calor XY", "Dispersión"] },
  { id: "distribucion", es: "Distribución", en: "Distribution", charts: ["Histograma", "Caja y bigotes", "Diagrama de violín", "Pirámide de población", "Curva acumulativa", "Diagrama de puntos", "Beeswarm", "Polígonos de frecuencia", "Gráfico de código de barras", "Diagrama de tira de puntos"] },
  { id: "parte-todo", es: "Parte de un todo", en: "Part-to-whole", charts: ["Columna/barra apilada", "Gráfico de tarta", "Gráfico de anillos", "Mapa de árbol", "Voronoi", "Marimekko", "Arco", "Diagrama de cuadrilla", "Cascada", "Diagrama de Venn"] },
  { id: "espacial", es: "Espacial", en: "Spatial", charts: ["Mapa coroplético", "Cartograma a escala", "Mapa de flujo", "Mapa de contorno", "Cartograma ecualizado", "Símbolos proporcionales", "Densidad de puntos", "Mapa de calor"] },
  { id: "flujo", es: "Flujo", en: "Flow", charts: ["Cascada", "Sankey", "Cuerdas", "Red", "Barras agrupadas", "Mapa de flujo"] },
];

const COPY = {
  es: {
    eyebrow: "Curated Data Design Atlas",
    subtitle: "Vocabulario visual completo con 74 gráficas. Inspirado en FT Visual Vocabulary y reescrito para este portfolio.",
    relation: "Relación de datos",
    all: "Todas las categorías",
    search: "Buscar gráfico...",
    source: "Fuente: Financial Times Visual Vocabulary (referencia conceptual).",
  },
  en: {
    eyebrow: "Curated Data Design Atlas",
    subtitle: "Complete visual vocabulary with 74 chart types. Inspired by FT Visual Vocabulary, rewritten for this portfolio.",
    relation: "Data relationship",
    all: "All categories",
    search: "Search chart...",
    source: "Source: Financial Times Visual Vocabulary (conceptual reference).",
  },
};

const CHART_TEXT = {
  "Columna": {
    enName: "Column",
    esDesc: "La forma estándar de comparar el tamaño de las cosas. Debe comenzar en 0 en el eje.",
    enDesc: "The standard way to compare the size of things. Must always start at 0 on the axis.",
  },
  "Gráfico de abanico (proyección)": {
    enName: "Fan chart (projections)",
    esDesc: "Úselo para mostrar la incertidumbre en proyecciones futuras; normalmente crece cuanto más avanza la proyección.",
    enDesc: "Use to show the uncertainty in future projections; usually this grows the further forward the projection.",
  },
  "Línea + columna temporal": {
    enName: "Column + line timeline",
    esDesc: "Una buena manera de mostrar la relación entre una cantidad (columnas) y una tasa (línea).",
    enDesc: "A good way of showing the relationship between an amount (columns) and a rate (line).",
  },
  "Mapa de calor calendario": {
    enName: "Calendar heatmap",
    esDesc: "Una excelente forma de mostrar patrones temporales (diarios, semanales, mensuales), sacrificando precisión en la cantidad.",
    enDesc: "A great way of showing temporal patterns (daily, weekly, monthly), at the expense of showing precision in quantity.",
  },
  "Línea": {
    enName: "Line",
    esDesc: "La forma estándar de mostrar una serie temporal cambiante; si los datos son irregulares, use marcadores.",
    enDesc: "The standard way to show a changing time series. If data are irregular, consider markers to represent data points.",
  },
  "Cronología de Priestley": {
    enName: "Priestley timeline",
    esDesc: "Interesante cuando la fecha y la duración son elementos clave de la historia en los datos.",
    enDesc: "Great when date and duration are key elements of the story in the data.",
  },
  "Línea de tiempo circular": {
    enName: "Circle timeline",
    esDesc: "Útil para mostrar valores discretos de tamaño variable en múltiples categorías.",
    enDesc: "Good for showing discrete values of varying size across multiple categories.",
  },
  "Dispersión conectada": {
    enName: "Connected scatterplot",
    esDesc: "Se usa para mostrar cómo ha cambiado con el tiempo la relación entre dos variables.",
    enDesc: "Usually used to show how the relationship between two variables has changed over time.",
  },
  "Línea de tiempo vertical": {
    enName: "Vertical timeline",
    esDesc: "Presenta el tiempo en el eje Y; funciona muy bien para series detalladas y en scroll móvil.",
    enDesc: "Presents time on the Y axis; good for detailed time series, especially when scrolling on mobile.",
  },
  "Sismograma": {
    enName: "Seismogram",
    esDesc: "Otra alternativa a la línea de tiempo circular para series con grandes variaciones.",
    enDesc: "Another alternative to the circle timeline for series where there are big variations in the data.",
  },
  "Gráfico de velas": {
    enName: "Candlestick",
    esDesc: "Suelen centrarse en actividad diaria y muestran apertura/cierre y máximos/mínimos de cada día.",
    enDesc: "Usually focused on day-to-day activity, these charts show opening/closing and high/low points of each day.",
  },
  "Gráfico de área": {
    enName: "Area chart",
    esDesc: "Úselos con cuidado: son buenos para cambios en el total, pero ver cambios en componentes puede ser difícil.",
    enDesc: "Use with care: these are good at showing changes to total, but seeing change in components can be very difficult.",
  },
  "Gráfico de torrente": {
    enName: "Streamgraph",
    esDesc: "Un tipo de gráfico de área; úselo cuando sea más importante ver cambios de proporciones en el tiempo.",
    enDesc: "A type of area chart; use when seeing changes in proportions over time is more important than individual values.",
  },
  "Columna emparejada": {
    enName: "Paired column",
    esDesc: "Como columna estándar, pero permite varias series. Puede ser difícil de leer con más de dos.",
    enDesc: "As per standard column but allows for multiple series. Can become tricky to read with more than 2 series.",
  },
  "Barra emparejada": {
    enName: "Paired bar",
    esDesc: "Como barra estándar, útil cuando no es serie temporal y las etiquetas de categoría son largas.",
    enDesc: "See standard bar. Good when data are not time series and labels have long category names.",
  },
  "Barra": {
    enName: "Bar",
    esDesc: "La forma estándar de comparar tamaños; siempre debe comenzar en 0 en el eje.",
    enDesc: "The standard way to compare the size of things. Must always start at 0 on the axis.",
  },
  "Isotipo (pictograma)": {
    enName: "Isotype (pictogram)",
    esDesc: "Excelente en algunos casos: úselo solo con números enteros.",
    enDesc: "Excellent in some instances; use only with whole numbers.",
  },
  "Gráfico de piruletas": {
    enName: "Lollipop",
    esDesc: "Llama más la atención sobre el valor que una barra/columna estándar.",
    enDesc: "Lollipop charts draw more attention to the data value than standard bar/column.",
  },
  "Símbolo proporcional": {
    enName: "Proportional symbol",
    esDesc: "Úselo cuando haya grandes variaciones entre valores y no sea clave ver pequeñas diferencias.",
    enDesc: "Use when there are big variations between values and seeing fine differences is not so important.",
  },
  "Radar": {
    enName: "Radar",
    esDesc: "Forma compacta para múltiples variables, pero el orden de variables debe tener sentido para el lector.",
    enDesc: "A space-efficient way of showing multiple variables, but make sure they are organised in a way that makes sense.",
  },
  "Coordenadas paralelas": {
    enName: "Parallel coordinates",
    esDesc: "Alternativa al radar; la disposición de variables es clave y suele ayudar resaltar valores.",
    enDesc: "An alternative to radar charts; variable arrangement is important and highlighting values usually helps.",
  },
  "Marimekko": {
    enName: "Marimekko",
    esDesc: "Buena forma de mostrar tamaño y proporción a la vez, siempre que los datos no sean demasiado complejos.",
    enDesc: "A good way of showing the size and proportion of data at the same time, as long as data are not too complicated.",
  },
  "Gráfico de bala": {
    enName: "Bullet",
    esDesc: "Bueno para mostrar una medida frente al contexto de un objetivo o rango de rendimiento.",
    enDesc: "Good for showing a measurement against the context of a target or performance range.",
  },
  "Barra divergente": {
    enName: "Diverging bar",
    esDesc: "Un gráfico de barras estándar simple que puede manejar valores de magnitud tanto negativos como positivos.",
    enDesc: "A simple standard bar chart that can handle both negative and positive magnitude values.",
  },
  "Barra divergente apilada": {
    enName: "Diverging stacked bar",
    esDesc: "Perfecto para presentar resultados de encuestas que implican sentimiento (desacuerdo/neutral/acuerdo).",
    enDesc: "Perfect for presenting survey results which involve sentiment (e.g. disagree/neutral/agree).",
  },
  "Línea superávit/déficit": {
    enName: "Surplus/deficit filled line",
    esDesc: "El área sombreada permite mostrar un balance frente a una línea base o entre dos series.",
    enDesc: "The shaded area allows a balance to be shown, either against a baseline or between two series.",
  },
  "Spine chart": {
    enName: "Spine chart",
    esDesc: "Divide un valor único en dos componentes contrastantes (por ejemplo, masculino/femenino).",
    enDesc: "Splits a single value into two contrasting components (e.g. male/female).",
  },
  "Columnas ordenadas": {
    enName: "Ordered column",
    esDesc: "Las barras/columnas muestran mejor los rangos de valores cuando están ordenados.",
    enDesc: "Standard bar/column charts display ranks of values more easily when sorted into order.",
  },
  "Símbolo proporcional ordenado": {
    enName: "Ordered proportional symbol",
    esDesc: "Útil cuando hay grandes variaciones y es menos importante ver diferencias pequeñas.",
    enDesc: "Use when there are big variations between values and fine differences are less important.",
  },
  "Pendiente": {
    enName: "Slope",
    esDesc: "Bueno para mostrar cambios cuando los datos pueden simplificarse en 2 o 3 puntos sin perder la historia.",
    enDesc: "Good for showing changing data as long as it can be simplified into 2 or 3 points without losing the story.",
  },
  "Diagrama de tira de puntos": {
    enName: "Dot strip plot",
    esDesc: "Puntos en una tira: método eficiente en espacio para mostrar rangos en múltiples categorías.",
    enDesc: "Dots placed in order on a strip are a space-efficient method of laying out ranks across categories.",
  },
  "Barras ordenadas": {
    enName: "Ordered bar",
    esDesc: "Perfecto para mostrar cómo cambian clasificaciones en el tiempo o entre categorías.",
    enDesc: "Perfect for showing how ranks have changed over time or vary between categories.",
  },
  "Bump chart": {
    enName: "Bump",
    esDesc: "Eficaz para mostrar clasificaciones cambiantes en varias fechas.",
    enDesc: "Effective for showing changing rankings across multiple dates.",
  },
  "Burbujas": {
    enName: "Bubble",
    esDesc: "Como dispersión, añade detalle al dimensionar los círculos según una tercera variable.",
    enDesc: "Like a scatterplot, but adds additional detail by sizing the circles according to a third variable.",
  },
  "Mapa de calor XY": {
    enName: "XY heatmap",
    esDesc: "Buena forma de mostrar patrones entre dos categorías; menos eficaz para diferencias finas.",
    enDesc: "A good way of showing patterns between two categories, less effective at showing fine differences.",
  },
  "Dispersión": {
    enName: "Scatterplot",
    esDesc: "Forma estándar de mostrar relación entre dos variables continuas, cada una con su eje.",
    enDesc: "The standard way to show the relationship between two continuous variables, each with its own axis.",
  },
  "Histograma": {
    enName: "Histogram",
    esDesc: "Forma estándar de mostrar una distribución estadística; mantenga pequeños los huecos entre columnas.",
    enDesc: "The standard way to show a statistical distribution; keep the gaps between columns small.",
  },
  "Caja y bigotes": {
    enName: "Boxplot",
    esDesc: "Resume múltiples distribuciones mostrando la mediana (centro) y el rango de los datos.",
    enDesc: "Summarise multiple distributions by showing the median (centre) and range of the data.",
  },
  "Diagrama de violín": {
    enName: "Violin plot",
    esDesc: "Similar al boxplot, pero más eficaz con distribuciones complejas.",
    enDesc: "Similar to a box plot but more effective with complex distributions.",
  },
  "Pirámide de población": {
    enName: "Population pyramid",
    esDesc: "Forma estándar de mostrar distribución de población por edad y sexo; histogramas enfrentados.",
    enDesc: "A standard way for showing age and sex breakdown of a population; effectively back-to-back histograms.",
  },
  "Curva acumulativa": {
    enName: "Cumulative curve",
    esDesc: "Buena forma de mostrar cuán desigual es una distribución.",
    enDesc: "A good way of showing how unequal a distribution is.",
  },
  "Diagrama de puntos": {
    enName: "Dot plot",
    esDesc: "Úselo para enfatizar puntos individuales en una distribución; funciona mejor con tamaños medios.",
    enDesc: "Use to emphasise individual points in a distribution; best with medium-sized datasets.",
  },
  "Beeswarm": {
    enName: "Beeswarm",
    esDesc: "Como las tiras de puntos, bueno para mostrar todos los datos y resaltar valores individuales.",
    enDesc: "Like dot strip plots, good for displaying all data and highlighting individual values.",
  },
  "Polígonos de frecuencia": {
    enName: "Frequency polygons",
    esDesc: "Para mostrar múltiples distribuciones de datos; como línea, mejor con pocas series.",
    enDesc: "For displaying multiple distributions of data. Like a line chart, best limited to a few datasets.",
  },
  "Gráfico de código de barras": {
    enName: "Barcode plot",
    esDesc: "Alternativa a barras/columnas cuando conviene contar datos o resaltar elementos individuales.",
    enDesc: "An alternative to bar/column charts when counting data or highlighting individual elements is useful.",
  },
  "Columna/barra apilada": {
    enName: "Stacked column/bar",
    esDesc: "Forma simple de mostrar parte-todo, pero puede volverse difícil de leer con muchos componentes.",
    enDesc: "A simple way of showing part-to-whole relationships but can be difficult with many components.",
  },
  "Gráfico de tarta": {
    enName: "Pie",
    esDesc: "Forma común de mostrar parte-todo, pero es difícil comparar con precisión tamaños de segmentos.",
    enDesc: "A common way of showing part-to-whole data, but it is hard to accurately compare segment sizes.",
  },
  "Gráfico de anillos": {
    enName: "Donut",
    esDesc: "Similar a tarta, pero el centro permite incluir más información (por ejemplo, el total).",
    enDesc: "Similar to a pie chart, but the centre can hold more information (e.g. total).",
  },
  "Mapa de árbol": {
    enName: "Treemap",
    esDesc: "Úselo para relaciones jerárquicas parte-todo; puede ser difícil con muchos segmentos pequeños.",
    enDesc: "Use for hierarchical part-to-whole relationships; can be difficult with many small segments.",
  },
  "Voronoi": {
    enName: "Voronoi",
    esDesc: "Convierte puntos en áreas: cada punto del área está más cerca de su centro que de otro.",
    enDesc: "A way of turning points into areas; any point is closer to its centre than to any other centroid.",
  },
  "Arco": {
    enName: "Arc",
    esDesc: "Un hemiciclo usado a menudo para visualizar composición parlamentaria por número de escaños.",
    enDesc: "A hemicycle, often used for visualising parliamentary composition by number of seats.",
  },
  "Diagrama de cuadrilla": {
    enName: "Gridplot",
    esDesc: "Bueno para mostrar porcentajes; funciona mejor con números enteros y en small multiples.",
    enDesc: "Good for showing percentage information; works best with whole numbers and small multiple layouts.",
  },
  "Cascada": {
    enName: "Waterfall",
    esDesc: "Muestra cambios en flujos de una condición a otra; útil para seguir resultados de procesos complejos.",
    enDesc: "Shows changes in flows from one condition to another; good for tracing outcomes of complex processes.",
  },
  "Diagrama de Venn": {
    enName: "Venn",
    esDesc: "Generalmente para representación esquemática de interrelaciones o coincidencias.",
    enDesc: "Generally used for schematic representation of interrelationships or overlaps.",
  },
  "Mapa coroplético": {
    enName: "Basic choropleth (rate/ratio)",
    esDesc: "Enfoque estándar para datos en mapa: usar tasas, no totales, y una base geográfica adecuada.",
    enDesc: "The standard approach for map data: use rates not totals and a sensible base geography.",
  },
  "Cartograma a escala": {
    enName: "Scaled cartogram (value)",
    esDesc: "Estira y encoge el mapa para que cada área tenga tamaño según un valor.",
    enDesc: "Stretching and shrinking a map so each area is sized according to a particular value.",
  },
  "Mapa de flujo": {
    enName: "Flow map",
    esDesc: "Para mostrar movimiento inequívoco sobre un mapa.",
    enDesc: "For showing unambiguous movement across a map.",
  },
  "Mapa de contorno": {
    enName: "Contour map",
    esDesc: "Para mostrar áreas de igual valor en un mapa; puede usar esquemas de desviación para +/-.",
    enDesc: "For showing areas of equal value on a map; can use deviation colour schemes for +/- values.",
  },
  "Cartograma ecualizado": {
    enName: "Equalised cartogram",
    esDesc: "Convierte unidades del mapa en formas regulares de igual tamaño.",
    enDesc: "Converts each map unit into a regular and equally-sized shape.",
  },
  "Símbolos proporcionales": {
    enName: "Proportional symbol (count/magnitude)",
    esDesc: "Se usa para mostrar ubicación de eventos individuales; conviene anotar patrones relevantes.",
    enDesc: "Used to show locations of individual events; annotate the patterns readers should see.",
  },
  "Densidad de puntos": {
    enName: "Dot density",
    esDesc: "Muestra ubicación de eventos o puntos individuales; anote los patrones importantes.",
    enDesc: "Used to show the location of individual events/locations; annotate important patterns.",
  },
  "Mapa de calor": {
    enName: "Heat map",
    esDesc: "Valores en cuadrícula codificados por intensidad de color.",
    enDesc: "Grid-based data values mapped with an intensity colour scale.",
  },
  "Sankey": {
    enName: "Sankey",
    esDesc: "Diseñado para mostrar secuencias de datos en un flujo, típicamente presupuestos.",
    enDesc: "Designed to show sequencing of data through a flow process, typically budgets.",
  },
  "Cuerdas": {
    enName: "Chord",
    esDesc: "Diagrama complejo pero potente para ilustrar flujos bidireccionales en una matriz.",
    enDesc: "A complex but powerful diagram that can illustrate two-way flows in a matrix.",
  },
  "Red": {
    enName: "Network",
    esDesc: "Sirve para mostrar la fuerza e interconexión de relaciones de distintos tipos.",
    enDesc: "Used for showing the strength and inter-connectedness of relationships of varying types.",
  },
  "Barras agrupadas": {
    enName: "Grouped symbol",
    esDesc: "Bueno para mostrar una medida en el contexto de un objetivo o rango de rendimiento.",
    enDesc: "Good for showing a measurement against the context of a target or performance range.",
  },
};

function getChartText(chart) {
  return (
    CHART_TEXT[chart] ?? {
      enName: chart,
      esDesc: "Descripción no disponible en el vocabulario de referencia.",
      enDesc: "Description not available in the reference vocabulary.",
    }
  );
}

function Preview({ id, chartKey }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const seed = hashString(id);
    const rng = seededRng(seed);
    drawChartPreview(ref.current, chartKey, seed, rng);
  }, [id, chartKey]);
  return <div ref={ref} className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#080d1a]" />;
}

export function App() {
  const [lang, setLang] = useState("es");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const t = COPY[lang];

  const categories = useMemo(
    () => BASE_CATEGORIES.map((c) => ({ ...c, label: lang === "es" ? c.es : c.en })),
    [lang]
  );

  const cards = useMemo(
    () =>
      categories.flatMap((cat) =>
        cat.charts.map((chart) => {
          const chartText = getChartText(chart);
          return {
          id: `${cat.id}-${chart}`,
          name: lang === "es" ? chart : chartText.enName,
          chartKey: chart,
          categoryId: cat.id,
          category: cat.label,
          useCase: lang === "es" ? chartText.esDesc : chartText.enDesc,
        };
        })
      ),
    [categories, lang]
  );

  const filtered = cards.filter((card) => {
    const passCategory = category === "all" || card.categoryId === category;
    const q = query.toLowerCase();
    const passQuery = !q || card.name.toLowerCase().includes(q) || card.useCase.toLowerCase().includes(q);
    return passCategory && passQuery;
  });

  return (
    <div className="relative min-h-screen">
      <div className="grain" />
      <main className="mx-auto w-[min(1240px,92vw)] py-10">
        <header className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{t.eyebrow}</p>
            <div className="rounded-full border border-white/15 bg-white/5 p-1">
              <Button
                size="sm"
                variant="ghost"
                className={lang === "es" ? "bg-accent/30 text-white hover:bg-accent/30" : ""}
                onClick={() => setLang("es")}
              >
                ESP
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={lang === "en" ? "bg-accent/30 text-white hover:bg-accent/30" : ""}
                onClick={() => setLang("en")}
              >
                ENG
              </Button>
            </div>
          </div>
          <h1 className="font-display text-6xl font-extrabold tracking-tight text-slate-100 md:text-7xl">WhichGraph</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300">{t.subtitle}</p>
        </header>

        <Card className="mb-4 p-4">
          <p className="mb-2 text-sm font-medium text-slate-300">{t.relation}</p>
          <div className="grid gap-3 md:grid-cols-[280px,1fr]">
            <select className="select-native" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">{t.all} ({cards.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.label} ({c.charts.length})</option>
              ))}
            </select>
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} />
          </div>
        </Card>

        <Card className="mb-6 flex items-start gap-3 border-l-4 border-l-accent bg-gradient-to-r from-accent/8 to-transparent">
          <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
          <p className="text-sm text-slate-300">{t.source}</p>
        </Card>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((card) => (
            <Card key={card.id} className="group">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent/90">{card.category}</p>
              <h3 className="font-display text-2xl font-bold leading-tight text-slate-100">{card.name}</h3>
              <p className="mt-2 min-h-[3.2rem] text-sm leading-relaxed text-slate-300">{card.useCase}</p>
              <Preview id={card.id} chartKey={card.chartKey} />
            </Card>
          ))}
        </section>

        <footer className="mt-12 flex items-center justify-between border-t border-white/10 py-4 text-sm text-slate-400">
          <p>© 2026 Luis Pascual</p>
          <a className="inline-flex items-center gap-1 transition hover:text-slate-100" href="https://www.linkedin.com/in/luispascualcid/" target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight className="h-4 w-4" />
          </a>
        </footer>
      </main>
    </div>
  );
}
