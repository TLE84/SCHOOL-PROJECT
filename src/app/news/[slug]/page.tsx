import { Pill } from "@/components/ui/Pill";
import { ArticleCard } from "@/components/ui/ArticleCard";
import Image from "next/image";
import Link from "next/link";
import { Share2, ThumbsUp, MessageSquare, Bookmark, ChevronRight, ChevronLeft, Link as LinkIcon, CheckCircle, Mail } from "lucide-react";

export default function ArticlePage() {
  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumbs & Header Space */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-10 font-sans font-medium tracking-wide uppercase">
          <Link href="/" className="hover:text-green-700 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <Link href="/news" className="hover:text-green-700 transition-colors">News</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-900 font-bold">Technology</span>
        </div>

        <div className="mb-8">
          <Pill label="Technology" variant="green" />
        </div>

        <h1 className="font-sans text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 max-w-5xl tracking-tight">
          PTI Unveils New Innovation Hub to Drive Research and Student Entrepreneurship
        </h1>

        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-4xl leading-relaxed font-serif">
          The hub is designed to equip students with modern tools, mentorship, and industry exposure to transform innovative ideas into real-world solutions.
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between border-y border-slate-200 py-6 mb-12">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
               <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-sans font-bold bg-slate-100">MA</div>
            </div>
            <div>
              <div className="flex items-center gap-1 font-bold text-slate-900 font-sans text-lg">
                By Maryam Abubakar <CheckCircle size={16} className="text-green-600 ml-1" />
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500 font-sans mt-1">
                <span className="font-medium">May 15, 2024</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>5 min read</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span>1.2k views</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm font-bold text-slate-700 font-sans uppercase tracking-widest">
            <span>Share</span>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:text-blue-600 transition-all shadow-sm"><Share2 size={16} /></button>
              <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:text-blue-400 transition-all shadow-sm"><Share2 size={16} /></button>
              <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:text-blue-700 transition-all shadow-sm"><Share2 size={16} /></button>
              <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:text-green-700 transition-all shadow-sm"><LinkIcon size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Column */}
          <div className="lg:col-span-8">
            <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden mb-16 bg-slate-100 shadow-lg">
               <Image 
                  src="/images/pti_innovation_hub_1786022204702.png" 
                  alt="PTI Innovation Hub" 
                  fill 
                  className="object-cover" 
                  priority
               />
            </div>
            
            {/* The prose prose-headings:font-sans maps to Helvetica, and body is naturally serif (Playfair) */}
            <article className="prose prose-xl prose-slate prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-green-700 hover:prose-a:text-green-800 max-w-none mb-16 font-serif leading-loose">
              <p>
                The Petroleum Training Institute (PTI) has officially launched its state-of-the-art <a href="#">Innovation Hub</a>, a landmark initiative aimed at fostering creativity, research, and entrepreneurship among students and staff.
              </p>
              <p>
                The hub, located at the Main Campus, is equipped with modern laboratories, co-working spaces, high-performance computing systems, and advanced prototyping tools.
              </p>
              <blockquote className="border-l-4 border-green-700 bg-green-50/50 p-8 rounded-r-xl italic text-2xl text-slate-800 my-12 shadow-sm font-serif">
                "This hub represents our commitment to building a culture of innovation and preparing our students to solve real-world challenges."
                <footer className="text-lg text-slate-600 mt-6 not-italic font-sans font-bold uppercase tracking-wide">— Dr. Ahmed Salisu, Rector, PTI</footer>
              </blockquote>
              <p>
                The Innovation Hub will also serve as a bridge between academia and industry, providing opportunities for collaborations, internships, and startups.
              </p>
            </article>

            {/* Tags */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-16 font-sans">
              <span className="font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide text-sm"><LinkIcon size={16}/> Tags:</span>
              <div className="flex flex-wrap gap-3">
                <Pill label="Innovation" variant="outline" href="#" />
                <Pill label="Research" variant="outline" href="#" />
                <Pill label="Entrepreneurship" variant="outline" href="#" />
                <Pill label="Students" variant="outline" href="#" />
                <Pill label="Technology" variant="outline" href="#" />
              </div>
            </div>

            {/* Reactions & Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-y border-slate-200 py-6 mb-20 gap-6 font-sans">
              <div className="flex gap-8">
                <button className="flex items-center gap-3 text-slate-600 hover:text-green-700 font-bold transition-colors">
                  <div className="p-3 bg-slate-50 rounded-full border border-slate-200"><ThumbsUp size={20} /></div> 128
                </button>
                <button className="flex items-center gap-3 text-slate-600 hover:text-green-700 font-bold transition-colors">
                  <div className="p-3 bg-slate-50 rounded-full border border-slate-200"><MessageSquare size={20} /></div> 24
                </button>
              </div>
              <div className="flex gap-8 w-full sm:w-auto justify-between sm:justify-end">
                 <button className="flex items-center gap-3 text-slate-600 hover:text-green-700 font-bold transition-colors">
                  <div className="p-3 bg-slate-50 rounded-full border border-slate-200"><Bookmark size={20} /></div> Save
                </button>
                <Link href="#" className="flex items-center gap-3 text-white bg-slate-900 hover:bg-green-700 font-bold py-3 px-6 rounded-full transition-colors shadow-md">
                  Next Article <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 font-sans">
            <div className="sticky top-32 flex flex-col gap-10">
              
              {/* Table of Contents - Moved to Top */}
              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                <h3 className="font-sans font-bold text-xl mb-6 text-slate-900 border-l-4 border-green-700 pl-3 inline-block">Table of Contents</h3>
                <ol className="text-base text-slate-600 space-y-4 font-medium list-decimal list-outside ml-5">
                  <li><a href="#" className="text-green-700 font-bold hover:underline">Innovation Hub Overview</a></li>
                  <li><a href="#" className="hover:text-green-700 transition-colors">Facilities and Resources</a></li>
                  <li><a href="#" className="hover:text-green-700 transition-colors">Benefits to Students</a></li>
                  <li><a href="#" className="hover:text-green-700 transition-colors">Industry Collaboration</a></li>
                  <li><a href="#" className="hover:text-green-700 transition-colors">Future Plans</a></li>
                </ol>
              </div>

              {/* Author Widget */}
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-sm">
                <h3 className="font-sans font-bold text-xl mb-6 text-slate-900 border-l-4 border-green-700 pl-3 inline-block">About the Author</h3>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 bg-white border border-slate-200 rounded-full relative overflow-hidden flex-shrink-0 flex items-center justify-center font-bold text-slate-400 text-xl shadow-inner">MA</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg flex items-center gap-1">Maryam Abubakar <CheckCircle size={16} className="text-green-600 ml-1" /></h4>
                    <p className="text-sm text-slate-500 font-medium tracking-wide uppercase mt-1">Campus Correspondent</p>
                  </div>
                </div>
                <p className="text-base text-slate-600 mb-6 leading-relaxed font-serif">
                  Maryam covers technology, innovation, and academic development stories across the institute.
                </p>
                <div className="flex gap-4 text-slate-400">
                  <a href="#" className="p-2 bg-white rounded-full hover:text-blue-400 transition-colors shadow-sm border border-slate-100"><Share2 size={18} /></a>
                  <a href="#" className="p-2 bg-white rounded-full hover:text-blue-700 transition-colors shadow-sm border border-slate-100"><Share2 size={18} /></a>
                  <a href="#" className="p-2 bg-white rounded-full hover:text-green-700 transition-colors shadow-sm border border-slate-100"><Mail size={18} /></a>
                </div>
              </div>

              {/* Related Stories */}
              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm">
                <h3 className="font-sans font-bold text-xl mb-8 text-slate-900 border-l-4 border-green-700 pl-3 inline-block">Related Stories</h3>
                <div className="flex flex-col gap-8">
                  <div className="flex gap-5 group cursor-pointer items-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 relative overflow-hidden shadow-sm">
                       <Image src="/images/pti_students_lab_1786022214917.png" alt="Students" fill className="object-cover group-hover:scale-110 transition-transform duration-700"/>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-sans font-bold text-base text-slate-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-2 leading-snug">
                        PTI Students Win Big at National Tech Competition
                      </h4>
                      <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">May 10, 2024</p>
                    </div>
                  </div>
                  {/* Mock 2 */}
                  <div className="flex gap-5 group cursor-pointer items-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 relative overflow-hidden shadow-sm"></div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-sans font-bold text-base text-slate-900 group-hover:text-green-700 transition-colors line-clamp-2 mb-2 leading-snug">
                        PTI and NNPC Partner on Advanced Research Projects
                      </h4>
                      <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">May 8, 2024</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter Widget */}
              <div className="bg-green-900 border border-green-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 p-4 opacity-10 transform rotate-12">
                   <Mail size={180} />
                </div>
                <h3 className="font-sans font-black text-2xl mb-4 flex items-center gap-3 relative z-10"><Mail size={24}/> Stay Updated</h3>
                <p className="text-base text-green-100 mb-8 relative z-10 leading-relaxed font-serif">
                  Subscribe to our newsletter for the latest news and academic announcements from PTI.
                </p>
                <form className="relative z-10 flex flex-col gap-4">
                  <input type="email" placeholder="Enter your email" className="w-full px-5 py-4 rounded-xl bg-white text-slate-900 text-base font-medium focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all shadow-inner" required />
                  <button type="submit" className="w-full bg-gold hover:bg-yellow-500 text-slate-900 font-black py-4 px-6 rounded-xl text-base uppercase tracking-wider transition-all shadow-md transform hover:-translate-y-1">
                    Subscribe
                  </button>
                </form>
                <p className="text-xs font-medium text-green-400 mt-6 text-center opacity-80 uppercase tracking-widest">No spam. Unsubscribe anytime.</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
