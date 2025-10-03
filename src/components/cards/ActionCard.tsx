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
import { useColorScheme } from '$app/common/colors';
import classNames from 'classnames';

export function ActionCard(props: {
  label: string;
  help?: string;
  children: React.ReactNode;
}) {
  const colors = useColorScheme();
  
  return (
    <div className={classNames("mt-2 backdrop-blur-md rounded-2xl shadow-2xl w-full p-8 my-4", {
      "bg-black/15 border border-white/15": colors.$0 === 'dark',
      "bg-white/20 border border-white/20": colors.$0 === 'light',
    })}>
      <div className={`flex justify-between items-center`}>
        <section>
          <h2 className={classNames({
            "text-white": colors.$0 === 'dark',
            "text-gray-800": colors.$0 === 'light',
          })}>{props.label}</h2>
          {props.help && (
            <span className={classNames("text-xs", {
              "text-white/70": colors.$0 === 'dark',
              "text-gray-600": colors.$0 === 'light',
            })}>{props.help}</span>
          )}
        </section>
        {props.children}
      </div>
    </div>
  );
}
