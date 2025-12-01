# Invoice Ninja React UI Settings Reference

This document enumerates the settings areas exposed by the React UI, the tabs/sub-tabs available under each area, and the backing JSON fields or resources they mutate. Use it as a ground truth when wiring IDE assistance or API automation.

## Navigation map

The router mounts every settings page under `/settings`. Nested routes reveal the full tab/sub-tab structure, including user-only panels and admin-only company panels.【F:src/pages/settings/routes.tsx†L20-L200】

## User settings (applies to current authenticated user)

Sub-tabs are defined in `useUserDetailsTabs` and mirror the `/settings/user_details/*` routes.【F:src/pages/settings/user/common/hooks/useUserDetailsTabs.tsx†L15-L52】 Each tab edits the current `user` or its nested `company_user` pivot record.

- **Details** – Updates the user JSON object directly: `first_name`, `last_name`, `email`, `language_id`, `phone`, rich-text `signature`, and optional `custom_value1`–`custom_value4` when company custom user fields are enabled.【F:src/pages/settings/user/components/Details.tsx†L55-L142】
- **Password** – Posts current and new password to the `/api/v1/users/:id` endpoint (see `components/Password.tsx`) to rotate credentials for the logged-in user. Fields: `current_password`, `password`, `password_confirmation` (payload shape is `{ password, password_confirmation }`).【F:src/pages/settings/user/components/Password.tsx†L56-L137】
- **OAuth Mail / Connect** – Lets hosted users connect Google/Microsoft mailboxes. Form drives an OAuth redirect rather than persisting fields; the tab simply exposes provider buttons.【F:src/pages/settings/user/components/Connect.tsx†L22-L94】
- **Enable two factor** – Drives the 2FA enrollment modal flow. It toggles the boolean `google_2fa_secret` state on the user record and validates phone verification when SMS is configured.【F:src/pages/settings/user/components/TwoFactorAuthentication.tsx†L37-L155】
- **Accent color** – Writes the per-user UI theme color to `company_user.react_settings.accent_color` and optionally toggles `react_settings.dark_mode`. The color picker persists through `updateUser` alongside other user changes.【F:src/pages/settings/user/components/AccentColor.tsx†L26-L120】
- **Notifications** – Manipulates `company_user.notifications.email` (array of event keys) and `user_logged_in_notification` boolean on the user JSON. Includes “all records/owned by user/custom” presets plus per-event select inputs and a `task_assigned` toggle preserved even when presets change.【F:src/pages/settings/user/components/Notifications.tsx†L36-L214】
- **Custom fields** – Renders company-defined `user` custom fields using `<UserCustomField>`; values map to `custom_value1`–`custom_value4` on the user resource.【F:src/pages/settings/user/components/CustomFields.tsx†L28-L118】
- **Preferences** – Stores UI-only preferences on the pivot: `company_user.react_settings` booleans for `show_unpaid_invoices`, `enable_markdown`, `enable_list_splashes`, `dark_mode`, `square_margins`, `show_pdf_preview`, `color_theme`, plus `default_company_id`. These values are serialized back to the user payload on save.【F:src/pages/settings/user/components/Preferences.tsx†L53-L169】

## Company settings (admin/group/client level)

Tabs come from `useCompanyDetailsTabs` and change based on whether group/client override is active. They all save into the `company.settings` object unless noted.【F:src/pages/settings/company/common/hooks/useCompanyDetailsTabs.tsx†L24-L48】

- **Details** – Core identity fields: `settings.name`, `settings.id_number`, `settings.vat_number`, `settings.website`, `settings.email`, `settings.phone`. Swiss-specific extras surface when `country_id` is Switzerland: `settings.qr_iban`, `settings.besr_id`. Classification and up to four `settings.custom_value#` fields are shown when company-level settings are active.【F:src/pages/settings/company/components/Details.tsx†L60-L215】【F:src/pages/settings/company/components/Details.tsx†L273-L330】
- **Address** – Physical address block persisted to `settings.address1`, `settings.address2`, `settings.city`, `settings.state`, `settings.postal_code`, `settings.country_id`. Also provides `shipping_address1/2`, `shipping_city`, `shipping_state`, `shipping_postal_code`, `shipping_country_id` for shipping defaults, plus contact name/phone/email overrides (`settings.contact_first_name`, `settings.contact_last_name`, `settings.phone`, `settings.email`).【F:src/pages/settings/company/components/Address.tsx†L66-L215】
- **Logo** – Upload/delete logo stored under the company resource (`logo` attribute). The uploader posts multipart data to `/api/v1/companies/:id` and shows existing image metadata via `company.logo`.【F:src/pages/settings/company/components/Logo.tsx†L40-L139】
- **Defaults** – Controls invoice/estimate defaults on `company.settings`: `payment_terms`, `valid_until`, `invoice_taxes`, `client_note`, `terms`, `footer`, `public_notes`, `private_notes`, `auto_bill`, `default_task_rate`, `send_reminders` toggles, and module-specific flags like `show_shipping_address` or `task_number_pattern` depending on enabled modules.【F:src/pages/settings/company/components/Defaults.tsx†L55-L240】
- **Documents** – Lists company-level uploaded documents via `useDocumentsQuery` with `companyDocuments=true`; deletion removes records through `/api/v1/documents/:id`. No form fields, but part of the tab set for file attachments.【F:src/pages/settings/company/components/Documents.tsx†L26-L126】
- **Custom fields** – Presents company-level custom field labels stored in `company.custom_fields` (keys `company1`–`company4`). Editing these fields updates the company object, and downstream entity forms pick up the labels/values via `settings.custom_value#`.【F:src/pages/settings/company/components/CustomFields.tsx†L28-L131】

## Localization

`LocalizationSettings` writes regional defaults into `company.settings`: `currency_id`, `language_id`, `timezone_id`, `date_format_id`, `military_time`, and `first_day_of_week`. It also toggles `show_currency_code`, `swap_currency_symbol`, and `exchange_rate` precision options, all saved through `updateChanges('company', 'settings.*')`. Custom labels are a separate sub-tab that edits `company.settings.custom_labels` map values for UI text overrides.【F:src/pages/settings/localization/components/Settings.tsx†L91-L200】【F:src/pages/settings/localization/components/CustomLabels.tsx†L34-L170】

## Product, task, and expense settings

These single-page settings write module-specific flags into `company.settings`.

- **Product settings** – Booleans for `track_inventory`, `show_product_quantity`, `convert_products`, `update_products`, `enable_product_cost`, `fill_products`, `enable_product_discount`, and number-format options (`default_tax_rate_id`, `product_profit_percentage`, `product_cost_rate`, etc.), all namespaced under `settings.*`. Defaults also include `expense_product_visibility` and `update_products`.【F:src/pages/settings/products/components/Settings.tsx†L49-L225】
- **Task settings** – Fields under `settings`: `default_task_rate`, `track_task_hours`, `show_tasks_table`, `auto_start_tasks`, `invoice_task_datapoints`, `invoice_task_delimiter`, `create_task_project`, plus `settings.custom_value1`–`custom_value4` for task custom fields when defined.【F:src/pages/settings/task-settings/components/Settings.tsx†L46-L214】
- **Expense settings** – Controls `settings.auto_bill`, `expense_number_pattern`, `expense_number_counter`, `should_show_billing_field`, `should_show_vendor` plus per-entity custom values `settings.custom_value1`–`custom_value4` for expenses. Also exposes `settings.mark_paid` and `settings.convert_products` toggles.【F:src/pages/settings/expense-settings/components/Settings.tsx†L48-L220】

## Workflow settings

Workflow toggles live under `company.settings`: e.g., `lock_invoices`, `auto_start_tasks`, `enforce_clients_to_enter_vat`, `fill_products`, `auto_archive_invoice`, `auto_archive_quote`, `auto_email_invoice`, `auto_email_quote`, `auto_archive_recurring`, and similar flags for credits and purchase orders. They determine automation behaviors during entity lifecycle events.【F:src/pages/settings/workflow-settings/WorkflowSettings.tsx†L50-L214】

## Numbering (Generated Numbers)

Each sub-tab sets numbering patterns and counters for a specific entity type by updating `company.settings.<entity>_number_pattern` and `<entity>_number_counter`. Tabs exist for clients, invoices, recurring invoices, payments, quotes, credits, projects, tasks, vendors, purchase orders, expenses, and recurring expenses.【F:src/pages/settings/generated-numbers/components/Settings.tsx†L41-L166】【F:src/pages/settings/generated-numbers/routes.tsx†L15-L45】

## Client portal

The portal section uses multiple sub-tabs, all persisting to `company.settings`:
- **Settings** – `portal_mode`, `enable_portal_password`, `enable_portal_registration`, `enable_client_portal_tasks`, document visibility flags, and `portal_design_id` selection.【F:src/pages/settings/client-portal/pages/Settings.tsx†L40-L210】
- **Authorization** – Login/2FA behaviors: `portal_2fa`, `portal_phone`, `portal_email`, `portal_allow_without_password`, and `portal_auto_redirect` booleans.【F:src/pages/settings/client-portal/pages/Authorization.tsx†L38-L154】
- **Registration** – Fields controlling signup: `portal_registration`, `portal_invoice_required_for_payment`, `portal_payment_terms`, and email verification requirements (`portal_client_email_verification`).【F:src/pages/settings/client-portal/pages/Registration.tsx†L33-L176】
- **Messages** – Customizable text snippets mapped to `settings.email_subject_invoice`, `settings.email_body_invoice`, and similar message templates per entity type (invoice, quote, credit, etc.).【F:src/pages/settings/client-portal/pages/Messages.tsx†L44-L242】
- **Customize** – Theme and layout tweaks like `portal_primary_color`, `portal_font`, `portal_button_style`, logo upload `portal_logo`, and `portal_header`. Saved into `company.settings` for the portal renderer.【F:src/pages/settings/client-portal/pages/Customize.tsx†L38-L210】

## Email settings

Single tab editing outbound email configuration on `company.settings`: `reply_to_email`, `bcc_email`, `email_style`, `email_subject_invoice`/`email_template_invoice` defaults, `email_sending_method` (Gmail, Mailgun, Postmark, etc.), SMTP fields (`mail_host`, `mail_port`, `mail_username`, `mail_password`, `mail_encryption`), and `postmark_secret`. Supports per-template attachments toggles. Values persist through the standard company save pipeline.【F:src/pages/settings/email-settings/EmailSettings.tsx†L42-L260】

## Templates and reminders

Combines reminder schedules and template bodies per entity. Reminder scheduling fields live under `company.settings` (e.g., `schedule_reminder1`–`reminder3`, `reminder_send_email`, `reminder_send_sms`). Template editors bind to `settings.email_subject_*` and `settings.email_template_*` keys for invoices, quotes, credits, and reminders. SMS template fields (`sms_template_invoice`, etc.) are also included.【F:src/pages/settings/templates-and-reminders/TemplatesAndReminders.tsx†L54-L278】

## Taxes

- **Tax settings** – Default tax rate application flags stored in `company.settings`: `inclusive_taxes`, `calculate_taxes`, `separate_invoice_tax`, `item_tax_rates`. Also exposes default country state fields for tax calculations.【F:src/pages/settings/tax-settings/TaxSettings.tsx†L49-L182】
- **Tax rates** – CRUD screens manage `tax_rates` resources with fields `name`, `rate`, `is_amount` and optional `company_id`. Create/edit components bind directly to these properties before POST/PUT requests.【F:src/pages/settings/tax-rates/components/Create.tsx†L51-L140】【F:src/pages/settings/tax-rates/components/Edit.tsx†L54-L145】

## Account management & modules

Account Management routes cover plan selection, module enablement, security, and referral settings. They primarily call account-level endpoints rather than `company.settings`:
- **Enabled modules** toggles `enabled_modules` bitmask on the company via `/api/v1/companies/:id` updates.【F:src/pages/settings/account-management/pages/EnabledModules.tsx†L41-L128】
- **Security settings** flips organization-level flags `enable_two_factor`, `enable_brute_force_protection`, and `require_password_with_social_login` on the account/company object.【F:src/pages/settings/account-management/pages/SecuritySettings.tsx†L33-L149】
- **Danger zone** exposes deletion/cancellation actions that hit `/api/v1/accounts/:id` with destructive intents.【F:src/pages/settings/account-management/pages/DangerZone.tsx†L33-L108】

## Import/export and backups

- **Import/Export** – Provides CSV/JSON import helpers and export triggers; actions invoke `/api/v1/import` and `/api/v1/export` endpoints without persistent form fields beyond file uploads and map selections.【F:src/pages/settings/import-export/index/ImportExport.tsx†L24-L120】
- **Backup/Restore** – Backup tab triggers `/api/v1/self-update/backup` while Restore uploads files to `/api/v1/self-update/restore`. Both are action-driven, not persistent settings.【F:src/pages/settings/backup-restore/CompanyBackup.tsx†L25-L112】【F:src/pages/settings/backup-restore/CompanyRestore.tsx†L27-L134】

## Custom fields

Custom field editor tabs (`company`, `clients`, `products`, `invoices`, `payments`, `projects`, `tasks`, `vendors`, `expenses`, `users`) map label values into `company.custom_fields` keyed by entity (e.g., `company.custom_fields.client1`). These labels control which `custom_value#` columns appear on corresponding entities; no direct `settings` keys are used beyond labels.【F:src/pages/settings/custom-fields/CustomFields.tsx†L32-L154】

## Online payments, gateways, and bank accounts

- **Online payments** – Central place to enable/disable the client payment flow: toggles like `accept_online_payments`, `use_credits_payment`, `lock_online_payment_methods` stored under `company.settings`. Also lists configured gateways with links into Gateway edit pages.【F:src/pages/settings/online-payments/OnlinePayments.tsx†L34-L176】
- **Gateways** – CRUD for payment gateway records (Stripe, PayPal, etc.) with fields `name`, `provider`, `config` JSON, fees (`fixed_fee`, `variable_fee`), `is_test`, and availability toggles. Saved to `/api/v1/payment_gateway_tokens` or `/api/v1/payment_gateways` depending on provider.【F:src/pages/settings/gateways/components/Create.tsx†L48-L178】【F:src/pages/settings/gateways/components/Edit.tsx†L53-L192】
- **Bank accounts** – CRUD under `/settings/bank_accounts` for entity `bank_accounts` with fields `bank_name`, `bank_account_type`, `routing_number`, `account_number`, `currency_id`, `connect_gateway_id`, and linkage to transaction rules. Edit/create forms bind directly to these properties before POST/PUT.【F:src/pages/settings/bank-accounts/components/BankAccountForm.tsx†L35-L210】
- **Transaction rules** – Sub-route manages `transaction_rules` with match conditions (`vendor`, `description`, `amount`, `category`) and actions (assign vendor/category). Stored as rule records via `/api/v1/bank_transactions/create-rule`.【F:src/pages/settings/bank-accounts/transaction-rules/TransactionRuleForm.tsx†L38-L198】

## Portals, subscriptions, and automation

- **Subscriptions** – CRUD for hosted subscription templates with fields `name`, `frequency_id`, `plan`, `product_ids`, `auto_bill`, and `is_recurring`. Persisted to `/api/v1/subscriptions` resources.【F:src/pages/settings/subscriptions/components/SubscriptionForm.tsx†L44-L236】
- **Schedules** – Automation schedules with `frequency_id`, `next_run`, `template`, `parameters` and `active` flags saved to `/api/v1/task_schedulers`. Used for auto-sending reports or invoices.【F:src/pages/settings/schedules/components/ScheduleForm.tsx†L40-L192】
- **Templates & reminders** – (already covered above) handle automated email/SMS reminders and template bodies.

## Users and groups

- **Users** – Admin CRUD for team members. Fields include `first_name`, `last_name`, `email`, `phone`, `password`, `permissions`, and `roles`. Edits are gated to enterprise plan for role management.【F:src/pages/settings/users/components/UserForm.tsx†L55-L258】
- **Group settings** – Creates group-level overrides with `name`, `settings` payload (same structure as company settings) and assigned clients. These override `company.settings` for clients assigned to the group.【F:src/pages/settings/group-settings/components/GroupSettingsForm.tsx†L36-L210】

## Miscellaneous entity settings

- **Payment terms** – CRUD for `payment_terms` with fields `name`, `num_days`, `is_locked`, `company_id`. Forms map directly to those keys for POST/PUT.【F:src/pages/settings/payment-terms/components/PaymentTermForm.tsx†L31-L164】
- **Task statuses** – Manages `task_statuses` entities with fields `name`, `color`, `status_order`, and `is_default`. Stored via `/api/v1/task_statuses`.【F:src/pages/settings/task-statuses/components/TaskStatusForm.tsx†L26-L148】
- **Expense categories** – Fields `name`, `category_type`, `should_be_excluded`, and custom rate fields saved as `expense_categories` resources.【F:src/pages/settings/expense-categories/components/ExpenseCategoryForm.tsx†L30-L166】
- **Product categories/tax rates/integrations** – Additional CRUD pages follow the same pattern: form inputs bind to resource properties, then POST/PUT to the corresponding `/api/v1/*` endpoints defined in their components (see `integrations/api-tokens`, `api-webhooks`, `analytics` for specific payload shapes).

## Workflow for saving

Most settings pages wrap their content in the shared `Settings` layout, which handles Save/Cancel buttons and dispatches updates to the `companyUsers` redux slice before issuing PUT requests to `/api/v1/companies/:id`. User-specific pages similarly inject changes into the `user` slice and PUT to `/api/v1/users/:id`, optionally cascading company updates when admins change cross-cutting preferences.【F:src/pages/settings/company/CompanyDetails.tsx†L18-L45】【F:src/pages/settings/user/UserDetails.tsx†L75-L143】

