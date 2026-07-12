import { CheckCircle2 } from "lucide-react";

export default function RecommendationExamplesSection() {
  const examples = [
    {
      role: "Student",
      budget: "Budget ₹50,000",
      laptop: "Lenovo IdeaPad",
      reasons: ["Excellent battery life", "Great for coding and assignments", "High value for money", "Lightweight and portable"]
    },
    {
      role: "Developer",
      budget: "Budget ₹70,000",
      laptop: "ThinkPad E14",
      reasons: ["Top-tier performance", "Legendary reliability", "Upgradeability options", "Exceptional keyboard"]
    },
    {
      role: "Designer",
      budget: "Budget ₹90,000",
      laptop: "MacBook Air",
      reasons: ["Color-accurate display", "Seamless creative workflow", "All-day battery life", "Premium ultra-thin design"]
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold font-sora text-gray-900 mb-4 leading-tight">
            Recommendations that make sense.
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            See how Klarone analyzes your unique needs to recommend the perfect technology fit, ensuring you never overpay for features you won't use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examples.map((example, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100/50 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="inline-block px-4 py-1.5 bg-[#F0FBFC] text-[#00A7B5] font-semibold text-sm rounded-full mb-3">
                {example.role}
              </div>
              <div className="text-sm text-gray-500 font-medium mb-6">
                {example.budget}
              </div>
              
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Recommended Device</p>
                <h3 className="text-2xl font-bold font-sora text-gray-900">{example.laptop}</h3>
              </div>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Why we recommend it</p>
                {example.reasons.map((reason, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#00A7B5] shrink-0 mt-0.5" />
                    <p className="text-gray-600 text-[15px]">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
