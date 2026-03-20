import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/layout/StatCard";
import { ThroughputFunnel, BandDistribution } from "@/components/admin/AnalyticsCharts";
import { calculateAverage, calculateAIAccuracy } from "@/lib/utils/analytics";
import { Users, GraduationCap, Clock, ShieldCheck, TrendingUp, Sparkles } from "lucide-react";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect('/login');

  // 1. Parallel Data Fetching
  const [
    { count: totalLearners },
    { data: submissionStats },
    { data: scoreRecords },
    { data: aiLogRecords }
  ] = await Promise.all([
    supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'learner'),
    supabase.from('submissions').select('status'),
    supabase.from('scores').select('submission_id, score'),
    supabase.from('ai_feedback_logs').select('submission_id, response')
  ]);

  // 2. Throughput Calculation
  const throughputData = [
    { label: 'Submitted', value: submissionStats?.filter(s => s.status === 'submitted').length || 0, color: 'var(--ocean)' },
    { label: 'Under Review', value: submissionStats?.filter(s => s.status === 'under_review').length || 0, color: '#f59e0b' },
    { label: 'Graded', value: submissionStats?.filter(s => s.status === 'graded').length || 0, color: 'var(--jade)' }
  ];

  // 3. Performance & AI Metrics
  const averageBand = calculateAverage(scoreRecords?.map(s => s.score) || []);
  const aiStats = calculateAIAccuracy(scoreRecords || [], aiLogRecords || []);

  const bands = [4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5];
  const bandDistData = bands.map(band => ({
    label: band.toFixed(1),
    value: scoreRecords?.filter(s => s.score === band).length || 0
  }));
  // Special handling for 7.5+
  const topBandCount = scoreRecords?.filter(s => s.score > 7.5).length || 0;
  if (topBandCount > 0) {
    bandDistData[bandDistData.length - 1].label = '7.5+';
    bandDistData[bandDistData.length - 1].value += topBandCount;
  }

  return (
    <div className="space-y-10 p-2">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-display text-[32px] text-[var(--midnight)] tracking-tighter">Command Center</h1>
          <p className="font-sans text-[var(--mist)] mt-1">Real-time academic performance oversight</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-2xl border border-[var(--border)] flex items-center gap-3 shadow-sm">
          <ShieldCheck className="text-[var(--jade)]" size={18} />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--midnight)] italic">Live Center Sync</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} iconBg="var(--ocean)" value={totalLearners || 0} label="Total Learners" />
        <StatCard icon={GraduationCap} iconBg="var(--jade)" value={averageBand} label="Avg Centre Band" />
        <StatCard icon={Clock} iconBg="#f59e0b" value={throughputData[1].value} label="Marking Queue" />
        <StatCard 
          icon={Sparkles} 
          iconBg="var(--midnight)" 
          value={`${aiStats.accuracyPercent}%`} 
          label="AI Reliability Index" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Throughput Section */}
        <section className="bg-white rounded-[2.5rem] border border-[var(--border)] p-10 shadow-[var(--card-shadow)] space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-display text-xl text-[var(--midnight)]">Submission Flow</h3>
              <p className="font-sans text-xs text-[var(--mist)] uppercase tracking-widest italic font-bold">Throughput Funnel</p>
            </div>
            <TrendingUp size={20} className="text-[var(--jade)]" />
          </div>
          <ThroughputFunnel data={throughputData} />
        </section>

        {/* Band Distribution Section */}
        <section className="bg-white rounded-[2.5rem] border border-[var(--border)] p-10 shadow-[var(--card-shadow)] space-y-8">
          <div className="space-y-1">
            <h3 className="font-display text-xl text-[var(--midnight)]">Academic Performance</h3>
            <p className="font-sans text-xs text-[var(--mist)] uppercase tracking-widest italic font-bold">IELTS Band Distribution</p>
          </div>
          <BandDistribution data={bandDistData} />
        </section>
      </div>

      {/* AI Performance Insight Layer */}
      <section className="bg-[var(--midnight)] rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl font-black italic tracking-tighter leading-tight">AI Reliability & <br />Standard Matching</h2>
            <p className="text-[#94A3B8] text-sm leading-relaxed max-w-md">
              Our AI evaluation system (Claude 3.5 Sonnet) is currently matched against human senior examiners with a Mean Absolute Error of <strong className="text-white">{aiStats.mae} bands</strong>.
            </p>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                <p className="text-[10px] text-[#94A3B8] uppercase font-black tracking-widest mb-1">Mean Absolute Error</p>
                <p className="text-xl font-display font-black italic text-[var(--jade)]">{aiStats.mae}</p>
              </div>
            </div>
          </div>
          <div className="h-[200px] w-full bg-white/5 rounded-[2rem] border border-white/10 p-8 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-20 h-20 bg-[var(--jade)]/20 text-[var(--jade)] rounded-full flex items-center justify-center scale-125">
               <Sparkles size={32} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#94A3B8]">Reliability Grade</p>
              <h3 className="text-2xl font-display font-black italic uppercase">Precision Grade A</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
