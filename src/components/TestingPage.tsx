/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useTranslation } from 'react-i18next';
import { ComboboxAsync } from './forms/Combobox';
import { useState } from 'react';
import { endpoint } from '$app/common/helpers';
import { Client } from '$app/common/interfaces/client';
import { ClientCreate } from '$app/pages/invoices/common/components/ClientCreate';
import { Alert } from './Alert';
import { toast } from '$app/common/helpers/toast/toast';

export function TestingPage() {
  const [t] = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState<string>('');

  const showToast = (type: 'success' | 'error' | 'loading') => {
    switch (type) {
      case 'success':
        toast.success('This is a success message!');
        break;
      case 'error':
        toast.error('This is an error message!');
        break;
      case 'loading':
        toast.processing();
        break;
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">UI Component Testing</h1>
        
        {/* Alert Components Demo */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Glassy Alert Messages</h2>
          
          <div className="space-y-4">
            <Alert type="success">
              This is a success alert with glassy styling! Everything looks great.
            </Alert>
            
            <Alert type="warning">
              This is a warning alert. Please pay attention to this important information.
            </Alert>
            
            <Alert type="danger">
              This is a danger alert. Something went wrong and needs immediate attention.
            </Alert>
            
            <Alert type="info">
              This is an info alert with helpful information for the user.
            </Alert>
            
            <Alert>
              This is a default alert without a specific type.
            </Alert>
          </div>
        </div>

        {/* Toast Notifications Demo */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Glassy Toast Notifications</h2>
          
          <div className="flex space-x-4">
            <button
              onClick={() => showToast('success')}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Show Success Toast
            </button>
            
            <button
              onClick={() => showToast('error')}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Show Error Toast
            </button>
            
            <button
              onClick={() => showToast('loading')}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              Show Loading Toast
            </button>
          </div>
        </div>

        {/* Original Testing Components */}
        <div className="space-y-6 mt-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Original Testing Components</h2>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <ClientCreate
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              onClientCreated={(client) => setValue(client.id)}
            />

            <ComboboxAsync<Client>
              inputOptions={{
                value: value ?? null,
              }}
              endpoint={endpoint('/api/v1/clients?status=active')}
              entryOptions={{ id: 'id', label: 'name', value: 'id' }}
              onChange={(entry) => entry.resource && setValue(entry.resource.id)}
              onDismiss={() => setValue('')}
              action={{
                label: t('new_client'),
                onClick: () => setIsModalOpen(true),
                visible: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
