import Club from "../models/Club.model.js";

export const createClub = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Club logo is required" });
    }

    const club = await Club.create({
      ...req.body,
      logo: req.file.path,
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate("collegeId", "name")
      .populate("leads", "name email");

    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate("collegeId", "name")
      .populate("leads", "name email");

    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
