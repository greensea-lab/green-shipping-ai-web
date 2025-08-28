// src/components/DateSelector.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  onDateSelect: (date: Date) => void;
}

const DateSelector: React.FC<Props> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  return (
    <div style={{ margin: '20px', textAlign: 'center' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold' }}>
        날짜 선택:
      </label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
        className="rounded-md border px-2 py-1"
      />
    </div>
  );
};

export default DateSelector;
