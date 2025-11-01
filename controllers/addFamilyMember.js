import Family from "../models/familyMember.js";
import User from "../models/userSchema.js";

export const addFamilyMember = async (req, res) => {
  try {
    console.log("hit");
    const { name, relation, gender, age } = req.body;
    const result = await Family.create({
      name,
      relation,
      gender,
      age,
      userId: req.user.id,
    });
    const user = await User.findById(req.user.id);
    user.familyMembers.push(result._id);
    user.save();
    return res
      .status(200)
      .json({ data: result, message: "Family member added", status: true });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .json({ data: null, message: error.message, status: false });
  }
};

export const getFamilyMember = async (req, res) => {
  try {
    console.log("hit");
    const result = await Family.find({ userId: req.user.id });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.log("error", error);
    return res.json({ error });
  }
};
