import { ArticleCard } from "@/components/ui/ArticleCard";
import { Pill } from "@/components/ui/Pill";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-7xl">
      {/* Featured Hero Section */}
      <section className="mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-8 relative h-[450px] lg:h-[500px] rounded-2xl overflow-hidden group shadow-lg">
            <Image 
              src="/images/pti_innovation_hub_1786022204702.png" 
              alt="PTI Innovation Hub" 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-5/6 text-white">
              <Pill label="Innovation" variant="green" />
              <Link href="/news/pti-unveils-new-innovation-hub">
                <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl font-bold mt-6 mb-4 leading-tight hover:text-green-300 transition-colors">
                  PTI Unveils New Innovation Hub to Drive Research and Student Entrepreneurship
                </h1>
              </Link>
              <p className="text-slate-200 text-lg md:text-xl mb-6 line-clamp-2 font-serif leading-relaxed">
                The hub is designed to equip students with modern tools, mentorship, and industry exposure to transform innovative ideas into real-world solutions.
              </p>
              <div className="flex items-center gap-4 text-sm font-medium text-slate-300 tracking-wide font-sans">
                <span>By Dr. Ahmed Salisu</span>
                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                <span>May 15, 2024</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-8">
            <h2 className="font-sans text-xl font-bold text-slate-900 border-l-4 border-green-700 pl-3 uppercase tracking-wider">Trending Now</h2>
            <div className="flex flex-col gap-8">
              <ArticleCard 
                title="PTI and NNPC Partner on Advanced Research Projects"
                category="Research"
                date="May 8, 2024"
                author="John Doe"
                href="/news/pti-nnpc-partner"
                excerpt="A landmark agreement aimed at solving complex engineering challenges in the oil and gas sector."
              />
              <ArticleCard 
                title="Rector Charges Students on Creativity and Excellence"
                category="Academics"
                date="May 5, 2024"
                author="Jane Smith"
                href="/news/rector-charges-students"
                excerpt="During the matriculation ceremony, the Rector emphasized the importance of a creative mindset."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Stories Grid */}
      <section className="mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <h2 className="font-sans text-4xl font-bold text-slate-900 tracking-tight border-l-4 border-green-700 pl-4">Latest Stories</h2>
          <Link href="/news" className="text-green-700 font-sans font-bold hover:text-green-800 transition-colors mt-4 md:mt-0 flex items-center gap-2">View All Articles &rarr;</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <ArticleCard 
            title="Students Win Big at National Tech Competition"
            category="Technology"
            date="May 10, 2024"
            author="Maryam Abubakar"
            imageUrl="/images/pti_students_lab_1786022214917.png"
            href="/news/students-win-tech-competition"
            excerpt="Our top students secured the first place in the national engineering challenge, showcasing PTI's dominance in technical education."
          />
          <ArticleCard 
            title="New Curriculum Designed for Emerging Energies"
            category="Academics"
            date="May 2, 2024"
            author="Academic Board"
            href="/news/new-curriculum"
            excerpt="The Academic board has approved a revised syllabus integrating renewable energy modules across all departments."
          />
          <ArticleCard 
            title="Alumni Association Announces Annual Scholarship Fund"
            category="Alumni"
            date="April 28, 2024"
            author="Alumni Desk"
            href="/news/alumni-scholarship"
            excerpt="A 50 million Naira fund has been established to support indigent students with outstanding academic records."
          />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="mb-16">
        <h2 className="font-sans text-4xl font-bold text-slate-900 border-l-4 border-green-700 pl-4 mb-10 tracking-tight">Upcoming Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event 1 */}
          <div className="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-700 text-white p-8 flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-sm font-bold font-sans uppercase tracking-widest mb-1 text-green-100">Oct</span>
              <span className="text-5xl font-sans font-black">24</span>
            </div>
            <div className="p-8 flex flex-col justify-center w-full">
              <h3 className="font-sans text-2xl font-bold text-slate-900 mb-3 leading-snug">2024 Matriculation Ceremony</h3>
              <div className="flex flex-col gap-2 text-sm text-slate-600 mb-6 font-sans">
                <span className="flex items-center gap-3"><Clock size={18} className="text-slate-400" /> 10:00 AM - 1:00 PM</span>
                <span className="flex items-center gap-3"><MapPin size={18} className="text-slate-400" /> PTI Conference Centre</span>
              </div>
              <Link href="/events/matriculation" className="text-green-700 font-bold font-sans text-sm hover:text-green-900 uppercase tracking-wide">Event Details &rarr;</Link>
            </div>
          </div>
          {/* Event 2 */}
          <div className="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-green-700 text-white p-8 flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-sm font-bold font-sans uppercase tracking-widest mb-1 text-green-100">Nov</span>
              <span className="text-5xl font-sans font-black">12</span>
            </div>
            <div className="p-8 flex flex-col justify-center w-full">
              <h3 className="font-sans text-2xl font-bold text-slate-900 mb-3 leading-snug">Annual Technology Exhibition</h3>
              <div className="flex flex-col gap-2 text-sm text-slate-600 mb-6 font-sans">
                <span className="flex items-center gap-3"><Clock size={18} className="text-slate-400" /> 9:00 AM - 4:00 PM</span>
                <span className="flex items-center gap-3"><MapPin size={18} className="text-slate-400" /> Main Campus Pavilion</span>
              </div>
              <Link href="/events/tech-exhibition" className="text-green-700 font-bold font-sans text-sm hover:text-green-900 uppercase tracking-wide">Event Details &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
