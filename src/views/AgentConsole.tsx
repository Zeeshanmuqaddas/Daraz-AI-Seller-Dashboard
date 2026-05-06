import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Sparkles } from 'lucide-react';
import { askDarazAgent } from '../lib/agent';
import { Product } from '../data/mockData';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface AgentConsoleProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  isJson?: boolean;
  jsonData?: any;
}

export default function AgentConsole({ products, setProducts }: AgentConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I am your Daraz Selling Agent. I can help you update prices, analyze competitors, and optimize listings. What would you like to do today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Create context payload safely
      const safeContext = {
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          competitor_price: p.competitorPrice,
          stock: p.stock,
          description: p.description
        }))
      };

      const responseText = await askDarazAgent(userText, safeContext);
      
      let parsedJson = null;
      let isJson = false;

      try {
        const cleaned = responseText.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
        parsedJson = JSON.parse(cleaned);
        isJson = true;

        // Apply action if valid
        if (parsedJson.action === 'update_price' && parsedJson.product_id) {
          setProducts(prev => prev.map(p => 
            p.id === parsedJson.product_id ? { ...p, price: parsedJson.new_price } : p
          ));
        }

        if (parsedJson.action === 'analyze_seo' && parsedJson.product_id && parsedJson.new_description) {
          setProducts(prev => prev.map(p => 
            p.id === parsedJson.product_id ? { ...p, description: parsedJson.new_description, seoScore: parsedJson.seo_score } : p
          ));
        }

      } catch (e) {
        // Not valid JSON, which is fine, we'll just display it as text.
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: isJson ? "" : responseText,
        isJson,
        jsonData: parsedJson
      }]);

    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: 'Sorry, I encountered an error. Have you configured your GEMINI_API_KEY?'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-slate-50">
        <div className="h-10 w-10 flex-shrink-0 bg-orange-500 rounded-lg flex items-center justify-center">
          <Bot className="text-white" size={20} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">Daraz AI Agent</h2>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 block"></span>
             Powered by Google Gemini
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-4 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
              msg.role === 'user' ? "bg-slate-800" : "bg-orange-500"
            )}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            
            <div className={cn(
              "rounded-2xl px-5 py-3 shadow-sm",
              msg.role === 'user' 
                ? "bg-slate-800 text-white rounded-tr-sm" 
                : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm"
            )}>
              {msg.isJson && msg.jsonData ? (
                <ActionCard data={msg.jsonData} />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
             <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center mt-1">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-2">
              <Sparkles size={16} className="text-orange-500 animate-pulse" />
              <span className="text-sm text-slate-500">Agent is thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me to optimize pricing or check low stock..."
            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors"
          >
            <Send size={18} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionCard({ data }: { data: any }) {
  if (data.action === 'update_price') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-medium pb-2 border-b border-slate-100">
          <Cpu size={16} />
          <span className="text-sm uppercase tracking-wider">Action Executed: Price Update</span>
        </div>
        <div className="text-sm space-y-1">
          <p><span className="text-slate-500">Target Product ID:</span> <span className="font-mono">{data.product_id}</span></p>
          <p className="flex items-center gap-2 mt-2">
            <span className="line-through text-slate-400">Rs {data.old_price}</span>
            <span className="font-bold text-emerald-600">Rs {data.new_price}</span>
          </p>
          {data.reason && (
            <p className="text-slate-600 mt-2 bg-slate-50 p-2 rounded-md text-xs italic border border-slate-100">
              Reason: {data.reason}
            </p>
          )}
        </div>
        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
          ✓ Store database successfully updated.
        </p>
      </div>
    );
  }

  if (data.action === 'analyze_seo') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-600 font-medium pb-2 border-b border-slate-100">
          <Sparkles size={16} />
          <span className="text-sm uppercase tracking-wider">SEO Analysis: {data.product_id}</span>
        </div>
        <div className="text-sm space-y-3">
          <div className="flex items-center justify-between bg-slate-50 p-2 border border-slate-100 rounded-md">
            <span className="text-slate-600 font-medium">SEO Score</span>
            <span className={cn(
              "font-bold px-2 py-0.5 rounded",
              data.seo_score >= 80 ? "bg-emerald-100 text-emerald-700" :
              data.seo_score >= 50 ? "bg-orange-100 text-orange-700" : "bg-rose-100 text-rose-700"
            )}>{data.seo_score}/100</span>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 text-xs mb-1">Suggestions:</h4>
            <p className="text-slate-600 bg-orange-50 p-2 rounded-md text-xs border border-orange-100">
              {data.suggestions}
            </p>
          </div>

          {data.new_description && (
            <div>
              <h4 className="font-semibold text-slate-800 text-xs mb-1">Optimized Description:</h4>
              <p className="text-slate-600 text-xs bg-slate-50 p-2 rounded-md border border-slate-100 italic">
                {data.new_description}
              </p>
            </div>
          )}
        </div>
        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-2">
          ✓ Applied optimized description to product.
        </p>
      </div>
    );
  }

  // Fallback for generic JSON
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-orange-600 font-medium pb-2 border-b border-slate-100">
        <Bot size={16} />
        <span className="text-sm uppercase tracking-wider">Action Output: {data.action}</span>
      </div>
      <pre className="text-xs bg-slate-900 text-slate-50 p-3 rounded-lg overflow-x-auto font-mono">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
