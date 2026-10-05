// client/src/pages/Result.jsx
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);

  const result = JSON.parse(localStorage.getItem("lastResult") || "{}");
  const saved = JSON.parse(localStorage.getItem("lastAnswers") || "null");
  const payloadSaved = JSON.parse(localStorage.getItem("lastPayload") || "null");

  if (!result || result.combined_score == null) {
    return <div className="text-center py-20">No results found.</div>;
  }

  const QUESTIONS = [
    "When you call your child's name, do they look at you?",
    "Is it difficult for your child to maintain eye contact with you?",
    "Does your child point to indicate that they want something?",
    "Does your child point to share interest with you?",
    "Does your child pretend play? (e.g. talking on toy phone, caring for toys)",
    "Is your child interested in what you're looking at?",
    "Does your child show signs of comforting someone who is upset?",
    "Would you describe your child's first word as meaningful?",
    "Does your child use simple gestures? (e.g. waving, nodding)",
    "Does your child stare blankly at nothing?",
  ];

  const scoreFloat = parseFloat((result.combined_score || 0).toFixed(2));
  const percentage = Math.round(scoreFloat * 100);

  useEffect(() => {
    let start = 0;
    const raf = () => {
      start += 1;
      if (start <= percentage) {
        setProgress(start);
        requestAnimationFrame(raf);
      }
    };
    requestAnimationFrame(raf);
  }, []);

  const getColorHex = () => {
    if (percentage < 40) return { r: 34, g: 197, b: 94 };
    if (percentage < 70) return { r: 234, g: 179, b: 8 };
    return { r: 239, g: 68, b: 68 };
  };

  const getRiskLabel = () => {
    if (percentage < 40) return "Low likelihood";
    if (percentage < 70) return "Borderline / Moderate";
    return "Higher likelihood";
  };

  const getMeaningShort = () => {
    if (percentage < 40) return "Next step: Routine monitoring.";
    if (percentage < 70)
      return "Next step: Observe more closely and consider professional advice.";
    return "Next step: Seek a full professional evaluation.";
  };

  const buildQnA = () => {
    if (saved && Array.isArray(saved.questions) && Array.isArray(saved.answers)) {
      return { questions: saved.questions, answers: saved.answers };
    }

    if (payloadSaved) {
      const answersFromPayload = [];
      for (let i = 1; i <= 10; i++) {
        const k = `A${i}`;
        if (payloadSaved.hasOwnProperty(k)) {
          const v = payloadSaved[k];
          answersFromPayload.push(
            v === 1 || v === "1" ? "Yes" : v === 0 || v === "0" ? "No" : "N/A"
          );
        } else {
          answersFromPayload.push("N/A");
        }
      }
      return { questions: QUESTIONS, answers: answersFromPayload };
    }

    const answersFromResult = [];
    let hasAny = false;
    for (let i = 1; i <= 10; i++) {
      const k = `A${i}`;
      if (result.hasOwnProperty(k)) {
        hasAny = true;
        const v = result[k];
        answersFromResult.push(
          v === 1 || v === "1" || Number(v) > 0.5 ? "Yes" : "No"
        );
      } else {
        answersFromResult.push("N/A");
      }
    }

    if (hasAny) return { questions: QUESTIONS, answers: answersFromResult };
    return { questions: QUESTIONS, answers: Array(10).fill("N/A") };
  };

  const { questions: qList, answers: aList } = buildQnA();
  const yesCount = aList.filter((a) => a === "Yes").length;

  const downloadPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const left = 16;
      const pageWidth = doc.internal.pageSize.getWidth();
      const usableWidth = pageWidth - left * 2;
      let y = 16;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Neurolens — Screening Report", left, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const time = saved?.timestamp || new Date().toISOString();
      doc.text(`Date: ${new Date(time).toLocaleString()}`, left, y);
      y += 8;

      if (saved) {
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("User Details", left, y);
        y += 6;

        const details = [
          `Age: ${saved?.age ?? "N/A"}`,
          `Gender: ${
            saved?.gender === 1 ? "Male" : saved?.gender === 0 ? "Female" : "N/A"
          }`,
          `Jaundice at birth: ${
            saved?.jaundice === 1
              ? "Yes"
              : saved?.jaundice === 0
              ? "No"
              : "N/A"
          }`,
          `Family history of ASD: ${
            saved?.family_history === 1
              ? "Yes"
              : saved?.family_history === 0
              ? "No"
              : "N/A"
          }`,
        ];

        doc.setFontSize(10);
        details.forEach((ln) => {
          doc.text(ln, left, y);
          y += 6;
        });
        y += 4;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("ASD Likelihood:", left, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${percentage}%`, left + 45, y);
      y += 6;

      const barWidth = usableWidth;
      const barHeight = 8;
      const c = getColorHex();

      doc.setDrawColor(200);
      doc.rect(left, y, barWidth, barHeight, "S");

      const fillWidth = (barWidth * percentage) / 100;
      doc.setFillColor(c.r, c.g, c.b);
      doc.rect(left, y, fillWidth, barHeight, "F");

      y += barHeight + 10;

      doc.setFont("helvetica", "bold");
      doc.text("Next step:", left, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      const next = doc.splitTextToSize(getMeaningShort(), usableWidth);
      next.forEach((t) => {
        doc.text(t, left, y);
        y += 6;
      });

      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Questions & Answers", left, y);
      y += 8;

      doc.setFont("helvetica", "normal");
      for (let i = 0; i < qList.length; i++) {
        const q = doc.splitTextToSize(`${i + 1}. ${qList[i]}`, usableWidth);
        q.forEach((line) => {
          doc.text(line, left, y);
          y += 6;
        });

        doc.text(`Answer: ${aList[i]}`, left, y);
        y += 8;

        if (y > 270) {
          doc.addPage();
          y = 16;
        }
      }

      doc.save(`neurolens_result_${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    }
    setExporting(false);
  };

  const c = getColorHex();
  const riskLabel = getRiskLabel();

  const gradientLegend = [
    { label: "0–39% Low", color: "bg-emerald-500" },
    { label: "40–69% Moderate", color: "bg-amber-400" },
    { label: "70–100% Higher", color: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50 pb-20">
      <div className="w-full max-w-4xl px-4">
        <div className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-xl border border-sky-100">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-sky-700">Screening Result</h2>
              <p className="mt-1 text-sm text-gray-600">
                Based on your answers, here is the estimated likelihood of autism-related traits.
              </p>
            </div>

            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold border"
              style={{
                borderColor: `rgba(${c.r}, ${c.g}, ${c.b}, 0.4)`,
                backgroundColor: `rgba(${c.r}, ${c.g}, ${c.b}, 0.06)`,
                color: `rgb(${c.r}, ${c.g}, ${c.b})`,
              }}
            >
              <span className="text-lg">●</span>
              <span>{riskLabel}</span>
            </div>
          </div>

          {/* Score section */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-gray-800 mb-2">
                Overall ASD likelihood
              </p>

              <div className="flex items-end justify-between mb-1">
                <span className="text-4xl font-extrabold text-sky-700">
                  {progress}%
                </span>
              </div>

              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: `rgb(${c.r}, ${c.g}, ${c.b})`,
                  }}
                />
              </div>

              {/* Legend */}
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700">How to read this score</p>
                <div className="flex flex-wrap gap-2 text-[11px] mt-1">
                  {gradientLegend.map((item) => (
                    <div
                      key={item.label}
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meaning */}
              <div className="mt-4 rounded-xl bg-sky-50 border border-sky-100 px-4 py-3 text-xs text-gray-700">
                <p className="font-semibold text-sky-700 mb-1">What this result suggests</p>
                <p>{getMeaningShort()}</p>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-sm font-semibold text-gray-800 mb-1">Quick summary</p>
                <p className="text-sm text-gray-700">
                  You answered <strong>{yesCount} “Yes”</strong> and{" "}
                  <strong>{10 - yesCount} “No”</strong> across the 10 screening questions.
                </p>
                <p className="mt-2 text-xs text-gray-600">
                  This score is only a screening indication — not a diagnosis.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm">
                <p className="font-semibold text-gray-800 mb-2">Basic questionnaire details</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-slate-500">Screening date:</span>
                  <span className="text-slate-800">
                    {new Date(saved?.timestamp || new Date()).toLocaleString()}
                  </span>

                  <span className="text-slate-500">Age group:</span>
                  <span className="text-slate-800">{saved?.age ?? "Not specified"}</span>

                  <span className="text-slate-500">Gender:</span>
                  <span className="text-slate-800">
                    {saved?.gender === 1
                      ? "Male"
                      : saved?.gender === 0
                      ? "Female"
                      : "Not specified"}
                  </span>

                  <span className="text-slate-500">Jaundice at birth:</span>
                  <span className="text-slate-800">
                    {saved?.jaundice === 1
                      ? "Yes"
                      : saved?.jaundice === 0
                      ? "No"
                      : "Not specified"}
                  </span>

                  <span className="text-slate-500">Family history of ASD:</span>
                  <span className="text-slate-800">
                    {saved?.family_history === 1
                      ? "Yes"
                      : saved?.family_history === 0
                      ? "No"
                      : "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="mt-6 rounded-xl bg-teal-50 border border-teal-100 p-4 text-xs md:text-sm">
            <p className="font-semibold text-teal-700 mb-2">Suggested next steps</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Write down specific behaviours with real examples.</li>
              <li>
                Share this result and the PDF with a{" "}
                <strong>pediatrician or child psychologist</strong>.
              </li>
              <li>
                Discuss concerns with{" "}
                <strong>teachers or school counsellors</strong> if applicable.
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="mt-5 text-[11px] text-gray-600 italic rounded-xl bg-red-50/60 border border-red-100 px-4 py-3">
            <strong>Important:</strong> This screening is not a medical diagnosis. For
            any concerns, consult a qualified healthcare professional.
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {/* PDF Button Restored */}
          <button
            onClick={downloadPDF}
            disabled={exporting}
            className="bg-sky-600 hover:bg-sky-700 text-white py-2 px-5 rounded-lg font-semibold transition disabled:opacity-60"
          >
            {exporting ? "Generating PDF..." : "Download PDF"}
          </button>

          <button
            onClick={() => navigate("/support")}
            className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-5 rounded-lg font-semibold transition"
          >
            View Support & Resources
          </button>

          <button
            onClick={() => navigate("/questionnaire")}
            className="bg-white border border-sky-200 text-sky-700 py-2 px-5 rounded-lg font-semibold hover:bg-sky-50 transition"
          >
            Re-take Questionnaire
          </button>
        </div>
      </div>
    </div>
  );
}
