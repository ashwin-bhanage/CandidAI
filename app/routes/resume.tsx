import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/feedback/ATS";
import Details from "~/components/feedback/Details";
import Summary from "~/components/feedback/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "CandidAI | Resume Analysis" },
  { name: "description", content: "View your resume analysis results." },
];

const resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageURL, setImageURL] = useState("");
  const [resumeURL, setResumeURL] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [isLoading]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:{${id}}`);
      if (!resume) return;

      const resumeData = JSON.parse(resume);

      // the puter store the data in form and blog so
      // to get the resume file and image file we need to fetch and convert them to file
      const resumeBlob = await fs.read(resumeData.resumePath);
      if (!resumeBlob) return;
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeURL = URL.createObjectURL(pdfBlob);
      setResumeURL(resumeURL);

      // for images file from puter store to the application
      const imageBlob = await fs.read(resumeData.imagePath);
      if (!imageBlob) return;
      const imageURL = URL.createObjectURL(
        new Blob([imageBlob], { type: "image/png" })
      );
      setImageURL(imageURL);

      setFeedback(resumeData.feedback);
      console.log({ resumeURL, imageURL, feedback: resumeData.feedback });
    };

    loadResume();
  }, [id]);

  return (
    <main className="!pt-0 ">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to HomePage
          </span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url ('/images/bg-feedback.svg')] bg-cover h-100vh top-0 sticky items-center justify-center">
          {imageURL && resumeURL && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-2xl:h-fit w-fit">
              <a
                href={resumeURL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full"
              >
                <img
                  src={imageURL}
                  className="w-full h-full object-contain rounded-lg"
                  title="Resume Image"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section ">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
