"use client";

import { useState, useEffect, useMemo } from "react";
import { FileQuestion, Search, Filter, X, } from "lucide-react";
import { Button } from "@/common/ui/button";
import { Input } from "@/common/ui/input";

import { CategoriesWidget } from "@/common/widgets/admin/quetionnaire/categories.widget";
import { ListQuestionnaires } from "@/api/types/quetionnaire.type";
import { useQuestionnaireQuery } from "@/api/query/cuestions.queries";
import QuestionnaireCard from "@/common/molecules/admin/questionnaires/questionnaire-card.molecule";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "@/common/atoms/animated-background";

export default function HomeCuestion() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<ListQuestionnaires[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  //QUESTIONS
  const { data, isLoading, isError } = useQuestionnaireQuery();

  useEffect(() => {
    setIsLoaded(true);
    setQuestionnaires(data || []);
  }, [data]);


  const handleCardClick = (questionnaireId: string) => {
    navigate(`/admin/questionnaireDetails?id=${questionnaireId}`);
  };

  const filteredQuestionnaires = useMemo(() => {
    return questionnaires.filter((cuestion) => {
      const matchesSearch =
        cuestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuestion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cuestion.categories
          .map((cat) => cat.name)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [questionnaires, searchTerm]);


  const clearFilters = () => {
    setSearchTerm("");
  };


  const OncreateQuestionnarie = ()=>{
    navigate("/admin/questionnaire/create")
  }

  const hasActiveFilters = searchTerm;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      < AnimatedBackground></AnimatedBackground>
      {/* <AnimatedBackground /> */}

    <div className="w-fit z-100  right-2 top-2 flex absolute ">
      <Button onClick={()=> OncreateQuestionnarie()} className="rounded-lg bg-amber-100 hover:text-red-800 hover:bg-white/40">Crear Cuestionario</Button>
    </div>

      {/* Main Content */}
      <main className="relative h-screen w-full pt-5 flex">
        {/* Sidebar */}
        <div
          className={`w-80 h-full bg-white/10 backdrop-blur-lg p-6 shadow-xl border-r border-white/20 rounded-tr-3xl opacity-100 ${isLoaded ? "animate-fade-in" : ""
            } flex flex-col`}
          style={{ animationDelay: "0.4s" }}
        >
          <div className="mb-6">
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtros
            </h3>

            {/* Search Filter */}
            <div className="mb-4">
              <label className="block text-white/80 text-sm font-medium mb-2">
                Buscar cuestionarios
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/50" />
                <Input
                  type="text"
                  placeholder="Buscar por título, categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-black/50 pl-10"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <X className="h-4 w-4 mr-2" />
                Limpiar Filtros
              </Button>
            )}
          </div>

          <div className="space-y-5 overflow-y-auto">
            {/* Stats */}
            <div className="bg-white/10   rounded-xl p-4 border border-white/20 mb-6">
              <h4 className="text-white font-medium mb-3">Estadísticas</h4>
              <div className="space-y-2 text-sm text-white/80">
                <div className="flex justify-between">
                  <span>Total cuestionarios:</span>
                  <span className="font-medium text-white">
                    {questionnaires.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cuestionarios filtrados:</span>
                  <span className="font-medium text-white">
                    {filteredQuestionnaires.length}
                  </span>
                </div>

              </div>
            </div>

            {/* Categories */}
            <CategoriesWidget />
          </div>
        </div>

        {/* Questionnaires List */}
        <div
          className={`flex-1 flex flex-col opacity-100 ${isLoaded ? "animate-fade-in" : ""
            }`}
          style={{ animationDelay: "0.6s" }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FileQuestion className="h-6 w-6 mr-3" />
                Cuestionarios Disponibles
                {hasActiveFilters && (
                  <span className="ml-3 text-sm bg-blue-500 px-2 py-1 rounded-full">
                    {filteredQuestionnaires.length} resultados
                  </span>
                )}
              </h2>
            </div>

            {/* Questionnaires Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 max-h-[calc(100vh-250px)] overflow-x-hidden overflow-y-auto scrollbar-thumb pr-2">
              {filteredQuestionnaires.length > 0 ? (
                filteredQuestionnaires.map((questionnaire) => (
                  <QuestionnaireCard
                    key={questionnaire.id}
                    questionnaire={questionnaire}
                    onClick={() => handleCardClick(String(questionnaire.id))}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12">
                  <FileQuestion className="h-16 w-16 text-white/30 mb-4" />
                  <p className="text-white/60 text-lg mb-2">
                    {hasActiveFilters
                      ? "No se encontraron cuestionarios"
                      : "No hay cuestionarios disponibles"}
                  </p>
                  <p className="text-white/40 text-sm mb-6 text-center px-4">
                    {hasActiveFilters
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "Los cuestionarios aparecerán aquí cuando estén disponibles"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
