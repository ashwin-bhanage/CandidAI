import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "constants/index";
import ResumeCard from "~/components/ResumeCard";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "CandidAI" },
    { name: "description", content: "Welcome to CandidAI!" },
  ];
}

export default function Home() {
  return (
    // Full page layout with background image
    <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
      {/* Navigation Menu */}
      <Navbar />
      {/* Main Section */}
      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Application & Resume Ratings</h1>
          <h2>Review your submissions and check AI-powered feedback</h2>
        </div>
      </section>

      {/* Resume Cards Section */}
      {resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}
    </main>
  );
}
