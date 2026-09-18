import type { ContentBlock } from './types';

/**
 * A small, forgiving markup used by the admin editor so a story can be written
 * as plain text yet carry structure — headings, quotes, notes and pictures —
 * without a heavy rich-text editor. It converts to and from the `ContentBlock`
 * array the article pages render.
 *
 * Syntax (one construct per line, blocks separated by blank lines):
 *   # Heading text
 *   > A pulled quote — Attribution
 *   ![alt text](https://…/photo.jpg "Optional caption")
 *   [note:Label] Editorial note text
 *   Anything else becomes a paragraph.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60) || 'section';
}

const HEADING = /^#{1,6}\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const IMAGE = /^!\[(.*?)\]\(\s*(\S+?)(?:\s+"(.*?)")?\s*\)$/;
const NOTE = /^\[note:(.+?)\]\s*(.*)$/i;

export function markupToBlocks(raw: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      const text = paragraph.join(' ').trim();
      if (text) blocks.push({ type: 'paragraph', text });
      paragraph = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }

    const heading = trimmed.match(HEADING);
    if (heading) {
      flush();
      const text = heading[1].trim();
      blocks.push({ type: 'heading', id: slugify(text), text });
      continue;
    }

    const image = trimmed.match(IMAGE);
    if (image) {
      flush();
      blocks.push({
        type: 'image',
        alt: image[1].trim() || undefined,
        url: image[2].trim(),
        caption: image[3]?.trim() || undefined,
      });
      continue;
    }

    const note = trimmed.match(NOTE);
    if (note) {
      flush();
      blocks.push({ type: 'note', label: note[1].trim(), text: note[2].trim() });
      continue;
    }

    const quote = trimmed.match(QUOTE);
    if (quote) {
      flush();
      const body = quote[1].trim();
      const split = body.split(/\s+[—–-]\s+/);
      if (split.length > 1) {
        const attribution = split.pop()!.trim();
        blocks.push({ type: 'quote', text: split.join(' — ').trim(), attribution });
      } else {
        blocks.push({ type: 'quote', text: body, attribution: '' });
      }
      continue;
    }

    paragraph.push(trimmed);
  }

  flush();
  return blocks;
}

export function blocksToMarkup(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case 'heading':
          return `# ${block.text}`;
        case 'quote':
          return block.attribution ? `> ${block.text} — ${block.attribution}` : `> ${block.text}`;
        case 'note':
          return `[note:${block.label}] ${block.text}`;
        case 'image': {
          const caption = block.caption ? ` "${block.caption}"` : '';
          return `![${block.alt ?? ''}](${block.url}${caption})`;
        }
        default:
          return block.text;
      }
    })
    .join('\n\n');
}
