import { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  XMarkIcon, 
  KeyIcon, 
  ArrowTopRightOnSquareIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import ToggleSwitch from './ToggleSwitch';

const SettingsModal = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings, isOpen]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#1C1C1C] border border-zinc-700 p-6 text-left align-middle shadow-2xl shadow-cyan-500/10 transition-all">
                <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-white flex justify-between items-center">
                  Settings
                  <button onClick={onClose} className="p-1 rounded-full hover:bg-zinc-700 transition-colors">
                    <XMarkIcon className="w-6 h-6 text-zinc-400"/>
                  </button>
                </Dialog.Title>

                <div className="mt-6 space-y-8">
                  {/* API Key Section */}
                  <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-semibold text-zinc-200">
                      <KeyIcon className="w-5 h-5 text-zinc-400" />
                      Groq API Key
                    </h4>
                    <p className="text-sm text-zinc-400">
                      Your API key is required to make requests to Groq. It is stored securely in your browser's local storage and never sent to our servers.
                    </p>
                    <a 
                      href="https://console.groq.com/keys" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                    >
                      Get your API Key here
                      <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                    <div className="relative mt-2">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={settings.apiKey}
                        onChange={(e) => handleChange('apiKey', e.target.value)}
                        // ▼▼▼ THIS LINE IS THE FIX ▼▼▼
                        className="w-full bg-zinc-800 border border-zinc-600 rounded-lg pl-3 py-3 pr-12 text-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500"
                        placeholder="gsk_..."
                      />
                      <button onClick={() => setShowApiKey(!showApiKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showApiKey ? <EyeSlashIcon className="h-5 w-5 text-zinc-400" /> : <EyeIcon className="h-5 w-5 text-zinc-400" />}
                      </button>
                    </div>
                  </div>

                  {/* Preferences Section */}
                  <div className="space-y-4 pt-6 border-t border-zinc-700/50">
                     <h4 className="flex items-center gap-2 font-semibold text-zinc-200">
                      <WrenchScrewdriverIcon className="w-5 h-5 text-zinc-400" />
                      Preferences
                    </h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-zinc-200">Enter to Send</h4>
                        <p className="text-sm text-zinc-400">Send messages by pressing the Enter key.</p>
                      </div>
                      <ToggleSwitch enabled={settings.enterToSend} onChange={(value) => handleChange('enterToSend', value)} />
                    </div>
                     <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-zinc-200">Dark Mode</h4>
                        <p className="text-sm text-zinc-400">Toggle the UI theme.</p>
                      </div>
                      <ToggleSwitch enabled={settings.darkMode} onChange={(value) => handleChange('darkMode', value)} />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg hover:scale-105 active:scale-100 transition-transform duration-200">Save Changes</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SettingsModal;