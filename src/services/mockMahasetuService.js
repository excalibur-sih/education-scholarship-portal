import educationRequest from '../data/payloads/education-request.json';
import revenueResponseXml from '../data/payloads/revenue-response.xml?raw';
import educationResponse from '../data/payloads/education-response.json';
import verificationData from '../data/verification.json';

export const mockMahasetuService = {
  getSampleEducationRequest: (custom = {}) => {
    return {
      ...educationRequest,
      ...custom,
      timestamp: new Date().toISOString()
    };
  },

  getSampleRevenueXmlResponse: () => {
    return revenueResponseXml;
  },

  getSampleEducationResponse: (custom = {}) => {
    return {
      ...educationResponse,
      ...custom,
      verifiedAt: new Date().toISOString()
    };
  },

  getSchemaMappings: () => {
    return verificationData.schemaMappings;
  },

  getDataMinimizationSummary: () => {
    return {
      sourceDepartment: "Revenue Department",
      targetDepartment: "Education Department",
      totalFieldsAtSource: 9,
      fieldsRequested: 1, // Only annual family income
      fieldsTransferred: 1,
      fieldsRedacted: 8,
      privacyCompliance: "100% Data Minimization Standard Met",
      rules: verificationData.dataMinimizationRules
    };
  },

  // Simulates step-by-step pipeline execution for visual UI
  executePipelineSimulation: async (onStepProgress) => {
    const steps = [
      {
        stepIndex: 1,
        title: "1. Education Portal Generates JSON Request",
        format: "JSON",
        source: "Education Scholarship Portal",
        details: "Student consent verified (Token CST_982348). Generating structured JSON requesting only 'annualIncome' for Citizen ID CIT001.",
        payloadType: "json",
        payload: educationRequest,
        duration: 800
      },
      {
        stepIndex: 2,
        title: "2. MahaSetu Ingestion & Schema Mapping",
        format: "Mapping Engine",
        source: "MahaSetu Interoperability Core",
        details: "Identifying source format (JSON) and target destination format (XML). Applying field mapping rules (citizenId → Citizen_ID, annualIncome → Yearly_Income).",
        duration: 900
      },
      {
        stepIndex: 3,
        title: "3. Protocol & Schema Transformation (JSON → XML)",
        format: "Transformation",
        source: "MahaSetu Gateway",
        details: "Transforming JSON payload to standardized Revenue Department XML SOAP/REST schema with cryptographic integrity headers.",
        duration: 800
      },
      {
        stepIndex: 4,
        title: "4. Revenue Department Dispatches XML Data",
        format: "XML",
        source: "Revenue Department Records",
        details: "Citizen tax & revenue database queried. Comprehensive citizen assessment records returned in XML format.",
        payloadType: "xml",
        payload: revenueResponseXml,
        duration: 900
      },
      {
        stepIndex: 5,
        title: "5. MahaSetu Validation & Strict Data Minimization",
        format: "Data Minimization Engine",
        source: "MahaSetu Privacy Filter",
        details: "Applying purpose-bound filtering. Redacting bank accounts, PAN/tax brackets, and property land area. Extracting ONLY verified yearly income.",
        duration: 1000
      },
      {
        stepIndex: 6,
        title: "6. Verified Minimized JSON Delivered to Education Portal",
        format: "JSON (Verified)",
        source: "Education Scholarship Portal",
        details: "Clean, verified JSON payload ingested by the Scholarship system. Verification marked as VERIFIED (₹2,50,000).",
        payloadType: "json",
        payload: educationResponse,
        duration: 700
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      if (onStepProgress) {
        onStepProgress(steps[i], i, steps.length);
      }
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration));
    }

    return {
      status: "SUCCESS",
      verified: true,
      income: 250000,
      currency: "INR",
      requestId: "REQ1001"
    };
  }
};
