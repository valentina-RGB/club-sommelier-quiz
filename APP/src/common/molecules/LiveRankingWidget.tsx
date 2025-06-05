import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Award } from 'lucide-react';
import { ParticipantsRanking} from './ParticipantsRanking';
import { ResultsType } from '../hooks/useEventSocket';

interface LiveRankingWidgetProps {
  participants: ResultsType[];
  currentParticipantId?: string;
  maxToShow?: number;
}

export function LiveRankingWidget({
  participants,
  currentParticipantId,
  maxToShow = 5
}: LiveRankingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Encontrar ranking del participante actual
  const currentParticipantRank = currentParticipantId ? 
    participants
      .sort((a, b) => b.total - a.total)
      .findIndex(p => p.participant_id.toString()=== currentParticipantId) + 1 : 
    null;

  return (
    <div className="fixed bottom-5 right-5 z-10">
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-[var(--background-tertiary)]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg overflow-hidden"
        style={{ width: isExpanded ? '300px' : '180px' }}
      >
        {/* Header - siempre visible */}
        <div 
          className="flex items-center justify-between p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {isExpanded ? 'Ranking actual' : 'Tu posición'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {currentParticipantRank && !isExpanded && (
              <span className="font-bold text-[var(--accent-primary)]">
                {currentParticipantRank}º
              </span>
            )}
            {isExpanded ? 
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" /> : 
              <ChevronUp className="w-4 h-4 text-[var(--text-secondary)]" />
            }
          </div>
        </div>
        
        {/* Contenido expandible */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-3 pb-3"
            >
              <ParticipantsRanking 
                participants={participants}
                currentParticipantId={currentParticipantId}
                maxToShow={maxToShow}
                showPosition={true}
                showMedals={false}
                title=""
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}