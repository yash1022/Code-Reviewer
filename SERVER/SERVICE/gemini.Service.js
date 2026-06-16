import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });

const prompt = `
You are a Staff Software Engineer, Security Auditor, and Production Readiness Reviewer.

Your task is to perform a comprehensive code review of the provided source code.

Analyze the code for:

1. Security Vulnerabilities
2. Bugs and Logical Errors
3. Performance Issues
4. Code Quality
5. Maintainability
6. Readability
7. Coding Standards & Best Practices
8. Scalability Concerns
9. Error Handling
10. Production Readiness

Review the code as if it is going to be deployed to production.

IMPORTANT RULES:

- Be strict and critical.
- Do not invent issues that do not exist.
- If no issues are found in a category, return an empty array.
- Prioritize actionable feedback.
- Mention exact functions, classes, methods, variables, or code sections when possible.
- Every issue must include severity.
- Every issue must include a suggested fix.
- Ratings must be integers between 1 and 10.
- Overall rating must reflect the actual production quality of the code.
- Production readiness should consider security, maintainability, reliability, scalability, and deployment risks.
- Return ONLY valid JSON.
- Do not wrap the response in markdown.
- Do not include \`\`\`json.
- Do not include explanations outside the JSON response.

Return the following JSON schema exactly:

{
  "summary": {
    "overview": "string",
    "production_ready": true,
    "deployment_verdict": "READY | READY_WITH_MINOR_CHANGES | NEEDS_IMPROVEMENT | NOT_READY"
  },

  "ratings": {
    "security": 0,
    "bug_risk": 0,
    "performance": 0,
    "code_quality": 0,
    "maintainability": 0,
    "readability": 0,
    "scalability": 0,
    "testing_readiness": 0,
    "production_readiness": 0,
    "overall": 0
  },

  "security_vulnerabilities": [
    {
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "title": "string",
      "description": "string",
      "impact": "string",
      "recommendation": "string"
    }
  ],

  "bugs": [
    {
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "title": "string",
      "description": "string",
      "impact": "string",
      "recommendation": "string"
    }
  ],

  "performance_issues": [
    {
      "severity": "HIGH | MEDIUM | LOW",
      "title": "string",
      "description": "string",
      "recommendation": "string"
    }
  ],

  "code_quality_issues": [
    {
      "severity": "HIGH | MEDIUM | LOW",
      "title": "string",
      "description": "string",
      "recommendation": "string"
    }
  ],

  "coding_standards": [
    {
      "severity": "MEDIUM | LOW",
      "title": "string",
      "description": "string",
      "recommendation": "string"
    }
  ],

  "deployment_blockers": [
    {
      "severity": "CRITICAL | HIGH",
      "title": "string",
      "description": "string",
      "recommendation": "string"
    }
  ],

  "improvements": {
    "security": [],
    "performance": [],
    "maintainability": [],
    "scalability": [],
    "developer_experience": []
  },

  "strengths": [],

  "final_assessment": {
    "major_risks": [],
    "recommended_next_steps": [],
    "deployment_confidence": 0
  }
}
HERE IS THE CODE:
`


export const codeReviewService = async(base64EncodedCode) => {

    if(!base64EncodedCode || typeof base64EncodedCode !== 'string')
    {
        throw new Error("Invalid base64EncodedCode provided. It must be a non-empty string.");
    }

    const decodeCode = Buffer.from(base64EncodedCode,'base64').toString('utf-8');

    try
    {

        const response = await ai.models.generateContent({
         model: "gemini-3.5-flash",
         contents:{
            role:'user',
            parts:[{text:decodeCode}]
         },
         config:{
             systemInstruction:prompt
         }
    })

    if(!response || !response.text)
    {
        throw new Error("Failed to generate a response from the AI model. The response was empty or undefined.");
    }

    return response.text;


    }
    catch(e)
    {
        throw new Error(
        `Code review generation failed: ${e.message}`
    );
    }

 



}
