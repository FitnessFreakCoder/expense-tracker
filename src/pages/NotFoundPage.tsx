import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Layout } from '../components/layout/Layout';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout requireAuth={false}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold text-primary-500">404</h1>
        <h2 className="text-3xl mt-4 font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
          We couldn't find the page you're looking for. Please check the URL or return to the homepage.
        </p>
        <Link to="/" className="mt-8">
          <Button leftIcon={<Home size={16} />}>
            Back to Homepage
          </Button>
        </Link>
      </div>
    </Layout>
  );
};