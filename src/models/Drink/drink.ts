export const types = ['natural', 'synthetic'] as const;
export type ITYPE = typeof types[number];
