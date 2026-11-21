# Simple Website Workflow

Use this guide when asked to build the simple website in this folder and publish it with Codex Sites. This is a task-specific guide; Codex does not automatically load it as a repository `AGENTS.md`. Ask Codex to read and follow `Research/26_11_20_SimpleWebsite/AGENTS_SimpleWebsite.md` when starting the work.

## Goal

Create a simple, responsive public website that displays the supplied graphics and lets visitors submit their name and email address. Save submissions privately so the Site owner can review and export them. Publish the finished Site on Codex Sites and provide its URL.

## Supplied Assets

- `resources/WssaLogo.png` — West Sound Soccer logo.
- `resources/Q03.png` — LEGO space model image.

Use both images as supplied on a generic demo/contact page. Preserve their aspect ratios, provide meaningful alt text, and make sure they load at desktop and mobile sizes. Do not imply that the images or page are an official WSSA service; keep the page clearly framed as a generic demo unless the user gives different branding instructions.

## Build Requirements

- Keep the page focused and easy to use on phones and desktop screens.
- Include clearly labeled, accessible fields for name and email, with appropriate browser validation and helpful error and success messages.
- Collect only name and email in the first version. Do not add unrelated personal data fields without the user's request.
- Explain next to the form that submissions are saved and reviewed by the Site owner. Make submission an explicit user action; do not submit automatically while a visitor types.
- Persist submissions in the Site's server-side D1 database. Do not use browser-local storage for submitted records.
- Never display submissions, email addresses, or export data on a public page or in client-side code.
- Add a private submissions review page with CSV export. Require ChatGPT sign-in and enforce an owner email allowlist on the server for every read and export operation. Do not rely on hiding a link or on client-side checks for authorization.
- Store the authorized owner email in a Sites runtime secret (for example, `SITE_ADMIN_EMAIL`); never commit it to source or expose it in browser code. If the email or secret setup is unavailable, finish the public page work but do not claim the review feature is secured or publish personal-data collection until it is configured and verified.
- Keep public form writes limited to the requested fields, validate and normalize them on the server, and return a generic confirmation that does not expose stored data.

## Codex Sites Workflow

1. Read the current Sites guidance and inspect this folder before building. Preserve existing work if this guide is reused later.
2. Create a new Site unless the user identifies an existing Site. Use a lightweight implementation suited to a simple form, adding server-side functionality and D1 only because persistent submissions and protected review are required.
3. Build the page, integrate both images, and implement the form, storage, and owner-only review/export flow.
4. Preview and refine the Site. Check responsive layout, image loading, field validation, successful submission, persistence, and access control before deployment.
5. Configure the owner email as a Sites runtime secret. Never put secrets in the repository, HTML, JavaScript sent to browsers, or deployment output.
6. Deploy the Site on Codex Sites. Set sharing to anyone with the link, subject to the account or workspace's available publishing options. Keep authorization checks on the review and export endpoints even though the visitor-facing Site is public.
7. Verify the deployment result and provide the literal Site URL. State clearly if an account/workspace setting or missing secret prevented public sharing or secure collection.

## Acceptance Criteria

- The published page opens from its URL for the selected audience.
- Both supplied images load with appropriate sizing and alt text.
- Visitors can submit valid names and email addresses and receive a clear confirmation; invalid input receives a useful error.
- A submission persists across sessions and is not visible to anonymous visitors.
- A signed-in visitor outside the configured owner allowlist cannot review or export submissions; the authorized owner can.
- The form explains what is saved and who can review it.
- The final response includes the deployed URL and notes any setup or verification limits.
