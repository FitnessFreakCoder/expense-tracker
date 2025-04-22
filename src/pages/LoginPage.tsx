import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DollarSign, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const { isAuthenticated, isLoading, error } = state;
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
  };
  
  // If already authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <Layout requireAuth={false}>
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Expense Tracker</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>
          
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="pt-6">
                {error && (
                  <div className="mb-4 p-3 bg-danger-50 dark:bg-danger-900/50 text-danger-600 dark:text-danger-400 rounded-md text-sm">
                    {error}
                  </div>
                )}
                
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  leftIcon={<Mail size={16} />}
                  error={errors.email?.message}
                  fullWidth
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  onChange={() => error && clearError()}
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<Lock size={16} />}
                  error={errors.password?.message}
                  fullWidth
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  onChange={() => error && clearError()}
                />
              </CardContent>
              
              <CardFooter className="flex-col space-y-4">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                >
                  Sign In
                </Button>
                
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};