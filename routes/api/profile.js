import express from "express";
// import bodyParser from "body-parser";
import ProfileModel from "../../models/Profile.js";
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Profile route')});

router.get('/:email', async(req, res) => {
    try{
        let profile = await ProfileModel.findOne({ email : req.params.email});

        if (!profile) {
            return res.status(400).json({errors: [{msg: 'Profile not found'}]});
        }
        
        res.json(profile);
        
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }});

router.post('/', async(req, res) => {
    try{
        let newProfile = await ProfileModel.findOne({ email : req.body.email });

        if (newProfile) {
            return res.status(400).json({errors: [{msg: 'User already exists'}]});
        }
        newProfile = req.body;
        const profiles = new ProfileModel(newProfile);
        await profiles.save();
        res.send('Profile created');
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
router.put('/:email', async (req, res) => {
  try {
    const {email} = req.params;
    const updatedData = req.body;

    // Update the document in MongoDB
    const result = await ProfileModel.findOneAndUpdate({"email":email}, updatedData, { new: true });
    if (!result) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ message: 'Document updated successfully', updatedData: result });
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Api for following a user
router.put('/:email/follow', async (req, res) => {
    try {
        const followerEmail = req.body.followerEmail;
        const followerName = req.body.followerName;
        const followingEmail = req.body.followingEmail;
        const followingName = req.body.followingName;


        const followerExists = await ProfileModel.exists({
            email: followingEmail,
            'followers.email': followerEmail
          });
      
          // Check if the user being followed is already followed by the follower
          const followingExists = await ProfileModel.exists({
            email: followerEmail,
            'following.email': followingEmail
          });

        // Update the follower's following list
        if(!followerExists){
            const followResult = await ProfileModel.findOneAndUpdate(
                { email: followerEmail },
                { $addToSet: { following: { name: followingName, email: followingEmail } } },
            );
            if (!followResult) {
                return res.status(404).json({ error: 'Unable to add user to following list' });
            }
            // Update the following user's followers list
            await ProfileModel.findOneAndUpdate(
                { email: followingEmail },
                { $addToSet: { followers: { name: followerName, email: followerEmail } } }
            );
        }
        

        res.json({ message: 'Followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:email/unfollow', async (req, res) => {
    try {
        const followerEmail = req.body.followerEmail;
        const followerName = req.body.followerName;
        const followingEmail = req.body.followingEmail;
        const followingName = req.body.followingName;
        // Update the follower's following list
        const followResult = await ProfileModel.findOneAndUpdate(
            { email: followerEmail },
            { $pull: { following: { name: followingName, email: followingEmail } } },
        );
        if (!followResult) {
            return res.status(404).json({ error: 'Unable to remove user to following list' });
        }
        // Update the following user's followers list
        await ProfileModel.findOneAndUpdate(
            { email: followingEmail },
            { $pull: { followers: { name: followerName, email: followerEmail } } }
        );

        res.json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/:email', async(req, res) => {
    try{
        const profile = await ProfileModel.findOneAndDelete({email: req.params.email});
        if(!profile){
            return res.status(404).json({msg: 'Profile not found'});
        }
        res.json({msg: 'Profile removed'});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router;