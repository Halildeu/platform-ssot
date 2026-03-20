export const normalizeDesignLabUrlToken = (value: string | null | undefined): string =>
  (value ?? '')
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const normalizeDesignLabUrlTokenCompact = (value: string | null | undefined): string =>
  normalizeDesignLabUrlToken(value).replace(/\s+/g, '');

export const isDesignLabUrlTokenMatch = (
  candidate: string | null | undefined,
  token: string | null | undefined,
): boolean => {
  if (!candidate || !token) return false;
  return normalizeDesignLabUrlToken(candidate) === normalizeDesignLabUrlToken(token);
};

export const isDesignLabUrlTokenFlexibleMatch = (
  candidate: string | null | undefined,
  token: string | null | undefined,
): boolean => {
  if (!candidate || !token) {
    return false;
  }

  const normalizedCandidate = normalizeDesignLabUrlToken(candidate);
  const normalizedToken = normalizeDesignLabUrlToken(token);

  if (normalizedCandidate === normalizedToken) {
    return true;
  }

  const compactCandidate = normalizeDesignLabUrlTokenCompact(candidate);
  const compactToken = normalizeDesignLabUrlTokenCompact(token);

  if (!compactCandidate || !compactToken) {
    return false;
  }

  if (compactCandidate === compactToken) {
    return true;
  }

  return compactCandidate.length >= 4 && compactToken.length >= 4
    ? compactCandidate.includes(compactToken) || compactToken.includes(compactCandidate)
    : false;
};
