export function BreakingNews() {
  return (
    <div className="bg-green-700 text-white px-4 py-2.5 flex items-center justify-between text-sm shadow-inner">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold bg-green-900 px-2 py-0.5 rounded text-xs tracking-wider">BREAKING</span>
          <span className="font-medium truncate max-w-[250px] sm:max-w-md md:max-w-2xl">
            PTI wins Best Polytechnic in Innovation at the 2024 National Education Excellence Awards
          </span>
        </div>
        <div className="hidden md:flex gap-1.5 opacity-80">
          <button className="w-6 h-6 rounded bg-green-800 flex items-center justify-center text-xs hover:bg-green-600 hover:opacity-100 transition-all">&lt;</button>
          <button className="w-6 h-6 rounded bg-green-800 flex items-center justify-center text-xs hover:bg-green-600 hover:opacity-100 transition-all">||</button>
          <button className="w-6 h-6 rounded bg-green-800 flex items-center justify-center text-xs hover:bg-green-600 hover:opacity-100 transition-all">&gt;</button>
        </div>
      </div>
    </div>
  );
}
