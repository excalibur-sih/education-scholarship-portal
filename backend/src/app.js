const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 5000;

// =====================================================
// ================= FILE STORAGE ======================
// =====================================================

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },

  filename: (req, file, cb) => {

    const safeFileName = path
      .basename(file.originalname)
      .replace(/\s+/g, '-');

    const uniqueName =
      Date.now() + '-' + safeFileName;

    cb(null, uniqueName);
  }

});

const upload = multer({

  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    if (allowedTypes.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(
        new Error(
          'Only PDF, JPG and PNG files are allowed'
        )
      );

    }

  }

});

// =====================================================
// ================= MIDDLEWARE ========================
// =====================================================

app.use(cors());

app.use(express.json());

// Serve uploaded files
app.use(
  '/uploads',
  express.static(
    path.join(__dirname, '../uploads')
  )
);

// =====================================================
// ================= ROOT ==============================
// =====================================================

app.get('/', (req, res) => {

  res.json({
    message:
      'Education Scholarship Portal Backend is running'
  });

});

// =====================================================
// ================= HEALTH ============================
// =====================================================

app.get('/api/health', (req, res) => {

  res.json({
    success: true,
    message:
      'Education Scholarship Portal API is running'
  });

});

// =====================================================
// ================= DATABASE TEST =====================
// =====================================================

app.get('/api/db-test', async (req, res) => {

  try {

    const result =
      await pool.query('SELECT NOW()');

    res.json({
      success: true,
      message:
        'Database is connected and responding',
      databaseTime:
        result.rows[0].now
    });

  } catch (error) {

    console.error(
      'Database test error:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Database connection failed',
      error:
        error.message
    });

  }

});

// =====================================================
// ================= STUDENTS ==========================
// =====================================================

// Get all students

app.get('/api/students', async (req, res) => {

  try {

    const result = await pool.query(
      'SELECT * FROM students ORDER BY id'
    );

    res.json({
      success: true,
      count: result.rows.length,
      students: result.rows
    });

  } catch (error) {

    console.error(
      'Students API error:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to fetch students',
      error:
        error.message
    });

  }

});

// Add a new student

app.post('/api/students', async (req, res) => {

  try {

    const {
      student_id,
      citizen_id,
      full_name,
      date_of_birth,
      gender,
      mobile,
      email,
      state,
      district,
      city_village,
      pin_code,
      institute,
      university,
      course,
      branch,
      year,
      semester,
      enrollment_number,
      percentage,
      cgpa,
      guardian_name,
      family_size,
      guardian_occupation
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO students (
        student_id,
        citizen_id,
        full_name,
        date_of_birth,
        gender,
        mobile,
        email,
        state,
        district,
        city_village,
        pin_code,
        institute,
        university,
        course,
        branch,
        year,
        semester,
        enrollment_number,
        percentage,
        cgpa,
        guardian_name,
        family_size,
        guardian_occupation
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,
        $19,$20,$21,$22,$23
      )
      RETURNING *
      `,
      [
        student_id,
        citizen_id,
        full_name,
        date_of_birth,
        gender,
        mobile,
        email,
        state,
        district,
        city_village,
        pin_code,
        institute,
        university,
        course,
        branch,
        year,
        semester,
        enrollment_number,
        percentage,
        cgpa,
        guardian_name,
        family_size,
        guardian_occupation
      ]
    );

    res.status(201).json({
      success: true,
      message:
        'Student added successfully',
      student:
        result.rows[0]
    });

  } catch (error) {

    console.error(
      'Error adding student:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to add student',
      error:
        error.message
    });

  }

});

// Update an existing student

app.put('/api/students/:student_id', async (req, res) => {

  try {

    const { student_id } = req.params;

    const {
      citizen_id,
      full_name,
      date_of_birth,
      gender,
      mobile,
      email,
      state,
      district,
      city_village,
      pin_code,
      institute,
      university,
      course,
      branch,
      year,
      semester,
      enrollment_number,
      percentage,
      cgpa,
      guardian_name,
      family_size,
      guardian_occupation
    } = req.body;

    const result = await pool.query(
      `
      UPDATE students
      SET
        citizen_id = $1,
        full_name = $2,
        date_of_birth = $3,
        gender = $4,
        mobile = $5,
        email = $6,
        state = $7,
        district = $8,
        city_village = $9,
        pin_code = $10,
        institute = $11,
        university = $12,
        course = $13,
        branch = $14,
        year = $15,
        semester = $16,
        enrollment_number = $17,
        percentage = $18,
        cgpa = $19,
        guardian_name = $20,
        family_size = $21,
        guardian_occupation = $22,
        updated_at = CURRENT_TIMESTAMP
      WHERE student_id = $23
      RETURNING *
      `,
      [
        citizen_id,
        full_name,
        date_of_birth,
        gender,
        mobile,
        email,
        state,
        district,
        city_village,
        pin_code,
        institute,
        university,
        course,
        branch,
        year,
        semester,
        enrollment_number,
        percentage,
        cgpa,
        guardian_name,
        family_size,
        guardian_occupation,
        student_id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message:
          'Student not found'
      });

    }

    res.json({
      success: true,
      message:
        'Student updated successfully',
      student:
        result.rows[0]
    });

  } catch (error) {

    console.error(
      'Error updating student:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to update student',
      error:
        error.message
    });

  }

});

// =====================================================
// ================= SCHOLARSHIPS ======================
// =====================================================

// Get all scholarships

app.get('/api/scholarships', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        id,
        scholarship_id,
        name,
        description,
        academic_year,
        minimum_percentage,
        family_income_limit,
        eligible_courses,
        eligible_years,
        benefits,
        required_documents,
        application_start_date,
        application_deadline
      FROM scholarships
      ORDER BY application_deadline ASC
    `);

    res.json({
      success: true,
      scholarships:
        result.rows
    });

  } catch (error) {

    console.error(
      'Error fetching scholarships:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Unable to fetch scholarships',
      error:
        error.message
    });

  }

});

// =====================================================
// ================= APPLICATIONS =======================
// =====================================================

// Submit a new scholarship application

app.post('/api/applications', async (req, res) => {

  try {

    const {
      studentId,
      scholarshipId
    } = req.body;

    // 1. Validate required information

    if (!studentId || !scholarshipId) {

      return res.status(400).json({
        success: false,
        message:
          'Student ID and Scholarship ID are required'
      });

    }

    // 2. Find student

    const studentResult = await pool.query(
      `
      SELECT
        id,
        student_id,
        full_name
      FROM students
      WHERE student_id = $1
      `,
      [studentId]
    );

    if (studentResult.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message:
          'Student not found'
      });

    }

    const studentDbId =
      studentResult.rows[0].id;

    // 3. Find scholarship

    const scholarshipResult =
      await pool.query(
        `
        SELECT
          id,
          scholarship_id,
          name
        FROM scholarships
        WHERE scholarship_id = $1
        `,
        [scholarshipId]
      );

    if (scholarshipResult.rows.length === 0) {

      return res.status(404).json({
        success: false,
        message:
          'Scholarship not found'
      });

    }

    const scholarshipDbId =
      scholarshipResult.rows[0].id;

    const scholarshipName =
      scholarshipResult.rows[0].name;

    // 4. Generate application ID

    const applicationId =
      'APP' +
      Date.now().toString().slice(-8);

    // 5. Insert application

    const result = await pool.query(
      `
      INSERT INTO applications
      (
        application_id,
        student_id,
        scholarship_id,
        status,
        submitted_at,
        created_at,
        updated_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING
        id,
        application_id,
        student_id,
        scholarship_id,
        status,
        submitted_at,
        created_at,
        updated_at
      `,
      [
        applicationId,
        studentDbId,
        scholarshipDbId,
        'Submitted'
      ]
    );

    // =================================================
    // 6. AUTOMATIC APPLICATION STATUS HISTORY
    // =================================================

    try {

      await pool.query(
        `
        INSERT INTO application_status_history
        (
          application_id,
          status,
          remarks,
          changed_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          NOW()
        )
        `,
        [
          result.rows[0].id,
          'Submitted',
          'Application submitted successfully.'
        ]
      );

    } catch (historyError) {

      console.error(
        'Status history creation error:',
        historyError.message
      );

    }

    // =================================================
    // 7. AUTOMATIC APPLICATION NOTIFICATION
    // =================================================

    try {

      await pool.query(
        `
        INSERT INTO notifications
        (
          student_id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          false,
          NOW()
        )
        `,
        [
          studentDbId,
          'Application Submitted',
          `Your application ${applicationId} for ${scholarshipName} has been submitted successfully.`,
          'application'
        ]
      );

    } catch (notificationError) {

      console.error(
        'Notification creation error:',
        notificationError.message
      );

    }

    // 8. Response

    res.status(201).json({
      success: true,
      message:
        'Application submitted successfully',
      application:
        result.rows[0]
    });

  } catch (error) {

    console.error(
      'Error creating application:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Unable to submit application',
      error:
        error.message
    });

  }

});

// =====================================================
// ================= GET APPLICATIONS ==================
// =====================================================

app.get('/api/applications', async (req, res) => {

  try {

    const result = await pool.query(`
      SELECT
        a.id,
        a.application_id,
        s.student_id,
        s.full_name,
        sc.scholarship_id,
        sc.name AS scholarship_name,
        a.status,
        a.submitted_at,
        a.created_at,
        a.updated_at
      FROM applications a
      JOIN students s
        ON a.student_id = s.id
      JOIN scholarships sc
        ON a.scholarship_id = sc.id
      ORDER BY a.created_at DESC
    `);

    res.json({
      success: true,
      count:
        result.rows.length,
      applications:
        result.rows
    });

  } catch (error) {

    console.error(
      'Error fetching applications:',
      error.message
    );

    res.status(500).json({
      success: false,
      message:
        'Unable to fetch applications'
    });

  }

});

// =====================================================
// ================ APPLICATION TRACKING ==============
// =====================================================

app.get(
  '/api/applications/:id/tracking',
  async (req, res) => {

    try {

      const { id } = req.params;

      const applicationResult =
        await pool.query(
          `
          SELECT
            a.id,
            a.application_id,
            a.status,
            s.student_id,
            s.full_name,
            sc.scholarship_id,
            sc.name AS scholarship_name
          FROM applications a
          JOIN students s
            ON a.student_id = s.id
          JOIN scholarships sc
            ON a.scholarship_id = sc.id
          WHERE a.id = $1
          `,
          [id]
        );

      if (
        applicationResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found'
        });

      }

      const historyResult =
        await pool.query(
          `
          SELECT
            id,
            application_id,
            status,
            remarks,
            changed_at
          FROM application_status_history
          WHERE application_id = $1
          ORDER BY changed_at ASC
          `,
          [id]
        );

      res.json({
        success: true,
        application:
          applicationResult.rows[0],
        tracking:
          historyResult.rows
      });

    } catch (error) {

      console.error(
        'Application tracking error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch application tracking'
      });

    }

  }
);

// =====================================================
// ================= DOCUMENT LOCKER ===================
// =====================================================

// Get documents for an application

app.get(
  '/api/documents/:applicationId',
  async (req, res) => {

    try {

      const { applicationId } =
        req.params;

      const result = await pool.query(
        `
        SELECT
          id,
          application_id,
          document_type,
          file_name,
          upload_status,
          verification_status,
          uploaded_at
        FROM documents
        WHERE application_id = $1
        ORDER BY uploaded_at DESC
        `,
        [applicationId]
      );

      res.json({
        success: true,
        documents:
          result.rows
      });

    } catch (error) {

      console.error(
        'Get documents error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch documents'
      });

    }

  }
);

// =====================================================
// ================ UPLOAD DOCUMENT ====================
// =====================================================

app.post(
  '/api/documents',
  upload.single('file'),
  async (req, res) => {

    try {

      const {
        applicationId,
        documentType
      } = req.body;

      // 1. Validate application and document type

      if (
        !applicationId ||
        !documentType
      ) {

        return res.status(400).json({
          success: false,
          message:
            'Application ID and document type are required'
        });

      }

      // 2. Check actual file

      if (!req.file) {

        return res.status(400).json({
          success: false,
          message:
            'Please select a file'
        });

      }

      // 3. Check whether application exists

      const applicationResult =
        await pool.query(
          `
          SELECT id
          FROM applications
          WHERE id = $1
          `,
          [applicationId]
        );

      if (
        applicationResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found'
        });

      }

      // 4. Save document information

      const result = await pool.query(
        `
        INSERT INTO documents
        (
          application_id,
          document_type,
          file_name,
          upload_status,
          verification_status,
          uploaded_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          'Uploaded',
          'Pending',
          NOW()
        )
        RETURNING *
        `,
        [
          applicationId,
          documentType,
          req.file.filename
        ]
      );

      // 5. Automatic document notification

      try {

        const studentResult =
          await pool.query(
            `
            SELECT student_id
            FROM applications a
            JOIN students s
              ON a.student_id = s.id
            WHERE a.id = $1
            `,
            [applicationId]
          );

        if (studentResult.rows.length > 0) {

          const studentDbId =
            await pool.query(
              `
              SELECT id
              FROM students
              WHERE student_id = $1
              `,
              [
                studentResult.rows[0].student_id
              ]
            );

          if (studentDbId.rows.length > 0) {

            await pool.query(
              `
              INSERT INTO notifications
              (
                student_id,
                title,
                message,
                notification_type,
                is_read,
                created_at
              )
              VALUES
              (
                $1,
                $2,
                $3,
                $4,
                false,
                NOW()
              )
              `,
              [
                studentDbId.rows[0].id,
                'Document Uploaded',
                `Your ${documentType} has been uploaded successfully and is awaiting verification.`,
                'document'
              ]
            );

          }

        }

      } catch (notificationError) {

        console.error(
          'Document notification error:',
          notificationError.message
        );

      }

      // 6. Return successful response

      res.status(201).json({
        success: true,
        message:
          'Document uploaded successfully',
        document:
          result.rows[0],
        fileUrl:
          `/uploads/${req.file.filename}`
      });

    } catch (error) {

      console.error(
        'Document upload error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to upload document',
        error:
          error.message
      });

    }

  }
);

// =====================================================
// ================ FILE UPLOAD ERROR ==================
// =====================================================

app.use(
  (error, req, res, next) => {

    if (
      error instanceof multer.MulterError
    ) {

      if (
        error.code === 'LIMIT_FILE_SIZE'
      ) {

        return res.status(400).json({
          success: false,
          message:
            'File size must be 5 MB or less'
        });

      }

    }

    if (
      error &&
      error.message ===
      'Only PDF, JPG and PNG files are allowed'
    ) {

      return res.status(400).json({
        success: false,
        message:
          error.message
      });

    }

    next(error);

  }
);

// =====================================================
// =============== INCOME VERIFICATION ================
// =====================================================

// Get income verification for an application

app.get(
  '/api/income-verification/:applicationId',
  async (req, res) => {

    try {

      const { applicationId } =
        req.params;

      const result = await pool.query(
        `
        SELECT
          iv.id,
          iv.request_id,
          iv.application_id,
          iv.student_id,
          iv.annual_income,
          iv.currency,
          iv.verification_status,
          iv.source_department,
          iv.verified_at,
          iv.created_at
        FROM income_verifications iv
        WHERE iv.application_id = $1
        ORDER BY iv.created_at DESC
        `,
        [applicationId]
      );

      res.json({
        success: true,
        verification:
          result.rows[0] || null
      });

    } catch (error) {

      console.error(
        'Get income verification error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch income verification'
      });

    }

  }
);

// Create an income verification request

app.post(
  '/api/income-verification',
  async (req, res) => {

    try {

      const {
        applicationId,
        annualIncome
      } = req.body;

      // 1. Validate application

      if (!applicationId) {

        return res.status(400).json({
          success: false,
          message:
            'Application ID is required'
        });

      }

      // 2. Find application and student

      const applicationResult =
        await pool.query(
          `
          SELECT
            a.id AS application_id,
            a.application_id AS application_code,
            s.id AS student_id
          FROM applications a
          JOIN students s
            ON a.student_id = s.id
          WHERE a.id = $1
          `,
          [applicationId]
        );

      if (
        applicationResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found'
        });

      }

      const application =
        applicationResult.rows[0];

      // 3. Check existing verification request

      const existingResult =
        await pool.query(
          `
          SELECT *
          FROM income_verifications
          WHERE application_id = $1
          ORDER BY created_at DESC
          LIMIT 1
          `,
          [applicationId]
        );

      if (
        existingResult.rows.length > 0
      ) {

        return res.json({
          success: true,
          message:
            'Income verification request already exists',
          verification:
            existingResult.rows[0]
        });

      }

      // 4. Generate request ID

      const requestId =
        'INC' +
        Date.now().toString().slice(-8);

      // 5. Create verification request

      const result = await pool.query(
        `
        INSERT INTO income_verifications
        (
          request_id,
          application_id,
          student_id,
          annual_income,
          currency,
          verification_status,
          source_department,
          verified_at,
          created_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          'INR',
          'Pending',
          'Education Scholarship Portal',
          NULL,
          NOW()
        )
        RETURNING *
        `,
        [
          requestId,
          application.application_id,
          application.student_id,
          annualIncome || null
        ]
      );

      // 6. Automatic income verification notification

      try {

        await pool.query(
          `
          INSERT INTO notifications
          (
            student_id,
            title,
            message,
            notification_type,
            is_read,
            created_at
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            false,
            NOW()
          )
          `,
          [
            application.student_id,
            'Income Verification Requested',
            `Your income verification request ${requestId} has been submitted and is currently pending.`,
            'income'
          ]
        );

      } catch (notificationError) {

        console.error(
          'Income notification error:',
          notificationError.message
        );

      }

      // 7. Response

      res.status(201).json({
        success: true,
        message:
          'Income verification request created successfully',
        verification:
          result.rows[0]
      });

    } catch (error) {

      console.error(
        'Create income verification error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to create income verification request'
      });

    }

  }
);

// =====================================================
// ================== NOTIFICATIONS =====================
// =====================================================

// Get notifications for a student

app.get(
  '/api/notifications',
  async (req, res) => {

    try {

      const { studentId } =
        req.query;

      if (!studentId) {

        return res.status(400).json({
          success: false,
          message:
            'studentId is required'
        });

      }

      const studentResult =
        await pool.query(
          `
          SELECT
            id,
            student_id,
            full_name
          FROM students
          WHERE student_id = $1
          `,
          [studentId]
        );

      if (
        studentResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Student not found'
        });

      }

      const student =
        studentResult.rows[0];

      const notificationResult =
        await pool.query(
          `
          SELECT
            id,
            student_id,
            title,
            message,
            notification_type,
            is_read,
            created_at
          FROM notifications
          WHERE student_id = $1
          ORDER BY created_at DESC
          `,
          [student.id]
        );

      res.json({
        success: true,
        student: {
          student_id:
            student.student_id,
          full_name:
            student.full_name
        },
        notifications:
          notificationResult.rows
      });

    } catch (error) {

      console.error(
        'Get notifications error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch notifications'
      });

    }

  }
);

// Get unread notification count

app.get(
  '/api/notifications/unread-count',
  async (req, res) => {

    try {

      const { studentId } =
        req.query;

      if (!studentId) {

        return res.status(400).json({
          success: false,
          message:
            'studentId is required'
        });

      }

      const studentResult =
        await pool.query(
          `
          SELECT id
          FROM students
          WHERE student_id = $1
          `,
          [studentId]
        );

      if (
        studentResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Student not found'
        });

      }

      const studentDbId =
        studentResult.rows[0].id;

      const result = await pool.query(
        `
        SELECT COUNT(*) AS unread_count
        FROM notifications
        WHERE student_id = $1
          AND (
            is_read = false
            OR is_read IS NULL
          )
        `,
        [studentDbId]
      );

      res.json({
        success: true,
        unreadCount:
          Number(
            result.rows[0].unread_count
          )
      });

    } catch (error) {

      console.error(
        'Unread notification count error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch unread notification count'
      });

    }

  }
);

// Mark one notification as read

app.put(
  '/api/notifications/:id/read',
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result = await pool.query(
        `
        UPDATE notifications
        SET is_read = true
        WHERE id = $1
        RETURNING
          id,
          student_id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        `,
        [id]
      );

      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Notification not found'
        });

      }

      res.json({
        success: true,
        message:
          'Notification marked as read',
        notification:
          result.rows[0]
      });

    } catch (error) {

      console.error(
        'Mark notification read error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to update notification'
      });

    }

  }
);

// Mark all notifications as read

app.put(
  '/api/notifications/read-all',
  async (req, res) => {

    try {

      const { studentId } =
        req.body;

      if (!studentId) {

        return res.status(400).json({
          success: false,
          message:
            'studentId is required'
        });

      }

      const studentResult =
        await pool.query(
          `
          SELECT id
          FROM students
          WHERE student_id = $1
          `,
          [studentId]
        );

      if (
        studentResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Student not found'
        });

      }

      const studentDbId =
        studentResult.rows[0].id;

      const result = await pool.query(
        `
        UPDATE notifications
        SET is_read = true
        WHERE student_id = $1
          AND (
            is_read = false
            OR is_read IS NULL
          )
        `,
        [studentDbId]
      );

      res.json({
        success: true,
        message:
          'All notifications marked as read',
        updatedCount:
          result.rowCount
      });

    } catch (error) {

      console.error(
        'Mark all notifications read error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to update notifications'
      });

    }

  }
);

// Create a notification manually

app.post(
  '/api/notifications',
  async (req, res) => {

    try {

      const {
        studentId,
        title,
        message,
        notificationType
      } = req.body;

      if (
        !studentId ||
        !title ||
        !message
      ) {

        return res.status(400).json({
          success: false,
          message:
            'studentId, title and message are required'
        });

      }

      const studentResult =
        await pool.query(
          `
          SELECT
            id,
            student_id,
            full_name
          FROM students
          WHERE student_id = $1
          `,
          [studentId]
        );

      if (
        studentResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Student not found'
        });

      }

      const studentDbId =
        studentResult.rows[0].id;

      const result = await pool.query(
        `
        INSERT INTO notifications
        (
          student_id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          false,
          NOW()
        )
        RETURNING
          id,
          student_id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        `,
        [
          studentDbId,
          title,
          message,
          notificationType ||
          'general'
        ]
      );

      res.status(201).json({
        success: true,
        message:
          'Notification created successfully',
        notification:
          result.rows[0]
      });

    } catch (error) {

      console.error(
        'Create notification error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to create notification'
      });

    }

  }
);

// =====================================================
// ================= CONSENT AUTHORIZATION =============
// =====================================================

// GET CONSENT FOR AN APPLICATION

app.get(
  '/api/consents/:applicationId',
  async (req, res) => {

    try {

      const { applicationId } =
        req.params;

      const result = await pool.query(
        `
        SELECT
          c.id,
          c.consent_id,
          c.application_id,
          c.student_id,
          c.data_requested,
          c.purpose,
          c.provider_department,
          c.status,
          c.requested_at,
          c.granted_at,
          c.expires_at
        FROM consents c
        WHERE c.application_id = $1
        ORDER BY c.requested_at DESC
        LIMIT 1
        `,
        [applicationId]
      );

      if (result.rows.length === 0) {

        return res.json({
          success: true,
          consent: null
        });

      }

      res.json({
        success: true,
        consent:
          result.rows[0]
      });

    } catch (error) {

      console.error(
        'Error fetching consent:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch consent information'
      });

    }

  }
);

// GRANT CONSENT

app.post(
  '/api/consents',
  async (req, res) => {

    try {

      const {
        applicationId
      } = req.body;

      // 1. Validate application ID

      if (!applicationId) {

        return res.status(400).json({
          success: false,
          message:
            'Application ID is required'
        });

      }

      // 2. Find application and student

      const applicationResult =
        await pool.query(
          `
          SELECT
            a.id,
            a.application_id,
            a.student_id,
            s.student_id AS student_code
          FROM applications a
          JOIN students s
            ON a.student_id = s.id
          WHERE a.id = $1
          `,
          [applicationId]
        );

      if (
        applicationResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found'
        });

      }

      const application =
        applicationResult.rows[0];

      // 3. Check if consent already exists

      const existingConsent =
        await pool.query(
          `
          SELECT *
          FROM consents
          WHERE application_id = $1
          ORDER BY requested_at DESC
          LIMIT 1
          `,
          [applicationId]
        );

      if (
        existingConsent.rows.length > 0 &&
        existingConsent.rows[0].status === 'Granted'
      ) {

        return res.json({
          success: true,
          message:
            'Consent is already granted',
          consent:
            existingConsent.rows[0]
        });

      }

      // 4. Generate consent ID

      const consentId =
        'CON' +
        Date.now().toString().slice(-8);

      // 5. Insert consent

      const result = await pool.query(
        `
        INSERT INTO consents
        (
          consent_id,
          application_id,
          student_id,
          data_requested,
          purpose,
          provider_department,
          status,
          requested_at,
          granted_at,
          expires_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          NOW(),
          NOW(),
          NULL
        )
        RETURNING
          id,
          consent_id,
          application_id,
          student_id,
          data_requested,
          purpose,
          provider_department,
          status,
          requested_at,
          granted_at,
          expires_at
        `,
        [
          consentId,
          application.id,
          application.student_id,
          'Annual Family Income',
          'Scholarship Eligibility Verification',
          'Education Scholarship Portal',
          'Granted'
        ]
      );

      // 6. Create notification

      await pool.query(
        `
        INSERT INTO notifications
        (
          student_id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          NOW()
        )
        `,
        [
          application.student_id,
          'Consent Authorization Granted',
          'Your consent has been successfully recorded for scholarship eligibility verification.',
          'Consent',
          false
        ]
      );

      // 7. Send response

      res.status(201).json({
        success: true,
        message:
          'Consent granted successfully',
        consent:
          result.rows[0]
      });

    } catch (error) {

      console.error(
        'Error granting consent:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to grant consent',
        error:
          error.message
      });

    }

  }
);

// REVOKE CONSENT

app.put(
  '/api/consents/:id/revoke',
  async (req, res) => {

    try {

      const { id } =
        req.params;

      const result = await pool.query(
        `
        UPDATE consents
        SET
          status = 'Revoked',
          expires_at = NOW()
        WHERE id = $1
        RETURNING
          id,
          consent_id,
          application_id,
          student_id,
          data_requested,
          purpose,
          provider_department,
          status,
          requested_at,
          granted_at,
          expires_at
        `,
        [id]
      );

      if (result.rows.length === 0) {

        return res.status(404).json({
          success: false,
          message:
            'Consent not found'
        });

      }

      // Create notification

      await pool.query(
        `
        INSERT INTO notifications
        (
          student_id,
          title,
          message,
          notification_type,
          is_read,
          created_at
        )
        VALUES
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          NOW()
        )
        `,
        [
          result.rows[0].student_id,
          'Consent Revoked',
          'Your consent authorization has been revoked successfully.',
          'Consent',
          false
        ]
      );

      res.json({
        success: true,
        message:
          'Consent revoked successfully',
        consent:
          result.rows[0]
      });

    } catch (error) {

      console.error(
        'Error revoking consent:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to revoke consent'
      });

    }

  }
);

// =====================================================
// =============== VERIFICATION HISTORY ================
// =====================================================
//
// IMPORTANT:
// This route uses APPLICATION ID.
// Example:
// /api/verification-history/1
//
// There is intentionally NO old :studentId route here.
// =====================================================

app.get(
  '/api/verification-history/:applicationId',
  async (req, res) => {

    try {

      const { applicationId } =
        req.params;

      // -------------------------------------------------
      // 1. GET APPLICATION
      // -------------------------------------------------

      const applicationResult =
        await pool.query(
          `
          SELECT
            a.id,
            a.application_id,
            a.status,
            a.submitted_at,
            s.student_id,
            s.full_name,
            sc.scholarship_id,
            sc.name AS scholarship_name
          FROM applications a
          LEFT JOIN students s
            ON a.student_id = s.id
          LEFT JOIN scholarships sc
            ON a.scholarship_id = sc.id
          WHERE a.id = $1
          `,
          [applicationId]
        );

      if (
        applicationResult.rows.length === 0
      ) {

        return res.status(404).json({
          success: false,
          message:
            'Application not found'
        });

      }

      const application =
        applicationResult.rows[0];

      // -------------------------------------------------
      // 2. APPLICATION STATUS HISTORY
      // -------------------------------------------------

      const statusHistoryResult =
        await pool.query(
          `
          SELECT
            id,
            application_id,
            status,
            remarks,
            changed_at
          FROM application_status_history
          WHERE application_id = $1
          ORDER BY changed_at ASC
          `,
          [application.id]
        );

      // -------------------------------------------------
      // 3. INCOME VERIFICATION HISTORY
      // -------------------------------------------------

      const incomeResult =
        await pool.query(
          `
          SELECT
            id,
            request_id,
            annual_income,
            currency,
            verification_status,
            source_department,
            verified_at,
            created_at
          FROM income_verifications
          WHERE application_id = $1
          ORDER BY created_at ASC
          `,
          [application.id]
        );

      // -------------------------------------------------
      // 4. CONSENT HISTORY
      // -------------------------------------------------

      const consentResult =
        await pool.query(
          `
          SELECT
            id,
            consent_id,
            data_requested,
            purpose,
            provider_department,
            status,
            requested_at,
            granted_at,
            expires_at
          FROM consents
          WHERE application_id = $1
          ORDER BY requested_at ASC
          `,
          [application.id]
        );

      // -------------------------------------------------
      // 5. RETURN COMPLETE HISTORY
      // -------------------------------------------------

      res.json({
        success: true,

        application:
          application,

        statusHistory:
          statusHistoryResult.rows,

        incomeVerification:
          incomeResult.rows,

        consents:
          consentResult.rows
      });

    } catch (error) {

      console.error(
        'Verification history error:',
        error.message
      );

      res.status(500).json({
        success: false,
        message:
          'Unable to fetch verification history'
      });

    }

  }
);

// =====================================================
// ============ OFFICER & WORKFLOW EXTENSIONS ==========
// =====================================================

// 1. Complete Application Review Dossier
app.get('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const appResult = await pool.query(
      `
      SELECT
        a.id,
        a.application_id,
        a.student_id,
        a.scholarship_id,
        a.status,
        a.submitted_at,
        a.created_at,
        a.updated_at,
        s.student_id AS student_code,
        s.citizen_id,
        s.full_name,
        s.date_of_birth,
        s.gender,
        s.mobile,
        s.email,
        s.state,
        s.district,
        s.city_village,
        s.pin_code,
        s.institute,
        s.university,
        s.course,
        s.branch,
        s.year,
        s.semester,
        s.enrollment_number,
        s.percentage,
        s.cgpa,
        s.guardian_name,
        s.family_size,
        s.guardian_occupation,
        sc.scholarship_id AS scholarship_code,
        sc.name AS scholarship_name,
        sc.description AS scholarship_description,
        sc.academic_year,
        sc.minimum_percentage,
        sc.family_income_limit,
        sc.eligible_courses,
        sc.eligible_years,
        sc.benefits,
        sc.required_documents,
        sc.application_deadline
      FROM applications a
      JOIN students s ON a.student_id = s.id
      JOIN scholarships sc ON a.scholarship_id = sc.id
      WHERE CAST(a.id AS TEXT) = $1 OR a.application_id = $1
      `,
      [id]
    );

    if (appResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const application = appResult.rows[0];

    // Fetch related records in parallel
    const [docsRes, incomeRes, consentRes, historyRes] = await Promise.all([
      pool.query(
        `SELECT id, application_id, document_type, file_name, upload_status, verification_status, uploaded_at
         FROM documents
         WHERE application_id = $1
         ORDER BY uploaded_at DESC`,
        [application.id]
      ),
      pool.query(
        `SELECT id, request_id, application_id, student_id, annual_income, currency, verification_status, source_department, verified_at, created_at
         FROM income_verifications
         WHERE application_id = $1
         ORDER BY created_at DESC`,
        [application.id]
      ),
      pool.query(
        `SELECT id, consent_id, application_id, student_id, data_requested, purpose, provider_department, status, requested_at, granted_at, expires_at
         FROM consents
         WHERE application_id = $1
         ORDER BY requested_at DESC`,
        [application.id]
      ),
      pool.query(
        `SELECT id, application_id, status, remarks, changed_at
         FROM application_status_history
         WHERE application_id = $1
         ORDER BY changed_at DESC`,
        [application.id]
      )
    ]);

    res.json({
      success: true,
      application: {
        ...application,
        documents: docsRes.rows,
        incomeVerifications: incomeRes.rows,
        latestIncomeVerification: incomeRes.rows[0] || null,
        consents: consentRes.rows,
        statusHistory: historyRes.rows
      }
    });
  } catch (error) {
    console.error('Get application dossier error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch application dossier',
      error: error.message
    });
  }
});

// 2. Application Status Update Workflow
app.put('/api/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'New status is required'
      });
    }

    const validStatuses = [
      'Submitted',
      'Under Review',
      'Verification Pending',
      'Approved',
      'Rejected'
    ];

    const matchedStatus = validStatuses.find(
      (s) => s.toLowerCase() === status.trim().toLowerCase()
    );

    if (!matchedStatus) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed statuses: ${validStatuses.join(', ')}`
      });
    }

    // Find application
    const appLookup = await pool.query(
      `SELECT id, application_id, student_id, status FROM applications WHERE CAST(id AS TEXT) = $1 OR application_id = $1`,
      [id]
    );

    if (appLookup.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const currentApp = appLookup.rows[0];

    // 1. Update application status
    const updateResult = await pool.query(
      `UPDATE applications
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [matchedStatus, currentApp.id]
    );

    // 2. Insert into application_status_history
    const historyResult = await pool.query(
      `INSERT INTO application_status_history (
         application_id, status, remarks, changed_at
       ) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       RETURNING *`,
      [currentApp.id, matchedStatus, remarks || `Status transitioned to ${matchedStatus}`]
    );

    // 3. Create student notification
    await pool.query(
      `INSERT INTO notifications (
         student_id, title, message, notification_type, is_read, created_at
       ) VALUES ($1, $2, $3, $4, false, CURRENT_TIMESTAMP)`,
      [
        currentApp.student_id,
        `Application Status: ${matchedStatus}`,
        `Your application (${currentApp.application_id}) status has been updated to "${matchedStatus}".${remarks ? ' Officer remarks: ' + remarks : ''}`,
        'Status Update'
      ]
    );

    res.json({
      success: true,
      message: `Application status updated to ${matchedStatus}`,
      application: updateResult.rows[0],
      history: historyResult.rows[0]
    });
  } catch (error) {
    console.error('Update status error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to update application status',
      error: error.message
    });
  }
});

// 3. Officer Verifications Queue (Income Verification Records)
app.get('/api/officer/verifications', async (req, res) => {
  try {
    const { status } = req.query;

    let queryText = `
      SELECT
        iv.id,
        iv.request_id,
        iv.application_id,
        a.application_id AS application_number,
        s.id AS student_db_id,
        s.student_id AS student_code,
        s.full_name AS student_name,
        iv.annual_income,
        iv.currency,
        iv.verification_status,
        iv.source_department,
        iv.verified_at,
        iv.created_at
      FROM income_verifications iv
      JOIN applications a ON iv.application_id = a.id
      JOIN students s ON iv.student_id = s.id
    `;

    const params = [];
    if (status && status.toUpperCase() !== 'ALL') {
      queryText += ` WHERE LOWER(iv.verification_status) = LOWER($1)`;
      params.push(status);
    }

    queryText += ` ORDER BY iv.created_at DESC`;

    const result = await pool.query(queryText, params);

    res.json({
      success: true,
      count: result.rows.length,
      verifications: result.rows
    });
  } catch (error) {
    console.error('Officer verifications error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch verification records',
      error: error.message
    });
  }
});

// 4. Officer Process Income Verification (Verify / Reject)
app.put('/api/income-verification/:id/process', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, status, remarks } = req.body;

    const requestedDecision = (action || status || '').trim().toLowerCase();
    let finalStatus = 'Verified';

    if (requestedDecision === 'reject' || requestedDecision === 'rejected') {
      finalStatus = 'Rejected';
    } else if (requestedDecision === 'verify' || requestedDecision === 'verified') {
      finalStatus = 'Verified';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Valid action is required: "Verified" or "Rejected"'
      });
    }

    // Check verification record
    const ivCheck = await pool.query(
      `SELECT iv.*, a.application_id AS app_code FROM income_verifications iv JOIN applications a ON iv.application_id = a.id WHERE iv.id = $1`,
      [id]
    );

    if (ivCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Income verification record not found'
      });
    }

    const iv = ivCheck.rows[0];

    // Update income verification
    const updateRes = await pool.query(
      `UPDATE income_verifications
       SET verification_status = $1,
           verified_at = CURRENT_TIMESTAMP,
           source_department = 'Portal Verification'
       WHERE id = $2
       RETURNING *`,
      [finalStatus, id]
    );

    // Notify student
    await pool.query(
      `INSERT INTO notifications (
         student_id, title, message, notification_type, is_read, created_at
       ) VALUES ($1, $2, $3, $4, false, CURRENT_TIMESTAMP)`,
      [
        iv.student_id,
        `Income Verification: ${finalStatus}`,
        `Your income verification for Application ${iv.app_code} has been marked as ${finalStatus} by the portal verification service.${remarks ? ' Remarks: ' + remarks : ''}`,
        'Income Verification'
      ]
    );

    res.json({
      success: true,
      message: `Income verification marked as ${finalStatus}`,
      verification: updateRes.rows[0]
    });
  } catch (error) {
    console.error('Process income verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to process income verification',
      error: error.message
    });
  }
});

// 5. Officer Document Verification (Verify / Reject)
app.put('/api/documents/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const normalizedStatus = (status || '').trim().toLowerCase() === 'rejected' ? 'Rejected' : 'Verified';

    // Check document
    const docCheck = await pool.query(
      `SELECT d.*, a.student_id, a.application_id AS app_code
       FROM documents d
       JOIN applications a ON d.application_id = a.id
       WHERE d.id = $1`,
      [id]
    );

    if (docCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Document record not found'
      });
    }

    const doc = docCheck.rows[0];

    const updateRes = await pool.query(
      `UPDATE documents
       SET verification_status = $1
       WHERE id = $2
       RETURNING *`,
      [normalizedStatus, id]
    );

    // Notify student
    await pool.query(
      `INSERT INTO notifications (
         student_id, title, message, notification_type, is_read, created_at
       ) VALUES ($1, $2, $3, $4, false, CURRENT_TIMESTAMP)`,
      [
        doc.student_id,
        `Document ${normalizedStatus}: ${doc.document_type}`,
        `Your document "${doc.file_name || doc.document_type}" has been ${normalizedStatus.toLowerCase()} by the reviewing officer.${remarks ? ' Remarks: ' + remarks : ''}`,
        'Document Verification'
      ]
    );

    res.json({
      success: true,
      message: `Document marked as ${normalizedStatus}`,
      document: updateRes.rows[0]
    });
  } catch (error) {
    console.error('Verify document error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to verify document',
      error: error.message
    });
  }
});


// =====================================================
// SANCHALAK INTEGRATION ENDPOINT
// =====================================================
app.post('/api/sanchalak/autofill', async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID required' });
    }

    // Derive and validate citizen reference from DB
    let citizenReference = 'CIT001'; // Default mock citizen ID for dummy portal
    
    try {
      const studentResult = await pool.query(
        `SELECT student_id, citizen_id FROM students WHERE student_id = $1 OR CAST(id AS TEXT) = $1`,
        [studentId]
      );

      if (studentResult.rows.length > 0 && studentResult.rows[0].citizen_id) {
        citizenReference = studentResult.rows[0].citizen_id;
      } else {
        console.warn('Student not found in Scholarship DB, using fallback citizen ID');
      }
    } catch (dbError) {
      console.warn('Database error when fetching student (table might not exist). Using fallback citizen ID.', dbError.message);
    }

    // Secure M2M Call to Sanchalak
    const SANCHALAK_URL = 'http://localhost:4000/api/v1/interoperability/requests';
    const SANCHALAK_API_KEY = 'sih-development-api-key-123'; 

    const payload = {
      requestId: 'REQ-SCH-' + Date.now(),
      requestingSystem: { systemId: 'MOCK_SCHOLARSHIP_PORTAL' },
      service: { serviceId: 'SCHOLARSHIP_ELIGIBILITY', version: '1.0' },
      subject: { reference: citizenReference },
      response: { format: 'JSON', schemaVersion: '1.0' }
    };
    
    const sanchalakResponse = await globalThis.fetch(SANCHALAK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SANCHALAK_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const sanchalakData = await sanchalakResponse.json();

    if (!sanchalakResponse.ok) {
      return res.status(sanchalakResponse.status).json({
        success: false,
        message: 'Sanchalak integration failed',
        error: sanchalakData
      });
    }

    // Return the mapped response strictly to frontend
    res.json({
      success: true,
      data: sanchalakData.data
    });

  } catch (error) {
    console.error('Sanchalak proxy error:', error);
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
});

// 6. Student Notifications by ID parameter (e.g. /api/notifications/STU2026001 or numeric id)

app.get('/api/notifications/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentResult = await pool.query(
      `SELECT id, student_id, full_name
       FROM students
       WHERE student_id = $1 OR CAST(id AS TEXT) = $1`,
      [studentId]
    );

    if (studentResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const student = studentResult.rows[0];

    const notificationResult = await pool.query(
      `SELECT id, student_id, title, message, notification_type, is_read, created_at
       FROM notifications
       WHERE student_id = $1
       ORDER BY created_at DESC`,
      [student.id]
    );

    res.json({
      success: true,
      student: {
        student_id: student.student_id,
        full_name: student.full_name
      },
      notifications: notificationResult.rows
    });
  } catch (error) {
    console.error('Get notifications by id error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Unable to fetch notifications',
      error: error.message
    });
  }
});

// =====================================================
// ================= START SERVER =======================
// =====================================================

app.listen(PORT, () => {

  console.log(
    `Server is running on port ${PORT}`
  );

});
