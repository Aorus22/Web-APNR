"use client";
import { FaCamera, FaDatabase, FaCheckCircle, FaFileAlt, FaCogs } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginButton from "@/components/LoginButton";
import { UserAuth } from "@/context/authContext";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  const { user, handleLogin } = UserAuth();

  const handleClick = () => {
    if(user){
      router.push("/dashboard");
    } else{
      handleLogin()
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

    {/* Header */}
    <header className="bg-indigo-800 text-white p-2 sm:p-2 fixed top-0 w-full z-20">
      <div className="sm:px-8 mx-auto flex justify-between items-center">
        <div className="text-lg sm:text-2xl font-semibold">APNR</div>
        <nav>
          <ul className="flex space-x-4 sm:space-x-6 text-sm sm:text-base">
            <li>
              <Link href="#features" className="hover:text-gray-300">
                Features
              </Link>
            </li>
            <li>
              <Link href="#how-it-works" className="hover:text-gray-300">
                How it Works
              </Link>
            </li>
          </ul>
        </nav>
        <div className="text-sm sm:text-base">
          <LoginButton />
        </div>
      </div>
    </header>

      {/* Hero Section */}
      <section
        className="relative text-white py-16 bg-cover bg-center h-[60vh] flex sm:mt-16"
        style={{ backgroundImage: "url('/background-landing.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute left-0 sm:left-8 top-1/2 transform -translate-y-1/2 max-w-4xl mx-auto flex flex-col items-start px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to APNR</h1>
          <p className="text-md sm:text-xl mb-8">
            The future of Automatic Plate Number Recognition for enhanced
            security <br />
            and vehicle tracking.
          </p>
          <div>
            <button
              onClick={handleClick}
              className="bg-yellow-500 text-black py-3 px-6 rounded-lg inline-flex items-center space-x-2 hover:bg-yellow-600"
            >
              {user ? (
                <span>Go To Dashboard</span>
              ) : (
                <span>Get Started</span>
              )}
              <FaArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-indigo-50 p-8 rounded-lg">
              <div className="text-4xl text-indigo-600 mb-4 flex justify-center">
                <FaCamera />
              </div>
              <h3 className="text-xl font-semibold mb-4">Image Recognition</h3>
              <p>
                Upload vehicle images to detect and log plate numbers efficiently for better monitoring and security.
              </p>
            </div>
            <div className="bg-indigo-50 p-8 rounded-lg">
              <div className="text-4xl text-indigo-600 mb-4 flex justify-center">
                <FaDatabase />
              </div>
              <h3 className="text-xl font-semibold mb-4">Data Storage</h3>
              <p>
                Store vehicle recognition data securely for easy access and
                future reference.
              </p>
            </div>
            <div className="bg-indigo-50 p-8 rounded-lg">
              <div className="text-4xl text-indigo-600 mb-4 flex justify-center">
                <FaCheckCircle />
              </div>
              <h3 className="text-xl font-semibold mb-4">Accuracy</h3>
              <p>
                High accuracy rate in recognizing plates, ensuring that no
                vehicle is missed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="max-w-2xl mx-auto relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-10 w-0.5 h-[75%] bg-indigo-300" />
            
            {/* Steps */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="mt-9 relative">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <FaCamera className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2">Capture Images</h3>
                  <p className="text-gray-600">
                    Simply upload images or videos containing vehicles. Our system
                    will automatically scan and recognize the license plates.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-6">
                <div className="mt-9 relative">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <FaCogs className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2">Data Processing</h3>
                  <p className="text-gray-600">
                    The system processes the images/videos, extracting plate numbers
                    and other relevant details for logging and tracking.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-6">
                <div className="mt-9 relative">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <FaFileAlt className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 flex-1">
                  <h3 className="text-xl font-semibold mb-2">View Results</h3>
                  <p className="text-gray-600">
                    Access detailed reports and records of recognized vehicles,
                    including timestamps, regions, and vehicle types.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-indigo-900 text-white pt-8 pb-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 APNR. All Rights Reserved.</p>
          <div className="flex items-center justify-center mt-2 space-x-2">
            <span>Powered by</span>
            <Image src={"/megalogic.svg"} width={24} height={24} alt="Megalogic logo" />
          </div>
          {/* <div className="mt-4">
            <ul className="flex justify-center space-x-6">
              <li>
                <a href="https://facebook.com" target="_blank" className="hover:text-gray-300">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" className="hover:text-gray-300">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://linkedin.com" target="_blank" className="hover:text-gray-300">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
