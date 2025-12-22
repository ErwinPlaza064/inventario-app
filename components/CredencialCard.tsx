
import { useState } from "react";
import { FiEye, FiEyeOff, FiCopy, FiTrash2, FiUser, FiKey } from "react-icons/fi";

interface CredencialCardProps {
  id: number;
  titulo: string;
  valor: string;
  usuario?: string;
  onDelete: (id: number) => void;
}

export const CredencialCard = ({ id, titulo, valor, usuario, onDelete }: CredencialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(valor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border-2 border-gray-100 p-6 rounded-[32px] hover:border-black transition-all group flex flex-col h-full shadow-sm hover:shadow-xl hover:shadow-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-3 bg-gray-50 rounded-2xl text-black group-hover:bg-black group-hover:text-white transition-all">
           <FiKey size={20} />
        </div>
        <button 
           onClick={() => onDelete(id)}
           className="opacity-0 group-hover:opacity-100 p-2 text-gray-200 hover:text-red-500 transition-all rounded-full hover:bg-red-50"
        >
           <FiTrash2 size={18} />
        </button>
      </div>

      <h3 className="text-lg font-black text-black uppercase mb-1 tracking-tight truncate pr-2 relative z-10">{titulo}</h3>
      
      {usuario && (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-4 relative z-10">
          <FiUser size={12} />
          <span className="truncate">{usuario}</span>
        </div>
      )}

      <div className="mt-auto relative z-10">
        <label className="text-[10px] font-black uppercase text-gray-300 tracking-widest mb-1 block">Contraseña / Valor</label>
        <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center group/input border border-transparent hover:border-black/10 transition-colors">
          <code className="text-sm font-mono font-bold text-black truncate flex-1 mr-2">
            {showPassword ? valor : "••••••••••••"}
          </code>
          
          <div className="flex gap-1 shrink-0">
             <button 
               onClick={() => setShowPassword(!showPassword)}
               className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-all"
               title={showPassword ? "Ocultar" : "Mostrar"}
             >
               {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
             </button>
             <button 
               onClick={handleCopy}
               className={`p-2 rounded-lg transition-all ${
                 copied 
                   ? "bg-green-100 text-green-600" 
                   : "text-gray-400 hover:text-black hover:bg-white"
               }`}
               title="Copiar"
             >
               <FiCopy size={16} />
             </button>
          </div>
        </div>
        {copied && (
          <p className="text-[10px] font-bold text-green-600 mt-1 absolute right-0 -bottom-5 animate-fade-in-up">¡Copiado!</p>
        )}
      </div>
    </div>
  );
};
