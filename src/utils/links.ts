export function getPlayLinkForTitle(title?: string, href?: string): string | undefined {
  const cleaned = typeof href === 'string' && href.trim() !== '' ? href.trim() : undefined;
  if (cleaned) return cleaned;
  const t = (title || '').toLowerCase();
  if (!t) return undefined;
  if (t.includes('google project management')) {
    return 'https://www.coursera.org/account/accomplishments/specialization/5PD2U8JGW9AN';
  }
  if (t.includes('mckinsey') && t.includes('forward')) {
    return 'https://www.credly.com/badges/760b8c6b-ad58-4fc3-97aa-05e01f0d7692/linked_in_profile';
  }
  if (t.includes('game & app academy') || t.includes('game and app academy')) {
    return 'https://verified.sertifier.com/en/verify/20592417662546/';
  }
  return undefined;
}
