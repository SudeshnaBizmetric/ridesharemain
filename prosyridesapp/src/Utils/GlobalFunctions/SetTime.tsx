import { useState, useEffect } from "react";
import "./SetTime.css";

enum TimePeriod {
  am = "AM",
  pm = "PM",
}

interface SetTimeProps {
  setValue: React.Dispatch<
    React.SetStateAction<{
      hours: number | null;
      minutes: number | null;
      period: TimePeriod | null;
    }>
  >;
  time: {
    hours: number | null;
    minutes: number | null;
    period: TimePeriod | null;
  };
}

const SetTime: React.FC<SetTimeProps> = ({ setValue, time }) => {
  const [hour, setHours] = useState<number | null>(time.hours);
  const [minute, setMinutes] = useState<number | null>(time.minutes);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod | null>(time.period);

  useEffect(() => {
    // Sync state with prop whenever it changes
    setHours(time.hours);
    setMinutes(time.minutes);
    setSelectedPeriod(time.period);
  }, [time]);

  const updateParentState = (field: string, value: any) => {
    setValue((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setHours(value);
    updateParentState("hours", value);
  };

  const handleMinuteChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setMinutes(value);
    updateParentState("minutes", value);
  };

  const handlePeriodSelect = (period: TimePeriod) => {
    setSelectedPeriod(period);
    updateParentState("period", period);
  };

  const minutes: number[] = Array.from({ length: 60 }, (_, i) => i); // Generate 0-59
  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // Generate 1-12

  return (
    <div className="container">
      <select value={hour ?? ""} onChange={handleHourChange}>
        <option value="">Hour</option>
        {hours.map((h) => (
          <option key={h} value={h}>
            {h < 10 ? `0${h}` : h}
          </option>
        ))}
      </select>

      {/* Minutes Dropdown */}
      <select value={minute ?? ""} onChange={handleMinuteChange}>
        <option value="">Minute</option>
        {minutes.map((m) => (
          <option key={m} value={m}>
            {m < 10 ? `0${m}` : m}
          </option>
        ))}
      </select>

      {/* AM/PM Buttons */}
      <div>
        {Object.values(TimePeriod).map((value) => (
          <button
            key={value}
            onClick={() => handlePeriodSelect(value)}
            className={`time ${selectedPeriod === value ? "selected" : ""}`}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SetTime;
