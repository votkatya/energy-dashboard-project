import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AIAnalysis {
  analysis: string;
  recommendations: string[];
  total_entries: number;
}

const AIAnalysisCard = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const handleCopy = async () => {
    if (!analysis?.analysis) return;
    
    try {
      await navigator.clipboard.writeText(analysis.analysis);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const fetchAnalysis = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://functions.poehali.dev/173fefe5-c3ef-45db-90f8-060626f176ce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        }
      });
      
      if (!response.ok) {
        throw new Error('Не удалось получить анализ');
      }
      
      const data = await response.json();
      setAnalysis(data);
      setIsDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при получении анализа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" size={20} className="text-primary" />
            <span className="font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Анализ
            </span>
          </div>
          <Button 
            onClick={fetchAnalysis} 
            disabled={isLoading}
            size="sm"
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Icon name="Loader2" size={16} className="animate-spin" />
                Анализирую
              </>
            ) : (
              <>
                <Icon name="Wand2" size={16} />
                Анализировать
              </>
            )}
          </Button>
        </div>
        {isLoading && (
          <div className="flex items-center justify-center py-8 mt-4">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 mt-4">
            <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Проверьте, что добавлен API ключ ChatGPT в настройках
              </p>
            </div>
          </div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="w-full gap-2"
            >
              <Icon name="FileText" size={16} />
              Показать анализ
            </Button>
          </motion.div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between pr-8">
              <span className="flex items-center gap-2">
                <Icon name="Sparkles" size={20} className="text-primary" />
                AI Анализ
              </span>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Icon name={copied ? "Check" : "Copy"} size={16} />
                {copied ? 'Скопировано' : 'Копировать'}
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {analysis && (
            <div className="space-y-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h3: ({ children }) => (
                      <h3 className="text-lg font-bold mt-4 mb-2 text-foreground">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed mb-3 text-foreground">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 space-y-1 mb-3">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm text-foreground">{children}</li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                  }}
                >
                  {analysis.analysis}
                </ReactMarkdown>
              </div>
              <p className="text-xs text-muted-foreground pt-3 border-t">
                На основе {analysis.total_entries} записей
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AIAnalysisCard;