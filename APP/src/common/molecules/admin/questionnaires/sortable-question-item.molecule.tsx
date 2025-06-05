"use client"
import { question } from "@/api/types/questions.type";

import React from "react"
import { useSortable} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Form and UI components
import { Button } from "@/common/ui/button"
import { Badge } from "@/common/ui/badge"
import { GripVertical, Trash2 } from "lucide-react";

export const SortableQuestionItem = React.memo(({ 
  question, 
  index, 
  onRemove 
}: { 
  question: question; 
  index: number; 
  onRemove: (id: number) => void; 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: question.id.toString(),
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 flex items-start 
                 ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mr-3 mt-1 cursor-grab text-white/60 hover:text-white touch-none"
      >
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="text-white font-medium">
            {index + 1}. {question.question}
          </span>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onRemove(question.id)}
            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center mt-1 space-x-2">
          <Badge className={`${question.response ? 'bg-green-500/60' : 'bg-red-500/60'} text-white`}>
            {question.response ? 'Verdadero' : 'Falso'}
          </Badge>
          <Badge className="bg-blue-500/30 text-blue-100">
            {question.level}
          </Badge>
        </div>
      </div>
    </div>
  );
});