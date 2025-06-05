import { NavItemType } from "@/api/types/nav.types";
import { Book } from "lucide-react";

export const navAdmin: NavItemType[] = [
  {
    title: "Cuestionarios",
    href: "/admin",
    icon: <Book className="h-5" />,
  },
  {
    title: "Eventos",
    href: "/admin/event",
    icon: <Book className="h-5" />,
  },
    {
    title: "Preguntas",
    href: "/admin/questions",
    icon: <Book className="h-5" />,
  }


]