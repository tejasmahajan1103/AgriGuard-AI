import { useNavigate } from 'react-router-dom';
import {
  Shield,
  ScanLine,
  Bot,
  CloudSun,
  BarChart3,
  Bell,
  ArrowRight,
  Sprout,
  Zap,
  CheckCircle2,
  Warehouse,
  Activity,
  Sparkles,
  PlayCircle,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { APP_NAME, APP_TAGLINE } from '../../utils/constants';

const features = [
  {
    icon: <ScanLine className="w-6 h-6" />,
    title: 'AI Crop Scanning',
    description: 'Upload a photo and get instant AI-powered disease detection with confidence scores.',
    color: 'from-emerald-500 to-green-500',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'AI Agriculture Assistant',
    description: 'Chat with our intelligent assistant for personalized farming advice and recommendations.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <CloudSun className="w-6 h-6" />,
    title: 'Weather Intelligence',
    description: 'Get weather forecasts and crop-specific weather alerts for your farm locations.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Health Analytics',
    description: 'Track crop health over time with detailed charts and actionable insights.',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: 'Smart Alerts',
    description: 'Receive timely alerts about diseases, pests, weather events, and irrigation schedules.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: <Sprout className="w-6 h-6" />,
    title: 'Crop Management',
    description: 'Manage all your farms and crops in one place with growth tracking and recommendations.',
    color: 'from-teal-500 to-emerald-500',
  },
];

const stats = [
  { value: '50K+', label: 'Crops Monitored' },
  { value: '95%', label: 'Detection Accuracy' },
  { value: '10K+', label: 'Active Farmers' },
  { value: '24/7', label: 'AI Assistance' },
];

const steps = [
  {
    step: '01',
    icon: <Warehouse className="w-6 h-6 text-emerald-600" />,
    title: 'Add Your Farm',
    description: 'Farmers add their farm and crop information.',
  },
  {
    step: '02',
    icon: <ScanLine className="w-6 h-6 text-emerald-600" />,
    title: 'Scan Your Crop',
    description: 'Upload a crop image for AI-assisted analysis.',
  },
  {
    step: '03',
    icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
    title: 'Get AI Insights',
    description: 'Receive AI-powered crop health information and recommendations.',
  },
  {
    step: '04',
    icon: <Activity className="w-6 h-6 text-emerald-600" />,
    title: 'Monitor & Act',
    description: 'Track crop health, weather conditions and alerts from one dashboard.',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-emerald-50 border border-emerald-200 rounded-full text-xs sm:text-sm text-emerald-700 font-medium mb-6 sm:mb-8 shadow-xs">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Powered by AWS AI Services</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-5 sm:mb-6 leading-[1.15] tracking-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
              AI-Powered Intelligence
            </span>
            <br />
            for Healthier Crops
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            {APP_TAGLINE} Detect crop diseases early, get smart recommendations,
            and maximize your yield with cutting-edge artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto shadow-emerald-600/25 hover:shadow-emerald-600/40"
              onClick={() => navigate('/signup')}
              icon={<ArrowRight className="w-5 h-5" />}
            >
              Explore AgriGuard AI
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-slate-300 text-slate-700 hover:text-emerald-700 hover:border-emerald-400 bg-white"
              onClick={scrollToHowItWorks}
              icon={<PlayCircle className="w-5 h-5 text-emerald-600" />}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-slate-50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Protect Your Crops
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed for modern farmers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs sm:text-sm text-emerald-700 font-medium mb-3">
              <Sprout className="w-4 h-4 text-emerald-600" />
              Simple 4-Step Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Get started in minutes with our simple, intelligent agricultural workflow.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
              >
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-xl shadow-emerald-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
              Ready to Protect Your Crops?
            </h2>
            <p className="text-base sm:text-lg text-emerald-100 max-w-xl mx-auto mb-8 leading-relaxed">
              Join thousands of farmers using AI to detect diseases early, optimize yields, and grow smarter.
            </p>
            <Button
              size="lg"
              variant="white"
              className="font-bold text-emerald-800 hover:text-emerald-900 shadow-md"
              onClick={() => navigate('/signup')}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">{APP_NAME}</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} {APP_NAME}. Built for AWS Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
