'use client';

import { useState } from 'react';
import Link from 'next/link';
import { analyseJD } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function AnalysePage() {
  const { user } = useAuth();
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const currentUserId = user?.id || undefined;
      const data = await analyseJD(jdText, currentUserId);
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Job Description Analyser</h1>
        <p className="text-gray-400 text-lg">
          Paste a Cloud or DevOps job description to extract required skills, tools, and recommended projects.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-16">
        <textarea
          className="w-full h-64 p-6 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mb-6 text-gray-200"
          placeholder="Paste the job description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !jdText.trim()}
          className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg text-lg font-bold transition-all shadow-lg"
        >
          {loading ? 'Analysing...' : 'Analyse Job Description'}
        </button>
      </form>

      {error && (
        <div className="p-6 border border-red-900 bg-red-900/10 text-red-500 rounded-xl mb-12">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="p-8 border border-gray-800 rounded-2xl bg-zinc-900/40">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Required Skills</h2>
              <ul className="space-y-3">
                {Array.isArray(result.required_skills) ? result.required_skills.map((skill: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {skill}
                  </li>
                )) : <li className="text-gray-500 italic">No specific skills identified</li>}
              </ul>
            </section>

            <section className="p-8 border border-gray-800 rounded-2xl bg-zinc-900/40">
              <h2 className="text-2xl font-bold mb-6 text-blue-400">Preferred Skills</h2>
              <ul className="space-y-3">
                {Array.isArray(result.preferred_skills) ? result.preferred_skills.map((skill: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    {skill}
                  </li>
                )) : <li className="text-gray-500 italic">No preferred skills identified</li>}
              </ul>
            </section>
          </div>

          <section className="p-8 border border-gray-800 rounded-2xl bg-zinc-900/40">
            <h2 className="text-2xl font-bold mb-6 text-blue-400">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(result.tools_technologies) ? result.tools_technologies.map((tool: string, idx: number) => (
                <span key={idx} className="px-4 py-2 bg-zinc-800 border border-gray-700 rounded-full text-sm font-medium text-gray-300">
                  {tool}
                </span>
              )) : <span className="text-gray-500 italic">No tools identified</span>}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-8 text-blue-400">Recommended Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Array.isArray(result.recommended_projects) ? result.recommended_projects.map((project: any, idx: number) => (
                <div key={idx} className="p-8 border border-gray-800 rounded-2xl bg-zinc-900 hover:border-blue-500/50 transition-all">
                  <h3 className="text-xl font-bold mb-3">{project.title || project.name || 'Untitled Project'}</h3>
                  <p className="text-sm text-gray-400 italic mb-4">&quot;{project.why || project.impact || project.reason || project.description}&quot;</p>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="text-gray-500 block mb-1">Stack:</span>
                      <span className="text-blue-300">{project.stack || project.tech_stack || project.technologies}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-gray-500 pt-4 border-t border-gray-800">
                      <span>{project.time || project.duration || project.estimated_time}</span>
                      <span>{project.difficulty || project.level}</span>
                    </div>
                    <Link 
                      href={`/implement?title=${encodeURIComponent(project.title || '')}&stack=${encodeURIComponent(project.stack || '')}&desc=${encodeURIComponent(project.why || '')}`}
                      className="block w-full mt-6 py-3 px-4 bg-blue-600/10 hover:bg-blue-600 border border-blue-600/30 text-blue-400 hover:text-white text-center rounded-xl text-sm font-bold transition-all"
                    >
                      Get Implementation Plan
                    </Link>
                  </div>
                </div>
              )) : <div className="text-gray-500 italic">No projects recommended</div>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
