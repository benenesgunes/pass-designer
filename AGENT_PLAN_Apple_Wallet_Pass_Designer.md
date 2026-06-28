# Apple Wallet Pass Designer — Agent Development Plan

## 1. Project Overview

This project is a basic Apple Wallet pass designer built with:

- **Frontend:** Next.js
- **Backend:** Express.js
- **Pass generation:** `passkit-generator`
- **Email delivery:** Nodemailer or an email provider such as Resend, SendGrid, Mailtrap, or Ethereal
- **Storage:** Local file storage for the first version

The goal is to understand how Apple Wallet passes are created, signed, delivered, downloaded, and added to Apple Wallet.

This project does **not** include authentication, user accounts, payment, or advanced template management in the first version.

---

## 2. Core User Flow

1. User visits the website.
2. User chooses a pass type.
3. User designs the pass using form controls.
4. A live preview updates in the center of the screen.
5. User enters an email address.
6. User clicks **Generate & Send Pass**.
7. Frontend sends the final pass data to the Express backend.
8. Backend creates the pass payload.
9. Backend generates a `.pkpass` file.
10. Backend stores the file temporarily.
11. Backend emails the user a link/button.
12. User opens the email on iPhone.
13. User taps **Add to Apple Wallet**.
14. iOS downloads the `.pkpass`.
15. Apple Wallet opens and asks the user to confirm adding the pass.

---

## 3. Important Apple Wallet Notes

Real Apple Wallet passes require Apple signing certificates.

For the first development phases, generate and validate the pass data without signing. Signing can be added later after Apple Developer Program enrollment.

Required Apple values for real `.pkpass` generation:

```env
PASS_TYPE_ID=pass.com.example.walletdesigner
TEAM_ID=YOUR_APPLE_TEAM_ID
CERT_PASSWORD=optional_certificate_password
```

Required certificate files later:

```txt
backend/certs/
  signerCert.pem
  signerKey.pem
  wwdr.pem
```

Do not commit certificates or private keys to Git.

---

## 4. Suggested Monorepo Structure

```txt
wallet-pass-designer/
  README.md
  AGENT_PLAN.md
  frontend/
    app/
    components/
      designer/
      preview/
      ui/
    lib/
    types/
    public/
  backend/
    src/
      app.ts
      server.ts
      routes/
      controllers/
      services/
      validators/
      utils/
      config/
    certs/
      .gitkeep
    generated-passes/
      .gitkeep
    templates/
    package.json
    .env.example
```

---

# Phase 1 — Project Setup

## Goal

Create the base Next.js frontend and Express backend.

## Tasks

### 1.1 Create project folders

```bash
mkdir wallet-pass-designer
cd wallet-pass-designer
mkdir frontend backend
```

### 1.2 Create Next.js app

```bash
cd frontend
npx create-next-app@latest .
```

Recommended options:

```txt
TypeScript: yes
ESLint: yes
Tailwind CSS: yes
App Router: yes
src directory: optional
```

### 1.3 Create Express backend

```bash
cd ../backend
npm init -y
npm install express cors dotenv uuid nodemailer multer passkit-generator zod
npm install -D typescript ts-node-dev @types/node @types/express @types/cors
```

### 1.4 Add backend scripts

In `backend/package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### 1.5 Create backend `.env.example`

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

PASS_TYPE_ID=pass.com.example.walletdesigner
TEAM_ID=YOUR_TEAM_ID

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Wallet Pass Designer <no-reply@example.com>"
```

### 1.6 Add `.gitignore`

At root:

```gitignore
node_modules
.env
.DS_Store

backend/generated-passes/*
!backend/generated-passes/.gitkeep

backend/certs/*
!backend/certs/.gitkeep

frontend/.next
frontend/out
```

---

# Phase 2 — Shared Pass Data Model

## Goal

Define the data shape that the frontend and backend will use.

## Pass Data Shape

Create a shared conceptual model like this:

```ts
export type PassType = "generic" | "coupon" | "eventTicket" | "storeCard";

export type PassField = {
  key: string;
  label: string;
  value: string;
};

export type PassDesign = {
  passType: PassType;

  organizationName: string;
  description: string;
  logoText: string;

  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;

  primaryFields: PassField[];
  secondaryFields: PassField[];
  auxiliaryFields: PassField[];
  backFields: PassField[];

  barcode: {
    enabled: boolean;
    format: "PKBarcodeFormatQR" | "PKBarcodeFormatCode128";
    message: string;
    altText?: string;
  };

  images?: {
    logo?: string;
    icon?: string;
    strip?: string;
    thumbnail?: string;
  };
};

export type CreatePassRequest = {
  email: string;
  design: PassDesign;
};

export type CreatePassResponse = {
  success: boolean;
  passId: string;
  downloadUrl: string;
};
```

## Rules

- The frontend preview and backend generation should use the same data shape.
- The preview should not depend on the backend.
- Do not generate `.pkpass` on every input change.
- Generate only when the user clicks the submit button.

---

# Phase 3 — Frontend Layout

## Goal

Build the visual designer page.

## Layout

Use a three-column layout:

```txt
Left panel: pass type + colors + general settings
Center: live pass preview
Right panel: fields + barcode + email + submit button
```

Example:

```tsx
<div className="grid min-h-screen grid-cols-[320px_1fr_360px]">
  <aside>Design Controls</aside>
  <main>Pass Preview</main>
  <aside>Fields and Submit</aside>
</div>
```

## Pages

```txt
/
  Home page with project intro and pass type cards

/designer
  Main pass designer page
```

## Components

```txt
components/designer/
  PassTypeSelector.tsx
  ColorControls.tsx
  GeneralInfoControls.tsx
  FieldEditor.tsx
  BarcodeControls.tsx
  EmailSubmitPanel.tsx

components/preview/
  PassPreview.tsx
  GenericPassPreview.tsx
  CouponPassPreview.tsx
  EventTicketPassPreview.tsx
  StoreCardPassPreview.tsx
```

---

# Phase 4 — Live Preview Implementation

## Goal

Create a live preview that updates as the user edits the pass.

## Important Rule

The live preview is a fake visual preview built with React and CSS.

It is **not** an actual Apple Wallet render.

## State Example

```tsx
const [passData, setPassData] = useState<PassDesign>({
  passType: "generic",
  organizationName: "Demo Company",
  description: "Demo Wallet Pass",
  logoText: "Demo Pass",
  backgroundColor: "#1f2937",
  foregroundColor: "#ffffff",
  labelColor: "#d1d5db",
  primaryFields: [
    { key: "name", label: "NAME", value: "Enes" }
  ],
  secondaryFields: [
    { key: "status", label: "STATUS", value: "Active" }
  ],
  auxiliaryFields: [],
  backFields: [],
  barcode: {
    enabled: true,
    format: "PKBarcodeFormatQR",
    message: "DEMO-123456",
    altText: "DEMO-123456"
  }
});
```

## State Update Pattern

```tsx
function updatePassData<K extends keyof PassDesign>(
  key: K,
  value: PassDesign[K]
) {
  setPassData((prev) => ({
    ...prev,
    [key]: value
  }));
}
```

## Preview Component

```tsx
export function PassPreview({ passData }: { passData: PassDesign }) {
  if (passData.passType === "coupon") {
    return <CouponPassPreview passData={passData} />;
  }

  if (passData.passType === "eventTicket") {
    return <EventTicketPassPreview passData={passData} />;
  }

  if (passData.passType === "storeCard") {
    return <StoreCardPassPreview passData={passData} />;
  }

  return <GenericPassPreview passData={passData} />;
}
```

## Preview Styling Requirements

The preview should display:

- Rounded Wallet-like card
- Logo text at the top
- Organization name
- Primary fields
- Secondary fields
- Auxiliary fields
- Barcode preview section
- Dynamic colors
- Pass-type-specific layout differences

## Do Not

- Do not call the backend on every input change.
- Do not generate `.pkpass` during preview.
- Do not try to perfectly match Apple Wallet UI.
- Do not expose Apple certificates to the frontend.

---

# Phase 5 — Frontend Form Controls

## Goal

Allow users to edit every important pass property.

## General Info Controls

Fields:

```txt
Organization Name
Description
Logo Text
Pass Type
```

## Color Controls

Fields:

```txt
Background Color
Foreground Color
Label Color
```

Use color input:

```tsx
<input type="color" />
```

Convert colors to Apple-compatible format later in backend:

```txt
#1f2937 -> rgb(31, 41, 55)
```

## Field Editor

Allow editing:

```txt
Primary Fields
Secondary Fields
Auxiliary Fields
Back Fields
```

Each field has:

```txt
key
label
value
```

For V1, keep field counts limited:

```txt
Primary Fields: max 1
Secondary Fields: max 2
Auxiliary Fields: max 4
Back Fields: max 5
```

## Barcode Controls

Fields:

```txt
Enable Barcode
Barcode Format
Barcode Message
Alternative Text
```

V1 barcode formats:

```txt
PKBarcodeFormatQR
PKBarcodeFormatCode128
```

## Submit Panel

Fields:

```txt
Email
Generate & Send Pass button
Loading state
Success message
Error message
```

---

# Phase 6 — Backend API Skeleton

## Goal

Create Express endpoints.

## Endpoints

```txt
GET /health
POST /api/passes/create
GET /passes/:passId.pkpass
```

## `GET /health`

Response:

```json
{
  "success": true,
  "message": "Backend is running"
}
```

## `POST /api/passes/create`

Request:

```json
{
  "email": "user@example.com",
  "design": {
    "passType": "generic",
    "organizationName": "Demo Company",
    "description": "Demo Wallet Pass",
    "logoText": "Demo Pass",
    "backgroundColor": "#1f2937",
    "foregroundColor": "#ffffff",
    "labelColor": "#d1d5db",
    "primaryFields": [
      {
        "key": "name",
        "label": "NAME",
        "value": "Enes"
      }
    ],
    "secondaryFields": [
      {
        "key": "status",
        "label": "STATUS",
        "value": "Active"
      }
    ],
    "auxiliaryFields": [],
    "backFields": [],
    "barcode": {
      "enabled": true,
      "format": "PKBarcodeFormatQR",
      "message": "DEMO-123456",
      "altText": "DEMO-123456"
    }
  }
}
```

Response:

```json
{
  "success": true,
  "passId": "generated-id",
  "downloadUrl": "http://localhost:5000/passes/generated-id.pkpass"
}
```

## `GET /passes/:passId.pkpass`

Response headers:

```http
Content-Type: application/vnd.apple.pkpass
Content-Disposition: attachment; filename="pass.pkpass"
```

---

# Phase 7 — Validation

## Goal

Validate user input before creating a pass.

Use `zod`.

## Validate

```txt
Email is valid
Pass type is valid
Required fields exist
Colors are valid hex strings
Field arrays do not exceed limits
Field keys are unique
Barcode message is not empty when barcode is enabled
Organization name is not empty
Description is not empty
Logo text is not empty
```

## Example Validation File

```txt
backend/src/validators/pass.validator.ts
```

## Error Response Shape

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

---

# Phase 8 — Generate `pass.json`

## Goal

Convert frontend design data into Apple Wallet pass JSON.

## Required Apple Fields

Every pass requires:

```json
{
  "formatVersion": 1,
  "passTypeIdentifier": "pass.com.example.walletdesigner",
  "serialNumber": "unique-serial-number",
  "teamIdentifier": "YOUR_TEAM_ID",
  "organizationName": "Demo Company",
  "description": "Demo Wallet Pass"
}
```

## Style-Specific Root Key

Use one of these based on pass type:

```txt
generic
coupon
eventTicket
storeCard
boardingPass
```

Example:

```json
{
  "generic": {
    "primaryFields": [],
    "secondaryFields": [],
    "auxiliaryFields": [],
    "backFields": []
  }
}
```

## Backend Conversion Function

Create:

```txt
backend/src/services/passJson.service.ts
```

Function:

```ts
export function buildPassJson(design: PassDesign, serialNumber: string) {
  // Convert frontend design to valid Apple pass.json
}
```

## Color Conversion

Apple expects colors like:

```txt
rgb(31, 41, 55)
```

Frontend may send:

```txt
#1f2937
```

Create utility:

```txt
backend/src/utils/color.util.ts
```

Function:

```ts
export function hexToRgbString(hex: string): string {
  // "#1f2937" -> "rgb(31, 41, 55)"
}
```

---

# Phase 9 — Temporary Unsigned Mode

## Goal

Allow development before Apple certificates are ready.

## Behavior

If certificates are missing:

- Do not try to sign the pass.
- Still generate the pass JSON.
- Save a debug JSON file.
- Return a clear response saying signing is not configured.

Example response:

```json
{
  "success": true,
  "mode": "unsigned-debug",
  "passId": "generated-id",
  "message": "Pass JSON generated, but Apple signing is not configured yet."
}
```

## Debug Output

Save generated pass JSON here:

```txt
backend/generated-passes/debug-{passId}.json
```

This lets developers inspect pass structure before real `.pkpass` signing is added.

---

# Phase 10 — Pass Generation With `passkit-generator`

## Goal

Generate real `.pkpass` files after Apple certificates are ready.

## Required Files

```txt
backend/certs/
  signerCert.pem
  signerKey.pem
  wwdr.pem
```

## Required Environment Variables

```env
PASS_TYPE_ID=pass.com.example.walletdesigner
TEAM_ID=YOUR_TEAM_ID
CERT_PASSWORD=
```

## Service

Create:

```txt
backend/src/services/passGenerator.service.ts
```

Responsibilities:

```txt
Read certificates
Build pass JSON
Add required images
Generate .pkpass buffer
Save .pkpass to generated-passes
Return pass ID and download URL
```

## Required Pass Images

For V1, include default placeholder assets:

```txt
icon.png
icon@2x.png
logo.png
logo@2x.png
```

Store default images in:

```txt
backend/templates/default-assets/
```

Later, allow uploaded user images.

---

# Phase 11 — Email Delivery

## Goal

Send the generated pass link to the user's email.

## Service

Create:

```txt
backend/src/services/email.service.ts
```

## Email Content

Subject:

```txt
Your Apple Wallet Pass is Ready
```

Body:

```html
<h1>Your pass is ready</h1>
<p>Tap the button below on your iPhone to add it to Apple Wallet.</p>
<a href="{downloadUrl}">Add to Apple Wallet</a>
```

## Important

The button is only a normal link.

The backend route must serve the `.pkpass` file with the correct MIME type.

iOS handles opening Apple Wallet.

---

# Phase 12 — Download Route

## Goal

Allow iPhone to download `.pkpass` files.

## Route

```txt
GET /passes/:passId.pkpass
```

## Logic

1. Extract `passId`.
2. Locate file in `generated-passes`.
3. If missing, return 404.
4. Set headers:
   - `Content-Type: application/vnd.apple.pkpass`
   - `Content-Disposition: attachment; filename="pass.pkpass"`
5. Send file.

## Security

For V1, no authentication.

Still prevent path traversal:

```txt
Do not directly use user input as a file path.
Only allow safe UUID-like pass IDs.
```

---

# Phase 13 — Frontend Submit Integration

## Goal

Connect the frontend button to the backend.

## Function

Create:

```txt
frontend/lib/api.ts
```

```ts
export async function createPass(payload: CreatePassRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/passes/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Failed to create pass");
  }

  return response.json();
}
```

## UI States

Handle:

```txt
Idle
Loading
Success
Error
Unsigned debug mode
```

## Success Message

```txt
Your pass has been generated. Check your email on your iPhone.
```

## Unsigned Debug Message

```txt
Pass JSON was generated successfully, but Apple signing is not configured yet.
```

---

# Phase 14 — Image Uploads

## Goal

Allow users to upload basic pass images.

## Supported Images

```txt
logo
icon
strip
thumbnail
```

## Backend

Use `multer`.

Endpoint:

```txt
POST /api/uploads/pass-image
```

For V1, image upload is optional.

Use default images if no upload is provided.

## Constraints

Validate:

```txt
PNG only
Max file size
Correct dimensions recommended
No executable files
```

---

# Phase 15 — Local Testing

## Test Checklist

### Frontend

- Pass type switching works.
- Colors update preview instantly.
- Fields update preview instantly.
- Barcode message updates preview.
- Email input validates.
- Submit button shows loading state.

### Backend

- `GET /health` works.
- Invalid request returns validation error.
- Valid request creates debug JSON in unsigned mode.
- Signed mode creates `.pkpass`.
- Download route returns correct headers.
- Email is sent with correct download URL.

### iPhone Testing

- Open email on iPhone.
- Tap Add to Apple Wallet.
- `.pkpass` downloads.
- Wallet opens.
- User can tap Add.
- Pass appears in Wallet.

---

# Phase 16 — Deployment Notes

## Frontend

Deploy to:

```txt
Vercel
```

## Backend

Deploy to:

```txt
Render
Railway
Fly.io
```

## Important Production Notes

- Backend must be publicly accessible over HTTPS.
- Email links must use production backend URL.
- Certificate files must be stored securely as private secrets/files.
- Do not expose certificates to frontend.
- Generated passes should eventually be stored in S3, Cloudflare R2, or Supabase Storage.
- Add cleanup job for old generated passes.

---

# Phase 17 — Future Improvements

After V1 works, consider adding:

```txt
Saved templates
Template gallery
Drag-and-drop field editor
Real barcode/QR rendering in preview
Image cropping
User accounts
Persistent database
Pass update web service
Push notifications for pass updates
Multiple organizations
Public share links
Analytics
```

---

# Agent Rules

When implementing this project, agents must follow these rules:

1. Keep the project simple and educational.
2. Do not add authentication unless explicitly requested.
3. Do not introduce a database in V1.
4. Use React state for live preview.
5. Do not call the backend on every input change.
6. Do not expose Apple certificates to the frontend.
7. Keep all signing logic on the backend.
8. Use environment variables for sensitive values.
9. Keep generated files out of Git.
10. Implement phases in order.
11. Add clear comments around Apple Wallet-specific logic.
12. Prefer simple readable code over over-engineered abstractions.
13. Validate all incoming backend requests.
14. Always return consistent API responses.
15. Make the first working milestone a hardcoded or debug pass before adding advanced design features.

---

# Definition of Done for V1

V1 is complete when:

- User can open the designer.
- User can choose a pass type.
- User can edit colors and fields.
- Live preview updates instantly.
- User can submit email.
- Backend validates the request.
- Backend generates pass JSON.
- Backend can generate signed `.pkpass` once certificates are configured.
- Backend emails a download link.
- Download link serves the `.pkpass` with correct headers.
- Pass can be added to Apple Wallet on a real iPhone.
