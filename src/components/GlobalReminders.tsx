import { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUser } from '../contexts/UserContext';

type ScheduleRow = { id: number; time: string; Segunda: string; Terça: string; Quarta: string; Quinta: string; Sexta: string };

export default function GlobalReminders() {
  const { firebaseUser } = useUser();
  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);
  const [reminderModal, setReminderModal] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const lastAlerted = useRef<string>('');

  // Fetch schedule rows once the user is logged in
  useEffect(() => {
    if (!firebaseUser) return;
    
    const loadSchedule = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid, 'organizer', 'data'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.scheduleRows && d.scheduleRows.length > 0) {
            setScheduleRows(d.scheduleRows);
          }
        }
      } catch (err) {
        console.error('Error loading schedule for global reminders:', err);
      }
    };
    
    loadSchedule();
    // We could add a listener or poll if the user edits the schedule often, 
    // but a simple interval refetch every minute is enough to keep it somewhat fresh without many reads.
    const syncInterval = setInterval(loadSchedule, 60000);
    return () => clearInterval(syncInterval);
  }, [firebaseUser]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const showSystemNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo.png' });
    }
  };

  // Schedule Checker Loop
  useEffect(() => {
    if (scheduleRows.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMinute}`;
      
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const todayName = dayNames[now.getDay()];

      if (todayName === 'Domingo' || todayName === 'Sábado') return;
      if (lastAlerted.current === currentTimeStr) return;

      const activeClasses = scheduleRows.filter(row => row.time === currentTimeStr);
      
      activeClasses.forEach(row => {
        // @ts-ignore
        const subject = row[todayName];
        if (subject && typeof subject === 'string' && subject.trim() !== '') {
          const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
          audio.play().catch(e => console.log('Audio play failed:', e));
          
          setReminderModal({
            show: true,
            message: `📚 Lembrete de Aula!\n\nAgora são ${currentTimeStr}. É hora de estudar: ${subject}`
          });
          showSystemNotification('Lembrete de Aula', `Agora são ${currentTimeStr}. É hora de estudar: ${subject}`);
          
          lastAlerted.current = currentTimeStr;
        }
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [scheduleRows]);

  if (!reminderModal.show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-nexus-card border border-nexus-blue/30 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_40px_rgba(14,165,233,0.3)] animate-in zoom-in-95 duration-300">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Clock className="w-6 h-6 text-nexus-blue" />
          Lembrete
        </h3>
        <p className="text-gray-300 mb-6 whitespace-pre-line">{reminderModal.message}</p>
        <button 
          onClick={() => setReminderModal({ show: false, message: '' })}
          className="w-full py-3 bg-nexus-blue hover:bg-sky-400 text-black font-bold rounded-xl transition-colors"
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
