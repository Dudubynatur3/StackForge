'use client';

import { useState, useEffect, useCallback, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { generateImplementationPlan } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function ImplementForm() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<any>(null);
  
  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Ref to prevent double-triggering in React StrictMode
  const hasTriggered = useRef(false);

  const autoGenerate = useCallback(async (t: string, d: string, s: string) => {
    if (hasTriggered.current) return;
    hasTriggered.current = true;

    setLoading(true);
    setError(null);
    try {
      // Use a small delay to ensure auth state is settled if possible
      const data = await generateImplementationPlan(t, d, s, user?.id);
      
      if (data && data.implementation_plan) {
        setPlan(data.implementation_plan);
      } else {
        throw new Error("AI returned an empty plan. Please try again.");
      }
    } catch (err: any) {
      console.error("AutoGenerate Error:", err);
      setError(err.message || 'An unexpected error occurred.');
      hasTriggered.current = false; // Allow retry on error
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Auto-fill and AUTO-TRIGGER if coming from Analyse page
  useEffect(() => {
    // Wait for auth and mounting to finish
    if (!isMounted || authLoading) return;

    const title = searchParams.get('title');
    const stack = searchParams.get('stack');
    const desc = searchParams.get('desc');

    if (title && !hasTriggered.current) {
      setProjectTitle(title);
      const s = stack || '';
      const d = desc || '';
      setTechStack(s);
      setProjectDescription(d);
      
      if (!user) {
        setError("You must be signed in to generate an implementation plan. Please sign in and try again.");
        return;
      }

      const timer = setTimeout(() => {
        autoGenerate(title, d, s);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams, autoGenerate, authLoading, user, isMounted]);

  if (!isMounted) return <div className="p-20 text-center text-white">Initializing...</div>;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectTitle.trim()) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const data = await generateImplementationPlan(projectTitle, projectDescription, techStack, user?.id);
      if (data && data.implementation_plan) {
        setPlan(data.implementation_plan);
      } else {
        throw new Error("Could not generate plan. Please refine your description.");
      }
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
          {loading ? 'Architecting Elite Plan (this can take 30s)...' : 'Generate Implementation Plan'}
        </button>
      </form>

      {error && (
        <div className="p-8 border-2 border-red-900/50 bg-red-900/10 text-red-400 rounded-3xl mb-12 text-center">
          <h2 className="text-xl font-bold mb-2">Architecting Failed</h2>
          <p className="opacity-80">{error}</p>
          <div className="mt-6 flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-900/20 border border-red-900/30 rounded-xl hover:bg-red-900/40 transition-all text-sm font-bold"
            >
              Refresh Page
            </button>
            <Link 
              href="/dashboard"
              className="px-6 py-2 bg-zinc-900 border border-gray-800 rounded-xl hover:bg-zinc-800 transition-all text-sm font-bold"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      )}

      {plan && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 p-10 border border-gray-800 rounded-3xl bg-zinc-900/60 h-fit">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Architecture Overview</h2>
              <div className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {typeof (plan.architecture_overview || plan.architecture) === 'object' 
                  ? JSON.stringify(plan.architecture_overview || plan.architecture, null, 2)
                  : (plan.architecture_overview || plan.architecture || 'No architecture details provided.')}
              </div>
            </section>
            <section className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/40 h-fit">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Project Structure</h2>
              <pre className="text-sm font-mono text-gray-300 bg-black p-6 rounded-2xl border border-gray-800 overflow-x-auto">
                {typeof (plan.detailed_file_structure || plan.file_structure) === 'object'
                  ? JSON.stringify(plan.detailed_file_structure || plan.file_structure, null, 2)
                  : (plan.detailed_file_structure || plan.file_structure || 'Project root\n└── No files listed')}
              </pre>
            </section>
          </div>

          <section className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/40">
            <h2 className="text-2xl font-bold mb-10 text-blue-400 text-center">Elite Implementation Roadmap</h2>
            <div className="space-y-8 max-w-4xl mx-auto">
              {(Array.isArray(plan.step_by_step_plan) || Array.isArray(plan.steps)) ? (plan.step_by_step_plan || plan.steps).map((step: any, idx: number) => (
                <div key={idx} className="relative pl-12 pb-12 last:pb-0 border-l border-gray-800">
                  <div className="absolute left-[-20px] top-0 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/40">
                    {idx + 1}
                  </div>
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-blue-500 block mb-2">{step.phase || step.objective || 'Implementation Phase'}</span>
                    <h3 className="text-xl font-bold text-white mb-3">{step.action || step.description || step.objective || 'No action description provided'}</h3>
                  </div>
                  {step.command && (
                    <div className="bg-black p-5 rounded-xl border border-gray-800 group relative">
                      <code className="text-blue-300 font-mono text-sm break-all">
                        {step.command}
                      </code>
                    </div>
                  )}
                  {step.logic_explanation && (
                    <p className="mt-4 text-gray-400 text-sm italic">
                      💡 {step.logic_explanation}
                    </p>
                  )}
                </div>
              )) : <div className="text-center py-10 text-gray-500 italic">No specific steps were generated for this plan.</div>}
            </div>
          </section>

          <section className="p-10 border border-gray-800 rounded-3xl bg-blue-900/10 border-blue-900/30">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">Verification Checklist</h2>
            <ul className="space-y-4">
              {(Array.isArray(plan.verification_checklist) || Array.isArray(plan.verification_steps)) ? (plan.verification_checklist || plan.verification_steps).map((v: string, idx: number) => (
                <li key={idx} className="flex items-start gap-4 text-gray-300">
                  <span className="mt-1 w-6 h-6 rounded-full bg-blue-600/20 flex-shrink-0 flex items-center justify-center text-blue-400 text-xs font-bold border border-blue-600/30">
                    ✓
                  </span>
                  <span>{v}</span>
                </li>
              )) : <li className="text-gray-500 italic">No specific verification steps identified.</li>}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

export default function ImplementPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-white">Loading Implementation Builder...</div>}>
      <ImplementForm />
    </Suspense>
  );
}
