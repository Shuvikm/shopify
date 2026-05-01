import {useEffect, useState} from 'react';

export function UrgencyTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hrs: 2,
    min: 14,
    sec: 55
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let {hrs, min, sec} = prev;
        
        if (sec > 0) {
          sec--;
        } else if (min > 0) {
          min--;
          sec = 59;
        } else if (hrs > 0) {
          hrs--;
          min = 59;
          sec = 59;
        } else {
          // Reset or stop
          clearInterval(timer);
          return prev;
        }
        
        return {hrs, min, sec};
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const format = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between animate-fadeIn">
      <div className="flex items-center gap-3">
        <span className="text-2xl animate-bounce">⚡</span>
        <div>
          <p className="text-xs font-black text-red-800 uppercase tracking-widest leading-none mb-1">Flash Sale Ending Soon!</p>
          <p className="text-[10px] text-red-600 font-bold">Use code <span className="underline">HYDRO20</span> for extra 20% off</p>
        </div>
      </div>
      <div className="flex gap-1.5">
        {[
          {val: format(timeLeft.hrs), label: 'Hrs'},
          {val: format(timeLeft.min), label: 'Min'},
          {val: format(timeLeft.sec), label: 'Sec'}
        ].map((item, i) => (
          <div key={i} className="bg-white border border-red-200 rounded-md px-1.5 py-1 min-w-[36px] text-center shadow-sm">
            <span className="text-xs font-black text-red-700 block leading-none tabular-nums">{item.val}</span>
            <span className="text-[7px] text-red-400 font-bold uppercase tracking-tighter">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
