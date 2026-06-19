# GeoJSON assets (required for the choropleth kit)

Add **both** files under your app’s `public/geo/` so they are served at the URLs below.

| File | Served at | Used by |
|------|-----------|---------|
| `nigeria-states.geo.json` | `/geo/nigeria-states.geo.json` | **`NigeriaStatesChoropleth`** (all states, or `focusStateSlug` zoom) |
| `nigeria-lgas.geo.json` | `/geo/nigeria-lgas.geo.json` | **`StateLGAChoropleth`** (LGAs inside one state) |

## 1. States (`nigeria-states.geo.json`)

Expected shape: `FeatureCollection` where each feature has **`properties.name`** (state name) and **`properties.code`** (optional). Slugs are derived with the same rules as `slugs.ts` (`normalizeStateName`).

**Easiest if you already have this repo:** copy from the dashboard project:

`agric-scorecard-dashboard/public/geo/nigeria-states.geo.json` → your `public/geo/nigeria-states.geo.json`.

If you obtain boundaries elsewhere, keep the same `name` field semantics so slugs match (e.g. `Lagos` → `lagos`, `Federal Capital Territory` → `fct` via the overrides in `slugs.ts`).

## 2. LGAs (`nigeria-lgas.geo.json`)

Expected shape: GADM-style fields **`NAME_1`** (state) and **`NAME_2`** (LGA).

Example download (verify license before production use):

```bash
mkdir -p public/geo
curl -sL "https://raw.githubusercontent.com/qedsoftware/geojson_data/main/nigeria-lga.geojson" \
  -o public/geo/nigeria-lgas.geo.json
```

This file is large (~10 MB). Consider CDN hosting or simplified geometries for production.

## License

Third-party boundary data may carry its own terms (e.g. GADM / OCHA). Confirm redistribution and attribution for your product.
