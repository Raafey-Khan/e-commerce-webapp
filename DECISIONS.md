# DECISIONS.md

## The decision I went back and forth on URL state for variants

The spec says selected variant should be in the URL so its deep-linkable. The real question for me was how much to actually put there.

**Option A** was just store colour and size in query params (`?color=Black&size=M`). Simple, does the job, easy to read the URL. Downside is quantity isnt captured so if someone shares a link the other person always starts at qty 1.

**Option B** was also put quantity in the URL. Felt thorough but honestly quantity is more of a cart intent thing it belongs with the cart state not the URL. A link that opens with 3 pre-filled feels weird.

I went with option A. The URL should identify the variant, not carry cart intent. Quantity already lives in localStorage via the cart context so theres no data loss either way.

Trade-off I accepted: person receiving the link starts at quantity 1. Thats fine thats what product page links should do.

---

## What I'd do differently with more time

**1. The thumbnails thing.**
Fake store API only gives one image per product. I duplicated it 3 times just to have the thumbnail strip work. Its functional but obviously not ideal in a real product youd pull multiple angles from the CDN. This was the biggest visual compromise.

**2. Error handling on the add to cart.**
I added a mock async add-to-cart with 10% random failure (as per bonus spec) but on failure I still add locally and just swallow the error. Thats not honest UX. Should have shown a small toast like "couldn't add, try again" and actually blocked the state update until the call succeeded.

**3. Filtering on listing page.**
The API has clean categories mens clothing, jewelery, electronics etc. Adding a simple filter row wouldve taken maybe an hour and made the listing actually usable. Left it out because spec didnt ask but it would've been the first thing I added.

**4. Sass structure.**
Right now _variables.scss is one big flat list. On a bigger project I'd split it into tokens (raw values), semantics (named roles like $color-cta) and breakpoints separately. Would've been overkill here though so I kept it simple.
