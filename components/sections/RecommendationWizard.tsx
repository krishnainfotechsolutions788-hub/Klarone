"use client";

import { useState } from "react";
import { Laptop, Briefcase, GraduationCap, Gamepad2, ArrowRight, CheckCircle2 } from "lucide-react";

import { submitRecommendationRequest } from "@/app/actions/recommendation";

export default function RecommendationWizard() {
  const [step, setStep] = useState(1);
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
  const [errorMsg, setErrorMsg] = useState("");

  const handleNext = () => {
    if (step === 1 && !formData.useCase) return; // Require use case selection
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await submitRecommendationRequest(formData);

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMsg(res.error || "An error occurred");
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-12 text-center border border-gray-100">
        <div className="w-20 h-20 bg-[#F5F7F8] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-[#00A7B5]" />
        </div>
        <h3 className="text-[28px] font-bold text-gray-900 mb-4 font-sora">Request Received!</h3>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed max-w-md mx-auto">
          Our technology experts will analyze your requirements and send you a personalized, objective laptop recommendation shortly.
        </p>
        <button
          onClick={() => {
            setStep(1);
            setIsSubmitted(false);
            setFormData({ name: "", email: "", phone: "", budget: "", useCase: "", specialRequirements: "" });
          }}
          className="px-8 py-3 bg-[#111111] text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[#111111] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A7B5] opacity-20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <h2 className="text-[28px] font-bold font-sora relative z-10 mb-2">Find My Laptop</h2>
        <p className="text-gray-300 relative z-10 text-[15px]">
          {step === 1 ? "What do you primarily need a laptop for?" : "Tell us a bit more about yourself"}
        </p>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-800 rounded-full mt-6 relative z-10">
          <div className="h-full bg-[#00A7B5] rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }}></div>
        </div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'Student', icon: GraduationCap, desc: 'Assignments, research, media' },
                { id: 'Professional', icon: Briefcase, desc: 'Office work, emails, meetings' },
                { id: 'Developer', icon: Laptop, desc: 'Coding, VMs, compiling' },
                { id: 'Gaming', icon: Gamepad2, desc: 'High performance, graphics' }
              ].map(uc => (
                <button
                  key={uc.id}
                  onClick={() => setFormData({ ...formData, useCase: uc.id })}
                  className={`p-5 rounded-xl border-2 text-left transition-all ${formData.useCase === uc.id
                      ? 'border-[#00A7B5] bg-[#F0FBFC]'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <uc.icon className={`w-7 h-7 mb-3 ${formData.useCase === uc.id ? 'text-[#00A7B5]' : 'text-gray-400'}`} />
                  <h4 className="font-semibold text-gray-900 mb-1">{uc.id}</h4>
                  <p className="text-sm text-gray-500">{uc.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={handleNext}
                disabled={!formData.useCase}
                className="flex items-center gap-2 px-8 py-3 bg-[#111111] text-white rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] transition-all bg-[#F9FAFB]" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] transition-all bg-[#F9FAFB]" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] transition-all bg-[#F9FAFB]" placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Budget (₹)</label>
                <input required type="text" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] transition-all bg-[#F9FAFB]" placeholder="e.g. 50,000 - 70,000" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Special Requirements</label>
              <textarea value={formData.specialRequirements} onChange={e => setFormData({ ...formData, specialRequirements: e.target.value })} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A7B5]/20 focus:border-[#00A7B5] transition-all bg-[#F9FAFB] resize-none" placeholder="Any specific software you use? Need a numeric keypad?"></textarea>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-[#00A7B5] text-white rounded-full font-medium hover:bg-[#0096a3] transition-all disabled:opacity-70 shadow-lg shadow-[#00A7B5]/20"
              >
                {isSubmitting ? "Submitting..." : "Get Recommendation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
