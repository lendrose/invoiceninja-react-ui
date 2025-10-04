/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useColorScheme } from '$app/common/colors';
import CommonProps from '../../common/interfaces/common-props.interface';
import classNames from 'classnames';

interface Props extends CommonProps {
  backgroundColor?: string;
  withoutBackground?: boolean;
}

export function Thead(props: Props) {
  const { backgroundColor } = props;

  const colors = useColorScheme();

  return (
    <thead
      className={classNames("border-b", {
        'bg-gradient-to-r from-green-500/25 to-green-400/15': !props.withoutBackground && colors.$0 === 'dark',
        'bg-gradient-to-l from-blue-500/50 to-green-500/50': !props.withoutBackground && colors.$0 === 'light',
      })}
      style={{
        backgroundColor: backgroundColor || 'rgba(0, 0, 0, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        ...props.style,
      }}
    >
      <tr>{props.children}</tr>
    </thead>
  );
}
