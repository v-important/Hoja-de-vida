// Product detail page (PDP)
function ProductScreen({ product, products, onAdd, onOpen, onBack, favs, onFav }) {
  const [qty, setQty] = React.useState(1);
  const [color, setColor] = React.useState("Negro mate");
  const related = products.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4);

  return (
    <section className="lt-section" style={{ paddingTop: 28 }}>
      <div className="lt-section-inner">
        <a onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--fg-3)", fontSize: 13, cursor: "pointer", marginBottom: 24 }}>
          <Icon name="arrowL" size={14}/> Volver a la tienda
        </a>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }}>
          <div>
            <div className="lt-pdp-img-wrap">
              <div className="lt-pdp-img-glow"/>
              <div className="lt-pdp-img-grid"/>
              <div style={{ position: "relative", zIndex: 1 }}>
                <ProductImg shape={product.shape} size={460} imageUrl={product.imageUrl}/>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ aspectRatio: "1", background: "var(--surface)", border: `1px solid ${i === 0 ? "var(--brand-red)" : "var(--border)"}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", padding: 8, cursor: "pointer" }}>
                  <ProductImg shape={product.shape} size={70} imageUrl={product.imageUrl}/>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span className="lt-overline" style={{ color: "var(--fg-3)" }}>{product.brand} · {product.subcat}</span>
              {(product.badges || []).map((b, i) => (
                <span key={i} className={"lt-badge " + (b.startsWith("−") || b === "Nuevo" ? "lt-badge--red" : "lt-badge--ghost")}>{b}</span>
              ))}
            </div>
            <h1 style={{ font: "900 44px/1 var(--font-display)", letterSpacing: "-0.04em" }}>{product.name}</h1>
            <p style={{ color: "var(--fg-2)", fontSize: 17, lineHeight: 1.5 }}>{product.tagline}</p>
            <div style={{ display: "flex", gap: 16, alignItems: "center", color: "var(--fg-2)", fontSize: 13 }}>
              <Stars rating={product.rating} reviews={product.reviews}/>
              <span style={{ color: "var(--border-strong)" }}>·</span>
              <span className="lt-mono" style={{ fontSize: 12 }}>SKU {product.sku}</span>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "8px 0" }}/>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              {product.was && <span style={{ font: "400 18px/1 var(--font-sans)", color: "var(--fg-3)", textDecoration: "line-through" }}>${product.was.toLocaleString("en-US")}</span>}
              <span style={{ font: "900 44px/1 var(--font-display)", letterSpacing: "-0.03em" }}>${product.price.toLocaleString("en-US")}</span>
              <span style={{ color: "var(--fg-3)", fontSize: 13 }}>USD</span>
              {product.save && <Badge tone="red">−{product.save}%</Badge>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--fg-2)", fontSize: 13 }}>
              {product.stock === "low"
                ? <><Badge tone="warn">Quedan solo {product.stockN}</Badge><span>· apúrate</span></>
                : <><span className="lt-live"/> En stock · envío en 24h</>}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="lt-overline" style={{ color: "var(--fg-3)" }}>Color</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["Negro mate", "Blanco glaciar", "Rojo carmín"].map(c => (
                  <span key={c} onClick={() => setColor(c)}
                    style={{
                      cursor: "pointer", padding: "8px 14px", borderRadius: 999, fontSize: 12,
                      border: `1px solid ${color === c ? "var(--brand-red)" : "var(--border)"}`,
                      background: color === c ? "rgb(239 43 43 / 0.12)" : "var(--surface)",
                      color: color === c ? "var(--fg)" : "var(--fg-2)",
                    }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0, border: "1px solid var(--border)", borderRadius: 8, height: 52, background: "var(--surface)" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: 44, height: "100%", background: "transparent", border: 0, color: "var(--fg)", cursor: "pointer" }}><Icon name="minus" size={14}/></button>
                <span className="lt-mono" style={{ width: 36, textAlign: "center", fontWeight: 600 }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ width: 44, height: "100%", background: "transparent", border: 0, color: "var(--fg)", cursor: "pointer" }}><Icon name="plus" size={14}/></button>
              </div>
              <Button variant="primary" size="lg" block onClick={() => onAdd(product, qty)}>
                Añadir al carrito · ${(product.price * qty).toLocaleString("en-US")}
              </Button>
              <button className="lt-icon-btn" style={{ width: 52, height: 52 }} onClick={() => onFav(product)}>
                <Icon name="heart" size={18} fill={favs.has(product.id)} style={favs.has(product.id) ? { color: "var(--brand-red)" } : {}}/>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 8 }}>
              <Trust icon="truck" t="Envío gratis" s="2-3 días"/>
              <Trust icon="shield" t="2 años garantía"/>
              <Trust icon="package" t="30 días devolución"/>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <h3 style={{ font: "700 24px/1.1 var(--font-sans)", letterSpacing: "-0.02em", marginBottom: 16 }}>Por qué importa</h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {(Array.isArray(product.bullets) ? product.bullets : []).map((b, i) => (
                <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ width: 24, height: 24, borderRadius: 999, background: "rgb(239 43 43 / 0.15)", color: "var(--brand-red)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", marginTop: 2 }}>
                    <Icon name="check" size={14}/>
                  </span>
                  <span style={{ color: "var(--fg-2)", lineHeight: 1.5 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ font: "700 24px/1.1 var(--font-sans)", letterSpacing: "-0.02em", marginBottom: 16 }}>Specs técnicos</h3>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              {(Array.isArray(product.specs) ? product.specs : []).map((s, i) => (
                <div key={i} style={{ display: "flex", padding: "14px 16px", borderTop: i ? "1px solid var(--border-subtle)" : "none" }}>
                  <span style={{ flex: 1, color: "var(--fg-3)", fontSize: 13 }}>{s.k}</span>
                  <span className="lt-mono" style={{ color: "var(--fg)", fontWeight: 500, fontSize: 13 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 80 }}>
          <h3 style={{ font: "700 24px/1.1 var(--font-sans)", letterSpacing: "-0.02em", marginBottom: 24 }}>También te puede gustar</h3>
          <div className="lt-grid-4">
            {related.map(p => (
              <ProductCard key={p.id} product={p} onAdd={onAdd} onOpen={onOpen} fav={favs.has(p.id)} onFav={onFav}/>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Trust({ icon, t, s }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 12, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
      <Icon name={icon} size={18} style={{ color: "var(--brand-red)" }}/>
      <div style={{ font: "600 12px/1.2 var(--font-sans)", marginTop: 4 }}>{t}</div>
      {s && <div style={{ color: "var(--fg-3)", fontSize: 11 }}>{s}</div>}
    </div>
  );
}

window.ProductScreen = ProductScreen;
