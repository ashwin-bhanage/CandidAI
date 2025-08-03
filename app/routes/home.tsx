import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import resume from "./resume";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "CandidAI" },
    { name: "description", content: "Welcome to CandidAI!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loadingResumes, setLoadingResumes] = useState(false)

  useEffect(() => {
    if (!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true)
      const resumes = await kv.list('resume:*', true) as KVItem[]


      const parsedResumes = resumes?.map((resume) => (
        JSON.parse(resume.value) as Resume
      ))

      console.log("parsedResumes",parsedResumes);
      setResumes(parsedResumes || [])
      setLoadingResumes(false)
    }
    loadResumes();
  }, [])



  return (
    // Full page layout with background image
    <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
      {/* Navigation Menu */}
      <Navbar />
      {/* Main Section */}
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Application & Resume Ratings</h1>
          {!loadingResumes && resumes?.length === 0 ?(
            <>
            <h2>You haven't submitted any resumes. Please upload one!</h2>
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
            </>
          ): (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )}
        </div>
        {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan2.gif" className="w-[200px]" />
          </div>
        )}

      {/* Resume Cards Section */}
        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
        {loadingResumes && resumes.length === 0 &&(
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">Upload Resume</Link>
          </div>
        )}
      </section>
    </main>
  );
}
