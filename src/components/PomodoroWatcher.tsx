import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { usePomodoro } from '../contexts/PomodoroContext';

export default function PomodoroWatcher() {
  const { timeLeft, timerMode, isRunning, hasShownRestReminder, setReminderShown } = usePomodoro();
  const [modal, setModal] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const playBeep = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    // At 5 min left (25 min elapsed) during study mode — rest reminder
    if (timerMode === 'study' && timeLeft === 5 * 60 && !hasShownRestReminder) {
      setReminderShown(true);
      playBeep();
      setModal({
        show: true,
        message: '⏸️ Hora de descansar!\n\nVocê estudou 25 minutos com foco total! Aproveite os próximos 5 minutos para descansar e recuperar as energias.',
      });
      sendNotification('Hora do Descanso!', 'Você estudou 25 minutos. Faltam 5 minutos de descanso neste ciclo.');
    }

    // When the timer hits zero
    if (timeLeft === 0) {
      playBeep();
      const msg = timerMode === 'study'
        ? '✅ Ciclo de 30 minutos concluído!\n\nExcelente dedicação! Você completou um ciclo completo do Método Pomodoro.'
        : '📚 Descanso finalizado! Hora de voltar aos estudos com energia.';
      setModal({ show: true, message: msg });
      sendNotification('Ciclo Finalizado', timerMode === 'study' ? 'Ciclo Pomodoro de 30 min concluído!' : 'Descanso finalizado! Hora de estudar.');
    }
  }, [timeLeft, isRunning, timerMode, hasShownRestReminder, setReminderShown]);

  if (!modal.show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#18181b] border border-nexus-blue/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(14,165,233,0.3)]">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Clock className="w-6 h-6 text-nexus-blue" />
          Pomodoro
        </h3>
        <p className="text-gray-300 mb-6 whitespace-pre-line">{modal.message}</p>
        <button
          onClick={() => setModal({ show: false, message: '' })}
          className="w-full py-3 bg-nexus-blue hover:bg-sky-400 text-black font-bold rounded-xl transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
