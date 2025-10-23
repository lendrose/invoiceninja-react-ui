/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { AxiosError } from 'axios';
import { endpoint } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { route } from '$app/common/helpers/route';
import { toast } from '$app/common/helpers/toast/toast';
import { GenericSingleResourceResponse } from '$app/common/interfaces/generic-api-response';
import { Product } from '$app/common/interfaces/product';
import { Subscription } from '$app/common/interfaces/subscription';
import { ValidationBag } from '$app/common/interfaces/validation-bag';
import { useProductsQuery } from '$app/common/queries/products';
import { Default } from '$app/components/layouts/Default';
import { TabGroup } from '$app/components/TabGroup';
import { FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Overview } from '../common/components/Overview';
import { Settings as SubscriptionSettings } from '../common/components/Settings';
// import { Webhook } from '../common/components/Webhook'; // Disabled - keeping for potential reactivation
import { useHandleChange } from '../common/hooks/useHandleChange';
import { Frequency } from '$app/common/enums/frequency';
import { useShouldDisableAdvanceSettings } from '$app/common/hooks/useShouldDisableAdvanceSettings';
import { AdvancedSettingsPlanAlert } from '$app/components/AdvancedSettingsPlanAlert';
import { useBlankSubscriptionQuery } from '$app/common/queries/subscriptions';
import { useTitle } from '$app/common/hooks/useTitle';
import { $refetch } from '$app/common/hooks/useRefetch';
import { Steps } from '../common/components/Steps';
import { Card } from '$app/components/cards';
import { useColorScheme } from '$app/common/colors';

export function Create() {
  const { documentTitle } = useTitle('new_payment_link');

  const [t] = useTranslation();

  const navigate = useNavigate();

  const { data } = useBlankSubscriptionQuery();

  const { data: productsData } = useProductsQuery({
    include: 'company',
    status: ['active'],
  });

  const colors = useColorScheme();
  const showPlanAlert = useShouldDisableAdvanceSettings();

  const pages = [
    { name: t('payment_links'), href: '/payment_links' },
    { name: t('new_payment_link'), href: '/payment_links/create' },
  ];

  const tabs = [t('overview'), t('settings'), t('steps')];

  const [errors, setErrors] = useState<ValidationBag>();
  const [products, setProducts] = useState<Product[]>();
  const [isFormBusy, setIsFormBusy] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<Subscription>();

  const handleChange = useHandleChange({
    setErrors,
    setSubscription,
    subscription,
  });

  useEffect(() => {
    if (data) {
      setSubscription({
        ...data,
        frequency_id: Frequency.Monthly,
        webhook_configuration: {
          post_purchase_headers: {},
          post_purchase_body: '',
          post_purchase_rest_method: '',
          post_purchase_url: '',
          return_url: '',
        },
      });
    }
  }, [data]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData);
    }
  }, [productsData]);

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isFormBusy) {
      return;
    }

    setIsFormBusy(true);

    setErrors(undefined);

    toast.processing();

    request('POST', endpoint('/api/v1/subscriptions'), subscription)
      .then((response: GenericSingleResourceResponse<Subscription>) => {
        toast.success('created_subscription');

        $refetch(['subscriptions']);

        navigate(
          route('/payment_links/:id/edit', {
            id: response.data.data.id,
          })
        );
      })
      .catch((error: AxiosError<ValidationBag>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data);
          toast.dismiss();
        }
      })
      .finally(() => setIsFormBusy(false));
  };

  return (
    <Default
      title={documentTitle}
      breadcrumbs={pages}
      onSaveClick={handleSave}
      disableSaveButton={!subscription || showPlanAlert || isFormBusy}
    >
      <AdvancedSettingsPlanAlert />

      <Card
        title={t('new_payment_link')}
        className="shadow-sm"
        childrenClassName="pb-4"
        style={{ borderColor: colors.$24 }}
        headerStyle={{ borderColor: colors.$20 }}
        withoutHeaderBorder
        withoutBodyPadding
      >
        <TabGroup
          tabs={tabs}
          withHorizontalPadding
          fullRightPadding
          horizontalPaddingWidth="1.5rem"
        >
          <div>
            {subscription && (
              <Overview
                subscription={subscription}
                handleChange={handleChange}
                errors={errors}
                products={products}
                page="create"
              />
            )}
          </div>

          <div>
            {subscription && (
              <SubscriptionSettings
                subscription={subscription}
                handleChange={handleChange}
                errors={errors}
              />
            )}
          </div>

          {/* Webhook tab disabled - keeping for potential reactivation
          <div>
            {subscription && (
              <Webhook
                subscription={subscription}
                handleChange={handleChange}
                errors={errors}
              />
            )}
          </div>
          */}

          <div>
            {subscription && (
              <Steps
                subscription={subscription}
                handleChange={handleChange}
                errors={errors}
              />
            )}
          </div>
        </TabGroup>
      </Card>
    </Default>
  );
}
