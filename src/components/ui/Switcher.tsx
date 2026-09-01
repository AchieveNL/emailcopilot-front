"use client";

interface SwitcherProps {
  isOn: boolean;
  onClick: () => void;
}

function Switcher({ isOn, onClick }: SwitcherProps) {
  return (
    <div className="pt-2">
      <button
        type="button"
        onClick={() => onClick()}
        className={`w-8 h-4 rounded-full transition-colors relative flex items-center shrink-0 ${
          isOn ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-transform ${
            isOn ? "translate-x-4" : "translate-x-1"
          }`}
        ></div>
      </button>
    </div>
  );
}

export default Switcher;
