import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js'
import { getAllJobs, getJobById, getJobsbyAdmin, postJob } from '../controller/job.controller.js';

const router = express.Router();

router.route('/post').post(isAuthenticated,postJob);
router.route('/get').get(isAuthenticated,getAllJobs);
router.route('/getadminjobs').get(isAuthenticated,getJobsbyAdmin);
router.route('/get/:id').get(isAuthenticated,getJobById);

export default router;