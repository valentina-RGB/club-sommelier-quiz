export const getCategoryColor = (categoryName: string) => {
    const colors = {
      trabajo: "bg-blue-500",
      personal: "bg-green-500",
      educación: "bg-purple-500",
      salud: "bg-red-500",
      tecnología: "bg-indigo-500",
      deporte: "bg-teal-500",
      entretenimiento: "bg-pink-500",
      finanzas: "bg-orange-500",
      default: "bg-gray-500"
    }
    return (colors as Record<string, string>)[categoryName.toLowerCase()] || colors.default
  }

  export const getLevelColor = (level: string) => {
    const colors = {
      fácil: "text-green-500",
      medio: "text-yellow-500",
      difícil: "text-red-500",
      default: "text-gray-500"
    }
    return (colors as Record<string, string>)[level.toLowerCase()] || colors.default
  }