import React, { Fragment, useContext } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react';
import { Calendar, ChevronDown, Check } from 'lucide-react';
import AppStore from '../context/expense_tracker_store';

const DateSwitcher = () => 
{
    const { selectedDate, setSelectedDate, months, years } = useContext(AppStore);
  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-2xl shadow-sm">
      
      {/* MONTH PICKER */}
      <Listbox 
        value={selectedDate.month} 
        onChange={(val) => setSelectedDate({ ...selectedDate, month: val })}
      >
        <div className="relative">
          <ListboxButton className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all group">
            <Calendar size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-700">{months[selectedDate.month]}</span>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-transform ui-open:rotate-180" />
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptions className="absolute z-50 mt-2 max-h-60 w-48 overflow-auto rounded-2xl bg-white p-1.5 text-base shadow-2xl ring-1 ring-slate-200 focus:outline-none sm:text-sm">
              {months.map((month, idx) => (
                <ListboxOption
                  key={month}
                  value={idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none rounded-xl py-2 pl-3 pr-9 transition-colors ${
                      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-bold text-indigo-600' : 'font-medium'}`}>
                        {month}
                      </span>
                      {selected && (
                        <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-600">
                          <Check size={16} strokeWidth={3} />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>

      {/* DIVIDER */}
      <div className="h-6 w-px bg-slate-200 mx-1" />

      {/* YEAR PICKER */}
      <Listbox 
        value={selectedDate.year} 
        onChange={(val) => setSelectedDate({ ...selectedDate, year: val })}
      >
        <div className="relative">
          <ListboxButton className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all group">
            <span className="text-sm font-bold text-slate-600">{selectedDate.year}</span>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 transition-transform ui-open:rotate-180" />
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ListboxOptions className="absolute right-0 z-50 mt-2 w-32 overflow-hidden rounded-2xl bg-white p-1.5 text-base shadow-2xl ring-1 ring-slate-200 focus:outline-none sm:text-sm">
              {years.map((year) => (
                <ListboxOption
                  key={year}
                  value={year}
                  className={({ active }) =>
                    `relative cursor-pointer select-none rounded-xl py-2 px-3 transition-colors ${
                      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                    }`
                  }
                >
                  {({ selected }) => (
                    <span className={`block truncate text-center ${selected ? 'font-bold text-indigo-600' : 'font-medium'}`}>
                      {year}
                    </span>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default DateSwitcher;