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