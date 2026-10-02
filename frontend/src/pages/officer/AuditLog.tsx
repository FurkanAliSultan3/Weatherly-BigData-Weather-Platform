import React from 'react';
import { mockAuditLogs, AuditLogEntry } from '../../services/mockData';
import { Clock, User, ShieldAlert, CheckCircle2 } from 'lucide-react';

const AuditLog: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Audit Log</h1>
          <p className="text-slate-400 text-sm">Immutable record of all verification actions and AI classifications.</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-800/50 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-slate-800">Timestamp</th>
                <th className="px-6 py-4 border-b border-slate-800">Actor</th>
                <th className="px-6 py-4 border-b border-slate-800">Action</th>
                <th className="px-6 py-4 border-b border-slate-800">Reference</th>
                <th className="px-6 py-4 border-b border-slate-800">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {mockAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {log.actor === 'Weatherly AI' ? (
                        <div className="p-1 bg-cyan-500/10 text-cyan-400 rounded">
                          <Zap size={12} />
                        </div>
                      ) : (
                        <div className="p-1 bg-slate-700 text-slate-300 rounded">
                          <User size={12} />
                        </div>
                      )}
                      <span className="text-xs text-slate-300">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      log.action === 'Verified Report' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-white">
                    {log.referenceId}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 italic">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import { Zap } from 'lucide-react'; // Fixed import

export default AuditLog;
