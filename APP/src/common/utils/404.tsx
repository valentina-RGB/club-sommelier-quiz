import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/common/ui/button';
import { MainLayout } from '@/common/widgets/clients/main-layout.widget';
import { Home, ArrowLeft, HelpCircle } from 'lucide-react';
import NotFoundSvg from '@/assets/notFound.svg';

export function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout backgroundVariant="gradient">
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* 404 Illustration */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <img 
                src={NotFoundSvg} 
                alt="Página no encontrada" 
                className="w-48 h-48 opacity-80"
              />
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center space-x-2">
                <HelpCircle className="w-8 h-8 text-[var(--accent-primary)]" />
                <h1 className="text-6xl font-bold text-[var(--text-primary)]">404</h1>
              </div>
              
              <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                ¡Oops! Página no encontrada
              </h2>
              
              <p className="text-[var(--text-secondary)] leading-relaxed">
                La página que buscas no existe o ha sido movida. 
                Puede que hayas escrito mal la URL o que el enlace esté desactualizado.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={handleGoHome}
                className="bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Ir al inicio</span>
              </Button>
              
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Volver atrás</span>
              </Button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-6 border-t border-[var(--border-primary)]"
            >
              <p className="text-sm text-[var(--text-tertiary)] mb-3">
                ¿Necesitas ayuda? Prueba estos enlaces:
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <button
                  onClick={() => navigate('/')}
                  className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors duration-200"
                >
                  Página principal
                </button>
                <span className="text-[var(--text-tertiary)]">•</span>
                <span className="text-[var(--text-tertiary)]">•</span>
                <button
                  onClick={() => navigate('/')}
                  className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors duration-200"
                >
                  Contacto
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}