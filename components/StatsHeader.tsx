interface StatsHeaderProps {
  totalProducts: number;
}

export const StatsHeader = ({ totalProducts }: StatsHeaderProps) => {
  return (
    <div className="mb-8 md:mb-12 text-center px-4 animate-fade-in">
      <div className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-[0.2em] uppercase border border-gray-200 bg-gray-50 text-gray-500 rounded-full">
        Sistema de Gestión
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-black">
        Inventario
      </h1>
      <p className="text-sm md:text-base text-gray-500 max-w-xs mx-auto mb-8 font-medium">
        Control absoluto y elegante de tus productos.
      </p>
      
      <div className="flex justify-center gap-4">
        <div className="px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-xl">
          <span className="block text-2xl font-black text-black leading-none">{totalProducts}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Stock Total</span>
        </div>
        <div className="px-5 py-3 bg-white border border-gray-100 shadow-sm rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Online</span>
        </div>
      </div>
    </div>
  );
};
