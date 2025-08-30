/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import Tippy from '@tippyjs/react';
import { endpoint, isSelfHosted } from '$app/common/helpers';
import { request } from '$app/common/helpers/request';
import { useCurrentAccount } from '$app/common/hooks/useCurrentAccount';
import {
  updateCompanyUsers,
  resetChanges,
} from '$app/common/stores/slices/company-users';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { toast } from '$app/common/helpers/toast/toast';
import { useColorScheme } from '$app/common/colors';
import { useInjectUserChanges } from '$app/common/hooks/useInjectUserChanges';
import classNames from 'classnames';
import { useQuery } from 'react-query';
import axios from 'axios';
import { OpenNavbarArrow } from './icons/OpenNavbarArrow';
import { useHandleCollapseExpandSidebar } from '$app/common/hooks/useHandleCollapseExpandSidebar';
import { CloseNavbarArrow } from './icons/CloseNavbarArrow';
import { useHandleDarkLightMode } from '$app/common/hooks/useHandleDarkLightMode';
import { useReactSettings } from '$app/common/hooks/useReactSettings';
import dayjs from 'dayjs';

interface Props {
  docsLink?: string;
  mobileNavbar?: boolean;
}

export function HelpSidebarIcons(props: Props) {
  const [t] = useTranslation();

  const colors = useColorScheme();
  const user = useInjectUserChanges();
  const account = useCurrentAccount();

  const reactSettings = useReactSettings();

  const { mobileNavbar } = props;

  const dispatch = useDispatch();
  const handleDarkLightMode = useHandleDarkLightMode();
  const handleCollapseExpandSidebar = useHandleCollapseExpandSidebar();

  const { data: latestVersion } = useQuery({
    queryKey: ['/pdf.invoicing.co/api/version'],
    queryFn: () =>
      axios
        .get('https://pdf.invoicing.co/api/version')
        .then((response) => response.data),
    staleTime: Infinity,
  });

  const { data: currentSystemInfo } = useQuery({
    queryKey: ['/api/v1/health_check'],
    queryFn: () =>
      request('GET', endpoint('/api/v1/health_check')).then(
        (response) => response.data
      ),
    staleTime: Infinity,
    enabled: isSelfHosted(),
  });

  const [isContactVisible, setIsContactVisible] = useState<boolean>(false);
  const [isAboutVisible, setIsAboutVisible] = useState<boolean>(false);
  const [cronsNotEnabledModal, setCronsNotEnabledModal] =
    useState<boolean>(false);
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] =
    useState<boolean>(false);

  const isMiniSidebar = Boolean(
    user?.company_user?.react_settings.show_mini_sidebar
  );

  const isUpdateAvailable =
    isSelfHosted() &&
    latestVersion &&
    currentSystemInfo?.api_version &&
    currentSystemInfo.api_version !== latestVersion &&
    !currentSystemInfo?.is_docker;

  const formik = useFormik({
    initialValues: {
      message: '',
      platform: 'R',
      send_logs: false,
    },
    onSubmit: (values) => {
      toast.processing();

      request('POST', endpoint('/api/v1/support/messages/send'), values)
        .then(() => toast.success('your_message_has_been_received'))
        .finally(() => {
          formik.setSubmitting(false);
          setIsContactVisible(false);
        });
    },
  });

  const refreshData = () => {
    setDisabledButton(true);

    request(
      'POST',
      endpoint('/api/v1/refresh?updated_at=:updatedAt', {
        updatedAt: dayjs().unix(),
      })
    ).then((data) => {
      dispatch(updateCompanyUsers(data.data.data));
      dispatch(resetChanges('company'));
      setDisabledButton(false);
      setCronsNotEnabledModal(false);
    });
  };

  return (
    <nav
      style={{ borderColor: colors.$5 }}
      className={classNames('flex space-x-2.5 py-4 text-white border-t', {
        'justify-end': true,
        'px-2': !isUpdateAvailable,
      })}
    >
      <Tippy
        duration={0}
        content={
          <span style={{ fontSize: isMiniSidebar ? '0.6rem' : '0.75rem' }}>
            {isMiniSidebar ? t('show_menu') : t('hide_menu')}
          </span>
        }
        className="rounded-md text-xs p-2 bg-[#F2F2F2]"
      >
        <div
          className="cursor-pointer"
          onClick={() => handleCollapseExpandSidebar(!isMiniSidebar)}
        >
          {isMiniSidebar ? (
            <OpenNavbarArrow color="#e5e7eb" size="1.5rem" />
          ) : (
            <CloseNavbarArrow color="#e5e7eb" size="1.35rem" />
          )}
        </div>
      </Tippy>
    </nav>
  );
}
