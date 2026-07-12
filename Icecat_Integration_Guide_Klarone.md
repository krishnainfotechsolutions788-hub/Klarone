# Icecat Integration Guide for Klarone (Final)

## Goal

Integrate Icecat as the external product content provider while keeping
Klarone as the source of truth for inventory, pricing, stock, rentals,
and business logic.

## Environment Variables

``` env
ICECAT_USERNAME=
ICECAT_API_TOKEN=
ICECAT_CONTENT_TOKEN=
ICECAT_BASE_URL=https://live.icecat.biz/api
```

## Authentication

-   Send `api-token` and `content-token` as HTTP headers.
-   Required params: `lang`, `shopname`, and one identifier
    (`ProductCode+Brand`, `GTIN`, or `icecat_id`).

## Recommended Backend Routes

### GET /api/admin/icecat/search?q=

Search products and return preview cards only.

### GET /api/admin/icecat/preview/:icecatId

Use `content=essentialinfo`.

### POST /api/admin/icecat/import

Import the complete product using `content=` (empty).

### POST /api/admin/products/:id/refresh-icecat

Refresh only Icecat-owned content.

## Granular Calls

-   essentialinfo
-   title
-   marketingtext
-   gallery
-   videos
-   manuals
-   featuregroups
-   featurelogos
-   reviews
-   productstory
-   multimedia
-   reasonstobuy

Use granular calls whenever possible. Download the full datasheet only
during import.

## Klarone Owns

-   Inventory
-   Pricing
-   Orders
-   Rentals
-   Supplier data
-   Internal notes
-   Custom SEO

## Icecat Owns

-   Specifications
-   Images
-   Manuals
-   Videos
-   Marketing descriptions
-   Feature groups
-   Product stories

## Import Flow

1.  Search.
2.  Preview.
3.  Import.
4.  Map JSON.
5.  Save locally.
6.  Serve from local database.
7.  Refresh only when needed.

## Security

-   Backend only.
-   Store tokens in `.env`.
-   Cache responses.
-   Never expose tokens.
-   Log failures.
-   Retry transient errors.

## Remaining Task

Implement the official product search mechanism (Search API or XML Index
files), then connect it to `/api/admin/icecat/search`.

## Final Recommendation

Treat Icecat as a Product Information source and Klarone as the system
of record for all business data.
