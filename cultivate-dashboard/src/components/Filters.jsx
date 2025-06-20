const Filters = ({ categories, setCategory, search, setSearch }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-stone-800 mb-4">Search Exhibitors</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Pesquisar por nome, endereço, estande..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded-md w-full col-span-2"
        />
        <select
          onChange={e => setCategory(e.target.value)}
          className="p-2 border rounded-md w-full"
        >
          <option value="all">All Categories</option>
          {categories.map(c => (
            <option key={c.nome} value={c.nome}>{c.nome}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
export default Filters;