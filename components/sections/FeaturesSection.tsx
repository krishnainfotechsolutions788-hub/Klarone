import { Users, ShieldCheck, Target, Clock } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-surface-dark" />,
      title: "Expert Guidance",
      description: "Get recommendations from professionals who understand your specific workflow and needs."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-surface-dark" />,
      title: "Unbiased Advice",
      description: "We don't push specific brands. Our only goal is finding the perfect technology match for you."
    },
    {
      icon: <Target className="w-6 h-6 text-surface-dark" />,
      title: "Personalized to You",
      description: "Receive hardware suggestions tailored exactly to your unique budget, goals, and use cases."
    },
    {
      icon: <Clock className="w-6 h-6 text-surface-dark" />,
      title: "Save Time & Money",
      description: "Stop endlessly scrolling through confusing specs. We do the heavy research for you."
    }
  ];

  return (
    <section id="features" className="w-full py-[80px] lg:py-[120px] bg-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-[36px] md:text-[48px] font-medium leading-[1.1] tracking-tight text-surface-dark mb-6">
            Why People Choose Klarone
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#666666]">
            Explore the benefits designed to make your technology decisions easier, faster, and much more confident.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col bg-surface-soft p-8 rounded-2xl border border-transparent hover:border-[#e2e8f0] transition-colors"
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-[20px] font-medium text-surface-dark mb-3">
                {feature.title}
              </h3>
              <p className="text-[14px] text-[#666666] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
