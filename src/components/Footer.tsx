export default function Footer() {
  return (
    <footer className="h-12 bg-nexus-dark border-t border-nexus-blue-dark/10 px-8 flex items-center justify-between mt-auto">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-tighter">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Status: Conectado
        </div>
        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
          Versão 1.2.0-beta • Alinhado à BNCC
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs font-semibold text-nexus-blue-light">
        <span className="cursor-pointer hover:text-white transition-colors">Suporte</span>
        <span className="cursor-pointer hover:text-white transition-colors">Configurações</span>
        <span className="text-white cursor-pointer hover:text-red-400 transition-colors">Sair</span>
      </div>
    </footer>
  );
}
