const ForumPost = require('./ForumPost');
const sanitizeHtml = require('sanitize-html');

const getPosts = async (req, res) => {
    try {
        const posts = await ForumPost.find({ course_id: req.params.courseId })
            .populate('user_id', 'name role')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    const { course_id, content, parent_post_id } = req.body;
    try {
        const sanitizedContent = sanitizeHtml(content, {
            allowedTags: [],
            allowedAttributes: {},
        });

        const post = await ForumPost.create({
            course_id,
            user_id: req.user.id,
            content: sanitizedContent,
            parent_post_id
        });
        const populatedPost = await ForumPost.findById(post._id).populate('user_id', 'name role');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPosts, createPost };
