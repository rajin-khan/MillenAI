// /millen-ai/src/components/council/CouncilMemberCard.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon, LightBulbIcon, BeakerIcon, ScaleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

const statusPhrases = {
  researching: ["Searching the web...", "Gathering sources...", "Finding data..."],
  analyzing: ["Identifying patterns...", "Drawing connections...", "Forming insights..."],
  pondering: ["Considering ethics...", "Exploring alternatives...", "Questioning assumptions..."],
  judging: ["Weighing evidence...", "Synthesizing findings...", "Forming a verdict..."],
};

const CouncilMemberCard = ({ member, status }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  const cardVariants = { hidden: { opacity: 0, y: 20, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };

  const statusMap = {
    pending: { icon: ClockIcon, text: 'Pending', color: 'text-zinc-500' },
    researching: { icon: BeakerIcon, text: 'Researching', color: 'text-cyan-400' },
    analyzing: { icon: LightBulbIcon, text: 'Analyzing', color: 'text-yellow-400' },
    pondering: { icon: ChatBubbleBottomCenterTextIcon, text: 'Pondering', color: 'text-purple-400' },
    judging: { icon: ScaleIcon, text: 'Judging', color: 'text-pink-400' },
    complete: { icon: CheckCircleIcon, text: 'Complete', color: 'text-emerald-400' },
    error: { icon: ExclamationCircleIcon, text: 'Error', color: 'text-red-400' },
  };

  const currentStatus = statusMap[status?.status] || statusMap.pending;
  const IconComponent = currentStatus.icon;
  const isActive = ['researching', 'analyzing', 'pondering', 'judging'].includes(status?.status);

  useEffect(() => {
    let interval;
    if (isActive) {
      const phrases = statusPhrases[status.status];
      interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }, 2000);
    } else {
      setPhraseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isActive, status?.status]);

  const phrases = statusPhrases[status?.status] || [currentStatus.text];

  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col items-center justify-center text-center p-4 rounded-2xl border bg-zinc-900/50 backdrop-blur-sm"
      style={{ borderColor: member.color, '--glow-color': member.color }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            boxShadow: [
              "0 0 10px 0px var(--glow-color, #fff) inset",
              "0 0 25px 2px var(--glow-color, #fff)",
              "0 0 10px 0px var(--glow-color, #fff) inset"
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span className="text-4xl mb-2">{member.avatar}</span>
      <h4 className="font-bold text-white" style={{color: member.color}}>{member.role}</h4>
      <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-semibold h-4 ${currentStatus.color}`}>
        <motion.div
          animate={isActive ? { rotate: 360, scale: [1, 1.2, 1] } : {}}
          transition={isActive ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
        >
          <IconComponent className="w-4 h-4" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={`${status?.status}-${phraseIndex}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {phrases[phraseIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
export default CouncilMemberCard;