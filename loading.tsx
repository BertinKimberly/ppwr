import React from "react";

const loading = () => {
   return (
      <div className="flex items-center justify-center min-h-screen">
         <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main mx-auto"></div>
            <p className="mt-4 text-main">Loading...</p>
         </div>
      </div>
   );
};

export default loading;
