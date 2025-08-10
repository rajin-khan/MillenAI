// /millen-ai/src/components/council/CouncilMemberCard.jsx
import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, ClockIcon, LightBulbIcon, BeakerIcon, ScaleIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

const CouncilMemberCard = ({ member, status }) => {
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

  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col items-center justify-center text-center p-4 rounded-2xl border bg-zinc-900/50 backdrop-blur-sm"
      style={{ borderColor: member.color }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-50"
          animate={{ boxShadow: [`0 0 0px 0px ${member.color}1A`, `0 0 25px 4px ${member.color}4D`, `0 0 0px 0px ${member.color}1A`] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span className="text-4xl mb-2">{member.avatar}</span>
      <h4 className="font-bold text-white" style={{color: member.color}}>{member.role}</h4>
      <div className={`flex items-center gap-1.5 mt-1.5 text-xs font-semibold ${currentStatus.color}`}>
        <IconComponent className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
        <span>{currentStatus.text}</span>
      </div>
    </motion.div>
  );
};
export default CouncilMemberCard;