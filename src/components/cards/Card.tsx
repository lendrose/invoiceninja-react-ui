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
import { Spinner } from '$app/components/Spinner';
import {
  CSSProperties,
  FormEvent,
  ReactElement,
  ReactNode,
  RefObject,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { CardContainer } from '.';
import { Button } from '../forms';
import { Element } from '$app/components/cards/Element';
import { Dropdown } from '$app/components/dropdown/Dropdown';
import { DropdownElement } from '$app/components/dropdown/DropdownElement';
import { ChevronDown, ChevronUp } from 'react-feather';
import { useColorScheme } from '$app/common/colors';

export interface ButtonOption {
  text: string;
  onClick: (event: FormEvent<HTMLFormElement>) => unknown;
  icon?: ReactElement;
}

interface Props {
  children: ReactNode;
  title?: ReactNode | null;
  description?: string;
  withSaveButton?: boolean;
  additionalSaveOptions?: ButtonOption[];
  onFormSubmit?: (event: FormEvent<HTMLFormElement>) => unknown;
  onSaveClick?: (event: FormEvent<HTMLFormElement>) => unknown;
  saveButtonLabel?: string | null;
  disableSubmitButton?: boolean;
  disableWithoutIcon?: boolean;
  className?: string;
  withContainer?: boolean;
  style?: CSSProperties;
  withScrollableBody?: boolean;
  additionalAction?: ReactNode;
  isLoading?: boolean;
  withoutBodyPadding?: boolean;
  padding?: 'small' | 'regular';
  collapsed?: boolean;
  childrenClassName?: string;
  withoutHeaderBorder?: boolean;
  topRight?: ReactNode;
  height?: 'full';
  headerStyle?: CSSProperties;
  headerClassName?: string;
  withoutHeaderPadding?: boolean;
  innerRef?: RefObject<HTMLDivElement>;
}

export function Card(props: Props) {
  const [t] = useTranslation();

  const { padding = 'regular', height } = props;

  const [isCollapsed, setIsCollpased] = useState(props.collapsed);

  const colors = useColorScheme();

  return (
    <div
      ref={props.innerRef}
      className={classNames(
        `backdrop-blur-md bg-black/20 border border-white/15 rounded-2xl shadow-2xl overflow-hidden m-2 ${props.className}`,
        {
          'overflow-y-auto': props.withScrollableBody,
          'h-full': height === 'full',
        }
      )}
      style={{
        color: 'white',
        ...props.style,
      }}
    >
      <form
        onSubmit={props.onFormSubmit}
        className={classNames({ 'h-full': height === 'full' })}
      >
        {props.title && (
          <div
            className={classNames(
              {
                'backdrop-blur-md bg-gradient-to-r from-green-500/15 to-green-400/8 sticky top-0': props.withScrollableBody,
                'backdrop-blur-md bg-gradient-to-r from-green-500/15 to-green-400/8': !props.withScrollableBody,
                'px-8 sm:px-10 py-6':
                  padding == 'small' && !props.withoutHeaderPadding,
                'px-8 sm:px-10 py-8':
                  padding == 'regular' && !props.withoutHeaderPadding,
                'border-b border-white/15': !props.withoutHeaderBorder,
              },
              props.headerClassName
            )}
            onClick={() =>
              typeof props.collapsed !== 'undefined' &&
              setIsCollpased(!isCollapsed)
            }
            style={{ ...props.headerStyle }}
          >
            <div
              className={classNames('flex items-center justify-between', {
                'cursor-pointer select-none':
                  typeof props.collapsed !== 'undefined',
              })}
            >
              <div>
                <h3
                  className={classNames('leading-6 font-bold', {
                    'text-lg': padding == 'regular',
                    'text-md': padding == 'small',
                  })}
                >
                  {props.title}
                </h3>

                {props.description && (
                  <p className="mt-1 max-w-2xl text-sm">{props.description}</p>
                )}
              </div>

              {props.topRight}

              {typeof props.collapsed !== 'undefined' && isCollapsed && (
                <ChevronDown />
              )}

              {typeof props.collapsed !== 'undefined' && !isCollapsed && (
                <ChevronUp />
              )}
            </div>
          </div>
        )}

        <div
          className={classNames(props.childrenClassName, {
            hidden: isCollapsed,
            'py-0': props.withoutBodyPadding,
            'py-8 px-8 sm:px-10': padding === 'regular' && !props.withoutBodyPadding,
            'py-6 px-8 sm:px-10': padding === 'small' && !props.withoutBodyPadding,
            'h-full': height === 'full',
          })}
        >
          {props.isLoading && <Element leftSide={<Spinner />} />}

          {props.withContainer ? (
            <CardContainer>{props.children}</CardContainer>
          ) : (
            props.children
          )}
        </div>

        {(props.withSaveButton || props.additionalAction) && (
          <div
            className="border-t px-4 py-5 sm:p-0"
            style={{ borderColor: colors.$20 }}
          >
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="sm:py-5 sm:px-6 flex justify-end space-x-4">
                {props.additionalAction}

                {props.withSaveButton && !props.additionalSaveOptions && (
                  <Button
                    onClick={props.onSaveClick}
                    disabled={props.disableSubmitButton}
                    disableWithoutIcon={props.disableWithoutIcon}
                  >
                    {props.saveButtonLabel ?? t('save')}
                  </Button>
                )}

                {props.withSaveButton && props.additionalSaveOptions && (
                  <div className="flex">
                    <Button
                      className="rounded-br-none rounded-tr-none px-3"
                      onClick={props.onSaveClick}
                      disabled={props.disableSubmitButton}
                      disableWithoutIcon={props.disableWithoutIcon}
                    >
                      {props.saveButtonLabel ?? t('save')}
                    </Button>

                    <Dropdown
                      className="rounded-bl-none rounded-tl-none h-full px-1 border-l-1 border-y-0 border-r-0"
                      disabled={props.disableSubmitButton}
                      cardActions
                      labelButtonBorderColor={colors.$1}
                    >
                      {props.additionalSaveOptions.map((action, i) => (
                        <DropdownElement
                          key={i}
                          icon={action.icon}
                          disabled={props.disableSubmitButton}
                          onClick={action.onClick}
                        >
                          {action.text}
                        </DropdownElement>
                      ))}
                    </Dropdown>
                  </div>
                )}
              </div>
            </dl>
          </div>
        )}
      </form>
    </div>
  );
}
