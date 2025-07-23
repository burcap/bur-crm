'use client';
export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <span className="animate-spin inline-block w-6 h-6 border-4 border-current border-t-transparent rounded-full" />
    </div>
  );
}
