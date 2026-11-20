import { Check } from "lucide-react";
import type { ServiceSection } from "@/lib/services";

/** One content section of a service or location page (paragraphs, feature grid, steps or bullets). */
export function ContentSection({ section }: { section: ServiceSection }) {
  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">{section.heading}</h2>
      {section.paragraphs?.map((p) => (
        <p key={p} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-3xl">{p}</p>
      ))}
      {section.features && (
        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          {section.features.map((f) => (
            <div key={f.title} className="p-5 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      )}
      {section.steps && (
        <ol className="mt-6 space-y-4">
          {section.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex-none w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center" aria-hidden="true">
                {i + 1}
              </span>
              <div className="pt-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {section.bullets && (
        <ul className="mt-6 space-y-3 max-w-3xl">
          {section.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-gray-700 dark:text-gray-300 leading-relaxed">
              <Check className="w-5 h-5 mt-0.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
