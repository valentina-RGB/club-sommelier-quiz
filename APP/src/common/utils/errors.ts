
export const errorMessages: Record<number, string> = { 
    401: "Credenciales inválidas.",
    403: "Acceso denegado.",
    404: "Recurso no encontrado.",
    500: "Ha ocurrido un error en el servidor.",
    409: "El recurso ya existe.",
    422: "Datos no válidos.",
    400: "Solicitud incorrecta."
  };
  
  export const moduleErrorMessages: Record<string, Record<number, string>> = {
    login: {
      401: "Credenciales inválidas.",
      404: "Usuario no encontrado.",
      403: "Acceso denegado.",
    },
    categories: {
        409: "Ya existe una categoría con esa información"
    },
    events:{
        409: "Ya existe un evento con esa información",
        404: "Evento no encontrado.",
        422: "Datos del evento no válidos."
    },
    questionnaires: {
        409: "Ya existe un cuestionario con esa información",
        404: "Cuestionario no encontrado.",
        422: "Datos del cuestionario no válidos."
    },
  };