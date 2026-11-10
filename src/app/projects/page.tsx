"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Newsletter from "@/components/NewsLetter/NewsLetter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, FolderKanban, ExternalLink, Tag } from "lucide-react";
import { apiFetch } from "@/lib/api/client";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  image_url: string;
  live_url: string | null;
  featured: boolean;
  created_at: string | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    apiFetch<Project[]>("/projects")
      .then(setProjects)
      .catch((err) => console.error("Failed to load projects:", err))
      .finally(() => setLoading(false));
  }, []);

  // Build the list of unique categories from existing projects
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.category.toLowerCase()));
    return ["all", ...Array.from(set).sort()];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((p) => p.category.toLowerCase() === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/about-bg.jpg"
              alt="Projects Background"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-black/60 dark:bg-black/75" />
          </div>
          <div className="relative z-10 max-w-4xl px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
              Case Studies
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
              Our <span className="text-blue-500">Work</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Real projects, real results. Explore how we have helped businesses transform their digital presence.
            </p>
          </div>
        </section>

        {/* FILTER + GRID */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#1E1E2F] rounded-2xl border border-gray-100 dark:border-gray-800 max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Projects coming soon
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                We&apos;re curating our best work to share with you. Check back soon.
              </p>
            </div>
          ) : (
            <>
              {/* Category filter */}
              {categories.length > 2 && (
                <div className="flex flex-wrap justify-center gap-2 mb-16">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                        activeCategory === cat
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "bg-white dark:bg-[#1E1E2F] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600"
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group flex flex-col bg-white dark:bg-[#1E1E2F] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      {project.featured && (
                        <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold rounded-full bg-blue-600 text-white shadow-lg">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3">
                        <Tag className="w-3 h-3" />
                        {project.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 flex-grow line-clamp-3">
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                          View Case Study
                        </span>
                        <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProjects.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 dark:text-gray-400">
                    No projects in this category yet.
                  </p>
                </div>
              )}
            </>
          )}
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-b from-transparent to-gray-100 dark:to-[#1E1E2F]">
          <div className="text-center px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Have a project in mind?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Let&apos;s turn your idea into your next case study.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 text-base px-8 py-6 rounded-xl group"
            >
              <a href="/#contact" className="flex items-center gap-2">
                Start a Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </section>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}