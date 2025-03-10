import User from "../models/User.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.user?.id; // Fetch userId from req.user

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID missing" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            },
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};