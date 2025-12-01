# Invoice Ninja React UI Settings Reference

This reference is written for automation agents (e.g., Cursor) that need explicit, step-by-step instructions. It explains exactly how to navigate to each settings screen, which components and JSON fields are involved, how tabs nest, and how the save/validation flows work so an agent can reproduce UI interactions or API calls without guessing.

> **Branch note:** This reference is maintained on the `lendrose-uplift` branch so the pull request targets the correct base instead of `main`.

## How to read and apply this guide

1. **Navigation first.** Every settings screen is reachable from `/settings`. Follow the bullet navigation instructions before invoking forms or API calls.【F:src/pages/settings/routes.tsx†L20-L200】
2. **Match the tab/sub-tab.** Tabs are usually declared in `use*Tabs` hooks; the tab name must be selected to mount the correct form component and bind to the right data slice.
3. **Use the described data model.** Each section below lists the exact JSON keys updated (e.g., `company.settings.*`, `user.*`, pivot `company_user.*`) and the endpoint hit on save. Use those keys verbatim when constructing payloads.
4. **Follow the save pipeline.** Most screens wrap content in the `Settings` layout. Pressing **Save** triggers local validation (if any), dispatches updates into Redux slices (`companyUsers` for company settings, `user` for user settings), and finally issues a PUT/POST request via the `useSave` handlers described in the component notes.【F:src/pages/settings/company/CompanyDetails.tsx†L18-L45】【F:src/pages/settings/user/UserDetails.tsx†L75-L143】
5. **Respect validation cues.** Required fields are enforced by the API; client-side validation is minimal (presence checks and email/password confirmations where noted). If a field is described as “required,” ensure the payload contains it.
6. **Keep custom fields in sync.** Entity custom field labels live on `company.custom_fields.*`; the actual values live on the entity payload (`custom_value1`–`custom_value4`). Update labels first so forms render the inputs, then set values.

## Navigation map

The router mounts every settings page under `/settings`. Nested routes reveal the full tab/sub-tab structure, including user-only panels and admin-only company panels.【F:src/pages/settings/routes.tsx†L20-L200】

## User settings (applies to current authenticated user)

Navigation: go to `/settings/user_details` then pick the sub-tab defined in `useUserDetailsTabs` (tabs mirror the `/settings/user_details/*` routes).【F:src/pages/settings/user/common/hooks/useUserDetailsTabs.tsx†L15-L52】 All saves PUT to `/api/v1/users/:id` with the edited `user` object merged with the `company_user` pivot where indicated.

- **Details** –
  - **Form layout:** inputs for `first_name`, `last_name`, `email` (required), `language_id`, `phone`, signature rich text, plus company-enabled `custom_value1`–`custom_value4`.
  - **Data model:** updates `user.*` fields directly; custom values are stored on the user resource (not on pivot).【F:src/pages/settings/user/components/Details.tsx†L55-L142】
  - **Validation:** email must be present/valid; other fields are optional unless the API rejects empties.
  - **Save behavior:** clicking **Save** triggers `useHandleSave` in `UserDetails` to PUT the merged payload; no secondary modal.【F:src/pages/settings/user/UserDetails.tsx†L75-L143】
- **Password** –
  - **Form layout:** fields `current_password`, `password`, `password_confirmation` (must match).【F:src/pages/settings/user/components/Password.tsx†L56-L137】
  - **Data model:** payload `{ current_password, password, password_confirmation }` sent to `/api/v1/users/:id`.
  - **Validation:** client ensures confirmation matches; API enforces strength.
- **OAuth Mail / Connect** –
  - **Form layout:** provider buttons for Google/Microsoft.
  - **Data model:** no persisted fields; clicking buttons triggers OAuth redirect configured in `Connect` component.【F:src/pages/settings/user/components/Connect.tsx†L22-L94】
- **Enable two factor** –
  - **Form layout:** toggle plus modal-driven QR/SMS flow.
  - **Data model:** toggles `user.google_2fa_secret` and uses verification endpoints; phone verification required when SMS is on.【F:src/pages/settings/user/components/TwoFactorAuthentication.tsx†L37-L155】
- **Accent color** –
  - **Form layout:** color picker and dark-mode checkbox.
  - **Data model:** writes to `company_user.react_settings.accent_color` and `company_user.react_settings.dark_mode`; payload merges these into the user update request.【F:src/pages/settings/user/components/AccentColor.tsx†L26-L120】
- **Notifications** –
  - **Form layout:** preset radio buttons (“all records,” “owned by user,” “custom”) plus per-event selects and `task_assigned` toggle.【F:src/pages/settings/user/components/Notifications.tsx†L36-L214】
  - **Data model:** stores `company_user.notifications.email` array and `user.user_logged_in_notification` boolean.
  - **Validation:** none client-side; ensure arrays are sent even when empty.
- **Custom fields** –
  - **Form layout:** four inputs rendered by `<UserCustomField>` if company labels exist.
  - **Data model:** values map to `user.custom_value1`–`custom_value4`; labels come from `company.custom_fields.user#`.【F:src/pages/settings/user/components/CustomFields.tsx†L28-L118】
- **Preferences** –
  - **Form layout:** toggles for `show_unpaid_invoices`, `enable_markdown`, `enable_list_splashes`, `dark_mode`, `square_margins`, `show_pdf_preview`, dropdowns for `color_theme` and `default_company_id`.
  - **Data model:** stored on `company_user.react_settings.*` and merged into the user save payload.【F:src/pages/settings/user/components/Preferences.tsx†L53-L169】

## Company settings (admin/group/client level)

Navigation: go to `/settings/company_details` (company scope), `/settings/client/:id/settings` (client override), or `/settings/group_settings/:id` (group override). Tabs are configured by `useCompanyDetailsTabs`, which hides irrelevant tabs for client/group overrides. Unless noted, fields save to `company.settings.*` then PUT to `/api/v1/companies/:id`.【F:src/pages/settings/company/common/hooks/useCompanyDetailsTabs.tsx†L24-L48】

- **Details** –
  - **Form layout:** company name, IDs (tax, VAT), website, email, phone, industry/size selectors, classification, up to four custom value inputs when allowed, and Swiss-only `qr_iban`/`besr_id` fields.【F:src/pages/settings/company/components/Details.tsx†L60-L215】【F:src/pages/settings/company/components/Details.tsx†L273-L330】
  - **Data model:** writes to `company.settings.name`, `settings.id_number`, `settings.vat_number`, `settings.website`, `settings.email`, `settings.phone`, `settings.classification`, `settings.custom_value#`, and country-dependent banking fields.
  - **Validation:** name and email should be provided; API enforces formatting for VAT/banking.
  - **Save behavior:** uses the shared `Settings` wrapper; clicking **Save** dispatches company updates and PUTs the revised `company` object.
- **Address** –
  - **Form layout:** billing address block plus shipping block and contact overrides.
  - **Data model:** billing `settings.address1/address2/city/state/postal_code/country_id`; shipping `settings.shipping_*`; contact overrides `settings.contact_first_name`, `settings.contact_last_name`, `settings.phone`, `settings.email`.【F:src/pages/settings/company/components/Address.tsx†L66-L215】
  - **Validation:** postal/zip not enforced client-side; country required for Swiss banking fields.
- **Logo** –
  - **Form layout:** file uploader with preview and delete button.
  - **Data model:** uploads multipart `logo` directly on the company resource (not inside `settings`).【F:src/pages/settings/company/components/Logo.tsx†L40-L139】
  - **Save behavior:** upload immediately POSTs/PUTs to `/api/v1/companies/:id`; no Save button gating.
- **Defaults** –
  - **Form layout:** invoice/quote/payment defaults: `payment_terms`, `valid_until`, `invoice_taxes`, `client_note`, `terms`, `footer`, `public_notes`, `private_notes`, `auto_bill`, `default_task_rate`, reminders toggles, and module-conditional flags such as `show_shipping_address`, `task_number_pattern`, or `include_shipping`.【F:src/pages/settings/company/components/Defaults.tsx†L55-L240】
  - **Data model:** all map to `company.settings.*` fields. Rates stored as numbers; toggles stored as booleans/strings per API expectations.
- **Documents** –
  - **Form layout:** list with upload/delete; no scalar fields.
  - **Data model:** uses `useDocumentsQuery` with `companyDocuments=true`; delete calls `/api/v1/documents/:id` and mutates the document list only.【F:src/pages/settings/company/components/Documents.tsx†L26-L126】
- **Custom fields** –
  - **Form layout:** four inputs for labels `company1`–`company4`.
  - **Data model:** labels stored at `company.custom_fields.company#`; downstream entity forms display values via `settings.custom_value#`.【F:src/pages/settings/company/components/CustomFields.tsx†L28-L131】

## Localization

Navigation: `/settings/localization`. Two tabs: **Localization** and **Custom Labels**. Save dispatches to the company slice then PUTs the company.

- **Localization** –
  - **Form layout:** selectors for currency, language, timezone, date format, first day of week, and toggles for `military_time`, `show_currency_code`, `swap_currency_symbol`, exchange-rate precision, and rounding settings.【F:src/pages/settings/localization/components/Settings.tsx†L91-L200】
  - **Data model:** writes to `company.settings.currency_id`, `language_id`, `timezone_id`, `date_format_id`, `military_time`, `first_day_of_week`, `show_currency_code`, `swap_currency_symbol`, and rate precision keys.
- **Custom Labels** –
  - **Form layout:** key/value inputs for UI label overrides.
  - **Data model:** stored in `company.settings.custom_labels` map, keyed by label handle (e.g., `custom_client_label1`).【F:src/pages/settings/localization/components/CustomLabels.tsx†L34-L170】

## Product, task, and expense settings

Navigation: `/settings/products`, `/settings/tasks`, `/settings/expenses`. Each is a single-tab page wrapped in the `Settings` layout; pressing **Save** persists to `company.settings` then PUTs the company.

- **Product settings** –
  - **Form layout:** inventory/visibility toggles (`track_inventory`, `show_product_quantity`, `expense_product_visibility`), auto-conversion flags (`convert_products`, `update_products`), cost/discount toggles, default tax rate selector, profit percentage fields, and number/currency formatting options.【F:src/pages/settings/products/components/Settings.tsx†L49-L225】
  - **Data model:** booleans/numbers stored on `company.settings.*` with the same names as the input IDs.
- **Task settings** –
  - **Form layout:** `default_task_rate`, `track_task_hours`, `show_tasks_table`, `auto_start_tasks`, `invoice_task_datapoints`, `invoice_task_delimiter`, `create_task_project`, and optional custom value inputs rendered when task custom labels exist.【F:src/pages/settings/task-settings/components/Settings.tsx†L46-L214】
  - **Data model:** stored on `company.settings.*`; custom values use `settings.custom_value1`–`custom_value4` for tasks.
- **Expense settings** –
  - **Form layout:** numbering pattern/counter, `auto_bill`, `mark_paid`, `convert_products`, `should_show_billing_field`, `should_show_vendor`, and expense custom value inputs when labels are present.【F:src/pages/settings/expense-settings/components/Settings.tsx†L48-L220】
  - **Data model:** writes to `company.settings.expense_number_pattern`, `expense_number_counter`, and the toggles/custom values noted above.

## Workflow settings

Navigation: `/settings/workflow_settings`. Single page, saved via the `Settings` wrapper.

- **Form layout:** grouped toggles for invoice/quote/credit/PO automation (auto-email, auto-archive), product fill/lock flags, task auto-start, and VAT enforcement. All toggles are checkboxes wired to `company.settings` keys with matching names.【F:src/pages/settings/workflow-settings/WorkflowSettings.tsx†L50-L214】
- **Data model:** all values are booleans under `company.settings.*` (e.g., `lock_invoices`, `auto_email_invoice`).

## Numbering (Generated Numbers)

Navigation: `/settings/generated_numbers` then pick the entity sub-tab (clients, invoices, recurring invoices, payments, quotes, credits, projects, tasks, vendors, purchase orders, expenses, recurring expenses). Tabs are defined in `routes.tsx` and point to the shared `Settings` component.【F:src/pages/settings/generated-numbers/routes.tsx†L15-L45】

- **Form layout:** for each entity tab, two main inputs: number pattern (string with tokens) and number counter (integer). Some tabs include padding and prefix toggles depending on entity capabilities.【F:src/pages/settings/generated-numbers/components/Settings.tsx†L41-L166】
- **Data model:** pattern stored at `company.settings.<entity>_number_pattern`; counter at `company.settings.<entity>_number_counter`. Save triggers company PUT with those keys updated.

## Client portal

Navigation: `/settings/client_portal`. Five sub-tabs; all save to `company.settings` via the shared wrapper.

- **Settings** –
  - **Form layout:** dropdown for `portal_mode`, toggles for `enable_portal_password`, `enable_portal_registration`, `enable_client_portal_tasks`, document visibility, and `portal_design_id` selector.【F:src/pages/settings/client-portal/pages/Settings.tsx†L40-L210】
  - **Data model:** keys stored exactly under `company.settings.*` as named.
- **Authorization** –
  - **Form layout:** toggles for `portal_2fa`, `portal_phone`, `portal_email`, `portal_allow_without_password`, `portal_auto_redirect` plus optional phone/email hints.【F:src/pages/settings/client-portal/pages/Authorization.tsx†L38-L154】
  - **Data model:** boolean flags under `company.settings`.
- **Registration** –
  - **Form layout:** toggles/inputs for `portal_registration`, `portal_invoice_required_for_payment`, `portal_payment_terms`, `portal_client_email_verification`, and related signup requirements.【F:src/pages/settings/client-portal/pages/Registration.tsx†L33-L176】
  - **Data model:** stored on `company.settings.*`.
- **Messages** –
  - **Form layout:** rich-text editors per entity notification (invoice, quote, credit, etc.) for subject and body; SMS body inputs too.【F:src/pages/settings/client-portal/pages/Messages.tsx†L44-L242】
  - **Data model:** maps to `settings.email_subject_*`, `settings.email_body_*`, and `settings.sms_template_*` keys.
- **Customize** –
  - **Form layout:** color picker, font selector, button style selector, logo uploader (`portal_logo`), header text area.【F:src/pages/settings/client-portal/pages/Customize.tsx†L38-L210】
  - **Data model:** `portal_primary_color`, `portal_font`, `portal_button_style`, `portal_logo`, `portal_header` stored on `company.settings`.

## Email settings

Navigation: `/settings/email_settings`. Single tab.

- **Form layout:** reply-to and BCC inputs, style selector, per-entity email subject/body defaults, sender method selector (Gmail, Mailgun, Postmark, SMTP, etc.), SMTP credential fields (`mail_host`, `mail_port`, `mail_username`, `mail_password`, `mail_encryption`), and Postmark secret. Includes attachment toggles for each template.【F:src/pages/settings/email-settings/EmailSettings.tsx†L42-L260】
- **Data model:** stored on `company.settings.*` with matching names. SMTP credentials are nested under `company.settings` (not a separate resource).
- **Validation:** email fields require valid formats; SMTP port expects numeric input; mismatched provider fields are ignored by UI when the provider toggle hides them.

## Templates and reminders

Navigation: `/settings/templates_and_reminders`. Single page with two major sections: reminders (scheduling) and templates (email/SMS bodies). Saved through the company PUT.

- **Reminder schedules** – inputs for `schedule_reminder1`–`schedule_reminder3`, `reminder_send_email`, `reminder_send_sms`, and per-reminder behavior flags. Values stored on `company.settings.*` as numbers/booleans.【F:src/pages/settings/templates-and-reminders/TemplatesAndReminders.tsx†L54-L278】
- **Templates** – editors for each entity’s subject/body (`email_subject_invoice`, `email_template_invoice`, etc.) and SMS body fields (`sms_template_invoice`, etc.). Stored on `company.settings.*` with the exact key names shown in the UI.【F:src/pages/settings/templates-and-reminders/TemplatesAndReminders.tsx†L54-L278】

## Taxes

Navigation: `/settings/tax_settings` for global flags; `/settings/tax_rates` for CRUD lists.

- **Tax settings** –
  - **Form layout:** checkboxes for `inclusive_taxes`, `calculate_taxes`, `separate_invoice_tax`, `item_tax_rates`, plus default country/state selectors when needed.【F:src/pages/settings/tax-settings/TaxSettings.tsx†L49-L182】
  - **Data model:** booleans stored under `company.settings.*`; country/state defaults also stored on `company.settings`.
- **Tax rates** –
  - **Form layout:** name, rate (numeric), `is_amount` toggle, optional company picker on enterprise.
  - **Data model:** persisted as `tax_rates` resources via POST/PUT; payload keys `name`, `rate`, `is_amount`, `company_id` (optional).【F:src/pages/settings/tax-rates/components/Create.tsx†L51-L140】【F:src/pages/settings/tax-rates/components/Edit.tsx†L54-L145】

## Account management & modules

Navigation: `/settings/account_management` tabs. These screens often call account-level endpoints rather than `company.settings`.

- **Enabled modules** – checkbox list that sets the `enabled_modules` bitmask on the company. Save uses `/api/v1/companies/:id` with `enabled_modules` integer.【F:src/pages/settings/account-management/pages/EnabledModules.tsx†L41-L128】
- **Security settings** – toggles for `enable_two_factor`, `enable_brute_force_protection`, `require_password_with_social_login`. Saves to the company/account object via PUT.【F:src/pages/settings/account-management/pages/SecuritySettings.tsx†L33-L149】
- **Danger zone** – action buttons for account/company deletion/cancellation; they call `/api/v1/accounts/:id` with destructive requests. No editable fields, but automation should avoid triggering unless explicitly instructed.【F:src/pages/settings/account-management/pages/DangerZone.tsx†L33-L108】

## Import/export and backups

Navigation: `/settings/import_export` and `/settings/backup`. These pages are action-oriented (no persistent settings keys).

- **Import/Export** – upload UI that posts CSV/JSON to `/api/v1/import` and triggers exports via `/api/v1/export`. No form fields are stored; automation should supply file payloads and confirm mapping steps if prompted.【F:src/pages/settings/import-export/index/ImportExport.tsx†L24-L120】
- **Backup/Restore** – backup button calls `/api/v1/self-update/backup`; restore uploads to `/api/v1/self-update/restore`. Ensure restore files are multipart uploads. There is no Save button; actions fire immediately.【F:src/pages/settings/backup-restore/CompanyBackup.tsx†L25-L112】【F:src/pages/settings/backup-restore/CompanyRestore.tsx†L27-L134】

## Custom fields

Navigation: `/settings/custom_fields` then choose the entity tab. Save updates the company object directly.

- **Form layout:** per-entity label inputs (usually four) shown when the entity supports custom values.
- **Data model:** labels stored under `company.custom_fields.<entity>#` (e.g., `company.custom_fields.client1`). Setting a label causes the corresponding entity forms to expose `custom_value#` inputs; the values themselves are stored on the entity resources, not here.【F:src/pages/settings/custom-fields/CustomFields.tsx†L32-L154】

## Online payments, gateways, and bank accounts

Navigation: `/settings/online_payments` for global payment toggles, `/settings/gateways` for gateway CRUD, `/settings/bank_accounts` for bank accounts and transaction rules.

- **Online payments** –
  - **Form layout:** toggles `accept_online_payments`, `use_credits_payment`, `lock_online_payment_methods`, and table listing configured gateways with edit links.【F:src/pages/settings/online-payments/OnlinePayments.tsx†L34-L176】
  - **Data model:** booleans live on `company.settings.*`; gateway list is fetched, not edited here.
- **Gateways** –
  - **Form layout:** create/edit forms include `name`, `provider`, credentials inside `config` JSON, fee settings (`fixed_fee`, `variable_fee`), test-mode toggle, and availability controls.【F:src/pages/settings/gateways/components/Create.tsx†L48-L178】【F:src/pages/settings/gateways/components/Edit.tsx†L53-L192】
  - **Data model:** saved to gateway token or gateway resources (`/api/v1/payment_gateway_tokens` or `/api/v1/payment_gateways`). Payload contains the flat fields plus nested `config`.
- **Bank accounts** –
  - **Form layout:** inputs for `bank_name`, `bank_account_type`, `routing_number`, `account_number`, `currency_id`, `connect_gateway_id`, default toggles, and linked transaction rules list.【F:src/pages/settings/bank-accounts/components/BankAccountForm.tsx†L35-L210】
  - **Data model:** persisted as `bank_accounts` resources with the listed keys via POST/PUT.
- **Transaction rules** –
  - **Form layout:** condition rows for vendor/description/amount/category plus action rows for assignment; includes test/apply buttons.【F:src/pages/settings/bank-accounts/transaction-rules/TransactionRuleForm.tsx†L38-L198】
  - **Data model:** saved through `/api/v1/bank_transactions/create-rule` with `conditions` and `actions` arrays inside the payload.

## Portals, subscriptions, and automation

Navigation: `/settings/subscriptions` for subscription templates and `/settings/schedules` for automation schedules. (Templates & reminders covered above.)

- **Subscriptions** –
  - **Form layout:** `name`, `frequency_id`, `plan`, `product_ids` multi-select, `auto_bill`, `is_recurring`, price/tax fields, and optional trial settings.【F:src/pages/settings/subscriptions/components/SubscriptionForm.tsx†L44-L236】
  - **Data model:** POST/PUT to `/api/v1/subscriptions` with the fields above; products stored as IDs array.
- **Schedules** –
  - **Form layout:** `frequency_id`, `next_run`, `template` dropdown, `parameters` JSON editor, `active` toggle.【F:src/pages/settings/schedules/components/ScheduleForm.tsx†L40-L192】
  - **Data model:** saved to `/api/v1/task_schedulers` resources using those keys.

## Users and groups

Navigation: `/settings/users` for user CRUD; `/settings/group_settings` for group overrides.

- **Users** –
  - **Form layout:** `first_name`, `last_name`, `email`, `phone`, `password` (create only), permission toggles, and role selectors (enterprise only).【F:src/pages/settings/users/components/UserForm.tsx†L55-L258】
  - **Data model:** payload fields match the form names; POST/PUT to `/api/v1/users` or `/api/v1/users/:id`.
- **Group settings** –
  - **Form layout:** group `name`, client assignment selector, and embedded `settings` editor mirroring company settings UI for overrides.【F:src/pages/settings/group-settings/components/GroupSettingsForm.tsx†L36-L210】
  - **Data model:** saves `group_settings` records with `name`, `settings` (same shape as `company.settings`), and client IDs.

## Miscellaneous entity settings

Navigation: check `/settings/payment_terms`, `/settings/task_statuses`, `/settings/expense_categories`, etc. These are CRUD lists with modal forms.

- **Payment terms** –
  - **Form layout:** `name`, `num_days`, `is_locked`, optional `company_id` selector.【F:src/pages/settings/payment-terms/components/PaymentTermForm.tsx†L31-L164】
  - **Data model:** POST/PUT to `/api/v1/payment_terms` with fields as entered.
- **Task statuses** –
  - **Form layout:** `name`, color picker, `status_order`, `is_default`.【F:src/pages/settings/task-statuses/components/TaskStatusForm.tsx†L26-L148】
  - **Data model:** saved via `/api/v1/task_statuses` resource.
- **Expense categories** –
  - **Form layout:** `name`, `category_type`, `should_be_excluded`, custom rate fields.【F:src/pages/settings/expense-categories/components/ExpenseCategoryForm.tsx†L30-L166】
  - **Data model:** POST/PUT to `/api/v1/expense_categories` with matching keys.
- **Product categories/tax rates/integrations** – other CRUD screens follow the same form-binding then POST/PUT pattern to their `/api/v1/*` endpoints (e.g., `api-tokens`, `api-webhooks`, `analytics`).

## Workflow for saving

Most settings pages wrap their content in the shared `Settings` layout, which handles Save/Cancel buttons and dispatches updates to the `companyUsers` redux slice before issuing PUT requests to `/api/v1/companies/:id`. User-specific pages similarly inject changes into the `user` slice and PUT to `/api/v1/users/:id`, optionally cascading company updates when admins change cross-cutting preferences.【F:src/pages/settings/company/CompanyDetails.tsx†L18-L45】【F:src/pages/settings/user/UserDetails.tsx†L75-L143】