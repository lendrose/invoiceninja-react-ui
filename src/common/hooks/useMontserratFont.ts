import { useMemo } from 'react';

export interface MontserratFontStyles {
  fontFamily: string;
  fontOpticalSizing: string;
  fontWeight: number;
  fontStyle: string;
}

export const useMontserratFont = (weight: number = 400, style: 'normal' | 'italic' = 'normal') => {
  return useMemo(() => ({
    fontFamily: '"Montserrat", sans-serif',
    fontOpticalSizing: 'auto',
    fontWeight: weight,
    fontStyle: style,
  }), [weight, style]);
};

// Predefined weight constants for easy usage
export const MONSERRAT_WEIGHTS = {
  THIN: 100,
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMIBOLD: 600,
  BOLD: 700,
  EXTRABOLD: 800,
  BLACK: 900,
} as const;

// Utility function to get Tailwind classes
export const getMontserratClasses = (weight: number = 400) => {
  const weightMap: Record<number, string> = {
    100: 'font-montserrat-thin',
    300: 'font-montserrat-light',
    400: 'font-montserrat-regular',
    500: 'font-montserrat-medium',
    600: 'font-montserrat-semibold',
    700: 'font-montserrat-bold',
    800: 'font-montserrat-extrabold',
    900: 'font-montserrat-black',
  };
  
  return weightMap[weight] || 'font-montserrat';
};
