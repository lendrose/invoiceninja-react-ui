/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyInputField } from '../CurrencyInputField';

// Mock the hooks
jest.mock('$app/common/colors', () => ({
  useColorScheme: () => ({
    $0: 'light',
    $1: '#ffffff',
    $3: '#000000',
  }),
}));

jest.mock('$app/common/hooks/useCurrentCompany', () => ({
  useCurrentCompany: () => ({
    use_comma_as_decimal_place: false,
  }),
}));

jest.mock('$app/common/hooks/useReactSettings', () => ({
  useReactSettings: () => ({
    dark_mode: false,
  }),
}));

describe('CurrencyInputField', () => {
  it('should display dollar sign prefix', () => {
    render(<CurrencyInputField value={0} onValueChange={() => {}} />);
    
    const dollarSign = screen.getByText('$');
    expect(dollarSign).toBeInTheDocument();
  });

  it('should format value with 2 decimal places', () => {
    const mockOnValueChange = jest.fn();
    render(
      <CurrencyInputField 
        value={12.5} 
        onValueChange={mockOnValueChange} 
      />
    );
    
    const input = screen.getByDisplayValue('12.50');
    expect(input).toBeInTheDocument();
  });

  it('should handle right-to-left decimal input behavior', () => {
    const mockOnValueChange = jest.fn();
    render(
      <CurrencyInputField 
        value={0} 
        onValueChange={mockOnValueChange} 
      />
    );
    
    const input = screen.getByDisplayValue('0.00');
    
    // Simulate typing "89" which should result in 0.89
    fireEvent.change(input, { target: { value: '89' });
    
    // The component should call onValueChange with 0.89
    expect(mockOnValueChange).toHaveBeenCalledWith('0.89');
  });

  it('should format input as user types', () => {
    const mockOnValueChange = jest.fn();
    render(
      <CurrencyInputField 
        value={0} 
        onValueChange={mockOnValueChange} 
      />
    );
    
    const input = screen.getByDisplayValue('0.00');
    
    // Type "1" should show "0.01"
    fireEvent.change(input, { target: { value: '1' });
    expect(input.value).toBe('0.01');
    
    // Type "12" should show "0.12"
    fireEvent.change(input, { target: { value: '12' });
    expect(input.value).toBe('0.12');
    
    // Type "123" should show "1.23"
    fireEvent.change(input, { target: { value: '123' });
    expect(input.value).toBe('1.23');
  });

  it('should display placeholder when value is 0', () => {
    render(
      <CurrencyInputField 
        value={0} 
        onValueChange={() => {}} 
        placeholder="0.00"
      />
    );
    
    const input = screen.getByPlaceholderText('0.00');
    expect(input).toBeInTheDocument();
  });
});
