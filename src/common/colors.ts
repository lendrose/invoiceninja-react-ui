/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

import { useReactSettings } from './hooks/useReactSettings';

// export const $1 = {
//   name: 'invoiceninja.dark',
//   $0: 'dark',
//   $1: '#182433',
//   $2: '#151f2c',
//   $3: '#ffffff',
//   $4: '#1f2e41',
//   $5: '#1f2e41',
//   $6: '#151f2c',
//   $7: '#151f2c',
//   $8: '#1f2e41',
//   $9: '#ffffff',
// };

export const darkColorScheme = {
  name: 'invoiceninja.dark',
  $0: 'dark',
  $1: '#241F21', // Main dark background from SVG
  $2: '#2A2527', // Slightly lighter for cards/surfaces
  $3: '#f8fafc', // Primary text
  $4: '#3A3537', // Primary border
  $5: '#3A3537', // Secondary border (sidebar)
  $6: '#2A2527', // Secondary background
  $7: '#2A2527', // Primary hover
  $8: '#3A3537', // Secondary hover
  $9: '#f8fafc', // Accent color text
  $10: 0.87, // High emphasis text
  $11: 0.6, // Medium emphasis text
  $12: 0.38, // Disabled text
  $13: '#E5E7EB', // Navbar right icon hover
  $14: '#241F21', // Navigation bar background color
  $15: '#2A2527', // Light gray background
  $16: '#94a3b8', // Dark gray icon
  $17: '#94a3b8', // Placeholder text, table header text color
  $18: '#3EDB93', // Button background color (Green accent from SVG)
  $19: '#3A3537', // Light border color
  $20: '#2A2527', // Dropdown element hover background color
  $21: '#3A3537', // Divider color
  $22: '#94a3b8', // Label color
  $23: '#241F21', // Content background color
  $24: '#3A3537', // Border color
  $25: '#2A2527', // Hover element background color
};

export const lightColorScheme = {
  name: 'invoiceninja.light',
  $0: 'light',
  $1: '#ffffff', // Primary background
  $2: '#f1f5f9', // Secondary background
  $3: '#0f172a', // Primary text
  $4: '#e2e8f0', // Primary border
  $5: '#e2e8f0', // Secondary border (sidebar)
  $6: '#f1f5f9', // Secondary background
  $7: '#f1f5f9', // Primary hover
  $8: '#e2e8f0', // Secondary hover
  $9: '#ffffff', // Accent color text
  $10: 1, // High emphasis text
  $11: 0.8, // Secondary text opacity
  $12: 0.5, // Disabled text opacity
  $13: '#E5E7EB', // Navbar right icon hover
  $14: '#ffffff', // Navigation bar background color
  $15: '#f1f5f9', // Light gray background
  $16: '#64748b', // Dark gray icon
  $17: '#64748b', // Placeholder text, table header text color
  $18: '#116DF4', // Button background color
  $19: '#e2e8f0', // Light border color
  $20: '#f1f5f9', // Dropdown element hover background color
  $21: '#e2e8f0', // Divider color
  $22: '#64748b', // Label color
  $23: '#ffffff', // Content background color
  $24: '#e2e8f0', // Border color
  $25: '#f1f5f9', // Hover element background color
};

export function useColorScheme() {
  const reactSettings = useReactSettings({ overwrite: false });

  return reactSettings.dark_mode ? darkColorScheme : lightColorScheme;
}
