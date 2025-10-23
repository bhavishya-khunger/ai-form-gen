import React from "react";

const StyleProvider = () => (
  <style>
    {`
      body {
        font-family: 'Inter', sans-serif;
      }

      /* Diagonal strike-through effect */
      .diagonal-strike {
        position: relative;
        display: inline-block;
      }

      .diagonal-strike::after {
        content: "";
        position: absolute;
        top: 50%;
        left: -5%;
        /* Adjusted width for a better look */
        width: 110%; 
        height: 2px;
        background-color: #FFC058;
         /* Adjusted rotation */
        transform: rotate(-10deg);
        transform-origin: center;
      }

      @keyframes fade-in {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      /* NEW: Faded Grid Background */
      .grid-background {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        
        /* Create a grid with very faint, dark lines */
        background-image: 
          linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
        
        /* Set the size of the grid squares */
        background-size: 50px 50px; 
        
        /* Add a mask to fade it out towards the edges */
        mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        
        z-index: 0; /* Place it in the background */
      }
    `}
  </style>
);

function LandingPage() {
  return (
    <>
      <StyleProvider />

      {/* Main container: Now relative for z-index layering */}
      <div className="min-h-screen bg-[#010101] text-white relative overflow-hidden">

        {/* NEW: Grid Background Element */}
        <div className="grid-background"></div>

        {/* Your content, wrapped in a div to center it and place it on top (z-10) */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative z-10">

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-16 text-gray-300 text-sm animate-[fade-in_0.8s_ease-out]">
            ✨ AI Form Builder
          </div>

          <h1 className="text-5xl homemade-apple-regular md:text-6xl text-white mb-4 animate-[fade-in_1s_ease-out] leading-snug md:leading-tight">
            Build forms with ease, in{" "}
            <span className="diagonal-strike text-gray-400">minutes</span>{" "}
            <span className="text-white">seconds</span>
          </h1>

          <p className="text-gray-400 max-w-lg mt-4 mx-auto leading-relaxed animate-[fade-in_1.2s_ease-out]">
            Just tell our AI what kind of form you want — and it’ll create it for
            you!{" "}
          </p>
          <span className="homemade-apple-regular mt-2 text-lg text-pink-200">No coding, no drag-and-drop!</span>

          <p className="text-sm mt-10 text-gray-500 animate-[fade-in_1.4s_ease-out]">
            by{" "}
            <a
              href="https://bhavishyakhunger.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              @BhavishyaKhunger
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LandingPage;