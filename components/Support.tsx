
import React, { useState } from 'react';
import { Send, User as UserIcon, Bot, LifeBuoy } from 'lucide-react';
import { getPharmacyAssistance } from '../services/geminiService';
import { SupportTicket, User } from '../types';

interface SupportProps {
  user: User;
  tickets: SupportTicket[];
  onAddTicket: (ticket: Partial<SupportTicket>) => void;
}

const Support: React.FC<SupportProps> = ({ user, tickets, onAddTicket }) => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const resp = await getPharmacyAssistance(query);
    setAiResponse(resp);
    setLoading(false);
  };

  const handleSubmitTicket = () => {
    if (!subject.trim() || !message.trim()) return;
    onAddTicket({
      subject,
      message,
      customerId: user.id,
      customerName: user.name,
      status: 'OPEN'
    });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 slide-up">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Bot className="text-blue-600" /> MediMart Assistant
          </h3>
          <p className="text-sm text-slate-500 mb-4">Ask our AI for help with logistics, order policies, or general medical queries.</p>
          <div className="relative">
            <textarea 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none min-h-[100px] resize-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="How can I track my bulk order?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              onClick={handleAskAI}
              disabled={loading}
              className="absolute right-3 bottom-3 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-300"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
          
          {aiResponse && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl animate-fadeIn">
              <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                <Bot size={12} /> AI Response
              </p>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <LifeBuoy className="text-blue-600" /> Raise Support Ticket
          </h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Subject"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea 
              placeholder="Explain your issue in detail..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none min-h-[120px] resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              onClick={handleSubmitTicket}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
            >
              Submit Issue
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-800">Recent Tickets</h3>
        {tickets.length === 0 ? (
          <div className="p-10 bg-slate-50 rounded-3xl text-center text-slate-400 border border-dashed border-slate-200">
            No active tickets found.
          </div>
        ) : (
          tickets.map(ticket => (
            <div key={ticket.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{ticket.subject}</h4>
                <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {ticket.status}
                </span>
              </div>
              <p className="text-sm text-slate-600 mb-4">{ticket.message}</p>
              {ticket.response && (
                <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-blue-500">
                  <p className="text-xs font-bold text-slate-400 mb-1">Response from Harsh Enterprises:</p>
                  <p className="text-sm italic text-slate-700">{ticket.response}</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] text-slate-400">
                <span>Created on: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span>Ticket ID: {ticket.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Support;
