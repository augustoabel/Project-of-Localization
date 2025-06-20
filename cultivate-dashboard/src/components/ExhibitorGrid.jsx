const ExhibitorGrid = ({ exhibitors }) => {
  if (exhibitors.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
        <p className="text-stone-700 font-semibold">no exhibitor found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exhibitors.map((ex, idx) => (
        <div key={idx} className="bg-white p-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-bold text-stone-800 mb-2">{ex.Company}</h3>
          <p><strong>Estande:</strong> {ex.Phone}</p>
          <p className="mt-2 text-sm text-stone-600 pl-4 border-l-2 border-stone-200 mt-1">
            {ex.Address?.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </p>
          <div className="mt-4 text-sm text-blue-600 space-x-2">
            {ex.site && (
              <a href={ex.site} target="_blank" rel="noreferrer" className="hover:underline">Website</a>
            )}
            {ex.link && (
              <a href={ex.link} target="_blank" rel="noreferrer" className="hover:underline">Datails</a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default ExhibitorGrid;