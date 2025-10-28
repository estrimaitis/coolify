'use client';

import { useState } from 'react';

interface SurveyData {
  experience: string;
  features: string;
  feedback: string;
}

export default function Home() {
  const [formData, setFormData] = useState<SurveyData>({
    experience: '',
    features: '',
    feedback: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit survey. Please check if the server is running.');
      console.error('Survey submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      experience: '',
      features: '',
      feedback: '',
    });
  };

  if (submitted) {
    return (
      <div className="container">
        <div className="success-message">
          <h2>Thank You!</h2>
          <p>Your survey response has been submitted successfully.</p>
          <button className="button" onClick={handleReset}>
            Submit Another Response
          </button>
        </div>
        <div className="results">
          <h2>Your Responses:</h2>
          <div className="result-item">
            <div className="result-question">How would you rate your experience?</div>
            <div className="result-answer">{formData.experience}</div>
          </div>
          <div className="result-item">
            <div className="result-question">Which features do you find most valuable?</div>
            <div className="result-answer">{formData.features}</div>
          </div>
          <div className="result-item">
            <div className="result-question">Additional feedback:</div>
            <div className="result-answer">{formData.feedback || 'No additional feedback provided'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Survey App</h1>
        <p>Help us improve by answering a few questions</p>
      </div>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="question">
          <label className="question-label">
            1. How would you rate your experience?
          </label>
          <div className="options">
            {['Excellent', 'Good', 'Average', 'Poor'].map((option) => (
              <div key={option} className="option">
                <input
                  type="radio"
                  id={`experience-${option}`}
                  name="experience"
                  value={option}
                  checked={formData.experience === option}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  required
                />
                <label htmlFor={`experience-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="question">
          <label className="question-label">
            2. Which features do you find most valuable?
          </label>
          <div className="options">
            {['Easy Deployment', 'Good Documentation', 'Performance', 'Support'].map(
              (option) => (
                <div key={option} className="option">
                  <input
                    type="radio"
                    id={`features-${option}`}
                    name="features"
                    value={option}
                    checked={formData.features === option}
                    onChange={(e) =>
                      setFormData({ ...formData, features: e.target.value })
                    }
                    required
                  />
                  <label htmlFor={`features-${option}`}>{option}</label>
                </div>
              )
            )}
          </div>
        </div>

        <div className="question">
          <label className="question-label" htmlFor="feedback">
            3. Any additional feedback? (Optional)
          </label>
          <textarea
            id="feedback"
            className="textarea"
            value={formData.feedback}
            onChange={(e) =>
              setFormData({ ...formData, feedback: e.target.value })
            }
            placeholder="Share your thoughts..."
          />
        </div>

        <button type="submit" className="button" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Survey'}
        </button>
      </form>
    </div>
  );
}

