import Link from "next/link"
import { Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold tracking-tighter">
              We<span className="text-primary">Terview</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Exploring the cutting edge of artificial intelligence and machine learning.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Rss className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-4">Topics</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Generative AI
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Computer Vision
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Deep Learning
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Machine Learning
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Research Papers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Code Samples
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Datasets
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>ameyaudeshmukh@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} NeuralPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
