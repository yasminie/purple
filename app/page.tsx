"use client";

import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { SparklesCore } from "../components/ui/sparkles";
import { useRouter } from 'next/navigation'; // Import Next.js router

export default function Home() {
  const logo = `purple.ai`;
  const slogan = "Power of many, simplicity of one";
  const router = useRouter(); // Initialize router

  const handleLoginClick = () => {
    router.push('/login'); // Navigate to login page
  };

  const handleSignupClick = () => {
    router.push('/signup'); // Navigate to signup page
  };

  return (
    <main className="relative flex justify-center items-center flex-col mx-auto overflow-visible">
      <div className="w-full h-full">
        <div className="pb-20 pt-36" id="home">
          <div className="h-screen w-full absolute top-0 left-0 flex items-center justify-center">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              className="w-full h-full"
              particleColor="#FFFFFF"
            />
          </div>

          <div className="flex justify-center relative my-20 z-10">
            <div className="max-w-[80vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
              <TextGenerateEffect
                words={logo}
                className="questrial text-center text-[40px] md:text-5xl lg:text-6xl mb-3"
              />
              <p className="roboto tracking-widest text-xl text-center text-blue-100 max-w-120">
                {`${slogan}`}
              </p>

              <div className="mt-10">
                <button className="p-[3px] relative m-2" onClick={handleLoginClick}>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="roboto w-[120px] px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent flex items-center justify-center">
                    Login
                  </div>
                </button>

                <button className="p-[3px] relative m-2" onClick={handleSignupClick}>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                  <div className="roboto w-[120px] px-8 py-2 bg-black rounded-[6px] relative group transition duration-200 text-white hover:bg-transparent flex items-center justify-center">
                    Sign Up
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer>&copy; Copyright 2024 purple.ai</footer>
    </main>
  );
}

