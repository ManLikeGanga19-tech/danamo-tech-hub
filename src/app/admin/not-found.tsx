export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">404</p>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page not found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        This admin page does not exist.
      </p>
    </div>
  );
}
