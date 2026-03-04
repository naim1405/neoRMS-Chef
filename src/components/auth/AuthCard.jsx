import React from 'react';
import { ChefHat } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui-login/card';

export default function AuthCard({ title, description, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF5F5] px-4 text-[#2C2C2C]">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-stretch">
        {/* Left: neoRMS Logo with Chef Portal Branding */}
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-6">
          {/* neo RMS Logo */}
          <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-[#FF4D4F] bg-white shadow-lg md:h-52 md:w-52">
            <span className="select-none text-center text-xl font-extrabold leading-tight tracking-tight text-[#FF4D4F] md:text-2xl">
              neo
              <br />
              RMS
            </span>
          </div>

          {/* Chef Hat Icon */}
          <div className="relative flex items-center gap-3">
            {/* blurred background */}
            <div className="absolute inset-0 bg-[#FF4D4F] rounded-full blur-xl opacity-20"></div>

              {/* icon */}
              <ChefHat className="h-10 w-10 text-[#FF4D4F] z-10" strokeWidth={1.5} />

                {/* text */}
              <h2 className="text-3xl font-bold tracking-tight text-[#FF4D4F] z-10">
                Chef Portal
              </h2>
          </div>

          {/* Chef Portal Text */}
          <div className="text-center space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#999]">
              Restaurant Management System
            </p>
          </div>
        </div>

        {/* Right: Auth form card */}
        <div className="w-full max-w-md flex-1">
          <Card className="rounded-2xl border border-[#FFB3B3] bg-white shadow-lg">
            <CardHeader className="space-y-1 pb-3">
              <CardTitle className="text-2xl font-semibold tracking-tight text-[#2C2C2C]">
                {title}
              </CardTitle>
              {description ? (
                <CardDescription className="text-neutral-500">
                  {description}
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="pt-0">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

