import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

interface AIAnalysis {
  analysis: string;
  recommendations: string[];
  total_entries: number;
}

const AIAnalysisCard = () => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchAnalysis = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://functions.poehali.dev/6008afa7-60fc-4a40-86b2-8042fb78ec44', {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при получении анализа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border-primary/20 shadow-lg overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Sparkles" size={24} className="text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AI Анализ
            </span>
          </CardTitle>
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
      </CardHeader>
      <CardContent>
        {!analysis && !error && !isLoading && (
          <div className="text-center py-6 text-muted-foreground">
            <Icon name="Brain" size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Нажмите кнопку, чтобы получить персональные рекомендации на основе ваших записей</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Проверьте, что добавлен API ключ Perplexity в настройках
              </p>
            </div>
          </div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-sm leading-relaxed">{analysis.analysis}</p>
              <p className="text-xs text-muted-foreground mt-2">
                На основе {analysis.total_entries} записей
              </p>
            </div>

            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="Lightbulb" size={16} className="text-amber-500" />
                  Рекомендации
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 text-sm p-3 rounded-lg bg-accent/5 border border-accent/10"
                    >
                      <span className="text-accent font-bold mt-0.5">{index + 1}.</span>
                      <span className="flex-1">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisCard;
