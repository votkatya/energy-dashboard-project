import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Icon from '@/components/ui/icon';

const screenshots = [
  {
    url: 'https://cdn.poehali.dev/files/Frame 2.png',
    alt: 'Главный экран FlowKat'
  },
  {
    url: 'https://cdn.poehali.dev/files/Frame 3.png',
    alt: 'Календарь энергии'
  },
  {
    url: 'https://cdn.poehali.dev/files/Frame 4.png',
    alt: 'Отметка состояния'
  },
  {
    url: 'https://cdn.poehali.dev/files/Frame 5.png',
    alt: 'График энергии'
  },
  {
    url: 'https://cdn.poehali.dev/files/Frame 6.png',
    alt: 'Сравнение с прошлым периодом'
  },
  {
    url: 'https://cdn.poehali.dev/files/Frame 2.png',
    alt: 'Персональные рекомендации'
  },
  {
    url: 'https://cdn.poehali.dev/files/Frame 3.png',
    alt: 'Анализ данных'
  }
];

export default function AppScreenCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    skipSnaps: false,
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="flex-[0_0_auto] w-[280px] md:w-[320px]"
            >
              <div className="relative rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  className="w-full h-auto"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20 transition-all hover:scale-110"
        aria-label="Предыдущий слайд"
      >
        <Icon name="ChevronLeft" size={24} className="text-white" />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20 transition-all hover:scale-110"
        aria-label="Следующий слайд"
      >
        <Icon name="ChevronRight" size={24} className="text-white" />
      </button>

      <div className="flex justify-center gap-2 mt-8">
        {screenshots.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === selectedIndex
                ? 'w-8 bg-[#c8ff00]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
