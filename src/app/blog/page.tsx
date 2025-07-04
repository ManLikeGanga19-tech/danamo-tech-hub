'use client'

import { useState } from 'react';
import { Navbar1 } from '@/components/navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Newsletter from '@/components/NewsLetter/NewsLetter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Copy, Tag, LucideBookOpen } from 'lucide-react';
import Image from 'next/image';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
const dummyBlogs = [
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

  const filteredBlogs = dummyBlogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <ProtectedRoute>
      <>
        <Navbar1 />

        {/* Hero with Background Image */}
        <section className="relative h-[300px] md:h-[400px] flex items-center justify-center text-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/blogs/blog-bg.jpg"
              alt="blog background"
              layout="fill"
              objectFit="cover"
              className="brightness-50"
              priority
            />
          </div>

          {/* Overlay Text */}
          <div className="relative z-10 px-4 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Tech Insights from the <span className='text-blue-600 dark:text-blue-400' >Danamo Team</span></h1>
            <p className="text-lg text-gray-200">
              Dive into tutorials, opinions, and innovations from our developers, designers, and engineers.
            </p>

            {/* Search */}
            <div className="relative mt-8 max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search blog titles or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md bg-white/90 dark:bg-gray-800 dark:text-white border dark:border-gray-700"
              />
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-100 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F] ">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div key={blog.id} className="bg-gray-50 dark:bg-[#2A2A3D] rounded-lg shadow overflow-hidden group transition-transform hover:-translate-y-1">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={800}
                    height={500}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">{blog.title}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{blog.description}</p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      By <span className="font-medium">{blog.author}</span> • {blog.date}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag, index) => (
                        <span key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-300 border rounded px-2 py-1">
                          <Tag className="w-3 h-3 mr-1" /> {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-800">
                        <LucideBookOpen className="w-4 h-4 mr-1" /> Open
                      </Button>
                      <Button variant="ghost" className="text-blue-600 hover:text-blue-800" onClick={() =>
                        toast("Link copied successfully", {
                          duration: 3000
                        })}>
                        <Copy className="w-4 h-4 mr-1" /> Copy Link
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-full text-gray-500 dark:text-gray-300">No blogs match your search.</p>
            )}
          </div>

        </section>
        {/* Newsletter */}
        <div className="mt-0">
          <Newsletter />
        </div>
        <Footer />
      </>
    </ProtectedRoute>
  )
}