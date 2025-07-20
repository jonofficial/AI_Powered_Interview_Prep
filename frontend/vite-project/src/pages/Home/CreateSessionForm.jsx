import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast'; // ✅ import toast

function CreateSessionForm({ onSuccess }) {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    role: '',
    experience: '',
    topicsToFocus: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    const { role, experience, topicsToFocus, description } = formData;

    if (!role || !experience || !topicsToFocus) {
      setError('Missing required fields');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 1. Call AI API to generate questions
      const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
        role,
        experience,
        topicsToFocus,
        numberofQuestions: 10,
        description,
      });

      const generatedQuestions = aiResponse.data.questions || [];

      // 2. Create session with generated questions
      const sessionResponse = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role,
        experience,
        topicsToFocus,
        description,
        questions: generatedQuestions,
      });

      toast.success('Session created successfully ✅');

      // 3. Optional callback to refetch session list
      if (onSuccess) onSuccess();

      // 4. Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      toast.error('Something went wrong while creating the session ❌');
      setError("Something went wrong while creating the session.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>
        Start a New Interview Journey
      </h3>
      <p className='text-xs text-slate-700 mt-1 mb-3'>
        Fill out a few quick details and unlock your personalized set of Interview questions!
      </p>

      <form onSubmit={handleCreateSession} className='flex flex-col gap-3'>
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange('role', target.value)}
          label='Target Role'
          placeholder='e.g. Software Engineer'
          type='text'
        />
        <Input
          value={formData.experience}
          onChange={({ target }) => handleChange('experience', target.value)}
          label='Years of Experience'
          placeholder='e.g. 2, 5, 10'
          type='number'
        />
        <Input
          value={formData.topicsToFocus}
          onChange={({ target }) => handleChange('topicsToFocus', target.value)}
          label='Topics to Focus'
          placeholder='e.g. React, Node.js'
          type='text'
        />
        <Input
          value={formData.description}
          onChange={({ target }) => handleChange('description', target.value)}
          label='Session Description'
          placeholder='Tell us more about your goal'
          type='text'
        />
        {error && <p className='text-red-500 text-xs'>{error}</p>}

        <button type='submit' className='btn-primary w-full mt-2' disabled={isLoading}>
          {isLoading ? <SpinnerLoader /> : 'Create Session'}
        </button>
      </form>
    </div>
  );
}

export default CreateSessionForm;
