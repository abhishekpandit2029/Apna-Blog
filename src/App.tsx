import { BlogProvider } from './context/BlogContext';
import BlogList from './components/BlogList';
import BlogDetail from './components/BlogDetail';
import Header from './components/Header';

function App() {
  return (
    <BlogProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <BlogList />
        </main>
        <BlogDetail />
      </div>
    </BlogProvider>
  );
}

export default App;