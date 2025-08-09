// /millen-ai/src/lib/markdownUtils.js

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { toString } from 'mdast-util-to-string';
import { rehypeInlineStyles } from './rehype-inline-styles'; // Import our custom plugin

/**
 * The unified processor to convert Markdown to an HTML string with inline styles.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeInlineStyles) // Apply our custom inline styles plugin
  .use(rehypeStringify);

/**
 * Converts a Markdown string into a styled HTML string suitable for the clipboard.
 * @param {string} markdown - The Markdown string to convert.
 * @returns {Promise<string>} A promise that resolves to the HTML string.
 */
export async function markdownToHtml(markdown) {
  if (!markdown) return '';
  const file = await processor.process(markdown);
  return String(file);
}

/**
 * Converts a Markdown string into a plain text representation.
 * @param {string} markdown - The Markdown string to convert.
 * @returns {string} The plain text content.
 */
export function markdownToPlainText(markdown) {
    if (!markdown) return '';
    const tree = unified().use(remarkParse).parse(markdown);
    return toString(tree);
}