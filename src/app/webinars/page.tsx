'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Newsletter from '@/components/NewsLetter/NewsLetter';
import { Navbar1 } from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, User, PlayCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { apiFetch } from '@/lib/api/client';

const webinars = [
  {
    id: 1,
    title: 'Building Scalable Web Apps',
    date: 'June 15, 2025',
    time: '3:00 PM - 4:00 PM GMT',
    host: 'Daniel Orwenjo',
    image: '/webinars/webinar1.jpg',
    type: 'upcoming'
  },
  {
    id: 2,
    title: 'Introduction to Cloud DevOps',
    date: 'May 10, 2025',
    time: '2:00 PM - 3:30 PM GMT',
    host: 'Daniel Orwenjo',
    image: '/webinars/webinar2.jpg',
    type: 'upcoming'
  },
  {
    id: 3,
    title: 'AI in Modern Web Apps',
    date: 'April 22, 2025',
    time: '5:00 PM - 6:00 PM GMT',
    host: 'Daniel Orwenjo',
    image: '/webinars/webinar3.jpg',
    type: 'upcoming'
  },
];

const pastWebinars = [
  {
    id: 1,
    title: 'Building Scalable SaaS Products',
    image: "/webinars/past/past-webinar1.jpg",
    date: 'May 15, 2025',
    speaker: 'Daniel Orwenjo',
    videoLink: '#',
    type: 'past'
  },
  {
    id: 2,
    title: 'Cybersecurity in the Cloud Era',
    image: "/webinars/past/past-webinar2.jpg",
    date: 'April 28, 2025',
    speaker: 'Daniel Orwenjo',
    videoLink: '#',
    type: 'past'
  },
];

const reasonsToJoin = [
  {
    title: 'Expert-Led Sessions',
    description: 'Learn directly from industry professionals and innovators.',
  },
  {
    title: 'Actionable Insights',
    description: 'Gain practical knowledge you can apply immediately.',
  },
  {
    title: 'Networking Opportunities',
    description: 'Engage with a community of like-minded tech enthusiasts.',
  },
];

export default function WebinarsPage() {
  const { user } = useAuth();
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegisterClick = (title: string) => {
    setSelectedWebinar(title);
    setName(user?.full_name || '');
    setEmail(user?.email || '');
    setError('');
    setSuccess(false);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await apiFetch('/webinars/register', {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          webinar_title: selectedWebinar,
        }),
      });
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      let msg = 'Failed to register. Please try again.';
      if (err instanceof Error) {
        const raw = err.message.replace(/^API \d+: /, '');
        try {
          const parsed = JSON.parse(raw);
          if (typeof parsed?.detail === 'string') msg = parsed.detail;
          else msg = raw || msg;
        } catch {
          msg = raw || msg;
        }
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const upcoming = webinars.filter(w => w.type === 'upcoming');
  const past = pastWebinars.filter(w => w.type === 'past');

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col">
      <Navbar1 />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden flex items-center justify-center text-center px-4">
          <Image
            src="/webinars/webinars-bg.jpg"
            alt="Webinar Hero"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70" />
          <div className="relative z-10 max-w-4xl px-4">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6 backdrop-blur-md">
              Live Learning
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Join Our Upcoming <span className="text-blue-500">Tech Webinars</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Master the latest technologies, ask questions live, and accelerate your career with our expert-led sessions.
            </p>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Webinars</h2>
            <p className="text-gray-600 dark:text-gray-400">Secure your spot for our next live sessions.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcoming.map((webinar) => (
              <Card key={webinar.id} className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="relative w-full h-52 overflow-hidden">
                  <Image 
                    src={webinar.image} 
                    alt={webinar.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {webinar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-4">
                  <div className="space-y-3 mb-6">
                    <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium">
                      <CalendarDays className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                      {webinar.date}
                    </p>
                    <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium">
                      <Clock className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                      {webinar.time}
                    </p>
                    <p className="flex items-center text-sm text-gray-600 dark:text-gray-300 font-medium">
                      <User className="w-4 h-4 mr-3 text-blue-600 dark:text-blue-400" />
                      {webinar.host}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleRegisterClick(webinar.title)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 rounded-xl py-6"
                  >
                    Register Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Webinars */}
        <section className="py-24 px-4 md:px-8 bg-gray-50 dark:bg-[#0e0e15] w-full border-y border-gray-100 dark:border-gray-800">
          <div className="max-w-[85rem] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Past Webinars</h2>
              <p className="text-gray-600 dark:text-gray-400">Catch up on our previous sessions at your own pace.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {past.map((webinar) => (
                <Card key={webinar.id} className="group rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full h-52 overflow-hidden">
                    <Image 
                      src={webinar.image} 
                      alt={webinar.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                      {webinar.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{webinar.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-6">Speaker: {webinar.speaker}</p>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl py-6"
                    >
                      <a href={webinar.videoLink}>Watch Replay</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Join */}
        <section className="py-24 px-4 md:px-8 max-w-[85rem] mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why Join Our Webinars?</h2>
            <p className="text-gray-600 dark:text-gray-400">Here is what you get when you attend.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {reasonsToJoin.map((reason, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1E1E2F] shadow-sm">
                  <CardHeader className="p-8 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{reason.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{reason.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <Newsletter />
      </main>
      
      <Footer />

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1E1E2F] border-gray-100 dark:border-gray-800 rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Register for Webinar
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-400">
              You are registering for: <strong className="text-blue-600 dark:text-blue-400">{selectedWebinar}</strong>
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border-l-4 border-red-500 rounded-md">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {success ? (
            <div className="py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h3>
              <p className="text-gray-600 dark:text-gray-400">Check your email for the joining link.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 font-medium">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  className="rounded-xl bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button
                asChild
                className="w-full bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-blue-600/20 rounded-xl py-6 mt-4"
              >
                <button type="submit" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Confirm Registration'}
                </button>
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}