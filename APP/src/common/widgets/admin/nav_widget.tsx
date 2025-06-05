import { useState, useEffect } from "react"
import { NavGeneral } from "../../molecules/nav/nav.molecule"
import { NavItemType } from "@/api/types/nav.types"
import { navAdmin } from "../../utils/nav_admin"

export type NavItem = {
  navItems?: NavItemType[]
  isloading?: boolean | null
}

export default function Navbar({ navItems, isloading}: NavItem) {
  // Start with collapsed navigation on desktop
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768
      setIsMobile(isMobileView)
      
      // On mobile, always collapse the side nav since we use bottom nav
      setIsExpanded(false)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <NavGeneral
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      isMobile={isMobile}
      navItems={navItems || navAdmin}
      name="Quiz Manager"
    />
  )
}