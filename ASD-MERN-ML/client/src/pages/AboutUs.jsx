import React from 'react';

const AboutUs = () => {
  return (
    // Set page background to light indigo (bg-indigo-50) to match Home page
    // Set min-height to fill screen minus a 4rem (64px) sticky nav
    <div className="bg-indigo-50 py-12 px-4 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          About Us
        </h1>

        {/* Card */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <p className="text-gray-700 mb-4 text-lg">
            <span className="font-semibold text-blue-600">Neurolens</span> is a
            modern web-based platform designed to support{" "}
            <span className="font-semibold">
              early screening for Autism Spectrum Disorder (ASD)
            </span>{" "}
            and to guide families towards helpful resources. Our goal is to make
            early awareness and support more accessible, especially for parents
            who may be noticing early signs but are unsure about the next steps.
          </p>

          <p className="text-gray-700 mb-4 text-lg">
            The platform uses a short, structured questionnaire based on common
            developmental and behavioural indicators. Your responses are
            processed by{" "}
            <span className="font-semibold">
              machine learning models (Logistic Regression, Random Forest and
              XGBoost)
            </span>{" "}
            trained on anonymised ASD-related datasets. The system then provides
            an estimated{" "}
            <span className="font-semibold">likelihood score</span> that helps
            you understand whether there may be ASD-related traits that deserve
            further professional attention.
          </p>

          <p className="text-gray-700 mb-4 text-lg">
            Neurolens does not stop at just a score. It also offers:
          </p>

          <ul className="list-disc list-inside text-gray-700 mb-4 text-lg space-y-1">
            <li>
              A clear, easy-to-read{" "}
              <span className="font-semibold">result page</span> with
              interpretation.
            </li>
            <li>
              A downloadable{" "}
              <span className="font-semibold">PDF screening report</span> that
              you can share with doctors, psychologists or school counsellors.
            </li>
            <li>
              A <span className="font-semibold">Support section</span> listing
              NGO / low-cost doctors, special schools, ASD awareness videos and
              simple cognitive games.
            </li>
            <li>
              Child-friendly{" "}
              <span className="font-semibold">
                default games for focus, memory and pattern recognition
              </span>
              , to gently support skill development.
            </li>
          </ul>

          <p className="text-gray-700 mb-4 text-lg">
            We are especially focused on families who may not have easy access
            to specialists. By connecting users to{" "}
            <span className="font-semibold">
              NGO-based doctors, affordable special schools and free resources
            </span>
            , Neurolens aims to reduce the gap between concern and proper
            evaluation.
          </p>

          <p className="text-gray-700 mb-4 text-lg">
            <strong className="text-blue-600">Disclaimer:</strong> Neurolens is{" "}
            <span className="font-semibold">
              only a screening and educational tool
            </span>
            . It is <span className="font-semibold">not</span> a diagnostic
            system and cannot replace a clinical assessment. The result should
            be used as a starting point for discussion with a{" "}
            <span className="font-semibold">
              qualified healthcare professional
            </span>{" "}
            (pediatrician, psychologist, psychiatrist, or therapist).
          </p>

          <p className="text-gray-700 text-lg">
            If you have questions, feedback, or suggestions, you can reach us at{" "}
            <span className="font-semibold text-blue-600">
              admin@gmail.com
            </span>
            . We are continuously working to improve the platform and make it
            more helpful for children, families and educators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
