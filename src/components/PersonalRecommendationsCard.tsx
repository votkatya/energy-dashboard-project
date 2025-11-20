import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  total_entries: number;
  updated_at?: string;
}

const PersonalRecommendationsCard = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadExistingAnalysis();
    }
  }, [user?.id]);

  const loadExistingAnalysis = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('https://functions.poehali.dev/173fefe5-c3ef-45db-90f8-060626f176ce', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': user.id.toString()
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (err) {
      console.log('No existing analysis');
    }
  };

  const fetchNewAnalysis = async () => {
    if (!user?.id) return;
    
    setIsRefreshing(true);
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
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Не удалось получить анализ');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при получении анализа');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCardClick = async () => {
    if (analysis) {
      setIsDialogOpen(true);
    } else {
      setIsLoading(true);
      setIsDialogOpen(true);
      await fetchNewAnalysis();
      setIsLoading(false);
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetchNewAnalysis();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card 
          className="glass-card border-primary/20 shadow-lg overflow-hidden cursor-pointer hover:border-primary/40 transition-all"
          onClick={handleCardClick}
        >
          <CardContent className="py-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Icon name="Sparkles" size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Персональные рекомендации
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {analysis ? 'Нажмите, чтобы посмотреть' : 'Получите AI-анализ ваших записей'}
                </p>
              </div>
              {analysis && (
                <div className="text-xs text-muted-foreground">
                  Обновлено: {formatDate(analysis.updated_at)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs text-muted-foreground">Тестовая функция</span>
                <span className="text-sm font-medium">
                  {analysis?.updated_at ? formatDate(analysis.updated_at) : ''}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={isRefreshing ? 'animate-spin' : ''} 
                  />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive">{error}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Проверьте, что добавлен API ключ ChatGPT в настройках
                  </p>
                </div>
              </div>
            )}

            {analysis && !isLoading && (
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalRecommendationsCard;