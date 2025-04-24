import { BlogProvider } from './context/BlogContext';
import BlogList from './components/blog/BlogList';
import BlogDetail from './components/blog/BlogDetail';
import Header from './components/layout/Header';

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