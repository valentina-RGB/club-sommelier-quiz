"use client"
import clubSomelier from "@/assets/cubSommelierFont.png"

export default function AnimatedBackground() {
  return (
      <img

        src={clubSomelier}
        alt="Beautiful mountain landscape"
        className="object-cover absolute h-full w-full overflow-hidden"
      />
   
  )
}
