import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  return (
    // Add a subtle, dark gradient to the entire background
    <main className="flex w-full h-screen font-sans bg-gradient-to-br from-zinc-950 to-slate-900">
      <Sidebar />
      <MainContent />
    </main>
  )
}

export default App