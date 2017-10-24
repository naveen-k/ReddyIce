// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// UAT: http://frozen.reddyice.com/reddyice_dev/
// DEV: http://frozen.reddyice.com/myicebox_dev2/

export const environment = {
  production: false,
  apiEndpoint: 'http://frozen.reddyice.com/myicebox_dev2/',
  reportEndpoint: 'http://frozen.reddyice.com/DashboardReports/Reports/ReportData.aspx',
};
