import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Entry {
  id: number;
  date: string;
  score: number;
  thoughts?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EntriesFeedProps {
  entries: Entry[];
}

const EntriesFeed = ({ entries }: EntriesFeedProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const getColorClass = (score: number) => {
    if (score >= 5) return 'bg-energy-excellent text-energy-excellent-foreground';
    if (score >= 4) return 'bg-energy-good text-energy-good-foreground';
    if (score >= 3) return 'bg-energy-neutral text-energy-neutral-foreground';
    if (score >= 2) return 'bg-energy-medium-low text-energy-medium-low-foreground';
    return 'bg-energy-low text-energy-low-foreground';
  };

  const getEmojiForScore = (score: number) => {
    if (score >= 5) return '🚀';
    if (score >= 4) return '😊';
    if (score >= 3) return '😐';
    if (score >= 2) return '😕';
    return '😞';
  };

  const parseEntryDate = (dateStr: string): Date => {
    if (dateStr.includes('-')) {
      return parseISO(dateStr);
    }
    const [day, month, year] = dateStr.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const filterByDate = (entry: Entry) => {
    if (dateFilter === 'all') return true;
    
    const entryDate = parseEntryDate(entry.date);
    const now = new Date();
    const diffTime = now.getTime() - entryDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (dateFilter) {
      case 'today':
        return diffDays < 1;
      case 'week':
        return diffDays < 7;
      case 'month':
        return diffDays < 30;
      default:
        return true;
    }
  };

  const filteredAndSortedEntries = useMemo(() => {
    let result = [...entries];

    result = result.filter(entry => {
      const matchesSearch = !searchQuery || 
        (entry.thoughts?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDate = filterByDate(entry);
      return matchesSearch && matchesDate;
    });

    result.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return parseEntryDate(b.date).getTime() - parseEntryDate(a.date).getTime();
        case 'oldest':
          return parseEntryDate(a.date).getTime() - parseEntryDate(b.date).getTime();
        case 'highest':
          return b.score - a.score;
        case 'lowest':
          return a.score - b.score;
        default:
          return 0;
      }
    });

    return result;
  }, [entries, searchQuery, sortOrder, dateFilter]);

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = parseEntryDate(dateStr);
      return format(date, 'd MMMM yyyy, EEEE', { locale: ru });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon name="Filter" size={20} />
            Фильтры и поиск
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по мыслям..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Период</label>
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все время</SelectItem>
                  <SelectItem value="today">Сегодня</SelectItem>
                  <SelectItem value="week">Неделя</SelectItem>
                  <SelectItem value="month">Месяц</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Сортировка</label>
              <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="oldest">Сначала старые</SelectItem>
                  <SelectItem value="highest">По убыванию оценки</SelectItem>
                  <SelectItem value="lowest">По возрастанию оценки</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground mb-2">
        Найдено записей: {filteredAndSortedEntries.length}
      </div>

      <div className="space-y-3">
        {filteredAndSortedEntries.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="py-8 text-center text-muted-foreground">
              <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
              <p>Записей не найдено</p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedEntries.map((entry) => (
            <Card key={entry.id} className="glass-card hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 rounded-2xl ${getColorClass(entry.score)} flex items-center justify-center flex-shrink-0 shadow-lg text-2xl`}>
                    {getEmojiForScore(entry.score)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {entry.score}
                      </h3>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon name="Calendar" size={14} />
                        {formatDisplayDate(entry.date)}
                      </div>
                    </div>
                    {entry.thoughts && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {entry.thoughts}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default EntriesFeed;