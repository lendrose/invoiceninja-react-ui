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
import { useEffect, useState } from 'react';

import CommonProps from '../../common/interfaces/common-props.interface';
import { useColorScheme } from '$app/common/colors';
import { useCurrentCompany } from '$app/common/hooks/useCurrentCompany';
import { InputLabel } from './InputLabel';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import { ErrorMessage } from '../ErrorMessage';

interface Props extends CommonProps {
  id?: string;
  border?: boolean;
  errorMessage?: string | string[];
  onValueChange?: (value: string) => unknown;
  changeOverride?: boolean;
  label?: string | null;
  required?: boolean;
  withoutLabelWrapping?: boolean;
  placeholder?: string | null;
  width?: string;
}

export function CurrencyInputField(props: Props) {
  const colors = useColorScheme();
  const company = useCurrentCompany();
  const reactSettings = useReactSettings({ overwrite: false });

  const [displayValue, setDisplayValue] = useState<string>('0.00');
  const [rawInput, setRawInput] = useState<string>('');

  // Handle input changes with right-to-left decimal behavior
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    
    // Only allow numeric input
    const numericValue = inputValue.replace(/[^\d]/g, '');
    setRawInput(numericValue);
    
    if (!numericValue) {
      setDisplayValue('0.00');
      if (props.onValueChange) {
        props.onValueChange('0');
      }
      return;
    }

    // Convert to cents and then to dollars (right-to-left behavior)
    const cents = parseInt(numericValue) || 0;
    const dollars = cents / 100;
    
    setDisplayValue(dollars.toFixed(2));
    
    if (props.onValueChange) {
      props.onValueChange(dollars.toString());
    }
  };

  // Update display when props.value changes
  useEffect(() => {
    if (props.value !== undefined) {
      const numValue = typeof props.value === 'number' ? props.value : parseFloat(String(props.value)) || 0;
      setDisplayValue(numValue.toFixed(2));
      // Convert back to raw input for display
      setRawInput(Math.round(numValue * 100).toString());
    }
  }, [props.value]);

  return (
    <section style={{ width: props.width }}>
      {props.label && (
        <InputLabel
          className={classNames('mb-1', {
            'whitespace-nowrap': props.withoutLabelWrapping,
          })}
          for={props.id}
        >
          {props.label}
          {props.required && <span className="ml-1 text-red-600">*</span>}
        </InputLabel>
      )}

      <div className="relative">
        {/* Dollar sign prefix */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <span className="text-sm text-gray-600 dark:text-gray-400">$</span>
        </div>
        
        <input
          type="text"
          className={classNames(
            `w-full py-2 pl-8 pr-3 rounded-md text-sm disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-0 ${props.className}`,
            {
              border: props.border !== false,
              'border-[#09090B26] focus:border-black': !reactSettings.dark_mode,
              'border-[#1f2e41] focus:border-white': reactSettings.dark_mode,
            }
          )}
          value={displayValue}
          placeholder={props.placeholder ?? '0.00'}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            // Only allow numeric keys, backspace, delete, arrow keys, tab, enter
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          style={{
            backgroundColor: colors.$1,
            color: colors.$3,
            ...props.style,
          }}
          disabled={props.disabled}
        />
      </div>

      <ErrorMessage className="mt-2">{props.errorMessage}</ErrorMessage>
    </section>
  );
}
