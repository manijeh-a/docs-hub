/* eslint-disable @typescript-eslint/no-explicit-any */
import { headingRank } from 'hast-util-heading-rank';
import { toString } from 'hast-util-to-string';
import { visit } from 'unist-util-visit';
import type { NodeHeading } from '~/src/types';

export function rehypeExtractHeadings({
  headings,
  slug,
}: {
  headings: NodeHeading[];
  slug: string;
}) {
  return () => (tree: any) => {
    visit(tree, 'element', (node) => {
      node.properties['data-latest'] = slug.includes('/latest');
      const rank = headingRank(node);
      if (rank) {
        node.properties['data-rank'] = `h${rank}`;
      }
      if (rank && node?.type === 'element') {
        const firstChild = node.children?.[0];
        if (firstChild?.tagName === 'a') {
          node.children[0] = firstChild.children?.[0];
        }
      }
      if (rank === 2 && node?.type === 'element') {
        headings.push({
          title: toString(node),
          id: node.properties.id?.toString(),
        });
      }
      if (rank === 3 && node?.type === 'element') {
        const last = headings[headings.length - 1];
        if (last) {
          last.children = last?.children || [];
          last.children.push({
            title: toString(node),
            id: node.properties.id.toString(),
          });
        }
      }
    });
  };
}
