import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Plus, Save, Calendar, Trash2, Edit3, HelpCircle } from "lucide-react";
import { GetQuestionnaire, QuestionnaireQuestion } from "@/api/types/quetionnaire.type";
import AnimatedBackground from "@/common/atoms/animated-background";
import EventFormModal from "@/common/widgets/admin/events/events-form.widget";
import { useDeleteQuetionnaireMutation } from "@/api/mutations/quetionnaire.mutation";
import { question } from "@/api/types/questions.type";


interface QuestionnaireDetailProps {
  useQuestionnaireByIDQuery: (id: string) => { data: GetQuestionnaire | undefined };
  onSave?: (draft: GetQuestionnaire) => void;
}

export default function QuestionnaireDetail({ useQuestionnaireByIDQuery, onSave }: QuestionnaireDetailProps) {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [isLoaded, setIsLoaded] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<GetQuestionnaire | null>(null);
  const [IsCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false)
  const [draft, setDraft] = useState<GetQuestionnaire | null>(null);
  const deleteQuestion = useDeleteQuetionnaireMutation()
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState({
    title: false,
    description: false,
  });

  const { data } = useQuestionnaireByIDQuery(id!);

  useEffect(() => {
    setIsLoaded(true);
    setQuestionnaire(data || null);
    console.log("Cuestionario", data);
  }, [data]);

  useEffect(() => {
    setDraft(questionnaire ? structuredClone(questionnaire) : null);
  }, [questionnaire]);

  const handleChange = (field: keyof GetQuestionnaire, value: any) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleRemoveQuestion = (data:QuestionnaireQuestion, id:string) => {
    deleteQuestion.mutateAsync({
      questionnaire_id: Number(id),
      question_id: data.id
    }
    )
  };

  const handleAddQuestion = () => {
    navigate(`/admin/questionnaire/edit/${draft?.id}`);
  };

  const handleSave = () => {
    if (!draft) return;
    onSave?.(draft);
  };



  const toggleEdit = (field: "title" | "description") => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const getTotalQuestions = () => {
    return draft?.questions?.length ?? 0;
  };

  // Loading state
  if (!isLoaded || !draft) {
    return (
      <div className="min-h-screen w-full p-3 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-200 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-6 bg-amber-200 rounded w-48"></div>
              <div className="h-4 bg-amber-100 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="relative min-h-screen w-full flex flex-col ">
      <AnimatedBackground></AnimatedBackground>

      <div className="flex-1 flex max-h-[80vh] bg-black mx-auto xl:min-w-7xl overflow-y-auto flex-col p-4 sm:p-6 lg:p-8 xl:p-3 min-h-0">


        {/* Header Card - Fixed */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/30 backdrop-blur-xl rounded-xl shadow-lg border border-white/30 p-4 mb-2 flex-shrink-0"
        >

          {/* Title Section */}
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-gradient-to-br from-amber-100 mb-2 to-orange-100 rounded-md shadow-sm flex-shrink-0">
              <FileText className="h-5 w-5 text-amber-700" />
            </div>
            <div className="flex-1 w-full min-w-0">
              {isEditing.title ? (
                <input
                  value={draft.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  onBlur={() => toggleEdit("title")}
                  autoFocus
                  className="text-sm font-bold bg-transparent border-none outline-none w-full text-gray-800"
                  placeholder="Título del cuestionario..."
                />
              ) : (
                <div className="flex items-center gap-1">
                  <h3 className="text-sm font-bold text-gray-200 leading-tight flex-1 min-w-0 break-words">
                    {draft.title}
                  </h3>
                  <button
                    onClick={() => toggleEdit("title")}
                    className="hover:bg-gray-100 rounded transition-colors opacity-60 hover:opacity-100 flex-shrink-0"
                  >
                    <Edit3 className="h-5 w-5 text-gray-200" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Description - condensed */}
          <div className="mt-1.5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded p-1.5 border border-amber-100/50">
            {isEditing.description ? (
              <textarea
                value={draft.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => toggleEdit("description")}
                autoFocus
                className="w-full bg-transparent border-none outline-none resize-none text-gray-700 text-xs"
                rows={1}
                placeholder="Descripción del cuestionario..."
              />
            ) : (
              <div className="flex items-start gap-1">
                <p className="flex-1 text-gray-700 text-xs break-words line-clamp-1">
                  {draft.description}
                </p>
                <button
                  onClick={() => toggleEdit("description")}
                  className="hover:bg-blue-300 rounded transition-colors opacity-60 hover:opacity-100 flex-shrink-0"
                >
                  <Edit3 className="h-4 w-4 text-gray-700" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Questions Section - Scrollable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 mb-4 sm:mb-6 flex-1 flex flex-col min-h-0"
        >
          {/* Questions Header - Fixed */}
          <div className="h-20 flex flex-col sm:flex-row items-start sm:items-center justify-between sm:p-6 lg:p-6 border-b border-gray-200/50 flex-shrink-0">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-200">
                Preguntas del Cuestionario
              </h3>

              {/* Stats moved under the title */}
              <div className="flex items-center gap-1 text-amber-600 mt-1">
                <HelpCircle className="h-3 w-3" />
                <span className="text-xs font-medium">
                  {getTotalQuestions()} preguntas
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddQuestion}
              className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-3 rounded-xl sm:rounded-2xl font-medium shadow-lg transition-all duration-200 mt-2 sm:mt-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Editar</span>
            </motion.button>
          </div>

          {/* Questions List - Scrollable */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-6">
            <div className="space-y-3 sm:space-y-4">
              <AnimatePresence>
                {(draft?.questions ?? []).map((q, idx) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-gradient-to-r from-white/50 to-gray-50/50 border border-gray-200/60 rounded-xl sm:rounded-2xl p-3 sm:p-5 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="h-2 w-full min-w-0">
                        <div className="h-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                          <div className="w-7 h-5 sm:w-8 sm:h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center text-amber-700 font-semibold text-xs sm:text-sm flex-shrink-0">
                            {idx + 1}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                            <span className="block font-medium text-gray-800 text-sm sm:text-base break-words sm:mb-0">
                              {q.question}
                            </span>
                            <span
                              className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm mt-1 sm:mt-0 flex-shrink-0 ${q.response
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                            >
                              {q.response ? "Realidad" : "Mito"}
                            </span>
                          </div>

                        </div>
                      </div>

                      <div className="h-5 flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          {/* Status Badge */}
                          <div
                            className={`w-2 h-2 rounded-full ${q.levelName === "Nivel 1"
                              ? "bg-blue-400"
                              : q.levelName === "Nivel 2"
                                ? "bg-yellow-400"
                                : q.levelName === "Nivel 3"
                                  ? "bg-red-400"
                                  : "bg-gray-400"
                              }`}
                          ></div>

                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${q.levelName === "Nivel 1"
                              ? "bg-blue-100 text-blue-700"
                              : q.levelName === "Nivel 2"
                                ? "bg-yellow-100 text-yellow-700"
                                : q.levelName === "Nivel 3"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-400"
                              }`}
                          >
                            {q.levelName}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (q.question && id) {
                              handleRemoveQuestion(q, id);
                            }
                          }}
                          className="p-1.5 sm:p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200"
                        >
                          <Trash2 className="h-5 w-5 sm:h-7 sm:w-7" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(draft.questions ?? []).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-12 sm:py-16 text-center"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                    <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-amber-600/60" />
                  </div>
                  <p className="text-gray-500 text-base sm:text-lg mb-1 sm:mb-2">
                    No hay preguntas agregadas
                  </p>
                  <p className="text-gray-400 text-sm">
                    Haz clic en "Agregar Pregunta" para comenzar
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - Fixed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-shrink-0 sticky bottom-0 z-10 mt-auto py-3 bg-transparent"
        >
          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
          >
            <Save className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Guardar Cambios</span>
          </motion.button>

          {/* Create Event Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateEventModalOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold shadow-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300"
          >
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">Crear Evento</span>
          </motion.button>
        </motion.div>

      </div>

      <EventFormModal
        isOpen={IsCreateEventModalOpen}
        onClose={() => {
          setIsCreateEventModalOpen(false)
        }}
        selectedCuestion={draft}
      />
    </div>
  );
}
