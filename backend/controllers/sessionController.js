const Session = require('../models/Session');
const Question = require('../models/Question');


exports.createSession = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, description } = req.body;
    const userId = req.user._id;

    const session = new Session({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      req.body.questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionDocs;
    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({
      message: "Error creating session",
      error: error.message,
    });
  }
};


exports.getMySessions = async (req, res) => {
    try{
        const sessions = await Session.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate("questions")
        res.status(200).json(sessions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

exports.getSessionById = async (req, res) => {
    try{
    const session = await Session.findById(req.params.id)
        .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1 } }
        })
        .exec();
    if (!session) {
        return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({ success: true, session });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};

exports.deleteSession = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // check if the logged-in user owns this session
        if(session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to delete this session' });
        }

        // first delete all questions associated with this session
        await Question.deleteMany({ session: session._id });

        // then delete the session itself
        await session.deleteOne();

        res.status(200).json({ message: 'Session deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating session', error: error.message });
    }
};