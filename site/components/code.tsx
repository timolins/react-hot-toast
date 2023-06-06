import clsx from 'clsx';
import Highlight, {
  defaultProps,
  Language,
  PrismTheme,
} from 'prism-react-renderer';

const theme: PrismTheme = {
  plain: {
    backgroundColor: '#351e11',
    color: '#d6ceff',
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
      types: ['tag', 'operator', 'number', 'module'],
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

function copyToClipboard(text):void {
  navigator.clipboard.writeText(text)
}


export const Code: React.FC<{
  snippet: string;
  language?: Language;
  className?: string;
}> = (props) => {
  const language = props.language || 'jsx';

  return (
    <Highlight
      {...defaultProps}
      code={props.snippet}
      theme={theme}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={clsx(
            props.className,
            className,
            'relative h-full w-full rounded-lg p-4 overflow-x-auto flex flex-col items justify-center'
          )}
          style={style}
        >
          <h1 
            className='text-xs absolute top-2 right-4 opacity-70 hover:opacity-100 cursor-pointer text-gray-400' 
            onClick={() => copyToClipboard(props.snippet)}>
            copy
          </h1>
          {tokens.map((line, i) => {
            if (tokens.length - 1 === i && line[0].empty) {
              return null;
            }

            return (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
};
