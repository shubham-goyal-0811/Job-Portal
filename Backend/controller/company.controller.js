import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName)
      return res.status(400).json({
        message: "company name is required",
        success: false,
      });
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "A Company with this name already exists",
        success: false,
      });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company registered succesfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id; //secured route
    if (!userId) {
      return res.status(400).json({
        message: "No User Found",
        success: false,
      });
    }
    const companies = await Company.find({ userId });
    if (!companies) {
      return res.status(404).json({
        message: "No Companies found from the user",
        success: false,
      });
    }

    return res.status(200).json({
      message: "company found",
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    if (!companyId) {
      return res.status(400).json({
        message: "Please enter a company ID",
        success: false,
      });
    }
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "No company found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "company found",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        message: "Please enter a company ID to be updated",
        success: false,
      });
    }
    const { name, description, website, location } = req.body;
    if(!name && !description && !website && !location){
        return res.status(400).json({
            message:"Please provide something to update",
            success : false
        })
    }
    const file = req.file;

    //to be handled later

    const updateData = { name, description, website, location };
    const company = await Company.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      res.status(400).json({
        message: "company not updated",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error occurred",
      success: false,
    });
  }
};
