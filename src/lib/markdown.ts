// @ts-ignore
import MarkdownIt from 'markdown-it';
import MarkdownItAsync from 'markdown-it-async';

// replaces @variableName@ with the value of the variable
export function replaceVariables(
  markdown: string,
  variables: Record<string, string> = {},
): string {
  const allVariables: Record<string, string> = {
    ...variables,
    currentYear: new Date().getFullYear().toString(),
  };

  return markdown?.replace(/@([^@]+)@/g, (match, p1) => {
    return allVariables[p1] || match;
  });
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
});

export function markdownToHtml(markdown: string, isInline = true): string {
  try {
    if (isInline) {
      return md.renderInline(markdown);
    } else {
      return md.render(markdown);
    }
  } catch (e) {
    return markdown;
  }
}

// This is a workaround for the issue with tiptap-markdown extension
// It doesn't support links with escaped brackets like this:
// \\[link\\](https://example.com) -> [link](https://example.com)
export function sanitizeMarkdown(markdown: string) {
  return markdown.replace(/\\\[([^\\]+)\\\]\(([^\\]+)\)/g, '[$1]($2)');
}

const markdownItAsync = MarkdownItAsync({
  html: true,
  linkify: true,

  async highlight(code, lang, attrs) {
    const { codeToHtml } = await import('shiki');

    const html = await codeToHtml(code, {
      lang: lang?.toLowerCase(),
      theme: 'dracula',
    }).catch((e) => {
      console.warn(e);
      return code;
    });

    return html;
  },
});

export async function markdownToHtmlWithHighlighting(markdown: string) {
  try {
    // Solution to open links in new tab in markdown
    // otherwise default behaviour is to open in same tab
    //
    // SOURCE: https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    const defaultRender =
      markdownItAsync.renderer.rules.link_open ||
      function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };

    markdownItAsync.renderer.rules.link_open = function (
      tokens,
      idx,
      options,
      env,
      self,
    ) {
      // Add a new `target` attribute, or replace the value of the existing one.
      tokens[idx].attrSet('target', '_blank');

      // Pass the token to the default renderer.
      return defaultRender(tokens, idx, options, env, self);
    };

    return markdownItAsync.renderAsync(markdown);
  } catch (e) {
    return markdown;
  }
}
