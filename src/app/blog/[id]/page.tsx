"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar1 } from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Facebook, Linkedin, Tag, User, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

// 1. The same dummy data from the main blog page
const dummyBlogs = [
  {
    id: 1,
    title: 'The Rise of AI in Modern Web Development',
    description: 'Explore how AI is reshaping front-end and back-end web development with automation, personalization, and smarter tools.',
    author: 'Daniel Orwenjo',
    date: 'June 1, 2025',
    readTime: '5 min read',
    tags: ['AI', 'Web Development'],
    image: '/blogs/blog1.jpg',
    content: `
      <p>Artificial Intelligence is no longer a futuristic concept; it's a fundamental shift in how we build for the web. In 2025, AI is transforming everything from how we write code to how users interact with digital interfaces.</p>
      
      <h2>The Role of AI in Front-End Development</h2>
      <p>Modern front-end frameworks are increasingly integrating AI-powered tools. Imagine a development environment that predicts your next line of code, or a UI that automatically adjusts its layout and color palette based on the user's emotional state or time of day. We are moving towards hyper-personalized web experiences.</p>
      
      <h2>Automating the Back-End</h2>
      <p>On the server side, AI is optimizing database queries, automating security patches, and predicting server load to scale resources dynamically. For our clients at Danamo Tech, this means faster deployment times, lower infrastructure costs, and a more secure application overall.</p>
      
      <h2>What This Means for Businesses</h2>
      <p>For startups and SMEs, adopting AI-driven web development is no longer optional; it's a competitive necessity. It levels the playing field, allowing smaller teams to build enterprise-grade applications with unprecedented speed and efficiency.</p>
      
      <p>The future of web development is a collaborative effort between human creativity and artificial intelligence. At Danamo Tech, we are already integrating these tools to deliver faster, smarter, and more scalable solutions.</p>
    `
  },
  {
    id: 2,
    title: '10 JavaScript Tips Every Developer Should Know',
    description: 'Sharpen your skills with these JavaScript tricks, from async patterns to array destructuring and ES2025+ syntax.',
    author: 'Daniel Orwenjo',
    date: 'May 28, 2025',
    readTime: '4 min read',
    tags: ['JavaScript', 'Tips'],
    image: '/blogs/blog2.jpg',
    content: `
      <p>JavaScript is constantly evolving, and even seasoned developers can miss out on modern, time-saving features. Here are 10 tips to elevate your code.</p>
      <h2>1. Use Optional Chaining (?.)</h2>
      <p>Stop using massive conditional checks to verify object properties. Optional chaining makes your code cleaner and safer.</p>
      <h2>2. Array Destructuring</h2>
      <p>Swap variables, extract specific elements, and make your code more readable using modern destructuring syntax.</p>
      <p>... (more tips)</p>
    `
  },
  {
    id: 3,
    title: 'Why UX Design Matters More Than Ever in 2025',
    description: 'Great UX leads to happier users and better retention. See what trends are defining UX in 2025.',
    author: 'Edwin Nthusi',
    date: 'May 18, 2025',
    readTime: '6 min read',
    tags: ['UX', 'Design'],
    image: '/blogs/blog3.jpg',
    content: `
      <p>In a digital landscape saturated with apps and websites, the only differentiator left is user experience. Learn how to stand out.</p>
      <h2>Micro-interactions are King</h2>
      <p>Small animations and tactile feedback loops create a premium feel that users subconsciously crave.</p>
      <h2>Accessibility is Non-Negotiable</h2>
      <p>Designing for everyone is not just ethical, it's smart business. Modern UX must incorporate WCAG standards from day one.</p>
    `
  },
];

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  
  // Find the specific blog post based on the URL ID
  const blog = dummyBlogs.find((b) => b.id === Number(params.id));

  // Handle 404 - If the blog doesn't exist
  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0e0e15]">
        <Navbar1 />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            The article you are looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
          <Button asChild className="bg-blue-600 text-white rounded-xl px-8 py-6">
            <Link href="/blog">Back to Blog</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast.success("Article link copied!", {
        className: 'bg-blue-600 text-white border-none shadow-lg',
        duration: 3000,
      });
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
      <Navbar1 />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative w-full h-[50vh] md:h-[65vh] flex items-end justify-center pb-16 px-4">
          <div className="absolute inset-0 z-0">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-black/60 to-black/30 dark:from-[#0e0e15] dark:via-black/70 dark:to-black/40" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto w-full">
            {/* Back Button */}
            <Link href="/blog" className="inline-flex items-center text-sm font-medium text-gray-200 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
            </Link>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag, index) => (
                <span key={index} className="flex items-center text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 backdrop-blur-md rounded-full px-3 py-1">
                  <Tag className="w-3 h-3 mr-1.5" /> {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              {blog.title}
            </h1>

            {/* Meta Data */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                  {blog.author.charAt(0)}
                </div>
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {blog.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {blog.readTime}
              </div>
            </div>
          </div>
        </section>

        {/* ARTICLE CONTENT */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            
            {/* The Article Body */}
            <div 
              className="prose prose-lg dark:prose-invert prose-blue max-w-none 
                         prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                         prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                         prose-a:text-blue-600 dark:prose-a:text-blue-400"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />

            {/* Share & Copy Section */}
            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                Share this article
              </p>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:text-blue-600">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Author Bio Card */}
            <div className="mt-12 p-8 rounded-2xl bg-white dark:bg-[#1E1E2F] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 shrink-0">
                {blog.author.charAt(0)}
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{blog.author}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {blog.author} is a core team member at Danamo Tech, specializing in building scalable digital solutions and sharing insights on modern technology trends.
                </p>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}