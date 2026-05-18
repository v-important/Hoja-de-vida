// cart.jsx — Panel lateral del carrito de compras
// Props: cart, products, onClose, onQty, onCheckout, onShop

// ── Fila de producto dentro del carrito ─────────────────────────────────────
function CartLine({ line, onQty }) {
  const { p, q, id } = line;

  // Normaliza stock: soporta número (API) o strings legacy ("ok"/"low")
  const stockNum =
    typeof p.stock === "number" ? p.stock :
    p.stock === "ok"  ? 999 :
    p.stock === "low" ? (p.stockN || 3) : 0;

  const atMax = stockNum > 0 && q >= stockNum;

  return (
    <div style={{
      display: "flex", gap: 12, padding: 12,
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      transition: "border-color .15s",
    }}>

      {/* Imagen */}
      <div style={{
        width: 72, height: 72, flexShrink: 0,
        background: "linear-gradient(180deg, #0c0c0f, #050506)",
        border: "1px solid var(--border-subtle)",
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ProductImg shape={p.shape} size={64} imageUrl={p.imageUrl}/>
      </div>

      {/* Info */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, minWidth: 0 }}>
        <div style={{
          font: "600 13px/1.3 var(--font-sans)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          color: "var(--fg)",
        }}>
          {p.name}
        </div>
        <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)" }}>
          {p.brand ? `${p.brand} · ` : ""}{p.subcat}
        </div>

        {/* Aviso stock máximo */}
        {atMax && (
          <div style={{ font: "500 10px/1 var(--font-mono)", color: "var(--warning)", letterSpacing: ".04em" }}>
            ⚠ Máx. disponible: {stockNum}
          </div>
        )}

        {/* Controles de cantidad + precio */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>

          {/* Qty */}
          <div style={{
            display: "flex", alignItems: "center",
            border: "1px solid var(--border)", borderRadius: 7,
            height: 28, overflow: "hidden",
          }}>
            <button
              onClick={() => onQty(id, q - 1)}
              style={{
                width: 28, height: "100%", background: "transparent", border: 0,
                color: "var(--fg-2)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background .12s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Icon name="minus" size={11}/>
            </button>

            <span style={{
              width: 28, textAlign: "center",
              font: "700 13px/1 var(--font-mono)", color: "var(--fg)",
              borderInline: "1px solid var(--border)",
              lineHeight: "28px",
            }}>
              {q}
            </span>

            <button
              onClick={() => { if (!atMax) onQty(id, q + 1); }}
              style={{
                width: 28, height: "100%", background: "transparent", border: 0,
                color: atMax ? "var(--fg-4)" : "var(--fg-2)",
                cursor: atMax ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background .12s",
              }}
              onMouseEnter={e => { if (!atMax) e.currentTarget.style.background = "var(--surface)"; }}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Icon name="plus" size={11}/>
            </button>
          </div>

          {/* Precio línea */}
          <span style={{ font: "700 14px/1 var(--font-sans)", color: "var(--fg)" }}>
            ${((p.price || 0) * q).toLocaleString("en-US")}
          </span>
        </div>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={() => onQty(id, 0)}
        title="Eliminar del carrito"
        style={{
          background: "transparent", border: 0,
          color: "var(--fg-4)", cursor: "pointer",
          padding: "4px 2px", alignSelf: "flex-start",
          borderRadius: 6, transition: "color .15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "var(--brand-red)"}
        onMouseLeave={e => e.currentTarget.style.color = "var(--fg-4)"}
      >
        <Icon name="trash" size={14}/>
      </button>
    </div>
  );
}

// ── Estado vacío ─────────────────────────────────────────────────────────────
function CartEmpty({ onClose, onShop }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "40px 24px", gap: 16, textAlign: "center",
    }}>
      {/* Icono */}
      <div style={{
        width: 76, height: 76, borderRadius: 20,
        background: "var(--surface-2)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--fg-4)",
      }}>
        <Icon name="cart" size={32}/>
      </div>

      <div>
        <div style={{ font: "700 16px/1.2 var(--font-sans)", color: "var(--fg)", marginBottom: 8 }}>
          Tu carrito está vacío
        </div>
        <div style={{ font: "400 13px/1.5 var(--font-sans)", color: "var(--fg-3)", maxWidth: 220, margin: "0 auto" }}>
          Encuentra el hardware perfecto para tu próximo setup.
        </div>
      </div>

      <button
        onClick={() => { onClose(); onShop && onShop(); }}
        className="lt-btn lt-btn--primary"
        style={{ marginTop: 4 }}
      >
        Ir a la tienda <Icon name="arrowR" size={14}/>
      </button>

      {/* Garantías */}
      <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
        {[
          { icon: "truck",  text: "Envío gratis +$999" },
          { icon: "shield", text: "Pago seguro" },
          { icon: "zap",    text: "Soporte 24/7" },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <Icon name={icon} size={14} style={{ color: "var(--fg-4)" }}/>
            <span style={{ font: "400 10px/1 var(--font-sans)", color: "var(--fg-4)" }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel principal del carrito ──────────────────────────────────────────────
function CartSheet({ cart, products, onClose, onQty, onCheckout, onShop }) {

  const lines = (cart || [])
    .map(i => ({ ...i, p: products.find(p => p.id === i.id) }))
    .filter(l => l.p);

  const subtotal   = lines.reduce((s, l) => s + (l.p.price || 0) * l.q, 0);
  const shipping   = subtotal > 0 && subtotal < 999 ? 99 : 0;
  const total      = subtotal + shipping;
  const itemCount  = lines.reduce((n, l) => n + l.q, 0);
  const remaining  = Math.max(0, 999 - subtotal);
  const progress   = Math.min((subtotal / 999) * 100, 100);

  return (
    <>
      {/* Backdrop */}
      <div className="lt-backdrop" onClick={onClose}/>

      {/* Panel */}
      <aside className="lt-sheet" style={{ background: "#09090c" }}>

        {/* ── Header ───────────────────────────────────────────────────── */}
        <div style={{
          padding: "18px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgb(239 43 43 / 0.12)",
              color: "var(--brand-red)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="cart" size={17}/>
            </div>
            <div>
              <div style={{ font: "700 16px/1 var(--font-sans)", letterSpacing: "-0.01em" }}>
                Tu carrito
              </div>
              {itemCount > 0 && (
                <div style={{ font: "400 11px/1 var(--font-mono)", color: "var(--fg-3)", marginTop: 3 }}>
                  {itemCount} {itemCount === 1 ? "artículo" : "artículos"}
                </div>
              )}
            </div>
          </div>

          <button className="lt-icon-btn" onClick={onClose}>
            <Icon name="close" size={16}/>
          </button>
        </div>

        {/* ── Contenido ────────────────────────────────────────────────── */}
        {lines.length === 0 ? (
          <CartEmpty onClose={onClose} onShop={onShop}/>
        ) : (
          <div style={{
            flex: 1, overflowY: "auto",
            padding: "12px 16px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {lines.map(l => <CartLine key={l.id} line={l} onQty={onQty}/>)}

            {/* Barra de progreso hacia envío gratis */}
            {remaining > 0 && (
              <div style={{
                padding: "12px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10, marginTop: 4,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ font: "500 12px/1 var(--font-sans)", color: "var(--fg-3)" }}>
                    Envío gratis a partir de
                  </span>
                  <span style={{ font: "600 12px/1 var(--font-mono)", color: "var(--neon-lime)" }}>$999</span>
                </div>
                <div style={{ height: 5, background: "var(--surface-2)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${progress}%`,
                    background: "linear-gradient(90deg, var(--brand-red), var(--neon-lime))",
                    borderRadius: 999, transition: "width .4s ease",
                  }}/>
                </div>
                <div style={{ marginTop: 6, font: "400 11px/1 var(--font-mono)", color: "var(--fg-4)" }}>
                  Te faltan <strong style={{ color: "var(--fg-2)" }}>${remaining.toLocaleString("en-US")}</strong> para envío gratis 🚚
                </div>
              </div>
            )}
            {remaining === 0 && subtotal > 0 && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "10px 14px", borderRadius: 10,
                background: "rgb(182 255 60 / 0.08)",
                border: "1px solid rgb(182 255 60 / 0.25)",
              }}>
                <Icon name="truck" size={14} style={{ color: "var(--neon-lime)", flexShrink: 0 }}/>
                <span style={{ font: "500 12px/1 var(--font-sans)", color: "var(--neon-lime)" }}>
                  ¡Envío gratis aplicado! 🎉
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Footer con totales ────────────────────────────────────────── */}
        {lines.length > 0 && (
          <div style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 10,
            flexShrink: 0,
            background: "var(--surface)",
          }}>
            {/* Subtotal */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--fg-2)" }}>
              <span>Subtotal ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})</span>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--fg)" }}>
                ${subtotal.toLocaleString("en-US")}
              </span>
            </div>

            {/* Envío */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--fg-2)" }}>
              <span>Envío</span>
              {shipping === 0
                ? <span style={{ color: "var(--neon-lime)", fontWeight: 600 }}>🚚 Gratis</span>
                : <span style={{ fontFamily: "var(--font-mono)", color: "var(--fg)" }}>${shipping.toLocaleString("en-US")}</span>
              }
            </div>

            <hr style={{ border: 0, borderTop: "1px solid var(--border-subtle)", margin: "2px 0" }}/>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ font: "600 14px/1 var(--font-sans)" }}>Total</span>
              <span style={{ font: "900 28px/1 var(--font-display)", letterSpacing: "-0.03em" }}>
                ${total.toLocaleString("en-US")}
              </span>
            </div>

            {/* CTA principal */}
            <button
              onClick={onCheckout}
              className="lt-btn lt-btn--primary lt-btn--lg lt-btn--block"
            >
              Ir al checkout <Icon name="arrowR" size={16}/>
            </button>

            {/* Seguir comprando */}
            <button
              onClick={() => { onClose(); onShop && onShop(); }}
              className="lt-btn lt-btn--ghost lt-btn--block"
              style={{ height: 36, fontSize: 13 }}
            >
              Seguir comprando
            </button>

            {/* Trust */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="shield" size={12} style={{ color: "var(--fg-4)" }}/>
              <span style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-4)" }}>
                Pago 100% seguro · Apple Pay · Stripe
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

window.CartSheet = CartSheet;
