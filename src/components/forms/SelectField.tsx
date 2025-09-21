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
import { InputLabel } from '.';
import CommonProps from '../../common/interfaces/common-props.interface';
import { useColorScheme } from '$app/common/colors';
import React, { CSSProperties, ReactNode, isValidElement } from 'react';
import { SelectOption } from '../datatables/Actions';
import Select, { StylesConfig } from 'react-select';
import { ChevronDown } from '../icons/ChevronDown';
import { merge } from 'lodash';
import { ErrorMessage } from '../ErrorMessage';

export interface SelectProps extends CommonProps {
  defaultValue?: any;
  label?: string | null;
  required?: boolean;
  withBlank?: boolean;
  onValueChange?: (value: string) => unknown;
  errorMessage?: string | string[];
  blankOptionValue?: string | number;
  customSelector?: boolean;
  dismissable?: boolean;
  clearAfterSelection?: boolean;
  menuPosition?: 'fixed';
  searchable?: boolean;
  controlIcon?: ReactNode;
  controlStyle?: CSSProperties;
  applyCustomDropdownIndicator?: boolean;
  dropdownIndicatorClassName?: string;
}

export function SelectField(props: SelectProps) {
  const colors = useColorScheme();

  const {
    blankOptionValue,
    withBlank,
    children,
    value,
    defaultValue,
    customSelector,
    onValueChange,
    className,
    disabled,
    cypressRef,
    dismissable = true,
    clearAfterSelection,
    searchable = true,
    controlIcon,
    controlStyle,
    dropdownIndicatorClassName,
  } = props;

  const blankEntry: ReactNode = (
    <option value={blankOptionValue ?? ''}></option>
  );

  const $entries = React.Children.map(
    [withBlank ? blankEntry : [], children],
    (child) =>
      isValidElement(child) && {
        label: Array.isArray(child.props.children)
          ? child.props.children.join('')
          : child.props.children,
        value: child.props.value,
      }
  );

  const selectedEntry = $entries?.find((entry) => entry.value === value);
  const defaultEntry = $entries?.find((entry) => entry.value === defaultValue);

  const customStyles: StylesConfig<SelectOption, false> = {
    input: (styles) => {
      return merge(styles, {
        color: 'rgba(255, 255, 255, 0.95)',
      });
    },
    singleValue: (styles) => {
      return merge(styles, {
        color: 'rgba(255, 255, 255, 0.95)',
      });
    },
    menu: (base) => {
      return merge(base, {
        width: 'max-content',
        minWidth: '100%',
        backgroundColor: 'rgba(20, 25, 35, 0.95)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '0.75rem',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)',
        zIndex: 9999,
      });
    },
    control: (base, { isDisabled, isFocused }) => {
      return merge(base, {
        borderRadius: '0.375rem',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(12px)',
        color: 'rgba(255, 255, 255, 0.95)',
        borderColor: isFocused ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        pointerEvents: isDisabled ? 'auto' : 'unset',
        boxShadow: 'none',
        '&:hover': {
          borderColor: isFocused ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.4)',
        },
        ...controlStyle,
      });
    },
    option: (base, { isSelected, isFocused }) => {
      return merge(base, {
        display: 'flex',
        alignItems: 'center',
        color: isSelected ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.9)',
        backgroundColor: isSelected 
          ? 'rgba(62, 219, 147, 0.2)' 
          : isFocused 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'transparent',
        ':hover': {
          backgroundColor: isSelected ? 'rgba(62, 219, 147, 0.3)' : 'rgba(255, 255, 255, 0.15)',
        },
        minHeight: '1.875rem',
        fontWeight: isSelected ? '500' : '400',
      });
    },
    indicatorSeparator: () => {
      return {
        display: 'none',
      };
    },
  };

  return (
    <div className={classNames({ 'space-y-2': Boolean(customSelector) })}>
      {props.label && (
        <InputLabel className="mb-1" for={props.id}>
          {props.label}
          {props.required && <span className="ml-1 text-red-600">*</span>}
        </InputLabel>
      )}

      {!customSelector ? (
        <select
          onChange={(event) => {
            props.onValueChange && props.onValueChange(event.target.value);
            props.onChange && props.onChange(event);
          }}
          id={props.id}
          className={classNames(
            `w-full py-2 rounded text-sm border disabled:cursor-not-allowed ${props.className}`
          )}
          defaultValue={props.defaultValue}
          value={props.value}
          ref={props.innerRef}
          disabled={props.disabled}
          style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.95)',
            ...props.style,
          }}
          data-cy={props.cypressRef}
        >
          {props.withBlank && (
            <option value={props.blankOptionValue ?? ''}></option>
          )}
          {props.children}
        </select>
      ) : (
        <Select
          className={className}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          options={$entries}
          defaultValue={defaultEntry}
          value={clearAfterSelection ? { label: '', value: '' } : selectedEntry}
          onChange={(v) => {
            if (!v) {
              return onValueChange?.((blankOptionValue as string) ?? '');
            }

            return onValueChange?.((v as SelectOption).value as string);
          }}
          menuPosition={props.menuPosition}
          isDisabled={disabled}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          styles={customStyles}
          isSearchable={searchable}
          isClearable={Boolean(
            dismissable &&
              selectedEntry?.value &&
              selectedEntry?.value !== blankOptionValue
          )}
          blurInputOnSelect
          data-cy={cypressRef}
          components={{
            ...((controlIcon || props.menuPosition !== 'fixed') && {
              Control: ({ children: controlChildren, ...rest }) => (
                <div
                  className={classNames(
                    'flex items-center rounded-md border cursor-pointer',
                    {
                      'pl-2': controlIcon,
                      'pl-1': !controlIcon,
                    }
                  )}
                  style={{
                    height: '2.5rem',
                    backgroundColor: 'transparent',
                    borderColor: rest.isFocused ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)',
                    color: 'rgba(255, 255, 255, 0.95)',
                    ...controlStyle,
                  }}
                  {...rest.innerProps}
                >
                  {controlIcon}
                  {controlChildren}
                </div>
              ),
            }),

            DropdownIndicator: () => (
              <div
                className={classNames(
                  'flex items-center justify-center px-3 hover:opacity-75 h-full w-full',
                  dropdownIndicatorClassName
                )}
                style={{ color: colors.$3 }}
              >
                <ChevronDown color={colors.$3} size="1rem" />
              </div>
            ),
          }}
        />
      )}

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </div>
  );
}
