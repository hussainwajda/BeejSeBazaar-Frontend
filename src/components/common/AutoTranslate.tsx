'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/hooks/useLanguage';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';

function collectTextNodes(root: Node): Text[] {
  const filter: NodeFilter = {
    acceptNode(node: Node): number {
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT;
      const text = node.nodeValue.trim();
      if (!text) return NodeFilter.FILTER_REJECT;
      const parent = (node as ChildNode).parentElement as HTMLElement | null;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName.toLowerCase();
      const skipTags = new Set(['script', 'style', 'noscript', 'code', 'pre', 'svg', 'canvas', 'input', 'textarea']);
      if (skipTags.has(tag)) return NodeFilter.FILTER_REJECT;
      if (parent.hasAttribute('data-no-translate')) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  } as unknown as NodeFilter;

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, filter as any);

  const nodes: Text[] = [];
  let current: Node | null = walker.nextNode();
  while (current) {
    nodes.push(current as Text);
    current = walker.nextNode();
  }
  return nodes;
}

export default function AutoTranslate() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const lastRunKey = useRef<string>('');

  useEffect(() => {
    const run = async () => {
      if (typeof window === 'undefined') return;
      if (!document?.body) return;
      if (!language || language === 'en') return;

      const key = `${pathname}:${language}`;
      if (lastRunKey.current === key) return;
      lastRunKey.current = key;

      const nodes = collectTextNodes(document.body);
      console.log('[AutoTranslate] nodes collected', nodes.length, { pathname, language });
      if (nodes.length === 0) return;
      const originalTexts = nodes.map((n) => n.nodeValue || '');

      try {
        console.log('[AutoTranslate] calling', API_ENDPOINTS.translateTexts);
        const translated = await apiClient.post<string[]>(API_ENDPOINTS.translateTexts, {
          to: language,
          texts: originalTexts,
        });
        nodes.forEach((n, i) => {
          const newText = translated[i];
          if (typeof newText === 'string' && newText.length > 0) {
            n.nodeValue = newText;
          }
        });
        console.log('[AutoTranslate] applied translations');
      } catch (e) {
        // Fail silently; the page will remain in original language
        console.error('[AutoTranslate] failed', e);
      }
    };

    // Run after paint
    const id = window.requestAnimationFrame(() => {
      setTimeout(run, 100);
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname, language]);

  return null;
}


