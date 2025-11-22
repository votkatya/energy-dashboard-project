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
import { analyzeBurnoutRisk, BurnoutRisk } from '@/utils/predictiveAnalytics';

interface AIAnalysis {
  analysis: string;
  total_entries: number;
  updated_at?: string;
}

interface PersonalRecommendationsCardProps {
  entriesCount?: number;
  entries?: any[];
}

const PersonalRecommendationsCard = ({ entriesCount = 0, entries = [] }: PersonalRecommendationsCardProps) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { user } = useAuth();
  
  const hasEnoughData = entriesCount >= 3;

  useEffect(() => {
    const initAnalysis = async () => {
      if (user?.id) {
        await loadExistingAnalysis();
      }
    };

    initAnalysis();
  }, [user?.id]);

  useEffect(() => {
    if (user?.id && entries.length >= 3) {
      const burnoutRisk = analyzeBurnoutRisk(entries);
      if (burnoutRisk.level === 'medium' || burnoutRisk.level === 'high' || burnoutRisk.level === 'critical') {
        const existingRiskDate = localStorage.getItem(`burnout_risk_detected_${user.id}`);
        if (!existingRiskDate) {
          localStorage.setItem(`burnout_risk_detected_${user.id}`, new Date().toISOString());
        }
      } else {
        localStorage.removeItem(`burnout_risk_detected_${user.id}`);
      }
    }
  }, [entries, user?.id]);



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
        if (data.updated_at) {
          localStorage.setItem(`analysis_updated_${user.id}`, data.updated_at);
        }
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
      const currentTime = new Date().toISOString();
      const updatedData = {
        ...data,
        updated_at: data.updated_at || currentTime
      };
      
      setAnalysis(updatedData);
      if (user?.id) {
        localStorage.setItem(`analysis_updated_${user.id}`, updatedData.updated_at);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при получении анализа');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCardClick = async () => {
    setIsDialogOpen(true);
    if (!analysis) {
      await fetchNewAnalysis();
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDialogOpen(true);
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

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Обновлено сегодня';
    if (diffInDays === 1) return 'Обновлено вчера';
    if (diffInDays < 7) return `Обновлено ${diffInDays} ${diffInDays === 2 || diffInDays === 3 || diffInDays === 4 ? 'дня' : 'дней'} назад`;
    return `Обновлено ${formatDate(dateString)}`;
  };

  const needsUpdate = (dateString?: string) => {
    if (!dateString) return true;
    
    const updateDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays >= 7) return true;
    
    if (entries.length >= 3 && user?.id) {
      const burnoutRisk = analyzeBurnoutRisk(entries);
      if (burnoutRisk.level === 'medium' || burnoutRisk.level === 'high' || burnoutRisk.level === 'critical') {
        const riskDetectedStr = localStorage.getItem(`burnout_risk_detected_${user.id}`);
        if (riskDetectedStr) {
          const riskDetectedDate = new Date(riskDetectedStr);
          if (riskDetectedDate > updateDate) {
            return true;
          }
        }
      }
    }
    
    return false;
  };

  const getPreviewText = (analysisText?: string) => {
    if (!analysisText) return '';
    const firstLine = analysisText.split('\n').find(line => line.trim().length > 20);
    if (!firstLine) return '';
    const cleanText = firstLine.replace(/[#*]/g, '').trim();
    return cleanText.length > 80 ? cleanText.substring(0, 80) + '...' : cleanText;
  };

  if (!hasEnoughData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
          <CardContent className="py-6 px-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                <Icon name="Sparkles" size={24} className="text-muted-foreground/50" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base text-muted-foreground">
                    Персональные рекомендации
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                    <Icon name="Lock" size={12} />
                    <span>Недоступно</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Добавьте минимум 3 записи, чтобы получить персональные рекомендации от AI
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Info" size={14} />
                  <span>Записей добавлено: {entriesCount} из 3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card 
          className="glass-card border-primary/20 shadow-lg overflow-hidden transition-all cursor-pointer hover:border-primary/40"
          onClick={handleCardClick}
        >
          <CardContent className="py-6 px-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                <Icon name="Sparkles" size={24} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Персональные рекомендации
                  </h3>
                  {analysis && (
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                      needsUpdate(analysis.updated_at) 
                        ? 'bg-orange-500/10 text-orange-500' 
                        : 'bg-green-500/10 text-green-500'
                    }`}>
                      <Icon 
                        name={needsUpdate(analysis.updated_at) ? 'AlertCircle' : 'CheckCircle2'} 
                        size={12} 
                      />
                      <span>{needsUpdate(analysis.updated_at) ? 'Требуется обновление' : 'Актуально'}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {analysis && getPreviewText(analysis.analysis) 
                    ? getPreviewText(analysis.analysis)
                    : 'Нажмите для получения AI-анализа с персональными советами'}
                </p>
                <div className="flex items-center gap-3">
                  {analysis && (
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(analysis.updated_at)}
                    </span>
                  )}
                  {analysis && needsUpdate(analysis.updated_at) && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs -ml-2"
                      >
                        <Icon 
                          name="RefreshCw" 
                          size={12} 
                          className={isRefreshing ? 'animate-spin' : ''} 
                        />
                        <span className="ml-1">Обновить</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between pr-8">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-xs text-muted-foreground">
                  {analysis?.updated_at ? getRelativeTime(analysis.updated_at) : ''}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                {isRefreshing && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-orange-500">
                      <Icon name="AlertCircle" size={14} />
                      <span className="text-xs font-medium">Не закрывайте страницу</span>
                    </div>
                    <div className="w-32 h-1 bg-secondary rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
                      />
                    </div>
                  </div>
                )}
                {!isRefreshing && (
                  <Button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Icon 
                      name="RefreshCw" 
                      size={14} 
                    />
                    <span className="ml-1.5 text-xs">Обновить</span>
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PersonalRecommendationsCard;