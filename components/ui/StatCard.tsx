import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 text-center">
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-3xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}
