/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2022. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

/**
 * Helper function to get data-component attribute for components in development mode
 * @param componentName - The name of the component
 * @returns Object with data-component attribute if in dev mode, empty object otherwise
 */
export function getComponentAttributes(componentName: string): { 'data-component'?: string } {
  if (import.meta.env.DEV) {
    return { 'data-component': componentName };
  }
  return {};
}

/**
 * Helper function to get component name from file path
 * @param filePath - The file path of the component
 * @returns The component name derived from the file path
 */
export function getComponentNameFromPath(filePath: string): string {
  // Extract filename without extension
  const fileName = filePath.split('/').pop()?.split('\\').pop()?.replace(/\.(tsx|ts)$/, '') || '';
  
  // Convert kebab-case or snake_case to PascalCase
  return fileName
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}
