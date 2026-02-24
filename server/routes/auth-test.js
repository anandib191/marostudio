/**
 * TEST MODE AUTH ROUTES
 * - Any email: OTP is always 123456, no real email sent, no DB needed.
 * - Owner/magic email: Auto-login instantly, no OTP needed, admin + pro plan.
 * Disable TEST_MODE in .env before production.
 */

import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

const router = express.Router();

// In-memory stores (reset on server restart)
const otpStore = new Map();
const userStore = new Map();

const TEST_OTP = "123456";
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Owner bypass email (secured via env, has fallback for dev)
const MAGIC_EMAIL = (process.env.MAGIC_EMAIL || "balarj8901@gmail.com").toLowerCase();

function getOrCreateUser(email, role = "user", name = "", plan = null) {
    if (!userStore.has(email)) {
        userStore.set(email, {
            email, name, role, isVerified: true,
            totalCredits: plan === "pro" ? 99999 : 100,
            subscriptionPlan: plan,
        });
    }
    return userStore.get(email);
}

function makeToken(user) {
    return jwt.sign(
        { id: user.email, email: user.email, role: user.role },
        process.env.JWT_SECRET || "test-secret",
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );
}

/**
 * POST /api/auth/send-otp (TEST MODE)
 * Magic email -> instant JWT auto-login response
 * All other emails -> OTP = 123456
 */
router.post(
    "/send-otp",
    [body("email").isEmail().normalizeEmail()],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const { email, is_admin, is_signup, name, phoneNumber } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // MAGIC EMAIL: instant auto-login, no OTP step needed
        if (normalizedEmail === MAGIC_EMAIL) {
            const user = getOrCreateUser(MAGIC_EMAIL, "admin", "Owner", "pro");
            const token = makeToken(user);
            logger.info(`AUTO-LOGIN: ${MAGIC_EMAIL}`);
            return res.status(200).json({
                success: true,
                autoLogin: true,
                access_token: token,
                token_type: "bearer",
                role: "admin",
                email: MAGIC_EMAIL,
                message: "Auto-login successful",
                user: {
                    email: MAGIC_EMAIL,
                    name: "Owner",
                    role: "admin",
                    subscriptionPlan: "pro",
                    totalCredits: 99999,
                },
            });
        }

        // All other emails: standard test OTP
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
        const isAdmin = is_admin && adminEmails.includes(normalizedEmail);

        otpStore.set(normalizedEmail, {
            otp: TEST_OTP,
            isAdmin,
            isSignup: !!is_signup,
            signupData: is_signup ? { name: name?.trim(), phoneNumber: phoneNumber?.trim() } : null,
            expiresAt: new Date(Date.now() + OTP_TTL_MS),
        });

        logger.info(`TEST MODE OTP for ${normalizedEmail}: ${TEST_OTP}`);

        return res.status(200).json({
            success: true,
            message: `OTP sent. Use code: ${TEST_OTP}`,
            testOtp: TEST_OTP,
        });
    }
);

/**
 * POST /api/auth/verify-otp (TEST MODE)
 * Magic email: always succeeds. Others: OTP must be 123456.
 */
router.post(
    "/verify-otp",
    [
        body("email").isEmail().normalizeEmail(),
        body("otp").isLength({ min: 6, max: 6 }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: "Validation error" });
        }

        const { email, otp } = req.body;
        const normalizedEmail = email.toLowerCase().trim();

        // Magic email: always passes
        if (normalizedEmail === MAGIC_EMAIL) {
            const user = getOrCreateUser(MAGIC_EMAIL, "admin", "Owner", "pro");
            const token = makeToken(user);
            return res.status(200).json({
                success: true,
                access_token: token,
                token_type: "bearer",
                role: "admin",
                email: MAGIC_EMAIL,
                user: { email: MAGIC_EMAIL, name: "Owner", role: "admin" },
            });
        }

        const record = otpStore.get(normalizedEmail);
        if (!record) {
            return res.status(400).json({ success: false, message: "OTP not found. Click Send OTP first." });
        }
        if (new Date() > record.expiresAt) {
            otpStore.delete(normalizedEmail);
            return res.status(400).json({ success: false, message: "OTP expired. Request a new one." });
        }
        if (otp !== TEST_OTP) {
            return res.status(400).json({ success: false, message: `Invalid OTP. Hint: ${TEST_OTP}` });
        }

        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim().toLowerCase()) || [];
        const role = record.isAdmin || adminEmails.includes(normalizedEmail) ? "admin" : "user";
        const user = getOrCreateUser(normalizedEmail, role, record.signupData?.name || "");
        const token = makeToken(user);
        otpStore.delete(normalizedEmail);

        logger.info(`TEST LOGIN: ${normalizedEmail} (${role})`);

        return res.status(200).json({
            success: true,
            access_token: token,
            token_type: "bearer",
            role: user.role,
            email: user.email,
            user: { email: user.email, name: user.name, role: user.role },
        });
    }
);

/**
 * POST /api/auth/google (TEST MODE) — not supported
 */
router.post("/google", [body("credential").notEmpty()], (_req, res) => {
    return res.status(400).json({
        success: false,
        message: "Google login not available in test mode. Use OTP login (code: 123456).",
    });
});

export default router;
