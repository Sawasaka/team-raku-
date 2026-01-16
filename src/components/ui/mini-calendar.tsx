'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns';
import { ja } from 'date-fns/locale';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

export type EventType = 'practice' | 'game' | 'tournament' | 'event';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: Date;
}

interface MiniCalendarProps {
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date | null) => void;
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
  showLegend?: boolean;
  highlightCondition?: (events: CalendarEvent[]) => boolean;
}

const eventLabels: Record<EventType, string> = {
  practice: '練習',
  game: '試合',
  tournament: '大会',
  event: 'その他',
};

export function MiniCalendar({
  events,
  selectedDate,
  onSelectDate,
  currentMonth: controlledMonth,
  onMonthChange,
  showLegend = true,
  highlightCondition,
}: MiniCalendarProps) {
  const [internalMonth, setInternalMonth] = useState(new Date());
  
  const currentMonth = controlledMonth ?? internalMonth;
  const setCurrentMonth = onMonthChange ?? setInternalMonth;

  // カレンダーの日付を生成
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 特定の日のイベントを取得
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  return (
    <div>
      {/* カレンダーヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">
          {format(currentMonth, 'yyyy年M月', { locale: ja })}
        </span>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day, index) => (
          <div 
            key={day} 
            className={`text-center text-xs font-medium py-1 ${
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const hasEvent = dayEvents.length > 0;
          const isHighlighted = highlightCondition ? highlightCondition(dayEvents) : false;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dayOfWeek = day.getDay();

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(isCurrentMonth ? day : null)}
              className={`
                relative aspect-square p-1 rounded-md transition-all text-center flex flex-col items-center justify-center
                ${!isCurrentMonth ? 'opacity-30 cursor-default' : 'cursor-pointer hover:bg-secondary/50'}
                ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}
                ${isToday(day) && !isSelected && !isHighlighted ? 'ring-1 ring-primary' : ''}
                ${isHighlighted && !isSelected ? 'ring-2 ring-red-500 bg-red-50' : ''}
              `}
            >
              <span className={`
                text-sm font-medium
                ${isHighlighted && !isSelected ? 'text-red-600 font-bold' : ''}
                ${dayOfWeek === 0 && !isSelected && !isHighlighted ? 'text-red-500' : ''}
                ${dayOfWeek === 6 && !isSelected && !isHighlighted ? 'text-blue-500' : ''}
              `}>
                {format(day, 'd')}
              </span>
              
              {/* イベントラベル */}
              {hasEvent && isCurrentMonth && (
                <span className={`
                  text-[10px] font-medium
                  ${isSelected 
                    ? 'text-primary-foreground/90' 
                    : dayEvents[0].type === 'practice' ? 'text-primary'
                    : dayEvents[0].type === 'game' ? 'text-green-600'
                    : dayEvents[0].type === 'tournament' ? 'text-amber-600'
                    : 'text-cyan-600'
                  }
                `}>
                  {eventLabels[dayEvents[0].type]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 凡例 */}
      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-3 pt-3 border-t text-xs text-muted-foreground">
          <span className="text-primary font-medium">練習</span>
          <span className="text-green-600 font-medium">試合</span>
          <span className="text-amber-600 font-medium">大会</span>
          <span className="text-cyan-600 font-medium">イベント</span>
        </div>
      )}
    </div>
  );
}


