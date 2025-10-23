/**
 * Demo component to showcase CurrencyInputField behavior
 */

import { useState } from 'react';
import { CurrencyInputField } from './CurrencyInputField';

export function CurrencyInputFieldDemo() {
  const [value, setValue] = useState<number>(0);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Currency Input Field Demo</h3>
      <p className="text-sm text-gray-600">
        Type numbers to see the right-to-left decimal behavior:
      </p>
      <ul className="text-sm text-gray-600 list-disc list-inside">
        <li>Type "1" → displays "$0.01"</li>
        <li>Type "12" → displays "$0.12"</li>
        <li>Type "123" → displays "$1.23"</li>
        <li>Type "1234" → displays "$12.34"</li>
        <li>Type "12345" → displays "$123.45"</li>
      </ul>
      
      <CurrencyInputField
        label="Amount"
        value={value}
        onValueChange={(val) => setValue(parseFloat(val))}
        placeholder="0.00"
      />
      
      <div className="text-sm">
        <strong>Current value:</strong> {value}
      </div>
    </div>
  );
}
