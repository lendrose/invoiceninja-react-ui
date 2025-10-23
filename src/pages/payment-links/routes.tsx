/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { Route } from 'react-router-dom';
import * as PaymentLinks from './index';

export const paymentLinkRoutes = (
  <Route path="/payment_links">
    <Route path="" element={<PaymentLinks.Subscriptions />} />
    <Route path="create" element={<PaymentLinks.CreateSubscription />} />
    <Route path=":id/edit" element={<PaymentLinks.EditSubscription />} />
  </Route>
);
