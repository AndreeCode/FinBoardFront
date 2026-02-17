'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText: string;
  footerLink: {
    href: string;
    text: string;
  };
}

export function AuthCard({ title, description, children, footerText, footerLink }: AuthCardProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground text-center">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {children}
          
          <p className="text-center text-sm text-muted-foreground">
            {footerText}{' '}
            <Link
              href={footerLink.href}
              className="font-semibold text-primary hover:underline"
            >
              {footerLink.text}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
