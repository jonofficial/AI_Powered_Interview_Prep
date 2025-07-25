import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleAlert, LuList, LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import QuestionCard from '../../components/Cards/QuestionCard';
import AIResponsePreview from './components/AIResponsePreview';
import Drawer from '../../components/Drawer';
import SkeletonLoader from '../../components/Loader/SkeletonLoader';

function InterviewPrep() {
  const { sessionId } = useParams();
  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingLoader, setIsUpdatingLoader] = useState(false);

  const fetchSessionDetailsById = async () => {
    try{
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if(response.data && response.data.session){
        setSessionData(response.data.session);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const generateConceptExplanation = async (question) => {
    try{
      setErrorMsg('');
      setExplanation(null);

      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { 
          question, 
        }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (error) {
      setExplanation(null);
      setErrorMsg("Failed to generate explanation. Please try again later.");
      console.error("Error:",error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try{
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );

      console.log(response);
      if (response.data && response.data.question){
        // toast.success('Question pin status updated successfully');
        fetchSessionDetailsById();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const uploadMoreQuestions = async () => {
  try {
    setIsUpdatingLoader(true);

    const aiResponse = await axiosInstance.post(
      API_PATHS.AI.GENERATE_QUESTIONS,
      {
        role: sessionData?.role,
        experience: sessionData?.experience,
        topicsToFocus: sessionData?.topicsToFocus,
        numberofQuestions: 10,
      }
    );

    const generatedQuestions = aiResponse.data.questions; // 👈 FIX HERE

    console.log("Sending to backend:", {
      sessionId,
      questions: generatedQuestions,
    });

    const response = await axiosInstance.post(
      API_PATHS.QUESTION.ADD_TO_SESSION,
      {
        sessionId,
        questions: generatedQuestions,
      }
    );

    if (response.data) {
      toast.success("Added more Q&A!");
      fetchSessionDetailsById();
    }
  } catch (error) {
    console.error("Upload Error:", error?.response?.data || error.message);
    setError("Something went wrong. Please try again later.");
  } finally {
    setIsUpdatingLoader(false);
  }
};


  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }

    return () => {};
  }, []);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ''}
        experience={sessionData?.experience || '-'}
        topicsToFocus={sessionData?.topicsToFocus || ''}
        questions={sessionData?.questions?.length || '-'}
        description={sessionData?.description || ''}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format('MMM DD, YYYY')
            : ''
        }
        />

        <div className='container mx-auto pt-4 pb-4 px-4 md:px-0'>
          <h2 className='ml-10 text-lg font-semibold color-black'>Interview Q & A</h2>

          <div className='grid grid-cols-12 gap-4 mt-5 mb-10'>
            <div
            className={`col-span-12 ${
            openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
      }`}
      >
      <AnimatePresence>
  {sessionData?.questions?.map((data, index) => {
    return (
      <motion.div
        key={data._id || index}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.4,
          type: "spring",
          stiffness: 100,
          delay: index * 0.1,
          damping: 15,
        }}
        layout // This is the key prop that animates position changes
        layoutId={`question-${data._id || index}`} // Helps framer-motion track layout
      >
       <>
       <QuestionCard
          question={data?.question}
          answer={data?.answer}
          onLearnMore={() => 
            generateConceptExplanation(data.question)
          }
          isPinned={data?.isPinned}
          onTogglePinStatus={() => toggleQuestionPinStatus(data._id)}
        />
       
        {!isLoading &&
          sessionData?.questions?.length == index+1 && (
            <div className='flex items-center justify-center mt-5'>
              <button
              className='flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer'
              disabled={isLoading || isUpdatingLoader}
              onClick={uploadMoreQuestions}
              >
                {isUpdatingLoader ? (
                  <SpinnerLoader />
                ) : (
                  <LuListCollapse className='text-lg' />
                )}{' '}
                Load More
              </button>
            </div>
          )}
          </>
        </motion.div>
    );
  })}
</AnimatePresence>
          </div>
        </div>
        <Drawer
        isOpen={openLeanMoreDrawer}
        onClose={() => setOpenLeanMoreDrawer(false)}
        title={!isLoading && explanation?.title}
        >
          {errorMsg && (
            <p className='flex gap-2 text-sm text-amber-600 font-medium'>
              <LuCircleAlert className='' /> {errorMsg}
            </p>
            )}
            {isLoading && <SkeletonLoader />}
            {!isLoading && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
        </Drawer>
        </div>
    </DashboardLayout>
  )
}

export default InterviewPrep