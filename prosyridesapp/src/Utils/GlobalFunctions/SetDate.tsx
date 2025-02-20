import React, { useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import "./SetDate.css";

const SetDate: React.FC<{
  setValue: React.Dispatch<React.SetStateAction<Date | null>>;
  date: Date | null;
}> = ({ setValue, date }) => {
  const datePickerRef = useRef<DatePicker | null>(null);

  const handleChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      // Convert selected date to UTC to prevent timezone issues
      const utcDate = new Date(Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      ));
      
      setValue(utcDate);
    }
  };

  const handleCalendarIconClick = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <div className="date-picker-container">
      <div className="label-wrapper">
        <label>Select a Date: </label>
        <FaCalendarAlt
          className="calendar-icon"
          onClick={handleCalendarIconClick}
        />
      </div>
      <div className="calendar-container">
        <DatePicker
          ref={datePickerRef}
          selected={date}
          onChange={handleChange}
          dateFormat="yyyy-MM-dd"
          className="date-input"
          minDate={new Date()}
          inline
        />
      </div>
    </div>
  );
};

export default SetDate;
