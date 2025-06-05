import { motion } from 'framer-motion';
import { Trophy, Medal, User, Award, Star } from 'lucide-react';
import { ResultsType } from '../hooks/useEventSocket';

export interface Participant {
  participant_id: string;
  total: number;
  participant?: {
    id: string;
    fullName: string;
  };
  position?: number;
}

interface ParticipantsRankingProps {
  participants: ResultsType[];
  currentParticipantId?: string;
  title?: string;
  maxToShow?: number;
  showPosition?: boolean;
  showMedals?: boolean;
  className?: string;
  animate?: boolean;
  showScore?: boolean;
}

export function ParticipantsRanking({
  participants,
  currentParticipantId,
  title = "Ranking de participantes",
  maxToShow = 10,
  showPosition = true,
  showMedals = true,
  className = "",
  animate = true,
  showScore = true
}: ParticipantsRankingProps) {
  if (!participants?.length) return null;
  
  // Aseguramos que los participantes estén ordenados por puntuación (descendente)
  const sortedParticipants = [...participants]
    .sort((a, b) => b.total - a.total)
    .slice(0, maxToShow)
    .map((p, i) => ({ ...p, position: p.total || i + 1 }));

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return showPosition ? 
          <span className="text-sm font-medium w-5 h-5 flex items-center justify-center">
            {position}
          </span> : 
          <User className="w-4 h-4 text-[var(--text-secondary)] opacity-70" />;
    }
  };

  // Encontrar la posición del participante actual
  const currentParticipantPosition = currentParticipantId ? 
    sortedParticipants.findIndex(p => p.participant_id.toString() === currentParticipantId) + 1 : -1;

  // Container variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  // Item variants for individual animations
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const MotionWrapper = animate ? motion.div : 'div';

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          
          {currentParticipantPosition > 0 && (
            <div className="text-sm text-[var(--text-secondary)]">
              Tu posición: <span className="font-bold text-[var(--accent-primary)]">
                {currentParticipantPosition}º
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4">
        <MotionWrapper 
          className="space-y-2"
          variants={animate ? containerVariants : undefined}
          initial={animate ? "hidden" : undefined}
          animate={animate ? "show" : undefined}
        >
          {sortedParticipants.map((participant, index) => {
            const isCurrentUser = participant.participant_id.toString() === currentParticipantId;
            
            return (
              <MotionWrapper
                key={participant.participant_id}
                variants={animate ? itemVariants : undefined}
                className={`flex justify-between items-center p-2.5 rounded-lg transition-colors ${
                  isCurrentUser 
                    ? 'bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full 
                    ${participant.position <= 3 
                      ? 'bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-primary)]/5 border border-[var(--accent-primary)]/30' 
                      : 'bg-white/5'
                    }`}
                  >
                    {showMedals && getMedalIcon(participant.position)}
                  </div>
                  
                  <span className={`font-medium ${isCurrentUser ? 'text-[var(--accent-primary)]' : ''}`}>
                    {participant.participant?.fullName || 'Participante'}
                  </span>
                </div>
                
                {showScore && (
                  <div className="flex items-center gap-2">
                    {participant.position <= 3 && (
                      <Star className={`w-4 h-4 
                        ${participant.position === 1 ? 'text-yellow-400 fill-yellow-400' : 
                          participant.position === 2 ? 'text-gray-300 fill-gray-300' : 
                          'text-amber-600 fill-amber-600'}`} 
                      />
                    )}
                    <span className={`font-bold ${
                      participant.position === 1 ? 'text-yellow-400' :
                      participant.position === 2 ? 'text-gray-300' :
                      participant.position === 3 ? 'text-amber-600' : ''
                    }`}>
                      {Math.round(participant.total * 10) / 10} pts
                    </span>
                  </div>
                )}
              </MotionWrapper>
            );
          })}
        </MotionWrapper>
        
        {participants.length > maxToShow && (
          <div className="mt-3 text-center text-sm text-[var(--text-secondary)] opacity-70">
            Mostrando {maxToShow} de {participants.length} participantes
          </div>
        )}
      </div>
    </div>
  );
}