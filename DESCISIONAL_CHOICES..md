
1.WHY USE MONGODB INSTEAD OF RELATIONAL DB?

I chose MongoDB because the AI code reviewer deals with highly dynamic and semi-structured data such as AI-generated review outputs, nested comments, repository metadata, and evolving schemas. MongoDB’s document-based model allows flexible storage of JSON-like data without frequent schema migrations.

Since the project is built using the MERN stack, MongoDB also integrates naturally with JavaScript objects across the frontend and backend, which speeds up development.

A relational database like PostgreSQL would be better for highly transactional systems or complex relational analytics, but for rapid development and flexible AI-driven data handling, MongoDB was a better fit for this project.


2.WHY USE GITHUB OAUTH INSTEAD OF EMAIL PASS BASED AUTH?

I used GitHub OAuth because the project is fundamentally a GitHub-integrated developer tool. The application needs access to repositories, pull requests, commits, and code metadata, so GitHub OAuth provides both authentication and authorization in a single flow.

It also improves user experience because developers can sign in instantly without creating separate credentials. Additionally, it reduces backend security complexity since password management, MFA, and account security are handled by GitHub itself.

Compared to traditional email/password authentication, GitHub OAuth aligns better with the project’s architecture and real-world developer workflows.


3. IS JWT NEEDED?

GitHub OAuth and JWT serve different purposes and are commonly used together. GitHub OAuth is used to authenticate the user through GitHub and obtain permission to access GitHub resources such as repositories and pull requests.

After successful OAuth authentication, the backend typically generates its own JWT for application-level session management. The JWT is then used by the frontend to access protected backend APIs without repeatedly relying on GitHub authentication.

In this architecture, the GitHub access token is used for communicating with GitHub APIs, while the JWT is used for maintaining authentication within the application itself.


