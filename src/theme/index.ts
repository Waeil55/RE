export const colors = {
  // Primary Palette
  primary: '#0F172A',       // deep navy
  primaryLight: '#1E293B',  // card backgrounds
  accent: '#38BDF8',        // sky blue
  accentGold: '#F59E0B',    // premium gold
  accentGreen: '#10B981',   // success
  accentRed: '#EF4444',     // danger

  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8FAFC',
  gray50: '#F1F5F9',
  gray100: '#E2E8F0',
  gray200: '#CBD5E1',
  gray300: '#94A3B8',
  gray400: '#64748B',
  gray500: '#475569',
  gray600: '#334155',
  gray700: '#1E293B',
  gray800: '#0F172A',

  // Glass / Overlay
  glass: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(15,23,42,0.75)',
  overlayLight: 'rgba(15,23,42,0.4)',

  // Gradients (used as arrays)
  gradientPrimary: ['#0F172A', '#1a2d5a'],
  gradientAccent: ['#0EA5E9', '#38BDF8'],
  gradientGold: ['#D97706', '#F59E0B', '#FCD34D'],
  gradientCard: ['rgba(30,41,59,0.9)', 'rgba(15,23,42,0.95)'],
  gradientHero: ['#0F172A', '#0c1f3d', '#0F172A'],
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  accent: {
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  gold: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
};
