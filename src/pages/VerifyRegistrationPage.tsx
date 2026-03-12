// import { useEffect, useState } from "react";
// import { Link, useSearch } from "@tanstack/react-router";
// import { verifyRegistrationApi } from "@/api/auth";
// import { AuthLayout } from "@/components/AuthLayout";
// import { ProcessingSkeleton } from "@/components/AuthSkeleton";

// type Status = "verifying" | "success" | "failure";

// export default function VerifyRegistrationPage() {
//   const { token } = useSearch({ strict: false }) as { token?: string };
//   const [status, setStatus] = useState<Status>("verifying");
//   const [errorMsg, setErrorMsg] = useState("");

//   useEffect(() => {
//     if (!token) {
//       setStatus("failure");
//       setErrorMsg("Missing verification token");
//       return;
//     }
//     verifyRegistrationApi(token)
//       .then(() => setStatus("success"))
//       .catch((err) => {
//         setStatus("failure");
//         setErrorMsg(err?.message || "Verification failed");
//       });
//   }, [token]);

//   if (status === "verifying") {
//     return <ProcessingSkeleton message="Verifying your account" />;
//   }

//   return (
//     <AuthLayout title={status === "success" ? "Email verified!" : "Verification failed"}>
//       <div className="text-center space-y-4 fade-in">
//         {status === "success" ? (
//           <>
//             <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
//               <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <p className="text-muted-foreground text-sm">Your account has been verified. You can now sign in.</p>
//             <Link to="/login" className="btn-primary inline-block">Sign in</Link>
//           </>
//         ) : (
//           <>
//             <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
//               <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </div>
//             <p className="text-muted-foreground text-sm">{errorMsg}</p>
//             <Link to="/login" className="text-primary hover:underline text-sm inline-block">Back to sign in</Link>
//           </>
//         )}
//       </div>
//     </AuthLayout>
//   );
// }
