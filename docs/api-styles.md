# Scryfall API Guide: Pauper Format

This document focuses exclusively on using the Scryfall API to build Magic: The Gathering tools centered on the Pauper format. Pauper is a Constructed format where only cards printed at common rarity are legal. You'll learn how to query card legality, filter by rarity, and retrieve Pauper-specific data.


## Base Configuration

* **Base URL:** `https://api.scryfall.com`
* **No authentication required.**
* **Rate Limits:** 100 requests per 10 seconds per IP.

  * Respect `Retry-After` header on HTTP 429.

---

## Pauper Search Queries

All Pauper queries combine legality and rarity filters. Use the `/cards/search` endpoint with `q` parameters:

* **Base pauper filter:** `q=legal:paper+format:pauper`
* **Common-only filter:** `+rarity:common`

### Fetch All Pauper-Legal Cards

```http
GET /cards/search?q=legal:paper+format:pauper
```

* Returns cards legal in Pauper (includes commons, uncommons, etc. printed at common).
* **Pagination:** Use `has_more` and `next_page` for additional pages.

### Limit to Common Rarity

```http
GET /cards/search?q=legal:paper+format:pauper+rarity:common
```

* Ensures only common cards are returned (true Pauper staples).

### Search by Color or Type

Combine with color/type filters:

```http
GET /cards/search?q=legal:paper+format:pauper+rarity:common+color:red+type:creature
```

* Example: list all red common creatures legal in Pauper.

### Search by Mana Cost or Set

Filter mana value or set codes:

```http
GET /cards/search?q=legal:paper+format:pauper+rarity:common+cmc<=2+set:lea
```

* Example: common Pauper cards with CMC ≤ 2 from Limited Edition Alpha (`lea`).

---

## Fetching Specific Pauper Cards

### Exact Name Lookup

```http
GET /cards/named?exact=<card%20name>&format=pauper
```

* Use `exact` or `fuzzy` specifying `format=pauper` to ensure Pauper legality.

```js
fetch('https://api.scryfall.com/cards/named?exact=Counterspell&format=pauper')
  .then(r => r.json())
```

### Random Pauper Card

```http
GET /cards/random?q=legal:paper+format:pauper+rarity:common
```

* Retrieves a random Pauper staple common.

---

## Card Data & Images

* **Fields of interest:** `id`, `name`, `mana_cost`, `type_line`, `oracle_text`, `set_name`, `rarity`, `legalities`, `prices`, `image_uris`.
* **Image URLs:** use `image_uris.normal` or request specific versions:

  ```http
  ```

GET /cards/search?q=legal\:paper+format\:pauper+rarity\:common\&unique=prints

````

- Append `format=image&version=large` for high-res images:
  ```js
card.image_uris.large
````

---

## Bulk Data for Pauper Sets

For offline builds or caching, download bulk data and filter locally:

```http
GET /bulk-data
```

* Identify the `default_cards` file URL, download JSON, and filter:

```js
const allCards = require('./default-cards.json');
const pauperCommons = allCards.filter(
  c => c.rarity === 'common' && c.legalities.pauper === 'legal'
);
```

* Update bulk data weekly to capture new printings.

---

## Error Handling & Rate Limits

* Check response `ok` status; on 429, parse `Retry-After` header:

```js
if (!res.ok) {
  if (res.status === 429) {
    const wait = parseInt(res.headers.get('Retry-After'), 10) * 1000;
    await new Promise(r => setTimeout(r, wait));
    return fetch(res.url);
  }
  throw new Error(`Scryfall Error ${res.status}`);
}
```

---

## Example: Pauper Deck Builder Helper

```ts
import fetch from 'node-fetch';

export async function listPauperCommonsByColor(color: string) {
  const query = `legal:paper+format:pauper+rarity:common+color:${color}`;
  const url = `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const json = await res.json();
  return json.data; // array of card objects
}
```


*Use these patterns to efficiently source Pauper format card data in your applications.*
