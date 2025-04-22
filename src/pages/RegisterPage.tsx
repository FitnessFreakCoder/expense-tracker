import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { DollarSign, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Layout } from '../components/layout/Layout';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const { state, register: registerUser, clearError } = useAuth();
  const { isAuthenticated, isLoading, error } = state;
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    await registerUser(data.name, data.email, data.password);
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign up to start tracking your finances
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
                  label="Name"
                  placeholder="Enter your name"
                  leftIcon={<User size={16} />}
                  error={errors.name?.message}
                  fullWidth
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  })}
                  onChange={() => error && clearError()}
                />
                
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
                  placeholder="Create a password"
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
                
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  leftIcon={<Lock size={16} />}
                  error={errors.confirmPassword?.message}
                  fullWidth
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => 
                      value === password || 'Passwords do not match',
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
                  Create Account
                </Button>
                
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Sign in
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