"use client"
import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/common/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/common/ui/card"
import { Input } from "@/common/ui/input"
import { Label } from "@/common/ui/label"
import { Eye, EyeOff, User, Lock, ArrowLeft, Loader2, Mail } from "lucide-react"
import { useLogin } from "@/api/mutations/login.mutation"
import { MainLayout } from "@/common/widgets/clients/main-layout.widget"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "", 
    password: "",
  })

  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email.trim()) {
      alert('Por favor ingresa tu email')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Por favor ingresa un email válido')
      return
    }
    
    if (!formData.password.trim()) {
      alert('Por favor ingresa tu contraseña')
      return
    }

    loginMutation.mutate(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <MainLayout backgroundVariant="gradient">
      {/* Botón de regreso */}
      <div className="absolute top-6 left-6 z-10">
        <Link to="/landing">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center p-4 min-h-screen">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-[var(--surface-primary)]/95 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-8 pt-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-[var(--text-primary)]">
              Iniciar Sesión
            </CardTitle>
            <p className="text-center text-[var(--text-secondary)] text-sm">
              Accede a tu cuenta para continuar
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Mostrar error si existe */}
            {loginMutation.isError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 px-4 py-3 rounded-lg text-sm">
                {loginMutation.error?.message || 'Error al iniciar sesión'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-[var(--text-primary)]">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 h-12 border-2 border-[var(--border-primary)] rounded-xl focus:border-[var(--accent-primary)] transition-colors"
                    required
                    disabled={loginMutation.isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[var(--text-primary)]">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 border-[var(--border-primary)] rounded-xl focus:border-[var(--accent-primary)] transition-colors"
                    required
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    disabled={loginMutation.isPending}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
