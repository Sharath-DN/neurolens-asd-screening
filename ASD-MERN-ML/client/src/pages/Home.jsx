import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50 flex justify-center items-start py-12 px-4">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-sky-800 mb-4">
          Welcome to Neurolens
        </h1>

        <p className="text-gray-700 mb-3 leading-relaxed">
          Neurolens is an early screening assistant designed to help caregivers
          and parents identify possible autism spectrum traits using a short,
          behaviour-based questionnaire powered by machine learning.
        </p>

        <p className="text-gray-700 mb-4 leading-relaxed">
          The screening is <span className="font-semibold">not</span> a medical
          diagnosis. It provides an initial indication of the likelihood of
          autism-related traits, to support conversations with qualified
          professionals.
        </p>

        {/* What is Autism section */}
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 mb-5">
          <h2 className="text-xl font-semibold text-sky-800 mb-2">
            What is Autism Spectrum Disorder (ASD)?
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            Autism Spectrum Disorder is a neurodevelopmental condition that
            affects how a person communicates, interacts with others and
            experiences the world. Every child is different, and autism can look
            very different from one person to another.
          </p>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            <li>Difficulties with social interaction or eye contact.</li>
            <li>Differences in communication (speech, gestures, or tone).</li>
            <li>Repetitive behaviours or strong interests in specific topics.</li>
            <li>Different sensory responses to sound, light, touch or textures.</li>
          </ul>
        </div>

        {/* Why early screening section */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6">
          <h2 className="text-xl font-semibold text-teal-800 mb-2">
            Why is early screening important?
          </h2>
          <p className="text-gray-700 text-sm mb-2">
            Early identification helps families access support, therapies and
            school accommodations sooner. Screening does not label your child — 
            it simply gives you more information to decide on next steps.
          </p>
          <ul className="list-disc ml-5 text-gray-700 text-sm space-y-1">
            <li>Helps track your child's development over time.</li>
            <li>Supports conversations with pediatricians and therapists.</li>
            <li>Can lead to early intervention and better long-term outcomes.</li>
          </ul>
        </div>

        <ul className="list-disc ml-6 text-gray-700 mb-6 space-y-1">
          <li>Answer 10 behaviour-focused questions about your child.</li>
          <li>Get an ASD likelihood score with clear next-step guidance.</li>
          <li>Download a PDF report to share with professionals.</li>
          <li>
            Explore doctors, schools, videos and learning games in the Support
            page.
          </li>
        </ul>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={() => navigate("/questionnaire")}
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
          >
            Start Questionnaire
          </button>
          <button
            onClick={() => navigate("/support")}
            className="px-5 py-2 rounded-lg border border-sky-500 text-sky-700 hover:bg-sky-50 font-semibold transition"
          >
            View Support & Resources
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-600 italic">
          Disclaimer: Neurolens is a screening tool only. It does not replace a
          formal assessment or diagnosis. Always consult a qualified healthcare
          professional for clinical evaluation and recommendations.
        </div>
      </div>
    </div>
  );
}
