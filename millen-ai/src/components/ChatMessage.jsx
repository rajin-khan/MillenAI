// /millen-ai/src/components/ChatMessage.jsx

import { motion } from 'framer-motion';
import { UserCircleIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/24/solid';
import { Disclosure, Transition } from '@headlessui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import FileIcon from './FileIcon';

const parseReasoningString = (reasoning) => {
  if (!reasoning) return [];
  
  const regex = /(URL:[\s\S]*?)(?=URL:|$)/g;
  const parts = reasoning.split(regex).filter(part => part && part.trim() !== '');

  return parts.map((part, index) => {
    if (part.startsWith('URL:')) {
      const content = part.substring(4).trim();
      const searchResultsMarker = 'Search Results';
      const markerIndex = content.indexOf(searchResultsMarker);
      
      let url, searchResults;
      if (markerIndex !== -1) {
        url = content.substring(0, markerIndex).trim().split('\n')[0];
        searchResults = content.substring(markerIndex + searchResultsMarker.length).trim();
      } else {
        const lines = content.split('\n');
        url = lines[0];
        searchResults = lines.slice(1).join('\n');
      }

      searchResults = searchResults.replace(/L\d+:\s?/g, '\n').replace(/†/g, ' - ').replace(/【\d+\s-\s/g, '【').trim();
      
      return { type: 'search', url, searchResults, id: `search-${index}` };
    }
    
    return { type: 'text', content: part, id: `text-${index}` };
  });
};

const ReasoningViewer = ({ reasoning }) => {
  const parsedSteps = parseReasoningString(reasoning);

  return (
    <div className="space-y-2">
      {parsedSteps.map((step, index) => {
        if (step.type === 'search') {
          return (
            <Disclosure key={step.id}>
              {({ open }) => (
                <div className="bg-zinc-900/50 rounded-lg border border-zinc-700/80">
                  <Disclosure.Button className="w-full flex justify-between items-center p-3 text-left text-xs">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <LinkIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="font-mono font-medium text-zinc-300 truncate">
                        Source {index + 1}: {new URL(step.url).hostname}
                      </span>
                    </div>
                    <ChevronDownIcon className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                  </Disclosure.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform -translate-y-2 opacity-0"
                    enterTo="transform translate-y-0 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform translate-y-0 opacity-100"
                    leaveTo="transform -translate-y-2 opacity-0"
                  >
                    <Disclosure.Panel className="px-3 pb-3 text-zinc-400">
                      <pre className="whitespace-pre-wrap font-mono text-xs bg-black/30 p-3 rounded-md overflow-x-auto">
                        {step.searchResults}
                      </pre>
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )}
            </Disclosure>
          );
        }
        
        return (
          <div key={step.id} className="prose prose-sm prose-invert max-w-none text-zinc-300 bg-zinc-900/50 rounded-lg border border-zinc-700/80 p-3">
             <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.content}</ReactMarkdown>
          </div>
        );
      })}
    </div>
  );
};

const ChatMessage = ({ message }) => {
  const { role, content, reasoning, displayText, attachments } = message;
  const isUser = role === 'user';
  
  const codeBlockStyle = {
    padding: '1rem',
    margin: '0',
    fontSize: '14px',
    lineHeight: '1.5',
  };

  const markdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold my-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-bold my-2" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500 pl-4 my-4 italic text-zinc-400" {...props} />,
    a: ({node, ...props}) => <a className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    table: ({node, ...props}) => <table className="table-auto w-full my-4 border-collapse border border-zinc-600" {...props} />,
    thead: ({node, ...props}) => <thead className="bg-zinc-800" {...props} />,
    th: ({node, ...props}) => <th className="border border-zinc-600 px-4 py-2 text-left font-semibold" {...props} />,
    td: ({node, ...props}) => <td className="border border-zinc-600 px-4 py-2" {...props} />,
    hr: ({node, ...props}) => <hr className="my-4 border-zinc-700" {...props} />,
    p: ({node, ...props}) => <p className="mb-2" {...props} />,
    img: ({node, ...props}) => <img className="max-w-full my-4 rounded-lg border border-zinc-700 inline-block" {...props} />,
    code({node, inline, className, children, ...props}) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="my-2 rounded-lg overflow-hidden border border-zinc-700/50">
          <SyntaxHighlighter style={dracula} customStyle={codeBlockStyle} language={match[1]} PreTag="div" {...props}>
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
      className={`flex gap-3 sm:gap-4 p-4 my-2 rounded-xl transition-colors duration-300 ${isUser ? '' : 'bg-[#1C1C1C]/40'}`}
    >
      <div className="w-8 h-8 flex-shrink-0 rounded-full mt-0.5">
        {isUser ? (
          <UserCircleIcon className="w-full h-full text-zinc-500" />
        ) : (
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600" />
        )}
      </div>
      
      <div className="flex flex-col flex-1 overflow-x-auto">
        <span className="font-bold text-white text-base">{isUser ? 'You' : 'MillenAI'}</span>
        
        <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-zinc-200">
          {isUser ? (
            <div>
              {attachments && attachments.length > 0 && (
                <div className="not-prose flex flex-wrap gap-2 my-2">
                  {attachments.map((att, index) => (
                    // Display image previews if available, otherwise file icons
                    att.previewUrl ? (
                       <img key={index} src={att.previewUrl} alt={att.name} className="h-24 w-auto object-cover rounded-lg border border-zinc-700" />
                    ) : (
                      <div key={index} className="flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 border border-zinc-700">
                        <FileIcon fileType={att.type} className="w-5 h-5 flex-shrink-0" />
                        <span className="truncate">{att.name}</span>
                      </div>
                    )
                  ))}
                </div>
              )}
              {/* --- THE FIX --- */}
              {/* Render the user's typed text. Use a fallback for old messages without `displayText`. */}
              {/* Using a <p> tag ensures consistent spacing even if the text is empty. */}
              <p>{displayText ?? content}</p>
            </div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          )}
        </div>
        
        {reasoning && (
           <Disclosure as="div" className="mt-4">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors">
                  <span>{open ? 'Hide' : 'Show'} Reasoning</span>
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform -translate-y-2 opacity-0"
                  enterTo="transform translate-y-0 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform translate-y-0 opacity-100"
                  leaveTo="transform -translate-y-2 opacity-0"
                >
                  <Disclosure.Panel className="mt-2">
                     <ReasoningViewer reasoning={reasoning} />
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;