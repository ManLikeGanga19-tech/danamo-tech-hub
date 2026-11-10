import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Admin Page Not Found</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
        The admin page you are looking for does not exist.
      </p>
      <Button asChild className="bg-blue-600 text-white">
        <Link href="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
}