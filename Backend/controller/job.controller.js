import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
export const postJob = async (req, res) => {
  try {
    const userId = req.id;
    console.log(req.body);
    const {
      title,
      description,
      requirements,
      salary,
      experienceLevel,
      location,
      jobType,
      position,
      company,
    } = req.body;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      experienceLevel === undefined ||
      experienceLevel === null ||
      !location ||
      !jobType ||
      !position ||
      !company
    ) {
      return res.status(400).json({
        message: "All fields are necessary",
        success: false,
      });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      experienceLevel: Number(experienceLevel),
      location,
      jobType,
      position,
      company,
      createdBy: userId,
    });

    return res.status(201).json({
      message: "New Job created successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while posting the job",
      success: false,
    });
  }
};
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        {
          description: { $regex: keyword, $options: "i" },
        },
      ],
    };
    // const jobs = await Job.find(query).sort({createdAt : -1});
    //     const jobs = await Job.find(query)
    //   .populate({ path: 'company', model: 'Company' })  // Explicitly mention the model
    //   .sort({ createdAt: -1 });

    const jobs = await Job.find(query)
      .populate({ path: "company" })
      .populate({ path: "createdBy", model: "User" })
      .sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs Not Found",
        success: true,
      });
    }
    return res.status(200).json({
      message: " Jobs with given keyword found",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while fetching the jobs",
      success: false,
    });
  }
};
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId) {
      return res.status(400).json({
        message: "No Job ID provided",
        success: false,
      });
    }
    const job = await Job.findById(jobId)
      .populate({ path: "company" })
      .populate({ path: "createdBy", model: "User" })
      .sort({ createdAt: -1 });
    if (!job) {
      return res.status(404).json({
        message: "NO Jobs Found with the provided ID",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Job found successfully",
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while fetching the jobs",
      success: false,
    });
  }
};
export const getJobsbyAdmin = async (req, res) => {
  try {
    const userId = req.id;
    const jobs = await Job.find({ createdBy: userId })
      .populate({ path: "company" })
      .populate({ path: "createdBy", model: "User" })
      .sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "No Jobs found that are added by the admin",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Jobs found by the admin",
      success: true,
      jobs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while fetching the jobs",
      success: false,
    });
  }
};
