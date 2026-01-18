import express from "express";
import { getUserById, updateUser } from "../services/user.service.js";
const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// PATCH /users/:id - Cập nhật thông tin user
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedUser = await updateUser(id, updateData);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;