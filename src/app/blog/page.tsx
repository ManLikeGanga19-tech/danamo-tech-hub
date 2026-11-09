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

interface Blog {
  id: number;
  title: string;
  description: string;
  author: string;
  date: string;
  tags: string[];
  image: string;
}

const dummyBlogs: Blog[] = [
  {
    id: 1,
    title: 'The Rise of AI in Modern Web Development',
    description: 'Explore how AI is reshaping front-end and back-end web development with automation, personalization, and smarter tools.',
    author: 'Daniel Orwenjo',
    date: 'June 1, 2025',
    tags: ['AI', 'Web Development'],
    image: '/blogs/blog1.jpg',
  },
  {
    id: 2,
    title: '10 JavaScript Tips Every Developer Should Know',
    description: 'Sharpen your skills with these JavaScript tricks, from async patterns to array destructuring and ES2025+ syntax.',
    author: 'Daniel Orwenjo',
    date: 'May 28, 2025',
    tags: ['JavaScript', 'Tips'],
    image: '/blogs/blog2.jpg',
  },
  {
    id: 3,
    title: 'Why UX Design Matters More Than Ever in 2025',
    description: 'Great UX leads to happier users and better retention. See what trends are defining UX in 2025.',
    author: 'Edwin Nthusi',
    date: 'May 18, 2025',
    tags: ['UX', 'Design'],
    image: '/blogs/blog3.jpg',
  },
]

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Memoize filtered blogs to prevent unnecessary recalculations
  const filteredBlogs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return dummyBlogs

    return dummyBlogs.filter(blog =>
      blog.title.toLowerCase().includes(query) ||
      blog.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }, [searchQuery])

  // Memoize copy link handler with Company Themed Toast
  const handleCopyLink = useCallback((blogId: number) => {
    const url = `${window.location.origin}/blog/${blogId}`
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
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/blogs/blog-bg.jpg"
            alt="Technology blog background featuring digital innovation"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
        </div>

        {/* Overlay Text */}
        <div className="relative z-10 max-w-4xl px-4 w-full">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6">
            Danamo Insights
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white tracking-tight">
            Tech Insights from the <span className='text-blue-500'>Danamo Team</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Dive into tutorials, opinions, and innovations from our developers, designers, and engineers.
          </p>

          {/* Premium Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
            <label htmlFor="blog-search" className="sr-only">Search blog titles or tags</label>
            <Input
              id="blog-search"
              type="search"
              placeholder="Search articles, tutorials, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-xl bg-white/90 dark:bg-[#1E1E2F]/90 backdrop-blur-md border-white/20 dark:border-gray-700 text-gray-900 dark:text-white shadow-2xl text-base focus:ring-2 focus:ring-blue-600 transition-all"
              aria-label="Search blogs"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full" aria-label="Blog posts">
        {filteredBlogs.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group relative flex flex-col bg-white dark:bg-[#1E1E2F] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative w-full h-56 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={`Featured image for ${blog.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4" role="list" aria-label="Blog tags">
                    {blog.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full px-3 py-1"
                        role="listitem"
                      >
                        <Tag className="w-3 h-3 mr-1.5" aria-hidden="true" /> {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title & Desc */}
                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow">
                    {blog.description}
                  </p>

                  {/* Author & Date */}
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 border-t border-gray-100 dark:border-gray-800 pt-4">
                    By <span className="font-semibold text-gray-700 dark:text-gray-300">{blog.author}</span> • <time dateTime={new Date(blog.date).toISOString()}>{blog.date}</time>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <Link href={`/blog/${blog.id}`} className="flex-1">
                      <Button
                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500 dark:hover:text-white transition-colors duration-300 rounded-xl"
                        aria-label={`Read ${blog.title}`}
                      >
                        <LucideBookOpen className="w-4 h-4 mr-2" aria-hidden="true" /> Read Article
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex-none px-4 rounded-xl border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleCopyLink(blog.id)}
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
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium" role="status">
              No articles match your search criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="mt-6 rounded-xl"
            >
              Clear Search
            </Button>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <Newsletter />

      <Footer />
    </div>
  )
}