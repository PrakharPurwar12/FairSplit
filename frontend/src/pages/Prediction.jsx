import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Cpu, 
  AlertTriangle, 
  CheckCircle, 
  HelpCircle, 
  UserCheck, 
  ShieldCheck
} from 'lucide-react';
import ProjectService from '../services/project.service';
import PredictionService from '../services/prediction.service';
import AllocationService from '../services/allocation.service';
import Modal from '../components/ui/Modal';
import Toast from '../components/ui/Toast';

const Prediction = () => {
  const context = useOutletContext();
  const initialProjectId = context?.selectedProjectId || '';

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [riskData, setRiskData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAllocating, setIsAllocating] = useState(false);

  // Reassignment Recommendation State
  // Backend returns a single recommendation object, not an array
  const [reassignmentTask, setReassignmentTask] = useState(null);
  const [recommendation, setRecommendation] = useState(null); // single object: { recommended_member: {username,...}, final_score, reason }
  const [isFetchRecommendationLoading, setIsFetchRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  // Fetch initial project list
  useEffect(() => {
    const fetchProjectsList = async () => {
      try {
        const data = await ProjectService.getProjects();
        setProjects(data);
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id.toString());
        }
      } catch (err) {
        console.error('Failed to load projects list:', err);
      }
    };
    fetchProjectsList();
  }, [selectedProjectId]);

  // Sync with DashboardLayout context project changes
  useEffect(() => {
    if (context?.selectedProjectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedProjectId(context.selectedProjectId);
    }
  }, [context?.selectedProjectId]);

  // Fetch risk analytics
  const fetchRiskAnalytics = useCallback(async () => {
    if (!selectedProjectId) return;
    await Promise.resolve(); // Defer state updates to satisfy eslint rule
    setIsLoading(true);
    setError(null);
    try {
      const data = await PredictionService.getProjectRisk(selectedProjectId);
      setRiskData(data);
    } catch (err) {
      setError('Prediction engine unavailable.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRiskAnalytics();
  }, [fetchRiskAnalytics]);

  // Request reassignment from backend
  const handleRecommendReassignment = async (task) => {
    setReassignmentTask(task);
    setIsFetchRecommendationLoading(true);
    setRecommendationError(null);
    setRecommendation(null);
    setIsRecommendationModalOpen(true);

    try {
      // Backend response shape:
      // If task.predicted_risk != 'High': { message: '...', current_risk: '...' }
      // If task.predicted_risk == 'High': { task, current_assignee, predicted_risk, recommendation: { recommended_member: {username,...}, final_score, reason: [...] } }
      const res = await PredictionService.recommendReassignment(task.task_id);
      if (res.message) {
        // Non-high risk or no eligible replacement
        setRecommendationError(res.message);
      } else if (res.recommendation) {
        const rec = res.recommendation;
        if (rec.error) {
          setRecommendationError(rec.error);
        } else {
          setRecommendation(rec);
        }
      } else {
        setRecommendationError('No recommendation data returned.');
      }
    } catch (err) {
      setRecommendationError(err.response?.data?.error || 'Failed to fetch reassignment recommendation.');
      console.error(err);
    } finally {
      setIsFetchRecommendationLoading(false);
    }
  };

  // Run AI Allocation Handler
  const handleRunAllocation = async () => {
    if (!selectedProjectId) return;
    setIsAllocating(true);
    try {
      const res = await AllocationService.generateAllocation(selectedProjectId);
      if (res && res.error) {
        setToast({ message: res.error, type: 'error' });
      } else {
        const count = Array.isArray(res) ? res.length : 0;
        setToast({ message: `AI Allocation generated! ${count} task(s) allocated successfully.`, type: 'success' });
        fetchRiskAnalytics();
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error || err.response?.data?.detail || 'Failed to run AI Allocation.', type: 'error' });
      console.error(err);
    } finally {
      setIsAllocating(false);
    }
  };

  const getRiskColor = (pct) => {
    if (pct > 30) return 'text-red-600 dark:text-red-400 border-red-200 bg-red-50 dark:bg-red-950/20';
    if (pct > 10) return 'text-yellow-600 dark:text-yellow-400 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20';
    return 'text-green-600 dark:text-green-400 border-green-200 bg-green-50 dark:bg-green-950/20';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/5 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-8 h-8 text-blue-500" />
            AI Allocation & Prediction Hub
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate AI task allocation, forecast project risk, and inspect smart reassignment mitigations.
          </p>
        </div>

        {/* Action Button & Project Selector */}
        <div className="flex items-center gap-3 shrink-0">
          {selectedProjectId && (
            <button
              onClick={handleRunAllocation}
              disabled={isAllocating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
            >
              <Cpu className={`w-4 h-4 ${isAllocating ? 'animate-spin' : ''}`} />
              {isAllocating ? 'Allocating...' : 'Run AI Allocation'}
            </button>
          )}
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
          >
            <option value="">Select Project...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id.toString()}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
          <div className="lg:col-span-1 space-y-6">
            <div className="h-48 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5 max-w-xl mx-auto">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{error}</h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            The prediction pipeline failed to return scores. Please verify the AI server is online.
          </p>
          <button 
            onClick={fetchRiskAnalytics}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm shadow-blue-600/10"
          >
            Retry AI Connect
          </button>
        </div>
      ) : !riskData ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 dark:bg-[#111] rounded-2xl border border-gray-200/50 dark:border-white/5">
          <HelpCircle className="w-12 h-12 text-gray-400 mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">No Project Selected</h2>
          <p className="text-sm text-gray-500 max-w-sm mb-6">
            Choose a project from the top-right select dropdown to run delivery forecasts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left panel: Risk Summary & Forecast details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Project Health Overview</h3>
              
              <div className="space-y-6">
                {/* Health percentage */}
                <div className="flex flex-col items-center justify-center p-6 border border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-white/[0.01]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">AI Risk Rating</span>
                  <span className={`px-4 py-1.5 rounded-full text-base font-bold border capitalize ${getRiskColor(riskData.high_risk_percentage)}`}>
                    {riskData.high_risk_percentage > 30 ? 'High Risk Slippage' : riskData.high_risk_percentage > 10 ? 'Moderate Strain' : 'Healthy timelines'}
                  </span>
                  
                  <div className="mt-5 w-full flex items-center justify-between text-xs text-gray-500">
                    <span>Critical Slippage Rate:</span>
                    <strong className="text-gray-800 dark:text-gray-200">{riskData.high_risk_percentage}%</strong>
                  </div>
                  <div className="mt-2 w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${riskData.high_risk_percentage > 30 ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${riskData.high_risk_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Score breakdown metrics list */}
                <div className="space-y-3 text-xs text-gray-500">
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span>Prediction Confidence:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{(riskData.average_confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span>Total Tasks Evaluated:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{riskData.summary.total_tasks}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span>Low Risk Tasks:</span>
                    <span className="font-bold text-green-500">{riskData.summary.Low}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-gray-100 dark:border-white/5">
                    <span>Medium Risk Tasks:</span>
                    <span className="font-bold text-yellow-500">{riskData.summary.Medium}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span>High Risk Tasks:</span>
                    <span className="font-bold text-red-500">{riskData.summary.High}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Action/Suggested mitigation Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/10 dark:to-indigo-950/10 border border-blue-100/50 dark:border-blue-900/20 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                AI Suggested Action
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {riskData.summary.High > 0 
                  ? "Workload balance mismatch detected. We suggest reassigning critical high-risk tasks to members with lower workload metrics." 
                  : "All timeline metrics are stable. Keep track of estimated task hours and avoid adding consecutive tasks to single developers."}
              </p>
              
              {riskData.summary.High > 0 && (
                <div className="p-3 bg-white/80 dark:bg-white/[0.02] border border-blue-200/30 rounded-xl space-y-1.5">
                  <span className="block text-[10px] font-bold text-blue-500 uppercase">Redistribution Plan</span>
                  <p className="text-[10px] text-gray-500">
                    Use the "Recommend Reassignment" option on the critical tasks grid to see optimal candidates.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right panel: High Risk Tasks grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#161616] border border-gray-200/70 dark:border-white/5 p-6 rounded-2xl shadow-sm">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Critical Project Tasks ({riskData.high_risk_tasks.length})
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Tasks listed below have been flagged by the AI engine as having a high delay risk.
              </p>

              {riskData.high_risk_tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-gray-200 dark:border-white/5 rounded-xl">
                  <CheckCircle className="w-10 h-10 text-green-500 mb-3" />
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Zero Critical Tasks</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Timeline holds low delivery risks.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {riskData.high_risk_tasks.map((task) => (
                    <div 
                      key={task.task_id}
                      className="p-4 rounded-xl border border-red-100 bg-red-50/10 dark:border-red-950/20 dark:bg-red-950/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-red-50/20 dark:hover:bg-red-950/10"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider bg-red-100/50 dark:bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200/30">
                          {task.risk} Risk ({(task.confidence * 100).toFixed(0)}%)
                        </span>
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                          {task.task_title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[10px] text-gray-400">
                          <span>Assignee: <strong className="text-gray-700 dark:text-gray-300">@{task.assigned_to || 'Unassigned'}</strong></span>
                          <span>•</span>
                          <span>Due: {formatDate(task.deadline)}</span>
                          <span>•</span>
                          <span>Progress: {task.completion_percentage}%</span>
                        </div>
                      </div>

                      {/* Recommend Reassignment Action Trigger */}
                      <button
                        onClick={() => handleRecommendReassignment(task)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 shadow-sm"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        Reassign...
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* REASSIGNMENT RECOMMENDATIONS MODAL */}
      <Modal 
        isOpen={isRecommendationModalOpen} 
        onClose={() => { setIsRecommendationModalOpen(false); setReassignmentTask(null); }}
        title="AI Reassignment Recommendation"
      >
        {reassignmentTask && (
          <div className="space-y-5">
            <div>
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest block mb-0.5">High Risk Flagged</span>
              <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                {reassignmentTask.task_title}
              </h3>
              <p className="text-xs text-gray-500 mt-1.5">
                Current Assignee: <strong className="text-gray-700 dark:text-gray-300">@{reassignmentTask.assigned_to || 'Unassigned'}</strong>
              </p>
            </div>

            {isFetchRecommendationLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-400">Running reallocation heuristics...</span>
              </div>
            ) : recommendationError ? (
              <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-xl border border-yellow-200 dark:border-yellow-900/50 leading-snug flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-0.5">Recommendation Mismatch</h4>
                  <p>{recommendationError}</p>
                </div>
              </div>
            ) : recommendation ? (
              <div className="space-y-4">
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">AI Recommended Candidate</span>
                
                {/* Single recommendation card - backend returns one best candidate */}
                <div className="p-4 rounded-xl border border-green-200/60 dark:border-green-900/30 bg-green-50/30 dark:bg-green-950/5">
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                        @{recommendation.recommended_member?.username || 'N/A'}
                      </span>
                      <span className="block text-[10px] text-gray-400 mt-0.5">Best Fit Score: <strong className="text-gray-700 dark:text-gray-300">{recommendation.final_score}</strong></span>
                    </div>
                    <span className="block text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider bg-green-500/10 px-2 py-0.5 rounded-full shrink-0">
                      Top Candidate
                    </span>
                  </div>

                  {/* Reason list */}
                  {Array.isArray(recommendation.reason) && recommendation.reason.length > 0 && (
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Why this candidate:</span>
                      {recommendation.reason.map((r, i) => (
                        <div key={i} className="flex items-start gap-2 text-[10px] text-gray-500">
                          <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-3 bg-blue-50/30 border border-blue-100 dark:bg-blue-950/10 dark:border-blue-950/30 rounded-xl text-[10px] text-gray-500 leading-relaxed">
                  This recommendation is based on skill match scores, current workload distribution, and fairness penalty calculations.
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-gray-400">
                No recommendation data available.
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => { setIsRecommendationModalOpen(false); setReassignmentTask(null); }}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Prediction;
