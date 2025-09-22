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
            'overflow-hidden backdrop-blur-md bg-black/20 rounded-lg',
            {
              'border-b border-white/15': !props.withoutBottomBorder,
              'border-t border-white/15': !props.withoutTopBorder,
              'border-l border-white/15': !props.withoutLeftBorder,
              'border-r border-white/15': !props.withoutRightBorder,
              'border border-white/15': !props.withoutBorder,
            }
          )}
          style={{
            color: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
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
