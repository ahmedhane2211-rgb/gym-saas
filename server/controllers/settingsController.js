import { pool } from "../models/db.js";
import { deleteFromCloudinary } from "../middlewares/multerConfig.js";

// Get gym settings
const getSettings = async (req, res) => {
    const { gymId } = req.user;

    if (!gymId) {
        return res.status(400).json({ message: "معرف الجيم مفقود", status: false });
    }

    try {
        const result = await pool.query(
            "SELECT * FROM gym_settings WHERE gym_id = $1",
            [gymId]
        );

        if (result.rows.length === 0) {
            // جلب بيانات الجيم الأساسية لاستخدامها كقيم افتراضية
            const gymInfo = await pool.query("SELECT name, phone, logo FROM gym WHERE id = $1", [gymId]);
            const gym = gymInfo.rows[0];

            return res.status(200).json({
                data: {
                    company_name: gym?.name || "",
                    company_email: "",
                    company_phone: gym?.phone || "",
                    whatsapp: "",
                    website: "",
                    tax_number: "",
                    commercial_registry: "",
                    bank_account: "",
                    address: "",
                    show_name_in_header: false,
                    show_address_in_header: false,
                    show_logo_in_header: false,
                    show_tax_in_footer: false,
                    show_whatsapp_in_footer: false,
                    show_phone_in_footer: false,
                    show_email_in_footer: false,
                    show_website_in_footer: false,
                    show_stamp_in_footer: false,
                    logo: gym?.logo || null,
                    stamp: null
                },
                status: true
            });
        }

        return res.status(200).json({
            data: result.rows[0],
            status: true
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

// Update gym settings
const updateSettings = async (req, res) => {
    const { gymId } = req.user;
    const {
        company_name,
        company_email,
        company_phone,
        whatsapp,
        website,
        tax_number,
        commercial_registry,
        bank_account,
        address,
        show_name_in_header,
        show_address_in_header,
        show_logo_in_header,
        show_tax_in_footer,
        show_whatsapp_in_footer,
        show_phone_in_footer,
        show_email_in_footer,
        show_website_in_footer,
        show_stamp_in_footer
    } = req.body;

    if (!gymId) {
        return res.status(400).json({ message: "معرف الجيم مفقود", status: false });
    }

    try {
        // Convert string booleans to actual booleans (since they come from multipart/form-data)
        const parseBool = (val) => val === 'true' || val === true;

        const data = {
            company_name,
            company_email,
            company_phone,
            whatsapp,
            website,
            tax_number,
            commercial_registry,
            bank_account,
            address,
            show_name_in_header: parseBool(show_name_in_header),
            show_address_in_header: parseBool(show_address_in_header),
            show_logo_in_header: parseBool(show_logo_in_header),
            show_tax_in_footer: parseBool(show_tax_in_footer),
            show_whatsapp_in_footer: parseBool(show_whatsapp_in_footer),
            show_phone_in_footer: parseBool(show_phone_in_footer),
            show_email_in_footer: parseBool(show_email_in_footer),
            show_website_in_footer: parseBool(show_website_in_footer),
            show_stamp_in_footer: parseBool(show_stamp_in_footer)
        };

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Check if settings exist to get old file paths
            const checkResult = await client.query(
                "SELECT logo, stamp FROM gym_settings WHERE gym_id = $1",
                [gymId]
            );

            let logo = checkResult.rows[0]?.logo || null;
            let stamp = checkResult.rows[0]?.stamp || null;

            // Handle file uploads
            if (req.files) {
                if (req.files['logo']) {
                    if (logo) {
                        try {
                            const publicId = logo.split('/').pop().split('.')[0];
                            await deleteFromCloudinary(`gym-saas/${publicId}`);
                        } catch (err) {
                            console.error("Error deleting old logo:", err);
                        }
                    }
                    logo = req.files['logo'][0].path;
                }

                if (req.files['stamp']) {
                    if (stamp) {
                        try {
                            const publicId = stamp.split('/').pop().split('.')[0];
                            await deleteFromCloudinary(`gym-saas/${publicId}`);
                        } catch (err) {
                            console.error("Error deleting old stamp:", err);
                        }
                    }
                    stamp = req.files['stamp'][0].path;
                }
            }

            const updatedAt = new Date();

            // 1. Update/Insert into gym_settings
            const settingsQuery = `
                INSERT INTO gym_settings (
                    gym_id, company_name, company_email, company_phone, whatsapp, website, 
                    tax_number, commercial_registry, bank_account, address, 
                    show_name_in_header, show_address_in_header, show_logo_in_header, 
                    show_tax_in_footer, show_whatsapp_in_footer, show_phone_in_footer, 
                    show_email_in_footer, show_website_in_footer, show_stamp_in_footer, 
                    logo, stamp, updated_at
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
                ON CONFLICT (gym_id) DO UPDATE SET
                    company_name = EXCLUDED.company_name,
                    company_email = EXCLUDED.company_email,
                    company_phone = EXCLUDED.company_phone,
                    whatsapp = EXCLUDED.whatsapp,
                    website = EXCLUDED.website,
                    tax_number = EXCLUDED.tax_number,
                    commercial_registry = EXCLUDED.commercial_registry,
                    bank_account = EXCLUDED.bank_account,
                    address = EXCLUDED.address,
                    show_name_in_header = EXCLUDED.show_name_in_header,
                    show_address_in_header = EXCLUDED.show_address_in_header,
                    show_logo_in_header = EXCLUDED.show_logo_in_header,
                    show_tax_in_footer = EXCLUDED.show_tax_in_footer,
                    show_whatsapp_in_footer = EXCLUDED.show_whatsapp_in_footer,
                    show_phone_in_footer = EXCLUDED.show_phone_in_footer,
                    show_email_in_footer = EXCLUDED.show_email_in_footer,
                    show_website_in_footer = EXCLUDED.show_website_in_footer,
                    show_stamp_in_footer = EXCLUDED.show_stamp_in_footer,
                    logo = EXCLUDED.logo,
                    stamp = EXCLUDED.stamp,
                    updated_at = EXCLUDED.updated_at
                RETURNING *;
            `;

            const settingsValues = [
                gymId, data.company_name, data.company_email, data.company_phone, data.whatsapp, data.website,
                data.tax_number, data.commercial_registry, data.bank_account, data.address,
                data.show_name_in_header, data.show_address_in_header, data.show_logo_in_header,
                data.show_tax_in_footer, data.show_whatsapp_in_footer, data.show_phone_in_footer,
                data.show_email_in_footer, data.show_website_in_footer, data.show_stamp_in_footer,
                logo, stamp, updatedAt
            ];

            const settingsResult = await client.query(settingsQuery, settingsValues);

            // 2. Sync with main gym table (Name, Phone, Logo)
            await client.query(
                "UPDATE gym SET name = $1, phone = $2, logo = $3, updated_at = $4 WHERE id = $5",
                [data.company_name, data.company_phone, logo, updatedAt, gymId]
            );

            await client.query('COMMIT');

            return res.status(200).json({
                message: "تم تحديث الإعدادات ومزامنة بيانات الجيم بنجاح",
                data: settingsResult.rows[0],
                status: true
            });

        } catch (error) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: error.message, status: false });
        } finally {
            client.release();
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, status: false });
    }
};

export { getSettings, updateSettings };
