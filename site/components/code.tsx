import clsx from 'clsx';
import Highlight, { defaultProps, PrismTheme } from 'prism-react-renderer';

const theme: PrismTheme = {
  plain: {
    backgroundColor: '#2a2734',
    color: '#9a86fd',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
      style: {
        color: '#6c6783',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['tag', 'operator', 'number'],
      style: {
        color: '#e09142',
      },
    },
    {
      types: ['property', 'function'],
      style: {
        color: '#9a86fd',
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: '#eeebff',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: '#c4b9fe',
      },
    },
    {
      types: [
        'boolean',
        'string',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
        'variable',
      ],
      style: {
        color: '#ffcc99',
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['important'],
      style: {
        color: '#c4b9fe',
      },
    },
  ],
};

export const Code: React.FC<{
  snippet: string;
}> = ({ snippet }) => (
  <Highlight
    {...defaultProps}
    code={snippet}
    theme={theme}
    language={'javascript'}
  >
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre
        className={clsx(className, 'h-full w-full rounded p-4')}
        style={style}
      >
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);
