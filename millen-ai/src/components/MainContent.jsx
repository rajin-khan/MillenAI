import { PaperAirplaneIcon, SunIcon, BoltIcon, ScaleIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

const SuggestionCard = ({ icon, title, subtitle }) => (
  <div className="p-4 transition-all duration-300 ease-in-out border cursor-pointer rounded-xl border-white/10 hover:border-emerald-400/60 hover:bg-zinc-800/60 hover:-translate-y-1.5">
    <div className="w-7 h-7 mb-2 text-emerald-400 transition-colors duration-300">{icon}</div>
    <h3 className="mb-0.5 font-semibold text-white">{title}</h3>
    <p className="text-sm text-zinc-400">{subtitle}</p>
  </div>
);

const MainContent = () => {
  return (
    <div className="flex flex-col flex-1 h-screen">
      {/* Welcome Screen (or Chat history) */}
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center h-full">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">MillenAI</span>
                </h2>
                <p className="mt-3 text-base text-zinc-400 sm:text-lg">
                  Start a new conversation or explore some ideas below.
                </p>
                <div className="grid grid-cols-1 gap-3 mt-10 sm:grid-cols-2">
                  <SuggestionCard icon={<SunIcon />} title="Brainstorm ideas" subtitle="for my new SaaS product" />
                  <SuggestionCard icon={<BoltIcon />} title="Explain a concept" subtitle="like quantum computing" />
                  <SuggestionCard icon={<ScaleIcon />} title="Compare and contrast" subtitle="Python and Javascript" />
                  <SuggestionCard icon={<PencilSquareIcon />} title="Write a blog post" subtitle="about the future of AI" />
                </div>
            </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 px-4 pb-4">
        <div className="max-w-3xl p-0.5 mx-auto rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-500 group focus-within:p-1 transition-all duration-300 ease-in-out">
          <div className="relative flex items-center p-1 bg-zinc-900 rounded-xl">
            <textarea
              className="w-full h-12 max-h-48 pl-4 pr-16 py-3 text-base bg-transparent border-none appearance-none rounded-xl text-zinc-100 focus:outline-none focus:ring-0 resize-none"
              placeholder="Message MillenAI..."
              rows="1"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            <button className="absolute right-2 bottom-2 p-2.5 transition-all duration-300 ease-in-out rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 hover:scale-110 active:scale-100">
              <PaperAirplaneIcon className="w-5 h-5 text-white transition-transform duration-500 ease-in-out group-hover:-rotate-12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;