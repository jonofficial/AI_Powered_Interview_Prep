import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import UploadImage from '../../utils/uploadImage';

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if(!fullName){
      setError('Please enter your full name.');
      return;
    }

    if(!validateEmail(email)){
      setError('Please enter a valid email address.');
      return;
    }

    if(!password){
      setError('Please enter a password.');
      return;
    }

    setError('');

    // SignUp API call
     try {

      if (profilePic) {
        const imgUploadRes = await UploadImage(profilePic);
        profileImageUrl = imgUploadRes.data.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token } = response.data;
      if(token){
        localStorage.setItem('token', token);
        updateUser(response.data);
        navigate('/dashboard');
      }

      // console.log('Logging in with', email, password);
      // navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }

    // TODO: Add signup validation and API logic
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    try {
      // Simulate signup logic
      console.log('Signing up with:', {
        fullName,
        email,
        password,
        profilePic,
      });

      navigate('/dashboard');
    } catch (err) {
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create an Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Join us today by entering your details below.
      </p>
      <form onSubmit={handleSignUp}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-4'>
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)}
            label='Full Name'
            placeholder='John Doe'
            type='text'
          />
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label='Email Address'
            placeholder='john@example.com'
            type='text'
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label='Password'
            placeholder='Minimum 8 characters'
            type='password'
          />
        </div>

        {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}

        <button type='submit' className='btn-primary mt-4'>
          SIGN UP
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Already have an account?{' '}
          <button
            className='font-medium text-primary underline cursor-pointer'
            type='button'
            onClick={() => setCurrentPage('login')}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
