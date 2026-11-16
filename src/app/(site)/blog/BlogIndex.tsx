'use client'

import { useState, useMemo, useCallback } from 'react';
import { Navbar1 } from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Newsletter from '@/components/NewsLetter/NewsLetter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Copy, Tag, LucideBookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { coverSrc, formatDate, type BlogSummary } from '@/lib/blog';

export default function BlogIndex({ posts }: { posts: BlogSummary[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return posts
    return posts.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }, [searchQuery, posts])

  const handleCopyLink = useCallback((slug: string) => {
    const url = `${window.location.origin}/blog/${slug}`
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!", {
        className: 'bg-blue-600 text-white border-none shadow-lg',
        duration: 3000,
      })
    }).catch(() => {
      toast.error("Failed to copy link", {
        className: 'bg-red-500 text-white border-none shadow-lg',
        duration: 3000,
      })
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      {/* Hero with Background Image */}
      <section className="relative h-[50vh] md:h-[60vh] w-full flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/blogs/blog-bg.jpg"
            alt="Technology blog background featuring digital innovation"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          {/* Darkens only enough for the text to read; the image stays vivid */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/55" />
        </div>

        <div className="relative z-10 max-w-4xl px-4 w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-600 text-white text-sm font-semibold mb-6">
            Danamo Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
            Tech Insights from <span className='text-blue-300'>Danamo Tech</span>
          </h1>
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-10 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            Practical articles on software, products and running technology for growing businesses.
          </p>

          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700" size={20} aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">Search blog titles or tags</label>
            <Input
              id="blog-search"
              type="search"
              placeholder="Search articles or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-xl bg-white dark:bg-[#1E1E2F] border-white/20 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 shadow-2xl text-base focus:ring-2 focus:ring-blue-600 transition-all"
              aria-label="Search blogs"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full" aria-label="Blog posts">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-700 dark:text-gray-200 font-medium" role="status">
              New articles are on the way. Subscribe below to hear when they&apos;re published.
            </p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.slug}
                className="group relative flex flex-col bg-white dark:bg-[#1E1E2F] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/blog/${blog.slug}`} className="relative block w-full h-56 overflow-hidden" tabIndex={-1} aria-hidden="true">
                  <img
                    src={coverSrc(blog)}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  {blog.tags.length > 0 && (
                    <ul className="flex flex-wrap gap-2 mb-4" aria-label="Tags">
                      {blog.tags.map((tag) => (
                        <li
                          key={tag}
                          className="flex items-center text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/15 rounded-full px-3 py-1"
                        >
                          <Tag className="w-3 h-3 mr-1.5" aria-hidden="true" /> {tag}
                        </li>
                      ))}
                    </ul>
                  )}

                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors line-clamp-2">
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h2>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 line-clamp-3 flex-grow">
                    {blog.excerpt}
                  </p>

                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-6 border-t border-gray-200 dark:border-gray-800 pt-4">
                    By <span className="font-semibold text-gray-900 dark:text-white">{blog.author_name}</span>
                    {blog.published_at && <> • <time dateTime={blog.published_at}>{formatDate(blog.published_at)}</time></>}
                    {" "}• {blog.read_minutes} min read
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <Button
                      asChild
                      className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500 dark:hover:text-white transition-colors duration-300 rounded-xl"
                    >
                      <Link href={`/blog/${blog.slug}`} aria-label={`Read ${blog.title}`}>
                        <LucideBookOpen className="w-4 h-4 mr-2" aria-hidden="true" /> Read Article
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-none px-4 rounded-xl border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleCopyLink(blog.slug)}
                      aria-label={`Copy link to ${blog.title}`}
                    >
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-700 dark:text-gray-200 font-medium" role="status">
              No articles match your search.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')} className="mt-6 rounded-xl">
              Clear Search
            </Button>
          </div>
        )}
      </section>

      <Newsletter />
      <Footer />
    </div>
  )
}
