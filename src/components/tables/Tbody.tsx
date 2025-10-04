/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Spinner } from '$app/components/Spinner';
import { useTranslation } from 'react-i18next';
import { Td, Tr } from '.';
import CommonProps from '../../common/interfaces/common-props.interface';
import classNames from 'classnames';

interface Props extends CommonProps {
  data?: any;
  showHelperPlaceholders?: boolean;
  withoutBackground?: boolean;
  withoutBodyBackground?: boolean;
}

export function Tbody(props: Props) {
  const [t] = useTranslation();

  return (
    <tbody style={props.style} ref={props.innerRef} className={classNames({
      'bg-white/80': !props.withoutBackground && !props.withoutBodyBackground,
    })}>
      {!props.data && props.showHelperPlaceholders && (
        <Tr>
          <Td colSpan={20}>
            <Spinner />
          </Td>
        </Tr>
      )}
      {props.data &&
        props.showHelperPlaceholders &&
        props.data.data.meta.pagination.total === 0 && (
          <Tr>
            <Td colSpan={20}>
              <p>{t('empty_table')}</p>
            </Td>
          </Tr>
        )}
      {props.children}
    </tbody>
  );
}
