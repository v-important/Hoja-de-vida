# Life Tech Design System — Project Context

## Stack
- React 18 via CDN + Babel Standalone (NO build step, NO npm in JSX files)
- Express server (Node.js) en `server/` — puerto 3001
- CSS tokens en `colors_and_type.css`, estilos storefront en `ui_kits/storefront/storefront.css`
- Admin panel en `admin/`

## Design Context

### Users
Mixto: gamers competitivos (18-28, FPS/MOBA), entusiastas de setups (estética + performance), y creators/streamers. Todos viven la tecnología como identidad. Navegan de noche desde escritorios oscuros con RGB.

### Brand Personality
**Rápida · Potente · Auténtica**

Tono directo y confiante. Como Razer pero con rojo propio: agresivo sin ser caricaturesco.

### Aesthetic Direction
- **Referencia**: razer.com — fondo muy oscuro, elementos que emergen del negro, producto al centro
- **Paleta**: negro profundo (#050506) + rojo Life Tech (#ef2b2b) como acento primario
- **Fondos**: partículas animadas sutiles + scroll reveal dramático
- **Anti-referencias**: sin glassmorphism decorativo, sin gradient-text, sin cards genéricas

### Design Principles
1. El producto es el héroe — efectos amplifican, nunca compiten
2. Movimiento con propósito — cada animación responde a acción o guía atención
3. Contraste extremo — el rojo se reserva para lo que importa
4. Velocidad percibida — transiciones 150-220ms, cero lag aparente
5. Atmósfera dark-room — oscuridad profunda, acentos que brillan
