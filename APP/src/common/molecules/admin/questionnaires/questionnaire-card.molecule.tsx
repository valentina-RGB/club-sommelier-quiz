"use client";
import { ListQuestionnaires } from "@/api/types/quetionnaire.type";

import { motion } from "framer-motion";
import { ArrowRight, FileText} from "lucide-react";


interface QuestionnaireCardProps {
  questionnaire: ListQuestionnaires;
  onClick?: () => void;
}

export default function QuestionnaireCard({
  questionnaire,
  onClick,
}: QuestionnaireCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer relative"
    >
      <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-xl hover:shadow-2xl p-6 transition-all duration-300 hover:bg-white/50 h-full min-h-[280px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
            <FileText className="h-6 w-6 text-amber-700" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </div>

        {/* Title */}
        <h3 className="text-gray-200 font-bold text-lg mb-3 leading-tight group-hover:text-amber-700 transition-colors line-clamp-2">
          {questionnaire.title}
        </h3>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-amber-100/60 text-sm leading-relaxed line-clamp-4">
            {questionnaire.description}
          </p>
        </div>

        {/* Categories - Mejoradas */}
        {questionnaire.categories && questionnaire.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {questionnaire.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50 group-hover:from-amber-100 group-hover:to-orange-100 transition-all duration-200"
              >
                {category.name}
              </span>
            ))}
            {questionnaire.categories.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                +{questionnaire.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Overlay gradient - Movido dentro del div principal */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}
