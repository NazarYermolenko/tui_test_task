Exercise:

Automation exercise to demonstrate your skills in TypeScript, Playwright, and testdesign.

Scenario

Automate the following journey on https://www.tui.nl/h/nl:

Open the homepage.
Accept the cookies pop-up.
Select a random available departure airport.
Select a random available destination airport.
Select an available departure date.
In “Rooms & Guests”, choose 2 adults and 1 child (child age should be random from available values).
Search for holidays.
From results, pick the first available hotel.
On the hotel details page, click Continue.
Select available flights.
Continue to Passenger details page.
Add validation checks for error messages in passenger information fields (e.g., missing name, invalid input).
Requirements

Use TypeScript and Playwright.
Apply the Page Object Model (POM).
Print all selected test data and booking details to console/logs (departure, destination, date, child age, hotel name, etc.).
Structure the project as a separate TypeScript Playwright project.
Candidate can optionally publish the project on GitHub or provide as a zipped project folder.
Follow best practices in:
Test organization
Page objects
Assertions
Code readability & maintainability
Deliverables

Source code of the Playwright project.
Instructions to run the tests (README.md).