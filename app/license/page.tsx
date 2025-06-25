// For Next.js App Router (Next.js 13+)

import React from 'react';

const LicensePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-600">ClipHub License</h1>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-gray-800">✅ Free to Use</h2>
          <p className="text-gray-700 mt-2">
            All images, videos, and audio clips on ClipHub are free to download and use for both personal and commercial purposes.
            No permission is needed, though attribution is appreciated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800">❌ Restrictions</h2>
          <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
            <li>Do not sell unaltered copies of content (e.g., as-is without adding value).</li>
            <li>Do not imply ClipHub’s endorsement.</li>
            <li>Do not redistribute content on other free or paid platforms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800">📌 Attribution</h2>
          <p className="text-gray-700 mt-2">
            Giving credit to creators is not mandatory, but it's always appreciated.
            If you want to credit, you can write: <br />
            <code className="bg-gray-100 px-2 py-1 rounded">Photo by Creator Name on ClipHub</code>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800">📬 Contact</h2>
          <p className="text-gray-700 mt-2">
            For license questions or copyright issues, please contact us at <a href="mailto:pfaizkhan95@gmail.com" className="text-blue-600 underline">pfaizkhan95@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LicensePage;
