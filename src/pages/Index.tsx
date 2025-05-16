
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Restaurant App</h1>
        <p className="text-xl text-muted-foreground">Start exploring our delicious menu!</p>
        <div className="mt-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Index;
