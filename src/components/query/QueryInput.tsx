
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { DataService, QueryResult } from '@/services/dataService';
import { InformaticaService, ProcessedResult } from '@/services/informaticaService';
import { toast } from 'sonner';

interface QueryInputProps {
  onQueryComplete?: (result: QueryResult) => void;
  onInformaticaResult?: (result: ProcessedResult) => void;
  className?: string;
}

const QueryInput: React.FC<QueryInputProps> = ({ onQueryComplete, onInformaticaResult, className }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    try {
      setIsProcessing(true);
      toast.info("Processing your query...", { id: "query-processing" });
      
      // Process through the simulated Python backend (Informatica service)
      const processedResult = await InformaticaService.processQueryFlow(query);
      
      if (processedResult.error) {
        console.error("Query processing error:", processedResult.error);
        toast.error("Error processing query", { id: "query-processing" });
        
        // Fall back to the mock DataService if processing fails
        toast.info("Falling back to internal processing...");
        const fallbackResult = await DataService.processQuery(query);
        
        if (onQueryComplete) {
          onQueryComplete(fallbackResult);
        }
      } else {
        toast.success("Query processed successfully!", { id: "query-processing" });
        
        // If we have an Informatica result handler, use it
        if (onInformaticaResult) {
          onInformaticaResult(processedResult);
        }
        
        // Also convert to QueryResult format for backward compatibility
        if (onQueryComplete) {
          const formattedResult: QueryResult = {
            answer: processedResult.naturalLanguage,
            sources: [{ name: "AI Analysis", confidence: 95 }],
            insights: [],
            metrics: {},
            recommendations: ["Consider optimizing your query."],
          };
          
          onQueryComplete(formattedResult);
        }
        
        // Clear the input after successful processing
        setQuery('');
      }
    } catch (error) {
      console.error('Error processing query:', error);
      toast.error('Error processing query');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full space-x-3 ${className}`}>
      <div className="relative flex-1">
        <Input
          placeholder="Ask me anything about your business data..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-12 pl-5 py-6 glass-input text-base rounded-full text-white h-14 transition-all duration-300 shadow-md focus-visible:shadow-lg"
          disabled={isProcessing}
        />
        <Sparkles className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary/70" />
      </div>
      
      <Button 
        type="submit" 
        className="rounded-full w-14 h-14 p-0 flex items-center justify-center glass-button shadow-md hover:shadow-lg"
        disabled={isProcessing || !query.trim()}
      >
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};

export default QueryInput;
