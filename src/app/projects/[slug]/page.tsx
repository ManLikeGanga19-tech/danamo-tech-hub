"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Loader2,
  Tag,
  User,
  Building2,
  FolderKanban,
} from "lucide-react";
import { apiFetch } from "@/lib/api/client";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  content: string;
  client_name: string | null;
  client_industry: string | null;
  image_url: string;
  live_url: string | null;
  featured: boolean;
  created_at: string | null;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    apiFetch<Project>(`/projects/${slug}`)
      .then(setProject)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0e0e15]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0e0e15]">
        <Navbar1 />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Project not found
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              This case study may have been removed or is not published yet.
            </p>
            <Button asChild className="bg-blue-600 text-white rounded-xl">
              <Link href="/projects">Back to all projects</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HERO */}
        <section className="relative w-full h-[55vh] md:h-[65vh] flex items-end justify-center pb-16 px-4">
          <div className="absolute inset-0 z-0 bg-gray-900">
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/60 to-black/40 dark:from-[#0e0e15] dark:via-black/70 dark:to-black/40" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm font-medium text-gray-200 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all projects
            </Link>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 backdrop-blur-md rounded-full px-3 py-1">
                <Tag className="w-3 h-3" />
                {project.category}
              </span>
              {project.featured && (
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white bg-blue-600 rounded-full px-3 py-1">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight tracking-tight">
              {project.title}
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl">
              {project.description}
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto w-full">
          {/* Client Info Cards */}
          {(project.client_name || project.client_industry) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
              {project.client_name && (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Client
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {project.client_name}
                  </p>
                </div>
              )}
              {project.client_industry && (
                <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Industry
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {project.client_industry}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <article className="prose prose-lg dark:prose-invert prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400">
            <div dangerouslySetInnerHTML={{ __html: project.content }} />
          </article>

          {/* Live URL CTA */}
          {project.live_url && (
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-2">See it in action</h3>
              <p className="text-blue-100 mb-6">
                Visit the live project to explore the final result.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 transition-colors rounded-xl group"
              >
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Visit Live Project
                  <ExternalLink className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </Button>
            </div>
          )}

          {/* Back CTA */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              Want a similar result for your business?
            </p>
            <div className="flex gap-3">
              <Button
                asChild
                variant="outline"
                className="border-gray-300 dark:border-gray-700 rounded-xl"
              >
                <Link href="/projects" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  All Projects
                </Link>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-700 rounded-xl group"
              >
                <a href="/#contact" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}