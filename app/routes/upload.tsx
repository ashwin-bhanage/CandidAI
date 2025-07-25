import { useState } from "react"
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar"

const upload = () => {

    const [isProcessing, setisProcessing] = useState(false);
    const [statusText, setstatusText] = useState('');

    // to manage file state
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        console.log({
            companyName,
            jobTitle,
            jobDescription,
            file
        });
        
    };

    // for handling file upload
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                            <h2>Drop your resume here for ATS feedback and AI analysis.</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" placeholder="Company Name" name="company-name" id="company-name"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" placeholder="Job Title" name="job-title" id="job-title"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} placeholder="Job Description" name="job-description" id="job-description"/>
                            </div>
                            <div className="form-div">
                                <label htmlFor="uploader">
                                    Upload Resume
                                </label>
                                <FileUploader onFileSelect={handleFileSelect}/>
                            </div>

                            <button type="submit" className="primary-button">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
        
  )
}

export default upload