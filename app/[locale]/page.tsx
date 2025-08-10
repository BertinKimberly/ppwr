import Link from "next/link";
import React from "react";

const Home = () => {
   return (
      <div className="w-full min-h-screen flex items-center justify-center gap-4 flex-col">
         <h1>Welcome to the Home Page</h1>
         <Link
            href="/sign-in"
            className="text-primary hover:underline"
         >
            Get Started
         </Link>
      </div>
   );
};

export default Home;
