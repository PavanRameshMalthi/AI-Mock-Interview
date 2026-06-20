import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowRight,
  FaCertificate,
  FaChartLine,
  FaCheckCircle,
  FaFileAlt,
  FaMicrophone,
  FaShieldAlt,
  FaChevronDown,
  FaInfoCircle,
  FaStar,
} from "react-icons/fa";

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const features = [
    {
      Icon: FaMicrophone,
      title: "Voice-Enabled Practice",
      description: "Answer mock questions using web speech-to-text or typing, seeing your transcript rendered live.",
    },
    {
      Icon: FaFileAlt,
      title: "Resume ATS Analysis",
      description: "Match your resume text against target roles to scan for skill gaps and identify missing industry keywords.",
    },
    {
      Icon: FaChartLine,
      title: "Granular Sub-Scoring",
      description: "Get evaluated on Correctness, Relevance, Technical Accuracy, and Communication scores for every answer.",
    },
    {
      Icon: FaCheckCircle,
      title: "Actionable AI Feedback",
      description: "Review exactly what was correct, what was incorrect, the expected answer, and suggestions for improvement.",
    },
    {
      Icon: FaShieldAlt,
      title: "Secure Session History",
      description: "Access, search, filter, restore, or review transcripts of every single mock session you complete.",
    },
    {
      Icon: FaCertificate,
      title: "PDF & Certificates",
      description: "Export polished, candidate-ready PDF reports and download certificates to showcase your interview readiness.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Load Profile Context",
      description: "Optionally paste your resume text to enable tailored question generation and keywords alignment.",
    },
    {
      number: "02",
      title: "Configure Target Role",
      description: "Select from Frontend, Backend, Data Science, or General roles and set your target experience level.",
    },
    {
      number: "03",
      title: "Practice Mock Session",
      description: "Complete targeted questions with real-time speech input or textual responses under mock conditions.",
    },
    {
      number: "04",
      title: "Review Strict Audits",
      description: "Examine detailed sub-score cards, missing keyword gap sheets, and export PDF summaries.",
    },
  ];

  const benefits = [
    {
      title: "Eliminate Guesswork",
      description: "Understand exactly how recruiter-level standards match your current technical explanations.",
    },
    {
      title: "Refine Communication",
      description: "Improve vocabulary structure and response organization using strict speech-clarity feedback.",
    },
    {
      title: "Role Keyword Alignment",
      description: "Automatically match core industry frameworks and terms expected for your target roles.",
    },
  ];

  const faqs = [
    {
      question: "Can I practice mock interviews without a resume?",
      answer: "Absolutely! Personalizing interviews with resume context is optional. You can easily start practice rounds centered on general industry roles and experience levels.",
    },
    {
      question: "How does the voice-recognition system work?",
      answer: "We utilize standard web browser speech recognition (Web Speech API). When enabled, you can speak your answers and view live transcriptions directly in the text editor.",
    },
    {
      question: "How are the mock scores calculated?",
      answer: "Answers are audited against expected concepts. They receive scores across four distinct sub-metrics: Correctness, Relevance, Technical Accuracy, and Communication, which are blended into an overall score.",
    },
    {
      question: "Can I download my mock feedback report?",
      answer: "Yes! Every mock session produces an evaluation dashboard. You can download the complete feedback sheet as a PDF and access certificates for high-scoring completions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 overflow-x-hidden">
      {/* Sticky Top Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080b12]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-100 hover:text-emerald-400 transition" to="/">
          <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">AI Interview</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link className="text-sm font-semibold text-slate-300 hover:text-slate-100 transition" to="/login">
            Sign in
          </Link>
          <Link className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-lg shadow-emerald-500/20 transition duration-200" to="/register">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] bg-sky-500/10 rounded-full blur-[90px] pointer-events-none" />

        <motion.div 
          className="lg:col-span-7 flex flex-col items-start text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-semibold tracking-wide mb-6">
            <FaStar className="text-[10px]" /> Audited AI Evaluation System
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Master Tech Interviews <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 bg-clip-text text-transparent">
              With Strict AI Auditing
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
            Practice role-specific mock questions with voice input. Receive objective audits of your answer correctness, relevance, technical depth, and communication skills.
          </p>
          <div className="flex flex-wrap gap-4 w-full sm:w-auto">
            <Link className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xl shadow-emerald-500/10 transition duration-200" to="/register">
              Get Started Free <FaArrowRight />
            </Link>
            <Link className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3.5 text-base font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-slate-100 rounded-xl transition duration-200" to="/login">
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Hero Interactive Showcase Card Mockup */}
        <motion.div 
          className="lg:col-span-5 w-full flex justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-md p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-lg shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-5">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Evaluation Audit</p>
                <h3 className="text-base font-bold text-slate-200">Interview Snapshot</h3>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-400">Intermediate</span>
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-[6px] border-emerald-500/20">
                <div className="absolute inset-0 rounded-full border-[6px] border-emerald-400 border-t-transparent border-r-transparent rotate-45" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-slate-100">82</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Overall</span>
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>Technical depth</span>
                    <span>85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: "85%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
                    <span>Communication</span>
                    <span>78%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: "78%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 space-y-2 text-xs">
              <p className="text-slate-400 leading-relaxed">
                <span className="text-emerald-400 font-bold">✔ What was correct:</span> separation of concerns, performance optimization, React testing library
              </p>
              <p className="text-slate-400 leading-relaxed">
                <span className="text-rose-400 font-bold">✖ What was incorrect:</span> state management tradeoffs, scalability examples
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Workspace features</p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Everything you need to practice and improve</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.article 
              className="p-6 rounded-xl border border-slate-800/50 bg-slate-950/30 hover:border-slate-800 hover:bg-slate-900/40 transition duration-300 flex flex-col items-start"
              key={feature.title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 text-emerald-400 mb-5">
                <feature.Icon className="text-xl" />
              </div>
              <h3 className="text-lg font-bold text-slate-100 mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* How It Works (Workflow) */}
      <section className="px-6 py-20 bg-slate-950/20 border-t border-b border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Guided flow</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Simple step-by-step preparation</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div className="relative group" key={step.number}>
                <div className="flex items-baseline gap-4 mb-4">
                  <span className="text-5xl font-black text-slate-800 group-hover:text-emerald-500/20 transition duration-300">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-slate-200">{step.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed pl-1">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Why it matters</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6">
              Build developer credentials with target role mock trials
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              Our mock interview workspace is engineered strictly for software roles, helping candidates bridge the gap between technical knowledge and structured communication.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {benefits.map((benefit) => (
              <div className="p-5 rounded-xl border border-slate-800/40 bg-slate-900/20 flex gap-4" key={benefit.title}>
                <div className="flex-shrink-0 mt-1">
                  <FaCheckCircle className="text-emerald-400 text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200 mb-1">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="px-6 py-20 bg-slate-950/20 border-t border-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-3">Questions & answers</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Frequently asked questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div className="rounded-xl border border-slate-800/80 bg-slate-900/20 overflow-hidden" key={idx}>
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-slate-200 hover:text-slate-100 transition duration-150 focus:outline-none"
                    onClick={() => toggleFaq(idx)}
                    type="button"
                  >
                    <span>{faq.question}</span>
                    <FaChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-400" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-5 pt-1 border-t border-slate-800/40 text-slate-400 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call To Action (CTA) */}
      <section className="px-6 py-20 max-w-7xl mx-auto relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/60 p-8 md:p-16 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/5 text-sky-400 text-xs font-semibold tracking-wide mb-6">
            <FaInfoCircle className="text-[10px]" /> Reusable Mock Workspace
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Ready to structure your tech answers?
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-8 max-w-xl">
            Build habits with interview streaks, analyze resumes against target job criteria, and download certificate proofs of your completion scores.
          </p>
          <Link className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xl shadow-emerald-500/10 transition duration-200" to="/register">
            Create Free Account <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
