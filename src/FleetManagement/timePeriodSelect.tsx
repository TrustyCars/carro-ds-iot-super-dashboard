import React from "react";
import Select from 'react-select'

export type DropdownOptionProps = {
  label: string;
  value: string;
};

export const timePeriodOptions: DropdownOptionProps[] = [
  { label: 'Past 2 Hours', value: '2h', },
  { label: 'Past 24 Hours', value: '1d' },
  { label: 'Past 2 Days', value: '2d' },
  { label: 'Past week', value: '1w' },
  { label: 'All', value: 'all' },
];
export const defaultTimePeriod = timePeriodOptions[3];

const TimePeriodSelect: React.FC<{
  value: DropdownOptionProps;
  onChange: (newValue: DropdownOptionProps) => void;
}> = ({
  value,
  onChange,
}) => {
  return (
    <Select
      value={value}
      styles={{
        option: (provided) => ({
          ...provided,
          textAlign: 'left',
          wordBreak: 'break-all',
        }),
        valueContainer: (provided) => ({
          ...provided,
          textAlign: 'left',
        }),
      }}
      options={timePeriodOptions}
      isSearchable={false}
      onChange={value => {
        if (value) onChange(value);
      }}
    />
  );
};

export default TimePeriodSelect;
