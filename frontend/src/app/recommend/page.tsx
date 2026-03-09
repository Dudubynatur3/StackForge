'use client';

import { useState } from 'react';
import { recommendProjects } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RecommendPage() {
  const { user } = useAuth();
  const [jdText, setJdText] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jdText.trim()) return;

    setLoading(true);
    setError(null);
    setRecommendations([]);

    const skillsArray = currentSkills.split(',').map(s => s.trim()).filter(s => s !== '');

    try {
      const data = await recommendProjects(jdText, skillsArray, user?.id);
      setRecommendations(data.recommendations.recommendations);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-white">Project Recommender</h1>
        <p className="text-gray-400 text-lg">
          Get high-impact project recommendations tailored to your dream job and current skills.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mb-16 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-400">Target Job Description</label>
          <textarea
            className="w-full h-48 p-6 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
            placeholder="Paste the job description here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-400">Your Current Skills (Optional, comma-separated)</label>
          <input
            className="w-full p-4 bg-zinc-900 border border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-200"
            placeholder="e.g. Python, Docker, basic AWS"
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !jdText.trim()}
          className="w-full md:w-auto px-12 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg text-lg font-bold transition-all shadow-lg"
        >
          {loading ? 'Finding Projects...' : 'Get Recommendations'}
        </button>
      </form>

      {error && (
        <div className="p-6 border border-red-900 bg-red-900/10 text-red-500 rounded-xl mb-12">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-2xl font-bold mb-8 text-blue-400">Ranked Recommendations</h2>
          {recommendations.map((project, idx) => (
            <div key={idx} className="p-10 border border-gray-800 rounded-3xl bg-zinc-900/60 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 text-6xl font-black text-white/5 select-none italic">
                0{idx + 1}
              </div>
              <div className="max-w-3xl">
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-500 transition-colors">
                  {project.title}
                </h3>
                <div className="p-6 border-l-4 border-blue-600 bg-blue-900/10 rounded-r-xl mb-8">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">Impact Analysis</h4>
                  <p className="text-gray-300 leading-relaxed italic">
                    "{project.impact}"
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-gray-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Tech Stack</span>
                    <span className="text-blue-300 font-medium">{project.stack}</span>
                  </div>
                  <div className="flex justify-between sm:justify-end gap-12">
                    <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Build Time</span>
                      <span className="text-white font-medium">{project.time}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500 block mb-2">Difficulty</span>
                      <span className="text-white font-medium">{project.difficulty}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
