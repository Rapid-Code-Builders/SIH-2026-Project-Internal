import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, MapPin, FileText, Send, Loader2, CheckCircle, ChevronDown,
  Waves, Users, Wrench, Heart, MoreHorizontal
} from 'lucide-react';
import { getBeaches, submitReport } from '../services/api';
import type { Beach } from '../types';

const ISSUE_TYPES = [
  { id: 'rip_current', label: 'Rip Current', icon: <Waves className="w-5 h-5" /> },
  { id: 'overcrowding', label: 'Crowding', icon: <Users className="w-5 h-5" /> },
  { id: 'pollution', label: 'Pollution', icon: <AlertTriangle className="w-5 h-5" /> },
  { id: 'infrastructure', label: 'Infrastructure', icon: <Wrench className="w-5 h-5" /> },
  { id: 'medical', label: 'Medical', icon: <Heart className="w-5 h-5" /> },
  { id: 'other', label: 'Other', icon: <MoreHorizontal className="w-5 h-5" /> },
];

export default function Report() {
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [beachId, setBeachId] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [isLoadingBeaches, setIsLoadingBeaches] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submittedReport, setSubmittedReport] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadBeaches() {
      try {
        const data = await getBeaches();
        setBeaches(data);
      } catch {
        console.warn('Could not load beach list for dropdown.');
      } finally {
        setIsLoadingBeaches(false);
      }
    }
    loadBeaches();
  }, []);

  const handleAutoLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      () => {}
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!beachId || !issueType || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const response = await submitReport({
        beach_id: Number(beachId),
        issue_type: issueType,
        description: description.trim(),
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
      });
      setSubmittedReport(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-10 text-center max-w-md shadow-xl shadow-black/20">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/15 rounded-2xl mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted Successfully</h2>
          <p className="text-slate-400 mb-6">
            Thank you for helping keep beaches safer.
          </p>
          <div className="bg-[#13263A] border border-[#20364A] rounded-xl p-4 mb-8 text-left text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">Report ID:</span>
              <span className="text-white font-medium">#{submittedReport.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded font-bold uppercase text-xs">
                Pending Verification
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSubmittedReport(null);
                setBeachId('');
                setIssueType('');
                setDescription('');
                setLatitude('');
                setLongitude('');
              }}
              className="px-6 py-3 bg-[#13263A] border border-[#20364A] text-white font-medium rounded-xl hover:border-cyan-500/50 transition-colors text-sm"
            >
              Submit Another
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-cyan-500 text-[#07111F] font-semibold rounded-xl hover:bg-cyan-400 transition-colors text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          Report an Issue
        </h1>
        <p className="text-slate-400">
          Spotted something dangerous? Report it here so authorities can respond quickly.
        </p>
      </div>

      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 shadow-xl shadow-black/20">
        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="report-beach" className="block text-sm font-medium text-slate-300 mb-2">
              Affected Beach <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                id="report-beach"
                value={beachId}
                onChange={(e) => setBeachId(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                  transition-colors text-sm appearance-none"
              >
                <option value="" disabled>
                  {isLoadingBeaches ? 'Loading beaches...' : 'Select a beach'}
                </option>
                {beaches.map((beach) => (
                  <option key={beach.id} value={beach.id}>
                    {beach.name} — {beach.location}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Issue Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ISSUE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setIssueType(type.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    issueType === type.id
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-400'
                      : 'bg-[#13263A] border-[#20364A] text-slate-400 hover:border-cyan-500/50 hover:text-slate-300'
                  }`}
                >
                  <div className="mb-2">{type.icon}</div>
                  <span className="text-xs font-medium text-center">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="report-description" className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <textarea
                id="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hazard in detail..."
                required
                rows={5}
                className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                  transition-colors text-sm resize-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Location <span className="text-slate-500">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={handleAutoLocation}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" /> Use Current Location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude"
                className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
              />
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude"
                className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25 transition-colors text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 disabled:from-cyan-500/50 disabled:to-teal-400/50
              text-[#07111F] font-semibold rounded-xl transition-all duration-200
              disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Report
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
