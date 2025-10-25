/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useCurrentSettingsLevel } from '$app/common/hooks/useCurrentSettingsLevel';
import { GatewaysTable } from '../common/components/GatewaysTable';
import { useTitle } from '$app/common/hooks/useTitle';
import { Settings } from '$app/components/layouts/Settings';
import { useTranslation } from 'react-i18next';

export const STRIPE_CONNECT = 'd14dd26a47cecc30fdd65700bfb67b34';
export function Gateways() {
  const { isGroupSettingsActive, isClientSettingsActive } =
    useCurrentSettingsLevel();

  useTitle('gateways');
  const [t] = useTranslation();

  const pages = [
    { name: t('settings'), href: '/settings' },
    { name: t('gateways'), href: '/settings/gateways' },
  ];

  return (
    <Settings
      title={t('gateways')}
      breadcrumbs={pages}
      docsLink="/docs/advanced-settings/#gateways"
    >
      <GatewaysTable
        includeRemoveAction={isGroupSettingsActive || isClientSettingsActive}
        includeResetAction={isGroupSettingsActive || isClientSettingsActive}
      />
    </Settings>
  );
}
