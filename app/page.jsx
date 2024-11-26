"use client";
import { FaCamera, FaDatabase, FaCheckCircle, FaFileAlt, FaCogs } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  const handleClick = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 fixed top-0 w-full z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-semibold">APNR</div>
          <nav>
            <ul className="flex space-x-6">
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
              <li>
                <Link href="#contact" className="hover:text-gray-300">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={handleClick}
            className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative text-white py-16 bg-cover bg-center h-[60vh] flex mt-16"
        style={{ backgroundImage: "url('/background-landing.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 max-w-4xl mx-auto flex flex-col items-start px-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to APNR</h1>
          <p className="text-xl mb-8">
            The future of Automatic Plate Number Recognition for enhanced
            security <br />
            and vehicle tracking.
          </p>
          <div>
            <Link
              href="/dashboard"
              className="bg-yellow-500 text-black py-3 px-6 rounded-lg inline-flex items-center space-x-2 hover:bg-yellow-600"
            >
              <span>Get Started</span>
              <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                <FaCamera />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Recognition</h3>
              <p>
                Instantly detect and log vehicle plate numbers in real-time for
                better monitoring and security.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                <FaDatabase />
              </div>
              <h3 className="text-xl font-semibold mb-4">Data Storage</h3>
              <p>
                Store vehicle recognition data securely for easy access and
                future reference.
              </p>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg shadow-md">
              <div className="text-4xl text-blue-600 mb-4 flex justify-center">
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
            <div className="absolute left-8 top-10 w-0.5 h-[75%] bg-blue-300" />
            
            {/* Steps */}
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex items-start gap-6">
                <div className="mt-9 relative">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FaCamera className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 flex-1">
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
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FaCogs className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 flex-1">
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
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <FaFileAlt className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 flex-1">
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
      <footer id="contact" className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2024 APNR. All Rights Reserved.</p>
          <div className="mt-4">
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
          </div>
        </div>
      </footer>
    </div>
  );
}
