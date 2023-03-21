const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        res.status(500).json(err);
      }
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    res.status(200).json("User has been updated");
  } else {
    return res.status(403).json("You can only update your account");
  }
});
// Delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can only delete your account");
  }
});
// Get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    !user && res.status(404).json("User not found");
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        return res.status(200).json("User has been followed");
      } else {
        return res.status(403).json("You already follow this user");
      }
    } catch (err) {}
  } else {
    return res.status(403).json("You can't follow yourself");
  }
});
// Unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        return res.status(200).json("User has been unfollowed");
      } else {
        return res.status(403).json("You already unfollow this user");
      }
    } catch (err) {}
  } else {
    return res.status(403).json("You can't unfollow yourself");
  }
});

module.exports = router;
