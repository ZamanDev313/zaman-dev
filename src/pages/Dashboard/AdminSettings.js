
import React, { useEffect, useState } from "react";
import {
    FiUser,
    FiGlobe,
    FiBell,
    FiShield,
    FiSave,
} from "react-icons/fi";
import { supabase } from "../../supabaseClient";

function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: "ZamanDev",
        siteUrl: "https://zaman-react-portfolio.vercel.app/",
        adminName: "Muhammad Zaman",
        adminEmail: "",
        emailNotifications: true,
        showPortfolioLink: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadSettings = async () => {
            setLoading(true);
            setError("");

            try {
                const { data, error: fetchError } = await supabase
                    .from("site_settings")
                    .select("*")
                    .eq("id", 1)
                    .single();

                if (fetchError) throw fetchError;
                if (!active) return;

                setSettings({
                    siteName: data.site_name,
                    siteUrl: data.site_url,
                    adminName: data.admin_name,
                    adminEmail: data.admin_email || "",
                    emailNotifications: data.email_notifications,
                    showPortfolioLink: data.show_portfolio_link,
                });
            } catch (err) {
                if (active) {
                    setError(
                        `Settings load nahi ho sakin: ${err.message}`
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadSettings();

        return () => {
            active = false;
        };
    }, []);

    const updateSetting = (event) => {
        const { name, value, type, checked } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));

        setSaved(false);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setSaved(false);
        setError("");

        try {
            const { error: updateError } = await supabase
                .from("site_settings")
                .update({
                    site_name: settings.siteName.trim(),
                    site_url: settings.siteUrl.trim(),
                    admin_name: settings.adminName.trim(),
                    admin_email: settings.adminEmail.trim(),
                    email_notifications: settings.emailNotifications,
                    show_portfolio_link: settings.showPortfolioLink,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", 1);

            if (updateError) throw updateError;

            setSaved(true);
        } catch (err) {
            setError(`Settings save nahi ho sakin: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="admin-settings">
                <p>Settings load ho rahi hain...</p>
            </section>
        );
    }

    return (
        <section className="admin-settings">
            <div className="admin-settings-heading">
                <div>
                    <span className="admin-page-eyebrow">PREFERENCES</span>
                    <h1>Settings</h1>
                    <p>
                        Manage your portfolio information and dashboard preferences.
                    </p>
                </div>
            </div>

            <form
                className="admin-settings-form"
                onSubmit={handleSubmit}
            >
                <div className="admin-settings-section">
                    <div className="admin-settings-section-heading">
                        <span><FiGlobe /></span>
                        <div>
                            <h2>Portfolio Settings</h2>
                            <p>Basic information about your public portfolio.</p>
                        </div>
                    </div>

                    <div className="admin-settings-fields">
                        <label>
                            Website Name
                            <input
                                name="siteName"
                                value={settings.siteName}
                                onChange={updateSetting}
                                required
                            />
                        </label>

                        <label>
                            Portfolio URL
                            <input
                                name="siteUrl"
                                type="url"
                                value={settings.siteUrl}
                                onChange={updateSetting}
                                required
                            />
                        </label>
                    </div>

                    <label className="admin-settings-toggle">
                        <span>
                            <strong>Show View Portfolio link</strong>
                            <small>
                                Dashboard sidebar mein portfolio link display
                                karne ki preference.
                            </small>
                        </span>
                        <input
                            type="checkbox"
                            name="showPortfolioLink"
                            checked={settings.showPortfolioLink}
                            onChange={updateSetting}
                        />
                    </label>
                </div>

                <div className="admin-settings-section">
                    <div className="admin-settings-section-heading">
                        <span><FiUser /></span>
                        <div>
                            <h2>Admin Profile</h2>
                            <p>Dashboard profile ki basic information.</p>
                        </div>
                    </div>

                    <div className="admin-settings-fields">
                        <label>
                            Admin Name
                            <input
                                name="adminName"
                                value={settings.adminName}
                                onChange={updateSetting}
                                required
                            />
                        </label>

                        <label>
                            Admin Email
                            <input
                                name="adminEmail"
                                type="email"
                                value={settings.adminEmail}
                                onChange={updateSetting}
                                placeholder="Enter your email address"
                            />
                        </label>
                    </div>
                </div>

                <div className="admin-settings-section">
                    <div className="admin-settings-section-heading">
                        <span><FiBell /></span>
                        <div>
                            <h2>Notifications</h2>
                            <p>Notification preference for future integration.</p>
                        </div>
                    </div>

                    <label className="admin-settings-toggle">
                        <span>
                            <strong>Email Notifications</strong>
                            <small>
                                Future mein new contact messages ke email
                                alerts ke liye.
                            </small>
                        </span>
                        <input
                            type="checkbox"
                            name="emailNotifications"
                            checked={settings.emailNotifications}
                            onChange={updateSetting}
                        />
                    </label>
                </div>

                <div className="admin-settings-section admin-settings-security">
                    <div className="admin-settings-section-heading">
                        <span><FiShield /></span>
                        <div>
                            <h2>Security</h2>
                            <p>Authentication and database access.</p>
                        </div>
                    </div>

                    <p className="admin-settings-security-note">
                        Supabase Authentication is enabled. Database access
                        is restricted through Row Level Security policies.
                        Admin route protection should also be verified.
                    </p>
                </div>

                <div className="admin-settings-footer">
                    {error && (
                        <p className="admin-settings-error" role="alert">
                            {error}
                        </p>
                    )}

                    {saved && (
                        <p className="admin-settings-success" role="status">
                            Settings successfully saved to the database.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="admin-settings-save"
                        disabled={saving}
                    >
                        <FiSave />
                        {saving ? "Saving..." : "Save Preferences"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default AdminSettings;
