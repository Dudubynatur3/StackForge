'use client';

import { useState } from 'react';
import { generateUpgradeAdvice } from '@/lib/api';

export default function UpgradePage() {
  const [projectDescription, setProjectDescription] = useState('');
  const [currentTechStack, setCurrentTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advice, setAdvice] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDescription.trim()) return;

    setLoading(true);
    setError(null);
    setAdvice(null);

    try {
      const data = await generateUpgradeAdvice(projectDescription, currentTechStack);
      setAdvice(data.upgrade_advice);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-white uppercase tracking-tighter italic">Project Upgrader</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Analyse your existing projects and learn how to upgrade them to production-grade quality that a senior engineer would be proud of.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-16 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Describe Your Current Project</label>
            <textarea
              className="w-full h-48 p-6 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
              placeholder="What have you built so far? What are the key features and goals?"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Current Tech Stack (Optional)</label>
            <input
              className="w-full p-4 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
              placeholder="e.g. AWS S3, CloudFront, Static Website"
              value={currentTechStack}
              onChange={(e) => setCurrentTechStack(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !projectDescription.trim()}
          className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg text-lg font-bold transition-all shadow-lg"
        >
          {loading ? 'Analysing Project...' : 'Get Upgrade Advice'}
        </button>
      </form>

      {error && (
        <div className="p-6 border border-red-900 bg-red-900/10 text-red-500 rounded-xl mb-12">
          {error}
        </div>
      )}

      {advice && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/60 h-fit">
            <h2 className="text-2xl font-bold mb-8 text-blue-400">Missing Production Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advice.analysis?.map((item: string, idx: number) => (
                <div key={idx} className="p-4 border border-gray-800 rounded-xl flex items-center gap-4 text-gray-300">
                  <span className="text-red-500 text-xl">⚠</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="p-10 border border-gray-800 rounded-3xl bg-blue-900/10 border-blue-900/30 h-fit">
            <h2 className="text-2xl font-bold mb-8 text-blue-400 italic font-black uppercase">What a Senior Engineer Would Add</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advice.senior_additions?.map((item: string, idx: number) => (
                <div key={idx} className="p-4 border border-blue-900/20 bg-blue-900/10 rounded-xl flex items-center gap-4 text-blue-100">
                  <span className="text-blue-400 text-xl font-black">★</span>
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/40">
            <h2 className="text-2xl font-bold mb-10 text-blue-400">Step-by-Step Upgrade Plan</h2>
            <div className="space-y-4">
              {advice.upgrade_steps?.map((step: string, idx: number) => (
                <div key={idx} className="p-6 border border-gray-800 rounded-xl bg-black/40 flex items-center gap-6 text-gray-300 group hover:border-blue-500/50 transition-all">
                  <div className="text-2xl font-black text-gray-700 group-hover:text-blue-500 select-none">
                    {idx + 1}
                  </div>
                  {step}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
