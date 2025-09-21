/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import React from 'react';

export function ActionCard(props: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl w-full p-8 my-4">
      <div className={`flex justify-between items-center`}>
        <section>
          <h2 className="text-white">{props.label}</h2>
          {props.help && (
            <span className="text-xs text-white/70">{props.help}</span>
          )}
        </section>
        {props.children}
      </div>
    </div>
  );
}
