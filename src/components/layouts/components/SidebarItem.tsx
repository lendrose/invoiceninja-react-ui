/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { NavigationItem } from './DesktopSidebar';
import { styled } from 'styled-components';
import { useColorScheme } from '$app/common/colors';
import { useInjectUserChanges } from '$app/common/hooks/useInjectUserChanges';
import { useThemeColorScheme } from '$app/pages/settings/user/components/StatusColorTheme';
import classNames from 'classnames';
import { Link } from '$app/components/forms';

const Div = styled.div`
  background-color: ${(props) => props.theme.color};
  &:hover {
    background-color: transparent;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
`;

const LinkStyled = styled(Link)`
  &:hover {
    background-color: transparent;
  }
  
  &:hover span {
    color: inherit;
  }
`;

interface Props {
  item: NavigationItem;
}

export function SidebarItem(props: Props) {
  const { item } = props;

  const colors = useColorScheme();

  const user = useInjectUserChanges();

  const themeColors = useThemeColorScheme();

  const isMiniSidebar = Boolean(
    user?.company_user?.react_settings.show_mini_sidebar
  );

  if (!item.visible) {
    return <></>;
  }

  return (
    <Div
      theme={{
        color: 'transparent',
      }}
      key={item.name}
      className={classNames(
        'flex items-center justify-between group px-1.5 text-sm font-medium rounded-md sidebar-item',
        {
          'border border-white bg-transparent text-gray-300': item.current && colors.$0 === 'dark',
          'border border-white bg-transparent text-white': item.current && colors.$0 === 'light',
          'text-gray-300 border border-transparent hover:border-white/50': !item.current && colors.$0 === 'dark',
          'text-white border border-transparent hover:border-white/50': !item.current && colors.$0 === 'light',
        }
      )}
      style={{
        color: undefined
      }}
    >
      <LinkStyled 
        to={item.href} 
        className="w-full" 
        withoutDefaultStyling
      >
        <div
          className="flex justify-start items-center my-2 space-x-3"
          style={{
            color: themeColors.$4,
          }}
        >
          <item.icon
            size="1.275rem"
            color={
              colors.$0 === 'dark' ? '#3edb93' : '#116DF4'
            }
          />

          {!isMiniSidebar && <span>{item.name}</span>}
        </div>
      </LinkStyled>

      {item.rightButton && !isMiniSidebar && item.rightButton.visible && (
        <div
          className="rounded-sm p-[0.1rem] hover:bg-transparent"
          onMouseEnter={(e) => {
            e.stopPropagation();
          }}
        >
          <LinkStyled
            to={item.rightButton.to}
            withoutDefaultStyling
          >
            <item.rightButton.icon
              size="1.1rem"
              color={
                themeColors.$4 || (colors.$0 === 'dark' ? '#3edb93' : '#116DF4')
              }
            />
          </LinkStyled>
        </div>
      )}
    </Div>
  );
}
