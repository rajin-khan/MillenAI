import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

function App() {
  return (
    // Set the dark, solid background from the image
    <main className="flex w-full h-screen font-sans bg-[#0D1117]">
      <Sidebar />
      <MainContent />
    </main>
  )
}

export default App;