/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useState } from 'react';
import { endpoint, isHosted, isSelfHosted } from '../../common/helpers';
import { AxiosError } from 'axios';
import { LoginValidation } from './common/ValidationInterface';
import { useTranslation } from 'react-i18next';
import { InputField } from '../../components/forms/InputField';
import { Button } from '../../components/forms/Button';
import { Link } from '../../components/forms/Link';
import { InputLabel } from '../../components/forms/InputLabel';
import { HostedLinks } from './components/HostedLinks';
import { useTitle } from '$app/common/hooks/useTitle';
import { request } from '$app/common/helpers/request';
import { SignInProviders } from './components/SignInProviders';
import { useLogin } from './common/hooks';
import { GenericValidationBag } from '$app/common/interfaces/validation-bag';
import { useColorScheme } from '$app/common/colors';
import { version } from '$app/common/helpers/version';
import { toast } from '$app/common/helpers/toast/toast';
import { ErrorMessage } from '$app/components/ErrorMessage';
import { Disable2faModal } from './components/Disable2faModal';
import { useAccentColor } from '$app/common/hooks/useAccentColor';
import classNames from 'classnames';

export function Login() {
  useTitle('login');


  const [message, setMessage] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<LoginValidation | undefined>(undefined);
  const [isFormBusy, setIsFormBusy] = useState(false);
  const [isDisable2faModalOpen, setIsDisable2faModalOpen] =
    useState<boolean>(false);
  const [t] = useTranslation();

  const accentColor = useAccentColor();


  const login = useLogin();

  function handleSubmit(form: HTMLFormElement) {
    const formData = new FormData(form);

    setMessage(undefined);
    setErrors(undefined);
    setIsFormBusy(true);

    const secret = formData.get('secret') as string;

    request('POST', endpoint('/api/v1/login'), Object.fromEntries(formData), {
      ...(secret && {
        headers: { 'X-API-SECRET': secret },
      }),
    })
      .then((response) => login(response))
      .catch((error: AxiosError<GenericValidationBag<LoginValidation>>) => {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        } else if (error.response?.status === 503) {
          toast.error('app_maintenance');
        } else {
          setMessage(
            error.response?.data.message ?? (t('invalid_credentials') as string)
          );
        }
      })
      .finally(() => setIsFormBusy(false));
  }

  const colors = useColorScheme();

  return (
    <div className="min-h-screen bg-dark-bg relative">
      {/* Fixed Background SVG */}
      <img 
        src="/dark-grey-background.svg" 
        alt="Background" 
        className="bg-fixed-full-width"
      />
      
      <div className="relative z-20">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <div className="backdrop-blur-md bg-white/15 border border-white/20 rounded-2xl shadow-2xl mx-4 max-w-md w-full p-8">
            {/* Logo at the top of the login card */}
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img src="/lendrose-logo.svg" alt="Lendrose Logo" className="h-10" />
              </Link>
            </div>
            
            <h2 className="text-2xl font-heading text-white text-center mb-6">LendrosePay Login</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e.currentTarget);
            }}
            className="my-6 space-y-4 login-form"
          >
            <InputField
              type="email"
              autoComplete="username"
              label={t('email_address')}
              errorMessage={errors?.email}
              name="email"
            />

            <InputField
              type="password"
              autoComplete="current-password"
              label={t('password')}
              id="password"
              errorMessage={errors?.password}
              name="password"
            />

            <div className="space-y-2">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <InputLabel>{`2FA - ${t('one_time_password')}`}</InputLabel>
                <Link to="/recover_password">{t('forgot_password')}</Link>
              </div>
            </div>

            <InputField
              type="text"
              autoComplete="one-time-code"
              id="one_time_password"
              placeholder={t('plaid_optional')}
              errorMessage={errors?.one_time_password}
              name="one_time_password"
            />

            <div className="space-y-2">
              <div
                className={classNames(
                  'flex flex-col lg:flex-row items-center',
                  {
                    'justify-between': isSelfHosted(),
                    'justify-end': isHosted(),
                  }
                )}
              >
                {isSelfHosted() && <InputLabel>{t('secret')}</InputLabel>}

                {isHosted() && (
                  <div
                    className="text-sm hover:underline cursor-pointer"
                    onClick={() => setIsDisable2faModalOpen(true)}
                    style={{ color: accentColor }}
                  >
                    {t('disable_2fa')}
                  </div>
                )}
              </div>
            </div>

            {isSelfHosted() && (
              <InputField
                type="password"
                autoComplete="on"
                placeholder={t('plaid_optional')}
                name="secret"
              />
            )}

            <ErrorMessage className="mt-4">{message}</ErrorMessage>

            <Button disabled={isFormBusy} className="mt-4" variant="block">
              {t('login')}
            </Button>
          </form>

          <div className="flex justify-center">
            {isHosted() && <Link to="/register">{t('register_label')}</Link>}
          </div>
        </div>

        {isHosted() && (
          <>
            <div className="mt-6">
              <SignInProviders />
            </div>

            <div className="backdrop-blur-md bg-white/15 border border-white/20 rounded-2xl shadow-2xl mx-4 max-w-md w-full mt-4">
              <HostedLinks />
            </div>
          </>
        )}

        {/* <p className="mt-4 text-xs">{version}</p> */}
        </div>
      </div>

      <Disable2faModal
        visible={isDisable2faModalOpen}
        setVisible={setIsDisable2faModalOpen}
      />
    </div>
  );
}
