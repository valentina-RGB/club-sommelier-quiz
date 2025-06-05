import { Mail, Phone, User } from "lucide-react"

export const HomeClient = () => {
    return (
        <div className="relative w-full  bg-slate-50 dark:bg-slate-300  rounded-md">
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <button className="rounded-full p-2 bg-gray-100 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div className="flex-grow"></div>
                    <button className="rounded-full p-2 bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                </div>
                
                <div className="text-center text-md font-bold text-gray-800">
                    <h1 >¡Bienvenido!</h1>
                    <h1>a</h1>
                    <h1>Realidad o Mito</h1>
                </div>
                
                <div className="relative h-20 mb-8 overflow-hidden">
                    <div className="absolute inset-0">
                      
                    </div>
                </div>
                
                <div className="bg-white dark:bg-white/10 rounded-t-3xl p-4 shadow-lg">
                    <div className="flex mb-4">
                        <button className="flex-1 py-2 font-medium text-gray-700">Datos básicos</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-400 rounded-full flex items-center justify-center mr-4">
                               <User className="text-white"/>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">Nombre Compreto</h3>
                                <p className="text-sm text-gray-500">23 minutes</p>
                            </div>
                            
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center mr-4">
                            <Mail className="text-white"/>
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">Correo electrónico</h3>
                                <p className="text-sm text-gray-500">12 minutes</p>
                            </div>
                           
                        </div>
                        
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center mr-4">
                            <Phone className="text-white"/>
                               
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">Coloring</h3>
                                <p className="text-sm text-gray-500">30 minutes</p>
                            </div>
                           
                        </div>
                    </div>
                    
                   <div className="w-full flex justify-center ">
                   <button className="w-full max-w-3xl mt-6 py-3 bg-indigo-400 text-gray-700 font-medium rounded-full hover:bg-indigo-500 transition-colors">
                        Entrar al aula
                    </button>
                   </div>
                </div>
            </div>
        </div>
    )
}