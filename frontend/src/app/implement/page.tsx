'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateImplementationPlan } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function ImplementForm() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);

  // Auto-fill if coming from Analyse page
  useEffect(() => {
    const title = searchParams.get('title');
    const stack = searchParams.get('stack');
    const desc = searchParams.get('desc');

    if (title) setProjectTitle(title);
    if (stack) setTechStack(stack);
    if (desc) setProjectDescription(desc);
  }, [searchParams]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectTitle.trim()) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const data = await generateImplementationPlan(projectTitle, projectDescription, techStack, user?.id);
      setPlan(data.implementation_plan);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-white">Implementation Plan Generator</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Turn your project idea into a production-grade implementation roadmap with commands and architecture decisions.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-16 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Project Title</label>
              <input
                className="w-full p-4 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
                placeholder="e.g. Self-Service GKE Provisioner"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Target Tech Stack (Optional)</label>
              <input
                className="w-full p-4 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
                placeholder="e.g. Terraform, GCP, Python"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Project Description (Optional)</label>
            <textarea
              className="w-full h-[152px] p-4 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
              placeholder="Describe the goals and key features..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !projectTitle.trim()}
          className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg text-lg font-bold transition-all shadow-lg"
        >
          {loading ? 'Generating Plan...' : 'Generate Implementation Plan'}
        </button>
      </form>

      {error && (
        <div className="p-6 border border-red-900 bg-red-900/10 text-red-500 rounded-xl mb-12">
          {error}
        </div>
      )}

      {plan && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 p-10 border border-gray-800 rounded-3xl bg-zinc-900/60 h-fit">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Architecture Decisions</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {plan.architecture}
              </p>
            </section>
            <section className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/40 h-fit">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">File Structure</h2>
              <pre className="text-sm font-mono text-gray-300 bg-black p-6 rounded-2xl border border-gray-800 overflow-x-auto">
                {plan.file_structure}
              </pre>
            </section>
          </div>

          <section className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/40">
            <h2 className="text-2xl font-bold mb-10 text-blue-400 text-center">Implementation Roadmap</h2>
            <div className="space-y-8 max-w-4xl mx-auto">
              {plan.steps?.map((step: any, idx: number) => (
                <div key={idx} className="relative pl-12 pb-12 last:pb-0 border-l border-gray-800">
                  <div className="absolute left-[-20px] top-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">
                    {idx + 1}
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 block mb-2">{step.phase}</span>
                    <h3 className="text-xl font-bold text-white mb-3">{step.action}</h3>
                  </div>
                  {step.command && (
                    <div className="bg-black p-5 rounded-xl border border-gray-800 group relative">
                      <code className="text-blue-300 font-mono text-sm break-all">
                        {step.command}
                      </code>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="p-10 border border-gray-800 rounded-3xl bg-blue-900/10 border-blue-900/30">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">Verification Steps</h2>
            <ul className="space-y-4">
              {plan.verification_steps?.map((v: string, idx: number) => (
                <li key={idx} className="flex items-center gap-4 text-gray-300">
                  <span className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-600/30">
                    ✓
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

export default function ImplementPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <ImplementForm />
    </Suspense>
  );
}
