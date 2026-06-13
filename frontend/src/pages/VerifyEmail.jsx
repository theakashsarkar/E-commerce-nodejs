import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { verifyEmail } from "@/services/authService";
const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();
  useEffect(() => {
    const performVerification = async () => {
      try {
        const data = await verifyEmail(token);
        setStatus("Email Verification successfully! Redirecting to loging...");
        toast.success(data.message || "Email verified successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus(err.message || "Verification failed. Please try again.");
        toast.error(err.message);
      }
    };
    performVerification();
  }, [token, navigate]);
  return (
    <div className="relative w-full h-[760px] bg-pink-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md">
          <h2 className="text-xl font-semibold text-gray-800">{status}</h2>
        </div>
      </div>
    </div>
  );
};
export default VerifyEmail;
