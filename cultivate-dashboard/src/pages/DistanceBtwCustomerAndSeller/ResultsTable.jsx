function ResultsTable({ data }) {
  console.log("ResultsTable data:", data);
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h1 className="text-xl font-bold mb-4">New Customers - Nearest Seller</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">New Customer</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Sales Rep</th>
              <th className="px-4 py-2 border">Nearest Customer</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Distance (km)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2 border">{r.novoNome}</td>
                <td className="px-4 py-2 border">{r.novoEndereco}</td>
                <td className="px-4 py-2 border">{r.vendedor}</td>
                <td className="px-4 py-2 border">{r.clienteProximoNome}</td>
                <td className="px-4 py-2 border">{r.clienteProximoEndereco}</td>
                <td className="px-4 py-2 border">{r.distancia}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default ResultsTable;