import College from "../models/College.model.js";
import cloudinary from "../config/cloudinary.js";

export const createCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollege = async (req, res) => {
  try {
    if (req.body.name) {
      return res.status(400).json({
        message: "College name cannot be updated",
      });
    }

    const allowedFields = ["description", "website"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCollegeLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Logo file is required" });
    }

    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (college.logo?.public_id) {
      await cloudinary.uploader.destroy(college.logo.public_id);
    }

    college.logo = {
      public_id: req.file.filename,
      url: req.file.path,
    };

    await college.save();

    res.status(200).json({
      message: "College logo updated successfully",
      logo: college.logo,
    });
  } catch (error) {
    console.error("updateCollegeLogo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addCollegeGallery = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

    const images = req.files.map((file) => ({
      public_id: file.filename,
      url: file.path,
    }));

    const college = await College.findByIdAndUpdate(
      req.params.id,
      { $push: { gallery: { $each: images } } },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    console.error("addCollegeGallery error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getCollegeLogo = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (!college.logo || !college.logo.url) {
      return res.status(404).json({ message: "Logo not available" });
    }

    return res.redirect(college.logo.url);
  } catch (error) {
    console.error("getCollegeLogo error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
