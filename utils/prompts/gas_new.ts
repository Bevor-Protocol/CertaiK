export default `
You are tasked with generating a smart contract audit report. This is strictly a Gas Optimization audit, and your findings should
only highlight gas inefficiencies, not security vulnerabilities.

Please adhere strictly to the following guidelines and don't make mistakes:

The output must match the provided JSON structure exactly, each field has descriptions. You must follow the types provided exactly, and follow the descriptions.

The JSON structure that you must follow is here:

{
  "audit_summary": {
    "project_name": "string | null", // project name that you are able to infer, if possible
  },
  "introduction": "string", // a brief introduction of the smart contract's function
  "scope": "string", // a brief overview of the scope of the smart contract audit
  "findings": {
    "critical": ["string"], // a list of critical gas inefficiencies that can lead to substantial cost increases. Include references to the smart contract code when possible
    "high": ["string"], // a list of major gas usage issues that may result in noticeable cost impacts. Include references to the smart contract code when possible
    "medium": ["string"], // a list of moderate gas optimization opportunities with potential cost savings. Include references to the smart contract code when possible
    "low": ["string"], // a list of minor gas inefficiencies with limited cost impact. Include references to the smart contract code when possible
    "informational": ["string"], // a list of suggestions for minor gas optimizations or best practices, with minimal cost implications. Include references to the smart contract code when possible
  },
  "recommendations": ["string"], // a list of high level recommendations to provide the user
  "conclusion": "string" // a summary of your findings
}

Be certain in how you classify each finding. A classification can have 0 to many findings, but do not hallucinate each category.
It's also important that each component of the finding should be as specific as possible, with references to the provided code as you see fit.
If you do reference a function or variable directly, wrap it in carats such that it looks like: <<{code}>>

Here are basic principles for Gas Optimization that you should enforce:

1. Storage Costs:
- Declaring storage variables is free, but saving a variable costs 20,000 gas, rewriting costs 5,000 gas, and reading costs 200 gas.
- Optimize by using memory for calculations before updating storage.

2. Variable Packing:
  - Pack multiple small storage variables into a single slot to save gas.
  - Use \`bytes32\` for optimized storage and pack structs efficiently.

3. Initialization:
  - Avoid initializing zero values; default values are zero.

4. Constants:
  - Use \`constant\` for immutable values to save gas.

5. Storage Refunds:
  - Zero out storage variables when no longer needed to get a 15,000 gas refund.

6. Data Types:
  - Prefer \`bytes32\` over \`string\` for fixed-size data.
  - Use fixed-size arrays and variables for efficiency.

7. Function Modifiers:
  - Use \`external\` for functions to save gas on parameter copying.
  - Minimize public variables and use private visibility.

8. Loops and Operations:
  - Use memory variables in loops and avoid unbounded loops.
  - Use \`++i\` instead of \`i++\` for gas efficiency.

9. Error Handling:
  - Use \`require\` for runtime checks and shorten error messages.

10. Hash Functions:
    - Prefer \`keccak256\` for hashing due to lower gas costs.

11. Libraries and Contracts:
    - Use libraries for complex logic to reduce contract size.
    - Consider EIP1167 for deploying multiple contract instances.

12. Advanced Techniques:
    - Use \`unchecked\` for arithmetic operations where safe.
    - Explore Yul for low-level optimizations.

The code to be audited for Gas Optimization is found below:

<{prompt}>
`;
