import { useState } from "react";
import { FiEye, FiEyeOff, FiCopy, FiTrash2, FiUser, FiKey, FiEdit3, FiServer, FiWifi, FiLock, FiCode, FiGrid, FiPrinter } from "react-icons/fi";
import { Credencial, CREDENTIAL_CATEGORIES } from "../types/credential";

interface CredencialCardProps extends Credencial {
  onDelete: (id: number) => void;
  onEdit: (cred: Credencial) => void;
}

export const CredencialCard = ({ id, titulo, valor, usuario, categoria = "General", fechaCreacion, onDelete, onEdit }: CredencialCardProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryConfig = CREDENTIAL_CATEGORIES[categoria] || CREDENTIAL_CATEGORIES["General"];

  const iconMap: Record<string, React.ReactNode> = {
    FiLock: <FiLock size={20} />,
    FiWifi: <FiWifi size={20} />,
    FiServer: <FiServer size={20} />,
    FiUser: <FiUser size={20} />,
    FiCode: <FiCode size={20} />,
    FiGrid: <FiGrid size={20} />,
    FiKey: <FiKey size={20} />,
    FiPrinter: <FiPrinter size={20} />,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(valor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-6 rounded-[32px] hover:border-black dark:hover:border-white transition-all group flex flex-col h-full shadow-sm dark:shadow-none hover:shadow-xl hover:shadow-gray-100 dark:hover:shadow-none relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500 pointer-events-none ${categoryConfig.color.replace('text', 'bg').split(' ')[0]}`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl transition-all ${categoryConfig.color}`}>
           {iconMap[categoryConfig.iconName]}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
             onClick={() => onEdit({ id, titulo, valor, usuario, categoria, fechaCreacion })}
             className="p-2 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all"
          >
             <FiEdit3 size={18} />
          </button>
          <button 
             onClick={() => onDelete(id)}
             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
          >
             <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-black text-black dark:text-white uppercase mb-1 tracking-tight truncate pr-2 relative z-10" title={titulo}>{titulo}</h3>
      
      {usuario && (
        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 relative z-10">
          <FiUser size={12} />
          <span className="truncate">{usuario}</span>
        </div>
      )}

      <div className="mt-auto relative z-10">
        <label className="text-[10px] font-black uppercase text-gray-300 dark:text-gray-600 tracking-widest mb-1 block">Contraseña / Valor</label>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 flex justify-between items-center group/input border border-transparent hover:border-black/10 dark:hover:border-white/10 transition-colors">
          <code className="text-sm font-mono font-bold text-black dark:text-white truncate flex-1 mr-2">
            {showPassword ? valor : "••••••••••••"}
          </code>
          
          <div className="flex gap-1 shrink-0">
             <button 
               onClick={() => setShowPassword(!showPassword)}
               className="p-2 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all"
               title={showPassword ? "Ocultar" : "Mostrar"}
             >
               {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
             </button>
             <button 
               onClick={handleCopy}
               className={`p-2 rounded-lg transition-all ${
                 copied 
                   ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                   : "text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-gray-700"
               }`}
               title="Copiar"
             >
               <FiCopy size={16} />
             </button>
          </div>
        </div>
        {copied && (
          <p className="text-[10px] font-bold text-green-600 dark:text-green-400 mt-1 absolute right-0 -bottom-5 animate-fade-in-up">¡Copiado!</p>
        )}
      </div>
    </div>
  );
};
