import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "Job Id is required",
        success: false,
      });
    }

    const jobs = await Job.findById(jobId);
    if (!jobs) {
      return res.status(404).json({
        message: "Job does not exist",
        success: false,
      });
    }

    //Check if the user has already applied or not
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(401).json({
        message: "You have Alreay applied for the job",
        success: false,
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    await jobs.applications.push(newApplication._id);
    await jobs.save();
    return res.status(201).json({
      message: "Applied successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        model: "Job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          model: "Company",
          options: { sort: { createdAt: -1 } },
        },
      });

    if (!application) {
      return res.status(404).json({
        message: "No job appliction found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Application found",
      success: true,
      application,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};

export const getApplicants = async (req, res) => {
  //for recruiter
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if(user.role !== "Recruiter"){
      return res.status(401).json({
        message : "Unauthorized request",
        success : false
      })
    }
    const id = req.params.id;
    const job = await Job.findById(id).populate({
      path: "applications",
      model: "Application",
      options: { sort: { createdAt: -1 } },
    });
    if(!job){
      return res.status(404).json({
        message : "No Job Applications found",
        success : false
      })
    }

    return res.status(200).json({
      message : "Job found",
      success : true,
      job
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
};


export const updateStatus = async (req,res) =>{
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    if(user.role !== "Recruiter"){
      return res.status(401).json({
        message : "Unauthorized request",
        success : false
      })
    }
    const {status} = req.body;
    const applicationId = req.params.id;
    if(!applicationId)  return res.status(400).json({message : "No Application ID", success : false});
    if(!status) return res.status(400).json({message : "No Status", success : false});

    const application = await Application.findOne({_id :applicationId} );
    if(!application){
      return res.status(404).json({
        message : "Invalid Application ID",
        success : false
      })
    }

    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message : "Status updated successfully",
      success : true
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message : "something went wrong",
      success : false
    })
  }
}