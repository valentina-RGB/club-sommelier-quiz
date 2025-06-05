"use client"

import { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"


// Import DnD-Kit libraries instead of react-beautiful-dnd
import {KeyboardSensor,PointerSensor,useSensor,closestCenter,useSensors,DragEndEvent} from '@dnd-kit/core';
import {arrayMove,sortableKeyboardCoordinates} from '@dnd-kit/sortable';
// Form and UI components
import { Button } from "@/common/ui/button"

// API Queries and Mutations
import { useQuestionsQuery } from "@/api/query/questions.queries"
import { useCategoriesQuery } from "@/api/query/category.queries"
import { useNivelesQuery } from "@/api/query/level.queries"
import { useCreateQuestionnaireMutation, useUpdateQuestionnaireMutation } from "@/api/mutations/quetionnaire.mutation"

// Types and Schema
import { questionnaireFormSchema } from "@/api/schemas/quetionnaire.schemas"
import { question } from "@/api/types/questions.type"
import { GetQuestionnaire } from "@/api/types/quetionnaire.type"
import { QuestionnaireFormData } from "@/api/schemas/quetionnaire.schemas"
import { SortableQuestionItem } from "@/common/molecules/admin/questionnaires/sortable-question-item.molecule"
import FormQuestionnaires from "@/common/molecules/admin/questionnaires/form-questionnaires.molecule"
import SectionPanel from "@/common/molecules/admin/questionnaires/sections-panel.molecule"
import AnimatedBackground from "@/common/atoms/animated-background"
// import clubSomelier from '@/assets/clubSomelier.png'

// Add a display name
SortableQuestionItem.displayName = 'SortableQuestionItem';
interface QuestionnaireFormProps {
  initialData?: GetQuestionnaire | null;
  isEditing?: boolean;
}

export default function QuestionnaireFormView({ initialData, isEditing = false }: QuestionnaireFormProps) {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<question[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [accordionValue, setAccordionValue] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("questions");

  // API Queries
  const { data: allQuestions = [], isLoading: isLoadingQuestions } = useQuestionsQuery();
  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery();
  const { data: niveles = [], isLoading: isLoadingNiveles } = useNivelesQuery();

  // Mutations
  const createQuestionnaireMutation = useCreateQuestionnaireMutation();
  const updateQuestionnaireMutation = useUpdateQuestionnaireMutation();

  // Setup DnD-Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Setup form with Zod validation
  const form = useForm<QuestionnaireFormData>({
    resolver: zodResolver(questionnaireFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      // categories: initialData?.categories.map(cat => typeof cat.id === 'number' ? cat.id : parseInt(cat.id.toString())) || [],
      questions: initialData?.questions?.map(q => q.id) || []
    },
  });

  // Load initial data if in edit mode
  useEffect(() => {
    if (initialData && isEditing && allQuestions.length > 0) {
      // Only reset the form if initialData or allQuestions change
      form.reset({
        title: initialData.title,
        description: initialData.description,
        categories: initialData.categories.map(cat =>
          typeof cat.id === 'number' ? cat.id : parseInt(cat.id)
        ),
        questions: initialData.questions?.map(q => q.id) || []
      });

      // Populate selected questions array with full question objects
      if (initialData.questions) {
        const questions = initialData.questions.map(q => {
          const fullQuestion = allQuestions.find(full => full.id === q.id);
          return fullQuestion || {
            id: q.id,
            question: q.question,
            response: q.response,
            level: q.levelName || q.levelName,
            categories: []
          };
        });
        setSelectedQuestions(questions);
      }
    }
    setIsLoaded(true);
  }, [initialData, isEditing, allQuestions.length]);

  // Filter questions based on search and filters
 const filteredQuestions = useMemo(() => {
  return allQuestions.filter(q => {
    // Text search
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    const matchesCategory = categoryFilter === null ||
      q.categories.some(cat => cat.id === categoryFilter);

    // Level filter - MODIFICADO para mostrar niveles acumulativos
    const matchesLevel = () => {
      if (levelFilter === null) return true;
      
      // Obtener el nivel numérico de la pregunta actual
      const questionLevelObj = niveles.find(n => n.name === q.level);
      if (!questionLevelObj) return false;
      const questionLevelNumber = questionLevelObj.id;
      
      // Obtener el nivel numérico seleccionado en el filtro
      const selectedLevelObj = niveles.find(n => n.name === levelFilter);
      if (!selectedLevelObj) return false;
      const selectedLevelNumber = selectedLevelObj.id;
      
      // Incluir si el nivel de la pregunta es menor o igual al seleccionado
      if (typeof questionLevelNumber === "undefined" || typeof selectedLevelNumber === "undefined") return false;
      return questionLevelNumber <= selectedLevelNumber;
    };

    // Already selected filter (exclude already selected questions)
    const isNotSelected = !selectedQuestions.some(selected => selected.id === q.id);

    return matchesSearch && matchesCategory && matchesLevel() && isNotSelected;
  });
}, [allQuestions, searchTerm, categoryFilter, levelFilter, niveles, selectedQuestions]);

  // Handle drag end for reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSelectedQuestions((items) => {
        const oldIndex = items.findIndex(item => item.id.toString() === active.id);
        const newIndex = items.findIndex(item => item.id.toString() === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update the form value with the new order
        const questionIds = newItems.map(q => q.id);
        form.setValue('questions', questionIds, { shouldValidate: true });

        return newItems;
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter(null);
    setLevelFilter(null);
  };

  const hasActiveFilters = searchTerm || categoryFilter !== null || levelFilter !== null;

  // Add a question to the selected list
  const handleAddQuestion = (question: question) => {
    setSelectedQuestions(prev => {
      // Add with position equal to the array length
      const newQuestion = { ...question };
      return [...prev, newQuestion];
    });

    // Update the form's questions array
    const currentQuestions = form.getValues().questions || [];
    form.setValue('questions', [...currentQuestions, question.id], { shouldValidate: true });
  };

  // Remove a question from the selected list
  const handleRemoveQuestion = (questionId: number) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));

    // Update the form's questions array
    const currentQuestions = form.getValues().questions || [];
    form.setValue(
      'questions',
      currentQuestions.filter(id => id !== questionId),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: QuestionnaireFormData) => {
    try {
      const orderedQuestionIds = selectedQuestions.map(q => q.id);
      data.questions = orderedQuestionIds;

      if (isEditing && initialData) {
        await updateQuestionnaireMutation.mutate({
          id: initialData.id,
          data
        }, {
          onSuccess: () => {
            navigate('/admin');
          }
        });
      } else {
        await createQuestionnaireMutation.mutate(data, {
          onSuccess: () => {
            navigate('/admin');
          }
        });
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
    }
  };

  // Check for selected categories to filter available questions
  const selectedCategories = form.watch('categories') || [];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <AnimatedBackground />

      {/* Main Content */}
      <main className="relative h-screen w-full pt-5 flex overflow-hidden">
        {/* Form Panel */}
        <div
          className={`w-1/2 h-full bg-white/10 backdrop-blur-lg p-6 shadow-xl border-r border-white/20 opacity-100 ${isLoaded ? "animate-fade-in" : ""
            } flex flex-col`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Editar Cuestionario' : 'Crear Nuevo Cuestionario'}
            </h2>
            <Button
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              onClick={() => navigate('/admin')}
            >
              Cancelar
            </Button>
          </div>

          {/* form  */}
          <FormQuestionnaires
            form={form}
            handleDragEnd={handleDragEnd}
            isEditing={isEditing}
            onSubmit={onSubmit}
            sensors={sensors}
            categories={categories}
            selectedQuestions={selectedQuestions}
            closestCenter={closestCenter}
            isLoadingCategories={isLoadingCategories}
            handleRemoveQuestion={handleRemoveQuestion}
            updateQuestionnaireMutation={updateQuestionnaireMutation}
            createQuestionnaireMutation={createQuestionnaireMutation}
          ></FormQuestionnaires>
        </div>

        {/* Questions Selection Panel */}
        <SectionPanel
          isLoaded={isLoaded}
          activeTab={activeTab}
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          categories={categories}
          levelFilter={levelFilter}
          niveles={niveles}
          allQuestions={allQuestions}
          selectedQuestions={selectedQuestions}
          setCategoryFilter={setCategoryFilter}
          setSearchTerm={setSearchTerm}
          setActiveTab={setActiveTab}
          setLevelFilter={setLevelFilter}
          isLoadingQuestions={isLoadingQuestions}
          hasActiveFilters={hasActiveFilters}
          clearFilters={clearFilters}
          handleAddQuestion={handleAddQuestion}
          accordionValue={accordionValue}
          setAccordionValue={setAccordionValue}
          selectedCategories={selectedCategories}
          filteredQuestions={filteredQuestions}
        ></SectionPanel>
      </main>
    </div>
  );
}