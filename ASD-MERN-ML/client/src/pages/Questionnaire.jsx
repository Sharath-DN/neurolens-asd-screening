// client/src/pages/Questionnaire.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Questionnaire() {
  const navigate = useNavigate();

  const questions = [
  "Does your child look at you when you call his/her name?",

  "How easy is it for you to get eye contact with your child?",

  "Does your child point to indicate that he/she wants something? (e.g. a toy that is out of reach)",

  "Does your child point to share interest with you? (e.g. pointing at an interesting sight)",

  "Does your child pretend? (e.g. care for dolls, talk on a toy phone)",

  "Does your child follow where you're looking?",

  "If someone in the family is visibly upset, does your child show signs of wanting to comfort them?",

  "Would you describe your child's first words as meaningful?",

  "Does your child use simple gestures? (e.g. waving goodbye)",

  "Does your child stare at nothing with no apparent purpose?"
];

  // 0 = child details step, 1..10 = question index + 1
  const [currentStep, setCurrentStep] = useState(0);

  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [jaundice, setJaundice] = useState("");
  const [family, setFamily] = useState("");
  const [loading, setLoading] = useState(false);

  const updateAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // validate child details before going to questions
      if (!age || gender === "" || jaundice === "" || family === "") {
        alert("Please fill child age, gender, jaundice and family history first.");
        return;
      }
      setCurrentStep(1);
      return;
    }

    if (currentStep >= 1 && currentStep <= 10) {
      const qIndex = currentStep - 1;
      if (answers[qIndex] === null) {
        alert("Please answer this question before continuing.");
        return;
      }
      if (currentStep < 10) {
        setCurrentStep((s) => s + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const submit = async () => {
    // final validation in case something is missing
    if (
      answers.includes(null) ||
      age === "" ||
      gender === "" ||
      jaundice === "" ||
      family === ""
    ) {
      alert("Please answer all questions and fill all fields.");
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      alert("Please login first to continue.");
      navigate("/login");
      return;
    }

    // Map raw answers to scored features
    const scoredAnswers = answers.map((val, idx) => {
      if (idx === 9) {
        // Q10: Yes (1) scores 1, No (0) scores 0
        return val === 1 ? 1 : 0;
      } else {
        // Q1-Q9: No (0) scores 1, Yes (1) scores 0
        return val === 0 ? 1 : 0;
      }
    });

    const payload = {
      age: parseInt(age, 10),
      gender: parseInt(gender, 10),
      jaundice: parseInt(jaundice, 10),
      family_history: parseInt(family, 10),
      A1: scoredAnswers[0],
      A2: scoredAnswers[1],
      A3: scoredAnswers[2],
      A4: scoredAnswers[3],
      A5: scoredAnswers[4],
      A6: scoredAnswers[5],
      A7: scoredAnswers[6],
      A8: scoredAnswers[7],
      A9: scoredAnswers[8],
      A10: scoredAnswers[9],
    };

    const userFriendlyAnswers = {
      timestamp: new Date().toISOString(),
      age: payload.age,
      gender: payload.gender,
      jaundice: payload.jaundice,
      family_history: payload.family_history,
      questions,
      answers: answers.map((v) => (v === 1 ? "Yes" : v === 0 ? "No" : "N/A")),
    };
    localStorage.setItem("lastAnswers", JSON.stringify(userFriendlyAnswers));
    localStorage.setItem("lastPayload", JSON.stringify(payload));

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/predict",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("lastResult", JSON.stringify(res.data));
      navigate("/result");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login");
        return;
      }
      alert("Prediction failed. Make sure backend & ML service are running.");
    } finally {
      setLoading(false);
    }
  };

  const renderChildDetailsStep = () => (
    <>
      <h3 className="text-xl font-semibold text-sky-700 mb-4">
        Child Details
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Please fill in these details first. They help the model understand the
        context of your child&apos;s development.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Child Age (in years)
          </label>
          <input
            type="number"
            min="1"
            max="18"
            placeholder="Age"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-sky-300"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Gender
          </label>
          <select
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-sky-300"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Jaundice at Birth?
          </label>
          <select
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-sky-300"
            value={jaundice}
            onChange={(e) => setJaundice(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Family History of ASD?
          </label>
          <select
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-sky-300"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
          >
            <option value="">Select an option</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderQuestionStep = () => {
    const qIndex = currentStep - 1;
    const qText = questions[qIndex];

    return (
      <>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-sky-700">
            Question {currentStep} of 10
          </h3>
          <span className="text-xs font-medium text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
            ASD Behaviour Check
          </span>
        </div>

        <p className="text-gray-800 font-medium text-lg mb-4">{qText}</p>

        <div className="flex gap-6 pt-2 text-gray-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`q-${qIndex}`}
              checked={answers[qIndex] === 1}
              onChange={() => updateAnswer(qIndex, 1)}
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={`q-${qIndex}`}
              checked={answers[qIndex] === 0}
              onChange={() => updateAnswer(qIndex, 0)}
            />
            <span>No</span>
          </label>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50 py-10 px-4 flex justify-center">
      <div className="max-w-3xl w-full bg-white/95 backdrop-blur p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-sky-700 mb-2 text-center">
          ASD Screening Questionnaire
        </h2>
        <p className="text-center text-sm text-slate-600 mb-6">
          Please answer honestly based on your child&apos;s typical behaviour.{" "}
          <br />
          First fill the child details, then you will see one question at a
          time.
        </p>

        {/* Step content */}
        {currentStep === 0 ? renderChildDetailsStep() : renderQuestionStep()}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0 || loading}
            className="px-4 py-2 rounded-xl border border-sky-200 text-sky-700 text-sm font-medium hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < 10 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md disabled:opacity-60"
            >
              {currentStep === 0 ? "Start Questions" : "Next Question"}
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold shadow-md disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Get Prediction"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
