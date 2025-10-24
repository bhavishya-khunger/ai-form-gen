import { MdArrowOutward, MdDesignServices, MdDeveloperMode } from "react-icons/md";
import { FaBusinessTime, FaChalkboardTeacher, FaCode } from "react-icons/fa";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import './landing.css'; // Make sure this is imported
import Navbar from "./Navbar";
import { BsStars } from "react-icons/bs";
// --- MOTION: --- Step 1: Import motion
import { motion } from "framer-motion";
import { Link } from 'react-router-dom'

// --- MOTION: --- Step 2: Define our animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const cardContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2 // Each child card will animate 0.2s after the previous one
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};


function LandingPage() {
  return (
    <>
      {/* Main container */}
      <div className="min-h-screen bg-[#010101] text-white relative overflow-hidden">
        <Navbar />
        {/* Grid Background */}
        <div className="grid-background"></div>

        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 relative z-10">
          <h1 className="text-5xl mt-10 homemade-apple-regular md:text-6xl text-white mb-4 animate-[fade-in_1s_ease-out] leading-snug md:leading-tight">
            Build forms with ease, in{" "}
            <span className="diagonal-strike text-gray-400">minutes</span>{" "}
            <span className="text-white">seconds</span>
          </h1>

          {/* --- MOTION: --- Staggered the hero star animations slightly using delays */}
          <BsStars
            size={20}
            className="md:-translate-y-60 -translate-y-80 translate-x-14 opacity-50 animate-[fade-in_1.2s_ease-out_0.4s]" // Added 0.4s delay
          />
          <BsStars
            size={60}
            className="absolute translate-y-56 translate-x-96 opacity-50 animate-[fade-in_1.2s_ease-out_0.6s,twinkle_3s_ease-in-out_infinite_1.5s]" // Added 0.6s delay
          />
          <BsStars
            size={40}
            className="absolute translate-y-28 -translate-x-96 opacity-50 animate-[fade-in_1.2s_ease-out_0.8s,twinkle_5s_ease-in-out_infinite_1.8s]" // Added 0.8s delay
          />

          {/* --- MOTION: --- Staggered the hero text animations using delays */}
          <p className="text-gray-400 max-w-lg mt-4 mx-auto leading-relaxed animate-[fade-in_1.2s_ease-out_0.2s]"> {/* Added 0.2s delay */}
            Just tell our AI what kind of form you want — and it'll create it for
            you!{" "}
          </p>
          <span className="homemade-apple-regular mt-4 text-xl text-indigo-300 animate-[fade-in_1.2s_ease-out_0.3s]"> {/* Added 0.3s delay */}
            No coding, no drag-and-drop!
          </span>

          {/* CTA Button */}
          <div className="flex animate-[fade-in_1.2s_ease-out_0.4s] gap-5"> {/* Added 0.4s delay */}
            <Link to={'/dashboard'} className="mt-8 flex gap-2 items-center px-4 py-2 rounded-xl text-white font-medium cursor-pointer border border-white/40 backdrop-blur-sm bg-gradient-to-bl from-indigo-900 to-black bg-[length:200%_200%] transition-all duration-500 ease-in-out hover:bg-[position:100%_0%] hover:scale-105">
              Try Out
              <IoIosArrowDroprightCircle size={20} />
            </Link>

            <Link to={'#'} className="mt-8 flex gap-2 items-center px-4 py-2 rounded-xl text-white font-medium cursor-pointer border border-white/40 backdrop-blur-sm transition-all duration-500 ease-in-out hover:bg-[position:100%_0%] hover:scale-105">
              <MdArrowOutward size={20} /> Get in Touch
            </Link>
          </div>

        </div>

        {/* --- MOTION: --- Converted <div> to <motion.div> and added variants */}
        {/* Features Section */}
        <motion.div
          className="relative z-10 py-20 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Triggers when 30% is visible, only once
          variants={sectionVariants}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl blackboard-text md:text-4xl text-center mb-16">
              How It <span className="chalk-underline">Works</span>
            </h2>

            {/* --- MOTION: --- Added container for staggering cards */}
            <motion.div
              className="grid md:grid-cols-3 gap-8 mb-20"
              variants={cardContainerVariants}
            >
              {/* --- MOTION: --- Converted card <div>s to <motion.div>s */}
              <motion.div className="feature-card p-6 text-center" variants={cardVariants}>
                {/* <div className="text-2xl mb-4 blackboard-text">1</div> */}
                <h3 className="text-xl homemade-apple-regular mb-3 ">Describe Your Form</h3>
                <p className="text-gray-400 italic font-mono text-sm">
                  Simply tell our AI what you need - contact forms, surveys, registration, anything!
                </p>
              </motion.div>

              <motion.div className="feature-card p-6 text-center" variants={cardVariants}>
                {/* <div className="text-2xl mb-4 blackboard-text">2</div> */}
                <h3 className="text-xl homemade-apple-regular mb-3">Magic Happens</h3>
                <p className="text-gray-400 italic font-mono text-sm">
                  Our intelligent system designs and builds your perfect form in seconds
                </p>
              </motion.div>

              <motion.div className="feature-card p-6 text-center" variants={cardVariants}>
                {/* <div className="text-2xl mb-4 blackboard-text">3</div> */}
                <h3 className="text-xl homemade-apple-regular mb-3">Use Anywhere</h3>
                <p className="text-gray-400 italic font-mono text-sm">
                  Embed your form on any website or platform with a simple copy-paste
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* --- MOTION: --- Converted <div> to <motion.div> for the "Use Cases" section */}
        <motion.div
          className="relative z-10 py-20 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl text-center blackboard-text mb-16">
              Perfect For <span className="chalk-underline">Everyone</span>
            </h2>

            {/* --- MOTION: --- Added container for staggering cards */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              variants={cardContainerVariants}
            >
              {/* --- MOTION: --- Converted card <div>s to <motion.div>s */}
              <motion.div className="feature-card p-6" variants={cardVariants}>
                <h3 className="text-lg flex items-center gap-3 homemade-apple-regular mb-3"><FaCode size={25} /> Developers</h3>
                <p className="text-gray-400 text-sm">
                  Save hours of coding time. Generate complex forms with validation in seconds.
                </p>
              </motion.div>

              <motion.div className="feature-card p-6" variants={cardVariants}>
                <h3 className="text-lg flex items-center gap-3 homemade-apple-regular mb-3"><FaChalkboardTeacher size={25} /> Educators</h3>
                <p className="text-gray-400 text-sm">
                  Create quizzes, feedback forms, and registration forms without technical skills.
                </p>
              </motion.div>

              <motion.div className="feature-card p-6" variants={cardVariants}>
                <h3 className="text-lg flex items-center gap-3 homemade-apple-regular mb-3"><FaBusinessTime size={25} /> Business Owners</h3>
                <p className="text-gray-400 text-sm">
                  Build contact forms, order forms, and customer surveys instantly.
                </p>
              </motion.div>

              <motion.div className="feature-card p-6" variants={cardVariants}>
                <h3 className="text-lg flex items-center gap-3 homemade-apple-regular mb-3"><MdDesignServices size={25} /> Designers</h3>
                <p className="text-gray-400 text-sm">
                  Focus on creativity while AI handles the technical form building.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* --- MOTION: --- Converted <div> to <motion.div> for the "Final CTA" section */}
        <motion.div
          className="relative z-10 py-20 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl blackboard-text leading-relaxed mb-6">
              Ready to <span className="chalk-underline">Transform</span> Your Form Building?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={'/dashboard'} className="bg-white flex items-center gap-3 text-black hover:bg-gray-200 rounded-full px-8 py-3 font-medium transition-all duration-300 hover:scale-105 cursor-pointer">
                Get Started Free <MdArrowOutward size={25} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LandingPage;