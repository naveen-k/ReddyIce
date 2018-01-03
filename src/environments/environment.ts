// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// UAT: http://frozen.reddyice.com/reddyice_dev/iceboxapisqldev
// DEV: http://frozen.reddyice.com/myicebox_dev2/

// apiEndpoint: 'http://frozen.reddyice.com/iceboxapisqldev/',
//  reportEndpoint: 'http://frozen.reddyice.com/iceboxReportSqldev/Reports/ReportData.aspx',
// apiEndpoint: 'http://frozen.reddyice.com/reddyice_dev/',
// reportEndpoint: 'http://frozen.reddyice.com/DashboardReports/Reports/ReportData.aspx',
// apiEndpoint: 'http://frozen.reddyice.com/IceBoxApi_Support/',
// reportEndpoint: 'https://myicebox.reddyice.com/DashBoardReportsProd/Reports/ReportData.aspx',


export const environment = {
  production: false,
  apiEndpoint: 'http://frozen.reddyice.com/axchangeapi/',
  reportEndpoint: 'http://frozen.reddyice.com/DashboardReportsPhase3/Reports/ReportData.aspx',
  prodLabel: '(AX)'
};
