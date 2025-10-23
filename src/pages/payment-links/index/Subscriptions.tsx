/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTitle } from '$app/common/hooks/useTitle';
import { DataTable } from '$app/components/DataTable';
import { Default } from '$app/components/layouts/Default';
import { useTranslation } from 'react-i18next';
import { useSubscriptionColumns } from '../common/hooks/useSubscriptionColumns';
import { AdvancedSettingsPlanAlert } from '$app/components/AdvancedSettingsPlanAlert';

export function Subscriptions() {
  const { documentTitle } = useTitle('payment_links');

  const [t] = useTranslation();

  const columns = useSubscriptionColumns();

  const pages = [
    { name: t('payment_links'), href: '/payment_links' },
  ];

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
    >
      <AdvancedSettingsPlanAlert />

      <DataTable
        resource="payment_link"
        endpoint="/api/v1/subscriptions?sort=id|desc"
        bulkRoute="/api/v1/subscriptions/bulk"
        columns={columns}
        linkToCreate="/payment_links/create"
        linkToEdit="/payment_links/:id/edit"
        withResourcefulActions
        enableSavingFilterPreference
      />
    </Default>
  );
}
