// /millen-ai/src/components/council/CouncilMemberCard.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import CodeScroller from './CodeScroller';

const statusPhrases = {
  researching: ["Searching web...", "Gathering data...", "Finding sources..."],
  analyzing: ["Connecting dots...", "Forming insights...", "Seeing patterns..."],
  pondering: ["Considering ethics...", "Exploring angles...", "Deep thinking..."],
  judging: ["Weighing evidence...", "Synthesizing...", "Delivering verdict..."],
};

const CouncilMemberCard = ({ member, status }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  const statusMap = {
    pending: { icon: ClockIcon, text: 'Awaiting Task', color: 'text-zinc-500' },
    researching: { text: 'Researching', color: 'text-cyan-400' },
    analyzing: { text: 'Analyzing', color: 'text-yellow-400' },
    pondering: { text: 'Pondering', color: 'text-purple-400' },
    judging: { text: 'Judging', color: 'text-pink-400' },
    complete: { icon: CheckCircleIcon, text: 'Task Complete', color: 'text-emerald-400' },
    error: { icon: ExclamationCircleIcon, text: 'Error', color: 'text-red-400' },
  };
  
  const currentStatusKey = status?.status || 'pending';
  const currentStatusInfo = statusMap[currentStatusKey];
  const IconComponent = currentStatusInfo.icon;
  const isActive = ['researching', 'analyzing', 'pondering', 'judging'].includes(currentStatusKey);

  useEffect(() => {
    let interval;
    if (isActive) {
      const phrases = statusPhrases[currentStatusKey];
      interval = setInterval(() => {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }, 2000);
    } else {
      setPhraseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isActive, currentStatusKey]);

  const glowStyle = {
    backgroundImage: `radial-gradient(circle at 50% 50%, ${member.color} 0%, transparent 70%)`,
  };

  return (
    <motion.div
      layout
      // THIS IS THE FIX: The floating animation is now the ONLY one here.
      animate={isActive ? { y: [0, -6, 0] } : { y: 0 }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror"
      }}
      className="relative flex flex-col items-center justify-between text-center p-4 rounded-2xl border bg-zinc-900/70 backdrop-blur-sm h-40 w-full"
      style={{ borderColor: member.color }}
    >
      <div className="absolute inset-0 opacity-20" style={glowStyle} />
      
      <CodeScroller isActive={isActive} tintColor={member.color} />

      <AnimatePresence>
        {isActive && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-[-1px] rounded-2xl pointer-events-none"
          >
            <motion.div 
              className="w-full h-full rounded-2xl"
              style={{ boxShadow: `0 0 8px 1px ${member.color}, 0 0 16px 1px ${member.color} inset` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center">
        <span className="text-4xl">{member.avatar}</span>
        <h4 className="font-bold text-white text-sm" style={{ color: member.color }}>{member.role}</h4>
      </div>
      
      <div className={`relative z-10 flex items-center gap-1.5 text-xs font-semibold h-4 ${currentStatusInfo.color}`}>
        {IconComponent && <IconComponent className="w-4 h-4" />}
        
        <AnimatePresence mode="wait">
          <motion.span
            key={`${currentStatusKey}-${phraseIndex}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {isActive ? statusPhrases[currentStatusKey][phraseIndex] : currentStatusInfo.text}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CouncilMemberCard;