// Ofertas — Flash Sale page (4-column grid, countdown, no sidebar)

function CountdownTimer() {
  const { useState, useEffect } = React;
  const END = new Date("2026-05-14T23:59:59").getTime();

  const calc = () => {
    const diff = Math.max(0, END - Date.now());
    return {
      d: Math.floor(diff / 86400000),
      h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
    };
  };

  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = n => String(n).padStart(2, "0");
  const units = [
    { val: pad(t.d), label: "DÍAS" },
    { val: pad(t.h), label: "HRS" },
    { val: pad(t.m), label: "MIN" },
    { val: pad(t.s), label: "SEG" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
      {units.map(({ val, label }, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span style={{ color: "var(--brand-red)", font: "900 28px/1 var(--font-display)", marginTop: 8 }}>:</span>
          )}
          <div style={{ textAlign: "center" }}>
            <div style={{
              font: "900 34px/1 var(--font-display)", letterSpacing: "-0.04em",
              color: "var(--fg)", background: "rgb(255 255 255 / 0.06)",
              border: "1px solid var(--border)", borderRadius: 10,
              padding: "10px 16px", minWidth: 62,
            }}>
              {val}
            </div>
            <div style={{ font: "600 9px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: ".14em", marginTop: 5 }}>
              {label}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function DiscountBar({ save }) {
  if (!save) return null;
  const pct = Math.min(save, 100);
  return (
    <div style={{ position: "relative", height: 3, background: "var(--border)", borderRadius: 999, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, height: "100%",
        width: `${pct}%`, background: "var(--brand-red)",
        borderRadius: 999,
        boxShadow: "0 0 8px var(--brand-red)",
      }}/>
    </div>
  );
}

function OfertaCard({ product, onAdd, onOpen, fav, onFav }) {
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (added) return;
    onAdd?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      onClick={() => onOpen?.(product)}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "border-color .2s, transform .2s, box-shadow .2s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(239,43,43,0.4)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 16px 40px rgb(0 0 0 / 0.45)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Discount badge */}
      {product.save && (
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          background: "var(--brand-red)", color: "#fff",
          font: "800 12px/1 var(--font-sans)", padding: "5px 9px",
          borderRadius: 6, boxShadow: "0 4px 12px rgb(239 43 43 / 0.45)",
        }}>
          −{product.save}%
        </div>
      )}

      {/* Fav */}
      <button
        onClick={e => { e.stopPropagation(); onFav?.(product); }}
        style={{
          position: "absolute", top: 12, right: 12, zIndex: 2,
          width: 30, height: 30, borderRadius: 8,
          border: "1px solid var(--border)", background: "var(--surface-2)",
          color: fav ? "var(--brand-red)" : "var(--fg-3)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "color .15s, border-color .15s",
        }}
      >
        <Icon name="heart" size={13} fill={fav}/>
      </button>

      {/* Image */}
      <div style={{
        background: "linear-gradient(160deg, var(--surface-2), var(--surface))",
        padding: "28px 20px 20px",
        display: "flex", justifyContent: "center", alignItems: "center",
        minHeight: 148,
        borderBottom: "1px solid var(--border)",
      }}>
        <ProductImg shape={product.shape} size={170}/>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>

        {/* Brand + subcat */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{
            font: "700 10px/1 var(--font-sans)", letterSpacing: ".1em",
            color: "var(--brand-red)", textTransform: "uppercase",
          }}>
            {product.brand}
          </span>
          <span style={{
            font: "500 10px/1 var(--font-sans)", color: "var(--fg-3)",
            textTransform: "uppercase", letterSpacing: ".07em",
          }}>
            {product.subcat}
          </span>
        </div>

        {/* Name */}
        <div style={{ font: "700 14px/1.25 var(--font-sans)", color: "var(--fg)" }}>
          {product.name}
        </div>

        {/* Tagline */}
        <div style={{ font: "400 12px/1.45 var(--font-sans)", color: "var(--fg-2)" }}>
          {product.tagline}
        </div>

        {/* Specs chips */}
        {product.specs && (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {product.specs.slice(0, 2).map((s, i) => (
              <span key={i} style={{
                font: "500 10px/1 var(--font-mono)", color: "var(--fg-3)",
                background: "var(--surface-2)", border: "1px solid var(--border)",
                borderRadius: 4, padding: "3px 7px",
              }}>
                {s.k}: <span style={{ color: "var(--fg-2)" }}>{s.v}</span>
              </span>
            ))}
          </div>
        )}

        {/* Rating */}
        <Stars rating={product.rating} reviews={product.reviews}/>

        {/* Stock */}
        <div style={{
          font: "500 11px/1 var(--font-sans)",
          color: product.stock === "low" ? "var(--warning)" : "var(--neon-lime)",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          {product.stock === "low"
            ? <><Icon name="zap" size={11}/> Quedan {product.stockN} unidades</>
            : <><span className="lt-live"/>En stock</>
          }
        </div>

        {/* Discount bar */}
        {product.save && <DiscountBar save={product.save}/>}

        {/* Price + CTA */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "auto", paddingTop: 10,
          borderTop: "1px solid var(--border)",
        }}>
          <div>
            {product.was && (
              <div style={{
                font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)",
                textDecoration: "line-through", marginBottom: 3,
              }}>
                ${product.was.toLocaleString("en-US")} USD
              </div>
            )}
            <div style={{ font: "800 17px/1 var(--font-display)", color: "var(--fg)", letterSpacing: "-0.02em" }}>
              ${product.price.toLocaleString("en-US")}
              <span style={{ font: "400 10px/1 var(--font-sans)", color: "var(--fg-3)", marginLeft: 3 }}>USD</span>
            </div>
          </div>
          <button
            className="lt-btn lt-btn--primary"
            style={{ height: 34, padding: "0 14px", fontSize: 12, gap: 5 }}
            onClick={handleAdd}
          >
            {added
              ? <><Icon name="check" size={13}/>Añadido</>
              : <><Icon name="cart" size={13}/>Añadir</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

const OFER_CATS = [
  { id: "all",   label: "Todos" },
  { id: "perif", label: "Periféricos" },
  { id: "comp",  label: "Componentes" },
  { id: "setup", label: "Setups" },
];

const SORT_OPTS = [
  { id: "save",   label: "Mayor descuento" },
  { id: "low",    label: "Menor precio" },
  { id: "high",   label: "Mayor precio" },
  { id: "rating", label: "Mejor valorado" },
];

function OfertasScreen({ products, onAdd, onOpen, favs, onFav }) {
  const [cat,    setCat]    = React.useState("all");
  const [sort,   setSort]   = React.useState("save");
  const [search, setSearch] = React.useState("");

  // Solo se muestran productos marcados explícitamente con inOferta: true.
  // Catálogo vacío por diseño — los productos aparecerán una vez sean cargados con descuento activo.
  const ofertaBase = products.filter(p => p.inOferta === true);

  let list = ofertaBase.filter(p => cat === "all" || p.cat === cat);

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      (p.tagline || "").toLowerCase().includes(q)
    );
  }

  list = [...list].sort((a, b) => {
    if (sort === "save")   return (b.save || 0) - (a.save || 0);
    if (sort === "low")    return a.price - b.price;
    if (sort === "high")   return b.price - a.price;
    if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <>
      {/* ── Hero banner ─────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #090909 0%, #1c0404 55%, #0a0a0d 100%)",
        borderBottom: "1px solid var(--border)",
        padding: "52px var(--gutter) 44px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glow blob */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700, height: 220,
          background: "radial-gradient(ellipse, rgb(239 43 43 / 0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}/>

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 28 }}>
          {/* Left — heading */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgb(239 43 43 / 0.12)", border: "1px solid rgb(239 43 43 / 0.3)",
              borderRadius: 999, padding: "5px 14px", marginBottom: 18,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--brand-red)", boxShadow: "0 0 8px var(--brand-red)", display: "block" }}/>
              <span style={{ font: "700 11px/1 var(--font-sans)", color: "var(--brand-red)", letterSpacing: ".14em", textTransform: "uppercase" }}>Flash Sale · Tiempo limitado</span>
            </div>
            <h1 style={{ font: "900 68px/1 var(--font-display)", letterSpacing: "-0.045em", color: "var(--fg)", marginBottom: 14 }}>
              Ofer<span style={{ color: "var(--brand-red)" }}>tas</span>
            </h1>
            <p style={{ font: "400 15px/1.55 var(--font-sans)", color: "var(--fg-2)", maxWidth: 420 }}>
              Los mejores precios en hardware gamer. Descuentos hasta el <strong style={{ color: "var(--fg)" }}>30%</strong> en periféricos, componentes y setups — por tiempo limitado.
            </p>
            <div style={{ display: "flex", gap: 24, marginTop: 22 }}>
              <div>
                <div style={{ font: "800 26px/1 var(--font-display)", color: "var(--fg)" }}>{ofertaBase.length}</div>
                <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 3 }}>productos en oferta</div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }}/>
              <div>
                <div style={{ font: "800 26px/1 var(--font-display)", color: "var(--brand-red)" }}>
                  {ofertaBase.length > 0 ? Math.max(...ofertaBase.map(p => p.save || 0)) + "%" : "—"}
                </div>
                <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 3 }}>descuento máximo</div>
              </div>
            </div>
          </div>

          {/* Right — countdown */}
          <div>
            <div style={{ font: "600 10px/1 var(--font-sans)", color: "var(--fg-3)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>
              La oferta termina en
            </div>
            <CountdownTimer/>
          </div>
        </div>
      </div>

      {/* ── Filter / sort bar ──────────────────────────────── */}
      <div style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: 64, zIndex: 40,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 var(--gutter)",
          display: "flex", alignItems: "center",
        }}>
          {/* Category tabs */}
          {OFER_CATS.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                font: "600 13px/1 var(--font-sans)",
                color: cat === c.id ? "var(--fg)" : "var(--fg-3)",
                padding: "15px 18px",
                borderBottom: cat === c.id ? "2px solid var(--brand-red)" : "2px solid transparent",
                transition: "color .15s, border-color .15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (cat !== c.id) e.currentTarget.style.color = "var(--fg-2)"; }}
              onMouseLeave={e => { if (cat !== c.id) e.currentTarget.style.color = "var(--fg-3)"; }}
            >
              {c.label}
            </button>
          ))}

          <div style={{ flex: 1 }}/>

          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            height: 32, padding: "0 12px",
            border: "1px solid var(--border)", borderRadius: 8,
            background: "var(--surface-2)", color: "var(--fg-3)",
            marginRight: 12,
          }}>
            <Icon name="search" size={13}/>
            <input
              placeholder="Buscar en ofertas…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "transparent", border: 0, outline: 0,
                font: "400 12px/1 var(--font-sans)", color: "var(--fg)",
                width: 160,
              }}
            />
          </div>

          {/* Count */}
          <span style={{ font: "400 12px/1 var(--font-sans)", color: "var(--fg-3)", marginRight: 12, whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--fg)", fontWeight: 600 }}>{list.length}</span> productos
          </span>

          {/* Sort */}
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{
              background: "var(--surface-2)", color: "var(--fg)",
              border: "1px solid var(--border)", borderRadius: 8,
              height: 32, padding: "0 10px",
              font: "500 12px/1 var(--font-sans)", cursor: "pointer",
            }}>
            {SORT_OPTS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* ── Product grid ───────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px var(--gutter) 64px" }}>

        {list.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 22 }}>
            {list.map(p => (
              <OfertaCard key={p.id} product={p} onAdd={onAdd} onOpen={onOpen} fav={favs?.has(p.id)} onFav={onFav}/>
            ))}
          </div>
        ) : (
          <div style={{
            padding: "80px 40px", textAlign: "center",
            border: "1px dashed var(--border)", borderRadius: 20,
            background: "var(--surface)",
          }}>
            {/* Ícono */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgb(239 43 43 / 0.08)", border: "1px solid rgb(239 43 43 / 0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}>
              <Icon name="zap" size={28} style={{ color: "var(--brand-red)", opacity: 0.5 }}/>
            </div>

            <div style={{ font: "700 18px/1.3 var(--font-display)", letterSpacing: "-0.02em", color: "var(--fg)", marginBottom: 8 }}>
              Próximamente nuevas ofertas
            </div>
            <p style={{ font: "400 13px/1.6 var(--font-sans)", color: "var(--fg-3)", maxWidth: 380, margin: "0 auto 28px" }}>
              Aún no hay productos en oferta. Cuando se activen descuentos aparecerán aquí — vuelve pronto para no perderte las mejores promociones.
            </p>

            {/* Links a otras secciones */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "Ver Periféricos", href: "perifericos.html" },
                { label: "Ver Componentes", href: "componentes.html" },
                { label: "Ver Setups",      href: "setups.html" },
              ].map(({ label, href }) => (
                <a key={href} href={href} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  height: 36, padding: "0 16px",
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: 8, font: "500 12px/1 var(--font-sans)", color: "var(--fg-2)",
                  textDecoration: "none", transition: "border-color .15s, color .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--fg)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-2)"; }}>
                  {label}
                  <Icon name="arrowR" size={12}/>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

window.OfertasScreen = OfertasScreen;
