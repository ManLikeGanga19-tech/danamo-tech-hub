'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Newsletter from '@/components/NewsLetter/NewsLetter';
import { Navbar1 } from '@/components/navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, User } from 'lucide-react';

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
    description: 'Engage with a community of like minded tech enthusiasts.',
  },
];

export default function WebinarsPage() {

  const upcoming = webinars.filter(w => w.type === 'upcoming');
  const Webinars = pastWebinars.filter(w => w.type === 'past');

  return (
    <div className="bg-background text-foreground">
      <Navbar1 />
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src="/webinars/webinars-bg.jpg"
          alt="Webinar Hero"
          layout="fill"
          objectFit="cover"
          className="object-center"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white dark:text-blue-400 text-center px-4 animate-pulse">
            Join Our Upcoming Tech Webinars
          </h2>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F]">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Upcoming Webinars</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcoming.map(webinars => (
            <Card key={webinars.id} className="rounded-lg shadow-lg bg-gradient-to-b from-white to-gray-100 dark:from-[#0e0e15] dark:to-[#1E1E2F] overflow-hidden">
              <Image src={webinars.image} alt={webinars.title} width={500} height={300} className="w-full h-52 object-cover" />
              <CardHeader className="p-5">
                <CardTitle className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{webinars.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="flex items-center text-sm mb-1"><CalendarDays className="w-4 h-4 mr-2" />{webinars.date}</p>
                <p className="flex items-center text-sm mb-1"><Clock className="w-4 h-4 mr-2" />{webinars.time}</p>
                <p className="flex items-center text-sm mb-4"><User className="w-4 h-4 mr-2" />Hosted by {webinars.host}</p>
                <Button className="w-full bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white">Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto bg-gradient-to-b from-gray-100 to-white dark:from-[#1E1E2F] dark:to-[#0e0e15] ">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Past Webinars</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Webinars.map((pastWebinars) => (
            <Card key={pastWebinars.id} className="rounded-lg shadow-lg bg-gradient-to-b from-gray-100 to-white dark:from-[#1E1E2F] dark:to-[#0e0e15] overflow-hidden">
              <Image src={pastWebinars.image} alt={pastWebinars.title} width={500} height={300} className="w-full h-52 object-cover" />

              <CardHeader className="p-5">
                <CardTitle className="text-xl font-bold mb-2 text-blue-600 dark:text-blue-400">{pastWebinars.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-1">
                  {pastWebinars.date}
                </p>
                <p className="mb-2 text-sm"> Speaker: {pastWebinars.speaker}</p>
                <Button asChild variant="outline" className="w-full bg-white text-blue-600 border border-blue-600 dark:border-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-600 hover:text-white dark:bg-gray-900 dark:text-white dark:hover:bg-blue-600 dark:hover:text-white"
                >
                  <a href={pastWebinars.videoLink}>Watch Replay</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 md:px-16 max-w-7xl mx-auto bg-gradient-to-b from-white to-white dark:from-[#0e0e15] dark:to-[#1E1E2F]">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600 dark:text-blue-400">Why Join Our Webinars?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reasonsToJoin.map((reason, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600 dark:text-blue-400">{reason.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{reason.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
      <Newsletter />
      <Footer />
    </div>
  );
}
