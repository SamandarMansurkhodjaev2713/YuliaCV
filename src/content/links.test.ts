import { describe, expect, it } from 'vitest';
import { siteContent } from './site';
import { isAllowedSocialUrl } from './links';

describe('site social links', () => {
  it('GIVEN the configured Telegram link WHEN validated THEN it is a safe supported URL', () => {
    expect(isAllowedSocialUrl(siteContent.contacts.telegram)).toBe(true);
  });

  it('GIVEN unsupported or unsafe schemes WHEN validated THEN they are rejected', () => {
    expect(isAllowedSocialUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedSocialUrl('http://t.me/yulleishn')).toBe(false);
    expect(isAllowedSocialUrl('https://example.com/profile')).toBe(false);
  });

  it('GIVEN navigation items WHEN inspected THEN section anchors are unique', () => {
    const anchors = siteContent.navigation.map((item) => item.href);
    expect(new Set(anchors).size).toBe(anchors.length);
  });
});
