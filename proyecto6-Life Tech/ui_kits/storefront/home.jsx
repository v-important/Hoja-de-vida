// Home / landing screen for Life Tech storefront
const { useEffect: useEffectHome, useRef: useRefHome } = React;

// ── Particle field (canvas) — mounted inside the hero ──────────────────────
function ParticleField() {
  const ref = useRefHome(null);
  useEffectHome(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Generate particles
    const count = 70;
    const pts = Array.from({ length: count }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      r:  Math.random() * 1.2 + 0.4,
      a:  Math.random() * 0.35 + 0.06,
      red: Math.random() < 0.14,       // 14% son rojos
    }));

    let raf;
    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Draw connecting lines between nearby particles
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = (pts[i].x - pts[j].x) * W;
          const dy = (pts[i].y - pts[j].y) * H;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x * W, pts[i].y * H);
            ctx.lineTo(pts[j].x * W, pts[j].y * H);
            const alpha = (1 - d / 90) * 0.07;
            ctx.strokeStyle = `rgba(239,43,43,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.red
          ? `rgba(239,43,43,${p.a})`
          : `rgba(245,245,247,${p.a * 0.55})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={ref} aria-hidden style={{
      position: "absolute", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0,
    }}/>
  );
}

// ── Scroll reveal — registers Intersection Observer for .lt-reveal elements ──
function useScrollReveal() {
  useEffectHome(() => {
    const els = document.querySelectorAll(".lt-reveal, .lt-reveal--scale, .lt-reveal--left");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function HomeHero({ onShop, onProduct, products, brands }) {
  const prods = products || [];
  const productCount = prods.length;
  const brandMap = brands || {};
  const brandCount = brandMap?.setup?.length > 0
    ? brandMap.setup.length
    : new Set([...(brandMap.perif || []), ...(brandMap.comp || [])]).size
    || new Set(prods.map(p => p.brand).filter(Boolean)).size;

  return (
    <section className="lt-hero lt-hero--cinema">
      <ParticleField/>
      <div className="lt-hero-bg"/>
      <div className="lt-hero-grid"/>

      <div className="lt-hero-body">

        {/* Eyebrow tag */}
        <div className="lt-eyebrow-tag lt-reveal">
          <span className="lt-live"/>
          Gaming Peripherals &nbsp;·&nbsp; Componentes &nbsp;·&nbsp; Setups
        </div>

        {/* Headline */}
        <h1 className="lt-hero-h1-cinema lt-reveal lt-d1">
          Tu vida,<br/>
          <span style={{ color: "var(--brand-red)" }}>tu&nbsp;setup.</span>
        </h1>

        {/* Lead */}
        <p className="lt-hero-lead lt-reveal lt-d2">
          Hardware sin compromisos para gamers de nivel.<br/>
          Periféricos, componentes y setups completos.
        </p>

        {/* CTAs */}
        <div className="lt-hero-actions lt-reveal lt-d3">
          <Button variant="primary" size="lg" onClick={() => onShop("all")}>
            Explorar tienda <Icon name="arrowR" size={16}/>
          </Button>
          <Button variant="secondary" size="lg" onClick={() => onShop("perif")}>
            Ver periféricos
          </Button>
        </div>

        {/* Product showcase */}
        <div className="lt-hero-showcase lt-reveal lt-d4">
          <div className="lt-hero-showcase-glow"/>
          <img
            src="assets/LT%20Avatar.png"
            alt="Life Tech"
            style={{
              position: "relative", zIndex: 1,
              width: "100%", maxWidth: 480, height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 64px rgb(239 43 43 / 0.4))",
              animation: "lt-float 7s ease-in-out infinite",
            }}
          />
        </div>

        {/* Stats bar */}
        <div className="lt-statsbar lt-reveal lt-d5" style={{ width: "100%", maxWidth: 560 }}>
          <div className="lt-statsbar-item">
            <div className="lt-statsbar-val">{productCount > 0 ? productCount : "—"}</div>
            <div className="lt-statsbar-lbl">Productos</div>
          </div>
          <div className="lt-statsbar-item">
            <div className="lt-statsbar-val">{brandCount > 0 ? brandCount : "—"}</div>
            <div className="lt-statsbar-lbl">Marcas</div>
          </div>
          <div className="lt-statsbar-item">
            <div className="lt-statsbar-val">24h</div>
            <div className="lt-statsbar-lbl">Envío express</div>
          </div>
          <div className="lt-statsbar-item">
            <div className="lt-statsbar-val">2 años</div>
            <div className="lt-statsbar-lbl">Garantía</div>
          </div>
        </div>

      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ font: "700 28px/1 var(--font-sans)", letterSpacing: "-0.02em" }}>{value}</span>
      <span className="lt-overline" style={{ color: "var(--fg-3)" }}>{label}</span>
    </div>
  );
}

// Tile de categoría con carrusel de imágenes reales (cicla cada 5 s con fade)
function CategoryTile({ cat, products, onShop }) {
  const { useState: useSt, useEffect: useEff } = React;
  const prods  = (products || []).filter(p => p.shape === cat.shape);
  const images = prods.filter(p => p.imageUrl).map(p => p.imageUrl);
  const count  = prods.length;
  const [idx,  setIdx]  = useSt(0);
  const [show, setShow] = useSt(true);

  useEff(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setShow(false);
      setTimeout(() => { setIdx(i => (i + 1) % images.length); setShow(true); }, 350);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="lt-cat-tile" onClick={() => onShop(cat.shopCat)}>
      <div className="lt-cat-tile-img">
        {images.length > 0 ? (
          <img src={images[idx]} alt={cat.label} style={{ maxHeight: 80, maxWidth: "90%", objectFit: "contain", opacity: show ? 1 : 0, transition: "opacity .35s", position: "relative", zIndex: 1 }}/>
        ) : (
          <div style={{ opacity: 0.55, position: "relative", zIndex: 1 }}>
            <ProductImg shape={cat.shape} size={80}/>
          </div>
        )}
      </div>
      <div className="lt-cat-tile-name">{cat.label}</div>
      <div className="lt-cat-tile-count">{count} {count === 1 ? "item" : "items"}</div>
    </div>
  );
}

function CategorySection({ title, eyebrow, cats, onShop, products }) {
  const totalSection = cats.reduce((s, c) => s + (products || []).filter(p => p.shape === c.shape).length, 0);
  return (
    <section className="lt-section lt-section--spacious">
      <div className="lt-section-inner">
        <div className="lt-section-head lt-reveal" style={{ marginBottom: 32 }}>
          <div>
            <div className="lt-section-eyebrow">{eyebrow}</div>
            <h2 className="lt-section-title-xl" style={{ marginTop: 10 }}>{title}</h2>
            <div className="lt-section-divider"/>
          </div>
          <span style={{ font: "500 12px/1 var(--font-mono)", color: "var(--fg-3)" }}>
            {totalSection} producto{totalSection !== 1 ? "s" : ""}
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
          {cats.map((c, i) => (
            <div key={c.label} className={`lt-reveal lt-d${Math.min(i + 1, 8)}`}>
              <CategoryTile cat={c} products={products} onShop={onShop}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PeripheralsSection({ onShop, products }) {
  return <CategorySection
    eyebrow="Periféricos"
    title={<>Lo que <span className="red">tocas todos los días</span></>}
    cats={[
      { label: "Teclados",   shape: "keyboard", shopCat: "perif" },
      { label: "Mouse",      shape: "mouse",    shopCat: "perif" },
      { label: "Audífonos",  shape: "headset",  shopCat: "perif" },
      { label: "Mousepad",   shape: "pad",      shopCat: "perif" },
      { label: "Micrófonos", shape: "mic",      shopCat: "perif" },
      { label: "Webcams",    shape: "webcam",   shopCat: "perif" },
    ]}
    onShop={onShop}
    products={products}
  />;
}

function ComponentsSection({ onShop, products }) {
  return <CategorySection
    eyebrow="Componentes"
    title={<>Las piezas que <span className="red">no parpadean</span></>}
    cats={[
      { label: "Tarjeta Gráfica",  shape: "gpu",         shopCat: "comp" },
      { label: "Procesador",       shape: "cpu",         shopCat: "comp" },
      { label: "Tarjeta Madre",    shape: "motherboard", shopCat: "comp" },
      { label: "Memoria RAM",      shape: "ram",         shopCat: "comp" },
      { label: "Almacenamiento",   shape: "ssd",         shopCat: "comp" },
      { label: "Disco Duro",       shape: "hdd",         shopCat: "comp" },
      { label: "Fuente de Poder",  shape: "psu",         shopCat: "comp" },
      { label: "Gabinete",         shape: "case",        shopCat: "comp" },
      { label: "Refrigeración",    shape: "cooling",     shopCat: "comp" },
    ]}
    onShop={onShop}
    products={products}
  />;
}

function HomeFeatured({ products, onAdd, onOpen, favs, onFav }) {
  if (!products || products.length === 0) return null;
  const hero = products[0];
  const rest = products.slice(1, 4);
  const isOut = hero.stock === 0 || hero.stock === "out";

  return (
    <section className="lt-section lt-section--spacious">
      <div className="lt-section-inner">
        <div className="lt-section-head lt-reveal" style={{ marginBottom: 32 }}>
          <div>
            <div className="lt-section-eyebrow">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-red)", display: "inline-block" }}/>
              Más vendidos esta semana
            </div>
            <h2 className="lt-section-title-xl" style={{ marginTop: 10 }}>
              Lo que está <span style={{ color: "var(--brand-red)" }}>arrasando</span>
            </h2>
          </div>
          <a className="lt-link" style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--fg-2)" }} onClick={() => onOpen && onOpen(hero)}>
            Ver todo <Icon name="arrowR" size={14}/>
          </a>
        </div>

        {/* Grid: hero card takes left 2/3, right column has smaller cards */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>

          {/* Hero product — big featured card */}
          <div className="lt-featured-hero lt-reveal lt-d1" onClick={() => onOpen?.(hero)}>
            <div className="lt-featured-hero-img">
              <div style={{ position: "relative", zIndex: 1 }}>
                <ProductImg shape={hero.shape} size={240} imageUrl={hero.imageUrl}/>
              </div>
            </div>
            <div className="lt-featured-hero-body">
              <div className="lt-featured-hero-badge">
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", display: "inline-block" }}/>
                Producto destacado
              </div>
              <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", letterSpacing: ".1em", textTransform: "uppercase" }}>
                {hero.brand} · {hero.subcat}
              </div>
              <div className="lt-featured-hero-name">{hero.name}</div>
              <div className="lt-featured-hero-tag">{hero.tagline}</div>
              <div className="lt-featured-hero-price">
                {hero.was && <s>${hero.was.toLocaleString("en-US")}</s>}
                ${hero.price.toLocaleString("en-US")}
                <span style={{ font: "400 14px/1 var(--font-sans)", color: "var(--fg-3)", marginLeft: 8 }}>USD</span>
              </div>
              <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                <Button variant="primary" onClick={e => { e.stopPropagation(); onAdd(hero, 1); }} disabled={isOut}>
                  {isOut ? "Agotado" : "Añadir al carrito"}
                </Button>
                <Button variant="secondary" onClick={() => onOpen?.(hero)}>Ver detalles</Button>
              </div>
            </div>
          </div>

          {/* Smaller cards stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {rest.map((p, i) => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={onOpen}
                fav={favs?.has(p.id)} onFav={onFav}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Datos para la animación del terminal ─────────────────────────────────────
const AI_DEMOS = [
  { game: "Valorant",         tipo: "FPS Competitivo",    dpi: "800 → 1600",  polling: "1000Hz → 8000Hz", rgb: "Rojo crisis",      ms: 240 },
  { game: "Minecraft",        tipo: "Survival / Creativo",dpi: "400 → 800",   polling: "125Hz → 500Hz",   rgb: "Verde esmeralda",  ms: 180 },
  { game: "League of Legends",tipo: "MOBA Estratégico",   dpi: "1200 → 1800", polling: "500Hz → 1000Hz",  rgb: "Azul zafiro",      ms: 210 },
  { game: "Apex Legends",     tipo: "Battle Royale FPS",  dpi: "600 → 1200",  polling: "1000Hz → 4000Hz", rgb: "Naranja fuego",    ms: 195 },
  { game: "GTA VI",           tipo: "Open World AAA",     dpi: "800 → 1000",  polling: "500Hz → 1000Hz",  rgb: "Dorado lujo",      ms: 220 },
  { game: "Cyberpunk 2077",   tipo: "RPG / RTX",          dpi: "1000 → 1400", polling: "1000Hz → 2000Hz", rgb: "Cian neón",        ms: 200 },
];

// ── Modal instructivo "Cómo funciona" ─────────────────────────────────────────
function HowItWorksModal({ onClose, onOpenChat }) {
  const pasos = [
    {
      num: "01",
      titulo: "Dinos qué juegas",
      desc: "Escribe el nombre del juego, el género o tu presupuesto. No necesitas saber nada técnico — escríbelo como se lo dirías a un amigo.",
      color: "var(--neon-cyan)",
    },
    {
      num: "02",
      titulo: "La IA detecta tu perfil",
      desc: "Identificamos si es FPS competitivo, MOBA, open world, streaming o un setup económico. Cada categoría tiene requisitos muy distintos.",
      color: "var(--brand-red)",
    },
    {
      num: "03",
      titulo: "Recibe tu setup ideal",
      desc: "Te entregamos componentes y periféricos con marcas reales (Intel, AMD, ASUS, Logitech, Razer…) y precios estimados en USD. Listo para comprar.",
      color: "var(--neon-lime)",
    },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgb(0 0 0 / 0.72)", backdropFilter: "blur(4px)" }}/>

      {/* Card */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 560,
        background: "#0e0e12", borderRadius: 20,
        border: "1px solid rgba(34 211 238 / 0.25)",
        boxShadow: "0 0 80px rgba(34 211 238 / 0.12), 0 32px 64px rgba(0,0,0,0.7)",
        overflow: "hidden", animation: "lt-slide-in .25s var(--ease-out)",
      }}>
        {/* Header */}
        <div style={{ padding: "28px 32px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgb(34 211 238 / 0.12)", color: "var(--neon-cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="ai" size={14}/>
              </div>
              <span style={{ font: "600 11px/1 var(--font-mono)", color: "var(--neon-cyan)", letterSpacing: ".1em", textTransform: "uppercase" }}>Life Tech IA</span>
            </div>
            <h3 style={{ font: "800 22px/1.1 var(--font-sans)", letterSpacing: "-0.03em" }}>¿Cómo funciona el asesor?</h3>
            <p style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--fg-3)", marginTop: 6 }}>
              Tres pasos para tener tu setup ideal con marcas y precios reales.
            </p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer", padding: 6, borderRadius: 6, flexShrink: 0, marginLeft: 16 }}>
            <Icon name="close" size={18}/>
          </button>
        </div>

        {/* Pasos */}
        <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20 }}>
          {pasos.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `color-mix(in srgb, ${p.color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${p.color} 25%, transparent)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                font: "700 13px/1 var(--font-mono)", color: p.color,
              }}>{p.num}</div>
              <div>
                <div style={{ font: "600 14px/1 var(--font-sans)", marginBottom: 5 }}>{p.titulo}</div>
                <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--fg-3)" }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Juegos soportados */}
        <div style={{ marginInline: 32, padding: "14px 16px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", marginBottom: 24 }}>
          <div style={{ font: "600 10px/1 var(--font-mono)", color: "var(--fg-4)", letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>Juegos reconocidos</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Valorant","CS2","Fortnite","Apex Legends","Minecraft","GTA V / VI","League of Legends","Cyberpunk 2077","EA FC","Roblox","Streaming"].map(j => (
              <span key={j} style={{ padding: "3px 10px", borderRadius: 99, background: "var(--surface-2)", border: "1px solid var(--border)", font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)" }}>{j}</span>
            ))}
            <span style={{ padding: "3px 10px", borderRadius: 99, background: "rgba(34 211 238 / 0.07)", border: "1px solid rgba(34 211 238 / 0.18)", font: "500 11px/1 var(--font-mono)", color: "var(--neon-cyan)" }}>+ cualquier presupuesto</span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "0 32px 28px", display: "flex", gap: 10 }}>
          <button
            onClick={() => { onClose(); onOpenChat(); }}
            style={{
              flex: 1, height: 44, borderRadius: 10, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, var(--neon-cyan), #0ea5e9)",
              color: "#050506", font: "700 13px/1 var(--font-sans)", letterSpacing: ".04em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            Probar ahora <Icon name="arrowR" size={14}/>
          </button>
          <button onClick={onClose} style={{ padding: "0 20px", height: 44, borderRadius: 10, border: "1px solid var(--border)", background: "transparent", color: "var(--fg-2)", font: "600 13px/1 var(--font-sans)", cursor: "pointer" }}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

function HomeAIBand() {
  const { useState, useEffect } = React;
  const [chatOpen, setChatOpen] = useState(false);
  const [howOpen,  setHowOpen]  = useState(false);
  const [demoIdx,  setDemoIdx]  = useState(0);
  const [visible,  setVisible]  = useState(true);

  // Cicla entre demos cada 3.5 s con fade
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setDemoIdx(i => (i + 1) % AI_DEMOS.length);
        setVisible(true);
      }, 350);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const demo = AI_DEMOS[demoIdx];

  return (
    <>
      <section className="lt-section" style={{ paddingBlock: 96 }}>
        <div className="lt-section-inner" style={{
          background: "linear-gradient(135deg, #050506 0%, #15151a 100%)",
          border: "1px solid var(--border)", borderRadius: 20,
          padding: "64px 48px",
          position: "relative", overflow: "hidden",
          display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "center"
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 90% 50%, rgb(34 211 238 / 0.18), transparent 50%)" }}/>

          {/* Texto izquierdo */}
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            <Badge tone="cyan"><Icon name="ai" size={12}/>LIFE TECH IA</Badge>
            <h2 style={{ font: "900 48px/1 var(--font-display)", letterSpacing: "-0.04em" }}>
              Tu setup <span style={{ color: "var(--neon-cyan)" }}>aprende</span> de cómo juegas.
            </h2>
            <p style={{ color: "var(--fg-2)", fontSize: 16, lineHeight: 1.5, maxWidth: 520 }}>
              Dinos qué juegas y la IA de Life Tech arma tu setup ideal: componentes, periféricos,
              marcas reales y precios en USD. Listo en segundos.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <Button variant="primary" onClick={() => setChatOpen(true)}>Probar gratis</Button>
              <Button variant="ghost" onClick={() => setHowOpen(true)}>Cómo funciona</Button>
            </div>
          </div>

          {/* Terminal animado */}
          <div style={{
            position: "relative", zIndex: 1,
            background: "#050506", border: "1px solid var(--border)",
            borderRadius: 12, padding: 16,
            fontFamily: "var(--font-mono)", fontSize: 12, lineHeight: 1.6,
            minHeight: 160,
          }}>
            {/* Botones de ventana */}
            <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#ef4444" }}/>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#f59e0b" }}/>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#22c55e" }}/>
            </div>

            {/* Contenido animado */}
            <div style={{ opacity: visible ? 1 : 0, transition: "opacity .3s ease" }}>
              <div style={{ color: "var(--fg-3)" }}>$ life-tech detect --game</div>
              <div style={{ color: "var(--neon-cyan)", marginTop: 4 }}>→ Juego detectado: <strong>{demo.game}</strong></div>
              <div style={{ color: "var(--neon-cyan)" }}>→ Perfil: "{demo.tipo}"</div>
              <div style={{ color: "var(--fg-2)", marginTop: 6 }}>· DPI: {demo.dpi}</div>
              <div style={{ color: "var(--fg-2)" }}>· Polling rate: {demo.polling}</div>
              <div style={{ color: "var(--fg-2)" }}>· RGB: {demo.rgb}</div>
              <div style={{ color: "var(--neon-lime)", marginTop: 6 }}>✓ Perfil aplicado en {demo.ms}ms</div>
            </div>
          </div>
        </div>
      </section>

      {chatOpen && <ChatBotPanel onClose={() => setChatOpen(false)}/>}
      {howOpen  && <HowItWorksModal onClose={() => setHowOpen(false)} onOpenChat={() => setChatOpen(true)}/>}
    </>
  );
}

function HomeMore({ products, onAdd, onOpen, favs, onFav }) {
  return (
    <section className="lt-section">
      <div className="lt-section-inner">
        <div className="lt-section-head">
          <div>
            <span className="lt-overline" style={{ color: "var(--fg-3)" }}>Componentes</span>
            <h2 className="lt-section-title" style={{ marginTop: 8 }}>Las piezas que <span className="red">no parpadean</span></h2>
          </div>
        </div>
        <div className="lt-grid-4">
          {products.slice(4, 8).map(p => (
            <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={onOpen} fav={favs.has(p.id)} onFav={onFav}/>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeTrust() {
  const items = [
    { icon: "truck",   t: "Envío gratis",     s: "En pedidos sobre $99 USD" },
    { icon: "shield",  t: "Garantía 2 años",  s: "Cubre defectos de fábrica" },
    { icon: "package", t: "30 días devol.",   s: "Sin preguntas, sin drama" },
    { icon: "zap",     t: "Soporte 24/7",     s: "Equipo gamer, respuesta real" },
  ];
  return (
    <div className="lt-trust-bar lt-reveal">
      {items.map(it => (
        <div key={it.t} className="lt-trust-item">
          <div className="lt-trust-icon"><Icon name={it.icon} size={22}/></div>
          <div>
            <div className="lt-trust-title">{it.t}</div>
            <div className="lt-trust-sub">{it.s}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HomeScreen({ products, brands, onShop, onAdd, onOpen, favs, onFav }) {
  const hasProducts = products && products.length > 0;
  useScrollReveal();
  return (
    <div className="lt-page-in">
      <HomeHero onShop={onShop} onProduct={onOpen} products={products} brands={brands}/>
      {hasProducts && (
        <HomeFeatured products={products} onAdd={onAdd} onOpen={onOpen} favs={favs} onFav={onFav}/>
      )}
      <PeripheralsSection onShop={onShop} products={products}/>
      <ComponentsSection onShop={onShop} products={products}/>
      <HomeAIBand onShop={onShop}/>
      <HomeTrust/>
    </div>
  );
}

window.HomeScreen = HomeScreen;
