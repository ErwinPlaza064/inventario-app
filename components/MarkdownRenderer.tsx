import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content text-sm sm:text-base text-gray-600 dark:text-gray-300">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({node, ...props}: any) => <h1 className="text-2xl font-black mb-4 uppercase tracking-tight border-b-2 border-current pb-2" {...props} />,
          h2: ({node, ...props}: any) => <h2 className="text-xl font-bold mb-3 mt-6 uppercase tracking-wide" {...props} />,
          h3: ({node, ...props}: any) => <h3 className="text-lg font-bold mb-2 mt-4" {...props} />,
          p: ({node, ...props}: any) => <p className="mb-4 leading-relaxed whitespace-pre-wrap" {...props} />,
          ul: ({node, ...props}: any) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
          ol: ({node, ...props}: any) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
          li: ({node, ...props}: any) => <li className="pl-1" {...props} />,
          blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-1 italic my-4 bg-gray-50 dark:bg-gray-800/50 rounded-r-lg" {...props} />,
          code: ({node, inline, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '')
            return !inline ? (
              <div className="bg-gray-900 rounded-xl p-4 my-4 overflow-x-auto shadow-inner text-sm">
                  <code className="text-gray-100 font-mono" {...props}>
                      {children}
                  </code>
              </div>
            ) : (
              <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm font-bold text-pink-500 dark:text-pink-400" {...props}>
                {children}
              </code>
            )
          },
          a: ({node, ...props}: any) => <a className="text-blue-500 hover:underline font-bold" target="_blank" rel="noopener noreferrer" {...props} />,
          table: ({node, ...props}: any) => <div className="overflow-x-auto mb-4 rounded-lg border border-gray-200 dark:border-gray-700"><table className="w-full text-left border-collapse" {...props} /></div>,
          th: ({node, ...props}: any) => <th className="bg-gray-100 dark:bg-gray-800 p-3 font-bold border-b border-gray-200 dark:border-gray-700" {...props} />,
          td: ({node, ...props}: any) => <td className="p-3 border-b border-gray-100 dark:border-gray-800" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
