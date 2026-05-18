# UI Kit · Storefront

Click-thru recreation of the Life Tech e-commerce experience. All copy in Spanish, dark-mode, gamer/Gen Z register.

## Files
- `index.html` — runtime that wires every screen together with mock state (cart, favorites, route, toasts). Load this in the browser.
- `data.js` — mock catalog (`window.LT_DATA.products`) and the demo `account`. Edit here to change product copy/prices/specs.
- `components.jsx` — shared primitives: `Header`, `Footer`, `Logo`, `Button`, `Badge`, `IconBtn`, `Stars`, `ProductCard`, `ProductImg`, `ToastStack`, `Icon`. All exported on `window`.
- `home.jsx` — `HomeScreen` (hero · category strip · best sellers · IA band · components grid · trust row).
- `shop.jsx` — `ShopScreen` (left filter rail + sortable grid).
- `product.jsx` — `ProductScreen` (gallery · specs · bullets · related).
- `checkout.jsx` — `CartSheet` (slide-over from header) + `CheckoutScreen` (3-step: shipping → payment → review).
- `account.jsx` — `AccountScreen` (orders · addresses · cards · profile, with sidebar nav).
- `storefront.css` — kit-local styles for the components above. Tokens come from `../../colors_and_type.css`.

## Conventions
- Product imagery is rendered by `ProductImg` as styled SVG silhouettes (keyboard / mouse / headset / pad / ram / gpu / cpu / chair) — placeholders the user can swap for real photography.
- All icons go through `<Icon name="..."/>` (inline Lucide-style strokes baked into `ICONS` in `components.jsx`).
- Currency is rendered via `Number.toLocaleString("es-MX")`; prices are MXN.
- Cart and route state survive reload via `localStorage` (`lt_route`).

## Known gaps
- Product images are SVG silhouettes, not real photography. Provide real assets when ready.
- No real auth — `AccountScreen` always shows the demo user.
- Search bar in `Header` is decorative.
