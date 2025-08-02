import {prepareInstructions}  from "constants/index";
import { useState } from "react"
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar"
import { convertPdfToImage } from "~/lib/pdfToImage";
import { usePuterStore } from "~/lib/puter";
import { generateId } from "~/lib/utils";

const upload = () => {
    // kv is key-value store, fs is file system, ai is AI service, auth is authentication
    // isLoading is a boolean to check if the store is loading
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setisProcessing] = useState(false);
    const [StatusText, setStatusText] = useState('');

    // to manage file state
    const [file, setFile] = useState<File | null>(null);
    
    // for handling file upload
    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    // handle form analysis submission
    const handleAnaylze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setisProcessing(true);
        // intial analyze state
        setStatusText('Analyzing your resume...');
        const uploadedFile = await fs.upload([file]);

        if(!uploadedFile) return setStatusText("Failed to upload the file. Please try again.");
            
        // convert the PDF to image on the hero section to have better analysis
        setStatusText('Converting your resume to image...');
        const imageFile = await convertPdfToImage(file);

        // to check if image conversion was successful
        if (!imageFile.file) return setStatusText('Failed to convert PDF to image. Please try again.');

        setStatusText('Uploading the image...');

        // to upload image of file
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) return setStatusText('Failed to upload the image. Please try again.');

        setStatusText('Preparing data...');

        // to analyze the resume with AI
        const analysis = generateId();

        // to have the analysis data
        const analysisData = {
          id: analysis,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName,
          jobTitle,
          jobDescription,
          feedback: "",
        };
        // to get the value from the puter store using kv store
        await kv.set(`resume:{${analysis}}`, JSON.stringify(analysisData));

        setStatusText('Analyzing your resume with AI...');
        // to analyze the resume with AI

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription})
        );
    // this tells and fetch the AI response format
        if (!feedback) return setStatusText('Failed to analyze the resume. Please try again.');

        const feedbackText = typeof feedback.message.content === 'string' ? feedback.message.content : feedback.message.content[0].text; 

        // use the above message.content to update the analysis data
        analysisData.feedback = JSON.parse(feedbackText);
        // to update the analysis data in the kv store
        await kv.set(`resume:{${analysis}}`, JSON.stringify(analysisData));

        setStatusText('Analysis completed successfully!');
        console.log("Analysis Data:", analysisData);
        navigate(`/resume/${analysis}`);
        
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if (!file) return;

        handleAnaylze({companyName, jobTitle, jobDescription, file});
        
    };


    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover ">
            <Navbar />
            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{StatusText}</h2>
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