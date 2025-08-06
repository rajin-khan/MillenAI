import { Switch } from '@headlessui/react';

const ToggleSwitch = ({ enabled, onChange }) => {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-zinc-900
                 ${enabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                   transition duration-200 ease-in-out
                   ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </Switch>
  );
};

export default ToggleSwitch;