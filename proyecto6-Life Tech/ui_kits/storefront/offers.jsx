// Offers / deals listing screen

// Un producto tiene oferta si cumple alguna de estas condiciones:
function isOffer(p) {
  if (p.inOferta === true)             return true;
  if (p.was && p.was > p.price)        return true;
  if (p.save && p.save > 0)            return true;
  if ((p.badges || []).some(b => b.startsWith("−"))) return true;
  return false;
}

// Calcula el % de descuento de un producto
function discountPct(p) {
  if (p.save) return p.save;
  if (p.was && p.was > p.price) return Math.round((1 - p.price / p.was) * 100);
  const badge = (p.badges || []).find(b => b.startsWith("−"));
  if (badge) return parseInt(badge.replace("−", "").replace("%", ""), 10) || 0;
  return 0;
}

// Ahorro en pesos
function savings(p) {
  if (p.was && p.was > p.price) return p.was - p.price;
  if (p.save && p.was)          return p.was - p.price;
  return 0;
}

const CAT_LABELS = { all: "Todas", perif: "Periféricos", comp: "Componentes", setup: "Setups" };

// ── Tarjeta de oferta con el descuento muy visible ───────────────────────────
function OfferCard({ product, onAdd, onOpen, fav, onFav }) {
  const pct  = discountPct(product);
  const save = savings(product);
  const isOut = product.stock === 0 || product.stock === "out";

  return (
    <div style={{
      position: "relative",
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 14, overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "all .22s var(--ease-out)",
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--brand-red)"; e.currentTarget.style.boxShadow = "var(--shadow-glow-red)"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)";    e.currentTarget.style.boxShadow = "none"; }}>

      {/* Badge de descuento — esquina superior izquierda */}
      {pct > 0 && (
        <div style={{
          position: "absolute", top: 10, left: 10, zIndex: 2,
          background: "var(--brand-red)", color: "#fff",
          font: "800 14px/1 var(--font-display)", padding: "5px 10px", borderRadius: 8,
          letterSpacing: "-0.02em",
        }}>
          −{pct}%
        </div>
      )}

      {/* Fav */}
      <button
        onClick={e => { e.stopPropagation(); onFav(product); }}
        style={{ position: "absolute", top: 10, right: 10, zIndex: 2, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Icon name="heart" size={14} fill={fav} style={fav ? { color: "var(--brand-red)" } : {}}/>
      </button>

      {/* Imagen */}
      <div
        onClick={() => onOpen(product)}
        style={{ cursor: "pointer", padding: "32px 24px 16px", background: "linear-gradient(180deg,#0c0c0f 0%,#050506 100%)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160 }}>
        <ProductImg shape={product.shape} size={120} imageUrl={product.imageUrl}/>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ font: "600 11px/1 var(--font-sans)", color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: ".08em" }}>
          {product.brand} · {CAT_LABELS[product.cat] || product.cat}
        </div>

        <div onClick={() => onOpen(product)}
          style={{ font: "700 15px/1.2 var(--font-sans)", cursor: "pointer", letterSpacing: "-0.02em" }}>
          {product.name}
        </div>

        {/* Precios */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
          <span style={{ font: "800 20px/1 var(--font-display)", letterSpacing: "-0.03em" }}>
            ${product.price.toLocaleString("en-US")}
          </span>
          {product.was && (
            <span style={{ font: "400 13px/1 var(--font-sans)", color: "var(--fg-3)", textDecoration: "line-through" }}>
              ${product.was.toLocaleString("en-US")}
            </span>
          )}
        </div>

        {/* Ahorro destacado */}
        {save > 0 && (
          <div style={{ font: "600 12px/1 var(--font-sans)", color: "var(--brand-red)" }}>
            Ahorras ${save.toLocaleString("en-US")} USD
          </div>
        )}

        {/* Stock */}
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 2 }}>
          {isOut
            ? <span style={{ color: "var(--fg-3)" }}>Agotado</span>
            : product.stock === "low"
              ? <span style={{ color: "#f59e0b" }}>⚠ Quedan solo {product.stockN}</span>
              : <><span className="lt-live"/>&nbsp;En stock · envío 24h</>}
        </div>

        {/* CTA */}
        <button
          disabled={isOut}
          onClick={() => onAdd(product, 1)}
          style={{
            marginTop: 6, height: 38, borderRadius: 8, border: 0, cursor: isOut ? "not-allowed" : "pointer",
            background: isOut ? "var(--surface-2)" : "var(--brand-red)", color: isOut ? "var(--fg-3)" : "#fff",
            font: "700 13px/1 var(--font-sans)", transition: "opacity .18s",
            opacity: isOut ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!isOut) e.currentTarget.style.opacity = ".85"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}>
          {isOut ? "Agotado" : "Añadir al carrito"}
        </button>
      </div>
    </div>
  );
}

// ── Pantalla principal de ofertas ─────────────────────────────────────────────
function OffersScreen({ products, onAdd, onOpen, favs, onFav }) {
  const { useState } = React;

  const [filterCat,   setFilterCat]   = useState("all");
  const [filterBrand, setFilterBrand] = useState([]);
  const [sort,        setSort]        = useState("pct");   // pct | low | high | new

  // Solo productos con oferta
  const offerProds = (products || []).filter(isOffer);

  // Categorías presentes en las ofertas (con conteo)
  const catsInOffers = ["all", "perif", "comp", "setup"].filter(id =>
    id === "all" || offerProds.some(p => p.cat === id)
  );

  // Marcas presentes en las ofertas del cat seleccionado
  const brandsInOffers = [...new Set(
    offerProds.filter(p => filterCat === "all" || p.cat === filterCat).map(p => p.brand).filter(Boolean)
  )].sort();

  const toggleBrand = (b) => setFilterBrand(prev => {
    const s = new Set(prev);
    s.has(b) ? s.delete(b) : s.add(b);
    return Array.from(s);
  });

  // Filtrado + ordenamiento
  const list = offerProds
    .filter(p => {
      if (filterCat !== "all" && p.cat !== filterCat) return false;
      if (filterBrand.length > 0 && !filterBrand.includes(p.brand)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "pct")  return discountPct(b) - discountPct(a);
      if (sort === "low")  return (a.price || 0) - (b.price || 0);
      if (sort === "high") return (b.price || 0) - (a.price || 0);
      if (sort === "new") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return 0;
    });

  // Descuento máximo y ahorro total posible (para el hero)
  const maxPct   = offerProds.reduce((m, p) => Math.max(m, discountPct(p)), 0);
  const totalSave = list.reduce((s, p) => s + savings(p), 0);

  return (
    <section className="lt-section" style={{ paddingTop: 0 }}>

      {/* ── Hero banner ── */}
      <div className="lt-offers-hero">
        <div className="lt-offers-hero-inner">
          <div className="lt-section-eyebrow">
            <span className="lt-live"/> Ofertas activas ahora
          </div>
          <h1 style={{ font: "900 clamp(48px, 8vw, 96px)/0.9 var(--font-display)", letterSpacing: "-0.05em", marginTop: 16 }}>
            Hasta <span style={{ color: "var(--brand-red)" }}>−{maxPct}%</span><br/>de descuento
          </h1>
          <p style={{ font: "400 17px/1.5 var(--font-sans)", color: "var(--fg-2)", marginTop: 16, maxWidth: 520 }}>
            Precios rebajados en periféricos, componentes y setups completos. Stock limitado.
          </p>
          <div className="lt-offers-kpi">
            <div>
              <div className="lt-offers-kpi-val">{offerProds.length}</div>
              <div className="lt-offers-kpi-lbl">productos en oferta</div>
            </div>
            {totalSave > 0 && (
              <div>
                <div className="lt-offers-kpi-val" style={{ color: "var(--fg)" }}>${totalSave.toLocaleString("en-US")}</div>
                <div className="lt-offers-kpi-lbl">en ahorros (vista actual)</div>
              </div>
            )}
            <div>
              <div className="lt-offers-kpi-val">{maxPct}%</div>
              <div className="lt-offers-kpi-lbl">descuento máximo</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenido principal ── */}
      <div className="lt-section-inner" style={{ paddingTop: 36, paddingBottom: 64 }}>

        {/* ── Filtros de categoría (pills) ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
          {catsInOffers.map(id => {
            const count = id === "all" ? offerProds.length : offerProds.filter(p => p.cat === id).length;
            const active = filterCat === id;
            return (
              <button key={id} onClick={() => { setFilterCat(id); setFilterBrand([]); }}
                style={{
                  height: 36, padding: "0 16px", borderRadius: 999, cursor: "pointer",
                  font: "600 13px/1 var(--font-sans)",
                  border: `1px solid ${active ? "var(--brand-red)" : "var(--border)"}`,
                  background: active ? "var(--brand-red)" : "var(--surface)",
                  color: active ? "#fff" : "var(--fg-2)",
                  transition: "all .18s var(--ease-out)",
                }}>
                {CAT_LABELS[id]} <span style={{ opacity: 0.75, fontSize: 11, marginLeft: 4 }}>({count})</span>
              </button>
            );
          })}
        </div>

        {offerProds.length === 0 ? (
          /* Estado vacío global */
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--fg-3)" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏷️</div>
            <div style={{ font: "700 18px/1.3 var(--font-sans)", color: "var(--fg-2)", marginBottom: 8 }}>
              No hay ofertas activas
            </div>
            <div style={{ fontSize: 14 }}>
              Activa el campo "En oferta" en el panel de empleados para que los productos aparezcan aquí.
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 32, alignItems: "flex-start" }}>

            {/* ── Sidebar de marcas ── */}
            <aside style={{ position: "sticky", top: 80, alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Marcas */}
              {brandsInOffers.length > 0 && (
                <div>
                  <h6 style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>Marca</h6>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {brandsInOffers.map(b => {
                      const active = filterBrand.includes(b);
                      const count  = offerProds.filter(p => (filterCat === "all" || p.cat === filterCat) && p.brand === b).length;
                      return (
                        <a key={b} onClick={() => toggleBrand(b)}
                          style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 10px", borderRadius: 6, cursor: "pointer", fontSize: 13,
                            fontWeight: active ? 600 : 400,
                            color: active ? "var(--fg)" : "var(--fg-2)",
                            background: active ? "rgb(239 43 43 / 0.1)" : "transparent",
                            borderLeft: active ? "2px solid var(--brand-red)" : "2px solid transparent",
                            transition: "all .15s var(--ease-out)",
                          }}
                          onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgb(239 43 43 / 0.06)"; e.currentTarget.style.color = "var(--fg)"; }}}
                          onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--fg-2)"; }}}>
                          <span>{b}</span>
                          <span style={{ color: "var(--fg-3)", fontFamily: "var(--font-mono)", fontSize: 11 }}>{count}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rango de descuento (informativo) */}
              <div style={{ padding: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ font: "600 11px/1 var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: 10 }}>
                  Descuento
                </div>
                {[10, 20, 30].map(min => {
                  const count = offerProds.filter(p =>
                    (filterCat === "all" || p.cat === filterCat) && discountPct(p) >= min
                  ).length;
                  return (
                    <div key={min} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 12, color: "var(--fg-2)", borderBottom: "1px solid var(--border-subtle)" }}>
                      <span>+{min}% off</span>
                      <span className="lt-mono" style={{ fontSize: 11, color: "var(--fg-3)" }}>{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Limpiar filtros */}
              {filterBrand.length > 0 && (
                <button onClick={() => setFilterBrand([])}
                  style={{ height: 36, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--fg-2)", font: "600 12px/1 var(--font-sans)", cursor: "pointer" }}>
                  Limpiar filtros ×
                </button>
              )}
            </aside>

            {/* ── Área principal ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Barra de controles */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <span style={{ color: "var(--fg-2)", fontSize: 13 }}>
                  <span className="lt-mono" style={{ color: "var(--fg)", fontWeight: 600 }}>{list.length}</span> oferta{list.length !== 1 ? "s" : ""}
                  {filterBrand.length > 0 && (
                    <span style={{ marginLeft: 8, color: "var(--fg-3)" }}>· {filterBrand.join(", ")}</span>
                  )}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="lt-overline" style={{ color: "var(--fg-3)" }}>Ordenar</span>
                  <select value={sort} onChange={e => setSort(e.target.value)}
                    style={{ background: "var(--surface-2)", color: "var(--fg)", border: "1px solid var(--border)", borderRadius: 8, height: 34, padding: "0 10px", font: "500 13px/1 var(--font-sans)" }}>
                    <option value="pct">Mayor descuento</option>
                    <option value="low">Precio: menor a mayor</option>
                    <option value="high">Precio: mayor a menor</option>
                    <option value="new">Más recientes</option>
                  </select>
                </div>
              </div>

              {/* Grid de ofertas */}
              {list.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, animation: "lt-fade-in .2s ease" }}>
                  {list.map(p => (
                    <OfferCard key={p.id} product={p} onAdd={onAdd} onOpen={onOpen}
                      fav={favs ? favs.has(p.id) : false} onFav={onFav}/>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 64, textAlign: "center", border: "1px dashed var(--border)", borderRadius: 12, color: "var(--fg-3)", background: "var(--surface)" }}>
                  <div style={{ font: "600 14px/1.4 var(--font-sans)", color: "var(--fg-2)", marginBottom: 6 }}>Sin resultados</div>
                  <div style={{ fontSize: 13 }}>Prueba con otra marca o cambia la categoría.</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

window.OffersScreen = OffersScreen;
