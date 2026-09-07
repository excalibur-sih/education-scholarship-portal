import React, { useEffect, useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Eye,
  ShieldCheck,
  UploadCloud,
  Loader2
} from 'lucide-react';

import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const DocumentsPage = () => {

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [documents, setDocuments] = useState([]);

  const [documentType, setDocumentType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // =====================================================
  // LOAD APPLICATIONS
  // =====================================================

  useEffect(() => {

    const loadApplications = async () => {

      try {

        const response = await fetch(
          'http://localhost:5000/api/applications'
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || 'Unable to load applications'
          );
        }

        setApplications(data.applications || []);

        if (data.applications?.length > 0) {
          setSelectedApplication(
            String(data.applications[0].id)
          );
        }

      } catch (err) {

        console.error(
          'Application loading error:',
          err
        );

        setError(
          'Unable to load scholarship applications'
        );

      } finally {

        setLoading(false);

      }

    };

    loadApplications();

  }, []);

  // =====================================================
  // LOAD DOCUMENTS
  // =====================================================

  useEffect(() => {

    if (!selectedApplication) {
      setDocuments([]);
      return;
    }

    const loadDocuments = async () => {

      try {

        setError('');

        const response = await fetch(
          `http://localhost:5000/api/documents/${selectedApplication}`
        );

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || 'Unable to load documents'
          );
        }

        setDocuments(data.documents || []);

      } catch (err) {

        console.error(
          'Document loading error:',
          err
        );

        setError(
          'Unable to load documents'
        );

      }

    };

    loadDocuments();

  }, [selectedApplication]);

  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleFileChange = (event) => {

    const file = event.target.files?.[0];

    setError('');
    setMessage('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Maximum 5 MB

    if (file.size > 5 * 1024 * 1024) {

      setSelectedFile(null);

      setError(
        'File size must be 5 MB or less.'
      );

      return;

    }

    // Allowed file types

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    if (!allowedTypes.includes(file.type)) {

      setSelectedFile(null);

      setError(
        'Only PDF, JPG and PNG files are allowed.'
      );

      return;

    }

    setSelectedFile(file);

  };

  // =====================================================
  // UPLOAD DOCUMENT
  // =====================================================

  const handleUpload = async () => {

    setMessage('');
    setError('');

    if (!selectedApplication) {

      setError(
        'Please select an application.'
      );

      return;

    }

    if (!documentType) {

      setError(
        'Please select a document type.'
      );

      return;

    }

    if (!selectedFile) {

      setError(
        'Please select a file.'
      );

      return;

    }

    try {

      setUploading(true);

      // Create multipart form data

      const formData = new FormData();

      formData.append(
        'applicationId',
        selectedApplication
      );

      formData.append(
        'documentType',
        documentType
      );

      formData.append(
        'file',
        selectedFile
      );

      // Send actual file to backend

      const response = await fetch(
        'http://localhost:5000/api/documents',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          'Document upload failed'
        );

      }

      // Add newly uploaded document
      // immediately to the screen

      setDocuments((previous) => [
        data.document,
        ...previous
      ]);

      setMessage(
        'Document uploaded successfully.'
      );

      // Reset upload fields

      setDocumentType('');
      setSelectedFile(null);

      const fileInput =
        document.getElementById(
          'document-file'
        );

      if (fileInput) {
        fileInput.value = '';
      }

    } catch (err) {

      console.error(
        'Document upload error:',
        err
      );

      setError(
        err.message ||
        'Unable to upload document'
      );

    } finally {

      setUploading(false);

    }

  };

  // =====================================================
  // PREVIEW
  // =====================================================

  const handlePreview = (doc) => {

    if (!doc.file_name) {
      setError(
        'File is not available.'
      );

      return;
    }

    const fileUrl =
      `http://localhost:5000/uploads/${doc.file_name}`;

    window.open(
      fileUrl,
      '_blank',
      'noopener,noreferrer'
    );

  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="flex items-center justify-center py-20">

        <div className="flex items-center gap-2 text-slate-600">

          <Loader2 className="w-5 h-5 animate-spin" />

          Loading documents...

        </div>

      </div>
    );

  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (

    <div className="space-y-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <h1 className="text-xl font-bold text-slate-900">
              Student Document Locker
            </h1>

            <p className="text-xs text-slate-500 mt-1">
              Manage certificates, marksheets and identity documents
              required for scholarship applications.
            </p>

          </div>

          <Badge
            variant="success"
            size="sm"
          >
            {documents.filter(
              (doc) =>
                doc.verification_status === 'Verified'
            ).length}{' '}
            Documents Verified
          </Badge>

        </div>

      </div>

      {/* ================================================= */}
      {/* APPLICATION SELECTOR */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">

        <label className="block text-xs font-bold text-slate-700 mb-2">

          Select Scholarship Application

        </label>

        <select
          value={selectedApplication}
          onChange={(event) =>
            setSelectedApplication(
              event.target.value
            )
          }
          className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        >

          {applications.length === 0 ? (

            <option value="">
              No applications available
            </option>

          ) : (

            applications.map((application) => (

              <option
                key={application.id}
                value={application.id}
              >

                {application.application_id}
                {' — '}
                {application.scholarship_name}

              </option>

            ))

          )}

        </select>

      </div>

      {/* ================================================= */}
      {/* INFORMATION */}
      {/* ================================================= */}

      <div className="bg-blue-50/80 rounded-xl border border-blue-200 p-4 text-xs text-blue-950 flex items-start gap-3">

        <ShieldCheck className="w-5 h-5 text-gov-primary shrink-0 mt-0.5" />

        <div>

          <p className="font-bold">
            Document Verification
          </p>

          <p className="text-slate-600 text-[11px] leading-relaxed mt-1">

            Uploaded documents are stored securely with your
            scholarship application. Verification status will be
            updated by the authorized portal workflow.

          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* SUCCESS / ERROR */}
      {/* ================================================= */}

      {message && (

        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-3 text-sm">

          {message}

        </div>

      )}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">

          {error}

        </div>

      )}

      {/* ================================================= */}
      {/* DOCUMENT LIST */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

          <h3 className="text-sm font-bold text-slate-800">
            Application Documents
          </h3>

          <span className="text-xs text-slate-400">
            PDF / JPG / PNG
          </span>

        </div>

        {documents.length === 0 ? (

          <div className="p-10 text-center">

            <FileText className="w-10 h-10 mx-auto text-slate-300" />

            <p className="text-sm font-semibold text-slate-600 mt-3">

              No documents uploaded

            </p>

            <p className="text-xs text-slate-400 mt-1">

              Upload a document using the section below.

            </p>

          </div>

        ) : (

          <div className="divide-y divide-slate-100">

            {documents.map((doc) => (

              <div
                key={doc.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
              >

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">

                    <FileText className="w-5 h-5" />

                  </div>

                  <div>

                    <div className="flex items-center gap-2 flex-wrap">

                      <h4 className="text-xs font-bold text-slate-900">

                        {doc.file_name}

                      </h4>

                      <Badge
                        variant="gov"
                        size="sm"
                      >

                        {doc.document_type}

                      </Badge>

                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">

                      Uploaded:{' '}

                      {doc.uploaded_at
                        ? new Date(
                          doc.uploaded_at
                        ).toLocaleDateString(
                          'en-IN'
                        )
                        : '—'}

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  <Badge
                    variant={
                      doc.verification_status ===
                        'Verified'
                        ? 'success'
                        : 'warning'
                    }
                    size="sm"
                  >

                    {doc.verification_status}

                  </Badge>

                  <button
                    onClick={() =>
                      handlePreview(doc)
                    }
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold flex items-center gap-1"
                  >

                    <Eye className="w-3.5 h-3.5" />

                    <span>
                      Preview
                    </span>

                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* ================================================= */}
      {/* UPLOAD */}
      {/* ================================================= */}

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">

        <div>

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider text-gov-primary">

            Upload Document

          </h3>

          <p className="text-xs text-slate-500 mt-1">

            Upload a PDF, JPG or PNG document up to 5 MB.

          </p>

        </div>

        {/* Document Type */}

        <div>

          <label className="block text-xs font-semibold text-slate-700 mb-2">

            Document Type

          </label>

          <select
            value={documentType}
            onChange={(event) =>
              setDocumentType(
                event.target.value
              )
            }
            className="w-full p-3 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >

            <option value="">
              Select document type
            </option>

            <option value="Aadhaar Card">
              Aadhaar Card
            </option>

            <option value="Marksheet">
              Marksheet
            </option>

            <option value="Income Certificate">
              Income Certificate
            </option>

            <option value="Caste Certificate">
              Caste Certificate
            </option>

            <option value="Bonafide Certificate">
              Bonafide Certificate
            </option>

            <option value="Domicile Certificate">
              Domicile Certificate
            </option>

            <option value="Bank Passbook">
              Bank Passbook
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>

        {/* File */}

        <div>

          <label className="block text-xs font-semibold text-slate-700 mb-2">

            Select File

          </label>

          <input
            id="document-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg"
          />

          <p className="text-[11px] text-slate-500 mt-2">

            Supported formats: PDF, JPG, JPEG, PNG • Maximum size: 5 MB

          </p>

          {selectedFile && (

            <p className="text-xs text-emerald-700 font-semibold mt-2">

              Selected: {selectedFile.name}

            </p>

          )}

        </div>

        {/* Upload Button */}

        <Button
          onClick={handleUpload}
          disabled={uploading}
        >

          {uploading ? (

            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>

          ) : (

            <>
              <UploadCloud className="w-4 h-4" />
              Upload Document
            </>

          )}

        </Button>

      </div>

    </div>

  );

};