# Olalekan Ogunsakin Julius — Student Portfolio

A responsive, five-page academic portfolio and student planner built with semantic HTML5, external CSS and vanilla JavaScript.

## Pages
- `index.html` — Home
- `about.html` — Education, career direction, skills and interests
- `projects.html` — Three cybersecurity lab projects
- `planner.html` — Interactive academic task manager
- `contact.html` — Contact form with client-side validation

## Run locally
1. Extract the ZIP file.
2. Open the `olalekan_student_portfolio` folder in Visual Studio Code.
3. Open `index.html` in a browser, or use the VS Code **Live Server** extension and select **Open with Live Server**.
4. Navigate through the site using the top menu.

No build tools or package installation are required. Google Fonts and the sample multimedia clip require an internet connection.

## Planner behaviour
The planner supports adding, editing, completing, deleting, filtering and searching tasks. It calculates task totals and completion percentage. Tasks are stored in the browser's `localStorage` on the current device/browser. Clearing browser data can remove them; they are not synced between devices.

## Contact form behaviour
The contact form checks that every field is filled, validates email format and accepts digits only in the phone field. It displays inline errors and a success status after validation. **It does not send messages or email the site owner.** To receive submissions, connect a backend or a form/email service and configure it securely.

## Project image notes
Images supplied for the portfolio are stored in `assets/`. The Kioptrix project uses the Nessus dashboard screenshot and terminal scan screenshot. The Wazuh/Suricata project uses the uploaded alert dashboard screenshot.

## Before publishing
- Confirm all profile, education and certification details are accurate.
- Add any additional project screenshots or repository links you want to show.
- Consider whether you want your phone number publicly visible (it is currently displayed as requested).
- Test all pages on desktop and mobile.
- For GitHub Pages, create a repository, upload the contents of this folder, then enable Pages from the repository's Settings.
- The GitHub repository URL provided is linked from the contact and Kioptrix project pages.

## Accessibility and security
The site includes semantic landmarks, labels, keyboard-accessible controls, visible focus styles, descriptive image alt text and safe external-link attributes. The planner stores data only in local browser storage. Do not use the contact form for sensitive information.
