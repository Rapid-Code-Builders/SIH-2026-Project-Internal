// =============================================================================
// TideSense — Issue Report Page (Report.tsx)
// =============================================================================
//
// WHAT THIS PAGE DOES:
// Allows authenticated users to report hazards at a specific beach.
// The form collects: Beach selection, Issue Type, Description, and optional
// GPS coordinates (latitude/longitude).
//
// REACT CONCEPTS FOR BACKEND DEVS:
// - Controlled form: Every input is bound to React state via value + onChange.
// - Select dropdown: Same pattern as text inputs — controlled via useState.
// - Form reset: After successful submission, we clear all fields by calling
//   setState('') on each field.
// - Data loading: We fetch the beach list on mount so users can pick from a
//   dropdown instead of typing a beach ID manually.
//
// ROUTE: /report (Protected — requires login)
// API: POST /api/reports → { id, beach_id, issue_type, description, status }
// =============================================================================

import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  MapPin,
  FileText,
  Send,
  Loader2,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';

import { getBeaches, submitReport } from '../services/api';
import type { Beach } from '../types';

// Predefined issue types — these map to what the backend expects
const ISSUE_TYPES = [
  { id: 'rip_current', label: 'Rip Current Spotted' },
  { id: 'pollution', label: 'Water Pollution / Debris' },
  { id: 'jellyfish', label: 'Jellyfish / Marine Hazard' },
  { id: 'missing_person', label: 'Missing Person' },
  { id: 'equipment_damage', label: 'Damaged Safety Equipment' },
  { id: 'overcrowding', label: 'Dangerous Overcrowding' },
  { id: 'other', label: 'Other Hazard' },
];

export default function Report() {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------
  const [beaches, setBeaches] = useState<Beach[]>([]);
  const [beachId, setBeachId] = useState('');
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // UI state
  const [isLoadingBeaches, setIsLoadingBeaches] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // LOAD BEACHES FOR DROPDOWN
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadBeaches() {
      try {
        const data = await getBeaches();
        setBeaches(data);
      } catch {
        // Non-critical — we can still let the user type a beach ID manually
        console.warn('Could not load beach list for dropdown.');
      } finally {
        setIsLoadingBeaches(false);
      }
    }
    loadBeaches();
  }, []);

  // ---------------------------------------------------------------------------
  // AUTO-FILL GPS (optional, browser Geolocation API)
  // ---------------------------------------------------------------------------
  const handleAutoLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
      },
      () => {
        // User denied or geolocation unavailable — silently ignore
      }
    );
  };

  // ---------------------------------------------------------------------------
  // FORM SUBMISSION
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!beachId || !issueType || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await submitReport({
        beach_id: Number(beachId),
        issue_type: issueType,
        description: description.trim(),
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
      });

      // Show success state
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit report.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // RENDER: Success State
  // ---------------------------------------------------------------------------
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] animate-fade-in">
        <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-10 text-center max-w-md shadow-xl shadow-black/20">
          <div className="inline-flex items-center justify-center p-4 bg-emerald-500/15 rounded-2xl mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Thank you for helping keep our beaches safe. A local authority will
            review your report and take action if needed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setSuccess(false);
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
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: Main Form
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-amber-400" />
          Report a Hazard
        </h1>
        <p className="text-slate-400">
          Spotted something dangerous? Report it here so authorities can respond
          quickly. Your submission helps keep everyone safe.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[#0D1B2A] border border-[#20364A] rounded-2xl p-8 shadow-xl shadow-black/20">
        {/* Error */}
        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ---- Beach Selection ---- */}
          <div>
            <label
              htmlFor="report-beach"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
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

          {/* ---- Issue Type ---- */}
          <div>
            <label
              htmlFor="report-type"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Issue Type <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                id="report-type"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                  transition-colors text-sm appearance-none"
              >
                <option value="" disabled>Select an issue type</option>
                {ISSUE_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* ---- Description ---- */}
          <div>
            <label
              htmlFor="report-description"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Description <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
              <textarea
                id="report-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hazard in detail. Include time, exact location on the beach, and any other relevant info..."
                required
                rows={5}
                className="w-full pl-10 pr-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                  transition-colors text-sm resize-none"
              />
            </div>
          </div>

          {/* ---- GPS Coordinates (Optional) ---- */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                GPS Coordinates <span className="text-slate-500">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={handleAutoLocation}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                📍 Auto-detect my location
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude (e.g., 15.5553)"
                className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                  transition-colors text-sm"
              />
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude (e.g., 73.7517)"
                className="w-full px-4 py-3 bg-[#13263A] border border-[#20364A] rounded-xl text-white placeholder-slate-500
                  focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/25
                  transition-colors text-sm"
              />
            </div>
          </div>

          {/* ---- Submit ---- */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50
              text-[#07111F] font-semibold rounded-xl transition-all duration-200
              disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting Report...
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
