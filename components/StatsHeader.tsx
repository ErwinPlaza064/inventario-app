interface StatsHeaderProps {
  productCount: number;
}

export default function StatsHeader({ productCount }: StatsHeaderProps) {
  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="inline-block mb-3">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-5 py-2 border border-gray-300 shadow-sm">
          <span className="text-gray-700 text-xs font-semibold tracking-wide uppercase">
            Sistema de Gestión
          </span>
        </div>
      </div>
      
      <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3 tracking-tight">
        Inventario
      </h1>
      
      <p className="text-gray-600 mb-6 font-light">
        Control y administración de productos
      </p>
      
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-300 shadow-sm">
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="font-bold text-gray-900 text-sm">{productCount}</span>
          <span className="text-xs text-gray-600">Productos</span>
        </div>
        
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-300 shadow-sm">
          <div className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Sistema activo</span>
        </div>
      </div>
    </div>
  );
}
