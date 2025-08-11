// /millen-ai/src/components/council/CouncilInterface.jsx

import { useCouncilSession } from '../../hooks/useCouncilSession.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ChatBubbleBottomCenterTextIcon, LightBulbIcon, BeakerIcon, ExclamationCircleIcon, ScaleIcon } from '@heroicons/react/24/outline';
import CouncilMemberCard from './CouncilMemberCard';
import CouncilProgress from './CouncilProgress';
import CouncilSynthesis from './CouncilSynthesis';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeBlockStyle = { padding: '1rem', margin: '0', fontSize: '14px', lineHeight: '1.6' };

const markdownComponents = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-6 mb-3 border-b border-zinc-700 pb-2" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-6 my-2" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-2" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-emerald-500/50 pl-4 my-4 italic text-zinc-400" {...props} />,
    a: ({node, ...props}) => <a className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    table: ({node, ...props}) => <div className="overflow-x-auto my-4"><table className="table-auto w-full border-collapse border border-zinc-600" {...props} /></div>,
    thead: ({node, ...props}) => <thead className="bg-zinc-800" {...props} />,
    th: ({node, ...props}) => <th className="border border-zinc-600 px-4 py-2 text-left font-semibold" {...props} />,
    td: ({node, ...props}) => <td className="border border-zinc-600 px-4 py-2" {...props} />,
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
    },
    hr: () => <hr className="my-6 border-zinc-700/50" />
};

const ReportSection = ({ icon: Icon, title, children, color = "text-emerald-400" }) => (
  <motion.div layout variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-zinc-800 rounded-lg border border-zinc-700">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
    </div>
    <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-zinc-300">
       <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{children}</ReactMarkdown>
    </div>
  </motion.div>
);

const CouncilInterface = () => {
  const { 
    sessionPhase, phaseMessage, activeMembers, memberStatuses, synthesisResult, 
    resetCouncil, showIndividualResponses, toggleIndividualResponses
  } = useCouncilSession();
  
  let effectivePhase = sessionPhase;
  const activeStatus = Object.values(memberStatuses).find(s => ['researching', 'analyzing', 'pondering', 'judging'].includes(s.status));
  if (activeStatus) {
    effectivePhase = activeStatus.status;
  }
  
  const progressMap = { 
    'selecting': 10, 
    'researching': 35, 
    'analyzing': 60, 
    'pondering': 75, 
    'judging': 90, 
    'synthesizing': 95, 
    'complete': 100, 
    'error': 100 
  };
  const progress = progressMap[effectivePhase] || 0;
  
  if (sessionPhase === 'idle') return null;

  const parseSynthesis = (text) => {
    const finalVerdictMatch = text.match(/##\s*⚖️\s*Final Verdict\s*([\s\S]*?)(?=##\s*🏛️\s*The Council's Reasoning|$)/i);
    const councilReasoningMatch = text.match(/##\s*🏛️\s*The Council's Reasoning\s*([\s\S]*?)(?=---|\n## \[|$)/i);
    return {
      finalVerdict: finalVerdictMatch ? finalVerdictMatch[1].trim() : '',
      councilReasoning: councilReasoningMatch ? councilReasoningMatch[1].trim() : '',
    };
  };

  const parseIndividualAnalyses = (text) => {
    const roles = ["The Researcher", "The Analyst", "The Philosopher"];
    const analyses = [];
    roles.forEach(role => {
      const regex = new RegExp(`--- \\[${role} START\\] ---\\s*([\\s\\S]*?)\\s*--- \\[${role} END\\] ---`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        analyses.push({ role, content: match[1].trim() });
      }
    });
    return analyses;
  };
  
  const { finalVerdict, councilReasoning } = parseSynthesis(synthesisResult);
  const individualAnalyses = parseIndividualAnalyses(synthesisResult);
  const sectionIcons = { "The Researcher": BeakerIcon, "The Analyst": LightBulbIcon, "The Philosopher": ChatBubbleBottomCenterTextIcon };
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
  
  const cardPositions = [
    { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' },
    { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' },
    { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' },
    { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center p-4 sm:p-6 text-white overflow-hidden">
      <div className="w-full max-w-5xl flex flex-col flex-grow h-full min-h-0">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-shrink-0 flex items-start justify-between mb-6"
        >
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl font-bold">🏛️ AI Council is in Session</h2>
          </div>
          <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={resetCouncil} className="p-2 bg-zinc-800/50 rounded-full">
            <XMarkIcon className="w-6 h-6 text-zinc-400" />
          </motion.button>
        </motion.div>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2 scroll-smooth">
          <AnimatePresence mode="wait">
            {sessionPhase !== 'complete' && sessionPhase !== 'error' ? (
              <motion.div 
                key="processing" 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="flex flex-col items-center justify-center h-full"
              >
                <div className="relative w-[32rem] h-[32rem] scale-75 sm:scale-100">
                  <div 
                    className="absolute inset-0 opacity-10" 
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #14B8A6 0%, transparent 70%)' }} 
                  />
                  <div className="relative w-full h-full">
                    {activeMembers.map((member, index) => (
                      // THIS IS THE FIX: This is now a simple div. The card handles its own animation.
                      <div
                        key={member.id}
                        className="absolute w-40"
                        style={cardPositions[index]}
                      >
                         <CouncilMemberCard member={member} status={memberStatuses[member.id]} />
                      </div>
                    ))}
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <CouncilProgress progress={progress} phaseMessage={phaseMessage} />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="synthesis" className="space-y-6">
                 <CouncilSynthesis
                  synthesis={synthesisResult}
                  onToggleIndividual={toggleIndividualResponses}
                  showIndividual={showIndividualResponses}
                  onExport={() => alert('Exporting...')}
                  individualAnalyses={individualAnalyses}
                />
                <div className="space-y-6">
                  {finalVerdict && <ReportSection icon={ScaleIcon} title="Final Verdict" color="text-pink-400">{finalVerdict}</ReportSection>}
                  {councilReasoning && <ReportSection icon={LightBulbIcon} title="The Council's Reasoning">{councilReasoning}</ReportSection>}
                  {!finalVerdict && !councilReasoning && <ReportSection icon={ExclamationCircleIcon} title="Full Synthesis" color="text-yellow-400">{synthesisResult}</ReportSection>}
                </div>
                <AnimatePresence>
                  {showIndividualResponses && (
                    <motion.div 
                      variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
                      className="space-y-6 pt-6 border-t border-zinc-700/50"
                    >
                      {individualAnalyses.map(({ role, content }) => (
                         <ReportSection key={role} icon={sectionIcons[role]} title={`${role}'s Full Analysis`}>
                            {content}
                         </ReportSection>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
          {sessionPhase === 'error' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center p-8 bg-red-900/30 border border-red-500/50 rounded-lg">
                <h3 className="text-lg font-bold text-red-400">A Council error occurred.</h3>
                <p className="text-red-400/80 mt-2">{synthesisResult}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouncilInterface;