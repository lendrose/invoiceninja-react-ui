/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import CommonProps from '../../common/interfaces/common-props.interface';
import { InputLabel } from './InputLabel';
import { useColorScheme } from '../../common/colors';

interface Props extends CommonProps {
  label?: string;
  placeholder?: string;
  rows?: number | undefined;
}

export function Textarea(props: Props) {
  const colors = useColorScheme();

  return (
    <section>
      {props.label && (
        <InputLabel className="mb-2" for={props.id}>
          {props.label}
        </InputLabel>
      )}

      <textarea
        rows={props.rows ?? 5}
        id={props.id}
        className={`form-textarea w-full py-2 px-3 rounded border text-sm ${props.className}`}
        style={{
          backgroundColor: colors.$0 === 'dark' ? 'transparent' : colors.$1,
          backdropFilter: colors.$0 === 'dark' ? 'blur(12px)' : 'none',
          borderColor: colors.$0 === 'dark' ? 'rgba(255, 255, 255, 0.3)' : colors.$4,
          color: colors.$0 === 'dark' ? 'rgba(255, 255, 255, 0.95)' : colors.$3,
          ...props.style,
        }}
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
      >
        {props.children}
      </textarea>
    </section>
  );
}
