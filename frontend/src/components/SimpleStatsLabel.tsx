export function SimpleStatsLabel({ value, label, subLabel }: { value: string, label: string, subLabel?: string }) {
  return (
    <div className="pb-4">
      <div className="text-5xl">{value}</div>
      <div className="text-lg">{label}</div>
      {subLabel && <div className="text-sm font-normal text-gray-500">{subLabel}</div>}
    </div>
  );
}

