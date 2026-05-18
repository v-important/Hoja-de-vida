// Life Tech IA — asistente local de recomendaciones gamer (sin API key)

const LT_RESPUESTAS = {
  valorant: `🎯 **Setup para Valorant** — el rey de los FPS competitivos

**Componentes:**
• CPU: Intel Core i5-13600K (~$1.800.000 USD) — maneja 200+ FPS sin sudar
• GPU: ASUS Dual GeForce RTX 3060 (~$1.500.000 USD) — overkill para Valorant, perfecto para el futuro
• RAM: Corsair Vengeance 16GB DDR4 3200MHz (~$280.000 USD)
• Almacenamiento: Kingston NV2 SSD 500GB (~$130.000 USD)

**Periféricos:**
• Mouse: Logitech G Pro X Superlight 2 — 60g, sensor HERO 25K ideal para aim training
• Teclado: Razer BlackWidow V3 TKL — switches mecánicos, sin teclado numérico para más espacio de mouse
• Audífonos: HyperX Cloud Alpha — posicional 7.1, escuchas pasos antes de que aparezcan
• Mousepad: Corsair MM350 XL — superficie rápida para flicks

**Precio total estimado: $4.500.000 – $5.500.000 USD**
Este setup corre Valorant a 240+ FPS en low settings para máximo rendimiento competitivo.`,

  cs2: `🔫 **Setup para CS2 (Counter-Strike 2)** — precisión ante todo

**Componentes:**
• CPU: Intel Core i5-12400F (~$950.000 USD) — CS2 es muy dependiente de CPU
• GPU: MSI GeForce RTX 3060 Ti (~$1.700.000 USD)
• RAM: Corsair Vengeance 16GB DDR4 3600MHz (~$320.000 USD)
• Almacenamiento: Kingston NV2 SSD 1TB (~$200.000 USD)

**Periféricos:**
• Mouse: Logitech G303 Shroud Edition o Razer DeathAdder V3 — shape clásico para agarre palm
• Teclado: Corsair K70 RGB Pro — teclas lineales para reacción rápida
• Monitor: 24" 144Hz mínimo (idealmente 240Hz)
• Audífonos: HyperX Cloud II — posicional confiable para escuchar pasos

**Precio total estimado: $4.000.000 – $5.000.000 USD**
CS2 premia el FPS alto — apunta a 240FPS en 1080p.`,

  fortnite: `🏆 **Setup para Fortnite** — construye y elimina

**Componentes:**
• CPU: AMD Ryzen 5 5600X (~$750.000 USD) — excelente relación precio/rendimiento
• GPU: ASUS ROG Strix GeForce RTX 3060 (~$1.600.000 USD)
• RAM: ADATA XPG Lancer 16GB DDR5 (~$350.000 USD)
• Almacenamiento: Kingston NV2 SSD 500GB (~$130.000 USD)

**Periféricos:**
• Mouse: Logitech G502 X Plus inalámbrico — peso ajustable, ideal para building rápido
• Teclado: Razer Huntsman Mini — actuation ultrarrápido para edits
• Audífonos: HyperX Cloud Alpha S — surround para escuchar aterrizajes
• Mousepad: Corsair MM700 RGB XL

**Precio total estimado: $4.200.000 – $5.200.000 USD**
Corre Fortnite a 144+ FPS en calidad media-alta sin problema.`,

  minecraft: `⛏️ **Setup para Minecraft** — desde survival hasta shaders 4K

**Gama media (sin shaders):**
• CPU: Intel Core i3-12100F (~$500.000 USD) — Minecraft usa pocos núcleos pero los necesita rápidos
• GPU: ASUS GeForce GTX 1660 Super (~$900.000 USD)
• RAM: Corsair 16GB DDR4 — Minecraft + mods puede comerse 8-12GB
• Almacenamiento: Kingston SSD 500GB

**Con shaders (RTX / Complementary):**
• CPU: Intel Core i5-13400F (~$900.000 USD)
• GPU: MSI GeForce RTX 4060 (~$1.800.000 USD) — path tracing y shaders fluidos
• RAM: 32GB DDR4 si usas modpacks pesados

**Periféricos:**
• Mouse: Logitech G203 (~$130.000 USD) — simple y confiable
• Teclado: Redragon K552 mecánico (~$150.000 USD) — económico y sólido

**Precio estimado:** $2.500.000 – $4.500.000 USD según gama
¡Con shaders RTX Minecraft se ve mejor que muchos AAA!`,

  gta: `🚗 **Setup para GTA V / GTA VI** — Los Santos sin lag

**Para GTA V (optimizado):**
• CPU: AMD Ryzen 5 5600 (~$700.000 USD)
• GPU: ASUS Dual RTX 3060 12GB VRAM (~$1.500.000 USD) — GTA V usa mucha VRAM en ultra
• RAM: Corsair 16GB DDR4 3200MHz
• Almacenamiento: Kingston SSD 1TB — GTA pesa ~95GB

**Para GTA VI (preparado):**
• CPU: Intel Core i7-13700K (~$1.800.000 USD)
• GPU: MSI GeForce RTX 4070 (~$2.800.000 USD) — Rockstar promete gráficos de otra generación
• RAM: ADATA XPG 32GB DDR5
• Almacenamiento: NVMe PCIe 4.0 1TB

**Periféricos:**
• Mouse: Logitech G502 X — peso y precisión para apuntar en modo GTA Online
• Teclado: Corsair K55 RGB Pro — membrana confiable y económica

**Precio estimado GTA V:** $3.500.000 – $4.500.000 USD
**Precio estimado GTA VI:** $7.000.000 – $9.000.000 USD`,

  apex: `🔥 **Setup para Apex Legends** — movimiento y precisión

**Componentes:**
• CPU: Intel Core i5-13600KF (~$1.200.000 USD) — Apex es muy exigente con el CPU
• GPU: Gigabyte GeForce RTX 3070 (~$2.000.000 USD)
• RAM: Corsair 16GB DDR4 3600MHz — dos módulos para dual channel
• Almacenamiento: Kingston NVMe SSD 1TB

**Periféricos:**
• Mouse: Razer DeathAdder V3 — ergonómico, 59g, sensor Focus Pro 30K
• Teclado: HyperX Alloy Origins Core TKL — mecánico, compacto
• Audífonos: HyperX Cloud III — virtual surround 7.1, escuchas el Bloodhound antes de verte
• Mousepad: Redragon P036 XXL — económico y grande

**Precio total estimado: $5.500.000 – $7.000.000 USD**
Apex a 144FPS fluido en 1080p con este setup.`,

  lol: `⚔️ **Setup para League of Legends** — farm sin drops

League no necesita mucho hardware, pero el monitor y periféricos marcan la diferencia:

**Componentes (gama eficiente):**
• CPU: Intel Core i3-12100 (~$450.000 USD) — suficiente para 200+ FPS
• GPU: ASUS GeForce GT 1030 (~$350.000 USD) o integrada con Ryzen
• RAM: Kingston 16GB DDR4 (~$220.000 USD)
• Almacenamiento: Kingston SSD 240GB

**Periféricos (aquí sí invierte):**
• Mouse: Logitech G Pro Wireless — el mouse más usado en LCS
• Teclado: Razer Ornata V3 — mecha-membrana, silencioso en internet café
• Monitor: 24" 144Hz (MSI o Gigabyte) — el 144Hz se nota muchísimo en LoL
• Audífonos: HyperX Cloud Stinger 2

**Precio total estimado: $2.000.000 – $3.500.000 USD**
El secreto en LoL: 144Hz + buen mouse > tener una RTX 4090.`,

  cyberpunk: `🌆 **Setup para Cyberpunk 2077 con RTX** — Night City en full

Este es el juego más exigente del mercado. Para RTX + DLSS fluido:

**Componentes:**
• CPU: Intel Core i7-13700KF (~$1.700.000 USD)
• GPU: ASUS ROG Strix GeForce RTX 4070 Ti (~$3.500.000 USD) — necesario para RTX+path tracing
• RAM: Corsair Vengeance 32GB DDR5 5200MHz (~$600.000 USD)
• Almacenamiento: Kingston NVMe Gen4 2TB (~$500.000 USD) — el juego pesa 70GB y carga rápido

**Periféricos:**
• Mouse: Razer Basilisk V3 Pro inalámbrico
• Teclado: Corsair K100 RGB — la experiencia premium
• Audífonos: HyperX Cloud Alpha Wireless — 300 horas de batería
• Monitor: 27" QHD 165Hz para aprovechar el RTX

**Precio total estimado: $9.000.000 – $12.000.000 USD**
Con DLSS 3.5 Frame Generation vas a 60+ FPS en Ultra+RTX en 1440p.`,

  fifa: `⚽ **Setup para EA FC 25 (FIFA)** — sin input lag

EA FC no es exigente en GPU pero sí necesita buen CPU y periféricos de respuesta rápida:

**Componentes:**
• CPU: Intel Core i5-12400F (~$950.000 USD) — EA FC usa DirectX 12 y varios núcleos
• GPU: MSI GeForce RTX 3060 (~$1.500.000 USD) — 4K 60FPS cómodo
• RAM: ADATA 16GB DDR4 3200MHz
• Almacenamiento: Kingston SSD 500GB

**Periféricos:**
• Control: prefiere mando? Xbox Elite Series 2 o DualSense para máximo feel
• Si juegas con teclado: Logitech G213 — membrana rápida
• Monitor: 27" 4K 60Hz o 1080p 144Hz — elige según tu estilo
• Audífonos: HyperX Cloud Stinger 2 Core

**Precio total estimado: $3.500.000 – $4.500.000 USD**
EA FC a 4K 60FPS se ve espectacular en una pantalla grande.`,

  roblox: `🎮 **Setup para Roblox** — ligero pero disfrutable

Roblox corre en casi cualquier PC, pero un buen setup lo hace mucho más fluido:

**Componentes económicos:**
• CPU: AMD Ryzen 3 4100 (~$300.000 USD)
• GPU: ASUS GeForce GT 1030 (~$350.000 USD) o gráficos integrados
• RAM: Kingston 8GB DDR4 (~$120.000 USD) — con 16GB va mucho mejor
• Almacenamiento: Kingston SSD 240GB

**Periféricos:**
• Mouse: Logitech G203 LIGHTSYNC (~$130.000 USD) — óptico, RGB, confiable
• Teclado: Redragon K552 mecánico (~$150.000 USD)
• Audífonos: HyperX Cloud Stinger Core (~$180.000 USD)

**Precio total estimado: $1.500.000 – $2.500.000 USD**
El setup más económico que te da una experiencia fluida en Roblox y muchos juegos casuales.`,

  streaming: `🎙️ **Setup para Streaming / Contenido** — stream sin lag

Para streamear mientras juegas necesitas potencia extra de CPU o NVENC:

**Componentes:**
• CPU: Intel Core i7-13700K (~$1.800.000 USD) — suficientes núcleos para jugar + encodear
• GPU: MSI GeForce RTX 4070 (~$2.800.000 USD) — NVENC AV1 es el mejor encoder del mercado
• RAM: Corsair 32GB DDR4 3600MHz (~$480.000 USD) — streaming consume RAM extra
• Almacenamiento: Kingston NVMe 2TB para grabar VODs

**Periféricos de streaming:**
• Micrófono: HyperX QuadCast S (~$650.000 USD) — condensador, RGB, ideal para escritorio
• Cámara: Logitech C920 (~$400.000 USD) — estándar de los streamers
• Audífonos: HyperX Cloud Alpha Wireless
• Capturadora: si streameas consola, Elgato HD60 X

**Precio total estimado: $7.000.000 – $9.000.000 USD**
Con este setup streameas a 1080p60 en Twitch/YouTube sin drops de FPS.`,

  economico: `💰 **Setup Gama Baja** — máximo por tu presupuesto

Para presupuesto de $1.500.000 – $3.000.000 USD:

**Opción 1 — $2.000.000 USD aprox:**
• CPU: AMD Ryzen 5 4600G con gráficos integrados Vega (~$600.000 USD)
• RAM: ADATA 16GB DDR4 (~$220.000 USD)
• Almacenamiento: Kingston SSD 480GB (~$130.000 USD)
• No necesitas GPU dedicada — corre Minecraft, Roblox, LoL, Fortnite low

**Opción 2 — $3.000.000 USD aprox:**
• CPU: Intel Core i3-12100F (~$450.000 USD)
• GPU: ASUS GeForce GTX 1660 Super (~$900.000 USD)
• RAM: Kingston 16GB DDR4
• Almacenamiento: Kingston SSD 500GB
• Corre GTA V, Fortnite, Valorant a 60+ FPS

**Periféricos económicos:**
• Mouse: Logitech G203 (~$130.000)
• Teclado: Redragon K552 (~$150.000)
• Audífonos: HyperX Stinger Core (~$180.000)

Todo disponible en tiendas como Speed Logic Colombia. ¿Quieres que ajuste a un presupuesto específico?`,

  gama_alta: `🚀 **Setup Gama Alta** — sin compromisos

Para el jugador que quiere lo mejor ($10.000.000+ USD):

**Componentes:**
• CPU: Intel Core i9-14900K (~$2.800.000 USD) — 24 núcleos, 6GHz boost
• GPU: ASUS ROG Strix GeForce RTX 4090 (~$8.000.000 USD) — la más potente del mercado
• RAM: Corsair Dominator Platinum 64GB DDR5 6000MHz (~$1.200.000 USD)
• Almacenamiento: Kingston Fury Renegade PCIe 4.0 2TB + 4TB HDD
• Placa madre: ASUS ROG Maximus Z790 (~$1.500.000 USD)

**Periféricos premium:**
• Mouse: Razer DeathAdder V3 Pro Wireless
• Teclado: Razer BlackWidow V4 Pro — switches mecánicos mute
• Audífonos: HyperX Cloud Alpha Wireless (~$600.000)
• Monitor: 27" QHD 240Hz o 4K 144Hz
• Mousepad: Corsair MM700 RGB XL

**Precio total estimado: $16.000.000 – $20.000.000 USD**
Con este setup corres CUALQUIER juego actual en 4K ultra con ray tracing sin problema.`,

  default: `🎮 **Life Tech IA — Asesor de Setups**

No reconocí ese juego específico, pero puedo ayudarte. Cuéntame más:

**¿Qué tipo de juego es?**
• FPS competitivo (Valorant, CS2, Apex) → prioridad CPU + monitor 144Hz
• Open world / AAA (GTA VI, Cyberpunk) → prioridad GPU potente + 32GB RAM
• MOBA / Indie (LoL, Minecraft) → setup económico funciona perfecto
• Streaming al mismo tiempo → necesitas CPU fuerte + micrófono

**¿Cuál es tu presupuesto?**
• Menos de $2.500.000 USD → gama básica
• $2.500.000 – $5.000.000 → gama media, muy buen rendimiento
• $5.000.000 – $10.000.000 → gama alta, sin compromisos
• +$10.000.000 → top de línea

Escríbeme el juego o el presupuesto y te armo el setup con marcas reales como Intel, AMD, ASUS, MSI, Logitech y Corsair disponibles en Colombia. ¡Cuéntame!`
};

function detectarJuego(texto) {
  const t = texto.toLowerCase();
  if (t.match(/valorant/)) return "valorant";
  if (t.match(/\bcs2\b|counter.strike|csgo/)) return "cs2";
  if (t.match(/fortnite|fornite/)) return "fortnite";
  if (t.match(/minecraft/)) return "minecraft";
  if (t.match(/gta|grand theft/)) return "gta";
  if (t.match(/apex/)) return "apex";
  if (t.match(/league of legends|\blol\b|leage/)) return "lol";
  if (t.match(/cyberpunk/)) return "cyberpunk";
  if (t.match(/fifa|ea fc|eafc/)) return "fifa";
  if (t.match(/roblox/)) return "roblox";
  if (t.match(/stream|twitch|youtube|content|contenido/)) return "streaming";
  if (t.match(/econ[oó]mi|barato|poco presupuesto|baja gama|gama baja|$1|$2|$3|1 mill|2 mill|3 mill/)) return "economico";
  if (t.match(/gama alta|high end|tope|premium|lo mejor|sin l[ií]mite|$10|$15|$20/)) return "gama_alta";
  return "default";
}

function parsearMarkdown(texto) {
  return texto
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• /gm, '&nbsp;&nbsp;• ')
    .split('\n')
    .map((line, i) => React.createElement('span', { key: i, dangerouslySetInnerHTML: { __html: line || '&nbsp;' }, style: { display: 'block', lineHeight: 1.55 } }));
}

function ChatBotPanel({ onClose }) {
  const { useState, useEffect, useRef } = React;

  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "¡Hola gamer! 👾 Soy la IA de Life Tech. Dime qué juego quieres dominar — Valorant, GTA, Minecraft, Apex, Fortnite — y te armo el setup ideal con marcas reales y precios en USD. ¿Qué juegas?"
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setMessages(m => [...m, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const clave = detectarJuego(userText);
      const respuesta = LT_RESPUESTAS[clave];
      setMessages(m => [...m, { role: "assistant", content: respuesta }]);
      setLoading(false);
    }, 900);
  };

  const suggestions = ["Valorant", "GTA VI", "Minecraft con shaders", "Setup streaming", "Presupuesto $3M"];

  return (
    <>
      {/* Backdrop fijo — oscurece el fondo sin cerrarse al hacer click */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 299,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(3px)",
        pointerEvents: "none",
      }}/>

      {/* Panel lateral fijo — siempre visible hasta cerrar */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: 440,
        height: "100vh",
        zIndex: 300,
        background: "#0e0e12",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
        animation: "lt-slide-in .28s var(--ease-out)",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 12,
          background: "linear-gradient(135deg, #0e0e12, #15151a)",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgb(34 211 238 / 0.14)", color: "var(--neon-cyan)",
            display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
          }}>
            <Icon name="ai" size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: "700 14px/1 var(--font-sans)", color: "var(--neon-cyan)" }}>Life Tech IA</div>
            <div style={{ font: "400 11px/1 var(--font-sans)", color: "var(--fg-3)", marginTop: 4 }}>
              Asesor de setups gamer · disponible 24/7
            </div>
          </div>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: "var(--fg-3)", cursor: "pointer",
              padding: 6, borderRadius: 6, display: "flex", alignItems: "center" }}>
            <Icon name="close" size={18}/>
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 8 }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 26, height: 26, borderRadius: 6, flex: "none", marginTop: 2,
                  background: "rgb(34 211 238 / 0.12)", color: "var(--neon-cyan)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="ai" size={13}/>
                </div>
              )}
              <div style={{
                maxWidth: "80%",
                padding: "10px 14px",
                borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                background: m.role === "user"
                  ? "linear-gradient(135deg, var(--brand-red), #c91f1f)"
                  : "var(--surface)",
                color: "var(--fg)",
                font: "400 13px/1.55 var(--font-sans)",
                border: m.role === "user" ? "none" : "1px solid var(--border)",
              }}>
                {m.role === "assistant" ? parsearMarkdown(m.content) : m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6, flex: "none",
                background: "rgb(34 211 238 / 0.12)", color: "var(--neon-cyan)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="ai" size={13}/>
              </div>
              <div style={{
                padding: "12px 16px", borderRadius: "4px 16px 16px 16px",
                background: "var(--surface)", border: "1px solid var(--border)",
                display: "flex", gap: 5, alignItems: "center",
              }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "var(--neon-cyan)",
                    animation: `lt-dot-bounce .9s ease-in-out ${i * 0.18}s infinite`,
                    display: "inline-block",
                  }}/>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Suggestions */}
        {messages.length === 1 && !loading && (
          <div style={{ padding: "0 20px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {suggestions.map(s => (
              <button key={s} onClick={() => setInput(s)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 999, padding: "5px 12px",
                  font: "500 11px/1 var(--font-sans)", color: "var(--fg-2)",
                  cursor: "pointer", transition: "all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--neon-cyan)"; e.currentTarget.style.color = "var(--fg)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-2)"; }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <input className="lt-input"
            placeholder="¿Para qué juego necesitas setup?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send()}
            disabled={loading}
            style={{ flex: 1, fontSize: 13 }}
          />
          <button className="lt-btn lt-btn--primary"
            onClick={send} disabled={loading || !input.trim()}
            style={{ height: 40, padding: "0 16px", flex: "none" }}>
            <Icon name="arrowR" size={15}/>
          </button>
        </div>

        {/* Footer */}
        <div style={{ padding: "8px 20px 14px", textAlign: "center" }}>
          <button onClick={() => setMessages([messages[0]])}
            style={{ background: "none", border: "none", color: "var(--fg-3)", font: "400 10px/1 var(--font-sans)", cursor: "pointer" }}>
            🔄 Nueva consulta
          </button>
        </div>
      </div>
    </>
  );
}

window.ChatBotPanel = ChatBotPanel;
