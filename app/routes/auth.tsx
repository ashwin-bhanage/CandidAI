import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter"

export const meta = () => [
  { title: "CandidAI | Auth" },
  {name: "description", content: "Authentication page for CandidAI" }
]

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  
  //below is used for the user to authenticate and redirect to the required page
  const next = location.search.split('next=')[1];
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) navigate(next);  
  }, [auth.isAuthenticated, next])


  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center ">
      <div className="gradient-border shadow-lg ">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-8">
          <div className="flex flex-col items-center gap-8 text-center">
            <h1>Welcome</h1>
            <h2>Log in to continue your job journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button
                    className="auth-button"
                    onClick={() => auth.signOut()}
                  >
                    <p>Log Out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={() => auth.signIn()}>
                    <p>Log In</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Auth