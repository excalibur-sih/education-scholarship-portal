import React from 'react';
import { Check } from 'lucide-react';

export const FormStepIndicator = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="w-full py-4 px-2">
      {/* Mobile step status indicator */}
      <div className="md:hidden flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs mb-3">
        <div>
          <span className="text-[11px] uppercase font-bold text-gov-primary tracking-wider">
            Step {currentStep + 1} of {steps.length}
          </span>
          <p className="text-sm font-bold text-slate-800">{steps[currentStep]?.title}</p>
        </div>
        <div className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
          {Math.round(((currentStep + 1) / steps.length) * 100)}% Done
        </div>
      </div>

      {/* Desktop/Tablet Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-gov-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id || index}
              className="relative z-10 flex flex-col items-center group cursor-pointer"
              onClick={() => (onStepClick && isCompleted ? onStepClick(index) : null)}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50'
                    : isCurrent
                    ? 'bg-gov-primary text-white shadow-md ring-4 ring-blue-100 scale-110'
                    : 'bg-white border-2 border-slate-300 text-slate-400 group-hover:border-slate-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={`mt-2 text-[11px] font-semibold text-center max-w-[85px] leading-tight transition-colors ${
                  isCurrent
                    ? 'text-gov-primary font-bold'
                    : isCompleted
                    ? 'text-slate-700'
                    : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
