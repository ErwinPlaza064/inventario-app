interface StatsHeaderProps {
  totalProducts: number;
}

export const StatsHeader = ({ totalProducts }: StatsHeaderProps) => {
  return (
    <div className="mb-8 md:mb-12 text-center px-4 animate-fade-in">
      <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] uppercase border border-border bg-card text-accent/60 rounded-full">
        Management System
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white">
        Inventario<span className="text-accent/30">.</span>
      </h1>
      <p className="text-sm md:text-base text-gray-500 max-w-xs mx-auto mb-8 font-medium">
        Control absoluto y elegante de tus productos.
      </p>
      
      <div className="flex justify-center gap-4">
        <div className="px-5 py-3 bg-card border border-border rounded-xl">
          <span className="block text-2xl font-bold text-white leading-none">{totalProducts}</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Stock Total</span>
        </div>
        <div className="px-5 py-3 bg-card border border-border rounded-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Online</span>
        </div>
      </div>
    </div>
  );
};
