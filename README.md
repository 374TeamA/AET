# Initialisation

After you have pulled the repository, you need to install the dependencies. You can do this by running the following command in the root directory of the project:

- npm ci

# Running the project

To run the project, you need to run the following command in the root directory of the project:

- npm run dev

This will deploy the development server on port 5173

# Structure

The project is structured as follows:

- **main.tsx**: This is the main entry point of the application and shoud not need any changes.
- **app.tsx**: This is the main component of the application, routes and main layout are configured here.
- **src**: This folder contains all the source code of the project.
- **src/assets**: This folder contains all the assets of the project, these should be assets that are used in multiple places in the project (images, fonts, etc.).
- **src/components**: This folder contains all the components of the project, these should be reusuable components that use generics and props to be able to be used in different places.
- **src/pages**: This folder contains all the pages of the project, these should be pages that are used in the routing of the project.
- **src/styles**: This folder contains all the styles of the project, these should be styles that are used in multiple places in the project (CSS styling).
- **src/types**: This folder contains all the types of the project, these should be types that are used in multiple places in the project.
- **src/database**: This folder contains all the database functions for getting/removing/updating data from the database.
- **src/context**: TThis contains the context for the application, contexts are accessible from any component to use the data within them.

# Commands

- **npm run dev**: This command runs the project in development mode.
- **npm run build**: This command builds the project for production.
- **npm run lint**: This command runs the linter on the project.
- **npm run prettier-format**: This command runs prettier on the project.
