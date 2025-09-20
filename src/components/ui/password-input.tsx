"use client"; 

import { forwardRef, useState } from "react";
// forwardRef: Permite que el componente padre pase una referencia al elemento DOM
// useState: Hook para manejar estado local del componente

import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { changeTypeInput } from "../../../utils/show-password";
import { cn } from "@/lib/utils";

// Interface que extiende las props nativas de HTMLInputElement
// Esto proporciona type safety y autocompletado en TypeScript
interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // Prop opcional para mostrar estado de error
  showToggle?: boolean; // Prop opcional para mostrar/ocultar el botón de visibilidad
}

// forwardRef permite que componentes padre accedan al elemento DOM subyacente
// Útil para formularios, focus management, etc.
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, autoComplete, error, showToggle = false, ...props }, ref) => {
    // useState hook para manejar el estado de visibilidad de la contraseña
    // showPassword: valor actual del estado
    // setShowPassword: función para actualizar el estado
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="relative">
        <Input
          type={changeTypeInput(showPassword)} 
          className={cn( 
            error && "border-destructive", 
            showToggle && "pr-12",
            className
          )}
          ref={ref} // Forwarded ref del componente padre
          autoComplete="off" 
          {...props} // Spread operator: pasa todas las props restantes al Input
        />
        {showToggle && ( // Renderizado condicional: solo muestra el botón si showToggle es true
          <Button
            type="button" // Previene que el botón haga submit del formulario
            variant="ghost" // Variant de shadcn/ui para botón transparente
            size="sm" // Tamaño pequeño del botón
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            // Posicionamiento absoluto para colocar el botón dentro del input
            onClick={() => setShowPassword(!showPassword)} // Event handler que invierte el estado
            tabIndex={-1} // Excluye el botón del tab order del teclado
          >
            {showPassword ? ( // Renderizado condicional basado en el estado
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="sr-only"> {/* Screen reader only - accesibilidad */}
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        )}
      </div>
    );
  }
);

// Establece displayName para debugging en React DevTools
// Útil cuando se usa forwardRef ya que React no puede inferir el nombre automáticamente
PasswordInput.displayName = "PasswordInput";

// Export named del componente para importación en otros archivos
export { PasswordInput };