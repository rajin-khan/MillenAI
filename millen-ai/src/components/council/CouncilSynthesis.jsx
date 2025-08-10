// /millen-ai/src/components/council/CouncilSynthesis.jsx
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { 
  EyeIcon, EyeSlashIcon, ArrowDownTrayIcon, LightBulbIcon, 
  BeakerIcon, ScaleIcon, ChatBubbleBottomCenterTextIcon 
} from '@heroicons/react/24/outline';

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
      <code className="bg-zinc-700 text-emerald-300 font-mono rounded-md px-1.5 py-1 text-base" {...props}>
        {children}
      </code>
    )
  }
};

// Report Section component
const ReportSection = ({ icon: Icon, title, children, color = "text-emerald-400" }) => (
  <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-zinc-800 rounded-lg border border-zinc-700">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <div className="prose prose-sm sm:prose-base prose-invert max-w-none pl-11 text-zinc-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  </motion.div>
);

const CouncilSynthesis = ({ synthesis, onToggleIndividual, showIndividual, onExport, individualAnalyses }) => {
  const titleMatch = synthesis.match(/\*\*Regarding\*\*:\s*(.+?)(?=\n|$)/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Analysis';

  const finalVerdictMatch = synthesis.match(/##\s*⚖️\s*Final Verdict\s*\n([\s\S]*?)(?=\n##|$)/i);
  const finalVerdict = finalVerdictMatch ? finalVerdictMatch[1].trim() : '';
  
  const councilReasoningMatch = synthesis.match(/##\s*🏛️\s*The Council's Reasoning\s*\n([\s\S]*?)(?=\n---|$)/i);
  const councilReasoning = councilReasoningMatch ? councilReasoningMatch[1].trim() : '';

  return (
    <motion.div 
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} 
      initial="hidden" 
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 truncate" title={title}>
          Council Verdict: {title}
        </h2>
        <div className="flex items-center gap-2 flex-shrink-0">
          {individualAnalyses.length > 0 && (
             <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={onToggleIndividual} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors">
              {showIndividual ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              {showIndividual ? 'Hide Details' : 'Show Details'}
            </motion.button>
          )}
          <motion.button whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={onExport} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-10">
        {finalVerdict ? (
          <ReportSection icon={ScaleIcon} title="Final Verdict" color="text-pink-400">
            {finalVerdict}
          </ReportSection>
        ) : null}
        
        {councilReasoning ? (
          <ReportSection icon={LightBulbIcon} title="The Council's Reasoning">
            {councilReasoning}
          </ReportSection>
        ) : null}

        {/* Fallback for when parsing fails */}
        {!finalVerdict && !councilReasoning && (
           <ReportSection icon={ExclamationCircleIcon} title="Synthesis" color="text-yellow-400">
            {synthesis}
          </ReportSection>
        )}
      </div>
    </motion.div>
  );
};

export default CouncilSynthesis;