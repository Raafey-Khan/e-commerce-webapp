# Shop — Mini E-commerce App

Built this for the Nua frontend assessment. React 18 + TypeScript + SCSS modules + Vite.

**Live URL:** _(will add after deploying)_

---

## How to run

Need Node 18+

```bash
git clone <repo-url>
cd e-commerce-webapp
npm install
npm run dev
```

Should open on [http://localhost:5173](http://localhost:5173)

```bash
npm run build    # prod build
npm run preview  # preview the build
```

---

## Stack choices

| Thing | Why |
|---|---|
| React 18 + hooks | spec said React, hooks keep logic clean |
| TypeScript | helps a lot with cart/variant shapes — catches stupid mistakes |
| SCSS modules | scoped styles, no runtime overhead, what the spec wanted |
| Vite | fast, just works with TS out of the box |
| React Router v6 | needed for routing + search params for variant state in URL |
| Context API + useReducer | cart state doesnt need Redux, context is enough here |

---

## Key decisions

See [DECISIONS.md](./DECISIONS.md) — covers the main architectural choices and what I'd change.

**On state:** Used Context API with useReducer instead of Zustand or Redux. Cart state is simple enough that pulling in a full state library felt like overkill. Context keeps the dep list short and the logic is all in one file.

**On variants:** Fake Store API doesnt have colour or size data so I generate it per category — clothing gets apparel sizes and colours, jewellery gets ring sizes, electronics gets storage options. Some products get a sale price too (seeded from product id).

**On localStorage:** Cart hydrates on mount before first render so there's no flash of empty state. Writes are gated behind a hydrated flag so initial load doesnt overwrite whats saved.

---

## Known issues / trade-offs

- Thumbnail strip on product detail shows the same image 3 times (API only gives one image per product)
- The async add-to-cart mock has 10% failure rate but on failure item still gets added locally — should fix this
- No pagination — API returns 20 products which is fine for now
