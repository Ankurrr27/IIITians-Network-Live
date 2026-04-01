import Alumni from "../models/alumni.model.js";

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createAlumni = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      name: req.body.name?.trim(),
      email: req.body.email?.trim().toLowerCase(),
      iiit: req.body.iiit?.trim(),
      generation: req.body.generation?.trim(),
      branch: req.body.branch?.trim(),
      currentRole: req.body.currentRole?.trim(),
      currentCompany: req.body.currentCompany?.trim(),
      location: req.body.location?.trim() || "",
      linkedin: req.body.linkedin?.trim() || "",
      bio: req.body.bio?.trim() || "",
      graduationYear: Number(req.body.graduationYear),
    };

    const requiredFields = [
      "name",
      "email",
      "iiit",
      "generation",
      "branch",
      "currentRole",
      "currentCompany",
      "graduationYear",
    ];

    const missingField = requiredFields.find((field) => !payload[field]);
    if (missingField) {
      return res.status(400).json({
        message: `${missingField} is required`,
      });
    }

    const alumni = await Alumni.create(payload);
    res.status(201).json(alumni);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An alumni profile with this email already exists",
      });
    }

    res.status(400).json({ message: error.message });
  }
};

export const getAlumni = async (req, res) => {
  try {
    const { search = "", generation = "", iiit = "" } = req.query;
    const query = {};

    if (generation.trim()) {
      query.generation = new RegExp(`^${escapeRegex(generation.trim())}$`, "i");
    }

    if (iiit.trim()) {
      query.iiit = new RegExp(escapeRegex(iiit.trim()), "i");
    }

    if (search.trim()) {
      const regex = new RegExp(escapeRegex(search.trim()), "i");
      query.$or = [
        { name: regex },
        { iiit: regex },
        { branch: regex },
        { currentRole: regex },
        { currentCompany: regex },
        { location: regex },
      ];
    }

    const alumni = await Alumni.find(query)
      .sort({ graduationYear: -1, createdAt: -1 })
      .limit(200);

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alumni" });
  }
};
