import React, { useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { AnimatePresence, motion } from 'framer-motion';
import { LuCircleAlert, LuListCollapse } from 'react-icons/lu';
import SpinnerLoader from '../../components/Loader/SpinnerLoader';
import { toast } from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import RoleInfoHeader from './components/RoleInfoHeader';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import QuestionCard from '../../components/Cards/QuestionCard';

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

  const generateConceptExplanation = async (question) => {};

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

  const uploadMoreQuestions = async () => {};

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
          onLearnMore={() => {
            generateConceptExplanation(data.question);
          }}
          isPinned={data?.isPinned}
          onTogglePinStatus={() => toggleQuestionPinStatus(data._id)}
        />
        </>
        </motion.div>
    );
  })}
</AnimatePresence>
          </div>
        </div>
        </div>
    </DashboardLayout>
  )
}

export default InterviewPrep