import { motion } from 'framer-motion';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const BlinkingCursor = () => (
  <span className="inline-block w-2 h-5 ml-1 bg-white animate-pulse" />
);

const ChatMessage = ({ message, isLoading }) => {
  const { role, content } = message;
  const isUser = role === 'user';
  const isAssistant = role === 'assistant';

  const codeBlockStyle = {
    padding: '1rem',
    margin: '0',
    fontSize: '14px',
    lineHeight: '1.5',
  };

  // Custom components for rendering Markdown elements with Tailwind CSS
  const markdownComponents = {
    // Headings
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
    // Lists
    ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    // Blockquotes
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-4 my-4 italic text-zinc-400" {...props} />,
    // Links
    a: ({node, ...props}) => <a className="text-cyan-400 hover:underline" {...props} />,
    // Tables
    table: ({node, ...props}) => <table className="table-auto w-full my-4 border-collapse border border-zinc-600" {...props} />,
    thead: ({node, ...props}) => <thead className="bg-zinc-800" {...props} />,
    th: ({node, ...props}) => <th className="border border-zinc-600 px-4 py-2 text-left font-semibold" {...props} />,
    td: ({node, ...props}) => <td className="border border-zinc-600 px-4 py-2" {...props} />,
    // Horizontal Rule
    hr: ({node, ...props}) => <hr className="my-4 border-zinc-700" {...props} />,
    // Paragraphs
    p: ({node, ...props}) => <p className="mb-2" {...props} />,
    
    // **NEWLY ADDED IMAGE STYLING**
    img: ({node, ...props}) => <img className="max-w-full my-4 rounded-lg border border-zinc-700 inline-block" {...props} />,

    // Code blocks and inline code
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-2 rounded-lg overflow-hidden border border-zinc-700/50">
          <SyntaxHighlighter
            style={dracula}
            customStyle={codeBlockStyle}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-zinc-700 text-emerald-300 font-mono rounded-md px-1.5 py-1 text-sm" {...props}>
          {children}
        </code>
      )
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className={`flex gap-4 p-4 my-2 rounded-xl transition-shadow duration-300 ${isUser ? 'bg-zinc-800/50' : ''} hover:bg-zinc-800/30`}
    >
      {isUser ? (
        <UserCircleIcon className="w-8 h-8 flex-shrink-0 text-zinc-400" />
      ) : (
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600" />
      )}
      <div className="flex flex-col flex-1 overflow-x-auto">
        <span className="font-bold text-white">{isUser ? 'You' : 'MillenAI'}</span>
        <div className="prose prose-invert max-w-none text-zinc-200">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
          {isAssistant && isLoading && <BlinkingCursor />}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;