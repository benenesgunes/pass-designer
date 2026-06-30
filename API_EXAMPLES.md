# API Examples

Backend default base URL:

```text
http://localhost:8080
```

The backend currently runs in unsigned debug mode. `POST /api/passes/create`
validates the frontend request, converts `design` into Apple Wallet
`pass.json`, and writes it to `backend/generated-passes/debug-{passId}.json`.
It does not create a signed `.pkpass` yet.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Checks that the backend is running. |
| `POST` | `/api/passes/create` | Validates a frontend pass design and writes debug `pass.json`. |
| `GET` | `/passes/:passId.pkpass` | Downloads a generated `.pkpass` file if one exists. |

## `GET /health`

Example request:

```bash
curl http://localhost:8080/health
```

Example response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

## `POST /api/passes/create`

Example request:

```bash
curl -X POST http://localhost:8080/api/passes/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "designer@example.com",
    "design": {
      "passType": "generic",
      "organizationName": "Demo Company",
      "description": "Demo Wallet Pass",
      "logoText": "Demo Pass",
      "backgroundColor": "#1f2937",
      "foregroundColor": "#ffffff",
      "labelColor": "#d1d5db",
      "headerFields": [
        { "key": "status", "label": "STATUS", "value": "Active" }
      ],
      "primaryFields": [
        { "key": "name", "label": "NAME", "value": "Enes" }
      ],
      "secondaryFields": [
        { "key": "member", "label": "MEMBER", "value": "Since 2026" }
      ],
      "auxiliaryFields": [],
      "backFields": [],
      "barcode": {
        "enabled": true,
        "format": "PKBarcodeFormatQR",
        "message": "DEMO-123456",
        "altText": "DEMO-123456"
      },
      "images": {}
    }
  }'
```

Successful response:

```json
{
  "success": true,
  "mode": "unsigned-debug",
  "passId": "65784df2-d44b-4365-aaf1-a9ccd516e079",
  "message": "Pass JSON generated, but Apple signing is not configured yet."
}
```

Generated debug file:

```text
backend/generated-passes/debug-65784df2-d44b-4365-aaf1-a9ccd516e079.json
```

Example generated `pass.json`:

```json
{
  "formatVersion": 1,
  "passTypeIdentifier": "pass.com.example.walletdesigner",
  "serialNumber": "65784df2-d44b-4365-aaf1-a9ccd516e079",
  "teamIdentifier": "YOUR_TEAM_ID",
  "organizationName": "Demo Company",
  "description": "Demo Wallet Pass",
  "logoText": "Demo Pass",
  "backgroundColor": "rgb(31, 41, 55)",
  "foregroundColor": "rgb(255, 255, 255)",
  "labelColor": "rgb(209, 213, 219)",
  "barcode": {
    "format": "PKBarcodeFormatQR",
    "message": "DEMO-123456",
    "messageEncoding": "iso-8859-1",
    "altText": "DEMO-123456"
  },
  "generic": {
    "auxiliaryFields": [],
    "backFields": [],
    "headerFields": [
      { "key": "status", "label": "STATUS", "value": "Active" }
    ],
    "primaryFields": [
      { "key": "name", "label": "NAME", "value": "Enes" }
    ],
    "secondaryFields": [
      { "key": "member", "label": "MEMBER", "value": "Since 2026" }
    ]
  }
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

Validation notes:

- `email` must be a valid email address.
- `passType` must be one of `boardingPass`, `generic`, `coupon`,
  `eventTicketStrip`, `eventTicketBackground`, or `storeCard`.
- Colors must be 6-digit hex colors such as `#1f2937`.
- Field keys must contain only letters, numbers, underscores, and hyphens.
- Field keys must be unique across all field groups.
- Barcode `format` must be `PKBarcodeFormatQR` or `PKBarcodeFormatCode128`.
- If `barcode.enabled` is `true`, `barcode.message` is required.
- Images are validated against the selected pass type, but they are not written
  into `pass.json` yet.

## `GET /passes/:passId.pkpass`

Example request:

```bash
curl -OJ http://localhost:8080/passes/65784df2-d44b-4365-aaf1-a9ccd516e079.pkpass
```

Successful response, when a `.pkpass` file exists:

```http
HTTP/1.1 200 OK
Content-Type: application/vnd.apple.pkpass
Content-Disposition: attachment; filename="pass.pkpass"
```

Not found response:

```json
{
  "success": false,
  "message": "Pass not found"
}
```

Current debug behavior:

- `POST /api/passes/create` writes `debug-{passId}.json`.
- It does not create `{passId}.pkpass`.
- Therefore, this download endpoint normally returns `404` until real `.pkpass`
  packaging and signing are implemented.

## Frontend Request To `pass.json` Conversion

Conversion starts in `createPass`:

```text
POST /api/passes/create
-> validateCreatePassRequest
-> buildPassJson(createPassRequest.design, passId)
-> saveDebugPassJsonFile(passId, passJson)
```

The generated `passId` is used as Apple Wallet `serialNumber`.

Top-level fields are mapped like this:

| Frontend request field | `pass.json` field |
| --- | --- |
| `design.organizationName` | `organizationName` |
| `design.description` | `description` |
| `design.logoText` | `logoText` |
| `design.backgroundColor` | `backgroundColor` |
| `design.foregroundColor` | `foregroundColor` |
| `design.labelColor` | `labelColor` |
| generated `passId` | `serialNumber` |
| `PASS_TYPE_ID` env value | `passTypeIdentifier` |
| `TEAM_ID` env value | `teamIdentifier` |

Color values are converted from hex to Apple-style RGB strings:

```text
#1f2937 -> rgb(31, 41, 55)
```

Pass type controls the style object key:

| Frontend `passType` | `pass.json` style key |
| --- | --- |
| `boardingPass` | `boardingPass` |
| `generic` | `generic` |
| `coupon` | `coupon` |
| `eventTicketStrip` | `eventTicket` |
| `eventTicketBackground` | `eventTicket` |
| `storeCard` | `storeCard` |

Field groups are copied into that style object:

```text
design.headerFields -> style.headerFields
design.primaryFields -> style.primaryFields
design.secondaryFields -> style.secondaryFields
design.auxiliaryFields -> style.auxiliaryFields
design.backFields -> style.backFields
```

Each frontend field:

```json
{ "key": "name", "label": "NAME", "value": "Enes" }
```

becomes the same field inside `pass.json`:

```json
{ "key": "name", "label": "NAME", "value": "Enes" }
```

Barcode conversion:

```json
{
  "enabled": true,
  "format": "PKBarcodeFormatQR",
  "message": "DEMO-123456",
  "altText": "DEMO-123456"
}
```

becomes:

```json
{
  "format": "PKBarcodeFormatQR",
  "message": "DEMO-123456",
  "messageEncoding": "iso-8859-1",
  "altText": "DEMO-123456"
}
```

If `barcode.enabled` is `false`, the `barcode` field is omitted from
`pass.json`.

Image support by pass type:

| Frontend `passType` | Accepted image keys |
| --- | --- |
| `boardingPass` | `logo`, `icon`, `footer` |
| `generic` | `logo`, `icon`, `thumbnail` |
| `coupon` | `logo`, `icon`, `strip` |
| `eventTicketStrip` | `logo`, `icon`, `strip` |
| `eventTicketBackground` | `logo`, `icon`, `background`, `thumbnail` |
| `storeCard` | `logo`, `icon`, `strip` |

Images are part of the frontend request and validation shape today. The current
backend conversion does not include them in `pass.json`; future packaging work
should place supported image files beside `pass.json` inside the `.pkpass`
bundle.
