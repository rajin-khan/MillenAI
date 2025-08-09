// /millen-ai/src/lib/rehype-inline-styles.js

import { visit } from 'unist-util-visit';

// Helper to convert a JS style object to a CSS string
const styleObjectToString = (style) => {
  return Object.entries(style)
    .map(([key, value]) => `${key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)}: ${value}`)
    .join(';');
};

// The rehype plugin
export function rehypeInlineStyles() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      const baseStyle = {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        color: '#000000',
        backgroundColor: '#ffffff',
        margin: '0',
      };

      let specificStyle = {};

      switch (node.tagName) {
        case 'p':
        case 'li':
          specificStyle = { marginBottom: '16px' };
          break;
        case 'h1':
          specificStyle = { fontSize: '2em', fontWeight: 'bold', margin: '0.67em 0' };
          break;
        case 'h2':
          specificStyle = { fontSize: '1.5em', fontWeight: 'bold', margin: '0.83em 0' };
          break;
        case 'h3':
          specificStyle = { fontSize: '1.17em', fontWeight: 'bold', margin: '1em 0' };
          break;
        case 'a':
          specificStyle = { color: '#0969da', textDecoration: 'underline' };
          break;
        case 'blockquote':
          specificStyle = {
            padding: '0 1em',
            color: '#57606a',
            borderLeft: '.25em solid #d0d7de',
            margin: '0 0 16px',
          };
          break;
        case 'code':
          specificStyle = {
            fontFamily: 'monospace',
            backgroundColor: '#f0f0f0',
            padding: '.2em .4em',
            borderRadius: '6px',
            fontSize: '85%',
          };
          break;
        case 'pre':
          specificStyle = {
            fontFamily: 'monospace',
            backgroundColor: '#f0f0f0',
            padding: '16px',
            overflow: 'auto',
            borderRadius: '6px',
          };
          // For <pre><code>...</code></pre> blocks, ensure the inner code has a transparent bg
          const child = node.children[0];
          if (child && child.tagName === 'code') {
            child.properties = child.properties || {};
            child.properties.style = 'background-color: transparent; padding: 0; border-radius: 0;';
          }
          break;
      }
      
      const finalStyle = { ...baseStyle, ...specificStyle };

      node.properties = node.properties || {};
      node.properties.style = styleObjectToString(finalStyle);
    });
  };
}