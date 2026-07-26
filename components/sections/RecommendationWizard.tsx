"use client";

import { useState } from "react";
import { GraduationCap, Briefcase, Building2, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { submitRecommendationRequest } from "@/app/actions/recommendation";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export default function RecommendationWizard() {
  const [[step, direction], setStep] = useState([1, 0]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    useCase: "",
    specialRequirements: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalSteps = 3;

  const paginate = (newDirection: number) => {
    if (step === 1 && newDirection === 1 && !formData.useCase) return;
    setStep([step + newDirection, newDirection]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitRecommendationRequest(formData);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const progressPercentage = (step / totalSteps) * 100;

  if (isSubmitted) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 py-24 flex justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-[#101010] border border-white/5 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-3xl font-semibold text-white mb-4">Request Received</h3>
          <p className="text-[#A8A8A8] text-lg mb-10 max-w-md mx-auto">
            Our technology experts will analyze your requirements and send you a personalized, objective laptop recommendation shortly.
          </p>
          <button
            onClick={() => {
              setStep([1, -1]);
              setIsSubmitted(false);
              setFormData({ name: "", email: "", phone: "", budget: "", useCase: "", specialRequirements: "" });
            }}
            className="px-8 py-3.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-24 w-full flex items-center justify-center relative overflow-hidden">
      {/* Background Gradient Shift based on Step */}
      <motion.div 
        animate={{ 
          opacity: step === 1 ? 0.3 : step === 2 ? 0.5 : 0.7 
        }}
        transition={{ duration: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent blur-[120px] pointer-events-none rounded-full"
      ></motion.div>

      <div className="w-full max-w-3xl mx-auto px-4 z-10">
        <div className="w-full bg-[#101010] rounded-[32px] border border-white/5 shadow-2xl overflow-hidden backdrop-blur-xl relative">
          
          {/* Header & Progress */}
          <div className="px-8 sm:px-12 pt-12 pb-6 relative z-10">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-semibold text-white mb-2">Find Your Match</h2>
                <p className="text-[#A8A8A8] text-[15px]">
                  {step === 1 ? "Let's start with your primary identity." : step === 2 ? "What's your budget?" : "Final details"}
                </p>
              </div>
              <span className="text-sm font-medium text-white/40">Step {step} of {totalSteps}</span>
            </div>
            
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="h-full bg-white rounded-full"
              ></motion.div>
            </div>
          </div>

          {/* Body content with Slide Transition */}
          <div className="relative min-h-[400px] px-8 sm:px-12 pb-12 overflow-hidden">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="w-full flex flex-col h-full"
                >
                  <h3 className="text-xl text-white mb-6 font-medium">👨‍🎓 Who are you?</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'Student', icon: GraduationCap, desc: 'Assignments, research, media' },
                      { id: 'Professional', icon: Briefcase, desc: 'Office work, emails, meetings' },
                      { id: 'Business', icon: Building2, desc: 'Enterprise, highly secure, scalable' }
                    ].map(uc => {
                      const isSelected = formData.useCase === uc.id;
                      return (
                        <motion.button
                          key={uc.id}
                          whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.05)" }}
                          onClick={() => setFormData({ ...formData, useCase: uc.id })}
                          className={`w-full p-5 rounded-2xl border transition-all flex items-center gap-5 text-left
                            ${isSelected ? 'border-white/40 bg-white/10' : 'border-white/5 bg-transparent hover:border-white/10'}`}
                        >
                          <div className={`p-3 rounded-full ${isSelected ? 'bg-white/20' : 'bg-white/5'}`}>
                            <uc.icon className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white/60'}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium mb-1 ${isSelected ? 'text-white' : 'text-white/80'}`}>{uc.id}</h4>
                            <p className="text-sm text-white/40">{uc.desc}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-white/20'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-black"></div>}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                  
                  <div className="mt-10 flex justify-end">
                    <button
                      onClick={() => paginate(1)}
                      disabled={!formData.useCase}
                      className="flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="w-full flex flex-col h-full"
                >
                  <h3 className="text-xl text-white mb-6 font-medium">💰 What is your budget?</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                    {["Under ₹40,000", "₹40,000 - ₹60,000", "₹60,000 - ₹1,00,000", "Above ₹1,00,000"].map(bg => {
                      const isSelected = formData.budget === bg;
                      return (
                        <motion.button
                          key={bg}
                          whileHover={{ y: -2 }}
                          onClick={() => setFormData({ ...formData, budget: bg })}
                          className={`w-full p-5 rounded-2xl border text-center transition-all
                            ${isSelected ? 'border-white/40 bg-white/10 text-white' : 'border-white/5 bg-transparent hover:bg-white/5 text-white/70 hover:border-white/10'}`}
                        >
                          <span className="font-medium">{bg}</span>
                        </motion.button>
                      )
                    })}
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-8 border-t border-white/5">
                    <button onClick={() => paginate(-1)} className="px-6 py-2.5 text-white/50 hover:text-white transition-colors">Back</button>
                    <button
                      onClick={() => paginate(1)}
                      disabled={!formData.budget}
                      className="flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                  className="w-full flex flex-col h-full"
                >
                  <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <h3 className="text-xl text-white mb-6 font-medium">✨ Contact Details</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Name</label>
                        <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Email</label>
                        <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all" placeholder="john@example.com" />
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      <label className="text-sm font-medium text-white/60">Special Requirements (Optional)</label>
                      <textarea value={formData.specialRequirements} onChange={e => setFormData({ ...formData, specialRequirements: e.target.value })} rows={3} className="w-full px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all resize-none" placeholder="Any specific software you use? Need a numeric keypad?"></textarea>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-8 border-t border-white/5">
                      <button type="button" onClick={() => paginate(-1)} className="px-6 py-2.5 text-white/50 hover:text-white transition-colors">Back</button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 px-8 py-3.5 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Get Recommendation"}
                        {!isSubmitting && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
