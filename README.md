# React App Template

This is a template for a client side React application, compiled with
Webpack into a distribution which includes `index.html` and
`bundle.js`, and which is then be deployed to the MCU Kubernetes
cluster to be statically served by a Nginx web server.

React sources are located in `src`.

Other static files can be placed in `static`, where they will be
included in the distribution.

## Getting started

Clone the template:

```
git clone react-app-template your-project-name
```

Edit `app.yml` to change the `APP_NAME` variable to the name of your project.

(Since the app name will be used as the DNS host name, the application
name can contain only letters, numbers, and dashes. Other characters
such as underlines are not allowed).

Commit your change.

On GitLab (https://gitlab.gwdg.de/mpib/chm/mac), create a new project
without initializing it with any files such as a README. GitLab
should say "The repository for this project is empty".

Click on "Settings" in the left sidebar. Scroll down to "Visibility, project features, permissions" and click "Expand". Scroll down to "Pipelines" and turn it on. Click on "Save Changes".

In the left sidebar, click on "Project overview" to return to the page
which says "The repository for this project is empty". Follow the
last set of instructions "Push an existing Git repository" to push
your repository to GitLab.

In the left sidebar, click on "CI / CD" to view the deployment
pipeline. When complete, open
https://YOUR-PROJECT-NAME.BRANCH.eks-test-default.mpg-chm.com/.
You'll see the sample React app.

## Development

Run `BACKEND_URL=http://127.0.0.1:5000 npm run dev` to run the development server locally, and open the
React app on http://localhost:3000/.

## References

- [Creating a React App… From Scratch.](https://blog.usejournal.com/creating-a-react-app-from-scratch-f3c693b84658)

- [Webpack](https://webpack.js.org/concepts/)

- [React](https://reactjs.org/)
