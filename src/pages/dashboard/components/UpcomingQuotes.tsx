/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useFormatMoney } from '$app/common/hooks/money/useFormatMoney';
import { DataTable, DataTableColumns } from '$app/components/DataTable';
import { route } from '$app/common/helpers/route';
import { Card } from '$app/components/cards';
import { Quote } from '$app/common/interfaces/quote';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { Badge } from '$app/components/Badge';
import { useDisableNavigation } from '$app/common/hooks/useDisableNavigation';
import { DynamicLink } from '$app/components/DynamicLink';
import { useColorScheme } from '$app/common/colors';
import { ArrowUp } from '$app/components/icons/ArrowUp';
import { ArrowDown } from '$app/components/icons/ArrowDown';
import { CalendarCheckOut } from '$app/components/icons/CalendarCheckOut';

export function UpcomingQuotes() {
  const [t] = useTranslation();

  const colors = useColorScheme();

  const formatMoney = useFormatMoney();
  const disableNavigation = useDisableNavigation();

  const columns: DataTableColumns<Quote> = [
    {
      id: 'number',
      label: t('number'),
      format: (value, quote) => (
        <DynamicLink
          to={route('/quotes/:id/edit', { id: quote.id })}
          renderSpan={disableNavigation('quote', quote)}
        >
          {quote.number}
        </DynamicLink>
      ),
    },
    {
      id: 'client_id',
      label: t('client'),
      format: (value, quote) => (
        <DynamicLink
          to={route('/clients/:id', { id: quote.client_id })}
          renderSpan={disableNavigation('client', quote.client)}
        >
          {quote.client?.display_name}
        </DynamicLink>
      ),
    },
    {
      id: 'date',
      label: t('date'),
      format: (value) => value && dayjs(value).format('MMM DD'),
    },
    {
      id: 'amount',
      label: t('amount'),
      format: (value, quote) => (
        <Badge variant="orange" className="font-mono">
          {formatMoney(
            value,
            quote.client?.country_id,
            quote.client?.settings.currency_id
          )}
        </Badge>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalendarCheckOut size="1.4rem" color="#66B2FF" />

          <span className="uppercase font-heading text-lg">{t('upcoming_quotes')}</span>
        </div>
      }
      className="min-h-96 relative shadow-sm"
      headerClassName="px-3 sm:px-4 py-3 sm:py-4"
      withoutBodyPadding
      withoutHeaderPadding
    >
      <div className="px-4 pt-4">
        <DataTable
          resource="quote"
          columns={columns}
          className="pr-4"
          endpoint="/api/v1/quotes?include=client&client_status=upcoming&without_deleted_clients=true&per_page=50&page=1"
          withoutActions
          withoutPagination
          withoutPadding
          withoutPerPageAsPreference
          styleOptions={{
            withoutBottomBorder: true,
            withoutTopBorder: true,
            withoutLeftBorder: true,
            withoutRightBorder: true,
            disableThUppercase: true,
            withoutThVerticalPadding: true,
            useOnlyCurrentSortDirectionIcon: true,
            headerBackgroundColor: 'transparent',
            thChildrenClassName: colors.$0 === 'dark' ? 'text-white/70' : 'text-black/70',
            tdClassName: 'first:pl-2 py-3',
            thClassName: 'first:pl-2 py-3 border-r-0 text-sm',
            tBodyStyle: { border: 0 },
            thTextSize: 'small',
            thStyle: {
              borderBottom: `1px solid ${colors.$20}`,
            },
            ascIcon: <ArrowUp size="1.1rem" color={colors.$0 === 'dark' ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"} />,
            descIcon: <ArrowDown size="1.1rem" color={colors.$0 === 'dark' ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"} />,
          }}
          style={{
            height: '18.9rem',
          }}
          withoutSortQueryParameter
        />
      </div>
    </Card>
  );
}
