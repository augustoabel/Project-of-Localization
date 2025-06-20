export default function KpiCard({ label, value }) {
  return (
    <div className="text-center bg-white rounded-lg p-6 shadow-md">
      <div className="text-4xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-stone-500 mt-2">{label}</div>
    </div>
  );
}
