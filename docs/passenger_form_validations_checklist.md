# Passenger Form Validations Checklist

This document outlines the planned and existing validations for the passenger forms in the TUI Booking flow.

## 1. General Fields (All Passengers)

| Field | Validation Type | Description | Error Message (NL) |
| :--- | :--- | :--- | :--- |
| **First Name** | Required | Field must not be empty. | Vul de voornaam in (volgens paspoort) |
| | Min Length | Minimum 2 characters. | - |
| | Max Length | Maximum 50 characters. | - |
| | Characters | Only letters, hyphens, and spaces. | - |
| **Last Name** | Required | Field must not be empty. | Vul de achternaam in (volgens paspoort) |
| | Min Length | Minimum 2 characters. | - |
| | Max Length | Maximum 50 characters. | - |
| | Characters | Only letters, hyphens, and spaces. | - |
| **Gender** | Required | A title/gender must be selected. | Selecteer een geslacht |
| **Nationality** | Required | Nationality must be selected. | - |
| **Country** | Required | Country of residence must be selected. | - |
| **Date of Birth** | Required | Full date must be provided. | Voer de geboortedatum als volgt in: DD/MM/JJJJ |
| | Format | Must follow DD/MM/YYYY format. | Voer de geboortedatum als volgt in: DD/MM/JJJJ |
| | Valid Date | Must be a calendar-valid date (e.g., no 31/02). | - |
| | Age Logic | Must match the selected passenger type (Adult/Child/Infant). | - |
| | Future Date | Cannot be a date in the future. | - |

## 2. Special Characters Policy

The following fields have specific restrictions regarding special characters to ensure system compatibility and compliance with travel documentation requirements:

| Field | Allowed Characters | Prohibited Characters | Notes |
| :--- | :--- | :--- | :--- |
| **First/Last Name** | A-Z, a-z, spaces, hyphens (-), accents (e.g., é, ö) | Numbers, symbols (!@#$%^&*), brackets, dots | Names should match the passport exactly. |
| **Address/City** | A-Z, a-z, 0-9, spaces, hyphens, dots | Symbols (!@#$%^&*) | - |
| **Phone Number** | 0-9, +, spaces, hyphens | Letters, all symbols except + and - | - |
| **Postcode** | 0-9, A-Z, spaces | All symbols, lowercase letters (for NL) | NL: 1234 AB format. |
| **Email** | A-Z, a-z, 0-9, @, ., _, - | Spaces, most other symbols | Must follow RFC 5322. |

## 3. Lead Passenger Specific Fields (Contact Details)

| Field | Validation Type | Description | Error Message (NL) |
| :--- | :--- | :--- | :--- |
| **Address** | Required | Street name must be provided. | Vul de straatnaam in |
| **House Number** | Required | House number must be provided. | Vul het huisnummer in |
| **Postcode** | Required | Postcode must be provided. | Vul de postcode in |
| | Format | Must follow NL format (1234 AB) if NL is selected. | - |
| **City** | Required | City name must be provided. | Vul de woonplaats in |
| **Phone Number** | Required | Mobile phone number must be provided. | Vul het telefoonnummer in |
| | Digits Only | Only numbers and '+' are allowed. | - |
| | Length | Should be between 10 and 15 digits. | - |
| **Email** | Required | Email address must be provided. | Vul het e-mailadres in |
| | Format | Must be a valid email format (user@domain.com). | - |

## 3. Support Passenger Specific Logic

| Logic | Description |
| :--- | :--- |
| **Same as Lead** | If "Same last name as lead" is checked, the field should be pre-filled/synchronized. |
| **Age Constraints** | Validated against the birth date provided during the search phase. |

## 4. Proposed Test Cases for Validation

1.  **Empty Form Submission**: Verify all required error messages appear when clicking "Continue" with an empty form.
2.  **Invalid Email Format**: Enter "test@com" or "test.com" and verify format error.
3.  **Invalid Date of Birth**: Enter "31/02/1990" and verify date error.
4.  **Future Date of Birth**: Enter tomorrow's date and verify error.
5.  **Age Mismatch**: Enter a DOB that makes an "Adult" into a "Child" and verify if the system flags it.
6.  **Special characters in Names**: Enter numbers or symbols in First/Last name and verify if blocked/flagged.
7.  **Short Phone Number**: Enter "123" as phone number and verify length error.
8.  **Special Characters in Names**: Enter "John123" or "Jane@Doe" and verify that either the field blocks the input or displays an error message.
9.  **Prohibited Symbols in Email**: Enter "test space@domain.com" and verify format error.
