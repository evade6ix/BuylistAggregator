const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

const SUPPORTED_PRODUCT_LINES = [
  "Magic: the Gathering",
  "Pokemon",
  "One Piece",
  "Lorcana",
  "Gundam",
  "Pokemon Japanese",
  "Digimon",
  "Star Wars: Unlimited",
  "Weiss",
  "Vanguard",
  "Riftbound"
];

const DEFAULT_PRODUCT_LINE = "Pokemon";

const STORES = [
  {
    key: "game3",
    name: "Game 3",
    baseUrl: "https://game3.ca/",
    buylistUrl: "https://buylist.game3.ca/retailer/buylist",
    searchBase: "https://buylist.game3.ca/saas/search",
    storeId: "8pay5REPhG",
    cookie: `_shopify_y=f9730bff-492d-4e4c-bb94-d1327b173cf2; _scid=cIei383Z9uElLxTdgPdoFjScbl9HtiAR; _scida=A-l9Vb6JuyEBBPuKZcUYsiD_OdYwOtmv; _ga_23SYW9WKX9=GS2.1.s1758612118$o95$g1$t1758613046$j60$l0$h0; _ga=GA1.1.1776853013.1754455337; _sctr=1%7C1758081600000; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; _ga_92HGEE92F2=GS2.1.s1756783896$o1$g1$t1756783924$j32$l0$h0; _scid_r=jgei383Z9uElLxTdgPdoFjScbl9HtiARS-9-YCxpfVW-ibshAQT7imXFGLIg_znW_7dq7CC9KD8; _scsrid_r=; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4yAQQAc5Sf9/ic/DFYOhTPjOa02QrjLbNTtM6a/Mqd7qTNSLQ=; buylist_lang_8pay5REPhG=en; bga-buylist-cart-8pay5REPhG=1775629735376-0.4553598948460782; _shopify_s=4829ab8c-a3c4-49a2-87df-73b87e96a4a5`
  },
  {
    key: "401",
    name: "401 Games",
    baseUrl: "https://store.401games.ca/",
    buylistUrl: "https://buylist.401games.ca/retailer/buylist",
    searchBase: "https://buylist.401games.ca/saas/search",
    storeId: "USYSFNJ9bg",
    cookie: `_shopify_y=6bcdfe8e-4fb8-4a16-8f24-b17a4cad6bb4; _ga_YJ8YZMP5L3=GS2.1.s1758612158$o35$g0$t1758613073$j60$l0$h0; _ga=GA1.1.16515922.1754527292; _ga_TTDMPT43VQ=GS2.1.s1758612158$o34$g0$t1758612158$j60$l0$h0; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; buylist_lang_USYSFNJ9bg=en; bga-buylist-cart-USYSFNJ9bg=1775630683762-0.3441541095246914; _shopify_s=aa713e43-a477-429c-b681-61a377a2a1e4`
  },
  {
    key: "taps",
    name: "Taps Games",
    baseUrl: "https://tapsgames.com/",
    buylistUrl: "https://buylist.tapsgames.com/retailer/buylist",
    searchBase: "https://buylist.tapsgames.com/saas/search",
    storeId: "afbPeXJ2EK",
    cookie: `_shopify_y=18e19fc8-453d-48c5-8c3c-f3a7089fce0c; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4yAQQAc5Sf9/ic/DFYOhTPjOa02QrjLbNTtM6a/Mqd7qTNSLQ=; buylist_lang_afbPeXJ2EK=en; bga-buylist-cart-afbPeXJ2EK=1775715847655-0.9233685950477988`
  },
  {
    key: "danireon",
    name: "Danireon",
    baseUrl: "https://danireon.com/",
    buylistUrl: "https://buylist.danireon.com/retailer/buylist",
    searchBase: "https://buylist.danireon.com/saas/search",
    storeId: "yaRBQxStq1",
    cookie: `_shopify_y=57a95c44-007d-42e6-a156-1b055fb20b97; AMP_6d4f915888=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI1MjYzMzc3ZS02NjE3LTQ3OWEtYTZiNy00MzA3ZDMyODNiMTYlMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzc1NjI4ODI0Mzc4JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTc3NTYyODgyNDM3OCUyQyUyMmxhc3RFdmVudElkJTIyJTNBMCUyQyUyMnBhZ2VDb3VudGVyJTIyJTNBMCU3RA==; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4xAQQAEc/APO0Ur49uohOWXdc1iIg2Z6I7Ty1W5laFsbBDQvQ=; buylist_lang_yaRBQxStq1=en; bga-buylist-cart-yaRBQxStq1=1775715902874-0.28825748408570195`
  },
  {
    key: "darkfox",
    name: "Dark Fox TCG",
    baseUrl: "https://darkfoxtcg.com/",
    buylistUrl: "https://buylist.darkfoxtcg.com/retailer/buylist",
    searchBase: "https://buylist.darkfoxtcg.com/saas/search",
    storeId: "EX07QSAOOS",
    cookie: `_shopify_y=efd610c2-4ea1-45ee-94eb-dc7c8f736cdf; _shopify_s=a153d2bd-2d4b-4a01-8570-1e496dc65af2; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4yAQQAc5Sf9/ic/DFYOhTPjOa02QrjLbNTtM6a/Mqd7qTNSLQ=; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; buylist_lang_EX07QSAOOS=en; bga-buylist-cart-EX07QSAOOS=1775716032232-0.7381933318204361`
  },
  {
    key: "banana",
    name: "Banana Games",
    baseUrl: "https://bananagames.ca/",
    buylistUrl: "https://buylist.bananagames.ca/retailer/buylist",
    searchBase: "https://buylist.bananagames.ca/saas/search",
    storeId: "eALAyQJ706",
    cookie: `_shopify_y=38b4d635-52d3-4f95-bb47-d5b62a44c528; _ga_NQKP44J19X=GS2.1.s1756874003$o5$g1$t1756874027$j36$l0$h0; _ga=GA1.1.1690121679.1754809732; _ga_99B448NYHC=GS2.1.s1756874003$o5$g1$t1756874017$j46$l0$h0; apt_pixel=eyJkZXZpY2VJZCI6IjE2ZDg5NzgzLTIzNDktNGQ1Zi05YzUwLTYzNjYzYWJjZmVjNSIsInVzZXJJZCI6bnVsbCwiZXZlbnRJZCI6MywibGFzdEV2ZW50VGltZSI6MTc1Njg2NzM5OTkxMCwiY2hlY2tvdXQiOnsiYnJhbmQiOiJhZnRlcnBheSJ9fQ==; amp_f24a38=sJhCaodbCIJRssqhcEZfPj...1j46na478.1j46na478.0.0.0; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; buylist_lang_eALAyQJ706=en; bga-buylist-cart-eALAyQJ706=1775716080647-0.5024013328533881; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4yAQQAc5Sf9/ic/DFYOhTPjOa02QrjLbNTtM6a/Mqd7qTNSLQ=`
  },
  {
    key: "hobbiesville",
    name: "Hobbiesville",
    baseUrl: "https://hobbiesville.com/",
    buylistUrl: "https://buylist.hobbiesville.com/retailer/buylist",
    searchBase: "https://buylist.hobbiesville.com/saas/search",
    storeId: "cGCfZUZiX0",
    cookie: `_shopify_y=5448c0e2-294b-4b3a-bfbf-f0cc92ef0ad3; _ga_H9EPT1S9ZT=GS2.1.s1758329373$o7$g0$t1758329480$j60$l0$h1513222098; _ga=GA1.1.998155989.1756505027; _ga_V7C0FZ52RW=GS2.1.s1758329373$o7$g0$t1758329373$j60$l0$h0; _attn_=eyJ1Ijoie1wiY29cIjoxNzU2NTA1MDI3MDE0LFwidW9cIjoxNzU2NTA1MDI3MDE0LFwibWFcIjoyMTkwMCxcImluXCI6ZmFsc2UsXCJ2YWxcIjpcIjhhMzc0ODMyMjkxZjQ4YTRhOTUyNTY2YThiZjVmMDQ4XCJ9In0=; __attentive_id=8a374832291f48a4a952566a8bf5f048; __attentive_cco=1756505027015; _scid=UqPaprgzEC98cHI3pKFE0I64lia8TBW5; _ttp=01K3VXQCR770ER2TD60PWA01SH_.tt.0; _clck=1gl4bit%5E2%5Efzh%5E0%5E2067; _scida=Ds1USMDiKUswOim_8MyS7wrTEMkxuXKG; ttcsid_COG40LRC77U368I7N910=1758329374804::o6HPOxFSuzT7GgtP0hcr.7.1758329374804; ttcsid=1758329374804::sc2P8iD7L26qDffJozcN.7.1758329374804; _ps_site_visit=true; _sctr=1%7C1758254400000; _scid_r=byPaprgzEC98cHI3pKFE0I64lia8TBW5b5lRMS1NVEjA4ilLMDopv_DMku8K0xDIxPsgu7u0r0A; _scsrid_r=; _ps_session_site_visit=%7B%22sessionId%22%3A%225e809b40-4b30-47d3-bd97-a09f42d7c0ca%22%2C%22startTime%22%3A1775443589415%7D; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; buylist_lang_cGCfZUZiX0=en; bga-buylist-cart-cGCfZUZiX0=1775716120286-0.5038717787036859`
  },
  {
    key: "newrealm",
    name: "New Realm Games",
    baseUrl: "https://newrealmgames.com/",
    buylistUrl: "https://buylist.newrealmgames.com/retailer/buylist",
    searchBase: "https://buylist.newrealmgames.com/saas/search",
    storeId: "ZGvDuXnHgG",
    cookie: `_shopify_y=c9131ab1-659e-420e-99b3-2e4f3fa71ab1; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; _shopify_s=3a2a2b24-e556-4bfb-86d4-a30380dcd413; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4xAQQAEc/APO0Ur49uohOWXdc1iIg2Z6I7Ty1W5laFsbBDQvQ=; buylist_lang_ZGvDuXnHgG=en; bga-buylist-cart-ZGvDuXnHgG=1775716147238-0.029819266314593862`
  },
  {
    key: "deckout",
    name: "Deck Out Gaming",
    baseUrl: "https://deckoutgaming.ca/",
    buylistUrl: "https://buylist.deckoutgaming.ca/retailer/buylist",
    searchBase: "https://buylist.deckoutgaming.ca/saas/search",
    storeId: "j44snJGh5h",
    cookie: `_shopify_y=97fae67a-ac34-4866-9112-f4a70c7255ac; _shopify_s=c31d266a-8bbe-41e1-9103-e358a00ad939; session=eyJzaG93UHJpY2VzIjp0cnVlfQ==; session.sig=RN-IAHQe8EDIW-TytodNvzV7kyU; buylist_lang_j44snJGh5h=en; bga-buylist-cart-j44snJGh5h=1775716187578-0.23179333417560188; heroku-session-affinity=Q38DAQERU3RpY2t5U2Vzc2lvbkRhdGEB/4AAAQMBBUFwcElEAQwAAQhEeW5vTmFtZQEMAAEJRHlub0NvdW50AQQAAAAM/4ACBXdlYi4xAQQAEc/APO0Ur49uohOWXdc1iIg2Z6I7Ty1W5laFsbBDQvQ=`
  }
];

app.use(express.static(path.join(__dirname, "public")));

function normalizeRequestedProductLine(input) {
  const raw = String(input || "").trim();
  if (!raw) return DEFAULT_PRODUCT_LINE;

  const match = SUPPORTED_PRODUCT_LINES.find(
    (line) => line.toLowerCase() === raw.toLowerCase()
  );

  return match || DEFAULT_PRODUCT_LINE;
}

function getBuylistReferer(store, productLine) {
  const url = new URL(store.buylistUrl);
  url.searchParams.set("product_line", productLine);
  url.searchParams.set("sort", "Relevance");
  return url.toString();
}

function normalizeText(str = "") {
  return String(str)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s/:-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFinish(finish = "") {
  const f = normalizeText(finish);

  if (f.includes("reverse")) return "reverse-holo";
  if (f.includes("holo")) return "holofoil";
  if (f.includes("foil")) return "foil";
  if (f.includes("non")) return "non-foil";

  return f || "unknown";
}

function extractCardCode(card) {
  const sources = [
    card.name,
    card.setName,
    ...(card.variants || []).map((v) => v.sku || "")
  ].filter(Boolean);

  for (const raw of sources) {
    const text = String(raw);

    const patterns = [
      /\b([A-Z]{2,6}\d{1,4})\b/i,
      /\b(\d{1,3}\/\d{1,3})\b/,
      /\b([A-Z0-9]{2,8}-[A-Z0-9]{2,8})\b/i
    ];

    for (const regex of patterns) {
      const match = text.match(regex);
      if (match) return match[1].toUpperCase();
    }
  }

  return "";
}

function buildCanonicalKey(card) {
  const productLine = normalizeText(card.productLine || "");
  const exactTitle = normalizeText(card.name || "");

  return `game:${productLine}__title:${exactTitle}`;
}

function normalizeConditionTitle(title = "") {
  const t = String(title).trim().toLowerCase();

  if (t === "nm" || t.includes("near mint")) return "Near Mint";

  if (
    t === "lp" ||
    t === "lightly played" ||
    t.includes("lightly played")
  ) return "Lightly Played";

  if (
    t === "sp" ||
    t === "slightly played" ||
    t.includes("slightly played")
  ) return "Lightly Played";

  if (t === "mp" || t.includes("moderately played")) return "Moderately Played";

  if (t === "hp" || t.includes("heavily played")) return "Heavily Played";

  if (
    t === "dmg" ||
    t === "dmg." ||
    t === "damaged" ||
    t.includes("damaged")
  ) return "Damaged";

  return String(title).trim();
}

function conditionRank(title = "") {
  const normalized = normalizeConditionTitle(title);

  if (normalized === "Near Mint") return 0;
  if (normalized === "Lightly Played") return 1;
  if (normalized === "Moderately Played") return 2;
  if (normalized === "Heavily Played") return 3;
  if (normalized === "Damaged") return 4;

  return 999;
}

function normalizeCard(item, store) {
  const variantMap = new Map();

  const retailVariants = Array.isArray(item.variant_info) ? item.variant_info : [];
  const buylistVariants = Array.isArray(item.store_pass_variant_info)
    ? item.store_pass_variant_info
    : [];

  for (const v of retailVariants) {
    const normalizedTitle = normalizeConditionTitle(v.title);

    variantMap.set(normalizedTitle, {
      title: normalizedTitle,
      retailPrice: Number(v.price || 0),
      cashPrice: 0,
      creditPrice: 0,
      finish: item.selectedFinish || "",
      sku: v.sku || "",
      inventoryQuantity: Number(v.inventory_quantity || 0)
    });
  }

  for (const v of buylistVariants) {
    const normalizedTitle = normalizeConditionTitle(v.title);

    const existing = variantMap.get(normalizedTitle) || {
      title: normalizedTitle,
      retailPrice: 0,
      cashPrice: 0,
      creditPrice: 0,
      finish: v.selected_finish || item.selectedFinish || "",
      sku: "",
      inventoryQuantity: 0
    };

    existing.cashPrice = Number(v.offer_price || 0);
    existing.creditPrice = Number(v.offer_price_credit || 0);
    existing.finish = v.selected_finish || existing.finish;

    variantMap.set(normalizedTitle, existing);
  }

  const variants = Array.from(variantMap.values()).sort((a, b) => {
    return conditionRank(a.title) - conditionRank(b.title);
  });

  const bestCash = variants.reduce((max, v) => Math.max(max, Number(v.cashPrice || 0)), 0);
  const bestCredit = variants.reduce((max, v) => Math.max(max, Number(v.creditPrice || 0)), 0);
  const bestRetail = variants.reduce((max, v) => Math.max(max, Number(v.retailPrice || 0)), 0);

  return {
    storeKey: store.key,
    storeName: store.name,
    storeBaseUrl: store.baseUrl,
    storeBuylistUrl: store.buylistUrl,

    id: item.id,
    productId: item.product_id,
    name: item.display_name || "Unknown Card",
    image: item.image_url || "",
    vendor: item.vendor || "",
    productLine: item.product_line || "",
    productType: item.productType || "",
    setName: item.product_data?.setName || "",
    rarity: item.product_data?.rarity || "",
    finish: item.selectedFinish || "",
    marketPrice: bestRetail || Number(item.price || 0),
    cashPrice: bestCash || Number(item.offer_price || 0),
    creditPrice: bestCredit || Number(item.offer_price_credit || 0),
    variants
  };
}

async function searchStore(store, query, productLine) {
  const url = new URL(store.searchBase);
  url.searchParams.set("store_id", store.storeId);
  url.searchParams.set("product_line", productLine);
  url.searchParams.set("mongo", "true");
  url.searchParams.set("sort", "Relevance");
  url.searchParams.set("buylist_products", "true");
  url.searchParams.set("ignore_is_hot_order", "true");
  url.searchParams.set("set_name", "");
  url.searchParams.set("rarity", "");
  url.searchParams.set("import_list_text", "");
  url.searchParams.set("name", query);
  url.searchParams.set("is_hot", "");
  url.searchParams.set("type_line", "");
  url.searchParams.set("color", "");
  url.searchParams.set("finish", "");
  url.searchParams.set("players", "");
  url.searchParams.set("playtime", "");
  url.searchParams.set("min_year", "");
  url.searchParams.set("max_year", "");
  url.searchParams.set("publisher", "");
  url.searchParams.set("vendor", "");
  url.searchParams.set("designer", "");
  url.searchParams.set("mechanic", "");
  url.searchParams.set("category", "");
  url.searchParams.set("tags", "");

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:149.0) Gecko/20100101 Firefox/149.0",
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": getBuylistReferer(store, productLine),
      "Cookie": store.cookie,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Priority": "u=0"
    }
  });

  const rawText = await response.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`${store.name} returned non-JSON`);
  }

  const products = Array.isArray(data.products) ? data.products : [];

  return {
    store: store.name,
    storeKey: store.key,
    status: response.status,
    count: data.count || products.length,
    products: products.map((item) => normalizeCard(item, store))
  };
}

function combineProducts(storeResults) {
  const grouped = new Map();

  for (const storeResult of storeResults) {
    for (const card of storeResult.products) {
      const key = buildCanonicalKey(card);

      if (!grouped.has(key)) {
        grouped.set(key, {
          key,
          productId: card.productId,
          name: card.name,
          image: card.image,
          setName: card.setName,
          rarity: card.rarity,
          finish: card.finish,
          productLine: card.productLine,
          cardCode: extractCardCode(card),
          stores: []
        });
      }

      const existing = grouped.get(key);

      if (!existing.image && card.image) existing.image = card.image;
      if (!existing.setName && card.setName) existing.setName = card.setName;
      if (!existing.rarity && card.rarity) existing.rarity = card.rarity;
      if (!existing.finish && card.finish) existing.finish = card.finish;
      if (!existing.productLine && card.productLine) existing.productLine = card.productLine;
      if (!existing.cardCode) existing.cardCode = extractCardCode(card);

      const alreadyExists = existing.stores.some(
  (s) =>
    s.storeKey === card.storeKey &&
    normalizeText(s.name || "") === normalizeText(card.name || "")
);

if (!alreadyExists) {
  existing.stores.push({
    storeKey: card.storeKey,
    storeName: card.storeName,
    storeBaseUrl: card.storeBaseUrl,
    storeBuylistUrl: card.storeBuylistUrl,
    productId: card.productId,
    name: card.name,
    image: card.image,
    setName: card.setName,
    rarity: card.rarity,
    finish: card.finish,
    productLine: card.productLine,
    marketPrice: card.marketPrice,
    cashPrice: card.cashPrice,
    creditPrice: card.creditPrice,
    variants: card.variants
  });
}
    }
  }

  return Array.from(grouped.values())
    .map((item) => ({
      ...item,
      buylistCount: item.stores.length
    }))
    .sort((a, b) => {
      if (b.buylistCount !== a.buylistCount) return b.buylistCount - a.buylistCount;
      return a.name.localeCompare(b.name);
    });
}

app.get("/api/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const productLine = normalizeRequestedProductLine(req.query.game);

    if (!q) {
      return res.json({
        query: "",
        game: productLine,
        supportedGames: SUPPORTED_PRODUCT_LINES,
        totalCards: 0,
        cards: [],
        stores: []
      });
    }

    const results = await Promise.all(
      STORES.map(async (store) => {
        try {
          return await searchStore(store, q, productLine);
        } catch (err) {
          return {
            store: store.name,
            storeKey: store.key,
            status: 500,
            count: 0,
            products: [],
            error: err.message
          };
        }
      })
    );

    const combined = combineProducts(results);

    res.json({
      query: q,
      game: productLine,
      supportedGames: SUPPORTED_PRODUCT_LINES,
      totalCards: combined.length,
      cards: combined,
      stores: results.map((r) => ({
        store: r.store,
        storeKey: r.storeKey,
        count: r.count,
        status: r.status,
        error: r.error || null
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Search failed",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Buylist app running on http://localhost:${PORT}`);
});