/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import classNames from 'classnames';
import CommonProps from '../../common/interfaces/common-props.interface';
import { useColorScheme } from '$app/common/colors';

interface Props extends CommonProps {
  withoutPadding?: boolean;
  withoutBottomBorder?: boolean;
  withoutTopBorder?: boolean;
  withoutLeftBorder?: boolean;
  withoutRightBorder?: boolean;
  isDataLoading?: boolean;
  resizable?: string;
  withoutBorder?: boolean;
}

export function Table(props: Props) {
  const colors = useColorScheme();

  return (
    <div
      className={classNames('flex flex-col', {
        'mt-2': !props.withoutPadding,
      })}
    >
      <div
        className={classNames('align-middle inline-block min-w-full', {
          'py-1.5': !props.withoutPadding,
        })}
      >
        <div
          className={classNames(
            'overflow-hidden backdrop-blur-md rounded-lg',
            {
              'bg-transparent': true,
              'border-b': !props.withoutBottomBorder,
              'border-t': !props.withoutTopBorder,
              'border-l': !props.withoutLeftBorder,
              'border-r': !props.withoutRightBorder,
              'border': !props.withoutBorder,
              'border-white/15': (
                !props.withoutBottomBorder ||
                !props.withoutTopBorder ||
                !props.withoutLeftBorder ||
                !props.withoutRightBorder ||
                !props.withoutBorder
              ) && colors.$0 === 'dark',
              'border-gray-200': (
                !props.withoutBottomBorder ||
                !props.withoutTopBorder ||
                !props.withoutLeftBorder ||
                !props.withoutRightBorder ||
                !props.withoutBorder
              ) && colors.$0 === 'light',
            }
          )}
          style={{
            color: colors.$0 === 'dark' ? 'rgba(255, 255, 255, 0.95)' : colors.$3,
            borderColor: colors.$0 === 'dark' ? 'rgba(255, 255, 255, 0.15)' : colors.$4,
          }}
        >
          <div
            className={`overflow-auto min-w-full rounded-md shadow-sm ${props.className}`}
            style={{
              ...props.style,
              height: props.style?.height || 'auto',
            }}
          >
            <table
              className={classNames({
                'min-w-full table-auto': !props.resizable,
                'min-w-full table-fixed': props.resizable,
              })}
            >
              {props.children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
