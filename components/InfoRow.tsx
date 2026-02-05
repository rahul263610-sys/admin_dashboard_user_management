 const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col border-b border-stroke pb-3 last:border-0 dark:border-strokedark">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="mt-1 font-medium text-black dark:text-white">
      {value || "—"}
    </span>
  </div>
);

export default InfoRow
